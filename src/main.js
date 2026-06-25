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
  username: localStorage.getItem('lawton_username') || 'Alex',
  completedTasks: JSON.parse(localStorage.getItem('lawton_tasks')) || [],
  wamCount: parseInt(localStorage.getItem('lawton_wam_count') || '0'),
  signedConduct: localStorage.getItem('lawton_signed_conduct') === 'true',
  activeView: 'dashboard',
  
  // Setters
  setUsername(name) {
    this.username = name;
    localStorage.setItem('lawton_username', name);
    updateUserUI();
  },
  
  toggleTask(taskId) {
    const index = this.completedTasks.indexOf(taskId);
    if (index > -1) {
      this.completedTasks.splice(index, 1);
    } else {
      this.completedTasks.push(taskId);
    }
    localStorage.setItem('lawton_tasks', JSON.stringify(this.completedTasks));
    window.dispatchEvent(new CustomEvent('state-tasks-updated'));
  },

  incrementWam() {
    this.wamCount++;
    localStorage.setItem('lawton_wam_count', this.wamCount.toString());
    window.dispatchEvent(new CustomEvent('state-wam-updated'));
  },

  setSignedConduct(val) {
    this.signedConduct = val;
    localStorage.setItem('lawton_signed_conduct', val ? 'true' : 'false');
    window.dispatchEvent(new CustomEvent('state-conduct-updated'));
    // Auto-update dashboard checklist if signed
    const checklistTaskId = 'checklist-4'; // Code of conduct ID
    const isCompleted = this.completedTasks.includes(checklistTaskId);
    if (val && !isCompleted) {
      this.toggleTask(checklistTaskId);
    } else if (!val && isCompleted) {
      this.toggleTask(checklistTaskId);
    }
  }
};

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
const viewTitle = document.getElementById('view-title');
const viewSubtitle = document.getElementById('view-subtitle');
const viewMountPoint = document.getElementById('view-mount-point');
const navItems = document.querySelectorAll('.nav-item');
const themeToggle = document.getElementById('theme-toggle');
const userAvatar = document.getElementById('user-avatar');
const userNameDisplay = document.getElementById('user-name-display');
const userBadge = document.getElementById('user-badge');

const profileDialog = document.getElementById('profile-dialog');
const profileDialogClose = document.getElementById('profile-dialog-close');
const profileNameInput = document.getElementById('profile-name-input');
const profileSaveBtn = document.getElementById('profile-save-btn');

const appDialog = document.getElementById('app-dialog');
const appDialogClose = document.getElementById('dialog-close');

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
  userNameDisplay.textContent = state.username;
  userAvatar.textContent = state.username ? state.username.charAt(0).toUpperCase() : '?';
  
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

// On DOM load init
document.addEventListener('DOMContentLoaded', () => {
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
    if (profileDialog && profileNameInput) {
      profileNameInput.value = state.username;
      profileDialog.showModal();
    }
  });
  
  profileDialogClose.addEventListener('click', () => profileDialog.close());
  appDialogClose.addEventListener('click', closeAppDialog);
  
  profileSaveBtn.addEventListener('click', () => {
    const newName = profileNameInput.value.trim();
    if (newName) {
      state.setUsername(newName);
    }
    profileDialog.close();
  });
  
  setupDialogDismissFallbacks(appDialog);
  setupDialogDismissFallbacks(profileDialog);
});
