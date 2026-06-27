import { renderSongs, initSongs } from './songs.js';
import { renderCampfireBuilder, initCampfireBuilder } from './campfireBuilder.js';

export let activeSongbookTab = 'songbook';

export function renderSongbook() {
  return `
    <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
      <!-- Tab Selector -->
      <div class="schedule-tabs-container">
        <button class="schedule-tab-btn ${activeSongbookTab === 'songbook' ? 'active' : ''}" data-tab="songbook">🎤 Songbook & Comedy</button>
        <button class="schedule-tab-btn ${activeSongbookTab === 'builder' ? 'active' : ''}" data-tab="builder">🔥 Campfire Program Builder</button>
      </div>

      <!-- Mount point for sub tabs -->
      <div id="songbook-subtab-mount">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `;
}

export function initSongbook() {
  // Clean up previous listeners
  window.dispatchEvent(new CustomEvent('before-view-change'));
  
  const tabs = document.querySelectorAll('[data-tab]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab');
      if (tabName) {
        activeSongbookTab = tabName;
        const mount = document.getElementById('view-mount-point');
        if (mount) {
          mount.innerHTML = renderSongbook();
          initSongbook();
        }
      }
    });
  });

  const subtabMount = document.getElementById('songbook-subtab-mount');
  if (!subtabMount) return;

  if (activeSongbookTab === 'songbook') {
    subtabMount.innerHTML = renderSongs();
    initSongs();
  } else if (activeSongbookTab === 'builder') {
    subtabMount.innerHTML = renderCampfireBuilder();
    initCampfireBuilder();
  }
}
