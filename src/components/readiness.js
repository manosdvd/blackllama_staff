import { state, navigateTo } from '../main.js';

export const checklistTasks = [
  { id: 'checklist-1', text: 'Sign 2026 Staff Contract (HR)', category: 'Paperwork' },
  { id: 'checklist-2', text: 'Upload W-4 and Direct Deposit Forms', category: 'Paperwork' },
  { id: 'checklist-3', text: 'Review Camp Lawton Pillars (Training)', category: 'Reading' },
  { id: 'checklist-4', text: 'Acknowledge Staff Code of Conduct', category: 'Action Required' },
  { id: 'checklist-5', text: 'Pass Staff Handbook Quiz (100% req)', category: 'Certification' }
];

export function renderReadiness() {
  return `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; align-items: start;">
      <!-- Checklist Section -->
      <div class="glass-panel checklist-card" style="grid-column: span 1;">
        <div class="checklist-title-bar">
          <h3>Staff Readiness Tasks</h3>
        </div>
        <div class="checklist-items-list" id="readiness-checklist-mount">
          <!-- Injected dynamically -->
        </div>
      </div>

      <!-- Progress Section -->
      <div class="glass-panel progress-card" style="grid-column: span 1; position: sticky; top: 20px;">
        <h3>Readiness Progress</h3>
        <p style="color: hsl(var(--muted-foreground)); font-size: 14px;">Complete all items to get cleared by administration.</p>
        <div class="progress-circle-container">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle class="progress-circle-bg" cx="80" cy="80" r="70" />
            <circle class="progress-circle-fill" id="readiness-progress-circle" cx="80" cy="80" r="70" />
          </svg>
          <div class="progress-circle-text">
            <span id="readiness-progress-pct-display" style="font-size: 32px; font-weight: 800; font-family: var(--font-heading);">0%</span>
            <span id="readiness-progress-frac-display" style="font-size: 13px; font-weight: 600; opacity: 0.8;">0/5 Tasks</span>
          </div>
        </div>
        <div id="readiness-progress-encouragement" style="margin-top: 16px; font-weight: 600; font-size: 14.5px;"></div>
      </div>
    </div>
  `;
}

export function initReadiness() {
  renderChecklist();
  updateProgress();

  const handleChecklistUpdate = () => {
    renderChecklist();
    updateProgress();
  };

  const cleanup = () => {
    window.removeEventListener('state-tasks-updated', handleChecklistUpdate);
    window.removeEventListener('before-view-change', cleanup);
  };
  
  window.addEventListener('before-view-change', cleanup);
  window.addEventListener('state-tasks-updated', handleChecklistUpdate);
}

function renderChecklist() {
  const mount = document.getElementById('readiness-checklist-mount');
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
        import('./onboarding.js').then(m => m.setOnboardingTab('conduct'));
        navigateTo('onboarding'); // Code signer view
      } else if (taskId === 'checklist-5') {
        import('./onboarding.js').then(m => m.setOnboardingTab('quiz'));
        navigateTo('onboarding'); // Quiz view
      } else {
        // Toggle HR/Training tasks directly
        state.toggleTask(taskId);
      }
    });
  });
}

function updateProgress() {
  const pctDisplay = document.getElementById('readiness-progress-pct-display');
  const fracDisplay = document.getElementById('readiness-progress-frac-display');
  const circle = document.getElementById('readiness-progress-circle');
  const encouragement = document.getElementById('readiness-progress-encouragement');
  
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
