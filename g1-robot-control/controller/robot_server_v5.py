"""
G1 Robot Server v5
==================
Run with:
  source ~/unitree_env/bin/activate
  export UNITREE_SDK2_DOMAIN_ID=0
  cd ~/unitree_ws/unitree-g1-mujoco
  python3 robot_server_v5.py

Controller HTML connects to localhost:8765
"""

import http.server, threading, time, math
from unitree_sdk2py.core.channel import ChannelPublisher, ChannelFactoryInitialize
from unitree_sdk2py.idl.default import unitree_hg_msg_dds__LowCmd_
from unitree_sdk2py.idl.unitree_hg.msg.dds_ import LowCmd_
from unitree_sdk2py.utils.crc import CRC

# ── Init ──────────────────────────────────────────────────
ChannelFactoryInitialize(0, 'lo')
pub = ChannelPublisher('rt/lowcmd', LowCmd_)
pub.Init()
crc = CRC()

cmd = unitree_hg_msg_dds__LowCmd_()
cmd.mode_pr = 0
cmd.mode_machine = 0
for i in range(35):
    cmd.motor_cmd[i].mode = 1
    cmd.motor_cmd[i].kp   = 80.0
    cmd.motor_cmd[i].kd   = 3.5

# ── Shared state ──────────────────────────────────────────
state = {'move': 'stand', 't': 0.0, 'running': True}

# ── JOINT INDEX REFERENCE (G1 29DOF) ─────────────────────
# 0  left_hip_pitch        6  right_hip_pitch
# 1  left_hip_roll         7  right_hip_roll
# 2  left_hip_yaw          8  right_hip_yaw
# 3  left_knee             9  right_knee
# 4  left_ankle_pitch     10  right_ankle_pitch
# 5  left_ankle_roll      11  right_ankle_roll
# 12 waist_yaw
# 13 waist_roll
# 14 waist_pitch          (forward lean)
# 15 L_shoulder_pitch     22  R_shoulder_pitch
# 16 L_shoulder_roll      23  R_shoulder_roll
# 17 L_shoulder_yaw       24  R_shoulder_yaw
# 18 L_elbow_pitch        25  R_elbow_pitch
# 19 L_elbow_roll         26  R_elbow_roll
# 20 L_wrist_pitch        27  R_wrist_pitch
# 21 L_wrist_yaw          28  R_wrist_yaw

# ── Robot loop ───────────────────────────────────────────
def robot_loop():
    while state['running']:
        state['t'] += 0.002
        t = state['t']

        # Reset all joints to neutral
        for i in range(35):
            cmd.motor_cmd[i].q = 0.0

        m = state['move']

        # ── Original moves ──────────────────────────────
        if m == 'wave_r':
            cmd.motor_cmd[22].q =  0.5 * math.sin(2 * math.pi * 0.5 * t)
            cmd.motor_cmd[25].q =  0.4 + 0.3 * math.sin(2 * math.pi * 0.5 * t)

        elif m == 'wave_l':
            cmd.motor_cmd[15].q =  0.5 * math.sin(2 * math.pi * 0.5 * t)
            cmd.motor_cmd[18].q =  0.4 + 0.3 * math.sin(2 * math.pi * 0.5 * t)

        elif m == 'arms_out':
            v = 0.5 * abs(math.sin(2 * math.pi * 0.4 * t))
            cmd.motor_cmd[16].q =  v
            cmd.motor_cmd[23].q = -v

        elif m == 'squat':
            sq = 0.6 * abs(math.sin(2 * math.pi * 0.25 * t))
            cmd.motor_cmd[0].q  = -0.4 - sq * 0.6
            cmd.motor_cmd[6].q  = -0.4 - sq * 0.6
            cmd.motor_cmd[3].q  =  0.8 + sq * 1.2
            cmd.motor_cmd[9].q  =  0.8 + sq * 1.2
            cmd.motor_cmd[4].q  = -0.3 - sq * 0.4
            cmd.motor_cmd[10].q = -0.3 - sq * 0.4

        elif m == 'bow':
            lean = 0.4 * abs(math.sin(2 * math.pi * 0.2 * t))
            cmd.motor_cmd[14].q =  lean * 1.2
            cmd.motor_cmd[0].q  = -0.2 - lean * 0.4
            cmd.motor_cmd[6].q  = -0.2 - lean * 0.4
            cmd.motor_cmd[3].q  =  0.4 + lean * 0.3
            cmd.motor_cmd[9].q  =  0.4 + lean * 0.3

        # ── Greeter arm actions (joint-level) ───────────
        elif m == 'wave_high':
            # Right arm raised high, waving
            cmd.motor_cmd[22].q = -0.8 + 0.4 * math.sin(2 * math.pi * 0.8 * t)
            cmd.motor_cmd[23].q = -0.3
            cmd.motor_cmd[25].q =  0.5 + 0.3 * math.sin(2 * math.pi * 0.8 * t)

        elif m == 'handshake':
            # Right arm extended forward at handshake height
            cmd.motor_cmd[22].q =  0.3
            cmd.motor_cmd[23].q = -0.2
            cmd.motor_cmd[25].q =  0.6

        elif m == 'applause':
            # Both arms in front, clapping motion
            clap = 0.3 * abs(math.sin(2 * math.pi * 1.5 * t))
            cmd.motor_cmd[15].q =  0.4
            cmd.motor_cmd[22].q =  0.4
            cmd.motor_cmd[16].q =  clap
            cmd.motor_cmd[23].q = -clap
            cmd.motor_cmd[18].q =  0.5
            cmd.motor_cmd[25].q =  0.5

        elif m == 'dynamic_wave':
            # Smooth flowing wave — both arms alternating
            cmd.motor_cmd[15].q =  0.4 * math.sin(2 * math.pi * 0.5 * t)
            cmd.motor_cmd[22].q =  0.4 * math.sin(2 * math.pi * 0.5 * t + math.pi)
            cmd.motor_cmd[16].q =  0.2 * math.sin(2 * math.pi * 0.5 * t)
            cmd.motor_cmd[23].q = -0.2 * math.sin(2 * math.pi * 0.5 * t)

        elif m == 'high_five':
            # Right arm raised, palm forward
            cmd.motor_cmd[22].q = -0.9
            cmd.motor_cmd[23].q = -0.3
            cmd.motor_cmd[25].q =  0.3

        elif m == 'flying_kiss':
            # Right hand raised to mouth then outward
            phase = (math.sin(2 * math.pi * 0.4 * t) + 1) / 2
            cmd.motor_cmd[22].q = -0.3 - 0.4 * phase
            cmd.motor_cmd[25].q =  0.6 + 0.3 * phase
            cmd.motor_cmd[24].q =  0.3 * phase

        elif m == 'double_heart':
            # Both arms crossed at chest in heart shape
            pulse = 0.1 * math.sin(2 * math.pi * 1.0 * t)
            cmd.motor_cmd[15].q =  0.5 + pulse
            cmd.motor_cmd[22].q =  0.5 + pulse
            cmd.motor_cmd[16].q =  0.4
            cmd.motor_cmd[23].q = -0.4
            cmd.motor_cmd[18].q =  0.8
            cmd.motor_cmd[25].q =  0.8

        elif m == 'hug':
            # Both arms open wide, inviting hug
            spread = 0.6 + 0.2 * math.sin(2 * math.pi * 0.3 * t)
            cmd.motor_cmd[15].q =  0.3
            cmd.motor_cmd[22].q =  0.3
            cmd.motor_cmd[16].q =  spread
            cmd.motor_cmd[23].q = -spread

        elif m == 'arm_recover':
            # All arms back to neutral (zeros = stand)
            pass  # all joints already zeroed above

        # ── Greeter sequences (run in separate thread) ──
        # These are handled by run_greet_* functions below
        # 'stand' = all zeros (default)

        cmd.crc = crc.Crc(cmd)
        pub.Write(cmd)
        time.sleep(0.002)


