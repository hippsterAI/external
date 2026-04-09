/**
 * pages/houston.js — Houston Targets page renderer.
 * Target sector data lives in HOUSTON_SECTORS in config.js.
 */

window.renderHouston = function() {
  const sectorCards = HOUSTON_SECTORS.map(s => `
    <div class="card" style="margin-bottom:1.25rem;">
      <div class="ct">${s.icon} ${s.title}</div>
      ${s.targets.map(t => `
        <div style="font-size:.85rem;color:var(--dim);padding:.4rem 0;border-bottom:1px solid rgba(30,30,48,.4);">
          → ${t}
        </div>
      `).join('')}
    </div>
  `).join('');

  setContent(`
    ${pageHeader('Houston <span>Targets</span>', '// 25 accounts · 5 sectors · Zero humanoids deployed')}

    ${hbox(`<strong>"I have identified 25 organizations in Houston across hotels, the world's largest medical center, and the energy sector. None of them have a humanoid robot. Give me one robot and I will have a conversation within days."</strong>`, 'gold')}

    <div class="krow" style="margin-bottom:1.5rem;">
      ${kpi('25',    'Target Accounts',           'g')}
      ${kpi('0',     'Current Houston Humanoids',  'r')}
      ${kpi('$3.1B', 'Market Size 2026',           'b')}
      ${kpi('87%',   'Hotels Understaffed 2025',   'gold')}
    </div>

    ${sectorCards}
  `);
};
