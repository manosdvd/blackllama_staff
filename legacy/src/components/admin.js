import { state, navigateTo, openAppDialog, closeAppDialog } from '../main.js';
import { renderAdminUsers, initAdminUsers } from './adminUsers.js';
import { api } from '../services/apiClient.js';

let activeAdminTab = 'applications';
let loadedApps = [];

export function renderAdmin() {
  const securityNoticeHtml = `
    <div class="glass-panel" style="padding: 12px 18px; background: hsl(var(--secondary) / 0.1); border-left: 4px solid hsl(var(--primary)); font-size: 13px; line-height: 1.4; color: hsl(var(--muted-foreground)); margin-bottom: 16px; display:flex; align-items:center; gap:8px;">
      <span>🔒</span>
      <span><strong>Server-Side Security Notice:</strong> Access to applicant and user data registries is fully secured at the database API level using Supabase Row-Level Security (RLS) policies. Client-side navigation visibility is for ease-of-use and convenience only.</span>
    </div>
  `;

  const tabsHtml = securityNoticeHtml + `
    <div style="display: flex; border-bottom: 1px solid hsl(var(--border)); padding-bottom: 0; margin-bottom: 20px;">
      <button id="admin-tab-apps" class="schedule-tab-btn ${activeAdminTab === 'applications' ? 'active' : ''}" style="margin-right: 16px;">Applicant Registry</button>
      <button id="admin-tab-users" class="schedule-tab-btn ${activeAdminTab === 'users' ? 'active' : ''}">User Management</button>
    </div>
  `;

  if (activeAdminTab === 'users') {
    return tabsHtml + renderAdminUsers();
  }

  const total = loadedApps.length;
  const pending = loadedApps.filter(a => a.status === 'Pending').length;
  const approved = loadedApps.filter(a => a.status === 'Approved').length;
  const rejected = loadedApps.filter(a => a.status === 'Rejected').length;

  return tabsHtml + `
    <div style="display: flex; flex-direction: column; gap: 28px;">
      
      <!-- Stats Summary -->
      <div class="admin-stats-grid">
        <div class="admin-stat-card">
          <span class="admin-stat-num">${total}</span>
          <span class="admin-stat-label">Total Applications</span>
        </div>
        <div class="admin-stat-card pending">
          <span class="admin-stat-num">${pending}</span>
          <span class="admin-stat-label">Pending Review</span>
        </div>
        <div class="admin-stat-card approved">
          <span class="admin-stat-num">${approved}</span>
          <span class="admin-stat-label">Approved Candidates</span>
        </div>
        <div class="admin-stat-card rejected">
          <span class="admin-stat-num">${rejected}</span>
          <span class="admin-stat-label">Rejected / Incomplete</span>
        </div>
      </div>

      <!-- Filters & Toolbar -->
      <div class="glass-panel admin-toolbar" style="display: flex; flex-direction: column; gap: 16px; padding: 20px;">
        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center; width: 100%;">
          
          <div style="flex: 1; min-width: 200px; display: flex; align-items: center; background: var(--glass-bg); border: 1px solid hsl(var(--border)); border-radius: var(--radius-sm); padding: 6px 12px; gap: 8px;">
            <span style="font-size: 16px;">🔍</span>
            <input type="text" id="admin-search-input" placeholder="Search applicant name or email..." style="background: none; border: none; outline: none; font-size: 14.5px; width: 100%; color: inherit;" />
          </div>

          <select id="admin-filter-status" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: hsl(var(--foreground)); font-size: 14.5px;">
            <option value="All">All Statuses</option>
            <option value="Pending">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select id="admin-filter-role" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: hsl(var(--foreground)); font-size: 14.5px;">
            <option value="All">All Position Choices</option>
            <option value="Scoutcraft">Scoutcraft</option>
            <option value="Nature">Nature / Ecology</option>
            <option value="CIT">Counselor in Training (CIT)</option>
            <option value="Handicraft">Handicraft</option>
            <option value="Program">Program / Operations</option>
          </select>

          <div style="margin-left: auto; display: flex; gap: 10px;">
            <button class="welcome-banner-btn" id="admin-btn-export" style="background: hsl(var(--primary)); color: white; display: flex; align-items: center; gap: 8px; font-size: 14px;">
              <span>📥</span> Export Registry
            </button>
          </div>

        </div>
      </div>

      <!-- Applicant Registry List -->
      <div class="glass-panel" style="padding: 0; overflow-x: auto; border: 1px solid hsl(var(--border)); border-radius: var(--radius-lg);">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Applicant Name</th>
              <th>Preferred Role Choices</th>
              <th>Submitted Date</th>
              <th>Eligibility</th>
              <th>Status</th>
              <th style="text-align: right; padding-right: 24px;">Action</th>
            </tr>
          </thead>
          <tbody id="admin-table-body">
            <tr>
              <td colspan="6" style="text-align: center; padding: 32px; color: hsl(var(--muted-foreground)); font-weight: 500;">
                Loading applicant registry...
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  `;
}

