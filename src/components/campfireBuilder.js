import { songbookSongs } from '../data/handbookData.js';
import { campfiresDB } from '../services/db.js';

// Reusing the songTags from songs.js to enforce energy rules
const songTags = {
  'song-funky': { energy: 'rowdy' },
  'song-alfalfa': { energy: 'calm' },
  'song-alive': { energy: 'rowdy' },
  'song-bananas': { energy: 'rowdy' },
  'song-birdie': { energy: 'calm' },
  'song-crazy': { energy: 'rowdy' },
  'song-camper': { energy: 'rowdy' }
};

export function renderCampfireBuilder() {
  const options = songbookSongs.map(s => {
    const energy = songTags[s.id]?.energy || 'rowdy';
    return `<option value="${s.id}" data-energy="${energy}">${s.title} (${energy})</option>`;
  }).join('');

  return `
    <div class="schedule-content-panel" style="animation: tabFadeIn 0.3s ease both;">
      <h2 style="color: hsl(var(--primary)); margin-top: 0;">🔥 Campfire Program Builder</h2>
      <p style="color: hsl(var(--muted-foreground)); font-size: 14.5px;">Build your campfire utilizing the "Campfire Curve" pacing guidelines. Spark and Early Flame items cannot be 'calm'. Embers and Last Light items cannot be 'rowdy'.</p>
      
      <form id="campfire-form" style="display: flex; flex-direction: column; gap: 20px;">
        <!-- Stage 1 -->
        <div class="builder-stage">
          <label>1. Spark / Ignition (High Energy)</label>
          <select id="stage-1" required>
            <option value="">-- Select an item --</option>
            ${options}
          </select>
          <div class="error-msg" id="err-stage-1" style="color: var(--safety-red); font-size: 12px; display: none;">Error: Cannot place a calm item here.</div>
        </div>

        <!-- Stage 2 -->
        <div class="builder-stage">
          <label>2. Early Flame (Building Energy)</label>
          <select id="stage-2" required>
            <option value="">-- Select an item --</option>
            ${options}
          </select>
          <div class="error-msg" id="err-stage-2" style="color: var(--safety-red); font-size: 12px; display: none;">Error: Cannot place a calm item here.</div>
        </div>

        <!-- Stage 3 -->
        <div class="builder-stage">
          <label>3. Steady Burn (Pacing)</label>
          <select id="stage-3" required>
            <option value="">-- Select an item --</option>
            ${options}
          </select>
        </div>

        <!-- Stage 4 -->
        <div class="builder-stage">
          <label>4. Climax (Peak Engagement)</label>
          <select id="stage-4" required>
            <option value="">-- Select an item --</option>
            ${options}
          </select>
        </div>

        <!-- Stage 5 -->
        <div class="builder-stage">
          <label>5. Embers (Winding Down)</label>
          <select id="stage-5" required>
            <option value="">-- Select an item --</option>
            ${options}
          </select>
          <div class="error-msg" id="err-stage-5" style="color: var(--safety-red); font-size: 12px; display: none;">Error: Cannot place a rowdy item here.</div>
        </div>

        <!-- Stage 6 -->
        <div class="builder-stage">
          <label>6. Last Light (Quiet Reflection)</label>
          <select id="stage-6" required>
            <option value="">-- Select an item --</option>
            ${options}
          </select>
          <div class="error-msg" id="err-stage-6" style="color: var(--safety-red); font-size: 12px; display: none;">Error: Cannot place a rowdy item here.</div>
        </div>

        <!-- NCS Compliance Gatekeeper -->
        <div style="background: hsl(var(--card)); padding: 16px; border: 1px solid hsl(var(--border)); border-radius: var(--radius-sm);">
          <h4 style="margin: 0 0 12px 0;">🛡️ NCS Compliance Gatekeeper</h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <label style="display: flex; gap: 8px; font-size: 14px; cursor: pointer;">
              <input type="checkbox" id="chk-water" required /> I verify there is no physical water/getting wet in any skit.
            </label>
            <label style="display: flex; gap: 8px; font-size: 14px; cursor: pointer;">
              <input type="checkbox" id="chk-bathroom" required /> I verify there is zero bathroom humor.
            </label>
            <label style="display: flex; gap: 8px; font-size: 14px; cursor: pointer;">
              <input type="checkbox" id="chk-food" required /> I verify no real food will be wasted or thrown.
            </label>
            <label style="display: flex; gap: 8px; font-size: 14px; cursor: pointer;">
              <input type="checkbox" id="chk-underpants" required /> I verify no references to undergarments.
            </label>
            <label style="display: flex; gap: 8px; font-size: 14px; cursor: pointer; color: var(--safety-red); font-weight: 700; margin-top: 8px;">
              <input type="checkbox" id="chk-vetting" required /> I acknowledge the Program Director must vet this schedule before performance.
            </label>
          </div>
        </div>

        <button type="submit" id="submit-campfire" class="primary-btn" style="background: var(--camp-forest); color: white; border: none; padding: 12px; border-radius: 6px; font-weight: 700; cursor: pointer;">
          SUBMIT FOR AREA DIRECTOR APPROVAL
        </button>
      </form>
      
      <div id="campfire-success" style="display: none; padding: 16px; background: rgba(16, 185, 129, 0.1); border: 2px solid #10b981; border-radius: var(--radius-sm); color: #10b981; font-weight: 700; margin-top: 20px;">
        ✅ Program Submitted! Sent to Program Director for review.
      </div>
    </div>
  `;
}

export function initCampfireBuilder() {
  const form = document.getElementById('campfire-form');
  if (!form) return;

  function validateStage(stageNum, bannedEnergy) {
    const select = document.getElementById(`stage-\${stageNum}`);
    const err = document.getElementById(`err-stage-\${stageNum}`);
    if (!select.value) {
      err.style.display = 'none';
      return true;
    }
    const energy = select.options[select.selectedIndex].getAttribute('data-energy');
    if (energy === bannedEnergy) {
      err.style.display = 'block';
      select.style.borderColor = 'var(--safety-red)';
      return false;
    } else {
      err.style.display = 'none';
      select.style.borderColor = 'hsl(var(--border))';
      return true;
    }
  }

  // Validate on change
  [1, 2].forEach(n => document.getElementById(`stage-\${n}`).addEventListener('change', () => validateStage(n, 'calm')));
  [5, 6].forEach(n => document.getElementById(`stage-\${n}`).addEventListener('change', () => validateStage(n, 'rowdy')));

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Final Validation
    const v1 = validateStage(1, 'calm');
    const v2 = validateStage(2, 'calm');
    const v5 = validateStage(5, 'rowdy');
    const v6 = validateStage(6, 'rowdy');

    if (!v1 || !v2 || !v5 || !v6) {
      alert("Please fix the pacing errors highlighted in red.");
      return;
    }

    const payload = {
      spark: document.getElementById('stage-1').value,
      earlyFlame: document.getElementById('stage-2').value,
      steadyBurn: document.getElementById('stage-3').value,
      climax: document.getElementById('stage-4').value,
      embers: document.getElementById('stage-5').value,
      lastLight: document.getElementById('stage-6').value,
      status: 'pending'
    };

    campfiresDB.create(payload);

    form.style.display = 'none';
    document.getElementById('campfire-success').style.display = 'block';
  });
}
