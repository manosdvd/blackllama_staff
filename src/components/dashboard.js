import { state, navigateTo } from '../main.js';

const highlights = [
  { icon: '🐻', title: 'Code Brown Review', text: 'Brush up on the bear encounter protocol before your next hike.', linkView: 'policies', linkTab: 'safety', color: 'var(--safety-red)', bg: 'rgba(200, 35, 44, 0.1)' },
  { icon: '🔥', title: 'Campfire Builder', text: 'Did you know you can build and submit campfire programs digitally?', linkView: 'songbook', linkTab: 'builder', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  { icon: '⛺', title: 'Packing Checklist', text: 'Check your gear! Review what is privileged and what is prohibited.', linkView: 'onboarding', linkTab: 'checklists', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  { icon: '⚡', title: 'Severe Weather', text: 'Practice the 30/30 Lightning rule before monsoon season hits.', linkView: 'policies', linkTab: 'safety', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  { icon: '📻', title: 'Radio Protocol', text: 'Practice your radio transmission scripts in the training sandbox.', linkView: 'policies', linkTab: 'radio', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' }
];

// Global ref so we can bind click handler to the rendered random highlight
let currentHighlight = null;

function renderAppBanner() {
  const applications = JSON.parse(localStorage.getItem('camp_lawton_applications') || '[]');
  const myApp = state.username ? applications.find(app => app.username.toLowerCase() === state.username.toLowerCase()) : null;
  
  if (!myApp) {
    return `
      <div class="glass-panel app-banner-card" id="dashboard-app-banner">
        <div class="app-banner-content">
          <span class="app-banner-icon">📝</span>
          <div class="app-banner-text">
            <h3>Ready to join the 2026 staff?</h3>
            <p>Fill out and submit your interactive Camp Lawton Staff Application today.</p>
          </div>
        </div>
        <button class="welcome-banner-btn" style="pointer-events: none;">Apply Now</button>
      </div>
    `;
  }

  let statusClass = 'pending';
  let statusText = 'Pending Review';
  let statusIcon = '⏳';
  
  if (myApp.status === 'Approved') {
    statusClass = 'approved';
    statusText = 'Approved';
    statusIcon = '✅';
  } else if (myApp.status === 'Rejected') {
    statusClass = 'rejected';
    statusText = 'Rejected / Incomplete';
    statusIcon = '❌';
  }
  
  return `
    <div class="glass-panel app-banner-card submitted" id="dashboard-app-banner">
      <div class="app-banner-content">
        <span class="app-banner-icon">📝</span>
        <div class="app-banner-text">
          <h3>Your 2026 Staff Application</h3>
          <p>Submitted: ${new Date(myApp.submittedAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div class="app-status-badge ${statusClass}">
        <span>${statusIcon}</span>
        <span>${statusText}</span>
      </div>
    </div>
  `;
}

export function renderDashboard() {
  const welcomeText = state.username 
    ? `Welcome to the Mountain, <span id="dashboard-username">${state.username}</span>! 🌲`
    : `Welcome to the Mountain! 🌲`;

  return `
    <div class="dashboard-grid">
      <!-- Welcome Banner -->
      <div class="welcome-banner-card">
        <div class="welcome-banner-text">
          <h2>${welcomeText}</h2>
          <p>Congratulations on joining the Camp Lawton team! As Camp Staff, you are now part of a century-old legacy of shaping lives through the outdoor experience.</p>
        </div>
        <button class="welcome-banner-btn" id="dashboard-explore-btn">Go to Camp Schedule</button>
      </div>

      <!-- Application Banner -->
      ${renderAppBanner()}

      <!-- Semi-Random Highlight Box -->
      ${(() => {
        currentHighlight = highlights[Math.floor(Math.random() * highlights.length)];
        return `
          <div class="glass-panel dashboard-flex-panel highlight-box-hover" id="dashboard-highlight-box" style="grid-column: 1 / -1; background: ${currentHighlight.bg}; border: 1px solid ${currentHighlight.color}; cursor: pointer;">
            <div class="dashboard-flex-panel-content">
              <span style="font-size: 32px;">${currentHighlight.icon}</span>
              <div>
                <h3 style="margin: 0 0 4px 0; color: ${currentHighlight.color}; font-size: 18px;">Training Spotlight: ${currentHighlight.title}</h3>
                <p style="margin: 0; font-size: 14.5px; color: hsl(var(--foreground)); opacity: 0.9;">${currentHighlight.text}</p>
              </div>
            </div>
            <span class="dashboard-flex-panel-action" style="color: ${currentHighlight.color}; font-weight: 800;">Review ➔</span>
          </div>
        `;
      })()}

      <!-- WAM Hydration Alert Widget -->
      <div class="wam-alert-card" id="wam-card">
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <h3 style="font-size: 20px; font-weight: 800; font-family: var(--font-heading);">💦 Water Appreciation Moment (WAM)</h3>
          <p style="font-size: 14.5px; opacity: 0.9;">Shout "WAM!" and everyone drinks. Dehydration is a real hazard at 8,000 ft.</p>
          <span style="font-size: 13px; font-weight: 700; background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 4px; align-self: flex-start; margin-top: 6px;" id="wam-counter-display">Drinks Logged: ${state.wamCount}</span>
        </div>
        <button class="wam-button" id="wam-btn">Take a Drink! 🥤</button>
      </div>

      <!-- Tag Out Protocol Widget -->
      <div class="glass-panel dashboard-flex-panel" style="grid-column: 1 / -1; background: rgba(139, 92, 246, 0.1); border: 1px solid #8b5cf6;">
        <div class="dashboard-flex-panel-content">
          <h3 style="margin: 0 0 8px 0; color: #8b5cf6; font-size: 18px;">🧘 The "Tag Out" Protocol</h3>
          <p style="margin: 0; font-size: 14px; color: hsl(var(--foreground)); line-height: 1.5;">
            Feeling overwhelmed? It is completely valid. If a camper is escalating, or you just hit a wall, you have the right to request a <strong>Strategic Retreat</strong>. Ask your Area Director to tag in while you take 5 minutes to reset.
          </p>
        </div>
        <button id="tag-out-btn" class="dashboard-flex-panel-action" style="background: #8b5cf6; color: white; border: none; padding: 12px 24px; border-radius: var(--radius-sm); font-weight: 700; font-family: var(--font-heading); font-size: 16px; cursor: pointer; transition: all 0.2s ease;">
          Acknowledge Tag Out Right
        </button>
      </div>
    </div>
  `;
}

export function initDashboard() {
  // Sync name
  const nameSpan = document.getElementById('dashboard-username');
  if (nameSpan) {
    nameSpan.textContent = state.username;
  }

  // Explore button link
  const exploreBtn = document.getElementById('dashboard-explore-btn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => { import('./camplawton.js').then(m => m.setCampLawtonTab('schedule')); navigateTo('camplawton'); });
  }
  
  // Highlight box link
  const highlightBox = document.getElementById('dashboard-highlight-box');
  if (highlightBox && currentHighlight) {
    highlightBox.addEventListener('click', () => {
      // Need to import specific tab setters if using them, but we can dynamically import or dispatch
      if (currentHighlight.linkView === 'policies') {
        import('./policies.js').then(m => m.setPoliciesTab(currentHighlight.linkTab));
      } else if (currentHighlight.linkView === 'songbook') {
        import('./songbook.js').then(m => m.activeSongbookTab = currentHighlight.linkTab);
      } else if (currentHighlight.linkView === 'onboarding') {
        import('./onboarding.js').then(m => m.setOnboardingTab(currentHighlight.linkTab));
      }
      navigateTo(currentHighlight.linkView);
    });
    
    // Add simple hover effect in JS
    highlightBox.addEventListener('mouseenter', () => highlightBox.style.transform = 'translateY(-2px)');
    highlightBox.addEventListener('mouseleave', () => highlightBox.style.transform = 'translateY(0)');
  }

  // Application banner click link
  const appBanner = document.getElementById('dashboard-app-banner');
  if (appBanner) {
    appBanner.addEventListener('click', () => {
      setPart4Tab('apply');
      navigateTo('onboarding');
    });
  }

  // WAM trigger
  const wamBtn = document.getElementById('wam-btn');
  const wamCard = document.getElementById('wam-card');
  const wamCounterDisplay = document.getElementById('wam-counter-display');
  
  if (wamBtn && wamCard) {
    wamBtn.addEventListener('click', (e) => {
      state.incrementWam();
      
      // Visual ripple splash
      const ripple = document.createElement('div');
      ripple.classList.add('wam-ripple-effect');
      
      // Position ripple based on mouse pointer
      const rect = wamCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      wamCard.appendChild(ripple);
      setTimeout(() => ripple.remove(), 1200);
    });
  }

  // Tag Out trigger
  const tagOutBtn = document.getElementById('tag-out-btn');
  if (tagOutBtn) {
    tagOutBtn.addEventListener('click', () => {
      tagOutBtn.innerHTML = '✅ Retreat Acknowledged';
      tagOutBtn.style.background = 'rgba(139, 92, 246, 0.2)';
      tagOutBtn.style.color = '#8b5cf6';
      tagOutBtn.style.pointerEvents = 'none';
      alert('Your Area Director has been notified via the simulation network. Retreat and reset.');
    });
  }

  const handleWamUpdate = () => {
    if (wamCounterDisplay) {
      wamCounterDisplay.textContent = `Drinks Logged: ${state.wamCount}`;
    }
  };

  const cleanup = () => {
    window.removeEventListener('state-wam-updated', handleWamUpdate);
    window.removeEventListener('before-view-change', cleanup);
  };
  window.addEventListener('before-view-change', cleanup);

  window.addEventListener('state-wam-updated', handleWamUpdate);
}
