import { renderSafetyGuides, initSafetyGuides } from './safetyGuides.js';
import { renderOfficeMap, initOfficeMap } from './officeMap.js';

export let activePoliciesTab = 'safety'; // 'safety', 'map'
export function setPoliciesTab(tab) {
  activePoliciesTab = tab;
}

export function renderPolicies() {
  return `
    <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
      <!-- Continuous Bell Protocol Banner -->
      <div style="background: var(--safety-red); color: white; padding: 16px; border-radius: var(--radius-sm); border: 2px solid #b11f26; display: flex; align-items: center; gap: 16px; box-shadow: 0 4px 12px rgba(200, 35, 44, 0.3);">
        <span style="font-size: 32px;">🔔</span>
        <div>
          <h3 style="margin: 0; font-size: 18px; font-weight: 800; letter-spacing: 0.5px;">CONTINUOUS BELL PROTOCOL</h3>
          <p style="margin: 4px 0 0 0; font-size: 14px; font-weight: 500;">If you hear a continuous, unbroken ringing of the Dining Hall bell: <strong>DROP EVERYTHING. SECURE HAZARDS. EVACUATE TO THE PARADE GROUNDS IMMEDIATELY.</strong></p>
        </div>
      </div>

      <!-- Tab Selector -->
      <div class="schedule-tabs-container">
        <button class="schedule-tab-btn ${activePoliciesTab === 'safety' ? 'active' : ''}" data-tab="safety">🛟 Emergency Policies & Radio</button>
        <button class="schedule-tab-btn ${activePoliciesTab === 'map' ? 'active' : ''}" data-tab="map">🗺️ Camp Map & EAP Drill</button>
      </div>

      <!-- Mount point for sub tabs -->
      <div id="policies-subtab-mount">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `;
}

export function initPolicies() {
  // Ensure Code Red Mode is applied when viewing Part 2
  document.documentElement.setAttribute('data-theme-mode', 'code-red');

  const tabs = document.querySelectorAll('[data-tab]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab');
      if (tabName) {
        activePoliciesTab = tabName;
        const mount = document.getElementById('view-mount-point');
        if (mount) {
          mount.innerHTML = renderPolicies();
          initPolicies();
        }
      }
    });
  });

  const subtabMount = document.getElementById('policies-subtab-mount');
  if (!subtabMount) return;

  // Clean up previous listeners
  window.dispatchEvent(new CustomEvent('before-view-change'));

  // Render and Init subtab
  if (activePoliciesTab === 'safety') {
    subtabMount.innerHTML = renderSafetyGuides();
    initSafetyGuides();
  } else if (activePoliciesTab === 'map') {
    subtabMount.innerHTML = renderOfficeMap();
    initOfficeMap();
  }
}
