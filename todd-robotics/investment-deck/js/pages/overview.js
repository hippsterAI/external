/**
 * pages/overview.js — Overview page renderer.
 */

window.renderOverview = function() {
  setContent(`
    ${pageHeader(
      'Houston Robotics <span>Co-Venture</span>',
      '// Peter Haggard + Todd Linton · Equal Partners · April 2026'
    )}

    ${hbox(`<strong>This is a co-founder partnership.</strong> Peter puts in $8K. Todd puts in $8K. $16K total buys the robot. 50/50 on everything — revenue, decisions, upside. No one is writing a check for someone else's dream.`, 'gold')}

    <div class="krow">
      ${kpi('$8K',  'Each Partner In',    'gold')}
      ${kpi('$16K', 'Total — Buys Robot', 'g')}
      ${kpi('50/50','Revenue Split',       'b')}
      ${kpi('4 mo', 'Break-Even (base)',  'g')}
      ${kpi('$0',   'Houston Competition','r')}
    </div>

    <div class="g2" style="margin-bottom:1.25rem">
      ${card(`
        <div style="display:flex;flex-direction:column;gap:1rem;">
          <div>
            <div style="font-weight:700;margin-bottom:4px;">🏆 #1 — Skill Library Marketplace</div>
            <div style="font-size:.83rem;color:var(--dim)">Developers build skills for humanoid robots. We review, host, and take 20-30% on every license. One skill sells to 50+ operators nationwide. Zero extra hardware needed. The App Store for humanoid robots.</div>
          </div>
          <hr>
          <div>
            <div style="font-weight:700;margin-bottom:4px;">🥈 #2 — Developer Rental Sessions</div>
            <div style="font-size:.83rem;color:var(--dim)">Developers pay $200-300/hr to run their approved code on our physical robot. Upload library, watch it execute remotely. 6-8 sessions/day possible.</div>
          </div>
          <hr>
          <div>
            <div style="font-weight:700;margin-bottom:4px;">🥉 #3 — Teleoperation + Events</div>
            <div style="font-size:.83rem;color:var(--dim)">Week 1 cash flow. Hotel lobbies, corporate events. $1,500-2,500/booking. Robot Studio in Dallas already doing this — zero Houston competition.</div>
          </div>
        </div>
      `, 'What We Are Building')}

      ${card(`
        <table class="tbl" style="margin-bottom:1rem;">
          <tr><td class="dim">Peter builds</td><td class="pos">Software platform, skill approval layer, cognitive OS</td></tr>
          <tr><td class="dim">Todd builds</td><td class="blu">Platform layer, business development, enterprise relationships</td></tr>
          <tr><td class="dim">Together own</td><td class="gold">Houston deployment + Texas skill marketplace</td></tr>
          <tr><td class="dim">Built on</td><td class="dim">Unitree SDK + ROS2 + OpenMind OM1</td></tr>
          <tr><td class="dim">Competition</td><td class="pos">Zero in Houston</td></tr>
          <tr><td class="dim">Dallas proof</td><td class="dim">Robot Studio — $1K+/event, CBS covered, scaling fast</td></tr>
        </table>
        ${hbox(`<strong>We are not selling robots.</strong> We are building the platform layer that makes every humanoid in America more valuable — and we get paid every time someone uses or licenses a skill.`, '')}
      `, 'The Partnership')}
    </div>

    ${card(`
      <div class="g3">
        ${_navCard('⬡', 'The Robot',      'Specs, capabilities, why G1 at $16K', 'robot')}
        ${_navCard('$', 'Your Returns',   'Month by month, 4 scenarios',          'returns')}
        ${_navCard('?', 'Your Questions', 'Every question answered directly',     'questions')}
      </div>
    `, 'Navigate This Platform')}
  `);
};

function _navCard(icon, title, desc, pageId) {
  return `
    <div style="text-align:center;padding:.75rem;cursor:pointer;border:1px solid var(--border);border-radius:5px;"
         onclick="navigateTo('${pageId}')">
      <div style="font-size:1.4rem;margin-bottom:6px;">${icon}</div>
      <div style="font-weight:700;font-size:.88rem;margin-bottom:3px;">${title}</div>
      <div style="font-size:.78rem;color:var(--dim)">${desc}</div>
    </div>
  `;
}
