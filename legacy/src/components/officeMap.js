import { openAppDialog } from '../main.js';
import confetti from 'canvas-confetti';

const campZones = [
  { id: 'zone-parade', name: 'Parade Grounds (Assembly flags)', type: 'emergency', description: 'Central grassy assembly grounds. The main assembly point for all emergency alarms and daily morning/evening flag ceremonies.', note: '🛎️ If emergency bell rings, report here immediately.' },
  { id: 'zone-dining', name: 'Dining Hall (Primary Lightning Shelter)', type: 'emergency', description: 'Primary dining hall and kitchen. Main indoor space, serves as the designated shelter for severe storms, lightning, and microbursts.', note: '⚡ Primary lightning shelter. Tents offer zero protection.' },
  { id: 'zone-scoutcraft', name: 'Scoutcraft Area', type: 'program', description: 'Under Area Director Jim Tarleton. Teaching pioneering, wilderness survival, camping, and rope work.', note: '🗺️ Scoutcraft teaches traditional outdoor skills.' },
  { id: 'zone-handicraft', name: 'Handicraft Area', type: 'program', description: 'Under Area Director Jack Erickson. Teaching woodcarving, basketry, leatherwork, and art.', note: '🎨 Keep area clean and return all blades/tools to lockers.' },
  { id: 'zone-nature', name: 'Nature Lodge', type: 'program', description: 'Under Area Director Andrew Rasmussen. Teaching astronomy, geology, forestry, environmental science, and reptile study.', note: '🐍 Non-venomous educational animals housed here.' },
  { id: 'zone-ranges', name: 'Range and Target Activities', type: 'program', description: 'Under Area Director Brian Rome. Archery, rifle, and shotgun ranges.', note: '🎯 Strictly controlled zones. Suspension under high winds.' },
  { id: 'zone-climbing', name: 'Climbing Wall & Tower', type: 'program', description: 'Under Director Jim Harrington. Rock wall climbing and rappelling training tower.', note: '🧗 Minimum age of director is 21.' },
  { id: 'zone-staffhill', name: 'Staff Hill (Cabins)', type: 'staff', description: 'North end of camp. Staff quarters, living cabins, and youth/adult staff shower houses.', note: '🔒 Strictly off-limits to campers. Respect roommate privacy.' },
  { id: 'zone-health', name: 'Health Lodge / Medic Office', type: 'staff', description: 'Medic office and emergency recovery beds. Coordinates first aid, logs injuries, and stores medications.', note: '🩹 Report all injuries, no matter how minor, immediately.' },
  { id: 'zone-trading', name: 'Trading Post', type: 'staff', description: 'Camp general store and business headquarters. Sells gear, snacks, and souvenirs.', note: '🎟️ No staff discount or credit tabs. Cash/card only.' }
];

