import { renderTraining, initTraining } from './training.js';
import { renderSchedule, initSchedule } from './schedule.js';
import { renderOrgChart, initOrgChart } from './orgChart.js';
import { renderValues, initValues } from './values.js';
import { renderTimeline, initTimeline } from './timeline.js';

export let activePart1Tab = 'training'; // 'training', 'schedule', 'orgchart', 'values', 'history'
export function setPart1Tab(tab) {
  activePart1Tab = tab;
}

export function renderPart1() {
  return `
    <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
      <!-- Tab Selector -->
      <div class="schedule-tabs-container">
        <button class="schedule-tab-btn ${activePart1Tab === 'training' ? 'active' : ''}" data-tab="training">🎓 Pillars & Culture</button>
        <button class="schedule-tab-btn ${activePart1Tab === 'schedule' ? 'active' : ''}" data-tab="schedule">📅 Daily Schedule</button>
        <button class="schedule-tab-btn ${activePart1Tab === 'orgchart' ? 'active' : ''}" data-tab="orgchart">🗺️ Chain of Command</button>
        <button class="schedule-tab-btn ${activePart1Tab === 'values' ? 'active' : ''}" data-tab="values">🌲 Core Values</button>
        <button class="schedule-tab-btn ${activePart1Tab === 'history' ? 'active' : ''}" data-tab="history">📜 History & Timeline</button>
      </div>

      <!-- Mount point for sub tabs -->
      <div id="part1-subtab-mount">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `;
}

export function initPart1() {
  const tabs = document.querySelectorAll('[data-tab]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab');
      if (tabName) {
        activePart1Tab = tabName;
        // Re-render Part 1 layout to update active state of tabs
        const mount = document.getElementById('view-mount-point');
        if (mount) {
          mount.innerHTML = renderPart1();
          initPart1();
        }
      }
    });
  });

  const subtabMount = document.getElementById('part1-subtab-mount');
  if (!subtabMount) return;

  // Clean up previous listeners
  window.dispatchEvent(new CustomEvent('before-view-change'));

  // Render and Init subtab
  if (activePart1Tab === 'training') {
    subtabMount.innerHTML = renderTraining();
    initTraining();
  } else if (activePart1Tab === 'schedule') {
    subtabMount.innerHTML = renderSchedule();
    initSchedule();
  } else if (activePart1Tab === 'orgchart') {
    subtabMount.innerHTML = renderOrgChart();
    initOrgChart();
  } else if (activePart1Tab === 'values') {
    subtabMount.innerHTML = renderValues();
    initValues();
  } else if (activePart1Tab === 'history') {
    subtabMount.innerHTML = renderTimeline();
    initTimeline();
  }
}
