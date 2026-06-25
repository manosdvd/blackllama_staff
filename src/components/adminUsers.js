/**
 * Admin User Management Panel
 * Fetches live data from /api/admin-users (Netlify Function → Supabase)
 * Features: live table, role editor, status toggle, search/filter, deactivate
 */
import { api } from '../services/apiClient.js';
import { openAppDialog, closeAppDialog } from '../main.js';

const ROLES = [
  'Candidate', 'Staff', 'Scoutcraft', 'Nature', 'Shooting Sports',
  'Handicraft', 'CIT', 'Ranger', 'Medic', 'Program Director', 'Camp Director', 'Admin'
];

const ROLE_COLORS = {
  Admin:              '#ef4444',
  'Camp Director':    '#f97316',
  'Program Director': '#eab308',
  Staff:              '#22c55e',
  Scoutcraft:         '#3b82f6',
  Nature:             '#10b981',
  'Shooting Sports':  '#a855f7',
  Handicraft:         '#ec4899',
  CIT:                '#06b6d4',
  Ranger:             '#84cc16',
  Medic:              '#f43f5e',
  Candidate:          '#94a3b8'
};

let usersCache = [];
let searchTimeout = null;
let currentFilters = { search: '', role: '', status: '' };

export function renderAdminUsers() {
  return `
    <div class="admin-users-panel">
      <!-- Header Controls -->
      <div class="admin-users-header">
        <div class="admin-users-search-row">
          <div class="admin-search-field">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              type="text"
              id="admin-user-search"
              placeholder="Search by username…"
              autocomplete="off"
            />
          </div>
          <select id="admin-role-filter" class="admin-filter-select">
            <option value="">All Roles</option>
            ${ROLES.map(r => `<option value="${r}">${r}</option>`).join('')}
          </select>
          <select id="admin-status-filter" class="admin-filter-select">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive / Deactivated</option>
          </select>
          <button id="admin-users-refresh" class="admin-refresh-btn" title="Refresh">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
          </button>
        </div>
        <div id="admin-users-count" class="admin-users-count-badge">Loading…</div>
      </div>

      <!-- Table -->
      <div class="admin-users-table-wrapper">
        <table class="admin-users-table" id="admin-users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th class="admin-th-actions">Actions</th>
            </tr>
          </thead>
          <tbody id="admin-users-tbody">
            <tr><td colspan="5" class="admin-loading-row"><span class="admin-spinner"></span> Loading users…</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="admin-users-pagination" id="admin-users-pagination"></div>
    </div>
  `;
}

export async function initAdminUsers() {
  await loadUsers();

  // Search
  const searchInput = document.getElementById('admin-user-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentFilters.search = searchInput.value.trim();
        loadUsers();
      }, 350);
    });
  }

  // Role filter
  const roleFilter = document.getElementById('admin-role-filter');
  if (roleFilter) {
    roleFilter.addEventListener('change', () => {
      currentFilters.role = roleFilter.value;
      loadUsers();
    });
  }

  // Status filter
  const statusFilter = document.getElementById('admin-status-filter');
  if (statusFilter) {
    statusFilter.addEventListener('change', () => {
      currentFilters.status = statusFilter.value;
      loadUsers();
    });
  }

  // Refresh button
  const refreshBtn = document.getElementById('admin-users-refresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => loadUsers(true));
  }
}

async function loadUsers(showSpinner = false) {
  const tbody = document.getElementById('admin-users-tbody');
  const countBadge = document.getElementById('admin-users-count');

  if (showSpinner && tbody) {
    tbody.innerHTML = `<tr><td colspan="5" class="admin-loading-row"><span class="admin-spinner"></span> Loading…</td></tr>`;
  }

  try {
    const data = await api.admin.listUsers(currentFilters);
    usersCache = data.users || [];

    if (countBadge) {
      countBadge.textContent = `${data.total ?? usersCache.length} users`;
    }

    renderUserRows(usersCache);
  } catch (err) {
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="admin-error-row">
            ⚠️ ${err.message || 'Failed to load users. Is Supabase configured?'}
            <br><small>Check that SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY are set in your Netlify environment.</small>
          </td>
        </tr>`;
    }
    if (countBadge) countBadge.textContent = 'Error';
  }
}

function renderUserRows(users) {
  const tbody = document.getElementById('admin-users-tbody');
  if (!tbody) return;

  if (users.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="admin-empty-row">No users found matching current filters.</td></tr>`;
    return;
  }

  tbody.innerHTML = users.map(user => {
    const roleColor = ROLE_COLORS[user.role] || '#94a3b8';
    const isInactive = user.status === 'inactive';
    const joined = new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return `
      <tr class="admin-user-row ${isInactive ? 'admin-user-inactive' : ''}" data-user-id="${user.id}">
        <td class="admin-td-user">
          <div class="admin-user-avatar" style="background: ${roleColor}22; color: ${roleColor};">
            ${user.username.charAt(0).toUpperCase()}
          </div>
          <div class="admin-user-info">
            <span class="admin-username">${escapeHtml(user.username)}</span>
            <span class="admin-user-id-badge">${user.id.slice(0, 8)}…</span>
          </div>
        </td>
        <td class="admin-td-role">
          <select
            class="admin-role-select"
            data-user-id="${user.id}"
            data-original-role="${user.role}"
            style="--role-color: ${roleColor};"
          >
            ${ROLES.map(r => `<option value="${r}" ${r === user.role ? 'selected' : ''}>${r}</option>`).join('')}
          </select>
        </td>
        <td class="admin-td-status">
          <span class="admin-status-pill ${isInactive ? 'inactive' : 'active'}">
            ${isInactive ? '🔴 Inactive' : '🟢 Active'}
          </span>
        </td>
        <td class="admin-td-date">${joined}</td>
        <td class="admin-td-actions">
          <button class="admin-save-role-btn" data-user-id="${user.id}" title="Save role change" style="display: none;">
            💾 Save
          </button>
          <button class="admin-toggle-status-btn ${isInactive ? 'reactivate' : 'deactivate'}" data-user-id="${user.id}" data-current-status="${user.status}" title="${isInactive ? 'Reactivate account' : 'Deactivate account'}">
            ${isInactive ? '✅ Reactivate' : '🚫 Deactivate'}
          </button>
          <button class="admin-view-details-btn" data-user-id="${user.id}" title="View user details">
            👁 Details
          </button>
        </td>
      </tr>
    `;
  }).join('');

  bindRowEvents();
}

