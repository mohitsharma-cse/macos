(function () {
  function installEnhancements() {
    if (!window.os || !window.APP_INDEX || !window.APP_REGISTRY) return false;

    const originalGetRealContent = window.os.getRealContent.bind(window.os);

    window.os.getRealContent = function (appName) {
      if (appName === 'calculator') return renderEnhancedCalculator();
      if (appName === 'appstore') {
        return {
          title: 'App Store',
          html: `<div id="appstore-container" style="display:flex;flex-direction:column;height:100%;background:#101317;color:white;font-family:-apple-system,sans-serif;"></div>`
        };
      }
      return originalGetRealContent(appName);
    };

    installCalculatorLogic();
    installAppStoreLogic();
    return true;
  }

  function renderEnhancedCalculator() {
    const rows = [
      ['AC', '(', ')', 'mc', 'm+'],
      ['7', '8', '9', '÷', '⌫'],
      ['4', '5', '6', '×', '%'],
      ['1', '2', '3', '−', '1/x'],
      ['0', '.', '±', '+', '=']
    ];
    return {
      title: 'Calculator',
      html: `<div style="display:flex;justify-content:center;align-items:center;height:100%;background:radial-gradient(circle at top, rgba(99,102,241,0.16), transparent 35%), linear-gradient(180deg,#15161a,#090a0d);">
        <div style="width:360px;max-width:92%;background:rgba(18,19,23,0.92);border:1px solid rgba(255,255,255,0.08);border-radius:28px;overflow:hidden;box-shadow:0 40px 100px rgba(0,0,0,0.45);">
          <div style="padding:24px 22px 16px;border-bottom:1px solid rgba(255,255,255,0.06);">
            <div id="calc-mode" style="font-size:11px;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:0.18em;">Scientific</div>
            <div id="calc-expr" style="font-size:14px;color:rgba(255,255,255,0.38);height:20px;margin-top:10px;"></div>
            <div id="calc-display" style="font-size:56px;font-weight:200;color:#fff;letter-spacing:-0.06em;line-height:1.05;margin-top:8px;min-height:62px;text-align:right;">0</div>
          </div>
          <div style="padding:14px;display:grid;grid-template-columns:repeat(5,1fr);gap:10px;">
            ${rows.map(row => row.map(key => {
              const op = ['÷', '×', '−', '+', '='].includes(key);
              const util = ['AC', '(', ')', 'mc', 'm+', '⌫', '%', '1/x', '±'].includes(key);
              const bg = op ? 'linear-gradient(180deg,#ffb340,#ff9500)' : util ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)';
              const size = key.length > 2 ? '15px' : '24px';
              return `<button onclick="enhancedCalcInput('${key.replace(/'/g, "\\'")}')" style="min-height:58px;border:none;border-radius:18px;background:${bg};color:white;font-size:${size};font-weight:${op ? 700 : 500};cursor:pointer;transition:transform 80ms ease, filter 80ms ease;" onmousedown="this.style.transform='scale(0.96)';this.style.filter='brightness(1.14)'" onmouseup="this.style.transform='';this.style.filter=''" onmouseleave="this.style.transform='';this.style.filter=''">${key}</button>`;
            }).join('')).join('')}
          </div>
        </div>
      </div>`
    };
  }

  function installCalculatorLogic() {
    const state = {
      value: '0',
      expression: '',
      memory: 0,
      justEvaluated: false
    };

    function update() {
      const display = document.getElementById('calc-display');
      const expr = document.getElementById('calc-expr');
      if (!display || !expr) return;
      display.textContent = state.value;
      expr.textContent = state.expression;
      display.style.fontSize = state.value.length > 10 ? '36px' : state.value.length > 7 ? '46px' : '56px';
    }

    function safeEval(raw) {
      const cleaned = raw.replace(/÷/g, '/').replace(/×/g, '*').replace(/−/g, '-');
      if (!/^[0-9+\-*/().\s]+$/.test(cleaned)) throw new Error('Bad expression');
      // eslint-disable-next-line no-new-func
      return Function(`"use strict"; return (${cleaned})`)();
    }

    window.enhancedCalcInput = function (key) {
      if (key === 'AC') {
        state.value = '0';
        state.expression = '';
        state.justEvaluated = false;
        return update();
      }
      if (key === 'mc') {
        state.memory = 0;
        return;
      }
      if (key === 'm+') {
        state.memory += Number(state.value || 0);
        return;
      }
      if (key === '⌫') {
        state.value = state.justEvaluated ? '0' : (state.value.length > 1 ? state.value.slice(0, -1) : '0');
        state.justEvaluated = false;
        return update();
      }
      if (key === '±') {
        state.value = String(Number(state.value || 0) * -1);
        state.justEvaluated = false;
        return update();
      }
      if (key === '%') {
        state.value = String(Number(state.value || 0) / 100);
        state.justEvaluated = true;
        return update();
      }
      if (key === '1/x') {
        const num = Number(state.value || 0);
        state.value = num === 0 ? 'Error' : String(1 / num);
        state.justEvaluated = true;
        return update();
      }
      if (key === '=') {
        try {
          const expression = `${state.expression}${state.value}`;
          const result = safeEval(expression);
          state.expression = `${expression} =`;
          state.value = Number.isFinite(result) ? String(Number(result.toFixed(10))) : 'Error';
          state.justEvaluated = true;
        } catch {
          state.expression = 'Invalid expression';
          state.value = 'Error';
          state.justEvaluated = true;
        }
        return update();
      }

      if (['+', '−', '×', '÷', '(', ')'].includes(key)) {
        if (state.justEvaluated && key !== '(') {
          state.expression = state.value === 'Error' ? '' : state.value;
        } else {
          state.expression += state.value === '0' && key === '(' ? '' : state.value;
        }
        state.expression += key;
        state.value = '0';
        state.justEvaluated = false;
        return update();
      }

      if (state.justEvaluated || state.value === 'Error') {
        state.value = key === '.' ? '0.' : key;
        state.expression = '';
        state.justEvaluated = false;
        return update();
      }

      if (key === '.') {
        if (!state.value.includes('.')) state.value += '.';
      } else {
        state.value = state.value === '0' ? key : `${state.value}${key}`;
      }
      update();
    };
  }

  function installAppStoreLogic() {
    window.initAppStore = function () {
      window.renderAppStore();
    };

    window.downloadApp = function (id) {
      window.os.launchApp(id);
    };

    window.renderAppStore = function () {
      const container = document.getElementById('appstore-container');
      if (!container) return;
      const apps = window.APP_REGISTRY.filter(app => app.id !== 'appstore');
      const featuredIds = ['browser', 'messages', 'calculator', 'vscode', 'games', 'featurelab', 'xcode', 'previewapp', 'textedit'];
      const featured = featuredIds.map(id => window.APP_INDEX[id]).filter(Boolean);
      const categories = [...new Set(apps.map(app => app.category))];

      container.innerHTML = `
        <div style="display:flex;flex-direction:column;height:100%;overflow:auto;padding:22px;gap:22px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:20px;">
            <div>
              <div style="font-size:34px;font-weight:800;letter-spacing:-0.04em;">App Store</div>
              <div style="font-size:14px;color:rgba(255,255,255,0.55);margin-top:6px;">Browse ${apps.length} desktop apps across the full NebulaOS catalog.</div>
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;">
              <span style="padding:8px 12px;border-radius:999px;background:rgba(255,255,255,0.08);font-size:12px;">${apps.length} apps</span>
              <span style="padding:8px 12px;border-radius:999px;background:rgba(255,255,255,0.08);font-size:12px;">Mac-style desktop</span>
              <span style="padding:8px 12px;border-radius:999px;background:rgba(255,255,255,0.08);font-size:12px;">Games included</span>
            </div>
          </div>

          <div style="background:linear-gradient(135deg,#091120,#1d4ed8 50%,#9333ea);border-radius:26px;padding:26px;display:grid;grid-template-columns:1.2fr 1fr;gap:18px;min-height:220px;">
            <div style="display:flex;flex-direction:column;justify-content:flex-end;">
              <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.16em;color:rgba(255,255,255,0.66);">Featured Collection</div>
              <div style="font-size:38px;font-weight:800;line-height:1.05;margin-top:12px;">NebulaOS Pro Desktop</div>
              <div style="font-size:15px;color:rgba(255,255,255,0.86);margin-top:12px;max-width:520px;">A browser-based macOS-inspired environment with productivity apps, dev tools, media, games, and backend integrations.</div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;align-content:start;">
              ${featured.slice(0, 8).map(app => `
                <button onclick="os.launchApp('${app.id}')" style="background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.16);border-radius:18px;padding:12px;cursor:pointer;color:white;">
                  <div style="width:56px;height:56px;border-radius:16px;background:${app.color};overflow:hidden;margin:0 auto;display:flex;align-items:center;justify-content:center;">
                    <img src="${app.icon}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'; this.parentElement.textContent='${app.emoji}'">
                  </div>
                  <div style="font-size:11px;font-weight:700;margin-top:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${app.name}</div>
                </button>
              `).join('')}
            </div>
          </div>

          <div style="font-size:23px;font-weight:700;">Featured Apps</div>
          <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;">
            ${featured.map(app => `
              <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:16px;display:flex;flex-direction:column;gap:12px;">
                <div style="display:flex;align-items:center;gap:12px;">
                  <div style="width:58px;height:58px;border-radius:18px;background:${app.color};overflow:hidden;display:flex;align-items:center;justify-content:center;">
                    <img src="${app.icon}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'; this.parentElement.textContent='${app.emoji}'">
                  </div>
                  <div>
                    <div style="font-size:15px;font-weight:700;">${app.name}</div>
                    <div style="font-size:12px;color:rgba(255,255,255,0.5);">${app.category}</div>
                  </div>
                </div>
                <div style="font-size:13px;line-height:1.5;color:rgba(255,255,255,0.68);flex:1;">${app.blurb || 'Open the app to explore it.'}</div>
                <button onclick="os.launchApp('${app.id}')" style="background:#0a84ff;border:none;color:white;padding:10px 14px;border-radius:14px;font-weight:700;cursor:pointer;">Open</button>
              </div>
            `).join('')}
          </div>

          ${categories.map(category => `
            <div style="font-size:22px;font-weight:700;margin-top:8px;">${category}</div>
            <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;">
              ${apps.filter(app => app.category === category).map(app => `
                <div style="display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px 16px;border-radius:18px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);">
                  <div style="display:flex;align-items:center;gap:12px;min-width:0;">
                    <div style="width:54px;height:54px;border-radius:16px;background:${app.color};overflow:hidden;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                      <img src="${app.icon}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'; this.parentElement.textContent='${app.emoji}'">
                    </div>
                    <div style="min-width:0;">
                      <div style="font-size:14px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${app.name}</div>
                      <div style="font-size:12px;color:rgba(255,255,255,0.52);line-height:1.45;margin-top:4px;">${app.blurb || 'Open the app to explore it.'}</div>
                    </div>
                  </div>
                  <button onclick="os.launchApp('${app.id}')" style="background:rgba(255,255,255,0.12);border:none;color:white;padding:8px 14px;border-radius:999px;font-weight:700;cursor:pointer;flex-shrink:0;">Open</button>
                </div>
              `).join('')}
            </div>
          `).join('')}
        </div>
      `;
    };
  }

  if (!installEnhancements()) {
    window.addEventListener('load', installEnhancements, { once: true });
  }
})();
