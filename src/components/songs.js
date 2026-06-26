import { songbookSongs } from '../data/handbookData.js';
import { rawHandbook } from '../data/rawHandbook.js';

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function renderHandbookSection(h3Title, icon = '📖') {
  const section = rawHandbook.find(s => s.h3 === h3Title || s.h2 === h3Title || s.h1 === h3Title);
  if (!section) return '';
  return `
    <details class="glass-panel comedy-card" style="border-left: 4px solid hsl(var(--primary));">
      <summary class="comedy-card-summary" style="padding: 14px 18px;">
        <div class="comedy-card-header">
          <h4 style="font-weight: 700; margin: 0; font-size: 15px;">${icon} ${section.h3 || section.h2 || section.h1}</h4>
        </div>
        <span class="comedy-card-toggle">▼</span>
      </summary>
      <div class="comedy-card-details" style="padding: 0 18px 14px 18px;">
        <div style="font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.5; white-space: pre-wrap;">
          ${escapeHtml(section.content)}
        </div>
      </div>
    </details>
  `;
}

function formatMarkdownToHtml(md) {
  if (!md) return '';
  let html = md;
  
  // Remove backslash escapes like \! or \? or \- or \_ or \*
  html = html.replace(/\\(!|\?|-|_|\*)/g, '$1');
  
  // Replace bold-italic ***text***
  html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  
  // Replace bold **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Replace italic *text*
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Replace bullet points starting with dash
  html = html.replace(/^(\s*)[-\u2013\u2014]\s*(.*?)$/gm, '$1• $2');
  
  return html;
}

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

  let activeSongId = null;
  let metronomeInterval = null;
  let currentBeat = 0;
  let activeSongActions = [];
  let activeSettingFilter = 'all';
  let activeEnergyFilter = 'all';

  function renderSongsList() {
    const filteredSongs = songbookSongs.filter(song => {
      const matchesSetting = activeSettingFilter === 'all' || song.setting === activeSettingFilter;
      const matchesEnergy = activeEnergyFilter === 'all' || song.energy === activeEnergyFilter;
      return matchesSetting && matchesEnergy;
    });

    if (filteredSongs.length === 0) {
      songsMount.innerHTML = `<div style="font-size: 13px; color: hsl(var(--muted-foreground)); padding: 12px 6px; font-weight: 500; text-align: center;">No matching songs.</div>`;
      return;
    }

    songsMount.innerHTML = filteredSongs.map(song => `
      <button class="song-sidebar-btn ${song.id === activeSongId ? 'active' : ''}" data-song-id="${song.id}">
        <span class="song-sidebar-title">${song.title}</span>
        <span class="song-sidebar-desc">${(song.notes || song.lyrics || '').substring(0, 50)}...</span>
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
          Don't fall back on the same old 50-year-old skits. You can write fresh, appropriate, and genuinely funny sketches yourself by using the following core improvisation guidelines. Click on any module below to expand and view the full handbook training details.
        </p>

        <div class="comedy-matrix" style="grid-template-columns: 1fr; gap: 16px;">
          <details class="glass-panel comedy-card">
            <summary class="comedy-card-summary">
              <div class="comedy-card-header">
                <span class="comedy-card-num">1</span>
                <h4 style="margin: 0; font-weight: 700;">Module 1: Finding Your Core Concept</h4>
              </div>
              <span class="comedy-card-toggle">▼</span>
            </summary>
            <div class="comedy-card-details">
              <p style="margin: 0 0 10px 0;">Establish a winning core concept. Test it: if the basic premise doesn't get a "first laugh" from friends, it won't hold as a full skit. Establish a unique world with only one element askew from reality.</p>
              <hr class="comedy-card-divider" />
              <ul class="comedy-card-bullets">
                <li><strong>Generate Ideas Constantly:</strong> Make a daily habit of brainstorming at least 10 funny ideas or short jokes to build a stockpile of raw material.</li>
                <li><strong>The "First Laugh" Test:</strong> A good skit starts with a winning concept that can be expressed as a simple 5–10 word title. Test your ideas on a feedback group; if the premise doesn’t get an immediate "First Laugh," it won't work as a full skit.</li>
                <li><strong>Establish One Impossible Thing:</strong> Your skit should introduce a unique comedy world containing only <em>one</em> element that is askew from reality. If you introduce too many crazy elements, the audience will get confused.</li>
                <li><strong>Include Hidden Subtext:</strong> Ensure your concept is grounded in an astute observation or opinion about human nature or society (Subtext), but never explicitly state this message to the audience.</li>
              </ul>
            </div>
          </details>

          <details class="glass-panel comedy-card">
            <summary class="comedy-card-summary">
              <div class="comedy-card-header">
                <span class="comedy-card-num">2</span>
                <h4 style="margin: 0; font-weight: 700;">Module 2: Establishing the Scene and the "Take"</h4>
              </div>
              <span class="comedy-card-toggle">▼</span>
            </summary>
            <div class="comedy-card-details">
              <p style="margin: 0 0 10px 0;">Ground the scene in a relatable context so the absurd elements have something solid to contrast against, and identify the first unusual thing that breaks the normal pattern.</p>
              <hr class="comedy-card-divider" />
              <ul class="comedy-card-bullets">
                <li><strong>Build the Base Reality:</strong> Before any comedy happens, establish the "Who, What, and Where" of the scene. Ground the scene in a relatable, normal context so the absurd elements have something to contrast against.</li>
                <li><strong>Find the Game of the Scene (The Take):</strong> Identify the "first unusual thing" that breaks the normal pattern of your base reality. This unusual behavior or absurd situation becomes your "take" or the "game"—the single specific idea that makes the skit funny.</li>
              </ul>
            </div>
          </details>

          <details class="glass-panel comedy-card">
            <summary class="comedy-card-summary">
              <div class="comedy-card-header">
                <span class="comedy-card-num">3</span>
                <h4 style="margin: 0; font-weight: 700;">Module 3: Brainstorming and Joke Discipline</h4>
              </div>
              <span class="comedy-card-toggle">▼</span>
            </summary>
            <div class="comedy-card-details">
              <p style="margin: 0 0 10px 0;">Ask "If/Then" to discover what else is true, riff joke beats to construct the scene skeleton, and ruthlessly cut any jokes that stray off course.</p>
              <hr class="comedy-card-divider" />
              <ul class="comedy-card-bullets">
                <li><strong>Ask "If/Then":</strong> To generate the comedy for your skit, ask yourself: <em>"If this unusual thing is true, then what else is true?"</em>.</li>
                <li><strong>Riff "Joke Beats":</strong> Brainstorm a list of 20 or more joke beats that spool out from your core concept. These beats will form the skeleton of your skit, occurring every few lines.</li>
                <li><strong>Maintain Joke Discipline:</strong> You must ruthlessly cut any jokes that veer away from your core premise, no matter how funny they are on their own. Derailing from the established "track" is a common beginner mistake that confuses audiences.</li>
              </ul>
            </div>
          </details>

          <details class="glass-panel comedy-card">
            <summary class="comedy-card-summary">
              <div class="comedy-card-header">
                <span class="comedy-card-num">4</span>
                <h4 style="margin: 0; font-weight: 700;">Module 4: Crafting Comedic Characters</h4>
              </div>
              <span class="comedy-card-toggle">▼</span>
            </summary>
            <div class="comedy-card-details">
              <p style="margin: 0 0 10px 0;">Develop simple, two-dimensional character archetypes with distinct flaws, and have them fully commit and react truthfully to their absurd reality.</p>
              <hr class="comedy-card-divider" />
              <ul class="comedy-card-bullets">
                <li><strong>Use Simple Archetypes:</strong> Comedic characters are not meant to be deep or realistic; they are two-dimensional representations of human flaws. Rely on proven Character Archetypes (like the Trickster, the Bumbling Authority, or the Dummy) and give them just 1–3 clear traits.</li>
                <li><strong>Let Traits Drive the Dialogue:</strong> Don't write random, clever "gags" for your characters to say. Humor naturally arises simply by having the characters act and speak in strict accordance with their Archetypal traits.</li>
                <li><strong>Play it Straight:</strong> Characters must fully commit to their absurd reality and react truthfully (playing at the "top of their intelligence"). Avoid winking at the audience, acting "wacky," or using silly, cliché character names just for a cheap laugh.</li>
              </ul>
            </div>
          </details>

          <details class="glass-panel comedy-card">
            <summary class="comedy-card-summary">
              <div class="comedy-card-header">
                <span class="comedy-card-num">5</span>
                <h4 style="margin: 0; font-weight: 700;">Module 5: Escalation and Drafting</h4>
              </div>
              <span class="comedy-card-toggle">▼</span>
            </summary>
            <div class="comedy-card-details">
              <p style="margin: 0 0 10px 0;">Build momentum by raising the stakes with every beat, weave exposition seamlessly, and write your first draft quickly without editing yourself.</p>
              <hr class="comedy-card-divider" />
              <ul class="comedy-card-bullets">
                <li><strong>Escalate the Humor:</strong> Your skit must build momentum. Every new joke beat should escalate the stakes, heightening the scene to be bigger, crazier, and more absurd than the last.</li>
                <li><strong>Fold in the Exposition:</strong> Do not write long, humorless setups to explain the logic of your scene. Integrate necessary exposition seamlessly into your joke beats.</li>
                <li><strong>Enter "Clown Mode":</strong> When writing your first draft, turn off your inner critic. String your joke beats together quickly and finish the draft without second-guessing or editing yourself.</li>
              </ul>
            </div>
          </details>

          <details class="glass-panel comedy-card">
            <summary class="comedy-card-summary">
              <div class="comedy-card-header">
                <span class="comedy-card-num">6</span>
                <h4 style="margin: 0; font-weight: 700;">Module 6: The Closer and the Edit</h4>
              </div>
              <span class="comedy-card-toggle">▼</span>
            </summary>
            <div class="comedy-card-details">
              <p style="margin: 0 0 10px 0;">Conclude with a high-impact punchline button, refine the pacing by editing tightly, and test/rewrite according to audience responses.</p>
              <hr class="comedy-card-divider" />
              <ul class="comedy-card-bullets">
                <li><strong>Cap it with a Button:</strong> End the skit with a "closer" or a "button"—a final, definitive joke that wraps up the scene. This is the only place in the skit where you are allowed to slightly break the internal logic or flip the premise upside down for a final surprise.</li>
                <li><strong>Enter "Editor Mode":</strong> Put the draft away for a few days, then return with an objective eye. Cut any needless words to keep the pacing tight.</li>
                <li><strong>Test and Rewrite:</strong> Show the completed draft to your feedback group or test it on a real audience. If the joke beats don't land or the audience gets confused, be prepared to scrap parts of it and rewrite until it works.</li>
              </ul>
            </div>
          </details>
        </div>
        <!-- Appended Handbook Protocols -->
        <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 24px;">
          ${renderHandbookSection('Campfires', '🔥')}
          ${renderHandbookSection('Isn’t calling this a Master Class a bit arrogant?', '🤔')}
          ${renderHandbookSection('How To Write Funny', '🎭')}
          ${renderHandbookSection('Writing Songs', '🎸')}
          ${renderHandbookSection('Here’s one last lesson on the law making things inconvenient', '⚖️')}
        </div>
      </div>
    `;
  }

  function renderSongDetails(song) {
    activeSongActions = song.actions || [];
    const hasActions = activeSongActions.length > 0;

    const metronomeHtml = hasActions ? `
      <!-- Rhythmic Metronome cue track -->
      <div class="metronome-cue-track" style="margin-bottom: 20px;">
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
    ` : '';

    const hasMoreInfo = (song.notes && song.notes.trim()) || song.background;
    const moreInfoHtml = hasMoreInfo ? `
      <button class="glass-panel-interactive" id="btn-song-more-info" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; font-size: 12.5px; border-radius: var(--radius-sm); border: 1px solid var(--glass-border); background: var(--glass-bg); color: hsl(var(--primary)); cursor: pointer; font-weight: 600; margin-bottom: 18px; transition: all 0.2s;">
        📖 Background & Research
      </button>
    ` : '';

    detailsMount.innerHTML = `
      <div class="lyrics-player-card" style="animation: tabFadeIn 0.3s ease;">
        <h2 style="color: hsl(var(--primary)); font-family: var(--font-heading); margin-bottom: 2px;">${song.title}</h2>
        
        <!-- Display Tune prominently -->
        <div style="font-size: 13.5px; font-weight: 600; color: hsl(var(--primary) / 0.85); margin: 6px 0 14px 0; display: flex; align-items: center; gap: 6px;">
          <span>🎵</span> Tune: <strong>${song.tune}</strong>
        </div>

        ${moreInfoHtml}
        
        ${metronomeHtml}

        <div class="lyrics-pre">
          ${formatMarkdownToHtml(song.lyrics)}
        </div>
      </div>
    `;

    // Metronome click binding
    if (hasActions) {
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

    // More Information click binding
    if (hasMoreInfo) {
      const moreInfoBtn = document.getElementById('btn-song-more-info');
      if (moreInfoBtn) {
        moreInfoBtn.addEventListener('click', () => {
          openBackgroundModal(song);
        });
      }
    }
  }

  function openBackgroundModal(song) {
    let modal = document.getElementById('song-background-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'song-background-modal';
      modal.className = 'song-modal-overlay';
      document.body.appendChild(modal);
    }
    
    let modalBodyHtml = '';
    
    // Notes / Commentary
    if (song.notes && song.notes.trim()) {
      modalBodyHtml += `
        <div style="margin-bottom: 20px;">
          <h4 style="font-family: var(--font-heading); color: hsl(var(--primary)); margin-bottom: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Staff Notes & Commentary</h4>
          <div style="font-style: italic; font-size: 14.5px; color: hsl(var(--muted-foreground)); border-left: 3px solid hsl(var(--primary) / 0.4); padding-left: 12px; line-height: 1.5;">
            "${formatMarkdownToHtml(song.notes)}"
          </div>
        </div>
      `;
    }
    
    // Background Research Analysis
    if (song.background) {
      const formattedText = song.background.text
        .split('\n\n')
        .map(p => `<p style="margin-bottom: 14px; line-height: 1.6; font-size: 14.5px; color: hsl(var(--muted-foreground));">${formatMarkdownToHtml(p.replace(/\n/g, '<br>'))}</p>`)
        .join('');
      
      modalBodyHtml += `
        <div style="${(song.notes && song.notes.trim()) ? 'border-top: 1px solid hsl(var(--border) / 0.4); padding-top: 16px; margin-top: 16px;' : ''}">
          <h4 style="font-family: var(--font-heading); color: hsl(var(--primary)); margin-bottom: 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Historical & Copyright Analysis</h4>
          ${formattedText}
        </div>
      `;
    }

    const titleText = song.background ? song.background.heading : `Background: ${song.title}`;

    modal.innerHTML = `
      <div class="song-modal-content glass-panel">
        <div class="song-modal-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid hsl(var(--border) / 0.5); padding-bottom: 12px; margin-bottom: 16px;">
          <h3 style="font-family: var(--font-heading); color: hsl(var(--primary)); margin: 0; font-size: 17px;">${titleText}</h3>
          <button class="song-modal-close-btn" id="close-song-modal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: hsl(var(--muted-foreground)); transition: color 0.2s; line-height: 1;">&times;</button>
        </div>
        <div class="song-modal-body" style="max-height: 60vh; overflow-y: auto; padding-right: 8px;">
          ${modalBodyHtml}
        </div>
      </div>
    `;

    // Trigger open transition next tick
    setTimeout(() => {
      modal.classList.add('open');
    }, 10);

    const closeBtn = document.getElementById('close-song-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeBackgroundModal);
    }
    
    // Close on clicking overlay background
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeBackgroundModal();
      }
    });
  }

  function closeBackgroundModal() {
    const modal = document.getElementById('song-background-modal');
    if (modal) {
      modal.classList.remove('open');
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
      const dotIdx = currentBeat % 4;
      dots.forEach((d, idx) => {
        if (d) {
          if (idx === dotIdx) d.classList.add('active');
          else d.classList.remove('active');
        }
      });

      const activeAction = activeSongActions.find(act => act.beat === currentBeat);
      if (activeAction && prompt) {
        prompt.textContent = activeAction.text;
        prompt.style.transform = 'scale(1.1)';
        setTimeout(() => { if (prompt) prompt.style.transform = 'none'; }, 200);
      } else if (prompt && currentBeat === 0) {
        prompt.textContent = 'Sing! 🎵';
      }

      currentBeat++;
      
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
    closeBackgroundModal();
    window.removeEventListener('before-view-change', cleanup);
  };
  window.addEventListener('before-view-change', cleanup);

  // Init
  renderSongsList();
  renderComedyDetails();
  setupFilters();
}
