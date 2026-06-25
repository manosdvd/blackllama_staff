import { onboardingRoadmap } from '../data/handbookData.js';

export function renderOnboarding() {
  const nodesHtml = onboardingRoadmap.map((milestone, idx) => {
    const tasksHtml = milestone.tasks.map(task => {
      return `
        <div class="timeline-task-item">
          <span class="timeline-task-bullet">•</span>
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <span>${task.text}</span>
            <div>
              <span class="timeline-task-badge ${task.required ? 'required' : 'recommended'}">
                ${task.required ? 'Required' : 'Recommended'}
              </span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="timeline-node" style="animation: timelineCardFadeIn 0.5s ease-out both; animation-delay: ${idx * 0.1}s;">
        <!-- Timeline Dot Marker -->
        <div class="timeline-node-marker"></div>

        <!-- Content Card -->
        <div class="glass-panel timeline-card">
          <div class="timeline-card-header">
            <div class="timeline-icon">${milestone.icon}</div>
            <div class="timeline-header-text">
              <h3>${milestone.title}</h3>
              <p>${milestone.description}</p>
            </div>
          </div>

          <div class="timeline-tasks-list">
            ${tasksHtml}
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div style="display: flex; flex-direction: column; gap: 20px;">
      <p style="color: hsl(var(--muted-foreground)); font-size: 15px; max-width: 700px; line-height: 1.5;">
        Your onboarding milestones are designed to support your growth, system access, and project delivery targets. Explore the checkpoints below to understand what to focus on during your first months.
      </p>
      
      <div class="timeline-container">
        <!-- Vertical connector line -->
        <div class="timeline-line"></div>
        ${nodesHtml}
      </div>
    </div>

    <style>
      @keyframes timelineCardFadeIn {
        from {
          opacity: 0;
          transform: translateX(12px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    </style>
  `;
}
