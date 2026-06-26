/**
 * Camp Lawton Staff Directory & Profile Editor
 * Shows active staff details with safeguarding privacy filters.
 * Allows staff members to customize their profiles.
 */
import { state, navigateTo } from '../main.js';
import { api } from '../services/apiClient.js';
import { AuthService } from '../services/auth.js';

export let activeDirectoryTab = 'directory'; // 'directory' or 'edit-profile'

export function setDirectoryTab(tab) {
  activeDirectoryTab = tab;
}

export function renderDirectory() {
  const tabsHtml = `
    <div class="schedule-tabs-container">
      <button class="schedule-tab-btn ${activeDirectoryTab === 'directory' ? 'active' : ''}" data-dir-tab="directory">
        👥 Staff Directory
      </button>
      <button class="schedule-tab-btn ${activeDirectoryTab === 'edit-profile' ? 'active' : ''}" data-dir-tab="edit-profile">
        ⚙️ My Profile
      </button>
    </div>
  `;

  if (activeDirectoryTab === 'edit-profile') {
    return `
      <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
        ${tabsHtml}
        <div id="directory-edit-mount">Loading profile...</div>
      </div>
    `;
  }

  return `
    <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
      ${tabsHtml}
      <div class="glass-panel" style="padding: 20px; display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <h3 style="color: hsl(var(--primary)); font-size: 20px; margin: 0;">Camp Lawton Brotherhood</h3>
          <p style="font-size: 14px; color: hsl(var(--muted-foreground)); margin: 0;">
            Meet the team making the magic happen. To safeguard our youth, minors' contact/personal details are restricted.
          </p>
        </div>
      </div>
      <div id="directory-grid-mount" class="directory-grid">
        Loading directory...
      </div>
    </div>
  `;
}

export function initDirectory() {
  const tabs = document.querySelectorAll('[data-dir-tab]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-dir-tab');
      if (tabName) {
        activeDirectoryTab = tabName;
        const mount = document.getElementById('view-mount-point');
        if (mount) {
          mount.innerHTML = renderDirectory();
          initDirectory();
        }
      }
    });
  });

  if (activeDirectoryTab === 'edit-profile') {
    initProfileEdit();
  } else {
    initDirectoryList();
  }
}

