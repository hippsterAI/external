"""
G1 Robot Greeter Script
=======================
Uses Unitree SDK2 Python to execute a full greeting sequence.

Based on official Unitree G1 SDK docs:
  - Sport Services Interface  (LocoClient)
  - Arm Action Interface      (ArmAction / ExecuteAction)

Requirements:
  - G1 EDU unit (SDK requires EDU version)
  - Firmware v1.3.0 or higher
  - unitree_sdk2_python installed
  - Robot must be ON and in normal standing mode before running

Usage:
  python3 g1_greeter.py <network_interface>
  Example: python3 g1_greeter.py eth0

ARM ACTION IDs (from official docs):
  99  = Recover Initial Arm Pose
  11  = Double Hand Flying Kiss
  12  = Single Hand Flying Kiss
  15  = Arms Horizontal
  17  = Applause
  18  = High Five
  19  = Hug
  20  = Double Hand Heart
  21  = Single Hand Heart
  22  = Double Hand Cross
  23  = Right Hand Horizontal
  24  = Dynamic Light Wave
  25  = Wave Hand in Front Chest
  26  = Wave Hand High
  27  = Handshake
"""

import sys
import time

from unitree_sdk2py.core.channel import ChannelFactory
from unitree_sdk2py.g1.loco.g1_loco_client import LocoClient
from unitree_sdk2py.g1.arm.g1_arm_action_client import ArmActionClient


# ─────────────────────────────────────────────
# ARM ACTION IDs
# ─────────────────────────────────────────────
ARM_RECOVER         = 99
ARM_WAVE_HIGH       = 26
ARM_WAVE_CHEST      = 25
ARM_DYNAMIC_WAVE    = 24
ARM_HANDSHAKE       = 27
ARM_APPLAUSE        = 17
ARM_FLYING_KISS     = 11
ARM_ARMS_HORIZONTAL = 15
ARM_DOUBLE_HEART    = 20


def init_robot(network_interface: str):
    """Initialize DDS channel and both clients."""
    print(f"[INIT] Connecting on interface: {network_interface}")
    ChannelFactory.Instance().Init(0, network_interface)

    loco = LocoClient()
    loco.SetTimeout(10.0)
    loco.Init()

    arm = ArmActionClient()
    arm.SetTimeout(10.0)
    arm.Init()

    print("[INIT] Connected.")
    return loco, arm


def safe_arm(arm: ArmActionClient, action_id: int, label: str):
    """Execute arm action with error handling."""
    print(f"[ARM] {label} (ID: {action_id})")
    ret = arm.ExecuteAction(action_id)
    if ret == 0:
        print(f"[ARM] ✓ {label} complete")
    elif ret == 7400:
        print(f"[ARM] ✗ Topic occupied — another action is running")
    elif ret == 7401:
        print(f"[ARM] ✗ Arm is raised — recovering first")
        arm.ExecuteAction(ARM_RECOVER)
        time.sleep(2)
        arm.ExecuteAction(action_id)
    elif ret == 7402:
        print(f"[ARM] ✗ Action ID {action_id} does not exist in current firmware")
    elif ret == 7404:
        print(f"[ARM] ✗ Cannot trigger this action in current FSM mode")
    else:
        print(f"[ARM] ✗ Error code: {ret}")


def greet_standard(loco: LocoClient, arm: ArmActionClient):
    """
    Standard greeter sequence:
    Stand tall → Wave high → pause → Handshake pose
    """
    print("\n=== STANDARD GREET ===")

    # 1. Make sure robot is standing
    print("[LOCO] Standing up...")
    loco.StandUp()
    time.sleep(2)

    # 2. Stop any movement before arm actions
    loco.StopMove()
    time.sleep(0.5)

    # 3. Wave high (attention grab)
    safe_arm(arm, ARM_WAVE_HIGH, "Wave Hand High")
    time.sleep(1)

    # 4. Handshake pose (person approaches)
    safe_arm(arm, ARM_HANDSHAKE, "Handshake")
    time.sleep(1)

    # 5. Recover arms to neutral
    safe_arm(arm, ARM_RECOVER, "Recover Arm Pose")
    print("=== GREET COMPLETE ===\n")


def greet_enthusiastic(loco: LocoClient, arm: ArmActionClient):
    """
    Enthusiastic greeter sequence:
    Wave → Dynamic wave → Applause
    Good for event entrances, high-energy moments.
    """
    print("\n=== ENTHUSIASTIC GREET ===")

    loco.StandUp()
    time.sleep(2)
    loco.StopMove()
    time.sleep(0.5)

    safe_arm(arm, ARM_WAVE_HIGH, "Wave Hand High")
    time.sleep(0.5)
    safe_arm(arm, ARM_DYNAMIC_WAVE, "Dynamic Light Wave")
    time.sleep(0.5)
    safe_arm(arm, ARM_APPLAUSE, "Applause")
    time.sleep(1)
    safe_arm(arm, ARM_RECOVER, "Recover Arm Pose")

    print("=== GREET COMPLETE ===\n")


def greet_vip(loco: LocoClient, arm: ArmActionClient):
    """
    VIP / luxury greeter:
    Arms horizontal (formal presentation pose) → Flying kiss → Recover
    Good for upscale venues like Post Oak.
    """
    print("\n=== VIP GREET ===")

    loco.StandUp()
    time.sleep(2)
    loco.StopMove()
    time.sleep(0.5)

    safe_arm(arm, ARM_ARMS_HORIZONTAL, "Arms Horizontal")
    time.sleep(2)
    safe_arm(arm, ARM_FLYING_KISS, "Double Hand Flying Kiss")
    time.sleep(1)
    safe_arm(arm, ARM_RECOVER, "Recover Arm Pose")

    print("=== GREET COMPLETE ===\n")


def list_available_actions(arm: ArmActionClient):
    """Print all actions available in current firmware."""
    print("\n[INFO] Fetching available actions from firmware...")
    data = ""
    ret = arm.GetActionList(data)
    if ret == 0:
        print("[INFO] Available actions:")
        print(data)
    else:
        print(f"[INFO] Could not retrieve action list. Error: {ret}")


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 g1_greeter.py <network_interface>")
        print("Example: python3 g1_greeter.py eth0")
        sys.exit(1)

    network_interface = sys.argv[1]

    loco, arm = init_robot(network_interface)

    # Print what's available in your firmware first
    list_available_actions(arm)

    print("\nSelect greeting mode:")
    print("  1 = Standard Greet (wave + handshake)")
    print("  2 = Enthusiastic Greet (wave + dynamic + applause)")
    print("  3 = VIP Greet (formal + flying kiss)")
    print("  q = Quit")

    while True:
        choice = input("\nEnter choice: ").strip().lower()

        if choice == "1":
            greet_standard(loco, arm)
        elif choice == "2":
            greet_enthusiastic(loco, arm)
        elif choice == "3":
            greet_vip(loco, arm)
        elif choice == "q":
            print("[EXIT] Recovering arms and damping...")
            arm.ExecuteAction(ARM_RECOVER)
            time.sleep(2)
            loco.Damp()
            print("[EXIT] Done.")
            break
        else:
            print("Invalid choice. Enter 1, 2, 3, or q.")


if __name__ == "__main__":
    main()
