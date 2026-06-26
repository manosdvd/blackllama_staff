// Camp Lawton Safety & Policies Guide Module
import { openAppDialog } from '../main.js';
import { policiesProceduresData } from '../data/handbookData.js';

// Sound generators using Web Audio API
function playRadioBeep(freq = 880, duration = 0.15) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn("AudioContext block", e);
  }
}

function playRadioStatic(duration = 0.25) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    noise.start();
  } catch (e) {
    console.warn("AudioContext block", e);
  }
}

export function renderSafetyGuides() {
  return `
    <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
      <!-- Tabs selectors -->
      <div class="schedule-tabs-container">
        <button class="schedule-tab-btn active" id="safety-tab-flowcharts">Emergency Flowcharts</button>
        <button class="schedule-tab-btn" id="safety-tab-radio">Interactive Radio Simulator</button>
        <button class="schedule-tab-btn" id="safety-tab-guidelines">Camp Guidelines</button>
        <button class="schedule-tab-btn" id="safety-tab-legal">Legal Policies</button>
      </div>

      <!-- Content panels mount point -->
      <div id="safety-panel-mount">
        <!-- Renders dynamically -->
      </div>
    </div>
  `;
}

export function initSafetyGuides() {
  const flowchartsBtn = document.getElementById('safety-tab-flowcharts');
  const radioBtn = document.getElementById('safety-tab-radio');
  const guidelinesBtn = document.getElementById('safety-tab-guidelines');
  const legalBtn = document.getElementById('safety-tab-legal');
  const panelMount = document.getElementById('safety-panel-mount');

  if (!panelMount) return;

  let activeTimeouts = [];

  function clearActiveTransmissions() {
    activeTimeouts.forEach(t => clearTimeout(t));
    activeTimeouts = [];
    
    // Reset radio UI to idle state
    const led = document.getElementById('radio-led');
    const screenCh = document.getElementById('radio-screen-channel');
    const screenStatus = document.getElementById('radio-screen-status');
    if (led) {
      led.style.background = '#10b981';
      led.style.boxShadow = '0 0 6px #10b981';
    }
    if (screenCh) screenCh.textContent = 'CH 1: ADMIN';
    if (screenStatus) screenStatus.textContent = 'IDLE READY';
  }

  function renderFlowcharts() {
    flowchartsBtn.classList.add('active');
    radioBtn.classList.remove('active');
    guidelinesBtn.classList.remove('active');
    legalBtn.classList.remove('active');
    clearActiveTransmissions();

    panelMount.innerHTML = `
      <div class="schedule-content-panel" style="animation: tabFadeIn 0.3s ease both;">
        <p style="color: hsl(var(--muted-foreground)); font-size: 15px; max-width: 750px; line-height: 1.5; margin-bottom: 20px;">
          As camp staff, protecting youth and ensuring property safety is your primary duty. Review these structured, step-by-step procedures for emergencies, severe weather, and mandatory Arizona reporting laws.
        </p>

        <div class="protocol-accordion">
          <!-- Missing Person (Code Blue) -->
          <div class="protocol-item">
            <button class="protocol-header" aria-expanded="false" data-protocol-idx="0">
              <span class="protocol-title"><span>🚨</span> Code Blue — Missing Person / Lost Camper</span>
              <span class="protocol-arrow-icon">▼</span>
            </button>
            <div class="protocol-body">
              <div class="protocol-call-banner">
                <span class="protocol-call-text">⚠️ MISSING PERSON: INPUT DETAILS BELOW</span>
                <span style="font-size: 13px; opacity: 0.9;">Do NOT self-assign a search. Submit details to generate radio script.</span>
              </div>
              <div style="background: hsl(var(--card)); padding: 16px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); margin-bottom: 16px;">
                <form id="code-blue-form" style="display: flex; flex-direction: column; gap: 12px;">
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <label style="font-size: 12px; font-weight: 700; color: hsl(var(--muted-foreground));">First Name</label>
                    <input type="text" id="cb-name" required placeholder="e.g. John" style="padding: 8px; border: 1px solid hsl(var(--border)); border-radius: 4px; background: var(--glass-bg); color: hsl(var(--foreground));" />
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <label style="font-size: 12px; font-weight: 700; color: hsl(var(--muted-foreground));">Troop/Unit Number</label>
                    <input type="text" id="cb-unit" required placeholder="e.g. Troop 404" style="padding: 8px; border: 1px solid hsl(var(--border)); border-radius: 4px; background: var(--glass-bg); color: hsl(var(--foreground));" />
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <label style="font-size: 12px; font-weight: 700; color: hsl(var(--muted-foreground));">Physical Description (Clothing, Hat, etc.)</label>
                    <input type="text" id="cb-desc" required placeholder="e.g. Red class B shirt, blue shorts, BSA hat" style="padding: 8px; border: 1px solid hsl(var(--border)); border-radius: 4px; background: var(--glass-bg); color: hsl(var(--foreground));" />
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <label style="font-size: 12px; font-weight: 700; color: hsl(var(--muted-foreground));">Last Known Location & Time</label>
                    <input type="text" id="cb-loc" required placeholder="e.g. Archery range, 10 minutes ago" style="padding: 8px; border: 1px solid hsl(var(--border)); border-radius: 4px; background: var(--glass-bg); color: hsl(var(--foreground));" />
                  </div>
                  <button type="submit" class="primary-btn" style="background: var(--safety-red); color: white; border: none; padding: 12px; border-radius: 6px; font-weight: 700; cursor: pointer; margin-top: 8px;">
                    GENERATE RADIO PROTOCOL
                  </button>
                </form>
                <div id="code-blue-result" style="display: none; margin-top: 16px; padding: 16px; border-left: 4px solid var(--safety-red); background: rgba(200, 35, 44, 0.1);">
                  <h4 style="margin: 0 0 8px 0; color: var(--safety-red); font-size: 16px;">🚨 RADIO SCRIPT GENERATED</h4>
                  <p style="margin: 0 0 12px 0; font-family: monospace; font-size: 14px; background: rgba(0,0,0,0.2); padding: 12px; border-radius: 4px;" id="cb-script-text"></p>
                  <p style="margin: 0; font-size: 13px; font-weight: 700; color: var(--safety-red);">⚠️ DO NOT LEAVE YOUR CURRENT AREA TO SEARCH. STAND BY FOR CAMP DIRECTOR ORDERS.</p>
                  <button id="cb-reset-btn" style="margin-top: 12px; background: transparent; border: 1px solid hsl(var(--border)); color: hsl(var(--foreground)); padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">Reset</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Bear Sighting (Code Brown) -->
          <div class="protocol-item">
            <button class="protocol-header" aria-expanded="false" data-protocol-idx="1">
              <span class="protocol-title"><span>🐻</span> Code Brown — Bear Sighting & Encounter</span>
              <span class="protocol-arrow-icon">▼</span>
            </button>
            <div class="protocol-body">
              <div class="protocol-call-banner">
                <span class="protocol-call-text">⚠️ REPORT SIGHTING AND MAINTAIN SAFEST DISTANCE</span>
                <a href="tel:1-555-LAWTON-CD" class="protocol-call-btn">📞 Radio Camp Ranger</a>
              </div>
              <div style="background: rgba(200, 35, 44, 0.1); border: 2px solid var(--safety-red); padding: 16px; border-radius: var(--radius-sm); margin-bottom: 16px;">
                <h4 style="margin: 0 0 8px 0; color: var(--safety-red); font-size: 16px; font-weight: 800;">CRITICAL INSTRUCTION:</h4>
                <p style="margin: 0; font-size: 14px; font-weight: 700; color: hsl(var(--foreground));">DO NOT APPROACH. Scare the bear away by yelling loudly and throwing rocks/sticks. Immediately report a CODE BROWN to the Camp Director via radio.</p>
              </div>
              <ol class="protocol-steps">
                <li><strong>Remain Calm:</strong> Retreat slowly and quietly, keeping your eyes on the bear (but avoid direct eye contact). Do NOT run.</li>
                <li><strong>Establish Visual Check:</strong> Maintain a safe visual check from a distance (adult staff only). Escort all scouts and CITs to a secure, indoor area immediately.</li>
              </ol>
            </div>
          </div>

          <!-- Lightning Safety (30/30 Rule) -->
          <div class="protocol-item">
            <button class="protocol-header" aria-expanded="false" data-protocol-idx="2">
              <span class="protocol-title"><span>⚡</span> Lightning Safety — Severe Weather</span>
              <span class="protocol-arrow-icon">▼</span>
            </button>
            <div class="protocol-body">
              <div class="protocol-call-banner">
                <span class="protocol-call-text">⚠️ SUSPEND OUTDOOR ACTIVITIES IMMEDIATELY</span>
                <button class="protocol-call-btn" onclick="alert('Broadcasting weather alert on radio channel 1...')">📻 Radio Weather Warning</button>
              </div>
              
              <div style="background: hsl(var(--card)); padding: 16px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); margin-bottom: 16px; text-align: center;">
                <h4 style="margin: 0 0 12px 0; font-size: 16px;">30/30 Rule Lightning Calculator</h4>
                <div style="display: flex; gap: 12px; justify-content: center; margin-bottom: 16px;">
                  <button id="btn-flash" style="flex: 1; padding: 16px; font-size: 18px; font-weight: 800; border-radius: 8px; border: none; background: #eab308; color: #000; cursor: pointer; box-shadow: 0 4px 0 #ca8a04;">
                    ⚡ SAW FLASH
                  </button>
                  <button id="btn-thunder" disabled style="flex: 1; padding: 16px; font-size: 18px; font-weight: 800; border-radius: 8px; border: none; background: hsl(var(--muted)); color: hsl(var(--muted-foreground)); cursor: not-allowed; box-shadow: 0 4px 0 hsl(var(--border));">
                    🔊 HEARD THUNDER
                  </button>
                </div>
                <div id="lightning-result" style="padding: 12px; border-radius: 8px; font-weight: 700; font-size: 15px; display: none;"></div>
                <div id="lightning-timer" style="font-family: monospace; font-size: 24px; font-weight: 800; color: hsl(var(--muted-foreground)); display: none;">0.0s</div>
              </div>

              <ol class="protocol-steps">
                <li><strong>Monitor Flash-to-Bang:</strong> If you see a lightning flash and hear thunder within 30 seconds (indicating lightning is within 6 miles), suspend all outdoor programs immediately.</li>
                <li><strong>Seek Safe Shelter:</strong> Immediately escort all scouts, leaders, and staff to the Dining Hall. Open-sided pavilions, canvas dining flies, and canvas tents offer ZERO lightning protection.</li>
                <li><strong>Wait It Out:</strong> Wait at least 30 minutes after the last visible lightning flash or sound of thunder before allowing anyone to leave the shelter or resuming programs.</li>
              </ol>
            </div>
          </div>

          <!-- Fire Evacuation -->
          <div class="protocol-item">
            <button class="protocol-header" aria-expanded="false" data-protocol-idx="3">
              <span class="protocol-title"><span>🔥</span> Fire Evacuation Protocol</span>
              <span class="protocol-arrow-icon">▼</span>
            </button>
            <div class="protocol-body">
              <div class="protocol-call-banner">
                <span class="protocol-call-text">⚠️ REPORT SMOKE/FIRE AND ALARM SITE</span>
                <a href="tel:911" class="protocol-call-btn">📞 Dial 911 Immediately</a>
              </div>
              <ol class="protocol-steps">
                <li><strong>Report Fire:</strong> Call 911 or radio the Camp Director/Camp Office the moment you spot an out-of-control fire or heavy smoke. State the exact location.</li>
                <li><strong>Evacuate Safely:</strong> Drop all program operations. Assist all scouts, leaders, and visitors to evacuate the area immediately. Escort everyone to the Parade Grounds.</li>
                <li><strong>Prioritize Youth:</strong> Leave all personal gear, luggage, and camp equipment behind. The safety of human lives is our absolute and first priority.</li>
              </ol>
            </div>
          </div>

          <!-- Bell Alarm (Emergency Evacuation Drill) -->
          <div class="protocol-item">
            <button class="protocol-header" aria-expanded="false" data-protocol-idx="4">
              <span class="protocol-title"><span>🔔</span> Bell Alarm — Evacuation & Headcount</span>
              <span class="protocol-arrow-icon">▼</span>
            </button>
            <div class="protocol-body">
              <div class="protocol-call-banner">
                <span class="protocol-call-text">⚠️ ESCORT ALL USERS TO PARADE GROUNDS ON CONTINUOUS BELL</span>
                <button class="protocol-call-btn" onclick="alert('Drill coordinates sent to Staff Area.')">📻 Radio HQ Headcount</button>
              </div>
              <ol class="protocol-steps">
                <li><strong>Secure Immediate Hazards:</strong> If the Dining Hall bell rings continuously, drop all activities. Quickly secure critical hazards in your area (e.g. put away archery bows, turn off fire pits).</li>
                <li><strong>Escort Scouts:</strong> Immediately escort all scouts, leaders, and visitors with you to the Parade Grounds. Do NOT let scouts return to their campsites to fetch gear.</li>
                <li><strong>Take Strict Headcount:</strong> Group scouts by troop unit. Take a strict headcount immediately and report the results to the Program Director or Camp Director at the center flagpole.</li>
              </ol>
            </div>
          </div>

          <!-- Active Shooter -->
          <div class="protocol-item">
            <button class="protocol-header" aria-expanded="false" data-protocol-idx="5">
              <span class="protocol-title"><span>🔫</span> Armed Intruder / Active Shooter</span>
              <span class="protocol-arrow-icon">▼</span>
            </button>
            <div class="protocol-body">
              <div class="protocol-call-banner">
                <span class="protocol-call-text">⚠️ DIAL 911 IMMEDIATELY — DO NOT CONFRONT INTRUDER</span>
                <a href="tel:911" class="protocol-call-btn">📞 Dial 911 (Police)</a>
              </div>
              <ol class="protocol-steps">
                <li><strong>Flee/Run:</strong> If a safe escape path is clear, immediately flee the area. Lead scouts into the surrounding woods, away from the sounds of gunfire, and seek safety off-property.</li>
                <li><strong>Hide/Barricade:</strong> If escape is impossible, lock and barricade yourself and scouts inside the nearest cabin or solid building. Stay out of sight, silence all phones, turn off lights, and lie flat on the floor.</li>
                <li><strong>Fight:</strong> As a last resort, and only when your life is in imminent danger, act with maximum physical aggression to disarm and disrupt the shooter. Use any heavy tool or object as a weapon.</li>
              </ol>
            </div>
          </div>

          <!-- Mandatory Abuse Reporting (ARS 13-3620) -->
          <div class="protocol-item">
            <button class="protocol-header" aria-expanded="false" data-protocol-idx="6">
              <span class="protocol-title"><span>🛡️</span> Mandatory Abuse Reporting (ARS 13-3620)</span>
              <span class="protocol-arrow-icon">▼</span>
            </button>
            <div class="protocol-body">
              <div class="protocol-call-banner">
                <span class="protocol-call-text">⚠️ MANDATED REPORTING LAWS REQUIRE IMMEDIATE REPORTING</span>
                <a href="tel:1-888-767-2445" class="protocol-call-btn" style="background: var(--safety-red);">📞 Call Arizona DCS (1-888-SOS-CHILD)</a>
              </div>
              <ol class="protocol-steps">
                <li><strong>Identify Suspicion:</strong> If you have a good-faith suspicion of child abuse, sexual abuse, physical abuse, or neglect of a camper or CIT, you are legally required to report it.</li>
                <li><strong>Personal Legal Duty:</strong> As a summer camp staff member in Arizona, you are a Mandated Reporter under ARS 13-3620. This is a personal legal obligation.</li>
                <li><strong>No Delegation:</strong> You must report directly to the Arizona Department of Child Safety (1-888-SOS-CHILD) or local law enforcement (911). You CANNOT delegate this report to the Camp Director, Area Directors, or other staff.</li>
                <li><strong>Report Internally:</strong> Once the legal report has been made to DCS/911, notify the Camp Director immediately so the Council Scout Executive can be alerted and Scouts First Helpline contacted (1-844-SCOUTS1).</li>
              </ol>
            </div>
          </div>
        </div>

        <!-- Heat Stress Matrix -->
        <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px; margin-top: 24px;">
          <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); font-size: 22px;">☀️ Heat Stress Diagnostics</h3>
          <p style="font-size: 14.5px; color: hsl(var(--muted-foreground));">Review symptoms to identify heat illnesses on dry mountain trails.</p>
          
          <div class="heat-matrix">
            <div class="heat-card exhaustion">
              <h4 style="color: hsl(var(--warning)); font-weight: 800; font-family: var(--font-heading); display: flex; align-items: center; gap: 8px; font-size: 18px;">
                <span>⚠️</span> Heat Exhaustion
              </h4>
              <div style="font-size: 13.5px; line-height: 1.5;">
                <strong>Symptoms:</strong> Heavy sweating, pale or clammy skin, nausea or vomiting, dizziness, weakness, headache, muscle cramps.
                <br><br>
                <strong>Treatment:</strong> Move to shade immediately. Cool down with wet towels, remove excess clothing, sip cool water slowly. Do NOT give salt tablets.
              </div>
            </div>
            
            <div class="heat-card stroke">
              <h4 style="color: var(--safety-red); font-weight: 800; font-family: var(--font-heading); display: flex; align-items: center; gap: 8px; font-size: 18px;">
                <span>🚨</span> Heatstroke (Emergency!)
              </h4>
              <div style="font-size: 13.5px; line-height: 1.5;">
                <strong>Symptoms:</strong> Altered mental state (confusion, slurred speech), extremely hot, red, or flushed dry skin, rapid strong pulse, loss of consciousness.
                <br><br>
                <strong>Treatment:</strong> <strong>Call 911 immediately.</strong> Move to shade, cool rapidly using ice packs or cold water immersion. Do NOT give anything by mouth.
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind Accordion Click Handlers
    const accordions = panelMount.querySelectorAll('.protocol-header');
    accordions.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.protocol-item');
        const isActive = item.classList.contains('active');
        
        // Close all other items
        panelMount.querySelectorAll('.protocol-item').forEach(i => {
          i.classList.remove('active');
          i.querySelector('.protocol-header').setAttribute('aria-expanded', 'false');
        });

        if (!isActive) {
          item.classList.add('active');
          header.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // Bind Code Blue Form
    const cbForm = document.getElementById('code-blue-form');
    if (cbForm) {
      cbForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('cb-name').value;
        const unit = document.getElementById('cb-unit').value;
        const desc = document.getElementById('cb-desc').value;
        const loc = document.getElementById('cb-loc').value;
        
        document.getElementById('code-blue-result').style.display = 'block';
        document.getElementById('cb-script-text').innerText = 
          `"Camp Director, this is [Your Area]. Code Blue. ${name} from ${unit}, last seen at ${loc}. Wearing ${desc}. Standing by for instructions."`;
        cbForm.style.display = 'none';
      });
      
      document.getElementById('cb-reset-btn')?.addEventListener('click', () => {
        cbForm.reset();
        cbForm.style.display = 'flex';
        document.getElementById('code-blue-result').style.display = 'none';
      });
    }

    // Bind Lightning Calculator
    const btnFlash = document.getElementById('btn-flash');
    const btnThunder = document.getElementById('btn-thunder');
    const lightningTimer = document.getElementById('lightning-timer');
    const lightningResult = document.getElementById('lightning-result');
    let flashTime = 0;
    let timerInterval = null;

    if (btnFlash && btnThunder) {
      btnFlash.addEventListener('click', () => {
        flashTime = Date.now();
        btnFlash.disabled = true;
        btnFlash.style.opacity = '0.5';
        btnThunder.disabled = false;
        btnThunder.style.background = '#3b82f6';
        btnThunder.style.color = '#fff';
        
        lightningResult.style.display = 'none';
        lightningTimer.style.display = 'block';
        
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
          const diff = (Date.now() - flashTime) / 1000;
          lightningTimer.innerText = diff.toFixed(1) + 's';
        }, 100);
      });

      btnThunder.addEventListener('click', () => {
        clearInterval(timerInterval);
        const diff = (Date.now() - flashTime) / 1000;
        lightningTimer.innerText = diff.toFixed(1) + 's';
        
        btnThunder.disabled = true;
        btnThunder.style.background = 'hsl(var(--muted))';
        btnThunder.style.color = 'hsl(var(--muted-foreground))';
        btnFlash.disabled = false;
        btnFlash.style.opacity = '1';
        
        lightningResult.style.display = 'block';
        if (diff <= 30) {
          lightningResult.style.background = 'rgba(200, 35, 44, 0.1)';
          lightningResult.style.border = '2px solid var(--safety-red)';
          lightningResult.style.color = 'var(--safety-red)';
          lightningResult.innerHTML = `⚠️ DANGER: Storm is ~${(diff/5).toFixed(1)} miles away.<br>SUSPEND ACTIVITIES AND EVACUATE TO DINING HALL IMMEDIATELY!`;
        } else {
          lightningResult.style.background = 'rgba(16, 185, 129, 0.1)';
          lightningResult.style.border = '2px solid #10b981';
          lightningResult.style.color = '#10b981';
          lightningResult.innerHTML = `✅ SAFE: Storm is ~${(diff/5).toFixed(1)} miles away.<br>Continue to monitor.`;
        }
      });
    }
  }

  function renderRadio() {
    flowchartsBtn.classList.remove('active');
    radioBtn.classList.add('active');
    guidelinesBtn.classList.remove('active');
    legalBtn.classList.remove('active');
    clearActiveTransmissions();

    panelMount.innerHTML = `
      <div class="schedule-content-panel" style="animation: tabFadeIn 0.3s ease both;">
        <div style="background: hsl(var(--primary) / 0.05); border: 1px dashed hsl(var(--primary) / 0.2); border-radius: var(--radius-md); padding: 16px; font-size: 14px; line-height: 1.5; color: hsl(var(--muted-foreground));">
          📻 <strong>Official Radio Simulator:</strong> Under FCC regulations, camp radios are for official purposes only. Play scenarios to check proper, compliant communication protocols (no real names, specific designations).
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 24px; margin-top: 10px;">
          <!-- Handheld Walkie-Talkie UI -->
          <div class="glass-panel" style="display: flex; flex-direction: column; align-items: center; padding: 24px; background: hsl(var(--secondary) / 0.2); border: 2px solid hsl(var(--border)); border-radius: 24px; position: relative; max-width: 320px; margin: auto; width: 100%;">
            
            <!-- Dial Knobs -->
            <div style="width: 20px; height: 12px; background: #1e293b; position: absolute; top: -12px; left: 60px; border-radius: 3px 3px 0 0;"></div>
            <div style="width: 14px; height: 45px; background: #334155; position: absolute; top: -45px; right: 80px; border-radius: 2px 2px 0 0;"></div>
            
            <!-- LED Light -->
            <div style="display: flex; gap: 6px; align-self: flex-end; align-items: center; margin-bottom: 12px;">
              <span style="font-size: 9px; font-weight: 700; color: hsl(var(--muted-foreground)); letter-spacing: 0.5px;">TX/RX</span>
              <div id="radio-led" style="width: 10px; height: 10px; border-radius: 50%; background: #10b981; box-shadow: 0 0 6px #10b981; transition: all 0.2s;"></div>
            </div>

            <!-- Radio Digital Screen -->
            <div style="width: 100%; height: 90px; background: #0f172a; border-radius: var(--radius-sm); border: 2px solid #334155; padding: 10px; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #38bdf8; font-family: monospace; text-shadow: 0 0 4px #0284c7; box-shadow: inset 0 2px 8px rgba(0,0,0,0.8); margin-bottom: 20px;">
              <div style="font-size: 9px; color: #475569; letter-spacing: 1px; font-weight: bold;">CAMP LAWTON COMMS</div>
              <div id="radio-screen-channel" style="font-size: 15px; font-weight: bold; margin-top: 4px;">CH 1: ADMIN</div>
              <div id="radio-screen-status" style="font-size: 10px; color: #a7f3d0; margin-top: 4px;">IDLE READY</div>
            </div>

            <!-- Speaker holes design -->
            <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 24px; width: 80%; opacity: 0.5;">
              <div style="height: 3px; background: #475569; border-radius: 2px;"></div>
              <div style="height: 3px; background: #475569; border-radius: 2px; width: 90%; margin: auto;"></div>
              <div style="height: 3px; background: #475569; border-radius: 2px; width: 80%; margin: auto;"></div>
              <div style="height: 3px; background: #475569; border-radius: 2px; width: 70%; margin: auto;"></div>
            </div>

            <!-- PTT Button -->
            <button id="radio-ptt-btn" style="width: 100%; padding: 14px; border-radius: var(--radius-md); background: hsl(var(--primary)); color: white; border: none; font-weight: 800; cursor: pointer; box-shadow: var(--shadow-md); transition: all 0.2s; font-family: var(--font-heading); font-size: 13px;" aria-label="Push-to-Talk button">
              🎤 PRESS PTT TO TEST
            </button>
            <span style="font-size: 10px; color: hsl(var(--muted-foreground)); margin-top: 6px; font-weight: 500;">Hold to chirp microphone</span>
          </div>

          <!-- Script Triggers & Real-Time Transcript Display -->
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div class="glass-panel" style="padding: 18px; display: flex; flex-direction: column; gap: 10px;">
              <h4 style="font-weight: 700; margin-bottom: 4px;">Simulate Scenario Calls:</h4>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <button class="welcome-banner-btn radio-scenario-btn" data-scenario="routine" style="padding: 10px; font-size: 13px; text-align: left; background: hsl(var(--primary) / 0.08); border: 1px solid hsl(var(--primary) / 0.3); color: hsl(var(--primary));">
                  <strong>💬 Routine Call:</strong> "Scoutcraft to HQ"
                </button>
                <button class="welcome-banner-btn radio-scenario-btn" data-scenario="wildlife" style="padding: 10px; font-size: 13px; text-align: left; background: hsl(var(--accent) / 0.08); border: 1px solid hsl(var(--accent) / 0.3); color: hsl(var(--accent));">
                  <strong>🐻 Code Brown:</strong> Bear sighting report
                </button>
                <button class="welcome-banner-btn radio-scenario-btn" data-scenario="medical" style="padding: 10px; font-size: 13px; text-align: left; background: hsl(var(--danger) / 0.08); border: 1px solid hsl(var(--danger) / 0.3); color: hsl(var(--danger));">
                  <strong>🚨 Code Blue:</strong> Medical emergency call
                </button>
                <button class="welcome-banner-btn radio-scenario-btn" data-scenario="illegal" style="padding: 10px; font-size: 13px; text-align: left; background: hsl(var(--secondary)); border: 1px solid hsl(var(--border)); color: inherit;">
                  <strong>❌ FCC Violation:</strong> Non-official/names call
                </button>
              </div>
            </div>

            <!-- Transcript Logs -->
            <div class="glass-panel" style="flex-grow: 1; display: flex; flex-direction: column; padding: 18px; min-height: 200px;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid hsl(var(--border)); padding-bottom: 8px; margin-bottom: 10px;">
                <h4 style="font-weight: 700; font-size: 14px;">Radio Transcript Logs</h4>
                <button id="radio-clear-log" style="font-size: 11px; background: transparent; border: none; cursor: pointer; color: hsl(var(--muted-foreground)); font-weight: 600;">Clear</button>
              </div>
              <div id="radio-transcript-mount" style="font-family: monospace; font-size: 12px; display: flex; flex-direction: column; gap: 8px; overflow-y: auto; height: 160px; max-height: 160px; padding-right: 6px;">
                <div style="color: hsl(var(--muted-foreground)); font-style: italic;">No active transmissions. Press a scenario to begin or hold PTT to test.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    setupRadioListeners();
  }

  function setupRadioListeners() {
    const pttBtn = document.getElementById('radio-ptt-btn');
    const led = document.getElementById('radio-led');
    const screenCh = document.getElementById('radio-screen-channel');
    const screenStatus = document.getElementById('radio-screen-status');
    const clearBtn = document.getElementById('radio-clear-log');
    const transcriptMount = document.getElementById('radio-transcript-mount');

    let pttActive = false;

    // PTT Press & Hold
    if (pttBtn) {
      const startPTT = (e) => {
        e.preventDefault();
        if (pttActive) return;
        pttActive = true;
        clearActiveTransmissions();
        
        playRadioBeep(980, 0.1);
        if (led) {
          led.style.background = '#ef4444';
          led.style.boxShadow = '0 0 8px #ef4444';
        }
        if (screenStatus) screenStatus.textContent = 'TRANSMITTING';
        if (screenCh) screenCh.textContent = 'CH 1: TX TEST';
        
        transcriptMount.innerHTML = `<div style="color: hsl(var(--primary)); font-weight: bold;">[TX TEST] Mic open. Release button to end transmission.</div>`;
      };

      const stopPTT = () => {
        if (!pttActive) return;
        pttActive = false;
        playRadioStatic(0.15);
        
        if (led) {
          led.style.background = '#10b981';
          led.style.boxShadow = '0 0 6px #10b981';
        }
        if (screenStatus) screenStatus.textContent = 'IDLE READY';
        if (screenCh) screenCh.textContent = 'CH 1: ADMIN';
        
        transcriptMount.innerHTML += `<div style="color: hsl(var(--muted-foreground)); font-style: italic;">Transmission ended. [STATIC]</div>`;
        transcriptMount.scrollTop = transcriptMount.scrollHeight;
      };

      pttBtn.addEventListener('mousedown', startPTT);
      pttBtn.addEventListener('mouseup', stopPTT);
      pttBtn.addEventListener('mouseleave', stopPTT);
      
      pttBtn.addEventListener('touchstart', startPTT);
      pttBtn.addEventListener('touchend', stopPTT);
    }

    // Clear logs
    if (clearBtn && transcriptMount) {
      clearBtn.addEventListener('click', () => {
        clearActiveTransmissions();
        transcriptMount.innerHTML = `<div style="color: hsl(var(--muted-foreground)); font-style: italic;">Logs cleared. Select a scenario.</div>`;
      });
    }

    // Scenario Triggers
    const scenarioBtns = document.querySelectorAll('.radio-scenario-btn');
    scenarioBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const scenario = btn.getAttribute('data-scenario');
        runScenario(scenario);
      });
    });

    const scenarios = {
      routine: [
        { type: 'beep' },
        { type: 'tx', sender: 'Scoutcraft', text: 'Scoutcraft to HQ. Over.' },
        { type: 'static' },
        { type: 'rx', sender: 'HQ', text: 'HQ, go ahead. Over.' },
        { type: 'beep' },
        { type: 'tx', sender: 'Scoutcraft', text: 'Scoutcraft program area is locked and secure. Instructors returning to Staff Hill. Out.' },
        { type: 'static' },
        { type: 'rx', sender: 'HQ', text: 'HQ Copy. Scoutcraft clear. Out.' }
      ],
      wildlife: [
        { type: 'beep' },
        { type: 'tx', sender: 'Commissioner', text: 'Commissioner to Ranger. Over.' },
        { type: 'static' },
        { type: 'rx', sender: 'Ranger', text: 'Ranger, go ahead. Over.' },
        { type: 'beep' },
        { type: 'tx', sender: 'Commissioner', text: 'Report a Code Brown near the youth shower house, moving east. Over.' },
        { type: 'static' },
        { type: 'rx', sender: 'Ranger', text: 'Ranger Copy. Code Brown logged. Contacting Camp Director. Out.' }
      ],
      medical: [
        { type: 'beep' },
        { type: 'tx', sender: 'Nature', text: 'Nature to Medic. Urgent. Over.' },
        { type: 'static' },
        { type: 'rx', sender: 'Medic', text: 'Medic, go ahead. Over.' },
        { type: 'beep' },
        { type: 'tx', sender: 'Nature', text: 'Code Blue at Nature Trail entrance. Scout fell. Conscious, but possible sprain. Over.' },
        { type: 'static' },
        { type: 'rx', sender: 'Medic', text: 'Medic copy. Responding now. All stations clear air for Code Blue. Out.' }
      ],
      illegal: [
        { type: 'beep' },
        { type: 'tx', sender: 'Nature', text: 'Hey Dave, is Jim there? Can you tell him to bring my sunglasses to Nature Lodge?' },
        { type: 'violation', title: '⚠️ FCC PROTOCOL VIOLATION DETECTED', text: 'Reason: Ties up official emergency channel, uses real names, and contains non-official business. Keep the air clean!' }
      ]
    };

    function runScenario(key) {
      clearActiveTransmissions();
      if (!transcriptMount) return;

      transcriptMount.innerHTML = `<div style="color: hsl(var(--primary)); font-weight: 700; font-style: italic;">Starting Scenario: ${key.toUpperCase()}...</div>`;
      
      const script = scenarios[key];
      let delay = 300;

      script.forEach((step, idx) => {
        const timeout = setTimeout(() => {
          if (!transcriptMount) return;

          if (step.type === 'beep') {
            playRadioBeep(880, 0.12);
            if (led) {
              led.style.background = '#ef4444';
              led.style.boxShadow = '0 0 8px #ef4444';
            }
            if (screenStatus) screenStatus.textContent = 'TRANSMITTING';
            if (screenCh) screenCh.textContent = 'CH 1: TX';
          } 
          else if (step.type === 'static') {
            playRadioStatic(0.18);
            if (led) {
              led.style.background = '#f59e0b';
              led.style.boxShadow = '0 0 8px #f59e0b';
            }
            if (screenStatus) screenStatus.textContent = 'RECEIVING';
            if (screenCh) screenCh.textContent = 'CH 1: RX';
          }
          else if (step.type === 'tx') {
            transcriptMount.innerHTML += `
              <div style="color: hsl(var(--primary)); margin-top: 4px;">
                <strong>Outgoing (TX): [${step.sender}]</strong> "${step.text}"
              </div>
            `;
          }
          else if (step.type === 'rx') {
            transcriptMount.innerHTML += `
              <div style="color: hsl(var(--accent)); margin-top: 4px;">
                <strong>Incoming (RX): [${step.sender}]</strong> "${step.text}"
              </div>
            `;
          }
          else if (step.type === 'violation') {
            if (led) {
              led.style.background = '#ef4444';
              led.style.boxShadow = '0 0 10px #ef4444';
            }
            if (screenStatus) screenStatus.textContent = 'ALERT ERROR';
            transcriptMount.innerHTML += `
              <div style="color: hsl(var(--danger)); font-weight: 800; margin-top: 8px; border: 1px dashed hsl(var(--danger)); padding: 8px; border-radius: var(--radius-sm); background: hsl(var(--danger) / 0.05);">
                ${step.title}
                <p style="font-size: 11px; font-weight: 500; margin-top: 4px; color: inherit;">${step.text}</p>
              </div>
            `;
            playRadioBeep(440, 0.4); // Error buzz sound
          }

          transcriptMount.scrollTop = transcriptMount.scrollHeight;

          // If last step, restore idle
          if (idx === script.length - 1 && step.type !== 'violation') {
            setTimeout(() => {
              if (led) {
                led.style.background = '#10b981';
                led.style.boxShadow = '0 0 6px #10b981';
              }
              if (screenStatus) screenStatus.textContent = 'IDLE READY';
              if (screenCh) screenCh.textContent = 'CH 1: ADMIN';
            }, 800);
          }

        }, delay);

        activeTimeouts.push(timeout);
        
        // Accumulate timer offsets for realistic sequencing
        if (step.type === 'beep' || step.type === 'static') {
          delay += 250;
        } else {
          delay += 1400; // Let text linger
        }
      });
    }
  }

  function renderGuidelines() {
    flowchartsBtn.classList.remove('active');
    radioBtn.classList.remove('active');
    guidelinesBtn.classList.add('active');
    legalBtn.classList.remove('active');
    clearActiveTransmissions();

    panelMount.innerHTML = `
      <div class="schedule-content-panel" style="animation: tabFadeIn 0.3s ease both;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 20px;">
          
          <!-- Cabin Guidelines -->
          <div class="glass-panel" style="display: flex; flex-direction: column; gap: 12px; border-top: 4px solid hsl(var(--primary));">
            <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
              <span>🏠</span> Cabin Rules & Hygiene
            </h3>
            <ul style="font-size: 13.5px; color: hsl(var(--muted-foreground)); padding-left: 20px; line-height: 1.5; display: flex; flex-direction: column; gap: 8px;">
              <li><strong>Mutual Respect:</strong> Maintain an orderly and hygienic living environment. Cabin occupancy is up to 8 staff members. Respect personal space.</li>
              <li><strong>Clear Pathways:</strong> Keep all pathways clear of obstructions. Arrange equipment thoughtfully to ensure egress routes.</li>
              <li><strong>Lockable Trunks:</strong> Use one or two lockable trunks fitting under/beside bunks to organize and protect personal belongings.</li>
              <li><strong>Laundry limits:</strong> Keep a laundry bag handy. Dirty socks shouldn't become a shared sensory experience. Handwash or arrange mountain laundromat runs.</li>
              <li><strong>Inspections:</strong> Quarters are an extension of the onstage experience. Admin reserves the right to conduct inspections for health, safety, and rules, adhering strictly to Safeguarding Youth protocols.</li>
              <li><strong>Music Restriction:</strong> No music played outside of the cabin, including the porch. Lights Out (10 PM - 6 AM) must be respected.</li>
            </ul>
          </div>

          <!-- Vehicle Guidelines -->
          <div class="glass-panel" style="display: flex; flex-direction: column; gap: 12px; border-top: 4px solid hsl(var(--accent));">
            <h3 style="color: hsl(var(--accent)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
              <span>🚗</span> Vehicles & Parking Hills
            </h3>
            <ul style="font-size: 13.5px; color: hsl(var(--muted-foreground)); padding-left: 20px; line-height: 1.5; display: flex; flex-direction: column; gap: 8px;">
              <li><strong>Backed In:</strong> Staff park on Staff Hill. All vehicles must be backed in and face the exit road for quick evacuation during EAP emergencies.</li>
              <li><strong>Under-18 Permit:</strong> Staff under 18 must have written parental approval and Camp Director approval to bring a motor vehicle.</li>
              <li><strong>Passenger Safety:</strong> Junior staff transported by persons other than parents must have written parental permission.</li>
              <li><strong>Restricted Access:</strong> Vehicles must remain in the Staff Hill parking lot. No motorized vehicles inside camp proper unless explicitly vetted.</li>
              <li><strong>Locked Cabin-only Items:</strong> Tobacco products possessed by staff 21+ must be locked in their vehicles. Smoking is allowed ONLY inside vehicles with windows closed.</li>
            </ul>
          </div>

          <!-- Visitor Procedures -->
          <div class="glass-panel" style="display: flex; flex-direction: column; gap: 12px; border-top: 4px solid #3b82f6;">
            <h3 style="color: #3b82f6; font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
              <span>👥</span> Visitor Safety Protocols
            </h3>
            <ul style="font-size: 13.5px; color: hsl(var(--muted-foreground)); padding-left: 20px; line-height: 1.5; display: flex; flex-direction: column; gap: 8px;">
              <li><strong>Prior Approval:</strong> Visitors must give advance notice and be approved by the Camp or Program Director before arrival.</li>
              <li><strong>Office Sign-In:</strong> Immediately sign in at the Guest Sign-In sheet at the Camp Office upon arrival. Sign out upon departure.</li>
              <li><strong>Overnight Stays:</strong> Overnights are allowed only with Camp Director permission, requiring a completed BSA Health Form (Parts A & B) and a Health Officer check.</li>
              <li><strong>Camp Rules:</strong> Guests are expected to follow all camp rules, dress appropriately, and stay out of staff quarters (strictly off-limits).</li>
              <li><strong>Intruder Alerts:</strong> Report any unauthorized persons on camp grounds immediately to the Camp Director.</li>
            </ul>
          </div>

          <!-- Drugs, Alcohol & Contraband -->
          <div class="glass-panel" style="display: flex; flex-direction: column; gap: 12px; border-top: 4px solid var(--safety-red);">
            <h3 style="color: var(--safety-red); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
              <span>🚫</span> Drugs, Alcohol & Contraband
            </h3>
            <ul style="font-size: 13.5px; color: hsl(var(--muted-foreground)); padding-left: 20px; line-height: 1.5; display: flex; flex-direction: column; gap: 8px;">
              <li><strong>Alcohol Ban:</strong> Strictly forbidden on Camp Lawton property, even for those over 21. Violation leads to immediate termination.</li>
              <li><strong>Marijuana Ban:</strong> No possession or use of marijuana is permitted in Camp Lawton (despite Arizona state laws). Under the influence is prohibited.</li>
              <li><strong>Pornography & Wifi:</strong> Possession of pornography is prohibited. Navigation to adult sites over camp-provided wifi will be automatically escalated to the Catalina Council Chief Scout Executive.</li>
              <li><strong>Trading Post Cash-Only:</strong> Staff discounts, free items, and tabs are not available. Cash or card at time of purchase only.</li>
              <li><strong>Scout-Appropriate Recreation:</strong> No M-rated games, R-rated movies, or excessive language. Cards Against Humanity is banned; use Apples-to-Apples. Do not bring large desktop computer/gaming rigs.</li>
            </ul>
          </div>

        </div>
      </div>
    `;
  }

  function renderLegal() {
    legalBtn.classList.add('active');
    radioBtn.classList.remove('active');
    guidelinesBtn.classList.remove('active');
    flowchartsBtn.classList.remove('active');

    const legalCards = policiesProceduresData.legalPolicies.map((policy, idx) => `
      <div style="background: hsl(var(--card)); border: 1px solid hsl(var(--border)); padding: 18px; border-radius: var(--radius-sm); border-left: 4px solid hsl(var(--primary));">
        <h4 style="font-weight: 700; margin-bottom: 8px;">${policy.title}</h4>
        <p style="font-size: 13.5px; color: hsl(var(--muted-foreground)); line-height: 1.5;">${policy.content}</p>
      </div>
    `).join('');

    panelMount.innerHTML = `
      <div class="schedule-content-panel" style="animation: tabFadeIn 0.3s ease both;">
        <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
          <span>⚖️</span> Legal & Administrative Policies
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap: 16px;">
          ${legalCards}
        </div>
      </div>
    `;
  }

  flowchartsBtn.addEventListener('click', renderFlowcharts);
  radioBtn.addEventListener('click', renderRadio);
  guidelinesBtn.addEventListener('click', renderGuidelines);
  legalBtn.addEventListener('click', renderLegal);

  const cleanup = () => {
    clearActiveTransmissions();
    window.removeEventListener('before-view-change', cleanup);
  };
  window.addEventListener('before-view-change', cleanup);

  renderFlowcharts();
}
