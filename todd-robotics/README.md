# todd-robotics

> Houston humanoid robotics co-venture — Peter Haggard + Todd Linton

Part of the [builtindays](https://builtindays.co) portfolio.

---

## What This Is

A co-founder deployment business built on the Unitree G1 humanoid robot platform.
Equal partners. $8K each. Houston first mover. Three revenue layers:

1. **Skill Library Marketplace** — App Store model for humanoid robot skills (20–30% licensing cut)
2. **Developer Rental Sessions** — $200–300/hr physical robot access for SDK developers
3. **Teleoperation + Events** — Hotel lobbies, corporate events, $1,500–2,500/booking

Zero humanoid competition in Houston as of April 2026.

---

## Repository Structure

```
todd-robotics/
├── README.md               ← you are here
├── .gitignore
└── investment-deck/        ← interactive investment model (open index.html)
    ├── index.html
    ├── styles.css
    ├── README.md           ← developer guide for the deck
    └── js/
        ├── config.js       ← all data lives here
        ├── utils.js
        ├── charts.js
        ├── nav.js
        ├── app.js
        ├── robot-image.js  ← paste base64 robot screenshot here
        └── pages/
            ├── overview.js
            ├── robot.js
            ├── returns.js
            ├── tiers.js
            ├── questions.js
            ├── houston.js
            ├── week1.js
            └── roadmap.js
```

---

## Quick Start

```bash
# No install needed — open directly in browser
open investment-deck/index.html
```

Or serve locally for development:
```bash
npx serve .
# visit http://localhost:3000/investment-deck
```

---

## Key Numbers

| Item | Value |
|---|---|
| Each partner in | $8,000 |
| Total investment | $16,000 |
| Revenue split | 50 / 50 |
| Break-even (base case) | Month 4 |
| Robot | Unitree G1 Base |
| Ships | 2 days · RoboStore NY · 855-285-7626 |
| Houston competition | Zero |

---

## Status

- [ ] Partner agreement signed
- [ ] G1 ordered
- [ ] COSA-lite integrated with G1 SDK
- [ ] Post Oak Hotel pilot booked
- [ ] First developer rental session
- [ ] First paid event booking

---

## Built With

- Unitree G1 SDK (Python + C++ + ROS2)
- OpenMind OM1 skill marketplace layer
- COSA-lite cognitive OS (Peter's stack)
- MuJoCo physics simulation (dev environment)

---

*Built by [BuiltInDays](https://builtindays.co) · Houston, TX · April 2026*
