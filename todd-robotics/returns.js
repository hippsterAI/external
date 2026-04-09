/**
 * pages/returns.js — Interactive returns calculator page.
 *
 * Uses DEFAULTS from config.js and chart builders from charts.js.
 * window.updateReturns() is called by slider oninput events.
 */

window.renderReturns = function() {
  const D = window.DEFAULTS;

  setContent(`
    ${pageHeader('Your <span>Returns</span>', '// $8K each in · 50/50 split · 4 scenarios')}

    ${hbox(`<strong>Simple structure:</strong> Peter $8K + Todd $8K = $16K buys the Unitree G1. All revenue 50/50 after operating costs. No complicated terms. Equal partners.`, 'gold')}

    <div class="g2" style="margin-bottom:1.25rem;">
      ${card(`
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
          ${_slider('rB', 'lB', 'Monthly Bookings',    1,  20,   1,  D.bookings,  '')}
          ${_slider('rR', 'lR', 'Avg Rev/Booking',   500,4000, 100, D.avgRev,   '$')}
          ${_slider('rO', 'lO', 'Monthly Ops Cost',  200,2000, 100, D.opsCost,  '$')}
          ${_slider('rF', 'lF', 'Fleet Growth/Year',   0,   4,   1,  D.fleetGrow, '+')}
        </div>
      `, 'Adjust Assumptions')}

      ${card(`<table class="tbl" id="rT"></table>`, 'Return Summary — Each Partner', 'gold')}
    </div>

    <div class="krow" id="rK"></div>

    <div class="chart-wrap">
      <div class="ct">Monthly Revenue + Each Partner Cumulative (36 months)</div>
      <canvas id="rc" height="260"></canvas>
    </div>

    ${card(`
      <canvas id="sc" height="220" style="margin-bottom:1.5rem;"></canvas>
      <table class="tbl">
        <thead>
          <tr>
            <th>Scenario</th><th>Bookings</th><th>Avg Rev</th>
            <th>Break-Even</th><th>Year 1</th><th>Year 2</th><th>Year 3</th>
          </tr>
        </thead>
        <tbody id="sT"></tbody>
      </table>
    `, '4 Scenarios — Each Partner Cumulative Return')}
  `);

  // Initial render
  window.updateReturns();
  window.renderScenarios();
};

/**
 * Build a labeled range slider.
 * @param {string} id      - input element id (e.g. 'rB')
 * @param {string} labelId - span element id for the live value (e.g. 'lB')
 * @param {string} label   - human-readable label text
 * @param {number} min/max/step/val - range parameters
 * @param {string} prefix  - '$' | '+' | '' for display formatting
 */
function _slider(id, labelId, label, min, max, step, val, prefix) {
  const display = _formatVal(val, prefix);
  return `
    <div>
      <label style="font-family:var(--fm);font-size:.6rem;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;display:block;margin-bottom:4px;">
        ${label}: <span id="${labelId}" style="color:var(--accent)">${display}</span>
      </label>
      <input type="range" min="${min}" max="${max}" step="${step}" value="${val}" id="${id}"
             oninput="updateReturns()" style="width:100%;accent-color:var(--accent)">
    </div>
  `;
}

/** Format a slider value for display */
function _formatVal(val, prefix) {
  if (prefix === '$') return '$' + Number(val).toLocaleString();
  if (prefix === '+') return '+' + val;
  return String(val);
}

/** Read slider value and update its display label */
function _readSlider(inputId, labelId, prefix) {
  const el = document.getElementById(inputId);
  if (!el) return 0;
  const val = +el.value;
  const lbl = document.getElementById(labelId);
  if (lbl) lbl.textContent = _formatVal(val, prefix);
  return val;
}

/**
 * Re-calculate and re-render the returns summary + chart.
 * Called on slider input and on initial render.
 */
window.updateReturns = function() {
  const b = _readSlider('rB', 'lB', '');
  const r = _readSlider('rR', 'lR', '$');
  const o = _readSlider('rO', 'lO', '$');
  const f = _readSlider('rF', 'lF', '+');

  const { rows, breakEvenMonth } = calcRev(36, b, r, o, DEFAULTS.invest, DEFAULTS.split, f);

  const y1r = rows.slice(0, 12).reduce((a, x) => a + x.gross, 0);
  const y1  = rows[11]?.cumulative || 0;
  const y2  = rows[23]?.cumulative || 0;
  const y3  = rows[35]?.cumulative || 0;

  // KPI row
  const kRow = document.getElementById('rK');
  if (kRow) kRow.innerHTML = `
    ${kpi(breakEvenMonth ? breakEvenMonth + ' mo' : '>36', 'Break-Even', 'g')}
    ${kpi(fmt(y1r),  'Year 1 Revenue',      'gold')}
    ${kpi(fmt(y1),   'Year 1 Each Partner', 'b')}
    ${kpi(fmt(y3),   'Year 3 Each Partner', 'p')}
  `;

  // Summary table
  const tbl = document.getElementById('rT');
  if (tbl) tbl.innerHTML = `
    <tr><td class="dim">Each partner in</td>   <td style="font-weight:700;color:var(--gold)">$8,000</td></tr>
    <tr><td class="dim">Total investment</td>   <td style="font-weight:700">$16,000</td></tr>
    <tr><td class="dim">Revenue split</td>      <td class="pos">50 / 50</td></tr>
    <tr><td class="dim">Break-even</td>         <td class="${breakEvenMonth ? 'pos' : 'neg'}">${breakEvenMonth ? 'Month ' + breakEvenMonth : '>36 months'}</td></tr>
    <tr><td class="dim">12-month return</td>    <td class="${y1 >= 0 ? 'pos' : 'neg'}">${fmt(y1)}</td></tr>
    <tr><td class="dim">24-month return</td>    <td class="${y2 >= 0 ? 'pos' : 'neg'}">${fmt(y2)}</td></tr>
    <tr><td class="dim" style="font-weight:600;color:var(--text)">36-month return</td>
        <td style="font-family:var(--fm);font-size:1.1rem;color:var(--gold);font-weight:700;">${fmt(y3)}</td></tr>
  `;

  // Revenue chart
  buildRevenueChart('rc', rows);
};

/**
 * Render the 4-scenario comparison chart and table.
 * Called once on page render (not on slider change).
 */
window.renderScenarios = function() {
  buildScenarioChart('sc', SCENARIOS, DEFAULTS.invest);

  const tbody = document.getElementById('sT');
  if (!tbody) return;

  tbody.innerHTML = SCENARIOS.map(s => {
    const { rows, breakEvenMonth } = calcRev(36, s.bookings, s.avgRev, s.opsCost, DEFAULTS.invest, 0.5, s.fleetGrow);
    const y1 = rows[11]?.cumulative;
    const y2 = rows[23]?.cumulative;
    const y3 = rows[35]?.cumulative;
    return `
      <tr>
        <td><span class="tag ${s.tagClass}">${s.label}</span></td>
        <td>${s.bookings}</td>
        <td>${fmt(s.avgRev)}</td>
        <td class="${breakEvenMonth ? 'pos' : 'neg'}">${breakEvenMonth ? breakEvenMonth + ' mo' : '>36'}</td>
        <td class="${y1 >= 0 ? 'pos' : 'neg'}">${fmt(y1)}</td>
        <td class="${y2 >= 0 ? 'gold' : 'neg'}">${fmt(y2)}</td>
        <td class="${y3 >= 0 ? 'gold' : 'neg'}" style="font-weight:700">${fmt(y3)}</td>
      </tr>
    `;
  }).join('');
};
