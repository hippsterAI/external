/**
 * pages/usecases.js — G1 Use Cases page renderer.
 */

window.renderUsecases = function() {
  setContent(`
    ${pageHeader('G1 <span>Use Cases</span>', '// What the robot can actually do · Houston applications')}

    ${hbox(`<strong>Todd asked: can it do surveillance, take pics, and map?</strong> Short answer: yes — the hardware supports all three. These are skills we build on top of the G1's onboard cameras and ROS2 stack.`, 'gold')}

    <!-- Surveillance & Patrol -->
    ${_useCase('⚡', 'Surveillance + Patrol', 'var(--accent)', 'HIGH VALUE', [
      { label: 'Hardware', value: 'Depth camera + RGB camera — built into G1' },
      { label: 'Photos/video', value: 'Capture on schedule or on trigger via SDK' },
      { label: 'Live stream', value: 'Buildable via SDK + WebRTC — remote viewing' },
      { label: 'Patrol route', value: 'Define a path — robot walks it autonomously' },
      { label: 'Build time', value: '2-4 weeks to working patrol skill' },
    ],
    'Oil & gas facilities, construction sites, TMC after-hours, hotel lobbies overnight, parking structures. A patrolling humanoid is a product that sells itself.',
    [
      '🏗 Construction site after-hours patrol',
      '🏥 TMC facility security rounds',
      '🏨 Hotel lobby overnight presence',
      '⚡ Energy campus perimeter checks',
      '🅿️ Parking structure monitoring',
    ])}

    <!-- Mapping -->
    ${_useCase('🗺', '3D Mapping + SLAM', 'var(--blue)', 'BUILDABLE', [
      { label: 'Technology', value: 'ROS2 Nav Stack + depth camera SLAM' },
      { label: 'Output', value: 'Full 3D map of any indoor space' },
      { label: 'Use', value: 'Robot learns a building layout — navigates autonomously' },
      { label: 'Build time', value: '3-5 weeks to reliable indoor mapping skill' },
      { label: 'Pairs with', value: 'Patrol skill — map first, then patrol autonomously' },
    ],
    'Send the robot into a new building once. It maps every room, hallway, and obstacle. From that point it navigates the space autonomously without a human driving it.',
    [
      '🏢 Office building floor mapping',
      '🏥 Hospital wing navigation',
      '🏭 Warehouse layout documentation',
      '🏨 Hotel floor autonomous patrol',
    ])}

    <!-- Photography & Documentation -->
    ${_useCase('📸', 'Photography + Documentation', 'var(--gold)', 'DAY 1 READY', [
      { label: 'Hardware', value: 'RGB camera + depth sensor onboard' },
      { label: 'Photos', value: 'Capture stills on command or schedule' },
      { label: 'Video', value: 'Record + stream via SDK' },
      { label: 'Build time', value: '3-5 days — simplest skill to build' },
      { label: 'Remote access', value: 'View feed live from any browser' },
    ],
    'Simplest capability to unlock. Useful immediately for event documentation, site inspections, proof-of-presence reporting, and social content generation.',
    [
      '📋 Construction site daily photo reports',
      '🎪 Event documentation + highlight capture',
      '🔍 Facility inspection walk-throughs',
      '📱 Social content — robot POV footage',
    ])}

    <!-- Events (existing) -->
    ${_useCase('🏨', 'Teleoperation + Events', 'var(--purple)', 'WEEK 1 REVENUE', [
      { label: 'Status', value: 'Works out of the box — no extra build time' },
      { label: 'Price', value: '$1,500 – $2,500 per booking' },
      { label: 'Proof', value: 'Robot Studio Dallas — CBS covered, $1K+/event' },
      { label: 'Houston', value: 'Zero competition right now' },
      { label: 'First target', value: 'Post Oak Hotel — free 2-week pilot' },
    ],
    'This is the fastest path to first revenue. Human drives the robot remotely while it interacts with guests. No autonomous skill required.',
    [
      '🏨 Hotel lobbies + concierge',
      '🎪 Corporate events + trade shows',
      '🏟 Convention center activations',
      '✈️ Airport terminal presence',
    ])}

    <!-- Summary -->
    ${card(`
      <div class="g3" style="margin-bottom:1.25rem;">
        ${_pill('Day 1', 'Events + Teleoperation', 'var(--accent)')}
        ${_pill('Week 2-3', 'Photos + Live Stream', 'var(--gold)')}
        ${_pill('Month 2', 'Surveillance Patrol', 'var(--blue)')}
      </div>
      ${hbox(`<strong>One robot. Four revenue streams.</strong> We start with events Week 1 for immediate cash flow, layer in photo/documentation within weeks, then build the patrol skill that opens the security market. Each capability compounds the value of the platform.`, '')}
    `, 'Build Sequence', 'gold')}
  `);
};

/* ── HELPERS ─────────────────────────────────────────────────────────────── */

function _useCase(icon, title, color, badge, specs, description, applications) {
  const specRows = specs.map(s => `
    <tr>
      <td class="dim" style="width:35%">${s.label}</td>
      <td style="color:var(--text)">${s.value}</td>
    </tr>
  `).join('');

  const appList = applications.map(a => `
    <div style="font-size:.82rem;color:var(--dim);padding:.3rem 0;border-bottom:1px solid rgba(30,30,48,.3);">${a}</div>
  `).join('');

  return `
    <div style="border:1px solid var(--border);border-left:4px solid ${color};border-radius:0 5px 5px 0;padding:1.5rem;margin-bottom:1.25rem;background:var(--card);">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem;">
        <span style="font-size:1.5rem;">${icon}</span>
        <div style="font-family:var(--ff);font-size:1.1rem;font-weight:700;">${title}</div>
        <span style="font-family:var(--fm);font-size:.55rem;letter-spacing:.12em;color:${color};background:rgba(0,0,0,.3);border:1px solid ${color};padding:2px 8px;border-radius:3px;margin-left:auto;">${badge}</span>
      </div>
      <div class="g2">
        <div>
          <table class="tbl" style="margin-bottom:.75rem;">${specRows}</table>
          <div style="font-size:.83rem;color:var(--dim);line-height:1.7;">${description}</div>
        </div>
        <div>
          <div style="font-family:var(--fm);font-size:.58rem;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:.5rem;">Houston Applications</div>
          ${appList}
        </div>
      </div>
    </div>
  `;
}

function _pill(timeframe, label, color) {
  return `
    <div style="text-align:center;padding:1rem;border:1px solid var(--border);border-radius:5px;border-top:3px solid ${color};">
      <div style="font-family:var(--fm);font-size:.58rem;color:${color};text-transform:uppercase;letter-spacing:.1em;margin-bottom:.4rem;">${timeframe}</div>
      <div style="font-weight:700;font-size:.88rem;">${label}</div>
    </div>
  `;
}