export function renderOfficeMap() {
  return `
    <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;" id="map-parent">
      <!-- Search & Category Filters -->
      <div class="org-chart-controls">
        <div class="search-input-wrapper">
          <svg class="search-icon-svg" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="camp-map-search" placeholder="Search camp area or shelter..." aria-label="Search map zones" />
        </div>
        
        <div class="map-filters">
          <button class="map-filter-btn active" data-filter="all">All Areas</button>
          <button class="map-filter-btn" data-filter="program">Program Areas</button>
          <button class="map-filter-btn" data-filter="emergency">Emergency Shelters</button>
          <button class="map-filter-btn" data-filter="staff">Support & Staff</button>
        </div>
      </div>

      <!-- Map & Sidebar layout -->
      <div class="map-layout-grid">
        <!-- SVG Map Container -->
        <div class="glass-panel" style="padding: 12px; display: flex; flex-direction: column; align-items: center;" id="map-svg-container">
          <div class="map-svg-holder">
            <svg class="office-svg map-svg-element" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="none" />

              <!-- Outer property boundary outline -->
              <rect x="15" y="15" width="770" height="470" fill="none" stroke="hsl(var(--border))" stroke-width="2" stroke-dasharray="8 4" rx="12" />

              <!-- STAF HILL (NORTH) -->
              <rect x="250" y="30" width="300" height="90" class="map-svg-node" id="zone-staffhill" rx="8" />
              <text x="400" y="80" class="map-text">Staff Hill (North Cabins) 🏠</text>

              <!-- RANGE & TARGET AREA (TOP) -->
              <rect x="40" y="30" width="180" height="130" class="map-svg-node" id="zone-ranges" rx="8" />
              <text x="130" y="100" class="map-text">Range & Target 🎯</text>

              <!-- NATURE LODGE -->
              <rect x="40" y="180" width="180" height="90" class="map-svg-node" id="zone-nature" rx="8" />
              <text x="130" y="230" class="map-text">Nature Lodge 🔬</text>

              <!-- SCOUTCRAFT -->
              <rect x="40" y="290" width="180" height="110" class="map-svg-node" id="zone-scoutcraft" rx="8" />
              <text x="130" y="350" class="map-text">Scoutcraft 🗺️</text>

              <!-- CLIMBING TOWER -->
              <circle cx="280" cy="220" r="45" class="map-svg-node" id="zone-climbing" />
              <text x="280" y="225" class="map-text">Climbing 🧗</text>

              <!-- PARADE GROUNDS (CENTER - ASSEMBLY) -->
              <rect x="350" y="160" width="220" height="170" class="map-svg-node evac-grounds" id="zone-parade" rx="10" />
              <text x="460" y="240" class="map-text" style="fill: hsl(var(--accent)); font-weight: 800;">Parade Grounds 🛎️</text>
              <text x="460" y="260" class="map-text" style="font-size: 11px; fill: hsl(var(--accent));">(Evacuation Assembly)</text>

              <!-- DINING HALL (BOTTOM LEFT - SHELTER) -->
              <rect x="250" y="350" width="260" height="110" class="map-svg-node lightning-shelter" id="zone-dining" rx="8" />
              <text x="380" y="405" class="map-text" style="fill: #1d4ed8; font-weight: 800;">Dining Hall 🍽️</text>
              <text x="380" y="425" class="map-text" style="font-size: 11px; fill: #1d4ed8;">(Primary Storm Shelter)</text>

              <!-- HEALTH LODGE -->
              <rect x="590" y="160" width="170" height="90" class="map-svg-node" id="zone-health" rx="8" />
              <text x="675" y="210" class="map-text">Health Lodge 🩹</text>

              <!-- TRADING POST -->
              <rect x="590" y="270" width="170" height="110" class="map-svg-node" id="zone-trading" rx="8" />
              <text x="675" y="330" class="map-text">Trading Post 🎟️</text>

              <!-- HANDICRAFT -->
              <rect x="540" y="390" width="220" height="70" class="map-svg-node" id="zone-handicraft" rx="8" />
              <text x="650" y="430" class="map-text">Handicraft 🎨</text>

              <!-- Entrance road indicator -->
              <path d="M 400 480 L 400 460" stroke="hsl(var(--muted-foreground))" stroke-width="3" stroke-dasharray="4 4" />
              <text x="400" y="495" class="map-text" style="font-size: 10px; fill: hsl(var(--muted-foreground)); font-weight: 500;">Entrance Gate Parking 🚗</text>
            </svg>
          </div>
        </div>

        <!-- Sidebar Inspector / EAP Game panel -->
        <div class="glass-panel" style="display: flex; flex-direction: column; gap: 20px;">
          <button class="welcome-banner-btn" style="background: hsl(var(--danger)); box-shadow: 0 4px 12px hsl(var(--danger)/0.25);" id="eap-bell-btn">
            🚨 Sound EAP Bell Alarm!
          </button>
          
          <div id="map-sidebar-mount">
            <!-- Details shown here -->
            <div class="map-info-placeholder">
              <span style="font-size: 32px; display: block; margin-bottom: 10px;">🔍</span>
              Hover or click on any map zone to inspect descriptions, safety rules, and operational details.
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initOfficeMap() {
  const mapSearch = document.getElementById('camp-map-search');
  const filterBtns = document.querySelectorAll('.map-filter-btn');
  const sidebarMount = document.getElementById('map-sidebar-mount');
  const mapNodes = document.querySelectorAll('.map-svg-node');
  const wamAlertBtn = document.getElementById('eap-bell-btn');
  const mapParent = document.getElementById('map-parent');
  const mapContainer = document.getElementById('map-svg-container');

  let activeEapStep = null;

  if (!sidebarMount) return;

  function selectZone(node) {
    const id = node.id;
    mapNodes.forEach(n => n.classList.remove('selected-zone'));
    node.classList.add('selected-zone');

    const zone = campZones.find(z => z.id === id);
    if (zone) {
      renderZoneDetails(zone);
    }
  }

  function renderZoneDetails(zone) {
    sidebarMount.innerHTML = `
      <div style="animation: tabFadeIn 0.25s ease;">
        <h3 style="color: hsl(var(--primary)); margin-bottom: 8px;">${zone.name}</h3>
        <p style="font-size: 14px; line-height: 1.5; margin-bottom: 14px;">${zone.description}</p>
        
        <div style="background: hsl(var(--secondary) / 0.5); padding: 12px; border-radius: var(--radius-sm); border-left: 4px solid hsl(var(--primary)); font-size: 13.5px; font-weight: 500; line-height: 1.4;">
          ${zone.note}
        </div>
      </div>
    `;
  }

  // Bind clicks
  mapNodes.forEach(node => {
    node.addEventListener('click', () => {
      // If EAP simulation is active, click elements might progress EAP but clicking nodes normally inspects them
      selectZone(node);
    });
  });

  // Filters
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      mapNodes.forEach(node => {
        const id = node.id;
        const zone = campZones.find(z => z.id === id);
        
        if (filterVal === 'all') {
          node.style.opacity = '1';
          node.style.filter = 'none';
        } else if (zone && zone.type === filterVal) {
          node.style.opacity = '1';
          node.style.filter = 'none';
        } else {
          node.style.opacity = '0.2';
          node.style.filter = 'grayscale(60%)';
        }
      });
    });
  });

  // Search filter
  mapSearch.addEventListener('input', () => {
    const query = mapSearch.value.toLowerCase().trim();
    if (query === '') {
      mapNodes.forEach(n => {
        n.classList.remove('selected-zone');
        n.style.opacity = '1';
        n.style.filter = 'none';
      });
      return;
    }

    let foundFirst = false;

    mapNodes.forEach(node => {
      const id = node.id;
      const zone = campZones.find(z => z.id === id);
      if (!zone) return;

      const nameMatch = zone.name.toLowerCase().includes(query);
      const descMatch = zone.description.toLowerCase().includes(query);
      const notesMatch = zone.note.toLowerCase().includes(query);

      if (nameMatch || descMatch || notesMatch) {
        node.style.opacity = '1';
        node.style.filter = 'none';
        node.classList.add('selected-zone');
        if (!foundFirst) {
          selectZone(node);
          foundFirst = true;
        }
      } else {
        node.style.opacity = '0.2';
        node.style.filter = 'grayscale(60%)';
        node.classList.remove('selected-zone');
      }
    });
  });

  // EAP simulation game launcher
  wamAlertBtn.addEventListener('click', () => {
    if (activeEapStep !== null) {
      // Cancel EAP
      stopEapSimulation();
    } else {
      startEapSimulation();
    }
  });

  function startEapSimulation() {
    activeEapStep = 1;
    wamAlertBtn.textContent = '🛑 Cancel EAP Alarm';
    wamAlertBtn.style.background = 'hsl(var(--foreground))';
    mapContainer.classList.add('emergency-alarm-active');
    
    // Highlight evacuation route or bell
    drawEapStepUi();
  }

  function stopEapSimulation() {
    activeEapStep = null;
    wamAlertBtn.textContent = '🚨 Sound EAP Bell Alarm!';
    wamAlertBtn.style.background = 'hsl(var(--danger))';
    mapContainer.classList.remove('emergency-alarm-active');
    
    sidebarMount.innerHTML = `
      <div class="map-info-placeholder">
        <span style="font-size: 32px; display: block; margin-bottom: 10px;">🔍</span>
        Hover or click on any map zone to inspect descriptions, safety rules, and operational details.
      </div>
    `;
  }

  function drawEapStepUi() {
    if (activeEapStep === 1) {
      sidebarMount.innerHTML = `
        <div class="eap-simulation-panel" style="animation: fadeIn 0.25s ease;">
          <div class="eap-simulation-title">
            <span>🛎️</span> EAP Step 1: Secure Hazards
          </div>
          <p style="font-size: 13px; line-height: 1.4;">
            The camp dining bell is ringing continuously! Your first priority is to quickly secure any active hazards in your program area (extinguish fires, lock gear).
          </p>
          <button class="eap-sim-btn" id="eap-step1-btn">Secure Area Hazards! ✔️</button>
        </div>
      `;

      document.getElementById('eap-step1-btn').addEventListener('click', () => {
        activeEapStep = 2;
        drawEapStepUi();
      });
    } else if (activeEapStep === 2) {
      // Highlight Parade grounds on map
      const paradeNode = document.getElementById('zone-parade');
      if (paradeNode) paradeNode.classList.add('selected-zone');

      sidebarMount.innerHTML = `
        <div class="eap-simulation-panel" style="animation: fadeIn 0.25s ease;">
          <div class="eap-simulation-title">
            <span>🚶</span> EAP Step 2: Escort Scouts
          </div>
          <p style="font-size: 13px; line-height: 1.4;">
            Your area is secure. Immediately escort all scouts in your vicinity directly to the Parade Grounds. Do NOT let them return to campsites.
          </p>
          <button class="eap-sim-btn" id="eap-step2-btn">Escort Scouts to Parade Grounds! ➡️</button>
        </div>
      `;

      document.getElementById('eap-step2-btn').addEventListener('click', () => {
        activeEapStep = 3;
        drawEapStepUi();
      });
    } else if (activeEapStep === 3) {
      sidebarMount.innerHTML = `
        <div class="eap-simulation-panel" style="animation: fadeIn 0.25s ease;">
          <div class="eap-simulation-title">
            <span>📋</span> EAP Step 3: Roll-Call Account
          </div>
          <p style="font-size: 13px; line-height: 1.4;">
            Assembly complete. Scouts line up by troops and cabins. Submit a headcount of your scouts to the Camp Director for registration verification.
          </p>
          <button class="eap-sim-btn" id="eap-step3-btn" style="background: hsl(var(--success));">Check in Headcount! 🎉</button>
        </div>
      `;

      document.getElementById('eap-step3-btn').addEventListener('click', () => {
        // Trigger completion
        triggerEapSuccess();
      });
    }
  }

  function triggerEapSuccess() {
    activeEapStep = null;
    wamAlertBtn.textContent = '🚨 Sound EAP Bell Alarm!';
    wamAlertBtn.style.background = 'hsl(var(--danger))';
    mapContainer.classList.remove('emergency-alarm-active');

    // Confetti celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    sidebarMount.innerHTML = `
      <div class="glass-panel" style="text-align: center; border-color: hsl(var(--success)); background: hsl(var(--success-light) / 0.15); display: flex; flex-direction: column; gap: 12px; padding: 20px;">
        <span style="font-size: 40px;">🏆</span>
        <h4 style="color: hsl(var(--success)); font-weight: 800; font-family: var(--font-heading);">Evacuation Drill Completed!</h4>
        <p style="font-size: 13px; line-height: 1.4;">
          Excellent! You have successfully completed the Emergency Action Plan simulation. Remember: <strong>Secure Hazards -> Escort directly to flags -> Report headcount</strong>.
        </p>
        <button class="welcome-banner-btn" style="background: hsl(var(--success)); width: 100%; margin-top: 6px;" id="eap-reset-inspector">Reset Map</button>
      </div>
    `;

    document.getElementById('eap-reset-inspector').addEventListener('click', () => {
      mapNodes.forEach(n => n.classList.remove('selected-zone'));
      sidebarMount.innerHTML = `
        <div class="map-info-placeholder">
          <span style="font-size: 32px; display: block; margin-bottom: 10px;">🔍</span>
          Hover or click on any map zone to inspect descriptions, safety rules, and operational details.
        </div>
      `;
    });
  }
}
