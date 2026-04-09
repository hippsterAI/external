# Houston Robotics Investment Model

Interactive investment deck for the Peter + Todd Houston Robotics co-venture.
Open `index.html` directly in a browser — no build step, no server required.

---

## File Structure

```
houston-robotics/
├── index.html              ← HTML shell — just structure, no logic
├── styles.css              ← All CSS (design tokens at top)
├── README.md
└── js/
    ├── config.js           ← ★ ALL DATA LIVES HERE — edit to update content
    ├── utils.js            ← Shared helpers (fmt, calcRev, kpi, hbox, card…)
    ├── charts.js           ← Chart.js management + chart builders
    ├── nav.js              ← Sidebar renderer + page router
    ├── robot-image.js      ← Robot screenshot (base64) — see below
    ├── app.js              ← Page registry + boot
    └── pages/
        ├── overview.js
        ├── robot.js
        ├── returns.js      ← Slider calculator + updateReturns()
        ├── tiers.js
        ├── questions.js
        ├── houston.js
        ├── week1.js
        └── roadmap.js
```

---

## Common Tasks

### Update investment assumptions
Edit `js/config.js` → `window.DEFAULTS`:
```js
window.DEFAULTS = {
  bookings:  6,     // monthly bookings
  avgRev:    1800,  // avg revenue per booking ($)
  opsCost:   600,   // monthly operating cost ($)
  fleetGrow: 1,     // robots added per year
  invest:    16000, // total investment ($)
  split:     0.5,   // partner revenue split
};
```

### Add a Q&A question
Edit `js/config.js` → `window.QA_DATA`. Add to the appropriate section:
```js
{
  n: '16', q: 'Your new question?',
  a: `Your answer here with <strong>bold</strong> and <span class="qgold">gold</span> text.`,
},
```

### Add a Houston target
Edit `js/config.js` → `window.HOUSTON_SECTORS`. Add to a sector's `targets` array,
or add a new sector object:
```js
{
  icon: '🏫', title: 'Universities',
  targets: ['Rice University', 'University of Houston'],
},
```

### Add a new page
1. Add entry to `window.NAV_ITEMS` in `config.js`:
   ```js
   { id: 'mypage', icon: '★', label: 'My Page' }
   ```
2. Create `js/pages/mypage.js`:
   ```js
   window.renderMyPage = function() {
     setContent(`
       ${pageHeader('My <span>Page</span>', '// subtitle here')}
       ${card('Content here', 'Card Title')}
     `);
   };
   ```
3. Add script tag in `index.html` before `app.js`:
   ```html
   <script src="js/pages/mypage.js"></script>
   ```
4. Register in `js/app.js`:
   ```js
   window.PAGES = {
     ...
     mypage: renderMyPage,
   };
   ```

### Update the robot image
The `js/robot-image.js` file sets `window.RI` to a base64-encoded image string.
To update it:
1. Convert your image: `base64 -i screenshot.jpg | tr -d '\n'`
2. Open `js/robot-image.js` and set:
   ```js
   window.RI = "data:image/jpeg;base64,<paste-here>";
   ```

---

## Utility Functions (js/utils.js)

| Function | Description |
|---|---|
| `fmt(n)` | Format dollar amount: `1500000` → `"$1.5M"` |
| `calcRev(months, bookings, avgRev, ops, invest, split, fleetGrow)` | Returns `{rows, breakEvenMonth}` |
| `setContent(html)` | Inject HTML into main content area |
| `kpi(value, label, color)` | Build a KPI tile. Colors: `'g' \| 'gold' \| 'b' \| 'r' \| 'p'` |
| `hbox(html, modifier)` | Build a highlight box. Modifiers: `'' \| 'gold' \| 'red'` |
| `card(body, title, titleMod, style)` | Build a card with optional title |
| `pageHeader(title, subtitle)` | Build a page header block |

## Chart Functions (js/charts.js)

| Function | Description |
|---|---|
| `buildRevenueChart(canvasId, rows)` | 36-month bar+line combo chart |
| `buildScenarioChart(canvasId, scenarios, invest)` | 4-scenario line chart |
| `destroyChart(id)` | Destroy one chart by canvas id |
| `destroyAllCharts()` | Destroy all active charts (called on navigation) |

---

## Design Tokens (styles.css)

```css
:root {
  --bg:      #07070e;   /* page background */
  --surface: #0d0d18;   /* sidebar, table headers */
  --card:    #121220;   /* card background */
  --border:  #1e1e30;   /* borders */
  --accent:  #00e5a0;   /* green — primary accent */
  --gold:    #f59e0b;   /* amber — investment/money */
  --red:     #ef4444;   /* red — warnings/negative */
  --blue:    #60a5fa;   /* blue — secondary */
  --purple:  #a78bfa;   /* purple — tertiary */
  --text:    #e2e8f0;   /* body text */
  --muted:   #64748b;   /* labels, secondary */
  --dim:     #94a3b8;   /* description text */
}
```
