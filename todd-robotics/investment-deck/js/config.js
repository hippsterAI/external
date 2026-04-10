/**
 * config.js — All static data, constants, and navigation structure.
 * Edit this file to change investment assumptions, targets, or nav items.
 */

// ── INVESTMENT DEFAULTS ──────────────────────────────────────────────────────
window.DEFAULTS = {
  bookings:  6,
  avgRev:    1800,
  opsCost:   600,
  fleetGrow: 1,
  invest:    16000,
  split:     0.5,
};

// ── SCENARIO DEFINITIONS ─────────────────────────────────────────────────────
window.SCENARIOS = [
  { label: 'Bear', bookings: 2,  avgRev: 1000, opsCost: 400,  fleetGrow: 0, color: '#ef4444', tagClass: 'r' },
  { label: 'Base', bookings: 6,  avgRev: 1800, opsCost: 600,  fleetGrow: 1, color: '#60a5fa', tagClass: 'b' },
  { label: 'Bull', bookings: 10, avgRev: 2200, opsCost: 800,  fleetGrow: 1, color: '#00e5a0', tagClass: 'g' },
  { label: 'Moon', bookings: 18, avgRev: 3000, opsCost: 1200, fleetGrow: 2, color: '#f59e0b', tagClass: 'gold' },
];

// ── NAVIGATION STRUCTURE ─────────────────────────────────────────────────────
window.NAV_ITEMS = [
  { group: 'Start Here', items: [
    { id: 'overview', icon: '◈', label: 'Overview'       },
    { id: 'robot',    icon: '⬡', label: 'The Robot'      },
    { id: 'returns',  icon: '$', label: 'Your Returns'   },
  ]},
  { group: 'The Business', items: [
    { id: 'tiers',     icon: '▲', label: 'Revenue Tiers'  },
    { id: 'questions', icon: '?', label: 'Your Questions' },
    { id: 'houston',   icon: '◎', label: 'Houston Targets'},
  ]},
  { group: 'Execution', items: [
    { id: 'week1',    icon: '→', label: 'Week 1 Plan'    },
    { id: 'roadmap',  icon: '↗', label: 'Roadmap'        },
    { id: 'setup',    icon: '⚙', label: 'G1 Setup Guide' },
    { id: 'usecases', icon: '◉', label: 'Use Cases'      },
  ]},
];

// ── HOUSTON TARGET SECTORS ───────────────────────────────────────────────────
window.HOUSTON_SECTORS = [
  {
    icon: '🏨', title: 'Luxury Hotels — Tier 1 Targets',
    targets: [
      'The Post Oak Hotel',
      'Four Seasons Houston',
      'Hotel Granduca Houston',
      'Thompson Houston — influencer crowd, goes viral',
      'St. Regis, JW Marriott, Laura Hotel',
    ],
  },
  {
    icon: '🏥', title: "Texas Medical Center — World's Largest",
    targets: [
      'Houston Methodist — 8,400 employees',
      'MD Anderson — 18,000 international patients/year',
      'Memorial Hermann — 50,000+ ER visits/year',
      "Texas Children's Hospital — #3 in US",
      'TMC Innovation Hub — 400+ biotech startups',
    ],
  },
  {
    icon: '⚡', title: 'Energy Sector',
    targets: [
      'Shell USA Houston HQ',
      'ExxonMobil Spring Campus — 10,000+ employees',
      'ConocoPhillips Houston HQ',
      'Halliburton Innovation Lab',
      'Baker Hughes — $2B+ annual R&D spend',
    ],
  },
  {
    icon: '🏟', title: 'Venues + Events',
    targets: [
      'George R. Brown Convention Center — 2M sq ft',
      'Space Center Houston — 2M visitors/year',
      'The Galleria — 30M visitors/year',
      'IAH George Bush Airport — 50M passengers/year',
    ],
  },
];

