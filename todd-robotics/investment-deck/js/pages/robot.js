/**
 * pages/robot.js — The Robot page renderer.
 */

window.renderRobot = function() {
  setContent(`
    ${pageHeader('The <span>Robot</span>', '// Unitree G1 Base · $16,000 · Ships 2 Days from US')}

    ${hbox(`<strong>Honest correction:</strong> The R1 at $5,900 does NOT support full custom skill library development or the developer rental model we are building. G1 base at $16,000 is the lowest-priced humanoid that does everything we need.`, 'red')}

    <div class="g2" style="margin-bottom:1.25rem;">
      ${card(`
        <table class="tbl" style="margin-bottom:1rem;">
          <tr><td class="dim">Price</td>        <td style="font-weight:700;color:var(--gold)">$16,000</td></tr>
          <tr><td class="dim">Ships</td>        <td class="pos">2 days · RoboStore NY · 855-285-7626</td></tr>
          <tr><td class="dim">Height</td>       <td>132cm / 4ft 4in</td></tr>
          <tr><td class="dim">Battery</td>      <td>~2 hours active use</td></tr>
          <tr><td class="dim">Battery swap</td> <td>Manual 30 sec — cannot self-swap</td></tr>
          <tr><td class="dim">SDK</td>          <td class="pos">Python + C++ + ROS2 · Full open source</td></tr>
          <tr><td class="dim">Skill library upload</td><td class="pos">✅ Full support</td></tr>
          <tr><td class="dim">Teleoperation</td><td class="pos">✅ Remote control · VR optional upgrade</td></tr>
          <tr><td class="dim">Imitation learning</td><td class="pos">✅ Show once, it learns</td></tr>
          <tr><td class="dim">OpenMind OM1</td> <td class="pos">✅ Compatible — app store access</td></tr>
          <tr><td class="dim">US community</td> <td class="pos">MIT, Stanford, CMU — biggest worldwide</td></tr>
        </table>
      `, 'Unitree G1 Base — $16,000')}

      <div>
        ${card(`
          <div style="font-size:.85rem;display:flex;flex-direction:column;gap:.5rem;">
            <div class="pos">✅ Walk, stand, balance, gesture</div>
            <div class="pos">✅ Voice interaction via onboard LLM</div>
            <div class="pos">✅ Preloaded motion library</div>
            <div class="pos">✅ Teleoperation — drive it remotely now</div>
            <div class="pos">✅ Accept and run custom skill libraries</div>
            <div class="pos">✅ Imitation learning from demonstration</div>
            <div class="pos">✅ Peter codes against SDK day of delivery</div>
            <div class="neg">❌ Cannot self-swap battery</div>
            <div class="neg">❌ Not warehouse/heavy labor grade yet</div>
          </div>
        `, 'What It Does Day 1', '', 'margin-bottom:1.25rem;')}

        ${card(`
          <table class="tbl">
            <thead>
              <tr><th>Feature</th><th>R1 $5,900</th><th>G1 $16,000</th></tr>
            </thead>
            <tbody>
              <tr><td>Custom SDK dev</td>          <td class="neg">Limited</td><td class="pos">Full</td></tr>
              <tr><td>Skill library upload</td>    <td class="neg">No</td>     <td class="pos">Yes</td></tr>
              <tr><td>Developer rental model</td>  <td class="neg">No</td>     <td class="pos">Yes</td></tr>
              <tr><td>Battery life</td>            <td class="neg">~1 hour</td><td class="pos">~2 hours</td></tr>
              <tr><td>OpenMind OM1</td>            <td class="neg">No</td>     <td class="pos">Yes</td></tr>
              <tr><td>Marketplace ready</td>       <td class="neg">No</td>     <td class="pos">Yes</td></tr>
            </tbody>
          </table>
        `, 'R1 $5,900 vs G1 $16,000', 'gold')}
      </div>
    </div>

    ${card(`
      <div class="g2">
        <div>
          <div id="rImg" style="background:var(--surface);border:1px solid var(--border);border-radius:4px;min-height:220px;display:flex;align-items:center;justify-content:center;">
            <span style="color:var(--muted);font-family:var(--fm);font-size:.7rem;">Loading...</span>
          </div>
          <div style="font-family:var(--fm);font-size:.62rem;color:var(--accent);margin-top:6px;">
            MuJoCo · HU_D03_03 · Standing · ROS 2 Jazzy
          </div>
        </div>
        <div>
          <table class="tbl" style="margin-bottom:1rem;">
            <tr><th colspan="2">Peter's Current Stack</th></tr>
            <tr><td class="dim">Simulator</td>   <td class="pos">MuJoCo 3.6.0</td></tr>
            <tr><td class="dim">Robot model</td> <td class="pos">LimX HU_D03_03</td></tr>
            <tr><td class="dim">OS</td>          <td class="pos">ROS 2 Jazzy · WSL2 · Ubuntu</td></tr>
            <tr><td class="dim">SDK</td>         <td class="pos">LimX SDK 3.4.2</td></tr>
            <tr><td class="dim">AI layer</td>    <td class="pos">COSA-lite live demo</td></tr>
            <tr><td class="dim">Time to build</td><td class="pos">5 days from scratch</td></tr>
          </table>
          ${hbox(`<strong>Not a mockup.</strong> Peter already has a humanoid robot running in physics simulation. The G1 uses the same SDK architecture. Day 1 of delivery = Day 1 of development.`, '')}
        </div>
      </div>
    `, 'Live Development — Already Running on Peter\'s Laptop')}
  `);

  // Inject robot image if available
  setTimeout(() => {
    const el = document.getElementById('rImg');
    if (el && window.RI) {
      el.innerHTML = `<img src="${window.RI}" style="width:100%;border-radius:4px;" alt="LimX robot in MuJoCo">`;
    }
  }, 100);
};
