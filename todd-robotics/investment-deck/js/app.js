/**
 * app.js — Application entry point.
 *
 * Registers all page renderers and boots the app.
 * To add a new page:
 *   1. Add it to NAV_ITEMS in config.js
 *   2. Create js/pages/yourpage.js with window.PAGES.yourpage = function() { ... }
 *   3. Add the <script> tag to index.html
 */

// ── PAGE REGISTRY ─────────────────────────────────────────────────────────────
window.PAGES = {
  overview:  renderOverview,
  robot:     renderRobot,
  returns:   renderReturns,
  tiers:     renderTiers,
  questions: renderQuestions,
  houston:   renderHouston,
  week1:     renderWeek1,
  roadmap:   renderRoadmap,
  setup:     renderSetup,
  usecases:  renderUsecases,
};

// ── BOOT ──────────────────────────────────────────────────────────────────────
(function boot() {
  window.renderNav();
  window.navigateTo('overview');
})();
