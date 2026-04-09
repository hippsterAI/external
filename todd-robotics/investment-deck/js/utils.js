/**
 * utils.js — Shared helper functions.
 * Add new helpers here; import nothing — all globals on window.
 */

/**
 * Format a dollar amount compactly.
 * e.g.  1500000 → "$1.5M"  |  12500 → "$12.5K"  |  800 → "$800"
 */
window.fmt = function(n) {
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1e6)   return sign + '$' + Math.abs(Math.round(n / 1e5) / 10) + 'M';
  if (abs >= 1000)  return sign + '$' + Math.abs(Math.round(n / 100) / 10) + 'K';
  return (n < 0 ? '-$' : '$') + Math.abs(Math.round(n)).toLocaleString();
};

/**
 * Calculate month-by-month revenue projections.
 *
 * @param {number} months     - projection horizon in months
 * @param {number} bookings   - monthly bookings
 * @param {number} avgRev     - average revenue per booking
 * @param {number} opsCost    - monthly operating costs
 * @param {number} invest     - total initial investment
 * @param {number} split      - partner revenue split (0–1)
 * @param {number} fleetGrow  - robots added each year after year 1
 * @returns {{ rows: Array, breakEvenMonth: number|null }}
 */
window.calcRev = function(months, bookings, avgRev, opsCost, invest, split, fleetGrow) {
  let cumulative = -invest;
  let fleet = 1;
  let breakEvenMonth = null;
  const rows = [];

  for (let m = 1; m <= months; m++) {
    // Add robot at the start of each new year (after year 1)
    if (m % 12 === 1 && m > 1) fleet += fleetGrow;

    const gross      = bookings * avgRev * fleet;
    const partnerNet = (gross * split) - (opsCost * split);
    cumulative += partnerNet;

    if (!breakEvenMonth && cumulative >= 0) breakEvenMonth = m;

    rows.push({ m, gross, partnerNet, cumulative, fleet });
  }

  return { rows, breakEvenMonth };
};

/**
 * Inject HTML into the main content area.
 * @param {string} html
 */
window.setContent = function(html) {
  document.getElementById('mc').innerHTML = html;
};

/**
 * Build a KPI tile.
 * @param {string} value  - display value
 * @param {string} label  - label text
 * @param {string} color  - color class: 'g' | 'gold' | 'b' | 'r' | 'p'
 */
window.kpi = function(value, label, color = 'g') {
  return `<div class="kpi ${color}"><div class="kv">${value}</div><div class="kl">${label}</div></div>`;
};

/**
 * Build a highlight box.
 * @param {string} html      - inner HTML content
 * @param {string} modifier  - optional class: 'gold' | 'red'
 */
window.hbox = function(html, modifier = '') {
  return `<div class="hbox ${modifier}">${html}</div>`;
};

/**
 * Build a card with optional card-title.
 * @param {string} body    - inner HTML
 * @param {string} title   - optional card title (uses .ct)
 * @param {string} titleMod - color modifier for .ct: '' | 'gold' | 'blue' | 'red'
 * @param {string} style   - optional inline style string
 */
window.card = function(body, title = '', titleMod = '', style = '') {
  const titleHtml = title ? `<div class="ct ${titleMod}">${title}</div>` : '';
  return `<div class="card" ${style ? `style="${style}"` : ''}>${titleHtml}${body}</div>`;
};

/**
 * Build a page header block.
 * @param {string} title    - main title (wrap accent words in <span>)
 * @param {string} subtitle - subtext shown in monospace
 */
window.pageHeader = function(title, subtitle) {
  return `<div class="mh"><div class="mt">${title}</div><div class="ms">${subtitle}</div></div>`;
};
