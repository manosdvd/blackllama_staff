import { renderHandbookCourse, initHandbookCourse } from './components/handbookCourse.js';
import './style.css';

// Import View Components
import { renderDashboard, initDashboard } from './components/dashboard.js';
import { renderCampLawton, initCampLawton, setCampLawtonTab } from './components/camplawton.js';
import { renderTraining, initTraining } from './components/training.js';
import { renderPolicies, initPolicies, setPoliciesTab } from './components/policies.js';
import { renderSongbook, initSongbook } from './components/songbook.js';
import { renderOnboarding, initOnboarding, setOnboardingTab } from './components/onboarding.js';
import { renderAdmin, initAdmin } from './components/admin.js';
import { initAmbiance } from './components/ambiance.js';
import { AuthService } from './services/auth.js';
import { api } from './services/apiClient.js';
import { renderWeatherBanner, initWeatherBanner } from './components/weatherFeed.js';
import { renderForum, initForum } from './components/forum.js';
import { renderDirectory, initDirectory } from './components/directory.js';

// Global State Manager
export const state = {
  username: AuthService.getCurrentUser()?.username || '',
  role: AuthService.getCurrentUser()?.role || '',
  completedTasks: [],
  wamCount: parseInt(localStorage.getItem('lawton_wam_count') || '0'),
  signedConduct: false,
  activeView: 'dashboard',
  
  syncUser() {
    const user = AuthService.getCurrentUser();
    this.username = user?.username || '';
    this.role = user?.role || '';
    this.loadUserData(this.username);
    updateUserUI();
    window.dispatchEvent(new CustomEvent('state-tasks-updated'));
    window.dispatchEvent(new CustomEvent('state-conduct-updated'));
  },
  
  toggleTask(taskId) {
    const index = this.completedTasks.indexOf(taskId);
    if (index > -1) {
      this.completedTasks.splice(index, 1);
    } else {
      this.completedTasks.push(taskId);
    }
    if (this.username) {
      localStorage.setItem(`lawton_tasks_${this.username}`, JSON.stringify(this.completedTasks));
    }
    window.dispatchEvent(new CustomEvent('state-tasks-updated'));
  },

  incrementWam() {
    this.wamCount++;
    localStorage.setItem('lawton_wam_count', this.wamCount.toString());
    window.dispatchEvent(new CustomEvent('state-wam-updated'));
  },

  setSignedConduct(val) {
    this.signedConduct = val;
    if (this.username) {
      localStorage.setItem(`lawton_conduct_${this.username}`, val ? 'true' : 'false');
    }
    window.dispatchEvent(new CustomEvent('state-conduct-updated'));
    // Auto-update dashboard checklist if signed
    const checklistTaskId = 'checklist-4'; // Code of conduct ID
    const isCompleted = this.completedTasks.includes(checklistTaskId);
    if (val && !isCompleted) {
      this.toggleTask(checklistTaskId);
    } else if (!val && isCompleted) {
      this.toggleTask(checklistTaskId);
    }
  },

  loadUserData(username) {
    if (!username) {
      this.completedTasks = [];
      this.signedConduct = false;
      this.role = '';
      return;
    }
    this.completedTasks = JSON.parse(localStorage.getItem(`lawton_tasks_${username}`)) || [];
    this.signedConduct = localStorage.getItem(`lawton_conduct_${username}`) === 'true';
    // Role now comes from AuthService cache, not a separate localStorage key
    const currentUser = AuthService.getCurrentUser();
    this.role = currentUser?.role || 'Staff';
  },

  logout() {
    AuthService.logout();
    this.syncUser();
    this.completedTasks = [];
    this.signedConduct = false;
    // Dispatch events to refresh views
    window.dispatchEvent(new CustomEvent('state-tasks-updated'));
    window.dispatchEvent(new CustomEvent('state-wam-updated'));
    window.dispatchEvent(new CustomEvent('state-conduct-updated'));
  }
};

// Eagerly load user data from current session on import
state.loadUserData(state.username);

