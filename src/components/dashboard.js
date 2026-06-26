import { state, navigateTo } from '../main.js';
import { api } from '../services/apiClient.js';
import { AuthService } from '../services/auth.js';

const CAMP_CONTACT_CARD = `
  <!-- Camp Lawton Mailing Address & Contact Info -->
  <div class="glass-panel" style="grid-column: 1 / -1; display: flex; flex-direction: column; gap: 16px; border-left: 4px solid var(--accent); margin-top: 10px; margin-bottom: 10px;">
    <h3 style="color: hsl(var(--primary)); font-size: 18px; margin: 0; display: flex; align-items: center; gap: 8px;">
      <span>📬</span> Camp Mailing Address & Contact Info
    </h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; font-size: 14px; line-height: 1.5;">
      <div>
        <h4 style="font-weight: 700; margin-bottom: 6px; color: hsl(var(--primary));">📫 Snail Mail & Packages</h4>
        <p style="margin: 0; color: hsl(var(--muted-foreground)); font-size: 13px;">
          Give this address to family and friends to receive letters and care packages while at camp:
        </p>
        <div style="background: hsl(var(--secondary) / 0.3); border: 1px solid hsl(var(--border)); padding: 12px; border-radius: var(--radius-sm); font-family: monospace; font-size: 13.5px; margin-top: 8px; color: hsl(var(--foreground)); line-height: 1.4;">
          Staff's Name, Staff<br>
          Camp Lawton, BSA<br>
          PO Box 786<br>
          Mt. Lemmon, AZ 85619
        </div>
        <p style="margin: 8px 0 0 0; font-size: 12px; font-style: italic; color: hsl(var(--muted-foreground));">
          ⚠️ Note: It takes up to three days for snail mail to traverse the mountain post system.
        </p>
      </div>
      <div>
        <h4 style="font-weight: 700; margin-bottom: 6px; color: hsl(var(--primary));">📞 Camp Location & Communications</h4>
        <p style="margin: 0; color: hsl(var(--muted-foreground)); font-size: 13px;">
          Camp Lawton is situated at 8,000 feet of elevation in the Santa Catalina Mountains near Tucson.
        </p>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px; font-weight: 600;">
          <div>☎️ Camp Office: <a href="tel:520-576-1263" style="color: hsl(var(--primary)); text-decoration: none;">520-576-1263</a></div>
          <div>📍 GPS Coordinates: 32°26'12"N, 110°46'52"W</div>
          <div>⛰️ Elevation: ~8,000 feet</div>
        </div>
      </div>
    </div>
  </div>
`;

