import { renderSongs, initSongs } from './songs.js';

export function renderPart3() {
  return renderSongs();
}

export function initPart3() {
  // Clean up previous listeners
  window.dispatchEvent(new CustomEvent('before-view-change'));
  initSongs();
}