// ── WEEK 1 PLAN STEPS ────────────────────────────────────────────────────────
window.WEEK1_STEPS = [
  {
    day: 'Day 1', title: 'Both Partners Commit', color: 'var(--accent)',
    items: [
      'Both confirm $8K each — $16K total',
      '50/50 co-founder agreement',
      'Peter calls RoboStore: 855-285-7626',
      'Order Unitree G1 base',
    ],
  },
  {
    day: 'Day 2-3', title: 'Robot Ships — Peter Builds', color: 'var(--gold)',
    items: [
      'G1 ships from RoboStore NY same day',
      'Peter preps COSA-lite integration',
      'Draft Post Oak Hotel pilot email',
      'Get event insurance quote ~$100/mo',
    ],
  },
  {
    day: 'Day 4-5', title: 'Robot Arrives — First Setup', color: 'var(--gold)',
    items: [
      'Unbox — film everything for social',
      'Connect COSA-lite to G1 SDK',
      'Program 3 reliable demo routines',
      'Post arrival video to LinkedIn + TikTok',
    ],
  },
  {
    day: 'Day 6-7', title: 'First Bookings', color: 'var(--blue)',
    items: [
      'Send Post Oak free 2-week pilot offer',
      'Book first 2 developer rental sessions $200-300/hr',
      'Follow up with InnovationMap — press story',
      'Text Sitepro contact — warm lead',
    ],
  },
  {
    day: 'Week 2', title: 'First Revenue', color: 'var(--purple)',
    items: [
      'Post Oak lobby pilot live — film 50+ interactions',
      'First paid developer rental sessions',
      'First corporate event booking $1,500-2,500',
      'InnovationMap story live — Houston first mover',
    ],
  },
];

// ── 3-YEAR ROADMAP ───────────────────────────────────────────────────────────
window.ROADMAP_PHASES = [
  {
    phase: 'Year 1 — Prove It', color: 'var(--accent)',
    milestones: [
      'Order G1 · arrives in 2 days · Peter integrates COSA-lite same week',
      'Post Oak free 2-week pilot · film everything · InnovationMap press story',
      '6-8 bookings/month · developer rental sessions live',
      'Break-even Month 4 · Both partners recover $8K by Month 8-10',
      'Skill submission portal built · first 10 external developers onboarded',
    ],
  },
  {
    phase: 'Year 2 — Scale It', color: 'var(--gold)',
    milestones: [
      '2nd robot from profits · Austin launch — Four Seasons, Fairmont, JW Marriott',
      'Developer rental platform fully operational · 50+ approved libraries',
      'Skill marketplace live · first licensing revenue flowing',
      '$200-400K combined revenue · Both partners clearing $100K+',
      'Dallas market entry · differentiate on software layer, not just events',
    ],
  },
  {
    phase: 'Year 3 — Own Texas', color: 'var(--purple)',
    milestones: [
      '8-10 robot fleet · Houston + Austin + Dallas',
      'Skill marketplace national reach · licensing to operators in other states',
      'COSA-lite SaaS layer — license cognitive OS to other operators',
      '$1M+ combined revenue · Both partners in life-changing territory',
      'Exit options: sell deployment biz · Unitree/LimX US distributor · SaaS license platform',
    ],
  },
];