let currentHighlight = null;
const highlights = [
  { icon: '🐻', title: 'Code Brown Review', text: 'Brush up on the bear encounter protocol before your next hike.', linkView: 'policies', linkTab: 'safety', color: 'var(--safety-red)', bg: 'rgba(200, 35, 44, 0.1)' },
  { icon: '🔥', title: 'Campfire Builder', text: 'Did you know you can build and submit campfire programs digitally?', linkView: 'songbook', linkTab: 'builder', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  { icon: '⛺', title: 'Packing Checklist', text: 'Check your gear! Review what is privileged and what is prohibited.', linkView: 'onboarding', linkTab: 'checklists', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  { icon: '⚡', title: 'Severe Weather', text: 'Practice the 30/30 Lightning rule before monsoon season hits.', linkView: 'policies', linkTab: 'safety', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  { icon: '📻', title: 'Radio Protocol', text: 'Practice your radio transmission scripts in the training sandbox.', linkView: 'policies', linkTab: 'radio', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' }
];

let blogPosts = [];
let isEditingBlog = false;

export function renderDashboard() {
  const user = state.username;
  const role = state.role;

  // ── 1. GUEST VIEW ────────────────────────────────────────────────────────
  if (!user) {
    return renderGuestDashboard();
  }

  // ── 2. CANDIDATE VIEW ────────────────────────────────────────────────────
  if (role === 'Candidate') {
    return renderCandidateDashboard();
  }

  // ── 3. STAFF VIEW ────────────────────────────────────────────────────────
  return renderStaffDashboard();
}

function renderGuestDashboard() {
  return `
    <div class="dashboard-grid">
      <!-- History and Promotion -->
      <div class="welcome-banner-card" style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: flex-start; gap: 16px;">
        <h2 style="font-size: 28px; color: hsl(var(--primary));">Welcome to Camp Lawton 🌲</h2>
        <p style="font-size: 15.5px; line-height: 1.6;">
          Since 1920, Camp Lawton has been the premier high-adventure camp in the Santa Catalina Mountains of southern Arizona. Situated at 8,000 feet of elevation among towering ponderosa pines, Camp Lawton offers scouts a sanctuary to learn, lead, and grow.
        </p>
        <p style="font-size: 15px; line-height: 1.6; opacity: 0.9;">
          Each summer, our camp staff guides hundreds of youth through merit badge instruction, wilderness survival training, archery, climbing, and campfire camaraderie. Our staff is built on <strong>Leadership, Service, and Excellence</strong>.
        </p>
        <button class="welcome-banner-btn" id="guest-apply-btn" style="margin-top: 10px; padding: 14px 28px; font-size: 16px;">Apply to Join 2026 Staff 📝</button>
      </div>

      <!-- Core Pillars -->
      <div class="glass-panel" style="grid-column: span 1;">
        <h3 style="color: hsl(var(--primary)); margin-bottom: 12px; font-size: 18px;">🏕️ Camp Culture</h3>
        <p style="font-size: 14px; line-height: 1.5; color: hsl(var(--muted-foreground));">
          At Camp Lawton, staff members develop lifelong bonds and professional skills. As camp staff, you represent the values of Scouting America and are the heartbeat of the summer camp program.
        </p>
      </div>

      <!-- Staff Expectations -->
      <div class="glass-panel" style="grid-column: span 1;">
        <h3 style="color: hsl(var(--primary)); margin-bottom: 12px; font-size: 18px;">🏛️ Staff Expectations</h3>
        <p style="font-size: 14px; line-height: 1.5; color: hsl(var(--muted-foreground));">
          A successful camp staff member demonstrates a positive attitude, robust scout knowledge, pristine appearance, and professional personality. Training and prep are accessible to all visitors.
        </p>
      </div>

      ${CAMP_CONTACT_CARD}

      <!-- Blog Updates Widget -->
      <div class="glass-panel" style="grid-column: 1 / -1; display: flex; flex-direction: column; gap: 16px;">
        <h3 style="color: hsl(var(--primary)); font-size: 20px;">📰 Camp News & Announcements</h3>
        <div id="dashboard-blog-mount">Loading announcements...</div>
      </div>
    </div>
  `;
}

function renderCandidateDashboard() {
  const applications = JSON.parse(localStorage.getItem('camp_lawton_applications') || '[]');
  const myApp = applications.find(app => app.username.toLowerCase() === state.username.toLowerCase());

  let statusHtml = '';
  if (!myApp) {
    statusHtml = `
      <div class="glass-panel" style="border-color: hsl(var(--warning) / 0.4); background: hsl(var(--warning) / 0.05); padding: 24px; display: flex; flex-direction: column; gap: 12px;">
        <h3 style="color: hsl(var(--warning)); margin: 0;">📝 Complete Your Staff Application</h3>
        <p style="margin: 0; line-height: 1.5; font-size: 14.5px;">
          You registered successfully. Now you need to submit your formal Camp Lawton staff application to be reviewed by the Camp Director.
        </p>
        <button class="welcome-banner-btn" id="candidate-fill-app-btn" style="align-self: flex-start; margin-top: 8px;">Fill Application Form</button>
      </div>
    `;
  } else if (myApp.status === 'Pending') {
    statusHtml = `
      <div class="glass-panel" style="border-color: hsl(var(--primary) / 0.4); background: hsl(var(--primary) / 0.03); padding: 24px; display: flex; gap: 16px; align-items: center;">
        <span style="font-size: 40px;">⏳</span>
        <div>
          <h3 style="color: hsl(var(--primary)); margin: 0 0 4px 0;">Application Under Review</h3>
          <p style="margin: 0; line-height: 1.5; font-size: 14.5px; opacity: 0.9;">
            Your staff application was submitted on <strong>${new Date(myApp.submittedAt).toLocaleDateString()}</strong>. The Camp Director is reviewing your preferences and references. We will notify you here once decided.
          </p>
        </div>
      </div>
    `;
  } else if (myApp.status === 'Approved') {
    statusHtml = `
      <div class="glass-panel" style="border-color: hsl(var(--success) / 0.4); background: hsl(var(--success-light) / 0.2); padding: 24px; display: flex; flex-direction: column; gap: 12px; animation: pulse-border 2s infinite;">
        <div style="display: flex; gap: 16px; align-items: center;">
          <span style="font-size: 40px;">🎉</span>
          <div>
            <h3 style="color: hsl(var(--success)); margin: 0 0 4px 0;">Congratulations! You're Hired!</h3>
            <p style="margin: 0; font-size: 14.5px; font-weight: 600;">Assigned Position: ${myApp.formData?.pref1 || 'Staff'}</p>
          </div>
        </div>
        <p style="margin: 0; line-height: 1.5; font-size: 14px; opacity: 0.9; margin-left: 56px;">
          Welcome to the Camp Lawton staff family! Your role is officially updated. Your next step is to log out and log back in to activate your staff permissions and complete your digital onboarding.
        </p>
        <button class="welcome-banner-btn" id="candidate-relogin-btn" style="align-self: flex-start; margin-left: 56px; margin-top: 8px;">Refresh / Relog</button>
      </div>
    `;
  } else if (myApp.status === 'Rejected') {
    statusHtml = `
      <div class="glass-panel" style="border-color: hsl(var(--danger) / 0.4); background: hsl(var(--danger) / 0.05); padding: 24px; display: flex; gap: 16px; align-items: flex-start;">
        <span style="font-size: 40px;">❌</span>
        <div>
          <h3 style="color: hsl(var(--danger)); margin: 0 0 6px 0;">Application Status Update</h3>
          <p style="margin: 0 0 12px 0; line-height: 1.5; font-size: 14.5px;">
            Thank you for your interest in Camp Lawton. Our leadership team has reviewed your application and updated its status.
          </p>
          <div style="background: hsl(var(--danger) / 0.08); border-left: 4px solid hsl(var(--danger)); padding: 12px; border-radius: var(--radius-sm); font-size: 13.5px; font-style: italic;">
            <strong>Reviewer Note:</strong> "${myApp.review_notes || 'Your application was not selected for this season. Thank you for applying.'}"
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
      ${statusHtml}

      ${CAMP_CONTACT_CARD}

      <!-- Blog Updates Widget -->
      <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px; margin-top: 10px;">
        <h3 style="color: hsl(var(--primary)); font-size: 20px;">📰 Camp News & Announcements</h3>
        <div id="dashboard-blog-mount">Loading announcements...</div>
      </div>
    </div>
  `;
}

function renderStaffDashboard() {
  const isChecklistDone = state.completedTasks.length === 5;
  
  // Fetch if admin confirmed their onboarding
  const currentUser = AuthService.getCurrentUser();
  const isOnboardingConfirmed = currentUser?.onboarding_confirmed || false;

  const isFullyOnboarded = isChecklistDone && isOnboardingConfirmed;

  let onboardingStatusCard = '';
  
  if (!isFullyOnboarded) {
    onboardingStatusCard = `
      <!-- Onboarding Checklist Spotlight (Primary Highlight until complete) -->
      <div class="glass-panel" style="grid-column: 1 / -1; border: 1.5px solid hsl(var(--primary)); background: hsl(var(--primary) / 0.03); display: flex; flex-direction: column; gap: 16px; padding: 28px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div>
            <h3 style="color: hsl(var(--primary)); font-size: 22px; margin: 0 0 4px 0;">🎒 Complete Your Staff Onboarding</h3>
            <p style="margin: 0; font-size: 14.5px; color: hsl(var(--muted-foreground));">
              You must complete all onboarding tasks and have them verified by administration to be cleared for Camp.
            </p>
          </div>
          <button class="welcome-banner-btn" onclick="document.getElementById('nav-btn-onboarding').click()">Go to Checklist</button>
        </div>

        <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 200px; height: 10px; background: hsl(var(--border)); border-radius: 5px; overflow: hidden; position: relative;">
            <div style="position: absolute; left: 0; top: 0; height: 100%; width: ${(state.completedTasks.length / 5) * 100}%; background: hsl(var(--success)); transition: width 0.3s;"></div>
          </div>
          <span style="font-weight: 700; font-size: 14px;">${state.completedTasks.length}/5 Checklist Tasks Done</span>
          <span style="font-size: 12px; background: ${isOnboardingConfirmed ? 'hsl(var(--success-light))' : 'hsl(var(--secondary))'}; color: ${isOnboardingConfirmed ? 'hsl(var(--success))' : 'inherit'}; font-weight: 700; padding: 4px 10px; border-radius: 12px; text-transform: uppercase; border: 1px solid ${isOnboardingConfirmed ? 'hsl(var(--success) / 0.2)' : 'transparent'};">
            ${isOnboardingConfirmed ? '🛡️ Admin Verified' : '⏳ Pending Admin Verification'}
          </span>
        </div>
      </div>
    `;
  } else {
    // Onboarding complete -> priority shifts to Training and Policies
    onboardingStatusCard = `
      <div class="welcome-banner-card" style="grid-column: 1 / -1;">
        <div class="welcome-banner-text">
          <h2>Cleared for Camp Lawton! 🏆</h2>
          <p>Your onboarding paperwork and certification checks are completely approved by admin. Study camp emergency procedures, radio codes, and training expectations below.</p>
        </div>
        <button class="welcome-banner-btn" id="dashboard-explore-btn">Go to Training</button>
      </div>
    `;
  }

  return `
    <div class="dashboard-grid">
      ${onboardingStatusCard}

      <!-- Highlight Card -->
      ${(() => {
        currentHighlight = highlights[Math.floor(Math.random() * highlights.length)];
        return `
          <div class="glass-panel dashboard-flex-panel highlight-box-hover" id="dashboard-highlight-box" style="grid-column: 1 / -1; background: ${currentHighlight.bg}; border: 1px solid ${currentHighlight.color}; cursor: pointer; display: flex; justify-content: space-between; align-items: center; padding: 18px 24px;">
            <div class="dashboard-flex-panel-content" style="display: flex; align-items: center; gap: 16px;">
              <span style="font-size: 32px;">${currentHighlight.icon}</span>
              <div>
                <h3 style="margin: 0 0 4px 0; color: ${currentHighlight.color}; font-size: 17px;">Spotlight: ${currentHighlight.title}</h3>
                <p style="margin: 0; font-size: 14px; opacity: 0.9;">${currentHighlight.text}</p>
              </div>
            </div>
            <span class="dashboard-flex-panel-action" style="color: ${currentHighlight.color}; font-weight: 800; font-size: 14px;">Review ➔</span>
          </div>
        `;
      })()}

      <!-- WAM Hydration Widget -->
      <div class="wam-alert-card" id="wam-card" style="grid-column: span 1;">
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <h3 style="font-size: 18px; font-weight: 800; font-family: var(--font-heading);">💦 Water Appreciation Moment (WAM)</h3>
          <p style="font-size: 13.5px; opacity: 0.95;">Shout "WAM!" and everyone drinks. Dehydration is dangerous at 8,000 ft.</p>
          <span style="font-size: 12px; font-weight: 700; background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; align-self: flex-start; margin-top: 4px;" id="wam-counter-display">Logged: ${state.wamCount} WAMs</span>
        </div>
        <button class="wam-button" id="wam-btn">Drink! 🥤</button>
      </div>

      <!-- Tag Out Widget -->
      <div class="glass-panel" style="grid-column: span 1; display: flex; flex-direction: column; justify-content: space-between; gap: 12px;">
        <div>
          <h3 style="color: #8b5cf6; font-size: 18px; margin-bottom: 6px;">🧘 Tactical "Tag Out"</h3>
          <p style="margin: 0; font-size: 13.5px; line-height: 1.4; opacity: 0.9;">
            Feeling stressed or overwhelmed? Ask your Area Director to tag in for 5 minutes so you can reset. You have the right to retreat.
          </p>
        </div>
        <button id="tag-out-btn" class="welcome-banner-btn" style="background: #8b5cf6; width: 100%; padding: 10px; font-size: 13.5px;">Acknowledge Strategic Retreat</button>
      </div>

      ${CAMP_CONTACT_CARD}

      <!-- Blog Updates Box (With Admin Wysiwyg) -->
      <div class="glass-panel" style="grid-column: 1 / -1; display: flex; flex-direction: column; gap: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3 style="color: hsl(var(--primary)); font-size: 20px;">📰 Camp News & Updates</h3>
          ${AuthService.isAdmin() ? `
            <button class="welcome-banner-btn" id="admin-create-blog-btn" style="font-size: 13.5px; padding: 6px 14px;">
              ${isEditingBlog ? '✕ Cancel' : '➕ Write Announcement'}
            </button>
          ` : ''}
        </div>

        <div id="blog-editor-mount"></div>
        <div id="dashboard-blog-mount">Loading announcements...</div>
      </div>
    </div>
  `;
}

export async function initDashboard() {
  const user = state.username;
  const role = state.role;

  // 1. Guest Events
  const guestBtn = document.getElementById('guest-apply-btn');
  if (guestBtn) {
    guestBtn.addEventListener('click', () => {
      // Open register tab in profile modal
      const userBadge = document.getElementById('user-badge');
      if (userBadge) {
        userBadge.click();
        // Shift auth modal to signup tab
        const tabSignup = document.getElementById('tab-signup');
        if (tabSignup) tabSignup.click();
      }
    });
  }

  // 2. Candidate Events
  const fillAppBtn = document.getElementById('candidate-fill-app-btn');
  if (fillAppBtn) {
    fillAppBtn.addEventListener('click', () => {
      import('./application.js').then(m => {
        const mount = document.getElementById('view-mount-point');
        if (mount) {
          m.render(mount);
        }
      });
    });
  }
  
  const reloginBtn = document.getElementById('candidate-relogin-btn');
  if (reloginBtn) {
    reloginBtn.addEventListener('click', () => {
      // Force reload auth me to sync updated role from DB
      AuthService.validateSession().then(() => {
        state.syncUser();
        navigateTo('dashboard');
      });
    });
  }

  // 3. Staff/General Events
  const exploreBtn = document.getElementById('dashboard-explore-btn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      navigateTo('training');
    });
  }

  // Highlight Box Event
  const highlightBox = document.getElementById('dashboard-highlight-box');
  if (highlightBox && currentHighlight) {
    highlightBox.addEventListener('click', () => {
      if (currentHighlight.linkView === 'policies') {
        import('./policies.js').then(m => m.setPoliciesTab(currentHighlight.linkTab));
      } else if (currentHighlight.linkView === 'songbook') {
        import('./songbook.js').then(m => m.activeSongbookTab = currentHighlight.linkTab);
      } else if (currentHighlight.linkView === 'onboarding') {
        import('./onboarding.js').then(m => m.setOnboardingTab(currentHighlight.linkTab));
      }
      navigateTo(currentHighlight.linkView);
    });
  }

  // WAM Widget
  const wamBtn = document.getElementById('wam-btn');
  const wamCard = document.getElementById('wam-card');
  const wamCounterDisplay = document.getElementById('wam-counter-display');
  if (wamBtn && wamCard) {
    wamBtn.addEventListener('click', (e) => {
      state.incrementWam();
      const ripple = document.createElement('div');
      ripple.classList.add('wam-ripple-effect');
      const rect = wamCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      wamCard.appendChild(ripple);
      setTimeout(() => ripple.remove(), 1200);
    });
  }

  const handleWamUpdate = () => {
    if (wamCounterDisplay) {
      wamCounterDisplay.textContent = `Logged: ${state.wamCount} WAMs`;
    }
  };
  window.addEventListener('state-wam-updated', handleWamUpdate);

  // Tag Out Widget
  const tagOutBtn = document.getElementById('tag-out-btn');
  if (tagOutBtn) {
    tagOutBtn.addEventListener('click', () => {
      tagOutBtn.innerHTML = '✅ Strategic Retreat Acknowledged';
      tagOutBtn.style.background = 'rgba(139, 92, 246, 0.2)';
      tagOutBtn.style.color = '#8b5cf6';
      tagOutBtn.style.pointerEvents = 'none';
      alert('Strategic Retreat notification simulated. Go drink water and take 5.');
    });
  }

  // ── 4. BLOG LOADER & UPDATES BOX ──────────────────────────────────────────
  loadBlogFeed();

  // Admin Write Blog Button
  const writeBlogBtn = document.getElementById('admin-create-blog-btn');
  if (writeBlogBtn) {
    writeBlogBtn.addEventListener('click', () => {
      isEditingBlog = !isEditingBlog;
      writeBlogBtn.innerHTML = isEditingBlog ? '✕ Cancel' : '➕ Write Announcement';
      renderBlogEditor();
    });
  }

  // Cleanup events on view exit
  const cleanup = () => {
    window.removeEventListener('state-wam-updated', handleWamUpdate);
    window.removeEventListener('before-view-change', cleanup);
  };
  window.addEventListener('before-view-change', cleanup);
}

// ── 5. WYSIWYG BLOG EDITOR FUNCTIONS ──────────────────────────────────────
function renderBlogEditor() {
  const mount = document.getElementById('blog-editor-mount');
  if (!mount) return;

  if (!isEditingBlog) {
    mount.innerHTML = '';
    return;
  }

  mount.innerHTML = `
    <div class="wysiwyg-editor-wrapper">
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <label for="blog-title-input" style="font-size: 13.5px; font-weight: 600;">Announcement Title</label>
        <input type="text" id="blog-title-input" placeholder="e.g. Mandatory Youth Protection Training Sunday" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: inherit;" />
      </div>

      <div style="display: flex; flex-direction: column; gap: 6px;">
        <label style="font-size: 13.5px; font-weight: 600;">Editor toolbar</label>
        <div class="wysiwyg-toolbar" id="wysiwyg-toolbar">
          <button type="button" data-tag="strong" title="Bold">B</button>
          <button type="button" data-tag="em" title="Italic">I</button>
          <button type="button" data-tag="h3" title="Header">H3</button>
          <button type="button" data-tag="li" title="List Item">List Item</button>
          <button type="button" data-tag="u" title="Underline">U</button>
        </div>
        <textarea id="blog-content-input" placeholder="Write update details here... Use editor toolbar formatting." style="min-height: 180px; padding: 12px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: inherit; line-height: 1.5; outline: none;"></textarea>
      </div>

      <!-- Visibility Selection -->
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <label style="font-size: 13.5px; font-weight: 600;">Audience Visibility (Check who can see this)</label>
        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
          <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
            <input type="checkbox" class="blog-vis-chk" value="everyone" checked /> Everyone (Guests & Users)
          </label>
          <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
            <input type="checkbox" class="blog-vis-chk" value="candidate" /> Candidate (Applicants)
          </label>
          <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
            <input type="checkbox" class="blog-vis-chk" value="staff" /> Staff (Camp Staff)
          </label>
          <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
            <input type="checkbox" class="blog-vis-chk" value="admin" /> Admin (Camp Directors)
          </label>
        </div>
      </div>

      <button class="welcome-banner-btn" id="blog-submit-btn" style="align-self: flex-start; margin-top: 10px;">Post Announcement 🚀</button>
    </div>
  `;

  // Bind WYSIWYG toolbar clicks
  const toolbar = document.getElementById('wysiwyg-toolbar');
  const textarea = document.getElementById('blog-content-input');
  
  if (toolbar && textarea) {
    toolbar.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tag = btn.getAttribute('data-tag');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selected = text.substring(start, end);
        
        let replacement = '';
        if (tag === 'li') {
          replacement = `\n<li>${selected}</li>\n`;
        } else {
          replacement = `<${tag}>${selected}</${tag}>`;
        }

        textarea.value = text.substring(0, start) + replacement + text.substring(end);
        textarea.focus();
        // Restore cursor selection
        textarea.setSelectionRange(start + tag.length + 2, start + tag.length + 2 + selected.length);
      });
    });
  }

  // Bind Submit Button
  const submitBtn = document.getElementById('blog-submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      const titleInput = document.getElementById('blog-title-input');
      const title = titleInput.value.trim();
      const content = textarea.value.trim();

      if (!title || !content) {
        alert('Please fill out both Title and Content.');
        return;
      }

      // Read selected visibilities
      const visChks = document.querySelectorAll('.blog-vis-chk:checked');
      const visibility = Array.from(visChks).map(chk => chk.value);

      if (visibility.length === 0) {
        alert('Please select at least one audience visibility group.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Posting... ⏳';

      try {
        await api.blog.create({ title, content, visibility });
        
        // Reset editor
        isEditingBlog = false;
        const writeBlogBtn = document.getElementById('admin-create-blog-btn');
        if (writeBlogBtn) writeBlogBtn.innerHTML = '➕ Write Announcement';
        renderBlogEditor();

        // Refresh feed
        loadBlogFeed();
      } catch (err) {
        alert(`Error: ${err.message}`);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Post Announcement 🚀';
      }
    });
  }
}