// Route View Map
const views = {
  course: {
    title: 'Staff Handbook Course',
    subtitle: 'Read the full staff handbook with full context.',
    render: renderHandbookCourse,
    init: initHandbookCourse
  },

  dashboard: {
    title: 'Dashboard',
    subtitle: 'Welcome to the Camp Lawton digital staff portal.',
    render: renderDashboard,
    init: initDashboard
  },
  camplawton: {
    title: 'About Camp Lawton',
    subtitle: 'History, pillars, schedule, and values.',
    render: renderCampLawton,
    init: initCampLawton
  },
  training: {
    title: 'Training',
    subtitle: 'Training modules and EDGE method.',
    render: renderTraining,
    init: initTraining
  },
  policies: {
    title: 'Policies & Safety',
    subtitle: 'Emergency flowcharts, radio simulator, EAP drills, and legal guidelines.',
    render: renderPolicies,
    init: initPolicies
  },
  songbook: {
    title: 'Songbook & Comedy',
    subtitle: 'Rousing logs songs, action cued metronome lyrics, and comedy writing guides.',
    render: renderSongbook,
    init: initSongbook
  },
  onboarding: {
    title: 'Onboarding',
    subtitle: 'Paperwork checklist, gear lists, and digital Code of Conduct signer.',
    render: renderOnboarding,
    init: initOnboarding
  },
  admin: {
    title: 'Admin Portal',
    subtitle: 'Review candidate applications and manage staff onboarding credentials.',
    render: renderAdmin,
    init: initAdmin
  },
  forum: {
    title: 'Staff Discussion Board',
    subtitle: 'Reddit-style chat & community forum for staff.',
    render: renderForum,
    init: initForum
  },
  directory: {
    title: 'Staff Directory',
    subtitle: 'Get to know your fellow camp staff members and update your profile.',
    render: renderDirectory,
    init: initDirectory
  }
};

// Elements
let viewTitle, viewSubtitle, viewMountPoint, navItems, themeToggle, userAvatar, userNameDisplay, userBadge;
let profileDialog, profileDialogClose, profileNameInput, profileSaveBtn;
let appDialog, appDialogClose;