// ── Q&A DATA ─────────────────────────────────────────────────────────────────
window.QA_DATA = [
  {
    section: 'The robot',
    questions: [
      {
        n: '01', q: 'Why the $16K G1 and not the $5,900 R1?',
        a: 'The R1 SDK cannot support custom skill libraries — the entire business. G1 has full open SDK (Python, C++, ROS2), 2-hr battery, ships from US stock in 2 days. The $10K delta is non-negotiable.',
      },
      {
        n: '02', q: 'What does it actually do on Day 1?',
        a: 'Walk, balance, wave, voice interaction — all built in. Teleoperation via SDK works immediately. Custom skill execution takes 1-2 weeks to configure. Not capable of warehouse labor at this price.',
      },
      {
        n: '03', q: 'Battery life? Can it swap its own battery?',
        a: '~2 hours active. No self-swap — operator does it in 30 seconds. A second battery (~$500) means back-to-back sessions with zero downtime.',
      },
      {
        n: '04', q: 'Does it learn by doing?',
        a: 'Yes. Imitation learning built in — show it a task once, it records and improves over repetition. Skill library compounds in value over time. MIT, Stanford, CMU all run on this platform.',
      },
      {
        n: '05', q: 'What SDK comes with it?',
        a: 'Python + C++ + ROS2, fully open source. Full motion control, arm manipulation, natural language via onboard LLM, VR teleoperation, imitation learning.',
      },
    ],
  },
  {
    section: 'Business model',
    questions: [
      {
        n: '06', q: 'What is the actual business — just robot rentals?',
        a: 'Skill marketplace: devs upload skills, we take 20-30% of every license nationwide. Developer rentals $200-300/hr. Events $1K-2.5K per booking. The marketplace is unlimited scale.',
      },
      {
        n: '07', q: 'Can devs hand us skill libraries and we plug them in?',
        a: 'Yes. Dev submits Python/ROS2 package, safety review, approved, loaded at session start, dev watches via camera remotely. The approval process is the moat.',
      },
      {
        n: '08', q: 'Why is the skill marketplace the biggest money?',
        a: 'App Store model. One skill x 50 operators x $300 = $15K from one skill we never wrote. 100 skills = $750K+ in royalties. OpenMind launched this Jan 2026 — we build on top.',
      },
      {
        n: '09', q: 'Who is the competition?',
        a: 'Houston: zero. Dallas: Robot Studio (same model, CBS covered, $1K+/event, scaling). OpenMind is infrastructure — we build on top of them. We are the deployment operator.',
      },
    ],
  },
  {
    section: 'The money',
    questions: [
      {
        n: '10', q: 'What is the deal structure?',
        a: '$8K Peter + $8K Todd = $16K buys the robot. 50/50 revenue split. Equal co-founders. Both build. No showroom, no overhead to start.',
      },
      {
        n: '11', q: 'When does Todd get his $8K back?',
        a: 'Base case: Month 4. 6 bookings/mo x $1,800 avg = $10,800 gross. After 50/50 split and ops, Todd nets ~$2,250/mo. $8K divided by $2,250 = 4 months. Pure profit after that.',
      },
      {
        n: '12', q: "Worst case — what if it doesn't work?",
        a: 'Bear case: 2 bookings/mo at $1K. Todd recoups by Year 3. Robot sells used for $10-12K. Realistic max loss: ~$4K each. Contained downside. Real upside.',
      },
      {
        n: '13', q: 'Year 3 if it works?',
        a: 'Bull case: 8-10 robot fleet, Houston + Austin + Dallas, marketplace royalties, SaaS layer live. $1M-2M revenue. Both partners clearing $500K+/yr.',
      },
    ],
  },
  {
    section: 'Execution',
    questions: [
      {
        n: '14', q: 'What happens Week 1 after yes?',
        a: 'Day 1: order G1 from RoboStore (855-285-7626) — ships same day. Day 3: arrives. Day 5: SDK connected, 4 routines programmed. Day 7: email Post Oak Hotel — free 2-week lobby pilot. Film everything.',
      },
      {
        n: '15', q: "Is this just Peter's project — what does Todd actually build?",
        a: 'Both build. Peter: hardware ops + cognitive/approval layer. Todd: platform development layer. $8K each. 50/50 ownership. Co-founder venture — not a passive investment.',
      },
    ],
  },
  {
    section: 'Hardware & Longevity',
    questions: [
      {
        n: '16', q: 'Will our skill libraries still work when the G1 is replaced by G2 or G3?',
        a: 'Yes. Skills are written in Python + ROS2 — the universal robotics standard. When Unitree releases G2, we repoint the SDK. The skill library transfers. Software compounds. Hardware is replaceable.',
      },
      {
        n: '17', q: 'What happens to our investment when hardware gets cheaper?',
        a: 'It gets better. G1 drops 30-40% per generation — same as every hardware cycle. Our skill library grows in value simultaneously. By Year 3 we buy G2 at $10K and our library runs on it day one. Early operators always win.',
      },
      {
        n: '18', q: 'Are we locked into Unitree?',
        a: 'No. The entire stack — Python, ROS2, DDS — is open standard. Skills run on any ROS2-compatible humanoid: Unitree, Agility, Figure, Boston Dynamics. We are not locked in. The platform is the asset.',
      },
    ],
  },
];
