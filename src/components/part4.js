import { renderPacking, initPacking } from './packing.js';
import { renderQuiz, initQuiz } from './quiz.js';
import { render as renderApplication } from './application.js';

export let activePart4Tab = 'checklists'; // 'checklists', 'conduct', 'quiz', 'apply'
export function setPart4Tab(tab) {
  activePart4Tab = tab;
}

export function renderPart4() {
  return `
    <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
      <!-- Tab Selector -->
      <div class="schedule-tabs-container">
        <button class="schedule-tab-btn ${activePart4Tab === 'checklists' ? 'active' : ''}" data-tab="checklists">🎒 Checklists & Gear</button>
        <button class="schedule-tab-btn ${activePart4Tab === 'conduct' ? 'active' : ''}" data-tab="conduct">✍️ Code of Conduct</button>
        <button class="schedule-tab-btn ${activePart4Tab === 'quiz' ? 'active' : ''}" data-tab="quiz">🏆 Handbook Quiz</button>
        <button class="schedule-tab-btn ${activePart4Tab === 'apply' ? 'active' : ''}" data-tab="apply">📝 Apply Now</button>
      </div>

      <!-- Mount point for sub tabs -->
      <div id="part4-subtab-mount">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `;
}

export function initPart4() {
  // Toggle Code Red Mode if Code of Conduct tab is active
  if (activePart4Tab === 'conduct') {
    document.documentElement.setAttribute('data-theme-mode', 'code-red');
  } else {
    document.documentElement.removeAttribute('data-theme-mode');
  }

  const tabs = document.querySelectorAll('[data-tab]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab');
      if (tabName) {
        activePart4Tab = tabName;
        const mount = document.getElementById('view-mount-point');
        if (mount) {
          mount.innerHTML = renderPart4();
          initPart4();
        }
      }
    });
  });

  const subtabMount = document.getElementById('part4-subtab-mount');
  if (!subtabMount) return;

  // Clean up previous listeners
  window.dispatchEvent(new CustomEvent('before-view-change'));

  // Render and Init subtab
  if (activePart4Tab === 'checklists') {
    subtabMount.innerHTML = renderPacking();
    initPacking();
    // Hide conduct signer
    const conductPanel = document.querySelector('.conduct-panel');
    if (conductPanel) conductPanel.style.display = 'none';
  } else if (activePart4Tab === 'conduct') {
    subtabMount.innerHTML = renderPacking();
    initPacking();
    // Hide checklists & gear
    const paperworkPanel = document.querySelector('.paperwork-panel');
    const packingPanel = document.querySelector('.packing-panel');
    if (paperworkPanel) paperworkPanel.style.display = 'none';
    if (packingPanel) packingPanel.style.display = 'none';
  } else if (activePart4Tab === 'quiz') {
    subtabMount.innerHTML = renderQuiz();
    initQuiz();
  } else if (activePart4Tab === 'apply') {
    renderApplication(subtabMount);
  }
}