function bindRowEvents() {
  // Role select change → show Save button
  document.querySelectorAll('.admin-role-select').forEach(select => {
    select.addEventListener('change', () => {
      const userId = select.getAttribute('data-user-id');
      const saveBtn = document.querySelector(`.admin-save-role-btn[data-user-id="${userId}"]`);
      if (saveBtn) {
        saveBtn.style.display = select.value !== select.getAttribute('data-original-role') ? 'inline-flex' : 'none';
      }
      // Update color
      const roleColor = ROLE_COLORS[select.value] || '#94a3b8';
      select.style.setProperty('--role-color', roleColor);
    });
  });

  // Save role button
  document.querySelectorAll('.admin-save-role-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const userId = btn.getAttribute('data-user-id');
      const select = document.querySelector(`.admin-role-select[data-user-id="${userId}"]`);
      if (!select) return;

      const newRole = select.value;
      btn.textContent = '⏳';
      btn.disabled = true;

      try {
        await api.admin.updateUser(userId, { role: newRole });
        select.setAttribute('data-original-role', newRole);
        btn.style.display = 'none';
        btn.disabled = false;
        showToast(`Role updated to "${newRole}" ✅`);
        // Update cache
        const cachedUser = usersCache.find(u => u.id === userId);
        if (cachedUser) cachedUser.role = newRole;
      } catch (err) {
        showToast(`Error: ${err.message}`, true);
        btn.textContent = '💾 Save';
        btn.disabled = false;
      }
    });
  });

  // Toggle status button
  document.querySelectorAll('.admin-toggle-status-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const userId = btn.getAttribute('data-user-id');
      const currentStatus = btn.getAttribute('data-current-status');
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const action = newStatus === 'inactive' ? 'deactivate' : 'reactivate';

      const user = usersCache.find(u => u.id === userId);
      const confirmed = confirm(
        `Are you sure you want to ${action} account "${user?.username}"?\n\n` +
        (newStatus === 'inactive' ? 'This user will be logged out and unable to log back in until reactivated.' : 'This will restore their access.')
      );
      if (!confirmed) return;

      btn.textContent = '⏳';
      btn.disabled = true;

      try {
        await api.admin.updateUser(userId, { status: newStatus });
        showToast(`Account ${action}d ✅`);
        await loadUsers(false);
      } catch (err) {
        showToast(`Error: ${err.message}`, true);
        btn.textContent = newStatus === 'inactive' ? '🚫 Deactivate' : '✅ Reactivate';
        btn.disabled = false;
      }
    });
  });

  // View details button
  document.querySelectorAll('.admin-view-details-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const userId = btn.getAttribute('data-user-id');
      const user = usersCache.find(u => u.id === userId);
      if (!user) return;
      showUserDetails(user);
    });
  });
}

function showUserDetails(user) {
  const roleColor = ROLE_COLORS[user.role] || '#94a3b8';
  const joined = new Date(user.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const updated = new Date(user.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const html = `
    <div style="display: flex; flex-direction: column; gap: 20px; padding: 4px 0;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background: ${roleColor}22; color: ${roleColor}; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 900; font-family: var(--font-heading); flex-shrink: 0;">
          ${user.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style="font-size: 22px; font-weight: 800; font-family: var(--font-heading);">${escapeHtml(user.username)}</div>
          <div style="font-size: 13px; color: hsl(var(--muted-foreground)); font-family: monospace;">${user.id}</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        ${detailRow('Role', `<span style="color: ${roleColor}; font-weight: 700;">${user.role}</span>`)}
        ${detailRow('Status', user.status === 'active' ? '🟢 Active' : '🔴 Inactive')}
        ${detailRow('Joined', joined)}
        ${detailRow('Last Updated', updated)}
      </div>
    </div>
  `;
  openAppDialog(`<h2 style="margin: 0 0 20px; font-size: 20px; font-weight: 800; font-family: var(--font-heading);">👤 User Details</h2>${html}`);
}

function detailRow(label, value) {
  return `
    <div style="background: hsl(var(--glass-bg)); border: 1px solid hsl(var(--border)); border-radius: var(--radius-sm); padding: 12px;">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: hsl(var(--muted-foreground)); margin-bottom: 4px;">${label}</div>
      <div style="font-weight: 600; font-size: 14px;">${value}</div>
    </div>
  `;
}

function showToast(message, isError = false) {
  const existing = document.getElementById('admin-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'admin-toast';
  toast.style.cssText = `
    position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%) translateY(20px);
    background: ${isError ? 'hsl(var(--danger))' : 'hsl(var(--success))'};
    color: white; padding: 12px 24px; border-radius: var(--radius-sm);
    font-weight: 700; font-family: var(--font-heading); font-size: 14px;
    z-index: 10000; opacity: 0; transition: all 0.3s ease;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
