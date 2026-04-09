/**
 * nav.js — Sidebar navigation renderer and page router.
 *
 * Reads NAV_ITEMS from config.js and wires up navigation.
 * To add a new page: add it to NAV_ITEMS in config.js and create
 * a corresponding file in js/pages/.
 */

/**
 * Render all nav items into #sb-nav from the NAV_ITEMS config.
 */
window.renderNav = function() {
  const nav = document.getElementById('sb-nav');
  if (!nav) return;

  nav.innerHTML = NAV_ITEMS.map(group => `
    <div class="ng">${group.group}</div>
    ${group.items.map(item => `
      <button class="ni" data-page="${item.id}" onclick="navigateTo('${item.id}', this)">
        <span class="ni-ic">${item.icon}</span> ${item.label}
      </button>
    `).join('')}
  `).join('');
};

/**
 * Navigate to a page by id. Handles:
 * - Active state on nav buttons
 * - Chart cleanup
 * - Calling the page renderer
 * - Scroll reset
 *
 * @param {string} pageId - matches keys in window.PAGES
 * @param {Element} [btn] - the nav button that triggered navigation (optional)
 */
window.navigateTo = function(pageId, btn) {
  // Update active state
  document.querySelectorAll('.ni').forEach(b => b.classList.remove('on'));
  const target = btn || document.querySelector(`[data-page="${pageId}"]`);
  if (target) target.classList.add('on');

  // Destroy any charts from the previous page
  window.destroyAllCharts();

  // Clear content and render new page
  document.getElementById('mc').innerHTML = '';
  if (window.PAGES && window.PAGES[pageId]) {
    window.PAGES[pageId]();
  } else {
    document.getElementById('mc').innerHTML = `
      <div class="mh"><div class="mt">Page <span>Not Found</span></div></div>
      <div class="hbox red"><strong>Error:</strong> No renderer found for page "${pageId}".</div>
    `;
  }

  window.scrollTo(0, 0);
};
