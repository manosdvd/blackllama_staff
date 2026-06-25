import './style.css';

// Import View Components
import { renderDashboard, initDashboard } from './components/dashboard.js';
import { renderSchedule, initSchedule } from './components/schedule.js';
import { renderOfficeMap, initOfficeMap } from './components/officeMap.js';
import { renderSafetyGuides, initSafetyGuides } from './components/safetyGuides.js';
import { renderPacking, initPacking } from './components/packing.js';
import { renderSongs, initSongs } from './components/songs.js';
import { renderQuiz, initQuiz } from './components/quiz.js';
import { renderTraining, initTraining } from './components/training.js';
import { render as renderApplication } from './components/application.js';

// Global State Manager
export const state = {
  username: localStorage.getItem('lawton_username') || '',
  role: localStorage.getItem('lawton_role') || '',
  completedTasks: [],
  wamCount: parseInt(localStorage.getItem('lawton_wam_count') || '0'),
  signedConduct: false,
  activeView: 'dashboard',
  
  // Setters
  setUsername(name) {
    this.username = name;
    if (name) {
      localStorage.setItem('lawton_username', name);
    } else {
      localStorage.removeItem('lawton_username');
    }
    this.loadUserData(name);
    updateUserUI();
    // Dispatch events to refresh views
    window.dispatchEvent(new CustomEvent('state-tasks-updated'));
    window.dispatchEvent(new CustomEvent('state-conduct-updated'));
  },

  setRole(role) {
    this.role = role;
    if (role) {
      localStorage.setItem('lawton_role', role);
      if (this.username) {
        localStorage.setItem(`lawton_role_${this.username}`, role);
      }
    } else {
      localStorage.removeItem('lawton_role');
    }
    updateUserUI();
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
    this.role = localStorage.getItem(`lawton_role_${username}`) || 'Staff';
  },

  logout() {
    this.username = '';
    this.role = '';
    this.completedTasks = [];
    this.signedConduct = false;
    localStorage.removeItem('lawton_username');
    localStorage.removeItem('lawton_role');
    updateUserUI();
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
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Welcome to the Camp Lawton digital staff portal.',
    render: renderDashboard,
    init: initDashboard
  },
  training: {
    title: 'Training & Culture',
    subtitle: 'Camp Lawton pillars, scouting methods, Disney standards, and program controls.',
    render: renderTraining,
    init: initTraining
  },
  schedule: {
    title: 'Camp Schedule',
    subtitle: 'Sunday check-in protocols and daily life schedule.',
    render: renderSchedule,
    init: initSchedule
  },
  officemap: {
    title: 'Camp Map & EAP',
    subtitle: 'Interactive map and emergency evacuation drill simulator.',
    render: renderOfficeMap,
    init: initOfficeMap
  },
  safetyguides: {
    title: 'Policies & Procedures',
    subtitle: 'Emergency flowcharts, radio simulator, and legal guidelines.',
    render: renderSafetyGuides,
    init: initSafetyGuides
  },
  packing: {
    title: 'Onboarding',
    subtitle: 'Paperwork checklist, gear lists, and Code of Conduct signer.',
    render: renderPacking,
    init: initPacking
  },
  songs: {
    title: 'Songbook & Comedy Class',
    subtitle: 'Rousing logs songs, action cued lyrics, and comedy writing guides.',
    render: renderSongs,
    init: initSongs
  },
  quiz: {
    title: 'Staff Handbook Quiz',
    subtitle: 'Complete the training review to get Camp Lawton certified.',
    render: renderQuiz,
    init: initQuiz
  },
  application: {
    title: 'Staff Application 2026',
    subtitle: 'Apply to join the Catalina Council at Camp Lawton.',
    render: renderApplication,
    init: () => {}
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
  } else {
    const transition = document.startViewTransition(updateDOM);
    transition.finished.finally(() => {
      viewTitle.focus();
    });
  }
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

// User Management Helpers
function getUsers() {
  return JSON.parse(localStorage.getItem('lawton_users') || '[]');
}

function saveUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('lawton_users', JSON.stringify(users));
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

function handleLoginSubmit() {
  const usernameInput = document.getElementById('login-username');
  const passwordInput = document.getElementById('login-password');
  if (!usernameInput || !passwordInput) return;

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    renderProfileModalContent("Please fill in all fields.");
    return;
  }

  const users = getUsers();
  const matchedUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());

  if (!matchedUser) {
    renderProfileModalContent("Username not found. Please sign up!");
    return;
  }

  if (matchedUser.password !== password) {
    renderProfileModalContent("Incorrect password. Try again.");
    return;
  }

  state.setRole(matchedUser.role);
  state.setUsername(matchedUser.username);
  profileDialog.close();
}

function handleSignupSubmit() {
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

  const users = getUsers();
  const exists = users.some(u => u.username.toLowerCase() === username.toLowerCase());

  if (exists) {
    renderProfileModalContent("Username already taken.");
    return;
  }

  const newUser = { username, password, role };
  saveUser(newUser);

  state.setRole(role);
  state.setUsername(username);
  profileDialog.close();
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
});
