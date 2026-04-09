/**
 * pages/week1.js — Week 1 Plan page renderer.
 * Step data lives in WEEK1_STEPS in config.js.
 */

window.renderWeek1 = function() {
  const steps = WEEK1_STEPS.map(s => `
    <div class="card" style="border-left:3px solid ${s.color};">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:.75rem;">
        <div style="font-family:var(--fm);font-size:.62rem;color:${s.color};letter-spacing:.1em;text-transform:uppercase;">${s.day}</div>
        <div style="font-weight:700;">${s.title}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.4rem;">
        ${s.items.map(item => `<div style="font-size:.82rem;color:var(--dim);">&#x2713; ${item}</div>`).join('')}
      </div>
    </div>
  `).join('');

  setContent(`
    ${pageHeader('Week 1 <span>Plan</span>', '// From handshake to first revenue')}
    ${hbox('<strong>Goal:</strong> Robot ordered, pilot booked, first session revenue in 14 days.', 'gold')}
    <div style="display:flex;flex-direction:column;gap:1rem;">${steps}</div>
  `);
};
