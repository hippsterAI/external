/**
 * config.js — All static data, constants, and navigation structure.
 * Edit this file to change investment assumptions, targets, or nav items.
 */

// ── INVESTMENT DEFAULTS ──────────────────────────────────────────────────────
window.DEFAULTS = {
  bookings:  6,       // monthly bookings
  avgRev:    1800,    // avg revenue per booking ($)
  opsCost:   600,     // monthly operating cost ($)
  fleetGrow: 1,       // robots added per year
  invest:    16000,   // total investment ($)
  split:     0.5,     // partner revenue split
};

// ── SCENARIO DEFINITIONS ─────────────────────────────────────────────────────
window.SCENARIOS = [
  { label: 'Bear', bookings: 2,  avgRev: 1000, opsCost: 400,  fleetGrow: 0, color: '#ef4444', tagClass: 'r' },
  { label: 'Base', bookings: 6,  avgRev: 1800, opsCost: 600,  fleetGrow: 1, color: '#60a5fa', tagClass: 'b' },
  { label: 'Bull', bookings: 10, avgRev: 2200, opsCost: 800,  fleetGrow: 1, color: '#00e5a0', tagClass: 'g' },
  { label: 'Moon', bookings: 18, avgRev: 3000, opsCost: 1200, fleetGrow: 2, color: '#f59e0b', tagClass: 'gold' },

window.QA_DATA = [
  {
    section: 'The robot',
    questions: [
      {
        n: '01', q: 'Why the $16K G1 and not the $5,900 R1?',
        a: `The R1 SDK cannot support custom skill libraries — the entire business. G1 has full open SDK (Python, C++, ROS2), 2-hr battery, ships from US stock in 2 days. The $10K delta is non-negotiable.`,
      },
      {
        n: '02', q: 'What does it actually do on Day 1?',
        a: `Walk, balance, wave, voice interaction — all built in. Teleoperation via SDK works immediately. Custom skill execution takes 1–2 weeks to configure. <span class="qred">Not capable</span> of warehouse labor at this price.`,
      },
      {
        n: '03', q: 'Battery life? Can it swap its own battery?',
        a: `<strong>~2 hours active.</strong> No self-swap — operator does it in 30 seconds. A second battery (~$500) means back-to-back sessions with zero downtime.`,
      },
      {
        n: '04', q: 'Does it learn by doing?',
        a: `Yes. <strong>Imitation learning built in</strong> — show it a task once, it records and improves over repetition. Skill library compounds in value over time. MIT, Stanford, CMU all run on this platform.`,
      },
      {
        n: '05', q: 'What SDK comes with it?',
        a: `<strong>Python + C++ + ROS2</strong>, fully open source. Full motion control, arm manipulation, natural language via onboard LLM, VR teleoperation, imitation learning.`,
      },
    ],
  },
  {
    section: 'Business model',
    questions: [
      {
        n: '06', q: 'What is the actual business — just robot rentals?',
        a: `<span class="pill-a">① Skill marketplace</span> devs upload skills, we take 20–30% of every license nationwide. <span class="pill-g">② Developer rentals</span> $200–300/hr. <span class="qblue">③ Events</span> $1K–2.5K per booking. The marketplace is unlimited scale.`,
      },
      {
        n: '07', q: 'Can devs hand us skill libraries and we plug them in?',
        a: `Yes. Dev submits Python/ROS2 package → <strong>safety review</strong> → approved → loaded at session start → dev watches via camera remotely. The approval process is the moat.`,
      },
      {
        n: '08', q: 'Why is the skill marketplace the biggest money?',
        a: `<strong>App Store model.</strong> One skill × 50 operators × $300 = <span class="qgold">$15K</span> from one skill we never wrote. 100 skills = <span class="qgold">$750K+</span> in royalties. OpenMind launched this Jan 2026 — we build on top.`,
      },
      {
        n: '09', q: 'Who is the competition?',
        a: `<span class="pill-g">Houston: zero.</span> Dallas: Robot Studio (same model, CBS covered, $1K+/event, scaling). OpenMind is infrastructure — we build on top of them. We are the deployment operator.`,
      },
    ],
  },
  {
    section: 'The money',
    questions: [
      {
        n: '10', q: 'What is the deal structure?',
        a: `<strong>$8K Peter + $8K Todd = $16K</strong> buys the robot. <strong>50/50 revenue split.</strong> Equal co-founders. Both build. No showroom, no overhead to start.`,
      },
      {
        n: '11', q: "When does Todd get his $8K back?",
        a: `<span class="pill-g">Base case: Month 4.</span> 6 bookings/mo × $1,800 avg = $10,800 gross. After 50/50 split and ops, Todd nets ~$2,250/mo. <span class="qgold">$8K ÷ $2,250 ≈ 4 months.</span> Pure profit after that.`,
      },
      {
        n: '12', q: "Worst case — what if it doesn't work?",
        a: `<span class="pill-r">Bear case:</span> 2 bookings/mo at $1K. Todd recoups by Year 3. Robot sells used for $10–12K. <strong>Realistic max loss: ~$4K each.</strong> Contained downside. Real upside.`,
      },
      {
        n: '13', q: 'Year 3 if it works?',
        a: `<span class="pill-a">Bull case:</span> 8–10 robot fleet, Houston + Austin + Dallas, marketplace royalties, SaaS layer live. <strong>$1M–2M revenue. Both partners clearing $500K+/yr.</strong>`,
      },
    ],
  },
  {
    section: 'Execution',
    questions: [
      {
        n: '14', q: 'What happens Week 1 after yes?',
        a: `Day 1: order G1 from RoboStore (855-285-7626) — ships same day. Day 3: arrives. Day 5: SDK connected, 4 routines programmed. <strong>Day 7: email Post Oak Hotel</strong> — free 2-week lobby pilot. Film everything.`,
      },
      {
        n: '15', q: "Is this just Peter's project — what does Todd actually build?",
        a: `<strong>Both build.</strong> Peter: hardware ops + cognitive/approval layer. Todd: platform development layer. $8K each. 50/50 ownership. Co-founder venture — not a passive investment.`,
      },
    ],
  },
  {
    section: 'Hardware & Longevity',
    questions: [
      {
        n: '16', q: 'Hardware goes out of date in 2-3 years — do our skill libraries survive?',
        a: `<strong>Yes — and this is the whole point.</strong> Our libraries are written in Python and ROS2, not tied to any specific robot body. When Unitree releases G2 or G3, we port our skills in days, not months. The <span class="qgold">software is the asset</span> — the hardware is just the vehicle it runs on. We will swap robots every 2-3 years the same way you swap phones. The skill marketplace keeps earning regardless of which generation we're running.`,
      },
      {
        n: '17', q: 'What happens to our investment when we upgrade hardware?',
        a: `<strong>Hardware cost drops, skill value compounds.</strong> The G1 is $16K today. In 2 years the equivalent robot will be $8-10K with better specs — Unitree drops prices 30-40% per generation. Meanwhile our approved skill library is worth <span class="qgold">more</span> with each passing month because more developers are building on it. We budget hardware refresh as a line item — funded from operating revenue, not new capital.`,
      },
      {
        n: '18', q: 'Are we locked into Unitree specifically?',
        a: `No. Our stack runs on <strong>ROS2</strong> — the universal robotics operating system used by Boston Dynamics, Figure, Agility, and every serious humanoid manufacturer. If Unitree disappears tomorrow, we migrate to the next platform. The skill marketplace, the developer relationships, the approval process, the customer base — <span class="qgold">none of that lives on the robot</span>. That is the moat.`,
      },
    ],
  },
];