export function initAdmin() {
  const tabApps = document.getElementById('admin-tab-apps');
  const tabUsers = document.getElementById('admin-tab-users');

  if (tabApps) {
    tabApps.addEventListener('click', () => {
      activeAdminTab = 'applications';
      window.dispatchEvent(new CustomEvent('camp-admin-refresh'));
    });
  }

  if (tabUsers) {
    tabUsers.addEventListener('click', () => {
      activeAdminTab = 'users';
      window.dispatchEvent(new CustomEvent('camp-admin-refresh'));
    });
  }

  // Handle global refresh event for re-rendering the admin panel inline
  if (!window.adminRefreshBound) {
    window.addEventListener('camp-admin-refresh', () => {
      const mount = document.getElementById('view-mount-point');
      if (mount && state.activeView === 'admin') {
        mount.innerHTML = renderAdmin();
        initAdmin();
      }
    });
    window.adminRefreshBound = true;
  }

  if (activeAdminTab === 'users') {
    initAdminUsers();
    return;
  }

  const searchInput = document.getElementById('admin-search-input');
  const statusFilter = document.getElementById('admin-filter-status');
  const roleFilter = document.getElementById('admin-filter-role');
  const exportBtn = document.getElementById('admin-btn-export');

  const filterAndRender = () => {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const status = statusFilter ? statusFilter.value : 'All';
    const role = roleFilter ? roleFilter.value : 'All';

    const filtered = loadedApps.filter(app => {
      const form = app.form_data || app.formData || {};
      const fullName = `${form.firstName || ''} ${form.lastName || ''}`.toLowerCase();
      const email = (form.email || '').toLowerCase();
      
      const matchesSearch = fullName.includes(query) || email.includes(query);
      const matchesStatus = status === 'All' || app.status === status;
      
      let matchesRole = true;
      if (role !== 'All') {
        const p1 = (form.pref1 || '').toLowerCase();
        const p2 = (form.pref2 || '').toLowerCase();
        const p3 = (form.pref3 || '').toLowerCase();
        const rKey = role.toLowerCase();
        
        matchesRole = p1.includes(rKey) || p2.includes(rKey) || p3.includes(rKey);
      }

      return matchesSearch && matchesStatus && matchesRole;
    });

    const tbody = document.getElementById('admin-table-body');
    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 32px; color: hsl(var(--muted-foreground)); font-weight: 500;">
            No applications found matching the selected filters.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(app => {
      const form = app.form_data || app.formData || {};
      const dateStr = new Date(app.submittedAt || app.submitted_at).toLocaleDateString();
      const ageText = form.ageEligibility ? `${form.ageEligibility}+ yrs` : 'Unknown';
      
      const roleChoices = [form.pref1, form.pref2, form.pref3].filter(Boolean).join(' → ');
      
      let statusClass = 'pending';
      let statusLabel = 'Pending Review';
      if (app.status === 'Approved') {
        statusClass = 'approved';
        statusLabel = 'Approved';
      } else if (app.status === 'Rejected') {
        statusClass = 'rejected';
        statusLabel = 'Rejected';
      }

      return `
        <tr class="applicant-row" data-id="${app.id}">
          <td style="font-weight: 600;">
            ${form.firstName || app.username || 'Anonymous'} ${form.lastName || ''}
            ${form.nickname ? `<div style="font-size: 12px; font-weight: normal; color: hsl(var(--muted-foreground));">"${form.nickname}"</div>` : ''}
          </td>
          <td style="font-size: 13.5px; opacity: 0.95;">${roleChoices || 'Not Specified'}</td>
          <td>${dateStr}</td>
          <td>
            <span style="font-size: 12px; background: hsl(var(--secondary)); padding: 2px 6px; border-radius: 4px; font-weight: 600;">${ageText}</span>
          </td>
          <td>
            <span class="app-status-badge ${statusClass}" style="display: inline-flex; width: fit-content; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase;">
              ${app.status === 'Approved' ? '✅' : app.status === 'Rejected' ? '❌' : '⏳'} ${statusLabel}
            </span>
          </td>
          <td style="text-align: right; padding-right: 24px;">
            <button class="welcome-banner-btn inspect-btn" data-id="${app.id}" style="padding: 6px 14px; font-size: 13px;">Review File</button>
          </td>
        </tr>
      `;
    }).join('');

    // Attach click events
    tbody.querySelectorAll('.inspect-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        openReviewModal(id);
      });
    });

    tbody.querySelectorAll('.applicant-row').forEach(row => {
      row.addEventListener('click', () => {
        const id = row.getAttribute('data-id');
        openReviewModal(id);
      });
    });
  };

  const loadAndFilter = async () => {
    try {
      const data = await api.admin.listApplications();
      loadedApps = data.applications || [];
      localStorage.setItem('camp_lawton_applications', JSON.stringify(loadedApps));
    } catch (err) {
      console.error('Failed to load apps from API, using local:', err);
      loadedApps = JSON.parse(localStorage.getItem('camp_lawton_applications') || '[]');
    }
    filterAndRender();
  };

  if (searchInput) searchInput.addEventListener('input', filterAndRender);
  if (statusFilter) statusFilter.addEventListener('change', filterAndRender);
  if (roleFilter) roleFilter.addEventListener('change', filterAndRender);

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(loadedApps, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `camp_lawton_applications_${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  loadAndFilter();
}

function openReviewModal(appId) {
  const app = loadedApps.find(a => a.id === appId);
  if (!app) return;

  const form = app.form_data || app.formData || {};
  
  let certs = [];
  if (form.certCPR) certs.push('CPR / AED');
  if (form.certWFA) certs.push('Wilderness First Aid');

  const contentHtml = `
    <div style="display: flex; flex-direction: column; gap: 20px; max-height: 80vh; overflow-y: auto; padding-right: 10px; text-align: left;">
      
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid hsl(var(--border)); padding-bottom: 16px;">
        <div>
          <h2 style="font-family: var(--font-heading); font-size: 26px; color: hsl(var(--primary)); margin: 0 0 4px 0;">
            ${form.firstName || app.username || 'Anonymous'} ${form.lastName || ''}
          </h2>
          <p style="margin: 0; font-size: 13px; color: hsl(var(--muted-foreground));">
            Candidate Application Registry ID: <code>${app.id}</code>
          </p>
        </div>
        <div class="app-status-badge ${app.status.toLowerCase()}" style="font-weight: 700; text-transform: uppercase; padding: 6px 14px; border-radius: 20px; font-size: 13px;">
          ${app.status === 'Approved' ? '✅ Approved' : app.status === 'Rejected' ? '❌ Rejected' : '⏳ Pending Review'}
        </div>
      </div>

      <!-- Applicant Detailed Content -->
      <div class="admin-details-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 14px;">
        
        <!-- Section I -->
        <div style="background: hsl(var(--secondary) / 0.2); padding: 16px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border) / 0.5);">
          <h4 style="color: hsl(var(--primary)); margin-top: 0; border-bottom: 1px dashed hsl(var(--border)); padding-bottom: 6px; margin-bottom: 10px;">Section I: Demographics & Eligibility</h4>
          <p><strong>Nickname/Preferred:</strong> ${form.nickname || 'None'}</p>
          <p><strong>Phone:</strong> ${form.phone || 'Not provided'}</p>
          <p><strong>Email:</strong> ${form.email || 'Not provided'}</p>
          <p><strong>Address:</strong> ${form.address || 'Not provided'}</p>
          <p><strong>Age Group (as of June 1):</strong> ${form.ageEligibility || 'Not provided'}</p>
          <p><strong>Legally Auth to Work in US:</strong> ${form.workAuth ? 'Yes' : 'No'}</p>
          <p><strong>Scouting America Registered:</strong> ${form.scoutReg ? 'Yes' : 'No'}</p>
        </div>

        <!-- Section II -->
        <div style="background: hsl(var(--secondary) / 0.2); padding: 16px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border) / 0.5);">
          <h4 style="color: hsl(var(--primary)); margin-top: 0; border-bottom: 1px dashed hsl(var(--border)); padding-bottom: 6px; margin-bottom: 10px;">Section II: Positions & Operations</h4>
          <p><strong>Available Dates:</strong> ${form.startDate || 'TBD'} to ${form.endDate || 'TBD'}</p>
          <p><strong>1st Choice:</strong> ${form.pref1 || 'None'}</p>
          <p><strong>2nd Choice:</strong> ${form.pref2 || 'None'}</p>
          <p><strong>3rd Choice:</strong> ${form.pref3 || 'None'}</p>
          <p><strong>T-Shirt Sizing:</strong> ${form.shirtSize || 'TBD'}</p>
          <p><strong>Jacket Sizing:</strong> ${form.jacketSize || 'TBD'}</p>
        </div>

        <!-- Section III -->
        <div style="background: hsl(var(--secondary) / 0.2); padding: 16px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border) / 0.5); grid-column: 1 / -1;">
          <h4 style="color: hsl(var(--primary)); margin-top: 0; border-bottom: 1px dashed hsl(var(--border)); padding-bottom: 6px; margin-bottom: 10px;">Section III: Experience & References</h4>
          <p><strong>Scouting Rank:</strong> ${form.scoutRank || 'None'}</p>
          <p><strong>OA Member:</strong> ${form.oaMember ? 'Yes' : 'No'}</p>
          <p><strong>Prior Employer:</strong> ${form.employer || 'None'}</p>
          <p><strong>Prior Duties:</strong> ${form.duties || 'None'}</p>
          <div style="margin-top: 10px;">
            <strong>References:</strong>
            <ul style="margin: 4px 0 0 20px; padding: 0;">
              <li>${form.ref1 || 'Not listed'}</li>
              <li>${form.ref2 || 'Not listed'}</li>
              <li>${form.ref3 || 'Not listed'}</li>
            </ul>
          </div>
        </div>

        <!-- Section IV & V -->
        <div style="background: hsl(var(--secondary) / 0.2); padding: 16px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border) / 0.5); grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <h4 style="color: hsl(var(--primary)); margin-top: 0; border-bottom: 1px dashed hsl(var(--border)); padding-bottom: 6px; margin-bottom: 10px;">Section IV: Requirements Check</h4>
            <p>⛰️ <strong>Altitude:</strong> ${form.ackAltitude ? 'Acknowledged' : '❌'}</p>
            <p>🐻 <strong>Wildlife:</strong> ${form.ackWildlife ? 'Acknowledged' : '❌'}</p>
            <p>🚰 <strong>Sanitation:</strong> ${form.ackSanitation ? 'Acknowledged' : '❌'}</p>
            <p>🏥 <strong>Medical Form A/B/C:</strong> ${form.ackMedical ? 'Acknowledged' : '❌'}</p>
            <p>📜 <strong>Certifications:</strong> ${certs.length > 0 ? certs.join(', ') : 'None'}</p>
          </div>
          <div>
            <h4 style="color: hsl(var(--primary)); margin-top: 0; border-bottom: 1px dashed hsl(var(--border)); padding-bottom: 6px; margin-bottom: 10px;">Section V: Agreements & Signature</h4>
            <p>🤝 <strong>Conduct & Substance Policy:</strong> ${form.ackAgreements ? 'Averred' : '❌'}</p>
            <p>✍️ <strong>Digital Signature:</strong> <span style="font-family: 'Bebas Neue', sans-serif; font-size: 16px; letter-spacing: 0.5px; color: hsl(var(--primary));">${form.signature || 'Unsigned'}</span></p>
            <p>📅 <strong>Signature Date:</strong> ${form.sigDate || 'TBD'}</p>
          </div>
        </div>
      </div>

      <!-- Action Panel with Notes and Role Selection -->
      <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 20px; border-top: 1px solid hsl(var(--border)); padding-top: 16px;">
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <label for="review-notes-input" style="font-weight: 600; font-size: 13.5px;">Reviewer Notes / Instructions</label>
          <textarea id="review-notes-input" placeholder="Type instructions or reasons here (required for Rejections or Pending requests)..." style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); min-height: 70px; font-size: 14px; background: var(--glass-bg); color: inherit; line-height: 1.4; outline: none;"></textarea>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-top: 6px;">
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <label for="assign-role-select" style="font-weight: 600; font-size: 12px; color: hsl(var(--muted-foreground));">Appoint Position (On Approval)</label>
            <select id="assign-role-select" style="padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: hsl(var(--foreground)); font-size: 14px; width: 220px;">
              <option value="Staff">General Staff</option>
              <option value="Scoutcraft" ${form.pref1 === 'Scoutcraft Instructor' ? 'selected' : ''}>Scoutcraft Instructor</option>
              <option value="Nature" ${form.pref1 === 'Nature / Ecology Instructor' ? 'selected' : ''}>Nature Instructor</option>
              <option value="Shooting Sports" ${form.pref1 === 'Shooting Sports' ? 'selected' : ''}>Shooting Sports Director</option>
              <option value="Handicraft" ${form.pref1 === 'Handicraft Instructor' ? 'selected' : ''}>Handicraft Instructor</option>
              <option value="CIT" ${form.pref1 === 'Counselor in Training (CIT)' ? 'selected' : ''}>Counselor in Training (CIT)</option>
              <option value="Ranger" ${form.pref1 === 'Camp Ranger' ? 'selected' : ''}>Camp Ranger</option>
              <option value="Medic" ${form.pref1 === 'Health Officer / Medic' ? 'selected' : ''}>Health Officer / Medic</option>
              <option value="Program Director">Program Director</option>
              <option value="Camp Director">Camp Director</option>
            </select>
          </div>
          
          <div style="display: flex; gap: 10px; margin-top: 12px; margin-left: auto;">
            <button class="welcome-banner-btn" id="modal-pending-btn" style="background: hsl(var(--warning)); color: white; padding: 10px 16px;">Mark Pending</button>
            <button class="welcome-banner-btn" id="modal-reject-btn" style="background: hsl(var(--danger) / 0.1); border: 1px solid hsl(var(--danger) / 0.3); color: hsl(var(--danger)); padding: 10px 16px;">Reject</button>
            <button class="welcome-banner-btn" id="modal-approve-btn" style="background: hsl(var(--success)); color: white; padding: 10px 20px;">Approve & Appoint</button>
          </div>
        </div>
      </div>

    </div>
  `;

  openAppDialog(contentHtml);

  // Bind Actions
  const approveBtn = document.getElementById('modal-approve-btn');
  const rejectBtn = document.getElementById('modal-reject-btn');
  const pendingBtn = document.getElementById('modal-pending-btn');
  const notesInput = document.getElementById('review-notes-input');
  const roleSelect = document.getElementById('assign-role-select');

  const updateStatus = async (newStatus) => {
    const notes = notesInput ? notesInput.value.trim() : '';
    const assignedRole = roleSelect ? roleSelect.value : 'Staff';

    if ((newStatus === 'Rejected' || newStatus === 'Pending') && !notes) {
      alert(`Please provide reviewer notes/instructions explaining why this application is set to ${newStatus}.`);
      return;
    }

    try {
      approveBtn.disabled = true;
      rejectBtn.disabled = true;
      if (pendingBtn) pendingBtn.disabled = true;
      
      await api.admin.updateApplication(app.id, newStatus, notes, assignedRole);
      closeAppDialog();
      
      // Refresh the view
      const viewMount = document.getElementById('view-mount-point');
      if (viewMount && state.activeView === 'admin') {
        viewMount.innerHTML = renderAdmin();
        initAdmin();
      }
      
      // Dispatch custom event to notify dashboard
      window.dispatchEvent(new CustomEvent('camp-application-submitted'));
    } catch (err) {
      alert(`Failed to update application: ${err.message}`);
      approveBtn.disabled = false;
      rejectBtn.disabled = false;
      if (pendingBtn) pendingBtn.disabled = false;
    }
  };

  if (approveBtn) approveBtn.addEventListener('click', () => updateStatus('Approved'));
  if (rejectBtn) rejectBtn.addEventListener('click', () => updateStatus('Rejected'));
  if (pendingBtn) pendingBtn.addEventListener('click', () => updateStatus('Pending'));
}