async function loadBlogFeed() {
  const mount = document.getElementById('dashboard-blog-mount');
  if (!mount) return;

  try {
    const data = await api.blog.list();
    blogPosts = data.posts || [];

    if (blogPosts.length === 0) {
      mount.innerHTML = `
        <div style="font-size: 14.5px; color: hsl(var(--muted-foreground)); font-style: italic; text-align: center; padding: 24px;">
          No active news posts or announcements. Enjoy the mountain air! 🌲
        </div>
      `;
      return;
    }

    mount.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${blogPosts.map(post => {
          const dateStr = new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
          const visBadges = (post.visibility || []).map(v => 
            `<span style="font-size: 10px; background: hsl(var(--secondary)); padding: 2px 6px; border-radius: 4px; font-weight: 700; text-transform: uppercase;">${v}</span>`
          ).join(' ');

          return `
            <div class="glass-panel" style="background: hsl(var(--secondary) / 0.1); border: 1px solid hsl(var(--border) / 0.4); padding: 18px; display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px;">
                <h4 style="margin: 0; font-size: 17px; color: hsl(var(--primary));">${escapeHtml(post.title)}</h4>
                <div style="display: flex; gap: 8px; align-items: center;">
                  ${visBadges}
                  <span style="font-size: 12px; color: hsl(var(--muted-foreground));">${dateStr}</span>
                </div>
              </div>
              <div class="blog-post-rendered-content" style="font-size: 14.5px; line-height: 1.5; color: hsl(var(--foreground));">
                ${post.content}
              </div>
              <div style="font-size: 11.5px; color: hsl(var(--muted-foreground)); font-weight: 600;">Posted by: @${post.created_by || 'admin'}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  } catch (err) {
    console.error('Failed to load blog feed:', err);
    mount.innerHTML = `
      <div style="color: hsl(var(--danger)); font-weight: 600; font-size: 14px; text-align: center; padding: 24px; border: 1px dashed hsl(var(--danger)); border-radius: var(--radius-sm);">
        ⚠️ Failed to load news feed. Database connection offline.
      </div>
    `;
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