function renderProfileForm(profile) {
  const bio = profile.bio || '';
  const favSong = profile.fav_song || '';
  const hometown = profile.hometown || '';
  const avatarColor = profile.avatar_color || '#1F4D3A';
  const shareDetails = profile.share_details !== false;
  
  // Camp-themed colors
  const colors = [
    { name: 'Forest Green', value: '#1F4D3A' },
    { name: 'Scouting Gold', value: '#D9A521' },
    { name: 'Campfire Orange', value: '#E65F2B' },
    { name: 'Mountain Blue', value: '#2B5E8C' },
    { name: 'Wood Brown', value: '#8C5A3C' },
    { name: 'Granite Gray', value: '#5A6266' },
    { name: 'Sunset Crimson', value: '#B33939' },
    { name: 'Siesta Violet', value: '#8b5cf6' }
  ];

  const colorSelectorHtml = colors.map(c => `
    <button class="profile-color-dot ${avatarColor === c.value ? 'active' : ''}" 
            data-color="${c.value}" 
            style="background-color: ${c.value};" 
            title="${c.name}"></button>
  `).join('');

  return `
    <div class="glass-panel profile-edit-grid" style="animation: tabFadeIn 0.3s; padding: 24px;">
      <!-- Left side: Avatar Preview & Color -->
      <div style="display: flex; flex-direction: column; align-items: center; gap: 20px; border-right: 1px solid hsl(var(--border) / 0.4); padding-right: 24px;">
        <h4 style="margin: 0; font-size: 16px; color: hsl(var(--primary)); align-self: flex-start;">Profile Badge</h4>
        
        <div id="profile-avatar-preview" class="directory-avatar" style="width: 100px; height: 100px; font-size: 48px; background-color: ${avatarColor}; box-shadow: var(--shadow-md);">
          ${(profile.username || '').charAt(0).toUpperCase()}
        </div>
        
        <div style="text-align: center;">
          <strong style="font-size: 18px; color: hsl(var(--foreground));">@${profile.username}</strong>
          <div style="font-size: 13.5px; color: hsl(var(--accent)); font-weight: 700; margin-top: 4px;">${profile.role}</div>
        </div>

        <div style="width: 100%;">
          <label style="font-size: 13.5px; font-weight: 600;">Avatar Theme Color</label>
          <div class="profile-color-picker-row">
            ${colorSelectorHtml}
          </div>
        </div>
      </div>

      <!-- Right side: Form Fields -->
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <h4 style="margin: 0; font-size: 16px; color: hsl(var(--primary));">About Me</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label for="profile-hometown" style="font-size: 13px; font-weight: 600;">Hometown</label>
            <input type="text" id="profile-hometown" value="${escapeHtml(hometown)}" placeholder="e.g. Tucson, AZ" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: inherit;" />
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label for="profile-fav-song" style="font-size: 13px; font-weight: 600;">Favorite Camp Song</label>
            <input type="text" id="profile-fav-song" value="${escapeHtml(favSong)}" placeholder="e.g. The Alfalfa Song" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: inherit;" />
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 6px;">
          <label for="profile-bio" style="font-size: 13px; font-weight: 600;">Staff Bio</label>
          <textarea id="profile-bio" placeholder="Tell the team about yourself, your years at camp, or your hobbies..." style="min-height: 120px; padding: 12px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: inherit; line-height: 1.5; outline: none;">${escapeHtml(bio)}</textarea>
        </div>

        <div class="glass-panel" style="background: hsl(var(--secondary) / 0.15); display: flex; align-items: flex-start; gap: 12px; padding: 16px; border: 1px dashed hsl(var(--border));">
          <input type="checkbox" id="profile-share-details" ${shareDetails ? 'checked' : ''} style="margin-top: 4px; cursor: pointer; width: 16px; height: 16px;" />
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <label for="profile-share-details" style="font-size: 14px; font-weight: 600; cursor: pointer;">Share Profile Details with Staff</label>
            <span style="font-size: 12px; color: hsl(var(--muted-foreground));">
              If unchecked, other staff members will only see your first name/nickname and role in the directory. Admins will always see your full details.
            </span>
          </div>
        </div>

        <div id="profile-save-message" style="display: none;"></div>

        <button class="welcome-banner-btn" id="profile-save-submit" style="align-self: flex-start; padding: 12px 24px; font-weight: 700;">
          Save Profile Changes 💾
        </button>
      </div>
    </div>
  `;
}

async function initProfileEdit() {
  const mount = document.getElementById('directory-edit-mount');
  if (!mount) return;

  try {
    const user = await AuthService.validateSession();
    if (!user) {
      mount.innerHTML = `
        <div style="color: hsl(var(--danger)); border: 1px dashed hsl(var(--danger)); padding: 20px; border-radius: var(--radius-sm); text-align: center; font-weight: 600;">
          ⚠️ Please log in to view or edit your profile.
        </div>
      `;
      return;
    }

    mount.innerHTML = renderProfileForm(user);

    // Color dots selector
    let selectedColor = user.avatar_color || '#1F4D3A';
    const dots = mount.querySelectorAll('.profile-color-dot');
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        selectedColor = dot.getAttribute('data-color');
        const preview = document.getElementById('profile-avatar-preview');
        if (preview) {
          preview.style.backgroundColor = selectedColor;
        }
      });
    });

    // Save button
    const saveBtn = document.getElementById('profile-save-submit');
    const msgEl = document.getElementById('profile-save-message');

    saveBtn.addEventListener('click', async () => {
      const bio = document.getElementById('profile-bio').value.trim();
      const fav_song = document.getElementById('profile-fav-song').value.trim();
      const hometown = document.getElementById('profile-hometown').value.trim();
      const share_details = document.getElementById('profile-share-details').checked;

      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving... ⏳';

      try {
        await api.profiles.updateSelf({
          bio,
          fav_song,
          hometown,
          avatar_color: selectedColor,
          share_details
        });

        // Validate session to update cached profile
        await AuthService.validateSession();
        // Sync user in main state (will refresh UI badges/avatar colors)
        state.syncUser();

        msgEl.style.display = 'block';
        msgEl.className = '';
        msgEl.style.cssText = 'color: hsl(var(--success)); background: hsl(var(--success) / 0.1); padding: 10px; border-radius: var(--radius-sm); font-size: 13.5px; font-weight: 600; border: 1px dashed hsl(var(--success));';
        msgEl.textContent = '✅ Profile updated successfully!';
        
        setTimeout(() => {
          msgEl.style.display = 'none';
        }, 5000);
      } catch (err) {
        msgEl.style.display = 'block';
        msgEl.className = '';
        msgEl.style.cssText = 'color: hsl(var(--danger)); background: hsl(var(--danger) / 0.1); padding: 10px; border-radius: var(--radius-sm); font-size: 13.5px; font-weight: 600; border: 1px dashed hsl(var(--danger));';
        msgEl.textContent = `❌ Error: ${err.message}`;
      } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Profile Changes 💾';
      }
    });

  } catch (err) {
    console.error(err);
    mount.innerHTML = `
      <div style="color: hsl(var(--danger)); border: 1px dashed hsl(var(--danger)); padding: 20px; border-radius: var(--radius-sm); text-align: center; font-weight: 600;">
        ⚠️ Failed to load profile details. Connection offline.
      </div>
    `;
  }
}

