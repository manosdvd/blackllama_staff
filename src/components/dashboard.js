import { state, navigateTo } from '../main.js';

const checklistTasks = [
  { id: 'checklist-1', text: 'Submit Medical Forms A, B, and C', category: 'HR' },
  { id: 'checklist-2', text: 'Complete Safeguarding Youth Training (SYT)', category: 'Training' },
  { id: 'checklist-3', text: 'Complete online Hazardous Weather module', category: 'Training' },
  { id: 'checklist-4', text: 'Sign the Code of Conduct commitment sheet', category: 'Code' },
  { id: 'checklist-5', text: 'Take the Camp Lawton Certification Quiz', category: 'Quiz' }
];

export function renderDashboard() {
  return `
    <div class="dashboard-grid">
      <!-- Welcome Banner -->
      <div class="welcome-banner-card">
        <div class="welcome-banner-text">
          <h2>Welcome to the Mountain, <span id="dashboard-username">${state.username}</span>! 🌲</h2>
          <p>Congratulations on joining the Camp Lawton team! As Camp Staff, you are now part of a century-old legacy of shaping lives through the outdoor experience. Complete your readiness checks below to get set up for the summer.</p>
        </div>
        <button class="welcome-banner-btn" id="dashboard-explore-btn">Go to Camp Schedule</button>
      </div>

      <!-- WAM Hydration Alert Widget -->
      <div class="wam-alert-card" id="wam-card">
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <h3 style="font-size: 20px; font-weight: 800; font-family: var(--font-heading);">💦 Water Appreciation Moment (WAM)</h3>
          <p style="font-size: 14.5px; opacity: 0.9;">Shout "WAM!" and everyone drinks. Dehydration is a real hazard at 8,000 ft.</p>
          <span style="font-size: 13px; font-weight: 700; background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 4px; align-self: flex-start; margin-top: 6px;" id="wam-counter-display">Drinks Logged: ${state.wamCount}</span>
        </div>
        <button class="wam-button" id="wam-btn">Take a Drink! 🥤</button>
      </div>

      <!-- Checklist Section -->
      <div class="glass-panel checklist-card">
        <div class="checklist-title-bar">
          <h3>Staff Readiness Tasks</h3>
        </div>
        <div class="checklist-items-list" id="dashboard-checklist-mount">
          <!-- Injected dynamically -->
        </div>
      </div>

      <!-- Progress Section -->
      <div class="glass-panel progress-card">
        <h3>Readiness Progress</h3>
        <p style="color: hsl(var(--muted-foreground)); font-size: 14px;">Complete all items to get cleared by administration.</p>
        <div class="progress-circle-container">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle class="progress-circle-bg" cx="80" cy="80" r="70" />
            <circle class="progress-circle-fill" id="progress-circle" cx="80" cy="80" r="70" />
          </svg>
          <div class="progress-text-overlay">
            <span class="progress-percentage" id="progress-pct-display">0%</span>
            <span class="progress-fraction" id="progress-frac-display">0/5 Tasks</span>
          </div>
        </div>
        <p style="font-weight: 600; font-size: 14px;" id="progress-encouragement">Let's get ready!</p>
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
    exploreBtn.addEventListener('click', () => navigateTo('schedule'));
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

  // Render list
  renderChecklist();
  updateProgress();

  // Listeners
  const handleChecklistUpdate = () => {
    renderChecklist();
    updateProgress();
  };
  
  const handleWamUpdate = () => {
    if (wamCounterDisplay) {
      wamCounterDisplay.textContent = `Drinks Logged: ${state.wamCount}`;
    }
  };

  const cleanup = () => {
    window.removeEventListener('state-tasks-updated', handleChecklistUpdate);
    window.removeEventListener('state-wam-updated', handleWamUpdate);
    window.removeEventListener('before-view-change', cleanup);
  };
  window.addEventListener('before-view-change', cleanup);

  window.addEventListener('state-tasks-updated', handleChecklistUpdate);
  window.addEventListener('state-wam-updated', handleWamUpdate);
}

function renderChecklist() {
  const mount = document.getElementById('dashboard-checklist-mount');
  if (!mount) return;

  const html = checklistTasks.map(task => {
    const isCompleted = state.completedTasks.includes(task.id);
    return `
      <div class="checklist-item ${isCompleted ? 'checked' : ''}" data-task-id="${task.id}" role="checkbox" aria-checked="${isCompleted}">
        <div class="checklist-checkbox-container">
          <div class="checklist-checkbox"></div>
        </div>
        <span class="checklist-item-text">${task.text}</span>
        <span class="checklist-category-badge">${task.category}</span>
      </div>
    `;
  }).join('');

  mount.innerHTML = html;

  mount.querySelectorAll('.checklist-item').forEach(item => {
    item.addEventListener('click', () => {
      const taskId = item.getAttribute('data-task-id');
      
      // Route if clicked specific category links
      if (taskId === 'checklist-4') {
        navigateTo('packing'); // Code signer view
      } else if (taskId === 'checklist-5') {
        navigateTo('quiz'); // Quiz view
      } else {
        // Toggle HR/Training tasks directly
        state.toggleTask(taskId);
      }
    });
  });
}

function updateProgress() {
  const pctDisplay = document.getElementById('progress-pct-display');
  const fracDisplay = document.getElementById('progress-frac-display');
  const circle = document.getElementById('progress-circle');
  const encouragement = document.getElementById('progress-encouragement');
  
  if (!pctDisplay || !circle) return;

  const total = checklistTasks.length;
  const completed = checklistTasks.filter(t => state.completedTasks.includes(t.id)).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const circumference = 2 * Math.PI * 70;
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  
  const offset = circumference - (percentage / 100) * circumference;
  circle.style.strokeDashoffset = offset;

  pctDisplay.textContent = `${percentage}%`;
  if (fracDisplay) {
    fracDisplay.textContent = `${completed}/${total} Tasks`;
  }

  if (encouragement) {
    if (percentage === 0) {
      encouragement.textContent = 'Welcome! Let\'s get ready 🌲';
      encouragement.style.color = 'inherit';
    } else if (percentage < 50) {
      encouragement.textContent = 'Making progress! 🚶';
      encouragement.style.color = 'inherit';
    } else if (percentage < 100) {
      encouragement.textContent = 'Almost cleared for camp! ⛺';
      encouragement.style.color = 'inherit';
    } else {
      encouragement.textContent = 'All clear! Ready to lead! 🏆';
      encouragement.style.color = 'hsl(var(--success))';
    }
  }
}
