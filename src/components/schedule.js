import { sundayArrivalSteps, dailySchedule } from '../data/handbookData.js';
import { getContent, wrapEditable, initEditable } from './wysiwygEditor.js';

const DEFAULT_SUNDAY_INSTRUCTIONS = `
  <h4 style="font-weight: 700; color: hsl(var(--primary)); margin-bottom: 6px;">Sunday Check-In Instructions:</h4>
  <p style="font-size: 14px; line-height: 1.5; color: hsl(var(--muted-foreground));">
    All staff are expected to report to camp by <strong>12:00 PM on Sunday</strong>. Sign in at the office in Class A Field uniform. You will be assigned a troop as their <strong>Troop Friend</strong>. Visit them daily to pass evaluations and act as their liaison!
  </p>
`;

const DEFAULT_SIESTA_POLICY = `
  💤 <strong>Siesta Policy:</strong> The daily gap between lunch and afternoon session (1:00 PM - 2:00 PM) is a designated quiet hour. Go to cabins, relax, rest, and reset your nervous system. Music must not be played outside.
`;

const DEFAULT_ROLES_INTRO = `
  🛡️ <strong>Staff Age Requirements & Boundaries:</strong> Different roles carry strict age restrictions to comply with national and state guidelines. Safeguarding Youth guidelines apply to all staff levels.
`;

export function renderSchedule() {
  return `
    <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
      <!-- Tabs selectors -->
      <div class="schedule-tabs-container">
        <button class="schedule-tab-btn active" id="tab-btn-sunday">Sunday Arrival & Check-In</button>
        <button class="schedule-tab-btn" id="tab-btn-daily">Daily Life Routine</button>
        <button class="schedule-tab-btn" id="tab-btn-roles">Staff Duties & Roles</button>
      </div>

      <!-- Content panels mount point -->
      <div id="schedule-panel-mount">
        <!-- Renders dynamically -->
      </div>
    </div>
  `;
}