async function initDirectoryList() {
  const mount = document.getElementById('directory-grid-mount');
  if (!mount) return;

  try {
    const data = await api.profiles.list();
    const profiles = data.profiles || [];

    if (profiles.length === 0) {
      mount.innerHTML = `
        <div class="glass-panel" style="grid-column: 1 / -1; padding: 40px; text-align: center; color: hsl(var(--muted-foreground)); font-style: italic;">
          No staff members listed yet.
        </div>
      `;
      return;
    }

    mount.innerHTML = profiles.map(p => {
      const isLimited = p.is_limited;
      const avatarColor = p.avatar_color || '#1F4D3A';
      const name = isLimited ? p.username : (p.display_name || p.username);
      const role = p.role || 'Staff';
      const initials = name.charAt(0).toUpperCase();

      if (isLimited) {
        // Redacted detail card
        const reason = p.is_minor ? '🛡️ Protected (Under 18)' : '🔒 Private Profile';
        return `
          <div class="glass-panel directory-card limited">
            <div style="display: flex; align-items: center; gap: 16px;">
              <div class="directory-avatar" style="background-color: ${avatarColor};">
                ${initials}
              </div>
              <div>
                <h4 style="margin: 0; font-size: 16px; color: hsl(var(--foreground));">${escapeHtml(name)}</h4>
                <div style="font-size: 13px; color: hsl(var(--accent)); font-weight: 700; margin-top: 2px;">${role}</div>
              </div>
            </div>
            <div style="margin-top: auto; font-size: 12px; color: hsl(var(--muted-foreground)); font-style: italic; border-top: 1px dashed hsl(var(--border) / 0.4); padding-top: 10px; display: flex; align-items: center; gap: 6px;">
              <span>${reason}</span>
            </div>
          </div>
        `;
      }

      // Full details card
      const hometown = p.hometown ? `📍 ${escapeHtml(p.hometown)}` : '📍 Unknown Wilderness';
      const favSong = p.fav_song ? `🎶 ${escapeHtml(p.fav_song)}` : '';
      const bio = p.bio ? escapeHtml(p.bio) : 'No bio written yet. Busy teaching scouting skills!';
      
      const onboardingBadge = p.onboarding_confirmed
        ? `<span class="directory-onboarding-badge">✅ Onboarded</span>`
        : '';

      return `
        <div class="glass-panel directory-card">
          ${onboardingBadge}
          <div style="display: flex; align-items: center; gap: 16px;">
            <div class="directory-avatar" style="background-color: ${avatarColor};">
              ${initials}
            </div>
            <div>
              <h4 style="margin: 0; font-size: 16px; color: hsl(var(--foreground));">${escapeHtml(name)}</h4>
              <div style="font-size: 13px; color: hsl(var(--accent)); font-weight: 700; margin-top: 2px;">${role}</div>
            </div>
          </div>
          
          <div class="directory-hometown">${hometown}</div>
          
          <div class="directory-bio">${bio}</div>
          
          ${favSong ? `<div class="directory-fav-song" title="Favorite camp song">${favSong}</div>` : ''}
        </div>
      `;
    }).join('');

  } catch (err) {
    console.error(err);
    mount.innerHTML = `
      <div class="glass-panel" style="grid-column: 1 / -1; color: hsl(var(--danger)); border: 1px dashed hsl(var(--danger)); padding: 20px; border-radius: var(--radius-sm); text-align: center; font-weight: 600;">
        ⚠️ Failed to load staff directory. Connection offline.
      </div>
    `;
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
