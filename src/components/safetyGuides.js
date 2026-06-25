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
        <p style="color: hsl(var(--muted-foreground)); font-size: 15px; max-width: 750px; line-height: 1.5; margin-bottom: 10px;">
          As camp staff, protecting youth and ensuring property safety is your primary duty. Review these interactive guides for severe weather drills, wildlife protocols, and mandatory Arizona reporting laws.
        </p>

        <div class="safety-flowcharts-grid">
          <!-- Lightning Safety Flowchart -->
          <div class="glass-panel flowchart-container">
            <h3 style="color: hsl(var(--primary)); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <span>⚡</span> Lightning Safety (30/30 Rule)
            </h3>
            
            <div class="flowchart-card action">
              <strong>Lightning flash or audible thunder detected</strong>
            </div>
            
            <div class="flowchart-arrow">↓</div>
            
            <div class="flowchart-card decision">
              <strong>Time between flash & thunder &le; 30 seconds?</strong>
              <div style="display: flex; justify-content: space-around; margin-top: 8px; font-weight: bold; font-size: 12px;">
                <span style="color: hsl(var(--danger));">YES</span>
                <span style="color: hsl(var(--muted-foreground));">NO</span>
              </div>
            </div>
            
            <div style="display: flex; gap: 20px; width: 100%; justify-content: center;">
              <div style="display: flex; flex-direction: column; align-items: center; width: 48%;">
                <div class="flowchart-arrow">↓</div>
                <div class="flowchart-card emergency" style="font-size: 12px; padding: 10px;">
                  <strong>Evacuate to Dining Hall!</strong>
                  <p style="font-size: 10px; margin-top: 4px; opacity: 0.85;">Tents offer zero protection.</p>
                </div>
                <div class="flowchart-arrow">↓</div>
                <div class="flowchart-card action" style="font-size: 11px; padding: 8px;">
                  Wait 30 minutes after last visible flash/thunder.
                </div>
              </div>
              
              <div style="display: flex; flex-direction: column; align-items: center; width: 48%;">
                <div class="flowchart-arrow">↓</div>
                <div class="flowchart-card action" style="font-size: 12px; padding: 10px; height: fit-content; margin-top: 10px;">
                  <strong>Monitor weather</strong>
                  <p style="font-size: 10px; margin-top: 4px; opacity: 0.85;">Stay alert for shifts.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Bear & Wildlife Flowchart -->
          <div class="glass-panel flowchart-container">
            <h3 style="color: hsl(var(--primary)); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <span>🐻</span> Bear Sighting (Code Brown)
            </h3>
            
            <div class="flowchart-card action">
              <strong>Bear spotted on camp grounds</strong>
            </div>
            
            <div class="flowchart-arrow">↓</div>
            
            <div class="flowchart-card decision">
              <strong>Remain Calm & Assess Threat</strong>
              <p style="font-size: 10px; opacity: 0.85; margin-top: 2px;">Ensure no smellables/food in sight.</p>
            </div>
            
            <div class="flowchart-arrow">↓</div>
            
            <div class="flowchart-card action">
              <strong>Radio "Code Brown" to Camp Director</strong>
              <p style="font-size: 10px; opacity: 0.85; margin-top: 2px;">Keep distant visual (Adults only).</p>
            </div>
            
            <div class="flowchart-arrow">↓</div>
            
            <div class="flowchart-card emergency">
              <strong>If bear attacks / charges:</strong>
              <p style="font-size: 12px; margin-top: 4px; font-weight: bold; color: hsl(var(--danger));">Yell loudly, throw objects. Do NOT run. Sound dining bell alarm.</p>
            </div>
          </div>

          <!-- Mandatory Abuse Reporting (ARS 13-3620) -->
          <div class="glass-panel flowchart-container" style="grid-column: 1 / -1; max-width: 100%;">
            <h3 style="color: hsl(var(--primary)); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <span>🛡️</span> Mandatory Reporting Hotline (ARS 13-3620)
            </h3>
            
            <div class="flowchart-card action" style="max-width: 500px;">
              <strong>Good-faith suspicion of child abuse or neglect</strong>
            </div>
            
            <div class="flowchart-arrow">↓</div>
            
            <div class="flowchart-card emergency" style="max-width: 500px;">
              <strong>Your Legal Duty: Mandated Reporter</strong>
              <p style="font-size: 12.5px; opacity: 0.9; margin-top: 4px;">You must report immediately. This duty cannot be delegated to supervisors.</p>
            </div>
            
            <div class="flowchart-arrow">↓</div>
            
            <div style="display: flex; gap: 20px; width: 100%; max-width: 700px; justify-content: center; flex-wrap: wrap;">
              <div class="flowchart-card action" style="flex: 1; min-width: 220px;">
                <h4 style="color: hsl(var(--primary)); font-size: 15px; font-weight: 700;">DCS Hotline 📞</h4>
                <p style="font-weight: 800; font-size: 17px; margin: 4px 0; color: hsl(var(--danger));">1-888-SOS-CHILD</p>
                <span style="font-size: 11px; opacity: 0.85;">(1-888-767-2445) Arizona State Hotline</span>
              </div>
              
              <div class="flowchart-card action" style="flex: 1; min-width: 220px;">
                <h4 style="color: hsl(var(--primary)); font-size: 15px; font-weight: 700;">Scouts First Helpline 📞</h4>
                <p style="font-weight: 800; font-size: 17px; margin: 4px 0;">1-844-SCOUTS1</p>
                <span style="font-size: 11px; opacity: 0.85;">(1-844-726-8871) 24hr Youth Safety helpline</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Heat Stress Matrix -->
        <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px;">
          <h3 style="color: hsl(var(--primary));">☀️ Heat Stress Diagnostics</h3>
          <p style="font-size: 14.5px; color: hsl(var(--muted-foreground));">Review symptoms to identify heat illnesses on dry mountain trails.</p>
          
          <div class="heat-matrix">
            <div class="heat-card exhaustion">
              <h4 style="color: hsl(var(--warning)); font-weight: 800; font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
                <span>⚠️</span> Heat Exhaustion
              </h4>
              <div style="font-size: 13.5px; line-height: 1.5;">
                <strong>Symptoms:</strong> Heavy sweating, pale or clammy skin, nausea or vomiting, dizziness, weakness, headache, muscle cramps.
                <br><br>
                <strong>Treatment:</strong> Move to shade immediately. Cool down with wet towels, remove excess clothing, sip cool water slowly. Do NOT give salt tablets.
              </div>
            </div>
            
            <div class="heat-card stroke">
              <h4 style="color: hsl(var(--danger)); font-weight: 800; font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
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