// Theme Toggle Engine
function initTheme() {
  const savedTheme = localStorage.getItem('lawton_theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('lawton_theme', newTheme);
}

// User UI Syncer
function updateUserUI() {
  if (userNameDisplay) {
    userNameDisplay.textContent = state.username || 'Guest';
  }
  if (userAvatar) {
    userAvatar.textContent = state.username ? state.username.charAt(0).toUpperCase() : '?';
  }

  // Update admin tab visibility
  const adminNav = document.getElementById('nav-item-admin');
  if (adminNav) {
    const isAdmin = AuthService.isAdmin();
    adminNav.style.display = isAdmin ? 'block' : 'none';
    
    // Redirect if they lose admin status while viewing the admin panel
    if (state.activeView === 'admin' && !isAdmin) {
      navigateTo('dashboard');
      return;
    }
  }

  // Update onboarding tab visibility
  const onboardingNav = document.getElementById('nav-item-onboarding');
  if (onboardingNav) {
    const isStaff = state.username && state.role !== 'Candidate';
    onboardingNav.style.display = isStaff ? 'block' : 'none';
    
    // Redirect if they log out or lose staff status while viewing the onboarding panel
    if (state.activeView === 'onboarding' && !isStaff) {
      navigateTo('dashboard');
      return;
    }
  }

  // Update forum tab visibility
  const forumNav = document.getElementById('nav-item-forum');
  if (forumNav) {
    const isStaff = state.username && state.role !== 'Candidate';
    forumNav.style.display = isStaff ? 'block' : 'none';
    
    // Redirect if they lose staff status while viewing the forum panel
    if (state.activeView === 'forum' && !isStaff) {
      navigateTo('dashboard');
      return;
    }
  }

  // Update directory tab visibility
  const directoryNav = document.getElementById('nav-item-directory');
  if (directoryNav) {
    const isStaff = state.username && state.role !== 'Candidate';
    directoryNav.style.display = isStaff ? 'block' : 'none';
    
    // Redirect if they lose staff status while viewing the directory panel
    if (state.activeView === 'directory' && !isStaff) {
      navigateTo('dashboard');
      return;
    }
  }
  
  const currentView = views[state.activeView];
  if (currentView && currentView.init) {
    currentView.init();
  }
}

// Dialog Controller
export function openAppDialog(contentHtml) {
  const mountPoint = document.getElementById('dialog-mount-point');
  if (mountPoint && appDialog) {
    mountPoint.innerHTML = contentHtml;
    appDialog.showModal();
  }
}

export function closeAppDialog() {
  if (appDialog) {
    appDialog.close();
  }
}

// Route Navigation Function
export function navigateTo(viewId) {
  const viewInfo = views[viewId];
  if (!viewInfo) return;
  
  state.activeView = viewId;
  
  // Clear theme override by default (Camp Mode)
  document.documentElement.removeAttribute('data-theme-mode');

  navItems.forEach(item => {
    if (item.getAttribute('data-view') === viewId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  const updateDOM = () => {
    window.dispatchEvent(new CustomEvent('before-view-change'));
    viewTitle.textContent = viewInfo.title;
    viewSubtitle.textContent = viewInfo.subtitle;
    viewMountPoint.innerHTML = viewInfo.render();
    if (viewInfo.init) {
      viewInfo.init();
    }
  };
  
  if (!document.startViewTransition) {
    updateDOM();
    viewTitle.focus();
    applyGlossaryTooltips(viewMountPoint);
    applyTabScrollFades(viewMountPoint);
  } else {
    const transition = document.startViewTransition(updateDOM);
    transition.finished.finally(() => {
      viewTitle.focus();
      applyGlossaryTooltips(viewMountPoint);
      applyTabScrollFades(viewMountPoint);
    });
  }
}

// ========================================================
// GLOBAL HANDBOOK SEARCH INDEX
// ========================================================
const searchIndex = [
  // Part 1: Pillars & Culture
  { title: 'Core Pillars of Summer Camp', snippet: '🏃 Physical, 🧠 Mental, 🤝 Social, 🌌 Spiritual development areas.', viewId: 'training', tabId: null, isSafety: false },
  { title: 'The Aims of Scouting', snippet: 'Character Development, Citizenship Training, Personal Fitness, and Leadership.', viewId: 'training', tabId: null, isSafety: false },
  { title: 'The Methods of Scouting', snippet: 'Ideals, Patrol Method, Outdoor Programs, Advancement, Association with Adults...', viewId: 'training', tabId: null, isSafety: false },
  { title: 'What Makes a Staff? (4 Pillars)', snippet: 'Appearance, Attitude, Personality, and Knowledge guidelines.', viewId: 'training', tabId: null, isSafety: false },
  { title: 'Stress Management & Self-Care', snippet: 'Work the problem, Use your Siesta, sensory overload management, Tag Out, and adult support.', viewId: 'training', tabId: null, isSafety: false },
  { title: 'Camp Schedule & Sunday Arrival', snippet: 'Sunday sign-in, Staff meetings, Camper check-in, KP rosters and quiet hours.', viewId: 'camplawton', tabId: 'schedule', isSafety: false },
  { title: 'Chain of Command & Leadership', snippet: 'Camp Leadership directory: Council Executives, Ranger, Program Director, Area Directors.', viewId: 'camplawton', tabId: 'orgchart', isSafety: false },
  
  // Part 2: Policies & Safety (Safety priority!)
  { title: 'Code Blue — Missing Person Protocol', snippet: 'Gather Details (Name, Troop, Clothing, Location) and initiate Radio Alarm immediately.', viewId: 'policies', tabId: 'safety', isSafety: true },
  { title: 'Code Brown — Bear Sighting Protocol', snippet: 'Remain calm, report to Ranger, keep distant visual. If attacked, yell and stand ground.', viewId: 'policies', tabId: 'safety', isSafety: true },
  { title: 'Lightning Safety (30/30 Rule)', snippet: 'Cease outdoor programs immediately when thunder is <30s of flash. Evacuate to Dining Hall.', viewId: 'policies', tabId: 'safety', isSafety: true },
  { title: 'Fire Evacuation & Reporting', snippet: 'Call 911/Radio Camp Office. Evacuate to Parade Grounds. Personal gear is secondary.', viewId: 'policies', tabId: 'safety', isSafety: true },
  { title: 'Bell Alarm (Continuous Bell)', snippet: 'Secure area hazards, escort scouts to Parade Grounds, take headcount by troop.', viewId: 'policies', tabId: 'safety', isSafety: true },
  { title: 'Armed Intruder / Active Shooter', snippet: 'Run (flee to woods), Hide (lock & barricade cabin), Fight (act with physical aggression).', viewId: 'policies', tabId: 'safety', isSafety: true },
  { title: 'Mandatory Abuse Reporting (ARS 13-3620)', snippet: 'Arizona mandated reporting laws require direct report to DCS Hotline (1-888-SOS-CHILD).', viewId: 'policies', tabId: 'safety', isSafety: true },
  { title: 'Heat Stress Diagnostics', snippet: 'Heat Exhaustion vs. Heatstroke symptoms and emergency shade/ice pack treatments.', viewId: 'policies', tabId: 'safety', isSafety: true },
  { title: 'Camp Map & EAP Evacuation Drill', snippet: 'Interactive map and emergency alarm drill simulator.', viewId: 'policies', tabId: 'map', isSafety: true },
  { title: 'Camp Rules (Phones, Fraternization, Media)', snippet: 'Guidelines on mobile phone usage, cabin rules, and age/role labor limits.', viewId: 'policies', tabId: 'safety', isSafety: false },
  
  // Part 3: Songbook & Comedy
  { title: 'Campfire Songbook', snippet: 'Metronome Action Cue trainer. Songs: Funky, Alfalfa, Bananas, Birdie, Crazy, Drunken Camper.', viewId: 'songbook', tabId: null, isSafety: false },
  { title: 'Campfire Comedy Master Class', snippet: 'Skit writing guidelines: Concept, Base reality, One unusual thing, Stake escalation, Button closer.', viewId: 'songbook', tabId: null, isSafety: false },

  // Part 4: Onboarding
  { title: 'Required Onboarding Paperwork', snippet: 'Application, Letter of Agreement, Medical Forms A, B, C, Vehicle Permit, I-9 forms.', viewId: 'onboarding', tabId: 'checklists', isSafety: false },
  { title: 'Camp Packing List Assistant', snippet: 'Clothing, Gear, Optional, Privileged, and Prohibited item categories.', viewId: 'onboarding', tabId: 'checklists', isSafety: false },
  { title: 'Code of Conduct Commitment Signer', snippet: 'Digital agreement form. Zero-tolerance policy on YPT, alcohol, drugs, weapons.', viewId: 'onboarding', tabId: 'conduct', isSafety: true },
  { title: 'Handbook Quiz & Certification', snippet: '10-question training certification quiz on weather, safety, and reporting policies.', viewId: 'onboarding', tabId: 'quiz', isSafety: false },
  { title: 'Staff Application 2026', snippet: 'Apply to join the Camp Lawton staff.', viewId: 'onboarding', tabId: 'apply', isSafety: false }
];

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// ========================================================
// TRANSLATOR TOOLTIPS SYSTEM
// ========================================================
const glossaryTerms = {
  'KYBO': 'Keep Your Bowels Operating. Summer camp slang for the latrines / restrooms. Go ahead, use it in a sentence.',
  'WAM': 'Water Appreciation Moment. Drink water immediately. No, seriously, do it now. 8,000 feet of elevation does not mess around.',
  'The Logs': 'The logs/benches in front of the Dining Hall. The center of all camp music, rowdiness, and announcements.',
  'Staff Hill': 'The housing area where the staff sleep, talk, and try to get a bar of cell signal. Off-limits to scouts.',
  'Smellables': 'Scented items (deodorant, snacks, toothpaste) that attract bears. Keep them out of cabins, lock them in the Smellables Shed.',
  'Code Blue': 'Missing Person / Lost Camper alarm. Immediately stops all normal operations. No jokes, find the kid.',
  'Code Brown': 'Bear sighting. Ranger MaryLou and the Camp Director are on their way. Keep distance, look big.',
  'WFA': 'Wilderness First Aid. The specialized training that teaches you what to do when you are hours away from an ambulance.'
};

let tooltipElement = null;

function initGlossaryTooltipDOM() {
  if (document.getElementById('global-glossary-tooltip')) return;
  tooltipElement = document.createElement('div');
  tooltipElement.id = 'global-glossary-tooltip';
  tooltipElement.className = 'glossary-tooltip-bubble';
  document.body.appendChild(tooltipElement);
}

function showTooltip(text, targetEl) {
  if (!tooltipElement) initGlossaryTooltipDOM();
  tooltipElement.textContent = text;
  tooltipElement.classList.add('visible');

  const rect = targetEl.getBoundingClientRect();
  const tooltipWidth = tooltipElement.offsetWidth || 260;
  const tooltipHeight = tooltipElement.offsetHeight || 80;

  let left = rect.left + rect.width / 2 - tooltipWidth / 2;
  let top = rect.top - tooltipHeight - 12;

  if (left < 10) left = 10;
  if (left + tooltipWidth > window.innerWidth - 10) {
    left = window.innerWidth - tooltipWidth - 10;
  }
  if (top < 10) {
    top = rect.bottom + 12;
  }

  tooltipElement.style.left = `${left}px`;
  tooltipElement.style.top = `${top}px`;
}

function hideTooltip() {
  if (tooltipElement) {
    tooltipElement.classList.remove('visible');
  }
}

function setupTooltipEvents(container) {
  const terms = container.querySelectorAll('.glossary-term');
  terms.forEach(el => {
    const termKey = el.getAttribute('data-term');
    const definition = glossaryTerms[termKey];
    
    if (definition) {
      el.addEventListener('mouseenter', () => showTooltip(definition, el));
      el.addEventListener('mouseleave', hideTooltip);

      el.addEventListener('touchstart', (e) => {
        e.preventDefault();
        showTooltip(definition, el);
      });
      el.addEventListener('touchend', () => {
        setTimeout(hideTooltip, 3000);
      });
    }
  });
}

let tooltipObserver;

function startTooltipObserver() {
  const target = document.getElementById('view-mount-point');
  if (!target) return;

  tooltipObserver = new MutationObserver((mutations) => {
    tooltipObserver.disconnect();
    applyGlossaryTooltips(target);
    applyTabScrollFades(target);
    connectObserver();
  });

  function connectObserver() {
    tooltipObserver.observe(target, { childList: true, subtree: true });
  }

  connectObserver();
}

function applyGlossaryTooltips(container) {
  if (!container) return;
  const terms = Object.keys(glossaryTerms);
  const regex = new RegExp(`\\b(${terms.map(t => escapeRegExp(t)).join('|')})\\b`, 'gi');

  function walk(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const parent = node.parentNode;
      if (!parent) return;
      const tag = parent.tagName.toLowerCase();
      if (['script', 'style', 'button', 'input', 'textarea', 'select', 'option', 'a', 'dialog', 'h1', 'h2', 'h3', 'h4'].includes(tag)) {
        return;
      }
      if (parent.closest('.glossary-term') || parent.closest('#global-search-dropdown') || parent.closest('.theme-toggle-btn') || parent.closest('.quick-helpline-bar')) {
        return;
      }

      const text = node.nodeValue;
      if (regex.test(text)) {
        const span = document.createElement('span');
        regex.lastIndex = 0;
        span.innerHTML = text.replace(regex, (match) => {
          const key = terms.find(t => t.toLowerCase() === match.toLowerCase()) || match;
          return `<span class="glossary-term" data-term="${key}">${match}</span>`;
        });
        parent.replaceChild(span, node);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = node.tagName.toLowerCase();
      if (!['script', 'style', 'button', 'input', 'textarea', 'select', 'a', 'dialog', 'h1', 'h2', 'h3', 'h4'].includes(tag)) {
        const children = Array.from(node.childNodes);
        children.forEach(walk);
      }
    }
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  walk(container);
  setupTooltipEvents(container);
}

// ========================================================
// TAB SCROLL FADE INDICATORS
// Reads each .schedule-tabs-container and sets a CSS class
// that drives the mask-image fade direction.
// ========================================================
function updateTabFade(el) {
  const atStart = el.scrollLeft <= 2;
  const atEnd   = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
  const scrollable = el.scrollWidth > el.clientWidth + 4;

  el.classList.remove('tabs-no-fade', 'tabs-fade-left', 'tabs-fade-both');

  if (!scrollable) {
    el.classList.add('tabs-no-fade');
  } else if (atStart) {
    // default CSS already handles right-fade — no extra class needed
  } else if (atEnd) {
    el.classList.add('tabs-fade-left');
  } else {
    el.classList.add('tabs-fade-both');
  }
}

function applyTabScrollFades(container) {
  if (!container) return;
  const tabRows = container.querySelectorAll('.schedule-tabs-container');
  tabRows.forEach(el => {
    // Initial state
    updateTabFade(el);
    // Live updates as the user scrolls
    el.addEventListener('scroll', () => updateTabFade(el), { passive: true });
  });
}

// Dialog Backdrop light-dismiss helper
function setupDialogDismissFallbacks(dialogElement) {
  if (!dialogElement) return;
  
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    dialogElement.addEventListener('click', (event) => {
      if (event.target !== dialogElement) return;
      
      const rect = dialogElement.getBoundingClientRect();
      const isInside = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      
      if (!isInside) {
        dialogElement.close();
      }
    });
  }
}

let currentAuthTab = 'login'; // 'login' or 'signup'

function renderProfileModalContent(errorMsg = '') {
  const container = document.getElementById('profile-dialog-content');
  if (!container) return;

  if (!state.username) {
    container.innerHTML = `
      <button class="dialog-close-btn" id="profile-dialog-close" aria-label="Close dialog">✕</button>
      <h3 style="margin-bottom: 20px; font-family: var(--font-heading); color: hsl(var(--primary)); text-align: center; font-size: 22px;">Camp Staff Gateway</h3>
      
      <div style="display: flex; border-bottom: 1px solid hsl(var(--border)); margin-bottom: 20px;">
        <button id="tab-login" class="schedule-tab-btn ${currentAuthTab === 'login' ? 'active' : ''}" style="flex: 1; padding: 10px; font-weight: 600; cursor: pointer;">Log In</button>
        <button id="tab-signup" class="schedule-tab-btn ${currentAuthTab === 'signup' ? 'active' : ''}" style="flex: 1; padding: 10px; font-weight: 600; cursor: pointer;">Sign Up</button>
      </div>

      ${errorMsg ? `<div style="color: hsl(var(--danger)); background: hsl(var(--danger) / 0.1); padding: 10px; border-radius: var(--radius-sm); font-size: 13.5px; font-weight: 600; margin-bottom: 16px; border: 1px dashed hsl(var(--danger));">${errorMsg}</div>` : ''}

      ${currentAuthTab === 'login' ? `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label for="login-username" style="font-size: 14px; font-weight: 500;">Username</label>
            <input type="text" id="login-username" placeholder="Enter username" style="padding: 10px 14px; border: 1px solid hsl(var(--border)); border-radius: var(--radius-sm); font-size: 15px; background: var(--glass-bg); color: inherit;" />
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label for="login-password" style="font-size: 14px; font-weight: 500;">Password</label>
            <input type="password" id="login-password" placeholder="Enter password" style="padding: 10px 14px; border: 1px solid hsl(var(--border)); border-radius: var(--radius-sm); font-size: 15px; background: var(--glass-bg); color: inherit;" />
          </div>
          <button id="auth-login-submit" class="welcome-banner-btn" style="width: 100%; padding: 12px; margin-top: 10px; font-weight: 700;">Log In to Portal</button>
        </div>
      ` : `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label for="signup-username" style="font-size: 14px; font-weight: 500;">Username</label>
            <input type="text" id="signup-username" placeholder="Choose username" style="padding: 10px 14px; border: 1px solid hsl(var(--border)); border-radius: var(--radius-sm); font-size: 15px; background: var(--glass-bg); color: inherit;" />
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label for="signup-password" style="font-size: 14px; font-weight: 500;">Password</label>
            <input type="password" id="signup-password" placeholder="Choose password" style="padding: 10px 14px; border: 1px solid hsl(var(--border)); border-radius: var(--radius-sm); font-size: 15px; background: var(--glass-bg); color: inherit;" />
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label for="signup-role" style="font-size: 14px; font-weight: 500;">Camp Program Area / Role</label>
            <select id="signup-role" style="padding: 10px 14px; border: 1px solid hsl(var(--border)); border-radius: var(--radius-sm); font-size: 15px; background: var(--glass-bg); color: hsl(var(--foreground)); width: 100%;">
              <option value="Candidate">Candidate (Applicant)</option>
              <option value="Staff">General Staff</option>
              <option value="Scoutcraft">Scoutcraft Instructor</option>
              <option value="Nature">Nature / Ecology Instructor</option>
              <option value="Shooting Sports">Shooting Sports Director</option>
              <option value="Handicraft">Handicraft Instructor</option>
              <option value="CIT">Counselor in Training (CIT)</option>
              <option value="Ranger">Camp Ranger</option>
              <option value="Medic">Health Officer / Medic</option>
              <option value="Program Director">Program Director</option>
              <option value="Camp Director">Camp Director</option>
            </select>
          </div>
          <button id="auth-signup-submit" class="welcome-banner-btn" style="width: 100%; padding: 12px; margin-top: 10px; font-weight: 700;">Create Staff Account</button>
        </div>
      `}
    `;

    document.getElementById('profile-dialog-close').addEventListener('click', () => profileDialog.close());
    document.getElementById('tab-login').addEventListener('click', () => {
      currentAuthTab = 'login';
      renderProfileModalContent();
    });
    document.getElementById('tab-signup').addEventListener('click', () => {
      currentAuthTab = 'signup';
      renderProfileModalContent();
    });

    if (currentAuthTab === 'login') {
      document.getElementById('auth-login-submit').addEventListener('click', handleLoginSubmit);
    } else {
      document.getElementById('auth-signup-submit').addEventListener('click', handleSignupSubmit);
    }
  } else {
    const total = 5;
    const completed = state.completedTasks.length;
    const pct = Math.round((completed / total) * 100);

    container.innerHTML = `
      <button class="dialog-close-btn" id="profile-dialog-close" aria-label="Close dialog">✕</button>
      <h3 style="margin-bottom: 16px; font-family: var(--font-heading); color: hsl(var(--primary)); font-size: 22px;">Staff Profile</h3>
      
      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px; background: hsl(var(--secondary) / 0.3); padding: 16px; border-radius: var(--radius-md); border: 1px solid hsl(var(--border));">
        <div style="width: 50px; height: 50px; border-radius: 50%; background: hsl(var(--primary)); color: white; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 800; font-family: var(--font-heading);">
          ${state.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h4 style="font-size: 18px; margin: 0; color: hsl(var(--foreground));">${state.username}</h4>
          <span style="font-size: 13.5px; color: hsl(var(--accent)); font-weight: 700;">${state.role}</span>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; font-size: 14.5px;">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid hsl(var(--border) / 0.5); padding-bottom: 8px;">
          <span style="color: hsl(var(--muted-foreground));">Readiness Tasks:</span>
          <span style="font-weight: 700; color: ${pct === 100 ? 'hsl(var(--success))' : 'inherit'};">${completed}/${total} (${pct}%)</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid hsl(var(--border) / 0.5); padding-bottom: 8px;">
          <span style="color: hsl(var(--muted-foreground));">Code of Conduct:</span>
          <span style="font-weight: 700;">${state.signedConduct ? '✅ Signed' : '❌ Unsigned'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid hsl(var(--border) / 0.5); padding-bottom: 8px;">
          <span style="color: hsl(var(--muted-foreground));">Water Logged:</span>
          <span style="font-weight: 700;">🥤 ${state.wamCount} WAMs</span>
        </div>
      </div>

      <button id="auth-logout" class="welcome-banner-btn" style="width: 100%; padding: 12px; background: hsl(var(--danger) / 0.1); border: 1px solid hsl(var(--danger) / 0.3); color: hsl(var(--danger)); font-weight: 700; transition: all 0.2s; cursor: pointer;">
        👋 Log Out
      </button>
    `;

    document.getElementById('profile-dialog-close').addEventListener('click', () => profileDialog.close());
    
    const logoutBtn = document.getElementById('auth-logout');
    logoutBtn.addEventListener('click', () => {
      state.logout();
      renderProfileModalContent();
      profileDialog.close();
    });
  }
}

async function handleLoginSubmit() {
  const usernameInput = document.getElementById('login-username');
  const passwordInput = document.getElementById('login-password');
  if (!usernameInput || !passwordInput) return;

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    renderProfileModalContent("Please fill in all fields.");
    return;
  }

  try {
    await AuthService.login(username, password);
    state.syncUser();
    profileDialog.close();
  } catch (err) {
    renderProfileModalContent(err.message || "Invalid username or password.");
  }
}

async function handleSignupSubmit() {
  const usernameInput = document.getElementById('signup-username');
  const passwordInput = document.getElementById('signup-password');
  const roleSelect = document.getElementById('signup-role');
  if (!usernameInput || !passwordInput || !roleSelect) return;

  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  const role = roleSelect.value;

  if (!username || !password) {
    renderProfileModalContent("Please fill in all fields.");
    return;
  }

  if (username.length < 3) {
    renderProfileModalContent("Username must be at least 3 characters.");
    return;
  }

  try {
    await AuthService.register(username, password, role);
    // register() now also signs in, so just sync state
    state.syncUser();
    profileDialog.close();
  } catch (err) {
    renderProfileModalContent(err.message || "Error creating account.");
  }
}

// On DOM load init
document.addEventListener('DOMContentLoaded', () => {
  viewTitle = document.getElementById('view-title');
  viewSubtitle = document.getElementById('view-subtitle');
  viewMountPoint = document.getElementById('view-mount-point');
  navItems = document.querySelectorAll('.nav-item');
  themeToggle = document.getElementById('theme-toggle');
  userAvatar = document.getElementById('user-avatar');
  userNameDisplay = document.getElementById('user-name-display');
  userBadge = document.getElementById('user-badge');

  profileDialog = document.getElementById('profile-dialog');
  profileDialogClose = document.getElementById('profile-dialog-close');
  profileNameInput = document.getElementById('profile-name-input');
  profileSaveBtn = document.getElementById('profile-save-btn');

  appDialog = document.getElementById('app-dialog');
  appDialogClose = document.getElementById('dialog-close');

  initTheme();
  initAmbiance();

  const weatherMount = document.getElementById('weather-banner-mount');
  if (weatherMount) {
    weatherMount.innerHTML = renderWeatherBanner();
    initWeatherBanner();
  }

  // Pre-load all custom site content edits from Supabase
  state.siteContent = {};
  api.siteContent.get().then(data => {
    if (data && data.contentBlocks) {
      data.contentBlocks.forEach(block => {
        state.siteContent[block.key] = block.content;
      });
    }
    // Refresh display to apply custom content
    navigateTo(state.activeView);
  }).catch(err => {
    console.error('Failed to load custom site content:', err);
  });

  // Validate session server-side on load (async — updates cache silently)
  AuthService.validateSession().then(user => {
    if (user) {
      state.syncUser();
    }
  }).catch(() => {
    // Session invalid — already cleared by validateSession
  });

  updateUserUI();
  
  navigateTo('dashboard');
  
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const viewId = item.getAttribute('data-view');
      navigateTo(viewId);
    });
  });
  
  themeToggle.addEventListener('click', toggleTheme);
  
  userBadge.addEventListener('click', () => {
    if (profileDialog) {
      renderProfileModalContent();
      profileDialog.showModal();
    }
  });
  
  appDialogClose.addEventListener('click', closeAppDialog);
  
  setupDialogDismissFallbacks(appDialog);
  setupDialogDismissFallbacks(profileDialog);

  // 1. Initialize global tooltip DOM
  initGlossaryTooltipDOM();

  // 2. Start glossary terms observer
  startTooltipObserver();

  // 3. Bind Search input
  const searchInput = document.getElementById('global-search-input');
  const searchDropdown = document.getElementById('global-search-dropdown');

  if (searchInput && searchDropdown) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();
      if (!query) {
        searchDropdown.style.display = 'none';
        searchDropdown.innerHTML = '';
        return;
      }

      // Filter and score matches
      const matches = searchIndex.filter(item => {
        return item.title.toLowerCase().includes(query) || item.snippet.toLowerCase().includes(query);
      });

      // Sort by safety priority
      matches.sort((a, b) => {
        if (a.isSafety && !b.isSafety) return -1;
        if (!a.isSafety && b.isSafety) return 1;
        return 0;
      });

      if (matches.length === 0) {
        searchDropdown.innerHTML = `<div style="font-size: 13px; color: hsl(var(--muted-foreground)); padding: 12px; text-align: center; font-weight: 500;">No results found for "${escapeHtml(query)}"</div>`;
        searchDropdown.style.display = 'block';
        return;
      }

      searchDropdown.innerHTML = matches.map(item => `
        <div class="search-result-item" data-view-id="${item.viewId}" data-tab-id="${item.tabId || ''}">
          <span class="search-result-title">${escapeHtml(item.title)}</span>
          <span class="search-result-snippet">${escapeHtml(item.snippet)}</span>
          <span class="search-result-badge ${item.isSafety ? 'safety' : ''}">${item.isSafety ? '🚨 SAFETY' : '📖 GENERAL'}</span>
        </div>
      `).join('');

      searchDropdown.style.display = 'block';

      // Bind click on items
      searchDropdown.querySelectorAll('.search-result-item').forEach(el => {
        el.addEventListener('click', () => {
          const viewId = el.getAttribute('data-view-id');
          const tabId = el.getAttribute('data-tab-id');

          // Reset search
          searchInput.value = '';
          searchDropdown.style.display = 'none';

          // Set active sub-tab if exists
          if (viewId === 'camplawton' && tabId) {
            setCampLawtonTab(tabId);
          } else if (viewId === 'policies' && tabId) {
            setPoliciesTab(tabId);
          } else if (viewId === 'onboarding' && tabId) {
            setOnboardingTab(tabId);
          }

          // Navigate
          navigateTo(viewId);
        });
      });
    });

    // Close search dropdown on click outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
        searchDropdown.style.display = 'none';
      }
    });
  }

  // 4. Bind bottom Quick Access Bar Emergency button
  const quickEmergencyBtn = document.getElementById('quick-emergency-btn');
  if (quickEmergencyBtn) {
    quickEmergencyBtn.addEventListener('click', () => {
      setPoliciesTab('safety');
      navigateTo('policies');
    });
  }

  // 5. Siesta Reboot (12:00 PM - 2:00 PM) Low-stim mode
  function checkSiestaMode() {
    const now = new Date();
    const hours = now.getHours();
    
    // 12 PM (12:00) to 2 PM (13:59)
    if (hours >= 12 && hours < 14) {
      if (!document.documentElement.classList.contains('siesta-mode')) {
        document.documentElement.classList.add('siesta-mode');
        document.documentElement.setAttribute('data-theme', 'dark');
        
        // Show banner if not already present
        if (!document.getElementById('siesta-banner')) {
          const banner = document.createElement('div');
          banner.id = 'siesta-banner';
          banner.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; background: #8b5cf6; color: white; text-align: center; padding: 8px; z-index: 10000; font-family: var(--font-heading); font-weight: 800; font-size: 14px;';
          banner.innerText = '🧘 SIESTA REBOOT ACTIVE: Low-stimulus mode engaged. Please rest quietly in your quarters until 2:00 PM.';
          document.body.prepend(banner);
        }
      }
    } else {
      if (document.documentElement.classList.contains('siesta-mode')) {
        document.documentElement.classList.remove('siesta-mode');
        const theme = localStorage.getItem('lawton_theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        const banner = document.getElementById('siesta-banner');
        if (banner) banner.remove();
      }
    }
  }

  // Check immediately and then every minute
  checkSiestaMode();
  setInterval(checkSiestaMode, 60000);

  // 6. Register Service Worker for PWA
  if ('serviceWorker' in navigator) {
    window.navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered successfully:', reg.scope))
      .catch(err => console.log('Service Worker registration failed:', err));
  }
});
