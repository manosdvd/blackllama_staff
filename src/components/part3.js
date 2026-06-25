import { renderSongs, initSongs } from './songs.js';
import { renderCampfireBuilder, initCampfireBuilder } from './campfireBuilder.js';

export let activePart3Tab = 'songbook';

export function renderPart3() {
  return `
    <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
      <!-- Tab Selector -->
      <div class="schedule-tabs-container">
        <button class="schedule-tab-btn ${activePart3Tab === 'songbook' ? 'active' : ''}" data-tab="songbook">🎤 Songbook & Comedy</button>
        <button class="schedule-tab-btn ${activePart3Tab === 'builder' ? 'active' : ''}" data-tab="builder">🔥 Campfire Program Builder</button>
      </div>

      <!-- Mount point for sub tabs -->
      <div id="part3-subtab-mount">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `;
}

export function initPart3() {
  // Clean up previous listeners
  window.dispatchEvent(new CustomEvent('before-view-change'));
  
  const tabs = document.querySelectorAll('[data-tab]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab');
      if (tabName) {
        activePart3Tab = tabName;
        const mount = document.getElementById('view-mount-point');
        if (mount) {
          mount.innerHTML = renderPart3();
          initPart3();
        }
      }
    });
  });

  const subtabMount = document.getElementById('part3-subtab-mount');
  if (!subtabMount) return;

  if (activePart3Tab === 'songbook') {
    subtabMount.innerHTML = renderSongs();
    initSongs();
  } else if (activePart3Tab === 'builder') {
    subtabMount.innerHTML = renderCampfireBuilder();
    initCampfireBuilder();
  }
}
