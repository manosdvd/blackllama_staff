import { renderPacking, initPacking } from './packing.js';
import { renderQuiz, initQuiz } from './quiz.js';
import { render as renderApplication } from './application.js';
import { renderReadiness, initReadiness } from './readiness.js';

export let activeOnboardingTab = 'readiness'; // 'readiness', 'checklists', 'conduct', 'quiz', 'apply'
export function setOnboardingTab(tab) {
  activeOnboardingTab = tab;
}

export function renderOnboarding() {
  return `
    <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
      <!-- Tab Selector -->
      <div class="schedule-tabs-container">
        <button class="schedule-tab-btn ${activeOnboardingTab === 'readiness' ? 'active' : ''}" data-tab="readiness">✅ Readiness</button>
        <button class="schedule-tab-btn ${activeOnboardingTab === 'checklists' ? 'active' : ''}" data-tab="checklists">🎒 Gear & Docs</button>
        <button class="schedule-tab-btn ${activeOnboardingTab === 'conduct' ? 'active' : ''}" data-tab="conduct">✍️ Code of Conduct</button>
        <button class="schedule-tab-btn ${activeOnboardingTab === 'quiz' ? 'active' : ''}" data-tab="quiz">🏆 Handbook Quiz</button>
        <button class="schedule-tab-btn ${activeOnboardingTab === 'apply' ? 'active' : ''}" data-tab="apply">📝 Apply Now</button>
      </div>

      <!-- Mount point for sub tabs -->
      <div id="onboarding-subtab-mount">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `;
}

export function initOnboarding() {
  // Toggle Code Red Mode if Code of Conduct tab is active
  if (activeOnboardingTab === 'conduct') {
    document.documentElement.setAttribute('data-theme-mode', 'code-red');
  } else {
    document.documentElement.removeAttribute('data-theme-mode');
  }

  const tabs = document.querySelectorAll('[data-tab]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab');
      if (tabName) {
        activeOnboardingTab = tabName;
        const mount = document.getElementById('view-mount-point');
        if (mount) {
          mount.innerHTML = renderOnboarding();
          initOnboarding();
        }
      }
    });
  });

  const subtabMount = document.getElementById('onboarding-subtab-mount');
  if (!subtabMount) return;

  // Clean up previous listeners
  window.dispatchEvent(new CustomEvent('before-view-change'));

  // Render and Init subtab
  if (activeOnboardingTab === 'readiness') {
    subtabMount.innerHTML = renderReadiness();
    initReadiness();
  } else if (activeOnboardingTab === 'checklists') {
    subtabMount.innerHTML = renderPacking();
    initPacking();
    // Hide conduct signer
    const conductPanel = document.querySelector('.conduct-panel');
    if (conductPanel) conductPanel.style.display = 'none';
  } else if (activeOnboardingTab === 'conduct') {
    subtabMount.innerHTML = renderPacking();
    initPacking();
    // Hide checklists & gear
    const paperworkPanel = document.querySelector('.paperwork-panel');
    const packingPanel = document.querySelector('.packing-panel');
    if (paperworkPanel) paperworkPanel.style.display = 'none';
    if (packingPanel) packingPanel.style.display = 'none';
  } else if (activeOnboardingTab === 'quiz') {
    subtabMount.innerHTML = renderQuiz();
    initQuiz();
  } else if (activeOnboardingTab === 'apply') {
    renderApplication(subtabMount);
  }
}
