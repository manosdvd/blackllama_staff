import { songbookSongs } from '../data/handbookData.js';

export function renderSongs() {
  return `
    <div class="songbook-layout">
      
      <!-- Left sidebar list -->
      <div class="song-list-sidebar">
        <!-- Comedy Class Card -->
        <button class="song-sidebar-btn active" id="btn-show-comedy">
          <span class="song-sidebar-title">🎭 Campfire Comedy Class</span>
          <span class="song-sidebar-desc">How to write funny skits from scratch.</span>
        </button>

        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: hsl(var(--muted-foreground)); letter-spacing: 0.5px; margin: 10px 0 4px 6px;">
          Campfire Songbook
        </div>

        <!-- Filter Chips Section -->
        <div class="song-filters" style="display: flex; flex-direction: column; gap: 8px; margin: 0 6px 12px 6px; padding-bottom: 10px; border-bottom: 1px solid hsl(var(--border) / 0.5);">
          <!-- Setting Filter -->
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 10px; font-weight: 700; color: hsl(var(--muted-foreground));">Setting:</span>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button class="filter-chip active" data-filter-type="setting" data-value="all" style="font-size: 11px; padding: 4px 8px; border-radius: 12px; border: 1px solid hsl(var(--border)); background: hsl(var(--card)); cursor: pointer; font-weight: 600;">All</button>
              <button class="filter-chip" data-filter-type="setting" data-value="Logs" style="font-size: 11px; padding: 4px 8px; border-radius: 12px; border: 1px solid hsl(var(--border)); background: hsl(var(--card)); cursor: pointer; font-weight: 600;">🪵 Logs</button>
              <button class="filter-chip" data-filter-type="setting" data-value="Campfire" style="font-size: 11px; padding: 4px 8px; border-radius: 12px; border: 1px solid hsl(var(--border)); background: hsl(var(--card)); cursor: pointer; font-weight: 600;">🔥 Campfire</button>
            </div>
          </div>
          <!-- Energy Filter -->
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 10px; font-weight: 700; color: hsl(var(--muted-foreground));">Energy:</span>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button class="filter-chip active" data-filter-type="energy" data-value="all" style="font-size: 11px; padding: 4px 8px; border-radius: 12px; border: 1px solid hsl(var(--border)); background: hsl(var(--card)); cursor: pointer; font-weight: 600;">All</button>
              <button class="filter-chip" data-filter-type="energy" data-value="rowdy" style="font-size: 11px; padding: 4px 8px; border-radius: 12px; border: 1px solid hsl(var(--border)); background: hsl(var(--card)); cursor: pointer; font-weight: 600;">⚡ Rowdy</button>
              <button class="filter-chip" data-filter-type="energy" data-value="calm" style="font-size: 11px; padding: 4px 8px; border-radius: 12px; border: 1px solid hsl(var(--border)); background: hsl(var(--card)); cursor: pointer; font-weight: 600;">🧘 Calm</button>
            </div>
          </div>
        </div>

        <!-- Injected dynamic songs list -->
        <div id="songs-list-mount" style="display: flex; flex-direction: column; gap: 8px;"></div>
      </div>

      <!-- Right detail view -->
      <div class="glass-panel" id="song-details-mount">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `;
}

