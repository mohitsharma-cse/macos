(function () {
  const FEATURE_APP = {
    id: 'featurelab',
    name: 'Feature Lab',
    emoji: 'Ideas',
    icon: 'https://img.icons8.com/fluency/256/idea.png',
    category: 'Developer',
    color: '#6366f1',
    blurb: 'Browse, search, and plan 10,000 possible upgrades for the macOS-style desktop.'
  };

  const FAVORITES_KEY = 'nebula-feature-lab-favorites';
  const state = {
    search: '',
    category: '',
    capability: '',
    layer: '',
    status: '',
    page: 1,
    limit: 24,
    total: 0,
    pages: 1,
    items: [],
    stats: null,
    selectedId: null,
    favoritesOnly: false,
    source: 'browser',
    loading: false,
    favorites: loadFavorites()
  };

  function loadFavorites() {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
      return new Set();
    }
  }

  function saveFavorites() {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...state.favorites]));
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getCore() {
    return window.FeatureCatalogCore;
  }

  function getApiBase() {
    if (typeof window.getNebulaApiBase === 'function') {
      return window.getNebulaApiBase();
    }
    if (window.NEBULA_RUNTIME?.apiBase) return window.NEBULA_RUNTIME.apiBase;
    const configured = (window.NEBULA_API_BASE || localStorage.getItem('nebula-api-base') || '').trim();
    if (configured) return configured;
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000'
      : '';
  }

  async function requestJson(path) {
    const base = getApiBase();
    if (!base) throw new Error('No backend configured');
    const response = await fetch(base + path);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  function registerFeatureApp() {
    if (!window.APP_REGISTRY || !window.APP_INDEX || !window.LP_APPS) return false;
    if (!window.APP_INDEX[FEATURE_APP.id]) {
      window.APP_REGISTRY.unshift(FEATURE_APP);
      window.APP_INDEX[FEATURE_APP.id] = FEATURE_APP;
      window.LP_APPS.unshift({ name: FEATURE_APP.name, icon: FEATURE_APP.icon, app: FEATURE_APP.id });
    }
    return true;
  }

  function renderShell() {
    return '<div id="feature-lab-root" style="height:100%;background:linear-gradient(180deg,#0b1020,#0f172a 50%,#111827);color:white;font-family:-apple-system,BlinkMacSystemFont,sans-serif;"></div>';
  }

  function getFilteredLocalData() {
    const core = getCore();
    const search = state.search.trim().toLowerCase();
    const all = core.getFeatureCatalog().filter(item => {
      if (search && !item.searchTerms.toLowerCase().includes(search)) return false;
      if (state.category && item.category !== state.category) return false;
      if (state.capability && item.capability !== state.capability) return false;
      if (state.layer && item.layer !== state.layer) return false;
      if (state.status && item.status !== state.status) return false;
      if (state.favoritesOnly && !state.favorites.has(item.id)) return false;
      return true;
    });

    const total = all.length;
    const pages = Math.max(1, Math.ceil(total / state.limit));
    const page = Math.min(state.page, pages);
    const start = (page - 1) * state.limit;

    return {
      items: all.slice(start, start + state.limit),
      total,
      pages,
      page
    };
  }

  async function loadStats() {
    try {
      state.stats = await requestJson('/api/features/stats');
      state.source = 'backend';
    } catch {
      state.stats = getCore().getFeatureStats();
      state.source = 'browser';
    }
  }

  async function loadItems() {
    if (state.favoritesOnly || state.source === 'browser') {
      const data = getFilteredLocalData();
      state.items = data.items;
      state.total = data.total;
      state.pages = data.pages;
      state.page = data.page;
      return;
    }

    try {
      const params = new URLSearchParams();
      if (state.search) params.set('search', state.search);
      if (state.category) params.set('category', state.category);
      if (state.capability) params.set('capability', state.capability);
      if (state.layer) params.set('layer', state.layer);
      if (state.status) params.set('status', state.status);
      params.set('page', String(state.page));
      params.set('limit', String(state.limit));
      const data = await requestJson(`/api/features?${params.toString()}`);
      state.items = data.items || [];
      state.total = data.total || 0;
      state.pages = data.pages || 1;
      state.page = data.page || 1;
      state.source = 'backend';
    } catch {
      state.source = 'browser';
      const data = getFilteredLocalData();
      state.items = data.items;
      state.total = data.total;
      state.pages = data.pages;
      state.page = data.page;
    }
  }

  function getSelectedItem() {
    const current = state.items.find(item => item.id === state.selectedId);
    if (current) return current;
    if (state.selectedId) {
      return getCore().getFeatureById(state.selectedId);
    }
    return state.items[0] || null;
  }

  function renderStatCard(label, value, accent) {
    return `
      <div style="padding:16px 18px;border-radius:18px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);">
        <div style="font-size:12px;color:rgba(255,255,255,0.58);text-transform:uppercase;letter-spacing:0.14em;">${label}</div>
        <div style="font-size:30px;font-weight:800;letter-spacing:-0.04em;margin-top:10px;color:${accent};">${value}</div>
      </div>
    `;
  }

  function renderSelectOptions(values, selectedValue) {
    return ['<option value="">All</option>']
      .concat(values.map(value => `<option value="${escapeHtml(value)}"${value === selectedValue ? ' selected' : ''}>${escapeHtml(value)}</option>`))
      .join('');
  }

  function renderFeatureLab() {
    const root = document.getElementById('feature-lab-root');
    if (!root) return;

    const core = getCore();
    const selected = getSelectedItem();
    const favoriteCount = state.favorites.size;
    const topCategories = (state.stats?.categories || []).slice(0, 4)
      .map(item => `<span style="padding:6px 10px;border-radius:999px;background:rgba(99,102,241,0.16);border:1px solid rgba(129,140,248,0.24);font-size:12px;">${escapeHtml(item.name)} ${item.count}</span>`)
      .join('');

    root.innerHTML = `
      <div style="display:flex;flex-direction:column;height:100%;overflow:auto;padding:22px;gap:18px;">
        <div style="display:flex;justify-content:space-between;gap:20px;align-items:flex-end;flex-wrap:wrap;">
          <div>
            <div style="font-size:36px;font-weight:800;letter-spacing:-0.05em;">Feature Lab</div>
            <div style="font-size:14px;color:rgba(255,255,255,0.62);margin-top:8px;max-width:760px;">A searchable roadmap of 10,000 ideas we can keep adding to this browser-based macOS desktop. It works with the backend API when available and falls back to the in-browser generator when it is not.</div>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
            <span style="padding:8px 12px;border-radius:999px;background:${state.source === 'backend' ? 'rgba(16,185,129,0.14)' : 'rgba(245,158,11,0.14)'};border:1px solid ${state.source === 'backend' ? 'rgba(16,185,129,0.26)' : 'rgba(245,158,11,0.26)'};font-size:12px;">${state.source === 'backend' ? 'Backend catalog live' : 'Browser fallback mode'}</span>
            <span style="padding:8px 12px;border-radius:999px;background:rgba(255,255,255,0.08);font-size:12px;">Favorites ${favoriteCount}</span>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;">
          ${renderStatCard('Total Ideas', (state.stats?.totalFeatures || 10000).toLocaleString(), '#a5b4fc')}
          ${renderStatCard('Backend Hooks', (state.stats?.backendRequired || 0).toLocaleString(), '#34d399')}
          ${renderStatCard('Frontend Hooks', (state.stats?.frontendRequired || 0).toLocaleString(), '#fbbf24')}
          ${renderStatCard('Hosting Ready', (state.stats?.readyForHosting || 0).toLocaleString(), '#f472b6')}
        </div>

        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
          ${topCategories}
        </div>

        <div style="display:grid;grid-template-columns:2.1fr 1fr 1fr 1fr 1fr auto;gap:12px;align-items:center;">
          <input type="text" value="${escapeHtml(state.search)}" placeholder="Search titles, ids, layers, categories, or capabilities" oninput="featureLabUpdateSearch(this.value)" style="width:100%;padding:14px 16px;border-radius:16px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.06);color:white;outline:none;">
          <select onchange="featureLabSetCategory(this.value)" style="padding:14px 12px;border-radius:16px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.06);color:white;outline:none;">${renderSelectOptions(core.meta.categories.map(item => item.name), state.category)}</select>
          <select onchange="featureLabSetCapability(this.value)" style="padding:14px 12px;border-radius:16px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.06);color:white;outline:none;">${renderSelectOptions(core.meta.capabilities.map(item => item.name), state.capability)}</select>
          <select onchange="featureLabSetLayer(this.value)" style="padding:14px 12px;border-radius:16px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.06);color:white;outline:none;">${renderSelectOptions(core.meta.layers.map(item => item.name), state.layer)}</select>
          <select onchange="featureLabSetStatus(this.value)" style="padding:14px 12px;border-radius:16px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.06);color:white;outline:none;">${renderSelectOptions(core.meta.statuses, state.status)}</select>
          <button onclick="featureLabToggleFavoritesOnly()" style="padding:14px 16px;border:none;border-radius:16px;background:${state.favoritesOnly ? 'linear-gradient(180deg,#f59e0b,#ea580c)' : 'rgba(255,255,255,0.08)'};color:white;font-weight:700;cursor:pointer;">${state.favoritesOnly ? 'Showing favorites' : 'Favorites only'}</button>
        </div>

        <div style="display:grid;grid-template-columns:1.25fr 0.95fr;gap:18px;min-height:0;flex:1;">
          <div style="min-height:0;display:flex;flex-direction:column;border-radius:24px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.04);overflow:hidden;">
            <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 18px;border-bottom:1px solid rgba(255,255,255,0.08);">
              <div>
                <div style="font-size:18px;font-weight:700;">Catalog Results</div>
                <div style="font-size:12px;color:rgba(255,255,255,0.56);margin-top:4px;">${state.total.toLocaleString()} matching ideas across page ${state.page} of ${state.pages}</div>
              </div>
              <div style="display:flex;gap:8px;">
                <button onclick="featureLabChangePage(-1)" ${state.page <= 1 ? 'disabled' : ''} style="padding:10px 14px;border:none;border-radius:12px;background:rgba(255,255,255,0.08);color:white;cursor:${state.page <= 1 ? 'not-allowed' : 'pointer'};opacity:${state.page <= 1 ? '0.45' : '1'};">Prev</button>
                <button onclick="featureLabChangePage(1)" ${state.page >= state.pages ? 'disabled' : ''} style="padding:10px 14px;border:none;border-radius:12px;background:rgba(255,255,255,0.08);color:white;cursor:${state.page >= state.pages ? 'not-allowed' : 'pointer'};opacity:${state.page >= state.pages ? '0.45' : '1'};">Next</button>
              </div>
            </div>
            <div style="overflow:auto;padding:14px;display:flex;flex-direction:column;gap:12px;">
              ${state.loading ? '<div style="padding:24px;text-align:center;color:rgba(255,255,255,0.6);">Loading ideas...</div>' : ''}
              ${!state.loading && state.items.length === 0 ? '<div style="padding:24px;text-align:center;color:rgba(255,255,255,0.6);">No matching features yet. Try a broader search.</div>' : ''}
              ${state.items.map(item => `
                <div onclick="featureLabSelect('${item.id}')" style="padding:16px;border-radius:18px;border:1px solid ${state.selectedId === item.id ? 'rgba(129,140,248,0.55)' : 'rgba(255,255,255,0.08)'};background:${state.selectedId === item.id ? 'rgba(99,102,241,0.14)' : 'rgba(255,255,255,0.03)'};cursor:pointer;">
                  <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
                    <div style="min-width:0;">
                      <div style="font-size:15px;font-weight:700;line-height:1.35;">${escapeHtml(item.title)}</div>
                      <div style="font-size:11px;color:rgba(255,255,255,0.45);margin-top:5px;">${escapeHtml(item.id)} • ${escapeHtml(item.layer)} • ${escapeHtml(item.status)}</div>
                    </div>
                    <button onclick="event.stopPropagation(); featureLabToggleFavorite('${item.id}')" style="border:none;background:${state.favorites.has(item.id) ? 'rgba(245,158,11,0.18)' : 'rgba(255,255,255,0.08)'};color:${state.favorites.has(item.id) ? '#fbbf24' : 'white'};border-radius:12px;padding:8px 10px;cursor:pointer;">${state.favorites.has(item.id) ? 'Saved' : 'Save'}</button>
                  </div>
                  <div style="font-size:13px;line-height:1.55;color:rgba(255,255,255,0.7);margin-top:10px;">${escapeHtml(item.description)}</div>
                  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">
                    <span style="padding:5px 8px;border-radius:999px;background:rgba(59,130,246,0.16);font-size:11px;">${escapeHtml(item.category)}</span>
                    <span style="padding:5px 8px;border-radius:999px;background:rgba(16,185,129,0.16);font-size:11px;">${escapeHtml(item.capability)}</span>
                    <span style="padding:5px 8px;border-radius:999px;background:rgba(244,114,182,0.16);font-size:11px;">${escapeHtml(item.priority)}</span>
                    <span style="padding:5px 8px;border-radius:999px;background:rgba(234,179,8,0.16);font-size:11px;">${escapeHtml(item.effort)}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div style="min-height:0;display:flex;flex-direction:column;border-radius:24px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.04);overflow:hidden;">
            <div style="padding:18px;border-bottom:1px solid rgba(255,255,255,0.08);">
              <div style="font-size:18px;font-weight:700;">Selected Idea</div>
              <div style="font-size:12px;color:rgba(255,255,255,0.55);margin-top:4px;">Detailed breakdown for the currently selected feature.</div>
            </div>
            <div style="padding:18px;overflow:auto;display:flex;flex-direction:column;gap:14px;">
              ${selected ? `
                <div style="font-size:26px;font-weight:800;letter-spacing:-0.04em;line-height:1.08;">${escapeHtml(selected.title)}</div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                  <span style="padding:6px 10px;border-radius:999px;background:rgba(99,102,241,0.16);font-size:12px;">${escapeHtml(selected.id)}</span>
                  <span style="padding:6px 10px;border-radius:999px;background:rgba(255,255,255,0.08);font-size:12px;">${escapeHtml(selected.status)}</span>
                  <span style="padding:6px 10px;border-radius:999px;background:rgba(255,255,255,0.08);font-size:12px;">${escapeHtml(selected.layer)}</span>
                  <span style="padding:6px 10px;border-radius:999px;background:rgba(255,255,255,0.08);font-size:12px;">${escapeHtml(selected.priority)}</span>
                </div>
                <div style="font-size:14px;line-height:1.65;color:rgba(255,255,255,0.78);">${escapeHtml(selected.description)}</div>
                <div style="padding:14px 16px;border-radius:18px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);">
                  <div style="font-size:12px;color:rgba(255,255,255,0.52);text-transform:uppercase;letter-spacing:0.12em;">Implementation Note</div>
                  <div style="font-size:14px;line-height:1.55;color:rgba(255,255,255,0.82);margin-top:8px;">${escapeHtml(selected.implementationNote)}</div>
                </div>
                <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;">
                  <div style="padding:14px;border-radius:18px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);">
                    <div style="font-size:12px;color:rgba(255,255,255,0.52);text-transform:uppercase;letter-spacing:0.12em;">Frontend</div>
                    <div style="font-size:20px;font-weight:800;margin-top:8px;color:${selected.frontendRequired ? '#fbbf24' : '#94a3b8'};">${selected.frontendRequired ? 'Required' : 'Optional'}</div>
                  </div>
                  <div style="padding:14px;border-radius:18px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);">
                    <div style="font-size:12px;color:rgba(255,255,255,0.52);text-transform:uppercase;letter-spacing:0.12em;">Backend</div>
                    <div style="font-size:20px;font-weight:800;margin-top:8px;color:${selected.backendRequired ? '#34d399' : '#94a3b8'};">${selected.backendRequired ? 'Required' : 'Optional'}</div>
                  </div>
                </div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                  ${selected.tags.map(tag => `<span style="padding:7px 10px;border-radius:999px;background:rgba(255,255,255,0.08);font-size:12px;">${escapeHtml(tag)}</span>`).join('')}
                </div>
              ` : '<div style="color:rgba(255,255,255,0.6);">Select an idea to inspect it here.</div>'}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async function refreshFeatureLab() {
    const root = document.getElementById('feature-lab-root');
    if (!root || !getCore()) return;
    state.loading = true;
    renderFeatureLab();
    await loadStats();
    await loadItems();
    if (!state.selectedId || !getCore().getFeatureById(state.selectedId)) {
      state.selectedId = state.items[0]?.id || null;
    }
    if (!state.items.some(item => item.id === state.selectedId)) {
      state.selectedId = state.items[0]?.id || state.selectedId;
    }
    state.loading = false;
    renderFeatureLab();
  }

  function installFeatureLab() {
    if (!window.os || !window.APP_REGISTRY || !window.APP_INDEX || !window.LP_APPS || !window.FeatureCatalogCore) return false;
    registerFeatureApp();

    if (!window.os.__featureLabInstalled) {
      const originalGetRealContent = window.os.getRealContent.bind(window.os);
      window.os.getRealContent = function (appName) {
        if (appName === FEATURE_APP.id) {
          return { title: FEATURE_APP.name, html: renderShell() };
        }
        return originalGetRealContent(appName);
      };
      window.os.__featureLabInstalled = true;
    }

    window.initFeatureLab = function () {
      refreshFeatureLab();
    };

    window.featureLabUpdateSearch = function (value) {
      state.search = String(value || '');
      state.page = 1;
      refreshFeatureLab();
    };

    window.featureLabSetCategory = function (value) {
      state.category = String(value || '');
      state.page = 1;
      refreshFeatureLab();
    };

    window.featureLabSetCapability = function (value) {
      state.capability = String(value || '');
      state.page = 1;
      refreshFeatureLab();
    };

    window.featureLabSetLayer = function (value) {
      state.layer = String(value || '');
      state.page = 1;
      refreshFeatureLab();
    };

    window.featureLabSetStatus = function (value) {
      state.status = String(value || '');
      state.page = 1;
      refreshFeatureLab();
    };

    window.featureLabToggleFavoritesOnly = function () {
      state.favoritesOnly = !state.favoritesOnly;
      state.page = 1;
      refreshFeatureLab();
    };

    window.featureLabChangePage = function (direction) {
      const nextPage = state.page + Number(direction || 0);
      if (nextPage < 1 || nextPage > state.pages) return;
      state.page = nextPage;
      refreshFeatureLab();
    };

    window.featureLabSelect = function (id) {
      state.selectedId = id;
      renderFeatureLab();
    };

    window.featureLabToggleFavorite = function (id) {
      if (state.favorites.has(id)) state.favorites.delete(id);
      else state.favorites.add(id);
      saveFavorites();
      if (state.favoritesOnly) {
        refreshFeatureLab();
        return;
      }
      renderFeatureLab();
    };

    return true;
  }

  if (!installFeatureLab()) {
    window.addEventListener('load', installFeatureLab, { once: true });
  }
})();
