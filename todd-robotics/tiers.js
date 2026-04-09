/**
 * pages/tiers.js — Revenue Tiers page renderer.
 */

window.renderTiers = function() {
  setContent(`
    ${pageHeader('Revenue <span>Tiers</span>', '// Three layers · Ranked by scale potential')}

    <!-- Tier 1: Skill Library Marketplace -->
    <div class="tier t1">
      <div class="tier-num">#1</div>
      <div class="tier-title">Skill Library Marketplace</div>
      <div class="tier-desc" style="margin-bottom:1rem;">
        Developers build Python/ROS2 skill packages for humanoid robots. Submit to our platform.
        Peter reviews for safety. We host and sell licenses. 20-30% cut on every transaction.
        One skill sells to 50+ operators — zero extra hardware. This is the App Store model for humanoid robots.
      </div>
      <div class="g3" style="margin-bottom:1rem;">
        ${_tierStat('Revenue type',   'Recurring licensing',   'var(--gold)')}
        ${_tierStat('Our cut',        '20-30% per license',    'var(--gold)')}
        ${_tierStat('Scale ceiling',  'None — no hardware limit','var(--gold)')}
      </div>
      ${hbox(`<strong>Who is doing this already?</strong> OpenMind launched a robot app store January 2026 (LimX is a partner). A Spanish company called Aristeril presented the same concept at LogiMAT 2026 last week. Neither is on the ground in Texas. We build on top of OpenMind's OM1 infrastructure — we don't compete with it. Our edge is local deployment + operator layer + Peter's cognitive control software.`, 'gold')}
    </div>

    <!-- Tier 2: Developer Rental Sessions -->
    <div class="tier t2">
      <div class="tier-num">#2</div>
      <div class="tier-title">Developer Rental Sessions</div>
      <div class="tier-desc" style="margin-bottom:1rem;">
        Developers pay to run their approved skill library on our physical robot. Two modes:
        (a) Teleoperation — they drive it manually via browser, VR goggles optional upgrade.
        (b) Autonomous execution — upload approved library, watch their code run live via camera feed.
        We approve every library. Nobody touches our hardware without passing safety review.
      </div>
      <div class="g3" style="margin-bottom:1rem;">
        ${_tierStat('Hourly rate',    '$200-300/hour',         'var(--accent)')}
        ${_tierStat('Daily capacity', '6-8 sessions/day',      'var(--accent)')}
        ${_tierStat('Revenue type',   'Recurring · predictable','var(--accent)')}
      </div>
      ${hbox(`<strong>The approval process is our moat.</strong> Nobody runs untested code on our hardware. We protect the robot, protect the customer, and charge for the trust layer. This is defensible.`, '')}
    </div>

    <!-- Tier 3: Teleoperation + Events -->
    <div class="tier t3">
      <div class="tier-num">#3</div>
      <div class="tier-title">Teleoperation + Events</div>
      <div class="tier-desc" style="margin-bottom:1rem;">
        Non-technical customers rent the robot for hotel lobbies, corporate events, trade shows,
        activations. Uses preloaded library plus our teleop layer. Revenue starts Week 1 when the
        robot arrives. Robot Studio in Dallas is already doing exactly this — CBS covered it,
        $1K+ per event, scaling their fleet fast. Houston has zero competition.
      </div>
      <div class="g3">
        ${_tierStat('Price range',         '$1,500-2,500/event',     'var(--blue)')}
        ${_tierStat('First target',        'Post Oak Hotel — free pilot','var(--blue)')}
        ${_tierStat('Houston competition', 'Zero',                   'var(--blue)')}
      </div>
    </div>
  `);
};

/** Small stat block used inside tier cards */
function _tierStat(label, value, color) {
  return `
    <div class="card" style="background:var(--surface);">
      <div style="font-family:var(--fm);font-size:.58rem;color:var(--muted);text-transform:uppercase;margin-bottom:4px;">${label}</div>
      <div style="font-weight:700;color:${color}">${value}</div>
    </div>
  `;
}
