export function renderSetup() {
  return `
    <div class="page-header">
      <div class="page-tag">TECHNICAL</div>
      <h1 class="page-title">G1 Sim Setup Guide</h1>
      <p class="page-subtitle">Ubuntu native · unitree-g1-mujoco · Verified April 2026</p>
    </div>

    <div class="setup-warning">
      ⚠️ Do NOT use WSL (Windows Subsystem for Linux). DDS networking does not work in WSL.
      This guide requires a native Ubuntu 22.04 installation — dual boot or dedicated machine.
    </div>

    <div class="setup-phase">
      <div class="phase-header">
        <span class="phase-num">01</span>
        <span class="phase-title">Install Ubuntu 22.04 Natively</span>
      </div>
      <div class="phase-body">
        <p>Download Ubuntu 22.04 LTS from <strong>releases.ubuntu.com/22.04</strong> and flash to USB with Rufus (rufus.ie). Boot from USB, select <em>Erase disk and install Ubuntu</em>. This laptop is dedicated to the robot — wipe Windows.</p>
        <div class="cmd-block">
          <span class="cmd-label">Verify Ubuntu version after install</span>
          <code>lsb_release -a</code>
        </div>
      </div>
    </div>

    <div class="setup-phase">
      <div class="phase-header">
        <span class="phase-num">02</span>
        <span class="phase-title">Install ROS2 Humble + Dependencies</span>
      </div>
      <div class="phase-body">
        <p>Add the ROS2 apt repository and install Humble desktop.</p>
        <div class="cmd-block">
          <span class="cmd-label">Add ROS2 repo and install</span>
          <code>sudo apt update && sudo apt upgrade -y</code>
          <code>sudo apt install -y git python3-pip python3-venv curl wget</code>
          <code>sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key -o /usr/share/keyrings/ros-archive-keyring.gpg</code>
          <code>echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu jammy main" | sudo tee /etc/apt/sources.list.d/ros2.list</code>
          <code>sudo apt update && sudo apt install -y ros-humble-desktop ros-humble-rmw-cyclonedds-cpp python3-colcon-common-extensions</code>
        </div>
      </div>
    </div>

    <div class="setup-phase">
      <div class="phase-header">
        <span class="phase-num">03</span>
        <span class="phase-title">Create Python Virtual Environment</span>
      </div>
      <div class="phase-body">
        <p>All robot Python packages go in an isolated venv. Never install to system Python.</p>
        <div class="cmd-block">
          <span class="cmd-label">Create and activate venv, install core packages</span>
          <code>cd ~ && python3 -m venv unitree_env</code>
          <code>source ~/unitree_env/bin/activate</code>
          <code>pip install mujoco pygame numpy scipy loguru pyyaml termcolor</code>
          <code>sudo apt install -y cyclonedds-dev</code>
          <code>export CYCLONEDDS_HOME=/usr && pip install cyclonedds==0.10.4 --no-build-isolation</code>
        </div>
        <p style="margin-top:0.75rem; color: var(--accent);">✓ cyclonedds 0.10.4 is the correct version. Do not upgrade.</p>
      </div>
    </div>

    <div class="setup-phase">
      <div class="phase-header">
        <span class="phase-num">04</span>
        <span class="phase-title">Clone Unitree SDK + G1 Simulator</span>
      </div>
      <div class="phase-body">
        <div class="cmd-block">
          <span class="cmd-label">Clone repos and install SDK</span>
          <code>mkdir -p ~/unitree_ws && cd ~/unitree_ws</code>
          <code>git clone https://github.com/unitreerobotics/unitree_sdk2_python.git</code>
          <code>git clone https://github.com/unitreerobotics/unitree_mujoco.git</code>
          <code>git clone https://huggingface.co/lerobot/unitree-g1-mujoco</code>
          <code>cd unitree_sdk2_python && pip install -e . --no-deps</code>
        </div>
        <div class="cmd-block">
          <span class="cmd-label">Verify G1 SDK loaded correctly</span>
          <code>python3 -c "from unitree_sdk2py.g1.loco.g1_loco_client import LocoClient; print('G1 ready')"</code>
        </div>
        <p style="margin-top:0.75rem; color: var(--accent);">✓ Should print: G1 ready</p>
      </div>
    </div>

    <div class="setup-phase">
      <div class="phase-header">
        <span class="phase-num">05</span>
        <span class="phase-title">Fix G1 Mesh Files + Launch Simulator</span>
      </div>
      <div class="phase-body">
        <p>The unitree-g1-mujoco repo has corrupted ASCII STL files. Copy the correct meshes from unitree_mujoco.</p>
        <div class="cmd-block">
          <span class="cmd-label">Copy working mesh files</span>
          <code>cp ~/unitree_ws/unitree_mujoco/unitree_robots/g1/meshes/*.* ~/unitree_ws/unitree-g1-mujoco/assets/meshes/</code>
        </div>
        <div class="cmd-block">
          <span class="cmd-label">Install remaining dependencies</span>
          <code>cd ~/unitree_ws/unitree-g1-mujoco && pip install loguru pyyaml scipy termcolor</code>
        </div>
        <div class="cmd-block">
          <span class="cmd-label">Launch the G1 simulator</span>
          <code>export PYGLFW_LIBRARY=/usr/lib/x86_64-linux-gnu/libglfw.so.3</code>
          <code>python3 run_sim.py</code>
        </div>
        <p style="margin-top:0.75rem; color: var(--accent);">✓ G1 standing in MuJoCo window — high quality model with hands</p>
      </div>
    </div>

    <div class="setup-phase">
      <div class="phase-header">
        <span class="phase-num">06</span>
        <span class="phase-title">Send First Command to the Robot</span>
      </div>
      <div class="phase-body">
        <p>With the simulator running, open a second terminal and send a low-level joint command.</p>
        <div class="cmd-block">
          <span class="cmd-label">Open second terminal — wave right arm</span>
          <code>source ~/unitree_env/bin/activate</code>
          <code>export UNITREE_SDK2_DOMAIN_ID=0</code>
          <code>cd ~/unitree_ws/unitree-g1-mujoco</code>
          <code>python3 -c "
import time, math
from unitree_sdk2py.core.channel import ChannelPublisher, ChannelFactoryInitialize
from unitree_sdk2py.idl.default import unitree_hg_msg_dds__LowCmd_
from unitree_sdk2py.idl.unitree_hg.msg.dds_ import LowCmd_
from unitree_sdk2py.utils.crc import CRC
ChannelFactoryInitialize(0, 'lo')
pub = ChannelPublisher('rt/lowcmd', LowCmd_)
pub.Init()
crc = CRC()
cmd = unitree_hg_msg_dds__LowCmd_()
cmd.mode_pr = 0
cmd.mode_machine = 0
for i in range(35):
    cmd.motor_cmd[i].mode = 1
    cmd.motor_cmd[i].kp = 80.0
    cmd.motor_cmd[i].kd = 3.5
t = 0.0
while True:
    t += 0.002
    cmd.motor_cmd[22].q = 0.5 * math.sin(2 * math.pi * 0.5 * t)
    cmd.crc = crc.Crc(cmd)
    pub.Write(cmd)
    time.sleep(0.002)
"</code>
        </div>
        <p style="margin-top:0.75rem; color: var(--accent);">✓ Right arm waves in the simulator. Verified working April 10, 2026.</p>
      </div>
    </div>

    <div class="setup-phase">
      <div class="phase-header">
        <span class="phase-num">07</span>
        <span class="phase-title">Sim → Real Hardware (When Robot Arrives)</span>
      </div>
      <div class="phase-body">
        <p>The exact same Python code runs on the physical G1. Two changes only:</p>
        <div class="cmd-block">
          <span class="cmd-label">Connect to real G1 via ethernet — change these two values</span>
          <code>ChannelFactoryInitialize(0, 'eth0')   # 'lo' → 'eth0'</code>
          <code>export UNITREE_SDK2_DOMAIN_ID=0       # same — real robot uses domain 0</code>
        </div>
        <p style="margin-top:0.75rem;">For high-level commands (stand, walk, wave) use the loco client:</p>
        <div class="cmd-block">
          <span class="cmd-label">High-level loco client (real hardware only)</span>
          <code>python3 ~/unitree_ws/unitree_sdk2_python/example/g1/high_level/g1_loco_client_example.py eth0</code>
        </div>
        <p style="margin-top:0.75rem; color: var(--accent);">Type <strong>list</strong> to see all commands: StandUp2Squat, move forward, wave hand, shake hand, and more.</p>
      </div>
    </div>

    <div class="setup-callout">
      <div class="callout-title">Daily Startup (30 seconds)</div>
      <div class="cmd-block">
        <code>source ~/unitree_env/bin/activate</code>
        <code>export PYGLFW_LIBRARY=/usr/lib/x86_64-linux-gnu/libglfw.so.3</code>
        <code>export UNITREE_SDK2_DOMAIN_ID=0</code>
        <code>cd ~/unitree_ws/unitree-g1-mujoco && python3 run_sim.py</code>
      </div>
    </div>

    <style>
      .setup-warning {
        background: rgba(255,180,0,0.1);
        border-left: 3px solid #ffb400;
        padding: 1rem 1.25rem;
        margin-bottom: 2rem;
        font-size: 0.875rem;
        line-height: 1.6;
        color: #ffb400;
      }
      .setup-phase {
        border: 1px solid rgba(255,255,255,0.08);
        margin-bottom: 1.5rem;
        border-radius: 4px;
        overflow: hidden;
      }
      .phase-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.875rem 1.25rem;
        background: rgba(255,255,255,0.04);
        border-bottom: 1px solid rgba(255,255,255,0.06);
      }
      .phase-num {
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        color: var(--accent);
        opacity: 0.7;
      }
      .phase-title {
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--text);
      }
      .phase-body {
        padding: 1.25rem;
      }
      .phase-body p {
        font-size: 0.875rem;
        line-height: 1.7;
        color: var(--text-muted);
        margin-bottom: 0.875rem;
      }
      .cmd-block {
        background: rgba(0,0,0,0.4);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 4px;
        padding: 0.875rem 1rem;
        margin-bottom: 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }
      .cmd-label {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: rgba(255,255,255,0.3);
        margin-bottom: 0.25rem;
      }
      .cmd-block code {
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 0.78rem;
        color: #7dd3a8;
        white-space: pre-wrap;
        word-break: break-all;
        background: none;
        padding: 0;
        line-height: 1.5;
      }
      .setup-callout {
        background: rgba(100,200,150,0.06);
        border: 1px solid rgba(100,200,150,0.2);
        border-radius: 4px;
        padding: 1.25rem;
        margin-top: 2rem;
      }
      .callout-title {
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #7dd3a8;
        font-weight: 700;
        margin-bottom: 0.875rem;
      }
    </style>
  `;
}