# ── Sequence runners ─────────────────────────────────────
def run_demo():
    for move, dur in [
        ('stand', 2), ('wave_r', 3), ('stand', 0.5),
        ('wave_l', 3), ('stand', 0.5), ('arms_out', 2.5),
        ('stand', 0.5), ('bow', 3), ('stand', 0.5),
        ('squat', 4), ('stand', 1)
    ]:
        state['move'] = move
        time.sleep(dur)
    state['move'] = 'stand'


def run_greet_standard():
    """Stand → Wave High → Handshake → Recover"""
    for move, dur in [
        ('stand', 1.5),
        ('wave_high', 3.0),
        ('stand', 0.5),
        ('handshake', 2.5),
        ('arm_recover', 1.0),
        ('stand', 1.0),
    ]:
        state['move'] = move
        time.sleep(dur)
    state['move'] = 'stand'


def run_greet_enthusiastic():
    """Wave High → Dynamic Wave → Applause → Recover"""
    for move, dur in [
        ('stand', 1.0),
        ('wave_high', 2.5),
        ('dynamic_wave', 3.0),
        ('applause', 3.0),
        ('arm_recover', 1.0),
        ('stand', 1.0),
    ]:
        state['move'] = move
        time.sleep(dur)
    state['move'] = 'stand'


def run_greet_vip():
    """Arms Horizontal (hug open) → Flying Kiss → Recover"""
    for move, dur in [
        ('stand', 1.0),
        ('hug', 3.0),
        ('stand', 0.5),
        ('flying_kiss', 3.5),
        ('arm_recover', 1.0),
        ('stand', 1.0),
    ]:
        state['move'] = move
        time.sleep(dur)
    state['move'] = 'stand'


# ── HTTP Handler ─────────────────────────────────────────
SEQUENCE_MAP = {
    'greet_standard':    run_greet_standard,
    'greet_enthusiastic': run_greet_enthusiastic,
    'greet_vip':         run_greet_vip,
    'demo':              run_demo,
}

class H(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        move = self.path.strip('/')
        if move in SEQUENCE_MAP:
            threading.Thread(target=SEQUENCE_MAP[move], daemon=True).start()
        elif move == 'ping':
            pass  # just return 200
        elif move:
            state['move'] = move
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(b'ok')

    def log_message(self, *a):
        pass  # suppress access logs


# ── Start ────────────────────────────────────────────────
threading.Thread(target=robot_loop, daemon=True).start()
print('Robot server v5 ready on port 8765')
print('Greeter routes: /greet_standard  /greet_enthusiastic  /greet_vip')
print('Arm actions:    /wave_high  /handshake  /applause  /dynamic_wave')
print('                /high_five  /flying_kiss  /double_heart  /hug  /arm_recover')
http.server.HTTPServer(('localhost', 8765), H).serve_forever()
