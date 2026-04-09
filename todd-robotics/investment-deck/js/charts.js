/**
 * charts.js — Chart.js instance management and reusable chart builders.
 *
 * All active Chart instances are stored in window.CHARTS so they can be
 * properly destroyed before re-rendering (avoids "Canvas already in use" errors).
 */

window.CHARTS = {};

/**
 * Destroy a chart by its canvas id (if it exists).
 * @param {string} id - canvas element id
 */
window.destroyChart = function(id) {
  if (window.CHARTS[id]) {
    window.CHARTS[id].destroy();
    delete window.CHARTS[id];
  }
};

/**
 * Destroy all active charts. Call this before navigating away from a page
 * that rendered charts.
 */
window.destroyAllCharts = function() {
  Object.keys(window.CHARTS).forEach(id => window.destroyChart(id));
};

/** Shared axis tick/grid style for dark theme */
const AXIS_STYLE = {
  x: {
    ticks:  { color: '#334155', font: { size: 8 } },
    grid:   { color: '#1e1e30' },
  },
  y: {
    ticks:  { color: '#334155', callback: v => '$' + Math.round(v / 1000) + 'K' },
    grid:   { color: '#1e1e30' },
  },
  yRight: {
    position: 'right',
    ticks:  { color: '#854d0e', callback: v => '$' + Math.round(v / 1000) + 'K' },
    grid:   { display: false },
  },
};

const LEGEND_STYLE = {
  labels: { color: '#64748b', font: { family: 'Fira Code', size: 9 } },
};

/**
 * Build the 36-month revenue + cumulative combo chart (bar + line).
 * @param {string}  canvasId  - id of the <canvas> element
 * @param {Array}   rows      - output of calcRev().rows
 */
window.buildRevenueChart = function(canvasId, rows) {
  window.destroyChart(canvasId);
  const labels = rows.map(r => 'M' + r.m);

  window.CHARTS[canvasId] = new Chart(document.getElementById(canvasId), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Monthly Revenue',
          data: rows.map(r => Math.round(r.gross)),
          backgroundColor: 'rgba(0,229,160,.3)',
          borderColor: 'var(--accent)',
          borderWidth: 1,
        },
        {
          label: 'Each Partner Cumulative',
          data: rows.map(r => Math.round(r.cumulative)),
          type: 'line',
          borderColor: '#f59e0b',
          backgroundColor: 'transparent',
          tension: .4,
          pointRadius: 0,
          borderWidth: 2,
          yAxisID: 'y1',
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: LEGEND_STYLE },
      scales: {
        x:  AXIS_STYLE.x,
        y:  AXIS_STYLE.y,
        y1: AXIS_STYLE.yRight,
      },
    },
  });
};

/**
 * Build the 4-scenario cumulative line chart.
 * @param {string}  canvasId  - id of the <canvas> element
 * @param {Array}   scenarios - window.SCENARIOS array from config.js
 * @param {number}  invest    - total investment
 */
window.buildScenarioChart = function(canvasId, scenarios, invest) {
  window.destroyChart(canvasId);
  const labels = Array.from({ length: 36 }, (_, i) => 'M' + (i + 1));

  const datasets = scenarios.map(s => {
    const { rows } = calcRev(36, s.bookings, s.avgRev, s.opsCost, invest, 0.5, s.fleetGrow);
    return {
      label: s.label,
      data: rows.map(r => Math.round(r.cumulative)),
      borderColor: s.color,
      backgroundColor: 'transparent',
      tension: .4,
      pointRadius: 0,
      borderWidth: 2,
    };
  });

  window.CHARTS[canvasId] = new Chart(document.getElementById(canvasId), {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: '#94a3b8', font: { family: 'Fira Code', size: 10 } } },
      },
      scales: {
        x: AXIS_STYLE.x,
        y: AXIS_STYLE.y,
      },
    },
  });
};
