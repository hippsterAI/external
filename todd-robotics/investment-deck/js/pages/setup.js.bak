/**
 * pages/setup.js — Unitree G1 ROS2 + Gazebo Setup Guide page.
 * Source: Unitree_G1_Setup_Guide.docx (ProofWorks / builtindays.co)
 */

window.renderSetup = function() {
  setContent(`
    ${pageHeader('G1 <span>Setup Guide</span>', '// Unitree G1 · ROS2 Jazzy · Gazebo · Windows 11 + WSL2 + Ubuntu 24.04')}

    ${hbox(`<strong>Guaranteed first-time success</strong> — follow exactly as written. Do NOT install anything else until this guide tells you to. Order matters.`, 'gold')}

    <!-- System Requirements -->
    ${card(`
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;">
        ${_req('Windows 10 or 11', '64-bit')}
        ${_req('16 GB RAM minimum', '32 GB recommended')}
        ${_req('50 GB free disk space', 'SSD preferred')}
        ${_req('Internet connection', 'For downloads')}
      </div>
    `, 'System Requirements')}

    <!-- Phase 1 -->
    ${_phase('Phase 1', 'Install WSL2 and Ubuntu', 'var(--accent)')}

    ${_step('1', 'Enable WSL2 — Run in Windows PowerShell as Administrator',
      'Right-click Start → Windows PowerShell (Admin), then run:',
      `wsl --install`,
      'When it finishes, <strong>restart your computer.</strong> After restart, Ubuntu will open and ask you to create a username and password. Use something simple — you will need it later.',
      'If Ubuntu does not open automatically after restart, open it from the Start menu.'
    )}

    ${_step('2', 'Verify WSL2 is installed correctly',
      'In PowerShell (does not need to be Admin):',
      `wsl --list --verbose`,
      'You should see Ubuntu with <strong>VERSION 2</strong>. If it says VERSION 1, run:',
      null,
      `wsl --set-version Ubuntu 2`
    )}

    <!-- Phase 2 -->
    ${_phase('Phase 2', 'Install ROS2 Jazzy', 'var(--blue)')}

    <div class="hbox" style="margin-bottom:1.25rem;">
      Open WSL (type <strong>wsl</strong> in Windows search bar). All commands from here run <strong>inside WSL/Ubuntu</strong>.
    </div>

    ${_step('3', 'Set up ROS2 package sources',
      'Run these three commands:',
      `sudo apt update && sudo apt install -y curl gnupg lsb-release

sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key -o /usr/share/keyrings/ros-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(. /etc/os-release && echo $UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null`
    )}

    ${_step('4', 'Install ROS2 Jazzy Desktop and Gazebo packages',
      'This will take <strong>10-20 minutes</strong>. Do not close the terminal.',
      `sudo apt update

sudo apt install -y ros-jazzy-desktop ros-jazzy-ros-gz ros-jazzy-ros-gz-bridge ros-jazzy-ros-gz-sim ros-jazzy-rmw-cyclonedds-cpp`,
      'If you see any errors during install, run: <code style="color:var(--accent);background:rgba(0,229,160,.1);padding:1px 6px;border-radius:3px;">sudo apt install -f</code> and then repeat the command above.'
    )}

    ${_step('5', 'Add ROS2 to your shell automatically',
      'Run:',
      `echo "source /opt/ros/jazzy/setup.bash" >> ~/.bashrc

source ~/.bashrc`
    )}

    <!-- Phase 3 -->
    ${_phase('Phase 3', 'Download Unitree G1 Robot Model', 'var(--gold)')}

    ${_step('6', 'Clone the Unitree robot models',
      null,
      `mkdir -p ~/models && cd ~/models

git clone https://github.com/unitreerobotics/unitree_ros.git`
    )}

    ${_step('7', 'Convert G1 URDF to SDF format',
      null,
      `source /opt/ros/jazzy/setup.bash

cd ~/models/unitree_ros/robots/g1_description

gz sdf -p g1_23dof_rev_1_0.urdf > g1.sdf

echo done`,
      'You should see the word <strong>done</strong>. If you see errors about missing packages, run:<br><code style="color:var(--accent);background:rgba(0,229,160,.1);padding:1px 6px;border-radius:3px;">sudo apt install -y ros-jazzy-xacro && gz sdf -p g1_23dof_rev_1_0.urdf > g1.sdf</code>'
    )}

    <!-- Phase 4 -->
    ${_phase('Phase 4', 'Create the Startup Script', 'var(--purple)')}

    <div class="hbox" style="margin-bottom:1.25rem;">
      This script starts everything automatically every time. <strong>You only need to run one command after this.</strong>
    </div>

    ${_step('8', 'Create start_sim.sh',
      null,
      `cat > ~/start_sim.sh << 'EOF'
#!/bin/bash
pkill -9 -f gz; pkill -9 -f ros_gz; pkill -9 -f ros2
sleep 3
export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
source /opt/ros/jazzy/setup.bash
ros2 launch ros_gz_sim gz_sim.launch.py &
sleep 12
ros2 run ros_gz_bridge parameter_bridge \\
  /world/empty/control@ros_gz_interfaces/srv/ControlWorld \\
  /world/empty/create@ros_gz_interfaces/srv/SpawnEntity &
sleep 5
ros2 service call /world/empty/create ros_gz_interfaces/srv/SpawnEntity \\
  "{entity_factory: {name: 'g1', allow_renaming: true, sdf_filename: '/home/$USER/models/unitree_ros/robots/g1_description/g1.sdf'}}"
wait
EOF

chmod +x ~/start_sim.sh
echo ready`
    )}

    <!-- Phase 5 -->
    ${_phase('Phase 5', 'Run the Simulation', 'var(--accent)')}

    ${_step('9', 'Launch everything with one command',
      null,
      `~/start_sim.sh`,
      null, null, null,
      `The Gazebo quick start window will appear. You <strong>MUST</strong> do this immediately:
      <ol style="margin:.5rem 0 0 1.25rem;display:flex;flex-direction:column;gap:.3rem;">
        <li>Click <strong style="color:var(--accent)">Empty</strong> (bottom middle of the quick start screen)</li>
        <li>Click <strong style="color:var(--accent)">RUN</strong> button (bottom right)</li>
        <li>Wait 5-10 seconds</li>
        <li>The Unitree G1 robot will appear standing on the grid</li>
      </ol>`,
      'You must click Empty → RUN within 15 seconds of the Gazebo window opening. If you miss it, press Ctrl+C and run ~/start_sim.sh again.'
    )}

    <!-- Troubleshooting -->
    <div style="margin-top:2rem;margin-bottom:.75rem;">
      <div style="font-family:var(--ff);font-size:1.1rem;font-weight:700;color:var(--red);margin-bottom:.25rem;">Troubleshooting</div>
    </div>

    ${_trouble('Gazebo window crashes immediately',
      'Run this once to clear a corrupted config file, then try again:',
      `rm -rf ~/.gz`
    )}
    ${_trouble("Robot does not appear / 'waiting for service' message",
      'The world name may have changed. Run this to check:',
      `gz topic -l | grep world`,
      `If you see <code style="color:var(--accent)">/world/empty</code> — the script is correct. If you see a different name, edit <code style="color:var(--accent)">~/start_sim.sh</code> and replace <strong>'empty'</strong> with the name you see.`
    )}
    ${_trouble("'command not found' errors",
      'ROS is not sourced. Run:',
      `source /opt/ros/jazzy/setup.bash`,
      'Then try your command again.'
    )}
    ${_trouble('Everything is stuck / nothing responds',
      'Kill everything and start clean:',
      `pkill -9 -f gz; pkill -9 -f ros_gz; pkill -9 -f ros2
sleep 5
~/start_sim.sh`
    )}

    <!-- Daily Use Quick Reference -->
    ${card(`
      <table class="tbl">
        <thead><tr><th>Action</th><th>Command</th></tr></thead>
        <tbody>
          <tr><td class="dim">Open WSL</td>         <td class="pos">Type 'wsl' in Windows search bar</td></tr>
          <tr><td class="dim">Start simulation</td> <td class="pos">~/start_sim.sh</td></tr>
          <tr><td class="dim">When Gazebo opens</td><td style="color:var(--gold);font-weight:700;">Click Empty → Click RUN</td></tr>
          <tr><td class="dim">Kill everything</td>  <td class="pos">pkill -9 -f gz; pkill -9 -f ros_gz; pkill -9 -f ros2</td></tr>
        </tbody>
      </table>
    `, 'Quick Reference — Daily Use', 'gold')}

    <div style="font-family:var(--fm);font-size:.6rem;color:var(--muted);margin-top:1.5rem;">
      Built by ProofWorks / builtindays.co
    </div>
  `);
};

/* ── HELPERS ──────────────────────────────────────────────────────────────── */

function _phase(num, title, color) {
  return `
    <div style="display:flex;align-items:center;gap:12px;margin:1.75rem 0 1rem;">
      <div style="font-family:var(--fm);font-size:.6rem;color:${color};letter-spacing:.15em;text-transform:uppercase;white-space:nowrap;">${num}</div>
      <div style="font-family:var(--ff);font-size:1.1rem;font-weight:700;color:${color};">${title}</div>
      <div style="flex:1;height:1px;background:var(--border);"></div>
    </div>
  `;
}

function _req(label, sub) {
  return `
    <div style="display:flex;align-items:flex-start;gap:8px;padding:.6rem 0;border-bottom:1px solid rgba(30,30,48,.5);">
      <span style="color:var(--accent);font-size:.8rem;margin-top:1px;">✓</span>
      <div>
        <div style="font-size:.84rem;font-weight:600;">${label}</div>
        <div style="font-size:.75rem;color:var(--muted);">${sub}</div>
      </div>
    </div>
  `;
}

function _step(num, title, intro, code, note, warning, code2, extraHtml, warn2) {
  const introHtml  = intro   ? `<div style="font-size:.84rem;color:var(--dim);margin-bottom:.75rem;">${intro}</div>` : '';
  const codeHtml   = code    ? `<pre style="background:var(--surface);border:1px solid var(--border);border-radius:4px;padding:1rem;font-family:var(--fm);font-size:.75rem;color:var(--accent);overflow-x:auto;white-space:pre-wrap;margin-bottom:.75rem;">${code}</pre>` : '';
  const noteHtml   = note    ? `<div style="font-size:.82rem;color:var(--dim);margin-bottom:.5rem;">${note}</div>` : '';
  const code2Html  = code2   ? `<pre style="background:var(--surface);border:1px solid var(--border);border-radius:4px;padding:.75rem;font-family:var(--fm);font-size:.75rem;color:var(--accent);overflow-x:auto;white-space:pre-wrap;margin-bottom:.75rem;">${code2}</pre>` : '';
  const extraHtml2 = extraHtml ? `<div style="font-size:.84rem;color:var(--dim);margin-bottom:.5rem;">${extraHtml}</div>` : '';
  const warnHtml   = warning  ? `<div style="font-size:.78rem;color:var(--gold);background:rgba(245,158,11,.06);border-left:2px solid var(--gold);padding:.5rem .75rem;border-radius:0 3px 3px 0;">⚠ ${warning}</div>` : '';
  const warn2Html  = warn2    ? `<div style="font-size:.78rem;color:var(--gold);background:rgba(245,158,11,.06);border-left:2px solid var(--gold);padding:.5rem .75rem;border-radius:0 3px 3px 0;margin-top:.5rem;">⚠ ${warn2}</div>` : '';

  return `
    <div class="card" style="margin-bottom:1rem;border-left:3px solid var(--border);">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:.85rem;">
        <div style="font-family:var(--fm);font-size:.6rem;color:var(--muted);letter-spacing:.1em;background:var(--surface);padding:2px 8px;border-radius:3px;">STEP ${num}</div>
        <div style="font-weight:700;font-size:.9rem;">${title}</div>
      </div>
      ${introHtml}${codeHtml}${noteHtml}${code2Html}${extraHtml2}${warnHtml}${warn2Html}
    </div>
  `;
}

function _trouble(title, intro, code, note) {
  const introHtml = intro ? `<div style="font-size:.82rem;color:var(--dim);margin-bottom:.6rem;">${intro}</div>` : '';
  const codeHtml  = code  ? `<pre style="background:var(--surface);border:1px solid var(--border);border-radius:4px;padding:.75rem;font-family:var(--fm);font-size:.75rem;color:var(--accent);overflow-x:auto;white-space:pre-wrap;margin-bottom:.5rem;">${code}</pre>` : '';
  const noteHtml  = note  ? `<div style="font-size:.8rem;color:var(--dim);">${note}</div>` : '';
  return `
    <div style="border:1px solid rgba(239,68,68,.2);border-left:3px solid var(--red);border-radius:0 5px 5px 0;padding:1rem 1.25rem;margin-bottom:.75rem;background:rgba(239,68,68,.03);">
      <div style="font-weight:700;font-size:.88rem;color:#f87171;margin-bottom:.6rem;">${title}</div>
      ${introHtml}${codeHtml}${noteHtml}
    </div>
  `;
}
