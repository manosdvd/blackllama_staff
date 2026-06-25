import { usersDB } from '../services/db.js';
import { AuthService } from '../services/auth.js';

export function renderAdminUsers() {
  const users = usersDB.findAll();
  
  const total = users.length;
  const active = users.filter(u => u.status === 'active').length;
  const inactive = users.filter(u => u.status === 'inactive').length;
  const admins = users.filter(u => ['Admin', 'Camp Director', 'Program Director'].includes(u.role)).length;

  return `
    <div style="display: flex; flex-direction: column; gap: 28px;">
      
      <!-- Stats Summary -->
      <div class="admin-stats-grid">
        <div class="admin-stat-card">
          <span class="admin-stat-num">${total}</span>
          <span class="admin-stat-label">Total Users</span>
        </div>
        <div class="admin-stat-card approved">
          <span class="admin-stat-num">${active}</span>
          <span class="admin-stat-label">Active Accounts</span>
        </div>
        <div class="admin-stat-card rejected">
          <span class="admin-stat-num">${inactive}</span>
          <span class="admin-stat-label">Deactivated</span>
        </div>
        <div class="admin-stat-card pending">
          <span class="admin-stat-num">${admins}</span>
          <span class="admin-stat-label">Admin Level Users</span>
        </div>
      </div>

      <!-- Applicant Registry List -->
      <div class="glass-panel" style="padding: 0; overflow-x: auto; border: 1px solid hsl(var(--border)); border-radius: var(--radius-lg);">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th style="text-align: right; padding-right: 24px;">Action</th>
            </tr>
          </thead>
          <tbody id="admin-users-table-body">
            <!-- Dynamic matching rows injected here -->
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export function initAdminUsers() {
  const tbody = document.getElementById('admin-users-table-body');
  if (!tbody) return;

  const renderTable = () => {
    const users = usersDB.findAll();
    
    tbody.innerHTML = users.map(user => {
      const dateStr = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Legacy';
      const currentUser = AuthService.getCurrentUser();
      const isSelf = currentUser && currentUser.id === user.id;

      let statusClass = user.status === 'active' ? 'approved' : 'rejected';
      
      const roleOptions = [
        'Staff', 'Scoutcraft', 'Nature', 'Handicraft', 'CIT', 'Ranger', 'Medic', 
        'Program Director', 'Camp Director', 'Admin'
      ].map(r => `<option value="${r}" ${user.role === r ? 'selected' : ''}>${r}</option>`).join('');

      return `
        <tr class="user-row" data-id="${user.id}">
          <td style="font-weight: 600;">
            ${user.username}
            ${isSelf ? '<span style="font-size: 11px; background: hsl(var(--primary)); color: white; padding: 2px 6px; border-radius: 4px; margin-left: 8px;">YOU</span>' : ''}
          </td>
          <td>
            <select class="role-select" data-id="${user.id}" ${isSelf ? 'disabled' : ''} style="padding: 6px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: hsl(var(--foreground)); font-size: 13px;">
              ${roleOptions}
            </select>
          </td>
          <td>
            <span class="app-status-badge ${statusClass}" style="display: inline-flex; width: fit-content; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase;">
              ${user.status}
            </span>
          </td>
          <td>${dateStr}</td>
          <td style="text-align: right; padding-right: 24px;">
            <button class="welcome-banner-btn toggle-status-btn" data-id="${user.id}" data-status="${user.status}" ${isSelf ? 'disabled' : ''} style="padding: 6px 14px; font-size: 13px; background: ${user.status === 'active' ? 'hsl(var(--danger) / 0.1)' : 'hsl(var(--success) / 0.1)'}; color: ${user.status === 'active' ? 'hsl(var(--danger))' : 'hsl(var(--success))'}; border: 1px solid currentColor;">
              ${user.status === 'active' ? 'Deactivate' : 'Activate'}
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Bind Role Changes
    tbody.querySelectorAll('.role-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        const newRole = e.target.value;
        usersDB.update(id, { role: newRole });
        
        // Dispatch event to redraw table stats
        const viewMount = document.getElementById('view-mount-point');
        if (viewMount) {
          // Re-render the users view silently
          window.dispatchEvent(new CustomEvent('camp-admin-refresh'));
        }
      });
    });

    // Bind Status Toggles
    tbody.querySelectorAll('.toggle-status-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const currentStatus = e.target.getAttribute('data-status');
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        
        usersDB.update(id, { status: newStatus });
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('camp-admin-refresh'));
      });
    });
  };

  renderTable();
}