export function initSongs() {
  const songsMount = document.getElementById('songs-list-mount');
  const detailsMount = document.getElementById('song-details-mount');
  const comedyBtn = document.getElementById('btn-show-comedy');

  if (!songsMount || !detailsMount) return;

  const songTags = {
    'song-funky': { tune: 'Rhythm Rap', energy: 'rowdy', setting: 'Logs' },
    'song-alfalfa': { tune: 'Auld Lang Syne', energy: 'calm', setting: 'Logs' },
    'song-alive': { tune: 'If You\'re Happy', energy: 'rowdy', setting: 'Campfire' },
    'song-bananas': { tune: 'Action Shout', energy: 'rowdy', setting: 'Campfire' },
    'song-birdie': { tune: 'Morning Action Chant', energy: 'calm', setting: 'Logs' },
    'song-crazy': { tune: 'Zipper Song', energy: 'rowdy', setting: 'Campfire' },
    'song-camper': { tune: 'Drunken Sailor', energy: 'rowdy', setting: 'Logs' }
  };

  let activeSongId = null;
  let metronomeInterval = null;
  let currentBeat = 0;
  let activeSongActions = [];
  let activeSettingFilter = 'all';
  let activeEnergyFilter = 'all';

  function renderSongsList() {
    const filteredSongs = songbookSongs.filter(song => {
      const tags = songTags[song.id] || { tune: '', energy: 'rowdy', setting: 'Logs' };
      const matchesSetting = activeSettingFilter === 'all' || tags.setting === activeSettingFilter;
      const matchesEnergy = activeEnergyFilter === 'all' || tags.energy === activeEnergyFilter;
      return matchesSetting && matchesEnergy;
    });

    if (filteredSongs.length === 0) {
      songsMount.innerHTML = `<div style="font-size: 13px; color: hsl(var(--muted-foreground)); padding: 12px 6px; font-weight: 500; text-align: center;">No matching songs.</div>`;
      return;
    }

    songsMount.innerHTML = filteredSongs.map(song => `
      <button class="song-sidebar-btn ${song.id === activeSongId ? 'active' : ''}" data-song-id="${song.id}">
        <span class="song-sidebar-title">${song.title}</span>
        <span class="song-sidebar-desc">${song.description.substring(0, 50)}...</span>
      </button>
    `).join('');

    // Bind sidebar buttons
    songsMount.querySelectorAll('.song-sidebar-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        stopMetronome();
        comedyBtn.classList.remove('active');
        songsMount.querySelectorAll('.song-sidebar-btn').forEach(b => b.classList.remove('active'));
        
        btn.classList.add('active');
        activeSongId = btn.getAttribute('data-song-id');
        const song = songbookSongs.find(s => s.id === activeSongId);
        if (song) {
          renderSongDetails(song);
        }
      });
    });
  }

  function setupFilters() {
    const chips = document.querySelectorAll('.filter-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const filterType = chip.getAttribute('data-filter-type');
        const val = chip.getAttribute('data-value');

        document.querySelectorAll(`.filter-chip[data-filter-type="${filterType}"]`).forEach(c => {
          c.classList.remove('active');
        });
        chip.classList.add('active');

        if (filterType === 'setting') {
          activeSettingFilter = val;
        } else if (filterType === 'energy') {
          activeEnergyFilter = val;
        }

        renderSongsList();
      });
    });
  }

  function renderComedyDetails() {
    activeSongId = null;
    stopMetronome();
    comedyBtn.classList.add('active');
    songsMount.querySelectorAll('.song-sidebar-btn').forEach(b => b.classList.remove('active'));

    detailsMount.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px; animation: tabFadeIn 0.3s ease;">
        <h2 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
          <span>🎭</span> Campfire Comedy Master Class
        </h2>
        <p style="font-size: 14.5px; color: hsl(var(--muted-foreground)); line-height: 1.5;">
          Don't fall back on the same old 50-year-old skits. You can write fresh, appropriate, and genuinely funny sketches yourself by using the following core improvisation guidelines.
        </p>

        <div class="comedy-matrix">
          <div class="glass-panel comedy-card">
            <span class="comedy-card-num">1</span>
            <h4>Find a Concept</h4>
            <p>Establish a winning core concept. Test it: if the basic premise doesn't get a "first laugh" from friends, it won't hold as a full skit.</p>
          </div>
          
          <div class="glass-panel comedy-card">
            <span class="comedy-card-num">2</span>
            <h4>Base Reality</h4>
            <p>Establish the "Who, What, Where" clearly up front. Ground the scene in normal context so the jokes have something solid to contrast against.</p>
          </div>

          <div class="glass-panel comedy-card">
            <span class="comedy-card-num">3</span>
            <h4>The "One" Unusual Thing</h4>
            <p>Introduce only ONE impossible element into the comedy world. Riff: "If this unusual thing is true, then what else is true?"</p>
          </div>

          <div class="glass-panel comedy-card">
            <span class="comedy-card-num">4</span>
            <h4>Character Archetypes</h4>
            <p>Keep characters two-dimensional representations of human flaws (e.g. Bumbling Authority, Trickster). Let their traits drive their dialogue naturally.</p>
          </div>

          <div class="glass-panel comedy-card">
            <span class="comedy-card-num">5</span>
            <h4>Escalate the Stakes</h4>
            <p>Skits must build momentum. Every joke beat should escalate the stakes, making the situation bigger, crazier, and more absurd.</p>
          </div>

          <div class="glass-panel comedy-card">
            <span class="comedy-card-num">6</span>
            <h4>Button Closer</h4>
            <p>End the skit with a "button" - a final, definitive punchline. This is the only place you can break internal logic for a final surprise.</p>
          </div>
        </div>
      </div>
    `;
  }

  function renderSongDetails(song) {
    activeSongActions = song.actions || [];
    detailsMount.innerHTML = `
      <div class="lyrics-player-card" style="animation: tabFadeIn 0.3s ease;">
        <h2 style="color: hsl(var(--primary)); font-family: var(--font-heading); margin-bottom: 2px;">${song.title}</h2>
        <p style="font-size: 14px; color: hsl(var(--muted-foreground));">${song.description}</p>
        
        <!-- Rhythmic Metronome cue track -->
        <div class="metronome-cue-track">
          <div class="metronome-controls">
            <button class="metronome-play-btn" id="metronome-play-btn" aria-label="Play metronome">▶️</button>
            <span style="font-size: 13px; font-weight: 700;">Action Cue Trainer</span>
          </div>

          <!-- Metronome Blinking Dots -->
          <div class="metronome-dot-row">
            <div class="metronome-dot" id="dot-0"></div>
            <div class="metronome-dot" id="dot-1"></div>
            <div class="metronome-dot" id="dot-2"></div>
            <div class="metronome-dot" id="dot-3"></div>
          </div>

          <!-- scrolling prompts -->
          <span class="action-cue-text" id="action-prompt">Get Ready...</span>
        </div>

        <div class="lyrics-pre">
          ${song.lyrics}
        </div>
      </div>
    `;

    // Metronome click binding
    const playBtn = document.getElementById('metronome-play-btn');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (metronomeInterval) {
          stopMetronome();
        } else {
          startMetronome();
        }
      });
    }
  }

  function startMetronome() {
    const playBtn = document.getElementById('metronome-play-btn');
    if (playBtn) playBtn.textContent = '⏸️';
    
    currentBeat = 0;
    const dots = [
      document.getElementById('dot-0'),
      document.getElementById('dot-1'),
      document.getElementById('dot-2'),
      document.getElementById('dot-3')
    ];
    const prompt = document.getElementById('action-prompt');

    // Interval at 120 BPM = 500ms
    metronomeInterval = setInterval(() => {
      // Toggle dot active
      const dotIdx = currentBeat % 4;
      dots.forEach((d, idx) => {
        if (d) {
          if (idx === dotIdx) d.classList.add('active');
          else d.classList.remove('active');
        }
      });

      // Check actions
      const activeAction = activeSongActions.find(act => act.beat === currentBeat);
      if (activeAction && prompt) {
        prompt.textContent = activeAction.text;
        prompt.style.transform = 'scale(1.1)';
        setTimeout(() => { if (prompt) prompt.style.transform = 'none'; }, 200);
      } else if (prompt && currentBeat === 0) {
        prompt.textContent = 'Sing! 🎵';
      }

      currentBeat++;
      
      // Stop loop after 32 beats if no more cues
      const maxBeat = activeSongActions.length > 0 
        ? Math.max(...activeSongActions.map(a => a.beat)) + 4 
        : 16;
      if (currentBeat > maxBeat) {
        stopMetronome();
      }
    }, 500);
  }

  function stopMetronome() {
    if (metronomeInterval) {
      clearInterval(metronomeInterval);
      metronomeInterval = null;
    }
    const playBtn = document.getElementById('metronome-play-btn');
    if (playBtn) playBtn.textContent = '▶️';

    const dots = [
      document.getElementById('dot-0'),
      document.getElementById('dot-1'),
      document.getElementById('dot-2'),
      document.getElementById('dot-3')
    ];
    dots.forEach(d => { if (d) d.classList.remove('active'); });

    const prompt = document.getElementById('action-prompt');
    if (prompt) prompt.textContent = 'Metronome Stopped';
  }

  // Bind comedy class click
  comedyBtn.addEventListener('click', () => {
    renderComedyDetails();
  });

  const cleanup = () => {
    stopMetronome();
    window.removeEventListener('before-view-change', cleanup);
  };
  window.addEventListener('before-view-change', cleanup);

  // Init
  renderSongsList();
  renderComedyDetails();
  setupFilters();
}
