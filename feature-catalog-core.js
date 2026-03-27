(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.FeatureCatalogCore = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const CATEGORIES = [
    { name: 'System', summary: 'core desktop shell and operating system feel' },
    { name: 'Finder', summary: 'file browsing, previews, folders, and recents' },
    { name: 'Safari', summary: 'browser, tabs, reading, and internet workflows' },
    { name: 'Communication', summary: 'mail, chat, calls, and social presence' },
    { name: 'Productivity', summary: 'notes, tasks, calendars, and documents' },
    { name: 'Developer', summary: 'coding, debugging, automation, and tooling' },
    { name: 'Creative', summary: 'design, audio, video, and visual craft tools' },
    { name: 'Media', summary: 'music, photos, galleries, libraries, and playback' },
    { name: 'Gaming', summary: 'game center, scores, challenges, and arcade flows' },
    { name: 'Backend', summary: 'APIs, data services, deployment, and integrations' }
  ];

  const SURFACES = [
    { name: 'Dock', summary: 'launching, recents, running indicators, and quick actions' },
    { name: 'Menu Bar', summary: 'status menus, active app actions, and system controls' },
    { name: 'Windows', summary: 'open, close, resize, snap, focus, and layering' },
    { name: 'Launchpad', summary: 'app browsing, folders, categories, and search' },
    { name: 'Spotlight', summary: 'global search, commands, and jump actions' },
    { name: 'Widgets', summary: 'dashboard panels, glanceable stats, and quick tools' },
    { name: 'Notifications', summary: 'alerts, inboxes, banners, and live updates' },
    { name: 'Settings', summary: 'preferences, personalization, and system toggles' },
    { name: 'Files', summary: 'documents, folders, metadata, preview, and export flow' },
    { name: 'Search', summary: 'cross-app discovery, indexing, ranking, and filtering' }
  ];

  const CAPABILITIES = [
    { name: 'AI Copilot', summary: 'context-aware help, generation, and smart guidance' },
    { name: 'Realtime Sync', summary: 'live state sharing between windows, users, and sessions' },
    { name: 'Smart Automation', summary: 'rules, workflows, recurring actions, and triggers' },
    { name: 'Offline Mode', summary: 'usable cached experiences without active internet' },
    { name: 'Collaboration', summary: 'sharing, comments, presence, and co-editing' },
    { name: 'Theme Engine', summary: 'wallpapers, accent colors, transparency, and motion' },
    { name: 'Analytics Hub', summary: 'usage metrics, dashboards, trends, and insight views' },
    { name: 'Security Layer', summary: 'roles, sessions, access control, and safety checks' },
    { name: 'Template Library', summary: 'starter layouts, kits, presets, and reusable bundles' },
    { name: 'Accessibility Boost', summary: 'keyboard, screen reader, visual, and focus support' }
  ];

  const LAYERS = [
    { name: 'Frontend', summary: 'client-side UI, rendering, and interactions' },
    { name: 'Backend', summary: 'server orchestration and business logic' },
    { name: 'API', summary: 'endpoint design and integration contracts' },
    { name: 'Database', summary: 'persistence, queries, schemas, and indexing' },
    { name: 'Realtime', summary: 'live updates, events, and streaming sessions' },
    { name: 'Storage', summary: 'uploads, exports, blobs, caching, and file handling' },
    { name: 'Automation', summary: 'jobs, schedulers, triggers, and worker flows' },
    { name: 'AI', summary: 'prompts, assistants, summarization, and review features' },
    { name: 'Testing', summary: 'checks, regression coverage, and diagnostics' },
    { name: 'Hosting', summary: 'deployment, environments, scaling, and operations' }
  ];

  const STATUS_SEQUENCE = [
    'Idea',
    'Research',
    'Planned',
    'Prototype',
    'Frontend Ready',
    'Backend Ready',
    'Integration',
    'QA',
    'Polish',
    'Ready for Hosting'
  ];

  const IMPACT_SEQUENCE = ['Low', 'Medium', 'High', 'Epic'];
  const EFFORT_SEQUENCE = ['S', 'M', 'L', 'XL'];

  const HIGH_PRIORITY_SURFACES = new Set(['Dock', 'Menu Bar', 'Windows', 'Spotlight', 'Files']);
  const HIGH_PRIORITY_CAPABILITIES = new Set(['Realtime Sync', 'Security Layer', 'Offline Mode', 'Theme Engine']);
  const BACKEND_FOCUSED_LAYERS = new Set(['Backend', 'API', 'Database', 'Realtime', 'Storage', 'Automation', 'AI', 'Testing', 'Hosting']);
  const FRONTEND_FOCUSED_LAYERS = new Set(['Frontend', 'Realtime', 'Storage', 'AI', 'Testing']);

  let catalogCache = null;
  let featureIndexCache = null;

  function slugify(value) {
    return String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function clampNumber(value, fallback, min, max) {
    const numeric = Number.parseInt(value, 10);
    if (!Number.isFinite(numeric)) return fallback;
    return Math.min(Math.max(numeric, min), max);
  }

  function summarizeByField(items, field) {
    const buckets = new Map();
    items.forEach(item => {
      const key = item[field];
      buckets.set(key, (buckets.get(key) || 0) + 1);
    });
    return [...buckets.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }

  function textIncludes(haystack, needle) {
    return haystack.toLowerCase().includes(needle.toLowerCase());
  }

  function normalizeBooleanQuery(value) {
    if (value === undefined || value === null || value === '') return null;
    if (value === true || value === 'true' || value === '1' || value === 1) return true;
    if (value === false || value === 'false' || value === '0' || value === 0) return false;
    return null;
  }

  function buildFeature(category, surface, capability, layer, serial, indexes) {
    const [categoryIndex, surfaceIndex, capabilityIndex, layerIndex] = indexes;
    const id = `feat-${String(serial).padStart(5, '0')}`;
    const slug = [
      slugify(category.name),
      slugify(surface.name),
      slugify(capability.name),
      slugify(layer.name)
    ].join('--');
    const title = `${category.name} ${surface.name} ${capability.name}`;
    const status = STATUS_SEQUENCE[(categoryIndex + surfaceIndex + capabilityIndex + layerIndex) % STATUS_SEQUENCE.length];

    const priorityScore =
      (HIGH_PRIORITY_SURFACES.has(surface.name) ? 2 : 0) +
      (HIGH_PRIORITY_CAPABILITIES.has(capability.name) ? 2 : 0) +
      (BACKEND_FOCUSED_LAYERS.has(layer.name) ? 1 : 0) +
      (category.name === 'System' || category.name === 'Backend' ? 1 : 0);

    const priority =
      priorityScore >= 5 ? 'Critical' :
      priorityScore >= 3 ? 'High' :
      priorityScore >= 2 ? 'Medium' :
      'Low';

    const impact = IMPACT_SEQUENCE[(priorityScore + surfaceIndex + capabilityIndex) % IMPACT_SEQUENCE.length];
    const effort = EFFORT_SEQUENCE[(capabilityIndex + layerIndex) % EFFORT_SEQUENCE.length];
    const backendRequired = BACKEND_FOCUSED_LAYERS.has(layer.name) || ['AI Copilot', 'Realtime Sync', 'Analytics Hub', 'Security Layer', 'Collaboration'].includes(capability.name);
    const frontendRequired = FRONTEND_FOCUSED_LAYERS.has(layer.name) || surface.name !== 'Search';
    const searchTerms = [
      id,
      slug,
      title,
      category.name,
      surface.name,
      capability.name,
      layer.name,
      status,
      priority,
      impact,
      effort,
      category.summary,
      surface.summary,
      capability.summary,
      layer.summary
    ].join(' | ');

    return {
      id,
      slug,
      title,
      category: category.name,
      surface: surface.name,
      capability: capability.name,
      layer: layer.name,
      status,
      priority,
      impact,
      effort,
      backendRequired,
      frontendRequired,
      description: `Add ${capability.summary} to the ${surface.name.toLowerCase()} layer of ${category.summary}, implemented through the ${layer.name.toLowerCase()} layer so the browser desktop feels closer to a real macOS experience.`,
      implementationNote: `This idea touches ${surface.summary} inside ${category.summary}. The main delivery focus is ${layer.summary}.`,
      tags: [
        category.name,
        surface.name,
        capability.name,
        layer.name,
        status,
        priority,
        impact,
        effort
      ],
      searchTerms
    };
  }

  function getFeatureCatalog() {
    if (catalogCache) return catalogCache;

    const catalog = [];
    let serial = 1;

    CATEGORIES.forEach((category, categoryIndex) => {
      SURFACES.forEach((surface, surfaceIndex) => {
        CAPABILITIES.forEach((capability, capabilityIndex) => {
          LAYERS.forEach((layer, layerIndex) => {
            catalog.push(buildFeature(category, surface, capability, layer, serial, [
              categoryIndex,
              surfaceIndex,
              capabilityIndex,
              layerIndex
            ]));
            serial += 1;
          });
        });
      });
    });

    catalogCache = catalog;
    featureIndexCache = new Map(catalog.map(item => [item.id, item]));
    return catalogCache;
  }

  function getFeatureById(id) {
    getFeatureCatalog();
    return featureIndexCache.get(String(id)) || null;
  }

  function getFeatureStats() {
    const items = getFeatureCatalog();
    return {
      totalFeatures: items.length,
      backendRequired: items.filter(item => item.backendRequired).length,
      frontendRequired: items.filter(item => item.frontendRequired).length,
      readyForHosting: items.filter(item => item.status === 'Ready for Hosting').length,
      criticalPriority: items.filter(item => item.priority === 'Critical').length,
      categories: summarizeByField(items, 'category'),
      surfaces: summarizeByField(items, 'surface'),
      capabilities: summarizeByField(items, 'capability'),
      layers: summarizeByField(items, 'layer'),
      statuses: summarizeByField(items, 'status'),
      priorities: summarizeByField(items, 'priority'),
      efforts: summarizeByField(items, 'effort')
    };
  }

  function queryFeatureCatalog(options) {
    const query = options || {};
    const search = String(query.search || '').trim().toLowerCase();
    const category = String(query.category || '').trim();
    const surface = String(query.surface || '').trim();
    const capability = String(query.capability || '').trim();
    const layer = String(query.layer || '').trim();
    const status = String(query.status || '').trim();
    const priority = String(query.priority || '').trim();
    const backendRequired = normalizeBooleanQuery(query.backendRequired);
    const frontendRequired = normalizeBooleanQuery(query.frontendRequired);
    const page = clampNumber(query.page, 1, 1, 100000);
    const limit = clampNumber(query.limit, 24, 1, 200);

    let items = getFeatureCatalog().filter(item => {
      if (search && !textIncludes(item.searchTerms, search)) return false;
      if (category && item.category !== category) return false;
      if (surface && item.surface !== surface) return false;
      if (capability && item.capability !== capability) return false;
      if (layer && item.layer !== layer) return false;
      if (status && item.status !== status) return false;
      if (priority && item.priority !== priority) return false;
      if (backendRequired !== null && item.backendRequired !== backendRequired) return false;
      if (frontendRequired !== null && item.frontendRequired !== frontendRequired) return false;
      return true;
    });

    const total = items.length;
    const pages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, pages);
    const start = (safePage - 1) * limit;
    items = items.slice(start, start + limit);

    return {
      total,
      page: safePage,
      limit,
      pages,
      items,
      filters: {
        categories: CATEGORIES.map(item => item.name),
        surfaces: SURFACES.map(item => item.name),
        capabilities: CAPABILITIES.map(item => item.name),
        layers: LAYERS.map(item => item.name),
        statuses: STATUS_SEQUENCE.slice()
      }
    };
  }

  return {
    meta: {
      categories: CATEGORIES,
      surfaces: SURFACES,
      capabilities: CAPABILITIES,
      layers: LAYERS,
      statuses: STATUS_SEQUENCE.slice()
    },
    getFeatureCatalog,
    getFeatureById,
    getFeatureStats,
    queryFeatureCatalog
  };
});
