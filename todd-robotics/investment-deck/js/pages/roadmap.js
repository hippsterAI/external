/**
 * pages/roadmap.js — 3-Year Roadmap page renderer.
 * Phase data lives in ROADMAP_PHASES in config.js.
 */

window.renderRoadmap = function() {
  const phases = ROADMAP_PHASES.map(p => `
    <div class="card" style="border-left:3px solid ${p.color};">
      <div style="font-family:var(--ff);font-size:1.1rem;font-weight:700;color:${p.color};margin-bottom:.75rem;">${p.phase}</div>
      <div style="display:flex;flex-direction:column;gap:.4rem;">
        ${p.milestones.map(m => `<div style="font-size:.85rem;color:var(--dim);">&#8594; ${m}</div>`).join('')}
      </div>
    </div>
  `).join('');

  setContent(`
    ${pageHeader('3-Year <span>Roadmap</span>', '// From one robot to Texas platform')}
    <div style="display:flex;flex-direction:column;gap:1rem;">${phases}</div>
  `);
};