export function initSchedule() {
  const sundayBtn = document.getElementById('tab-btn-sunday');
  const dailyBtn = document.getElementById('tab-btn-daily');
  const rolesBtn = document.getElementById('tab-btn-roles');
  const panelMount = document.getElementById('schedule-panel-mount');

  if (!panelMount) return;

  function renderSundayPanel() {
    sundayBtn.classList.add('active');
    dailyBtn.classList.remove('active');
    rolesBtn.classList.remove('active');

    const stepsHtml = sundayArrivalSteps.map((step, idx) => `
      <div class="glass-panel sunday-step-card" style="animation: tabFadeIn 0.3s ease both; animation-delay: ${idx * 0.05}s;">
        <div class="sunday-step-number">${idx + 1}</div>
        <div class="sunday-step-info">
          <h4>${step.title}</h4>
          <p>${step.description}</p>
        </div>
      </div>
    `).join('');

    const sundayInstructions = getContent('schedule_sunday_instructions', DEFAULT_SUNDAY_INSTRUCTIONS);

    panelMount.innerHTML = `
      <div class="schedule-content-panel">
        <div style="background: hsl(var(--primary) / 0.05); border: 1px dashed hsl(var(--primary) / 0.2); border-radius: var(--radius-md); padding: 16px;">
          ${wrapEditable('schedule_sunday_instructions', sundayInstructions)}
        </div>
        
        <div class="sunday-check-in-grid" style="margin-top: 20px;">
          ${stepsHtml}
        </div>
      </div>
    `;

    initEditable('schedule_sunday_instructions', DEFAULT_SUNDAY_INSTRUCTIONS);
  }

  function renderDailyPanel() {
    sundayBtn.classList.remove('active');
    dailyBtn.classList.add('active');
    rolesBtn.classList.remove('active');

    const timelineHtml = dailySchedule.map((slot, idx) => `
      <div class="daily-timeline-item" style="animation: tabFadeIn 0.3s ease both; animation-delay: ${idx * 0.04}s;">
        <div class="daily-timeline-dot"></div>
        <div class="daily-timeline-time-box">
          <span class="daily-timeline-time">${slot.time}</span>
          <span class="daily-timeline-uniform">${slot.uniform}</span>
        </div>
        <div class="daily-timeline-card">
          <h4>${slot.activity}</h4>
          <p>${slot.notes}</p>
        </div>
      </div>
    `).join('');

    const siestaPolicy = getContent('schedule_siesta_policy', DEFAULT_SIESTA_POLICY);

    panelMount.innerHTML = `
      <div class="schedule-content-panel">
        <div style="background: hsl(var(--accent) / 0.08); border: 1px dashed hsl(var(--accent) / 0.3); border-radius: var(--radius-md); padding: 16px; font-size: 14.5px; line-height: 1.5;">
          ${wrapEditable('schedule_siesta_policy', siestaPolicy)}
        </div>
        
        <div class="daily-timeline">
          ${timelineHtml}
        </div>
      </div>
    `;

    initEditable('schedule_siesta_policy', DEFAULT_SIESTA_POLICY);
  }

  function renderRolesPanel() {
    sundayBtn.classList.remove('active');
    dailyBtn.classList.remove('active');
    rolesBtn.classList.add('active');

    const rolesIntro = getContent('schedule_roles_intro', DEFAULT_ROLES_INTRO);

    panelMount.innerHTML = `
      <div class="schedule-content-panel">
        <div style="background: hsl(var(--primary) / 0.05); border: 1px dashed hsl(var(--primary) / 0.2); border-radius: var(--radius-md); padding: 16px; font-size: 14.5px; line-height: 1.5;">
          ${wrapEditable('schedule_roles_intro', rolesIntro)}
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 20px; margin-top: 20px;">
          
          <div class="glass-panel" style="display: flex; flex-direction: column; gap: 10px; border-top: 4px solid #10b981; animation: tabFadeIn 0.3s ease both;">
            <h4 style="font-weight: 700; display: flex; align-items: center; gap: 6px;">🎒 Counselors in Training (CIT)</h4>
            <span style="font-size: 11px; font-weight: bold; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; width: fit-content;">Ages 14-15</span>
            <ul style="font-size: 13.5px; color: hsl(var(--muted-foreground)); padding-left: 18px; line-height: 1.5; display: flex; flex-direction: column; gap: 6px;">
              <li><strong>Hours:</strong> Max 8 hours/day, restricted strictly between 7:00 AM and 9:00 PM.</li>
              <li><strong>Teaching Limits:</strong> Must <em>never</em> be left to teach a merit badge or class by themselves.</li>
              <li><strong>Role Definition:</strong> CITs are part of a training program. They are not go-fers or cleanup servants, but nor are they full employees.</li>
              <li><strong>Respect:</strong> Treated with the same professional respect. The distinction between a full-season staffer and volunteer/CIT must be invisible to visitors.</li>
            </ul>
          </div>

          <div class="glass-panel" style="display: flex; flex-direction: column; gap: 10px; border-top: 4px solid #3b82f6; animation: tabFadeIn 0.3s ease both; animation-delay: 0.05s;">
            <h4 style="font-weight: 700; display: flex; align-items: center; gap: 6px;">🏕️ Junior Staff</h4>
            <span style="font-size: 11px; font-weight: bold; background: #dbeafe; color: #1d4ed8; padding: 2px 6px; border-radius: 4px; width: fit-content;">Ages 16-17</span>
            <ul style="font-size: 13.5px; color: hsl(var(--muted-foreground)); padding-left: 18px; line-height: 1.5; display: flex; flex-direction: column; gap: 6px;">
              <li><strong>Job Status:</strong> Classified as a summer job. Teaches interpersonal skills, professional behavior, food service, cleaning, and procedural compliance.</li>
              <li><strong>Restrictions:</strong> Subject to youth protection housing and buddy guidelines. Vehicles require parent and director written permits.</li>
              <li><strong>Duty Rosters:</strong> Expected to fully participate in cleaning, food service, and campsite assistance duties.</li>
            </ul>
          </div>

          <div class="glass-panel" style="display: flex; flex-direction: column; gap: 10px; border-top: 4px solid #8b5cf6; animation: tabFadeIn 0.3s ease both; animation-delay: 0.1s;">
            <h4 style="font-weight: 700; display: flex; align-items: center; gap: 6px;">⚖️ Adult Staff</h4>
            <span style="font-size: 11px; font-weight: bold; background: #f3e8ff; color: #6b21a8; padding: 2px 6px; border-radius: 4px; width: fit-content;">Ages 18+</span>
            <ul style="font-size: 13.5px; color: hsl(var(--muted-foreground)); padding-left: 18px; line-height: 1.5; display: flex; flex-direction: column; gap: 6px;">
              <li><strong>SYT Transition:</strong> Turning 18 instantly triggers adult rules (separate lodging, absolute prohibition of one-on-one contact with youth).</li>
              <li><strong>Responsibilities:</strong> Adults are not exempt from chores (meal cleanup, logs, campfire cleanup). It is not fair to ask youth to do work adults won't.</li>
              <li><strong>Leadership Ages:</strong> Area Directors must be 18+; Camp Director, Program Director, Range/Climbing Directors must be 21+.</li>
            </ul>
          </div>

        </div>
      </div>
    `;

    initEditable('schedule_roles_intro', DEFAULT_ROLES_INTRO);
  }

  // Bind tab events
  sundayBtn.addEventListener('click', renderSundayPanel);
  dailyBtn.addEventListener('click', renderDailyPanel);
  rolesBtn.addEventListener('click', renderRolesPanel);

  // Initial tab draw
  renderSundayPanel();
}
