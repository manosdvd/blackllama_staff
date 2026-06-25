import { orgChartData } from '../data/handbookData.js';
import { openAppDialog } from '../main.js';

export function renderOrgChart() {
  return `
    <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
      <!-- Search & Filters Header -->
      <div class="org-chart-controls">
        <div class="search-input-wrapper">
          <svg class="search-icon-svg" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="org-search" placeholder="Search by name, role, or department..." aria-label="Search employee directory" />
        </div>
        
        <select class="filter-select" id="org-dept-filter" aria-label="Filter by department">
          <option value="all">All Departments</option>
          <option value="Executive">Executive</option>
          <option value="Engineering">Engineering</option>
          <option value="Product">Product</option>
          <option value="People Ops">People Ops</option>
        </select>
      </div>

      <!-- Tree container -->
      <div class="org-tree-container" id="org-tree-mount">
        <!-- Render tree levels dynamically -->
      </div>
    </div>
  `;
}

export function initOrgChart() {
  const treeMount = document.getElementById('org-tree-mount');
  const searchInput = document.getElementById('org-search');
  const deptFilter = document.getElementById('org-dept-filter');
  
  if (!treeMount) return;

  // Build levels based on hierarchy
  // Level 1: CEO (no reportsTo)
  // Level 2: Reports to CEO
  // Level 3: Reports to VPs (Marcus/Sophia)
  const ceo = orgChartData.filter(emp => !emp.reportsTo);
  const vps = orgChartData.filter(emp => emp.reportsTo === 'emp-1');
  
  // Engineers reporting to Marcus Brody (emp-2) and Product members reporting to Sophia Lind (emp-3)
  const engineers = orgChartData.filter(emp => emp.reportsTo === 'emp-2');
  const productMembers = orgChartData.filter(emp => emp.reportsTo === 'emp-3');
  const level3 = [...engineers, ...productMembers];

  function renderTree() {
    treeMount.innerHTML = `
      <!-- Level 0 (Executive) -->
      <div class="org-level">
        ${ceo.map(emp => renderNodeHtml(emp)).join('')}
      </div>

      <!-- Level 1 (VPs / Ops) -->
      <div class="org-level" style="margin-top: 20px;">
        ${vps.map(emp => renderNodeHtml(emp)).join('')}
      </div>

      <!-- Level 2 (Contributors) -->
      <div class="org-level" style="margin-top: 20px;">
        ${level3.map(emp => renderNodeHtml(emp)).join('')}
      </div>
    `;

    // Hook up click event listeners to details modal
    treeMount.querySelectorAll('.org-node').forEach(node => {
      node.addEventListener('click', () => {
        const empId = node.getAttribute('data-emp-id');
        const emp = orgChartData.find(e => e.id === empId);
        if (emp) {
          showEmployeeDetails(emp);
        }
      });
    });
  }

  function renderNodeHtml(emp) {
    const initials = emp.name.split(' ').map(n => n.charAt(0)).join('');
    return `
      <div class="org-node" data-emp-id="${emp.id}" id="node-${emp.id}">
        <div class="org-node-avatar" style="background: ${emp.avatarGradient};">
          ${initials}
        </div>
        <div class="org-node-details">
          <span class="org-node-name">${emp.name}</span>
          <span class="org-node-role">${emp.role}</span>
          <span class="org-node-dept">${emp.department}</span>
        </div>
      </div>
    `;
  }

  function filterNodes() {
    const query = searchInput.value.toLowerCase().trim();
    const dept = deptFilter.value;

    orgChartData.forEach(emp => {
      const node = document.getElementById(`node-${emp.id}`);
      if (!node) return;

      const nameMatch = emp.name.toLowerCase().includes(query);
      const roleMatch = emp.role.toLowerCase().includes(query);
      const deptMatch = emp.department.toLowerCase().includes(query);
      const textMatch = query === '' || nameMatch || roleMatch || deptMatch;

      const filterDeptMatch = dept === 'all' || emp.department === dept;

      if (textMatch && filterDeptMatch) {
        node.classList.remove('dimmed');
        node.classList.add('highlighted');
        if (query === '' && dept === 'all') {
          node.classList.remove('highlighted');
        }
      } else {
        node.classList.remove('highlighted');
        node.classList.add('dimmed');
      }
    });
  }

  // Draw tree
  renderTree();

  // Search/Filter events
  searchInput.addEventListener('input', filterNodes);
  deptFilter.addEventListener('change', filterNodes);
}

function showEmployeeDetails(emp) {
  const initials = emp.name.split(' ').map(n => n.charAt(0)).join('');
  const html = `
    <div style="display: flex; flex-direction: column; gap: 20px;">
      <div style="display: flex; align-items: center; gap: 20px; border-bottom: 1px solid hsl(var(--border)); padding-bottom: 20px;">
        <div style="width: 72px; height: 72px; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 26px; box-shadow: var(--shadow-md); background: ${emp.avatarGradient};">
          ${initials}
        </div>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <h2 id="dialog-title" style="font-size: 22px; font-weight: 800; font-family: var(--font-heading); margin-bottom: 0;">${emp.name}</h2>
          <span style="font-weight: 600; color: hsl(var(--primary)); font-size: 14px;">${emp.role}</span>
          <span style="align-self: flex-start; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 8px; background: hsl(var(--secondary)); border-radius: 4px; color: hsl(var(--muted-foreground));">${emp.department}</span>
        </div>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 12px; font-size: 14.5px;">
        <div>
          <span style="font-weight: 700; color: hsl(var(--muted-foreground)); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Bio</span>
          <p style="margin-top: 4px; line-height: 1.6;">${emp.bio}</p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 8px;">
          <div>
            <span style="font-weight: 700; color: hsl(var(--muted-foreground)); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Email</span>
            <p style="margin-top: 4px; font-weight: 600;"><a href="mailto:${emp.email}" style="color: hsl(var(--primary));">${emp.email}</a></p>
          </div>
          <div>
            <span style="font-weight: 700; color: hsl(var(--muted-foreground)); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Phone</span>
            <p style="margin-top: 4px; font-weight: 600;">${emp.phone}</p>
          </div>
        </div>

        <div style="background: hsl(var(--primary) / 0.05); border: 1px dashed hsl(var(--primary) / 0.2); border-radius: var(--radius-md); padding: 14px; margin-top: 8px; display: flex; align-items: flex-start; gap: 12px;">
          <span style="font-size: 20px; line-height: 1;">🎭</span>
          <div>
            <h4 style="font-weight: 700; font-size: 13px; color: hsl(var(--primary)); margin-bottom: 2px;">Fun Fact:</h4>
            <p style="font-size: 13.5px; font-style: italic; line-height: 1.4;">${emp.funFact}</p>
          </div>
        </div>
      </div>
    </div>
  `;

  openAppDialog(html);
}
