import { renderSafetyGuides, initSafetyGuides } from './safetyGuides.js';
import { renderOfficeMap, initOfficeMap } from './officeMap.js';

export let activePart2Tab = 'safety'; // 'safety', 'map'
export function setPart2Tab(tab) {
  activePart2Tab = tab;
}

export function renderPart2() {
  return `
    <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
      <!-- Tab Selector -->
      <div class="schedule-tabs-container">
        <button class="schedule-tab-btn ${activePart2Tab === 'safety' ? 'active' : ''}" data-tab="safety">🛟 Emergency Policies & Radio</button>
        <button class="schedule-tab-btn ${activePart2Tab === 'map' ? 'active' : ''}" data-tab="map">🗺️ Camp Map & EAP Drill</button>
      </div>

      <!-- Mount point for sub tabs -->
      <div id="part2-subtab-mount">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `;
}

export function initPart2() {
  // Ensure Code Red Mode is applied when viewing Part 2
  document.documentElement.setAttribute('data-theme-mode', 'code-red');

  const tabs = document.querySelectorAll('[data-tab]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab');
      if (tabName) {
        activePart2Tab = tabName;
        const mount = document.getElementById('view-mount-point');
        if (mount) {
          mount.innerHTML = renderPart2();
          initPart2();
        }
      }
    });
  });

  const subtabMount = document.getElementById('part2-subtab-mount');
  if (!subtabMount) return;

  // Clean up previous listeners
  window.dispatchEvent(new CustomEvent('before-view-change'));

  // Render and Init subtab
  if (activePart2Tab === 'safety') {
    subtabMount.innerHTML = renderSafetyGuides();
    initSafetyGuides();
  } else if (activePart2Tab === 'map') {
    subtabMount.innerHTML = renderOfficeMap();
    initOfficeMap();
  }
}
