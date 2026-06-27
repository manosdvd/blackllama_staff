import { renderValues, initValues } from './values.js';
import { renderOrgChart, initOrgChart } from './orgChart.js';
import { renderSchedule, initSchedule } from './schedule.js';
import { renderTimeline, initTimeline } from './timeline.js';

export let activeCampLawtonTab = 'values'; // 'values', 'orgchart', 'schedule', 'history'

export function setCampLawtonTab(tab) {
  activeCampLawtonTab = tab;
}

export function renderCampLawton() {
  return `
    <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
      <!-- Tab Selector -->
      <div class="schedule-tabs-container">
        <button class="schedule-tab-btn ${activeCampLawtonTab === 'values' ? 'active' : ''}" data-tab="values">🌲 Core Values</button>
        <button class="schedule-tab-btn ${activeCampLawtonTab === 'orgchart' ? 'active' : ''}" data-tab="orgchart">🗺️ Chain of Command</button>
        <button class="schedule-tab-btn ${activeCampLawtonTab === 'schedule' ? 'active' : ''}" data-tab="schedule">📅 Daily Schedule</button>
        <button class="schedule-tab-btn ${activeCampLawtonTab === 'history' ? 'active' : ''}" data-tab="history">📜 History & Timeline</button>
      </div>

      <!-- Mount point for sub tabs -->
      <div id="camplawton-subtab-mount">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `;
}

export function initCampLawton() {
  const tabs = document.querySelectorAll('[data-tab]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab');
      if (tabName) {
        activeCampLawtonTab = tabName;
        const mount = document.getElementById('view-mount-point');
        if (mount) {
          mount.innerHTML = renderCampLawton();
          initCampLawton();
        }
      }
    });
  });

  const subtabMount = document.getElementById('camplawton-subtab-mount');
  if (!subtabMount) return;

  // Clean up previous listeners
  window.dispatchEvent(new CustomEvent('before-view-change'));

  // Render and Init subtab
  if (activeCampLawtonTab === 'values') {
    subtabMount.innerHTML = renderValues();
    initValues();
  } else if (activeCampLawtonTab === 'orgchart') {
    subtabMount.innerHTML = renderOrgChart();
    initOrgChart();
  } else if (activeCampLawtonTab === 'schedule') {
    subtabMount.innerHTML = renderSchedule();
    initSchedule();
  } else if (activeCampLawtonTab === 'history') {
    subtabMount.innerHTML = renderTimeline();
    initTimeline();
  }
}
