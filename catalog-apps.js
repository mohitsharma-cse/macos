function catalogKey(appId, suffix) {
  return `nebula_catalog_${appId}_${suffix}`;
}

function catalogLoad(appId, suffix, fallback) {
  try {
    const raw = localStorage.getItem(catalogKey(appId, suffix));
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function catalogSave(appId, suffix, value) {
  localStorage.setItem(catalogKey(appId, suffix), JSON.stringify(value));
}

function catalogDefaultList(appId) {
  return [
    { id: `${appId}-1`, text: `Set up ${APP_INDEX[appId].name} workspace`, done: false },
    { id: `${appId}-2`, text: 'Review design details', done: false },
    { id: `${appId}-3`, text: 'Ship a more polished version', done: true }
  ];
}

function catalogDefaultBoard(appId) {
  return {
    todo: [`Plan ${APP_INDEX[appId].name}`, 'Collect references', 'Define next milestone'],
    doing: ['Refine desktop interactions'],
    done: ['Launch app shell']
  };
}

function catalogDefaultSheet(appId) {
  return [
    ['Item', 'Owner', 'Status', 'Value'],
    [`${APP_INDEX[appId].name} v1`, 'Desktop', 'Active', '42'],
    ['Animation polish', 'UI', 'Queued', '18'],
    ['App content pass', 'System', 'Done', '95']
  ];
}

function catalogDefaultGallery(appId) {
  const genericImages = [
    { title: 'Nebula Wallpaper', image: 'assets/nebula_wallpaper.png' },
    { title: 'Desktop Wallpaper', image: 'assets/wallpaperflare_23.jpg' },
    { title: 'Finder Icon Study', image: 'assets/icon_finder_1773993313081.png' },
    { title: 'Terminal Icon Study', image: 'assets/icon_terminal_1773993332580.png' }
  ];
  if (['wallpapers', 'previewapp', 'quicklook', 'screenshotstudio', 'photoboothplus'].includes(appId)) return genericImages;
  if (appId === 'books') {
    return [
      { title: 'Designing Interfaces', subtitle: 'UI Systems' },
      { title: 'Refactoring UI', subtitle: 'Visual polish' },
      { title: 'Clean Code', subtitle: 'Developer habits' },
      { title: 'Designing Data-Intensive Applications', subtitle: 'Architecture' }
    ];
  }
  if (appId === 'fontbook') {
    return [
      { title: 'SF Pro', subtitle: 'System Sans' },
      { title: 'Fira Code', subtitle: 'Monospace' },
      { title: 'New York', subtitle: 'Editorial Serif' },
      { title: 'JetBrains Mono', subtitle: 'Developer Mono' }
    ];
  }
  return genericImages;
}

function catalogDashboardData(appId) {
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const common = {
    stats: [
      { label: 'Live Panels', value: '12' },
      { label: 'Updated', value: now },
      { label: 'Focus', value: 'High' }
    ],
    feed: [
      'Desktop shell synchronized with launcher',
      'Widget data refreshed successfully',
      'Visual consistency pass applied'
    ]
  };
  const overrides = {
    stocks: {
      stats: [{ label: 'NASDAQ', value: '+1.24%' }, { label: 'AAPL', value: '+0.86%' }, { label: 'NVDA', value: '+2.11%' }],
      feed: ['Watchlist opened at market close', 'Portfolio heatmap is mostly green', 'Momentum remains positive']
    },
    news: {
      stats: [{ label: 'Top Stories', value: '08' }, { label: 'Tech', value: '12' }, { label: 'Saved', value: '04' }],
      feed: ['Mac-inspired web UIs continue trending', 'Browser desktops gaining polish', 'Generative tools improve mock workflows']
    },
    systeminfo: {
      stats: [{ label: 'Platform', value: navigator.platform || 'Web' }, { label: 'Language', value: navigator.language || 'en-US' }, { label: 'Cores', value: navigator.hardwareConcurrency || 'n/a' }],
      feed: ['Browser information loaded', 'Locale preferences detected', 'Viewport metrics available for layout tuning']
    }
  };
  return overrides[appId] || common;
}

window.getCatalogAppContent = function(app) {
  if (!app || !app.template) return null;

  if (app.template === 'editor') {
    const content = catalogLoad(app.id, 'text', `# ${app.name}\n\n${app.blurb || 'Start writing here.'}`);
    return {
      title: app.name,
      html: `<div style="display:flex;height:100%;background:#17181c;color:white;font-family:-apple-system,sans-serif;">
        <div style="width:190px;border-right:0.5px solid rgba(255,255,255,0.08);padding:18px 14px;background:rgba(255,255,255,0.03);">
          <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:rgba(255,255,255,0.45);margin-bottom:16px;">Workspace</div>
          <div style="font-size:20px;font-weight:600;line-height:1.15;">${app.name}</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.55);margin-top:10px;line-height:1.5;">${app.blurb || 'Autosaved editor.'}</div>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;">
          <div style="padding:14px 18px;border-bottom:0.5px solid rgba(255,255,255,0.08);display:flex;justify-content:space-between;align-items:center;">
            <div style="font-size:13px;color:rgba(255,255,255,0.55);">Autosaving locally</div>
            <div id="catalog-editor-status-${app.id}" style="font-size:12px;color:#34d399;">Saved</div>
          </div>
          <textarea id="catalog-editor-${app.id}" oninput="catalogEditorUpdate('${app.id}', this.value)" spellcheck="false" style="flex:1;background:transparent;border:none;resize:none;outline:none;color:white;padding:20px 22px;font:15px/1.7 'SF Mono','Fira Code',monospace;">${content.replace(/</g, '&lt;')}</textarea>
        </div>
      </div>`
    };
  }

  if (app.template === 'list') {
    return {
      title: app.name,
      html: `<div style="display:flex;flex-direction:column;height:100%;background:#18181b;color:white;font-family:-apple-system,sans-serif;">
        <div style="padding:18px 20px;border-bottom:0.5px solid rgba(255,255,255,0.08);display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:24px;font-weight:700;">${app.name}</div>
            <div style="font-size:13px;color:rgba(255,255,255,0.55);margin-top:4px;">${app.blurb || 'A simple planning list.'}</div>
          </div>
          <button onclick="catalogListAdd('${app.id}')" style="background:#0a84ff;border:none;color:white;padding:9px 14px;border-radius:999px;cursor:pointer;font-weight:600;">Add Item</button>
        </div>
        <div id="catalog-list-${app.id}" style="flex:1;overflow:auto;padding:18px 20px;"></div>
      </div>`
    };
  }

  if (app.template === 'board') {
    const board = catalogLoad(app.id, 'board', catalogDefaultBoard(app.id));
    const cols = [['todo', 'To Do'], ['doing', 'Doing'], ['done', 'Done']];
    return {
      title: app.name,
      html: `<div style="display:flex;flex-direction:column;height:100%;background:#111827;color:white;font-family:-apple-system,sans-serif;">
        <div style="padding:16px 18px;border-bottom:0.5px solid rgba(255,255,255,0.08);">
          <div style="font-size:24px;font-weight:700;">${app.name}</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.55);margin-top:4px;">${app.blurb || 'Plan and move work across columns.'}</div>
        </div>
        <div style="flex:1;display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:18px;overflow:auto;">
          ${cols.map(([key, label]) => `<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:18px;padding:14px;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;"><div style="font-size:14px;font-weight:600;">${label}</div><button onclick="catalogBoardAdd('${app.id}','${key}')" style="background:none;border:none;color:#60a5fa;cursor:pointer;font-size:18px;">+</button></div><div>${(board[key] || []).map(item => `<div style="padding:12px;border-radius:14px;background:rgba(255,255,255,0.06);font-size:13px;line-height:1.45;margin-bottom:10px;">${item}</div>`).join('')}</div></div>`).join('')}
        </div>
      </div>`
    };
  }

  if (app.template === 'sheet') {
    const rows = catalogLoad(app.id, 'rows', catalogDefaultSheet(app.id));
    return {
      title: app.name,
      html: `<div style="display:flex;flex-direction:column;height:100%;background:#f8fafc;color:#0f172a;font-family:-apple-system,sans-serif;"><div style="padding:14px 18px;border-bottom:1px solid rgba(15,23,42,0.08);display:flex;justify-content:space-between;align-items:center;background:white;"><div><div style="font-size:22px;font-weight:700;">${app.name}</div><div style="font-size:12px;color:#64748b;margin-top:4px;">${app.blurb || 'Editable local spreadsheet.'}</div></div><button onclick="catalogSheetAddRow('${app.id}')" style="background:#10b981;border:none;color:white;padding:8px 14px;border-radius:999px;cursor:pointer;font-weight:600;">Add Row</button></div><div style="flex:1;overflow:auto;padding:18px;"><table id="catalog-sheet-${app.id}" style="width:100%;border-collapse:collapse;background:white;border-radius:16px;overflow:hidden;box-shadow:0 18px 40px rgba(15,23,42,0.08);">${rows.map((row, rowIndex) => `<tr>${row.map(cell => `<td contenteditable="true" oninput="catalogSheetPersist('${app.id}')" style="border:1px solid #e2e8f0;padding:12px 14px;font-size:13px;font-weight:${rowIndex===0?'700':'400'};background:${rowIndex===0?'#eff6ff':'white'};">${cell}</td>`).join('')}</tr>`).join('')}</table></div></div>`
    };
  }

  if (app.template === 'gallery') {
    const items = catalogDefaultGallery(app.id);
    return {
      title: app.name,
      html: `<div style="display:flex;flex-direction:column;height:100%;background:#101114;color:white;font-family:-apple-system,sans-serif;"><div style="padding:18px 20px;border-bottom:0.5px solid rgba(255,255,255,0.08);"><div style="font-size:24px;font-weight:700;">${app.name}</div><div style="font-size:13px;color:rgba(255,255,255,0.55);margin-top:4px;">${app.blurb || 'A visual gallery of references and media.'}</div></div><div style="flex:1;overflow:auto;padding:20px;display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px;">${items.map(item => `<div style="border-radius:18px;overflow:hidden;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);min-height:160px;">${item.image ? `<img src="${item.image}" style="width:100%;height:128px;object-fit:cover;">` : `<div style="height:128px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg, rgba(59,130,246,0.35), rgba(168,85,247,0.35));font-size:42px;">${app.emoji || '✨'}</div>`}<div style="padding:12px 14px;"><div style="font-size:14px;font-weight:600;">${item.title}</div>${item.subtitle ? `<div style="font-size:12px;color:rgba(255,255,255,0.55);margin-top:4px;">${item.subtitle}</div>` : ''}</div></div>`).join('')}</div></div>`
    };
  }

  if (app.template === 'dashboard') {
    const data = catalogDashboardData(app.id);
    return {
      title: app.name,
      html: `<div style="display:flex;flex-direction:column;height:100%;background:linear-gradient(180deg,#0f172a,#111827);color:white;font-family:-apple-system,sans-serif;"><div style="padding:18px 20px;border-bottom:0.5px solid rgba(255,255,255,0.08);"><div style="font-size:26px;font-weight:700;">${app.name}</div><div style="font-size:13px;color:rgba(255,255,255,0.55);margin-top:4px;">${app.blurb || 'System dashboard.'}</div></div><div style="padding:20px;display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">${data.stats.map(card => `<div style="padding:18px;border-radius:18px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);"><div style="font-size:12px;color:rgba(255,255,255,0.55);text-transform:uppercase;letter-spacing:0.08em;">${card.label}</div><div style="font-size:28px;font-weight:700;margin-top:8px;">${card.value}</div></div>`).join('')}</div><div style="padding:0 20px 20px;display:grid;grid-template-columns:1.5fr 1fr;gap:16px;flex:1;min-height:0;"><div style="border-radius:20px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);padding:18px;overflow:auto;"><div style="font-size:15px;font-weight:600;margin-bottom:14px;">Recent activity</div>${data.feed.map(item => `<div style="padding:12px 0;border-bottom:0.5px solid rgba(255,255,255,0.08);font-size:13px;color:rgba(255,255,255,0.8);">${item}</div>`).join('')}</div><div style="border-radius:20px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);padding:18px;"><div style="font-size:15px;font-weight:600;margin-bottom:14px;">Quick actions</div><div style="display:grid;gap:10px;"><button onclick="alert('${app.name}: quick action completed.')" style="background:rgba(255,255,255,0.08);border:none;color:white;padding:12px 14px;border-radius:14px;cursor:pointer;text-align:left;">Run sync</button><button onclick="alert('${app.name}: snapshot saved.')" style="background:rgba(255,255,255,0.08);border:none;color:white;padding:12px 14px;border-radius:14px;cursor:pointer;text-align:left;">Create snapshot</button><button onclick="alert('${app.name}: panel refreshed.')" style="background:rgba(255,255,255,0.08);border:none;color:white;padding:12px 14px;border-radius:14px;cursor:pointer;text-align:left;">Refresh data</button></div></div></div></div>`
    };
  }

  if (app.template === 'palette') {
    return {
      title: app.name,
      html: `<div style="display:flex;flex-direction:column;height:100%;background:#0f172a;color:white;font-family:-apple-system,sans-serif;"><div style="padding:18px 20px;border-bottom:0.5px solid rgba(255,255,255,0.08);"><div style="font-size:24px;font-weight:700;">${app.name}</div><div style="font-size:13px;color:rgba(255,255,255,0.55);margin-top:4px;">${app.blurb || 'Build color palettes and copy values.'}</div></div><div style="padding:20px;display:grid;grid-template-columns:1.1fr 1fr;gap:20px;flex:1;"><div style="border-radius:20px;background:rgba(255,255,255,0.05);padding:18px;border:1px solid rgba(255,255,255,0.08);"><input type="color" id="catalog-color-${app.id}" value="#8b5cf6" oninput="catalogPaletteUpdate('${app.id}', this.value)" style="width:100%;height:120px;border:none;background:transparent;"><div id="catalog-color-value-${app.id}" style="margin-top:16px;font-size:32px;font-weight:700;">#8B5CF6</div><button onclick="navigator.clipboard && navigator.clipboard.writeText(document.getElementById('catalog-color-value-${app.id}').innerText)" style="margin-top:12px;background:#0a84ff;border:none;color:white;padding:10px 14px;border-radius:12px;cursor:pointer;">Copy HEX</button></div><div id="catalog-palette-swatches-${app.id}" style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">${['#8B5CF6','#0EA5E9','#111827','#F59E0B'].map(color => `<div style="border-radius:18px;background:${color};min-height:120px;display:flex;align-items:flex-end;padding:14px;font-weight:700;">${color}</div>`).join('')}</div></div></div>`
    };
  }

  if (app.template === 'converter') {
    return {
      title: app.name,
      html: `<div style="display:flex;flex-direction:column;height:100%;background:#0f172a;color:white;font-family:-apple-system,sans-serif;padding:22px;gap:16px;"><div style="font-size:28px;font-weight:700;">${app.name}</div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;"><select id="catalog-conv-type" onchange="catalogConvertRender()" style="padding:12px;border-radius:12px;background:rgba(255,255,255,0.08);border:none;color:white;"><option value="length">Length</option><option value="weight">Weight</option><option value="temp">Temperature</option></select><input id="catalog-conv-value" type="number" value="1" oninput="catalogConvertRender()" style="padding:12px;border-radius:12px;background:rgba(255,255,255,0.08);border:none;color:white;"><select id="catalog-conv-unit" onchange="catalogConvertRender()" style="padding:12px;border-radius:12px;background:rgba(255,255,255,0.08);border:none;color:white;"></select></div><div id="catalog-conv-results" style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;flex:1;"></div></div>`
    };
  }

  if (app.template === 'json') {
    return {
      title: app.name,
      html: `<div style="display:flex;height:100%;background:#0b1020;color:white;font-family:'SF Mono','Fira Code',monospace;"><textarea id="catalog-json-input" style="flex:1;background:#0f172a;color:#dbeafe;border:none;outline:none;padding:20px;resize:none;">{"app":"NebulaOS","quality":"high","apps":101}</textarea><div style="width:360px;border-left:1px solid rgba(255,255,255,0.08);display:flex;flex-direction:column;"><div style="padding:16px;display:flex;gap:10px;"><button onclick="catalogFormatJson()" style="background:#0a84ff;border:none;color:white;padding:10px 14px;border-radius:12px;cursor:pointer;">Format</button><button onclick="catalogMinifyJson()" style="background:rgba(255,255,255,0.08);border:none;color:white;padding:10px 14px;border-radius:12px;cursor:pointer;">Minify</button></div><pre id="catalog-json-output" style="flex:1;margin:0;padding:18px;white-space:pre-wrap;overflow:auto;color:#93c5fd;"></pre></div></div>`
    };
  }

  if (app.template === 'regex') {
    return {
      title: app.name,
      html: `<div style="display:flex;flex-direction:column;height:100%;background:#0b1120;color:white;font-family:'SF Mono','Fira Code',monospace;padding:20px;gap:14px;"><input id="catalog-regex-pattern" value="Nebula\\w+" oninput="catalogRegexRun()" style="padding:12px 14px;border-radius:12px;background:rgba(255,255,255,0.08);border:none;color:white;" placeholder="Pattern"><textarea id="catalog-regex-text" oninput="catalogRegexRun()" style="flex:1;padding:14px;border-radius:14px;background:rgba(255,255,255,0.06);border:none;color:white;resize:none;">NebulaOS ships polished windows.\nNebulaStudio powers the catalog renderer.\nmacOS-inspired layouts feel more believable.</textarea><div id="catalog-regex-output" style="padding:16px;border-radius:14px;background:rgba(255,255,255,0.06);min-height:96px;"></div></div>`
    };
  }

  if (app.template === 'vault') {
    const vault = catalogLoad(app.id, 'vault', [
      { label: 'Admin Login', username: 'admin@example.com', password: 'N3bula!2026' },
      { label: 'Design Vault', username: 'designer@example.com', password: 'M4cStyle#Ui' }
    ]);
    return {
      title: app.name,
      html: `<div style="display:flex;flex-direction:column;height:100%;background:#0f172a;color:white;font-family:-apple-system,sans-serif;"><div style="padding:18px 20px;border-bottom:0.5px solid rgba(255,255,255,0.08);display:flex;justify-content:space-between;align-items:center;"><div><div style="font-size:24px;font-weight:700;">${app.name}</div><div style="font-size:13px;color:rgba(255,255,255,0.55);margin-top:4px;">${app.blurb || 'Demo credential vault.'}</div></div><button onclick="catalogVaultAdd('${app.id}')" style="background:#10b981;border:none;color:white;padding:9px 14px;border-radius:999px;cursor:pointer;">New Entry</button></div><div id="catalog-vault-${app.id}" style="padding:20px;display:grid;gap:12px;overflow:auto;">${vault.map(item => `<div style="padding:16px;border-radius:18px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);"><div style="font-size:15px;font-weight:600;">${item.label}</div><div style="font-size:13px;color:rgba(255,255,255,0.6);margin-top:6px;">${item.username}</div><div style="font-family:'SF Mono','Fira Code',monospace;font-size:12px;margin-top:8px;color:#93c5fd;">${item.password}</div></div>`).join('')}</div></div>`
    };
  }

  if (app.template === 'dictionary') {
    return {
      title: app.name,
      html: `<div style="display:flex;flex-direction:column;height:100%;background:#13151a;color:white;font-family:-apple-system,sans-serif;"><div style="padding:18px 20px;border-bottom:0.5px solid rgba(255,255,255,0.08);"><div style="font-size:24px;font-weight:700;">${app.name}</div><input id="catalog-dictionary-query" oninput="catalogDictionaryRun()" placeholder="Search term" style="margin-top:14px;width:100%;padding:12px 14px;border-radius:12px;border:none;background:rgba(255,255,255,0.08);color:white;"></div><div id="catalog-dictionary-output" style="padding:20px;overflow:auto;line-height:1.7;"></div></div>`
    };
  }

  if (app.template === 'tictactoe') {
    return {
      title: app.name,
      html: `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;background:linear-gradient(180deg,#0f172a,#1d4ed8);color:white;font-family:-apple-system,sans-serif;gap:18px;"><div style="font-size:30px;font-weight:700;">${app.name}</div><div id="catalog-ttt-status" style="font-size:14px;color:rgba(255,255,255,0.7);">Current turn: X</div><div id="catalog-ttt-grid" style="display:grid;grid-template-columns:repeat(3,90px);gap:10px;">${Array.from({ length: 9 }, (_, i) => `<button onclick="catalogTttMove(${i})" style="width:90px;height:90px;border:none;border-radius:24px;background:rgba(255,255,255,0.12);color:white;font-size:34px;font-weight:700;cursor:pointer;"></button>`).join('')}</div><button onclick="catalogTttReset()" style="background:white;color:#1d4ed8;border:none;padding:10px 16px;border-radius:999px;cursor:pointer;font-weight:700;">Reset</button></div>`
    };
  }

  if (app.template === 'memory') {
    return {
      title: app.name,
      html: `<div style="display:flex;flex-direction:column;height:100%;background:#111827;color:white;font-family:-apple-system,sans-serif;padding:20px;gap:14px;"><div style="display:flex;justify-content:space-between;align-items:center;"><div><div style="font-size:28px;font-weight:700;">${app.name}</div><div id="catalog-memory-status" style="font-size:13px;color:rgba(255,255,255,0.55);margin-top:4px;">Flip two cards to match them.</div></div><button onclick="catalogMemoryReset()" style="background:#0a84ff;border:none;color:white;padding:10px 14px;border-radius:999px;cursor:pointer;">Restart</button></div><div id="catalog-memory-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;flex:1;"></div></div>`
    };
  }

  return null;
};

window.catalogEditorUpdate = function(appId, value) {
  catalogSave(appId, 'text', value);
  const status = document.getElementById(`catalog-editor-status-${appId}`);
  if (status) {
    status.textContent = 'Saved';
    status.style.color = '#34d399';
  }
};

window.catalogListRender = function(appId) {
  const host = document.getElementById(`catalog-list-${appId}`);
  if (!host) return;
  const items = catalogLoad(appId, 'items', catalogDefaultList(appId));
  host.innerHTML = items.map(item => `<div style="display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:0.5px solid rgba(255,255,255,0.08);"><input type="checkbox" ${item.done ? 'checked' : ''} onchange="catalogListToggle('${appId}','${item.id}')" style="width:18px;height:18px;"><div style="flex:1;font-size:14px;opacity:${item.done ? '0.55' : '1'};text-decoration:${item.done ? 'line-through' : 'none'};">${item.text}</div><button onclick="catalogListRemove('${appId}','${item.id}')" style="background:none;border:none;color:#f87171;cursor:pointer;">Delete</button></div>`).join('');
};

window.catalogListAdd = function(appId) {
  const text = prompt('Add a new item');
  if (!text) return;
  const items = catalogLoad(appId, 'items', catalogDefaultList(appId));
  items.unshift({ id: `${appId}-${Date.now()}`, text, done: false });
  catalogSave(appId, 'items', items);
  catalogListRender(appId);
};

window.catalogListToggle = function(appId, itemId) {
  const items = catalogLoad(appId, 'items', catalogDefaultList(appId)).map(item => item.id === itemId ? { ...item, done: !item.done } : item);
  catalogSave(appId, 'items', items);
  catalogListRender(appId);
};

window.catalogListRemove = function(appId, itemId) {
  const items = catalogLoad(appId, 'items', catalogDefaultList(appId)).filter(item => item.id !== itemId);
  catalogSave(appId, 'items', items);
  catalogListRender(appId);
};

window.catalogBoardAdd = function(appId, column) {
  const text = prompt(`Add a card to ${column}`);
  if (!text) return;
  const board = catalogLoad(appId, 'board', catalogDefaultBoard(appId));
  board[column].push(text);
  catalogSave(appId, 'board', board);
  os.closeWin(appId);
  setTimeout(() => os.launchApp(appId), 140);
};

window.catalogSheetAddRow = function(appId) {
  const rows = catalogLoad(appId, 'rows', catalogDefaultSheet(appId));
  rows.push(['New item', 'Owner', 'Draft', '0']);
  catalogSave(appId, 'rows', rows);
  os.closeWin(appId);
  setTimeout(() => os.launchApp(appId), 140);
};

window.catalogSheetPersist = function(appId) {
  const table = document.getElementById(`catalog-sheet-${appId}`);
  if (!table) return;
  const rows = [...table.querySelectorAll('tr')].map(tr => [...tr.querySelectorAll('td')].map(td => td.innerText.trim()));
  catalogSave(appId, 'rows', rows);
};

window.catalogPaletteUpdate = function(appId, value) {
  const upper = value.toUpperCase();
  const label = document.getElementById(`catalog-color-value-${appId}`);
  const swatches = document.getElementById(`catalog-palette-swatches-${appId}`);
  if (label) label.textContent = upper;
  if (swatches) {
    const shades = [upper, '#111827', '#F8FAFC', '#0EA5E9'];
    swatches.innerHTML = shades.map(color => `<div style="border-radius:18px;background:${color};min-height:120px;display:flex;align-items:flex-end;padding:14px;font-weight:700;color:${color==='#F8FAFC'?'#111827':'white'};">${color}</div>`).join('');
  }
};

window.catalogConvertRender = function() {
  const typeEl = document.getElementById('catalog-conv-type');
  const valueEl = document.getElementById('catalog-conv-value');
  const unitEl = document.getElementById('catalog-conv-unit');
  const host = document.getElementById('catalog-conv-results');
  if (!typeEl || !valueEl || !unitEl || !host) return;
  const maps = {
    length: { units: ['m', 'ft', 'km'], calc: (v) => ({ m: v, ft: v * 3.28084, km: v / 1000 }) },
    weight: { units: ['kg', 'lb', 'g'], calc: (v) => ({ kg: v, lb: v * 2.20462, g: v * 1000 }) },
    temp: { units: ['C', 'F', 'K'], calc: (v, unit) => {
      const c = unit === 'F' ? (v - 32) * 5 / 9 : unit === 'K' ? v - 273.15 : v;
      return { C: c, F: c * 9 / 5 + 32, K: c + 273.15 };
    }}
  };
  const spec = maps[typeEl.value];
  if (unitEl.options.length !== spec.units.length) unitEl.innerHTML = spec.units.map(unit => `<option value="${unit}">${unit}</option>`).join('');
  const value = Number(valueEl.value || 0);
  const unit = unitEl.value || spec.units[0];
  let base = value;
  if (typeEl.value === 'length') {
    if (unit === 'ft') base = value / 3.28084;
    if (unit === 'km') base = value * 1000;
  } else if (typeEl.value === 'weight') {
    if (unit === 'lb') base = value / 2.20462;
    if (unit === 'g') base = value / 1000;
  }
  const results = typeEl.value === 'temp' ? spec.calc(value, unit) : spec.calc(base);
  host.innerHTML = Object.entries(results).map(([label, out]) => `<div style="padding:18px;border-radius:18px;background:rgba(255,255,255,0.08);"><div style="font-size:12px;color:rgba(255,255,255,0.55);">${label}</div><div style="font-size:28px;font-weight:700;margin-top:10px;">${Number(out).toFixed(2)}</div></div>`).join('');
};

window.catalogFormatJson = function() {
  const input = document.getElementById('catalog-json-input');
  const output = document.getElementById('catalog-json-output');
  if (!input || !output) return;
  try {
    output.textContent = JSON.stringify(JSON.parse(input.value), null, 2);
  } catch (err) {
    output.textContent = 'Invalid JSON: ' + err.message;
  }
};

window.catalogMinifyJson = function() {
  const input = document.getElementById('catalog-json-input');
  const output = document.getElementById('catalog-json-output');
  if (!input || !output) return;
  try {
    output.textContent = JSON.stringify(JSON.parse(input.value));
  } catch (err) {
    output.textContent = 'Invalid JSON: ' + err.message;
  }
};

window.catalogRegexRun = function() {
  const pattern = document.getElementById('catalog-regex-pattern')?.value || '';
  const text = document.getElementById('catalog-regex-text')?.value || '';
  const output = document.getElementById('catalog-regex-output');
  if (!output) return;
  try {
    const regex = new RegExp(pattern, 'g');
    const matches = [...text.matchAll(regex)].map(match => match[0]);
    output.innerHTML = matches.length ? `<div style="font-size:12px;color:rgba(255,255,255,0.55);margin-bottom:8px;">${matches.length} matches</div>${matches.map(m => `<div style="padding:8px 10px;border-radius:10px;background:rgba(59,130,246,0.18);margin-bottom:8px;">${m}</div>`).join('')}` : '<div style="color:rgba(255,255,255,0.55);">No matches found.</div>';
  } catch (err) {
    output.textContent = 'Regex error: ' + err.message;
  }
};

window.catalogVaultAdd = function(appId) {
  const label = prompt('Entry label');
  if (!label) return;
  const username = prompt('Username or email') || 'user@example.com';
  const password = Math.random().toString(36).slice(2, 6) + '!' + Math.random().toString(36).slice(2, 7);
  const vault = catalogLoad(appId, 'vault', []);
  vault.unshift({ label, username, password });
  catalogSave(appId, 'vault', vault);
  os.closeWin(appId);
  setTimeout(() => os.launchApp(appId), 140);
};

window.catalogDictionaryRun = function() {
  const terms = { glassmorphism: 'A UI style that uses translucent surfaces, blur, and layered depth.', dock: 'A persistent app launcher anchored to the bottom of the desktop.', missioncontrol: 'A bird’s-eye view of open windows and desktops.', launcher: 'A searchable grid of installed applications.', refactor: 'Restructuring code to improve design without changing behavior.', latency: 'The time delay between a request and its response.' };
  const query = (document.getElementById('catalog-dictionary-query')?.value || '').toLowerCase().replace(/\s+/g, '');
  const host = document.getElementById('catalog-dictionary-output');
  if (!host) return;
  const entries = Object.entries(terms).filter(([key, value]) => !query || key.includes(query) || value.toLowerCase().includes(query));
  host.innerHTML = entries.map(([word, meaning]) => `<div style="padding:16px 0;border-bottom:0.5px solid rgba(255,255,255,0.08);"><div style="font-size:18px;font-weight:700;text-transform:capitalize;">${word}</div><div style="font-size:14px;color:rgba(255,255,255,0.72);margin-top:6px;">${meaning}</div></div>`).join('') || '<div style="color:rgba(255,255,255,0.55);">No matching term found.</div>';
};

let tttBoard = Array(9).fill('');
let tttPlayer = 'X';
window.catalogTttMove = function(index) {
  if (tttBoard[index]) return;
  const cells = document.querySelectorAll('#catalog-ttt-grid button');
  tttBoard[index] = tttPlayer;
  if (cells[index]) cells[index].textContent = tttPlayer;
  const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const winner = wins.find(line => line.every(i => tttBoard[i] && tttBoard[i] === tttBoard[line[0]]));
  const status = document.getElementById('catalog-ttt-status');
  if (winner) {
    if (status) status.textContent = `Winner: ${tttPlayer}`;
    return;
  }
  if (tttBoard.every(Boolean)) {
    if (status) status.textContent = 'Draw game';
    return;
  }
  tttPlayer = tttPlayer === 'X' ? 'O' : 'X';
  if (status) status.textContent = `Current turn: ${tttPlayer}`;
};

window.catalogTttReset = function() {
  tttBoard = Array(9).fill('');
  tttPlayer = 'X';
  document.querySelectorAll('#catalog-ttt-grid button').forEach(btn => btn.textContent = '');
  const status = document.getElementById('catalog-ttt-status');
  if (status) status.textContent = 'Current turn: X';
};

let memoryCards = [];
let memoryOpen = [];
function renderMemoryCards() {
  const host = document.getElementById('catalog-memory-grid');
  if (!host) return;
  host.innerHTML = memoryCards.map((card, index) => `<button onclick="catalogMemoryFlip(${index})" style="border:none;border-radius:18px;background:${card.matched || memoryOpen.includes(index) ? 'rgba(59,130,246,0.18)' : 'rgba(255,255,255,0.08)'};color:white;font-size:28px;cursor:pointer;min-height:88px;">${card.matched || memoryOpen.includes(index) ? card.symbol : '•'}</button>`).join('');
}

window.catalogMemoryReset = function() {
  const symbols = ['🍎','🍋','🍇','🍒','🍓','🥝','🍍','🍉'];
  memoryCards = [...symbols, ...symbols].sort(() => Math.random() - 0.5).map(symbol => ({ symbol, matched: false }));
  memoryOpen = [];
  const status = document.getElementById('catalog-memory-status');
  if (status) status.textContent = 'Flip two cards to match them.';
  renderMemoryCards();
};

window.catalogMemoryFlip = function(index) {
  if (memoryOpen.includes(index) || memoryCards[index]?.matched || memoryOpen.length === 2) return;
  memoryOpen.push(index);
  renderMemoryCards();
  if (memoryOpen.length === 2) {
    const [a, b] = memoryOpen;
    const status = document.getElementById('catalog-memory-status');
    if (memoryCards[a].symbol === memoryCards[b].symbol) {
      memoryCards[a].matched = true;
      memoryCards[b].matched = true;
      memoryOpen = [];
      if (status) status.textContent = 'Match found.';
      renderMemoryCards();
    } else {
      if (status) status.textContent = 'Not a match. Try again.';
      setTimeout(() => {
        memoryOpen = [];
        renderMemoryCards();
      }, 700);
    }
  }
};

window.initCatalogApp = function(appId) {
  const app = APP_INDEX[appId];
  if (!app) return;
  if (app.template === 'list') window.catalogListRender(appId);
  if (app.template === 'converter') window.catalogConvertRender();
  if (app.template === 'json') window.catalogFormatJson();
  if (app.template === 'regex') window.catalogRegexRun();
  if (app.template === 'dictionary') window.catalogDictionaryRun();
  if (app.template === 'tictactoe') window.catalogTttReset();
  if (app.template === 'memory') window.catalogMemoryReset();
};
