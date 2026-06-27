import { wikiService, generateSlug } from '../services/wikiService.js';
import { AuthService } from '../services/auth.js';
import { renderWikiGraph, initWikiGraph } from './wikiGraph.js';
import { marked } from 'marked';
import { state } from '../main.js';

// Local view states: 'view' | 'edit' | 'create'
let wikiState = {
  activeSlug: 'welcome',
  viewMode: 'view', // 'view', 'edit', 'create'
  pages: [],
  currentPage: null,
  revisions: [],
  searchQuery: '',
  selectedCategory: 'All',
  showGraph: false,
  unresolvedTarget: '' // Pre-fill title for new unresolved link page
};

function getContextualImage(title) {
  if (!title) return null;
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('welcome')) return '/images/welcome_mission_1782503700417.png';
  if (lowerTitle.includes('rules') || lowerTitle.includes('conduct')) return '/images/the_rules_1782503707686.png';
  if (lowerTitle.includes('stress management') || lowerTitle.includes('mental health')) return '/images/stress_management_1782503718009.png';
  if (lowerTitle.includes('program areas')) return '/images/program_areas_1782503726243.png';
  return null;
}

export function renderWiki() {
  return `
    <div class="wiki-container" style="display: flex; gap: 24px; min-height: calc(100vh - 200px); align-items: stretch;">
      
      <!-- Wiki Sidebar -->
      <aside class="course-sidebar glass-panel" style="width: 320px; flex-shrink: 0; padding: 0; overflow-y: auto; max-height: calc(100vh - 200px); border-radius: var(--radius-md); display: flex; flex-direction: column;">
        
        <!-- Sidebar Header & Search -->
        <div style="padding: 20px; border-bottom: 1px solid hsl(var(--border) / 0.5); background: hsl(var(--muted) / 0.1);">
          <h2 style="margin: 0 0 12px 0; font-size: 18px; font-family: var(--font-heading); color: hsl(var(--primary));">Camp Lawton Wiki</h2>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <input type="text" id="wiki-sidebar-search" placeholder="Filter wiki pages..." style="width: 100%; padding: 8px 12px; border: 1px solid hsl(var(--border)); border-radius: var(--radius-sm); font-size: 13.5px; background: var(--glass-bg); color: inherit;" />
            <select id="wiki-category-filter" style="width: 100%; padding: 6px 8px; border: 1px solid hsl(var(--border)); border-radius: var(--radius-sm); font-size: 13px; background: var(--glass-bg); color: hsl(var(--foreground));">
              <option value="All">All Categories</option>
              <option value="Culture & Training">Culture & Training</option>
              <option value="Policies & Laws">Policies & Laws</option>
              <option value="Emergency & Safety">Emergency & Safety</option>
              <option value="Songbook & Skits">Songbook & Skits</option>
              <option value="General">General</option>
            </select>
          </div>
        </div>

        <!-- Sidebar Navigation Directory List -->
        <div id="wiki-sidebar-list" style="flex-grow: 1; overflow-y: auto; padding: 12px 8px;">
          <!-- Injected dynamically -->
        </div>

        <!-- Sidebar Actions -->
        <div style="padding: 16px; border-top: 1px solid hsl(var(--border) / 0.5); display: flex; flex-direction: column; gap: 8px; background: hsl(var(--muted) / 0.05);">
          <button id="wiki-graph-toggle-btn" class="glass-btn" style="width: 100%; font-weight: 600; justify-content: center; display: flex; gap: 6px; align-items: center;">
            📊 Visual connections graph
          </button>
          ${AuthService.isStaff() || AuthService.isAdmin() ? `
            <button id="wiki-create-page-btn" class="glass-btn primary" style="width: 100%; font-weight: 700; justify-content: center; display: flex; gap: 6px; align-items: center; background: hsl(var(--primary)); color: white;">
              ➕ Create wiki page
            </button>
          ` : ''}
        </div>
      </aside>

      <!-- Wiki Main Content Frame -->
      <main class="course-content glass-panel" id="wiki-main-panel" style="flex-grow: 1; padding: 40px; display: flex; flex-direction: column; overflow-y: auto; max-height: calc(100vh - 200px); border-radius: var(--radius-md); position: relative;">
        <!-- Injected dynamically based on viewMode -->
      </main>

    </div>
  `;
}

export async function initWiki() {
  try {
    // Load pages first
    wikiState.pages = await wikiService.listPages();
    
    // Set default view page
    const welcomePage = wikiState.pages.find(p => p.slug === 'welcome');
    if (welcomePage) {
      wikiState.currentPage = welcomePage;
      wikiState.activeSlug = 'welcome';
    } else if (wikiState.pages.length > 0) {
      wikiState.currentPage = wikiState.pages[0];
      wikiState.activeSlug = wikiState.pages[0].slug;
    }
    
    // Refresh Sidebar and Main Page
    renderWikiSidebar();
    await loadWikiPage(wikiState.activeSlug);

    // Bind Sidebar Search
    const searchInput = document.getElementById('wiki-sidebar-search');
    if (searchInput) {
      searchInput.value = wikiState.searchQuery;
      searchInput.addEventListener('input', (e) => {
        wikiState.searchQuery = e.target.value.toLowerCase();
        renderWikiSidebar();
      });
    }

    // Bind Category Filter
    const catSelect = document.getElementById('wiki-category-filter');
    if (catSelect) {
      catSelect.value = wikiState.selectedCategory;
      catSelect.addEventListener('change', (e) => {
        wikiState.selectedCategory = e.target.value;
        renderWikiSidebar();
      });
    }

    // Bind Create Page Button
    const createBtn = document.getElementById('wiki-create-page-btn');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        enterCreateMode();
      });
    }

    // Bind Graph Toggle Button
    const graphBtn = document.getElementById('wiki-graph-toggle-btn');
    if (graphBtn) {
      graphBtn.addEventListener('click', () => {
        toggleGraphView();
      });
    }

  } catch (err) {
    console.error('Failed to init Wiki page:', err);
  }
}

// ── RENDER SIDEBAR DIRECTORY ──────────────────────────────────────────
function renderWikiSidebar() {
  const sidebarList = document.getElementById('wiki-sidebar-list');
  if (!sidebarList) return;

  // Filter pages
  const filtered = wikiState.pages.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(wikiState.searchQuery) ||
                          (p.tags && p.tags.some(t => t.toLowerCase().includes(wikiState.searchQuery))) ||
                          (p.content && p.content.toLowerCase().includes(wikiState.searchQuery));
    const matchesCategory = wikiState.selectedCategory === 'All' || p.category === wikiState.selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group pages by Category
  const categories = {};
  filtered.forEach(p => {
    const cat = p.category || 'General';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(p);
  });

  if (filtered.length === 0) {
    sidebarList.innerHTML = `<div style="padding: 20px; text-align: center; color: hsl(var(--muted-foreground)); font-size: 13.5px;">No pages found</div>`;
    return;
  }

  sidebarList.innerHTML = Object.keys(categories).map(catName => {
    const catPages = categories[catName];
    // Sort pages within category alphabetically
    catPages.sort((a, b) => a.title.localeCompare(b.title));

    const pageLinksHtml = catPages.map(p => {
      const activeClass = p.slug === wikiState.activeSlug ? 'active-lesson' : '';
      const isEmergency = catName.includes('Emergency') ? '⚠️' : '📄';
      return `
        <div class="syllabus-leaf level-2">
          <button class="course-nav-btn leaf ${activeClass}" data-slug="${p.slug}" type="button">
            <span style="margin-right: 6px;">${isEmergency}</span> ${p.title}
          </button>
        </div>
      `;
    }).join('');

    return `
      <details class="syllabus-group level-1" open>
        <summary class="syllabus-summary level-1">
          <span class="chevron-icon">▼</span>
          <span style="font-weight: 700; font-size: 13.5px; text-transform: uppercase; color: hsl(var(--muted-foreground)); letter-spacing: 0.5px;">${catName}</span>
        </summary>
        <div class="syllabus-children">
          ${pageLinksHtml}
        </div>
      </details>
    `;
  }).join('');

  // Bind Sidebar Page Buttons
  sidebarList.querySelectorAll('.course-nav-btn.leaf').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const slug = btn.getAttribute('data-slug');
      loadWikiPage(slug);
    });
  });
}

// ── LOAD & RENDER WIKI PAGE ──────────────────────────────────────────
async function loadWikiPage(slug) {
  wikiState.activeSlug = slug;
  wikiState.showGraph = false;

  // Sync active item in sidebar visually
  const sidebarList = document.getElementById('wiki-sidebar-list');
  if (sidebarList) {
    sidebarList.querySelectorAll('.course-nav-btn.leaf').forEach(btn => {
      if (btn.getAttribute('data-slug') === slug) {
        btn.classList.add('active-lesson');
      } else {
        btn.classList.remove('active-lesson');
      }
    });
  }

  try {
    const data = await wikiService.getPage(slug);
    wikiState.currentPage = data.page;
    wikiState.revisions = data.revisions;
    wikiState.viewMode = 'view';

    renderWikiContent();
  } catch (err) {
    console.error(`Failed to load page '${slug}':`, err);
    // If fallback lookup fails, go to welcome or first available
    if (slug !== 'welcome') {
      loadWikiPage('welcome');
    }
  }
}

// Renders the main content panel
function renderWikiContent() {
  const mainPanel = document.getElementById('wiki-main-panel');
  if (!mainPanel) return;

  if (wikiState.showGraph) {
    mainPanel.innerHTML = renderWikiGraph();
    
    // Set up cleanup and graph initialization
    const cleanup = initWikiGraph(
      wikiState.pages,
      (slug) => {
        // Navigate
        loadWikiPage(slug);
      },
      () => {
        // Close Graph
        wikiState.showGraph = false;
        renderWikiContent();
      }
    );

    // Stop physics simulation on view transitions
    const onBeforeChange = () => {
      cleanup();
      window.removeEventListener('before-view-change', onBeforeChange);
    };
    window.addEventListener('before-view-change', onBeforeChange);
    return;
  }

  if (wikiState.viewMode === 'view') {
    renderWikiViewMode(mainPanel);
  } else if (wikiState.viewMode === 'edit' || wikiState.viewMode === 'create') {
    renderWikiEditMode(mainPanel);
  }
}

function renderWikiViewMode(mainPanel) {
  const page = wikiState.currentPage;
  if (!page) {
    mainPanel.innerHTML = `<div style="text-align:center; padding:40px;">Select a page from the sidebar.</div>`;
    return;
  }

  const imagePath = getContextualImage(page.title);
  const imageHtml = imagePath ? `<img src="${imagePath}" alt="${page.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: var(--radius-sm); margin-bottom: 24px; box-shadow: var(--shadow-sm);">` : '';

  // Calculate backlinks
  const backlinks = wikiService.getBacklinks(page.slug, wikiState.pages);
  const backlinksHtml = backlinks.length > 0
    ? backlinks.map(b => `<a href="#" class="wiki-link" data-slug="${b.slug}" style="text-decoration: underline; margin-right: 12px; font-weight: 500;">[[${b.title}]]</a>`).join('')
    : `<span style="color: hsl(var(--muted-foreground)); font-size: 13.5px;">No pages link back here.</span>`;

  // Parse Markdown content and Wiki links
  const parsedWikiContent = wikiService.parseWikiLinks(page.content || '', wikiState.pages);
  const parsedHtml = marked.parse(parsedWikiContent);

  // Tags HTML
  const tagsHtml = page.tags && page.tags.length > 0
    ? page.tags.map(t => `<span class="badge" style="background: hsl(var(--primary) / 0.15); color: hsl(var(--primary)); border: 1px solid hsl(var(--primary) / 0.3); margin-right: 6px; font-size: 12px; padding: 2px 8px; border-radius: var(--radius-sm); font-weight: 600;">#${t}</span>`).join('')
    : '';

  // Revision History logs
  const revsHtml = wikiState.revisions && wikiState.revisions.length > 1
    ? wikiState.revisions.map(r => {
        const dateStr = new Date(r.updated_at).toLocaleString();
        const rollbackBtn = AuthService.isAdmin() 
          ? `<button class="glass-btn rollback-btn" data-rev-no="${r.revision_no}" style="padding: 2px 8px; font-size: 11px; margin-left: 8px;">Revert to this</button>`
          : '';
        return `
          <li style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px dashed hsl(var(--border) / 0.4); padding: 8px 0; font-size: 13.5px;">
            <span>
              <strong>v${r.revision_no}</strong> — ${r.updated_by} 
              <span style="color:hsl(var(--muted-foreground)); margin-left: 8px;">(${dateStr})</span>
            </span>
            ${rollbackBtn}
          </li>
        `;
      }).join('')
    : `<div style="font-size:13px; color:hsl(var(--muted-foreground)); padding: 8px 0;">This is the original revision.</div>`;

  // Dynamic Right Rail Outline ToC
  // Find all h2/h3 elements in page content to display as Outline jumps
  const headings = [];
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  let match;
  while ((match = headingRegex.exec(page.content || '')) !== null) {
    headings.push({
      level: match[1].length, // 2 or 3
      text: match[2].trim()
    });
  }

  const tocHtml = headings.length > 0
    ? headings.map(h => {
        const padding = h.level === 3 ? 'pl-4' : 'pl-0';
        const fontSize = h.level === 3 ? '12px' : '13px';
        const indent = h.level === 3 ? 'margin-left: 12px;' : '';
        return `<div class="${padding}" style="font-size: ${fontSize}; ${indent} margin-bottom: 6px; cursor: pointer; color: hsl(var(--muted-foreground)); font-weight: 500;" class="toc-jump" data-target="${h.text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}">${h.text}</div>`;
      }).join('')
    : `<span style="color: hsl(var(--muted-foreground)); font-size: 13px;">No outline available.</span>`;

  // Build View Container
  mainPanel.innerHTML = `
    <div style="display: flex; gap: 28px; width: 100%; flex-grow:1; align-items: stretch;">
      
      <!-- Main Article Frame -->
      <article style="flex-grow: 1; max-width: calc(100% - 240px); display: flex; flex-direction: column;">
        ${imageHtml}
        
        <!-- Breadcrumbs -->
        <div style="font-size: 11.5px; text-transform: uppercase; letter-spacing: 1px; color: hsl(var(--primary)); font-weight: 700; margin-bottom: 6px;">
          Wiki / ${page.category}
        </div>

        <!-- Page Header -->
        <div style="border-bottom: 1px solid hsl(var(--border) / 0.5); padding-bottom: 12px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;">
          <div>
            <h1 style="font-size: 32px; font-family: var(--font-heading); margin: 0 0 8px 0; color: hsl(var(--foreground)); line-height:1.2;">${page.title}</h1>
            <div style="display: flex; align-items: center; gap: 12px; font-size: 13px; color: hsl(var(--muted-foreground)); font-weight: 500;">
              <span>Revision v${page.revision_no}</span>
              <span>•</span>
              <span>Last edit by <strong>${page.updated_by}</strong></span>
              <span>•</span>
              <span>${new Date(page.updated_at).toLocaleDateString()}</span>
            </div>
            ${tagsHtml ? `<div style="margin-top: 10px; display:flex;">${tagsHtml}</div>` : ''}
          </div>

          <!-- Edit Page Buttons -->
          ${AuthService.isStaff() || AuthService.isAdmin() ? `
            <div style="display:flex; gap: 8px;">
              <button id="wiki-edit-btn" class="glass-btn" style="padding: 8px 16px; font-weight: 600; display:flex; gap:6px; align-items:center;">
                ✏️ Edit Page
              </button>
              ${AuthService.isAdmin() && page.slug !== 'welcome' ? `
                <button id="wiki-delete-btn" class="glass-btn" style="padding: 8px 16px; font-weight: 600; display:flex; gap:6px; align-items:center; background: hsl(var(--danger) / 0.1); color: hsl(var(--danger)); border-color: hsl(var(--danger) / 0.25);">
                  🗑️ Delete
                </button>
              ` : ''}
            </div>
          ` : ''}
        </div>

        <!-- Rendered Content -->
        <div class="markdown-body" style="font-size: 15.5px; line-height: 1.7; color: hsl(var(--foreground)); flex-grow:1;">
          ${parsedHtml}
        </div>

        <!-- Backlinks Section -->
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid hsl(var(--border) / 0.5);">
          <h4 style="margin: 0 0 8px 0; font-family: var(--font-heading); font-size: 15px; color: hsl(var(--muted-foreground)); text-transform: uppercase;">What Links Here</h4>
          <div style="display:flex; flex-wrap:wrap;">
            ${backlinksHtml}
          </div>
        </div>

        <!-- Collapsible Revisions List -->
        <details style="margin-top: 24px; background: hsl(var(--secondary) / 0.15); border: 1px solid hsl(var(--border) / 0.4); border-radius: var(--radius-sm); padding: 12px 16px;">
          <summary style="font-weight: 700; font-size: 14px; color: hsl(var(--foreground)); cursor: pointer; user-select: none;">
            📜 Revision History Log (${wikiState.revisions.length} total)
          </summary>
          <ul style="list-style:none; margin: 12px 0 0 0; padding:0;">
            ${revsHtml}
          </ul>
        </details>

      </article>

      <!-- Right Panel: Outline / Stats -->
      <aside style="width: 200px; flex-shrink: 0; display:flex; flex-direction:column; gap: 24px; border-left: 1px solid hsl(var(--border) / 0.3); padding-left: 24px;">
        
        <!-- Outline Jump -->
        <div>
          <h4 style="margin: 0 0 10px 0; font-family: var(--font-heading); font-size: 14px; text-transform: uppercase; color: hsl(var(--primary)); letter-spacing: 0.5px;">On this Page</h4>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            ${tocHtml}
          </div>
        </div>

        <!-- Stats Card -->
        <div style="background: hsl(var(--secondary) / 0.2); border: 1px solid hsl(var(--border) / 0.3); border-radius: var(--radius-sm); padding: 12px 14px; font-size: 12.5px; display:flex; flex-direction:column; gap: 8px;">
          <div style="font-weight:700; border-bottom:1px solid hsl(var(--border)/0.3); padding-bottom:4px;">📊 ARTICLE STATS</div>
          <div>Words: <strong>${(page.content || '').split(/\s+/).filter(Boolean).length}</strong></div>
          <div>Reading time: <strong>${Math.max(1, Math.ceil(((page.content || '').split(/\s+/).filter(Boolean).length) / 200))} min</strong></div>
          <div>Status: <span style="color: hsl(var(--success)); font-weight:700;">Synced</span></div>
        </div>

      </aside>

    </div>
  `;

  // Bind Intercept Clicks on Wiki Links inside the article
  mainPanel.querySelectorAll('.wiki-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const slug = link.getAttribute('data-slug');
      loadWikiPage(slug);
    });
  });

  mainPanel.querySelectorAll('.wiki-link-unresolved').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTitle = link.getAttribute('data-target');
      enterCreateMode(targetTitle);
    });
  });

  // Bind edit buttons
  const editBtn = document.getElementById('wiki-edit-btn');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      wikiState.viewMode = 'edit';
      renderWikiContent();
    });
  }

  // Bind delete button
  const deleteBtn = document.getElementById('wiki-delete-btn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', async () => {
      if (confirm(`Are you sure you want to delete the wiki page "${page.title}"? This cannot be undone.`)) {
        try {
          await wikiService.deletePage(page.slug);
          wikiState.pages = await wikiService.listPages();
          renderWikiSidebar();
          // Load welcome
          loadWikiPage('welcome');
        } catch (err) {
          alert(`Failed to delete page: ${err.message}`);
        }
      }
    });
  }

  // Bind Rollback buttons
  mainPanel.querySelectorAll('.rollback-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const revNo = parseInt(btn.getAttribute('data-rev-no'));
      const revision = wikiState.revisions.find(r => r.revision_no === revNo);
      if (!revision) return;

      if (confirm(`Are you sure you want to revert this page to revision v${revNo}?`)) {
        try {
          btn.disabled = true;
          btn.textContent = 'Reverting...';
          await wikiService.savePage(
            page.slug,
            page.title,
            revision.content,
            page.category,
            page.tags
          );
          
          showToast(`Page reverted to version v${revNo}! ✅`);
          
          // Re-load
          wikiState.pages = await wikiService.listPages();
          renderWikiSidebar();
          await loadWikiPage(page.slug);
        } catch (err) {
          alert(`Failed to revert: ${err.message}`);
          btn.disabled = false;
          btn.textContent = 'Revert to this';
        }
      }
    });
  });

  // Bind Scroll Jumps for Outline ToC
  mainPanel.querySelectorAll('.toc-jump').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      // Look for a heading inside marked output that has matching text
      const headingsInDoc = mainPanel.querySelectorAll('h2, h3, h4');
      let found = null;
      headingsInDoc.forEach(h => {
        const textSlug = h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        if (textSlug === targetId || h.textContent.trim().toLowerCase().includes(btn.textContent.trim().toLowerCase())) {
          found = h;
        }
      });

      if (found) {
        found.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ── EDIT & CREATE MODES ──────────────────────────────────────────────
function renderWikiEditMode(mainPanel) {
  const isEdit = wikiState.viewMode === 'edit';
  const page = isEdit ? wikiState.currentPage : {
    slug: '',
    title: wikiState.unresolvedTarget || '',
    content: '',
    category: 'General',
    tags: []
  };

  mainPanel.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 20px; width: 100%;">
      
      <div>
        <h2 style="margin: 0 0 6px 0; font-family: var(--font-heading); font-size: 24px; color: hsl(var(--primary));">
          ${isEdit ? `✏️ Edit Wiki Page: "${page.title}"` : `➕ Create New Wiki Page`}
        </h2>
        <p style="margin: 0; font-size: 13px; color: hsl(var(--muted-foreground));">
          Contribute to the Camp Lawton handbook knowledgebase. Please adhere to YPT and camp safety standards.
        </p>
      </div>

      <div style="display: flex; gap: 16px;">
        <!-- Page Title -->
        <div style="flex: 2; display: flex; flex-direction: column; gap: 6px;">
          <label style="font-size: 13.5px; font-weight:600;">Page Title</label>
          <input type="text" id="editor-title" placeholder="e.g., Bear Country Smellables Shed" value="${page.title}" 
            ${isEdit ? 'disabled style="background: hsl(var(--secondary) / 0.15); opacity:0.7; padding: 10px 14px; border: 1px solid hsl(var(--border)); border-radius: var(--radius-sm);"' : 'style="padding: 10px 14px; border: 1px solid hsl(var(--border)); border-radius: var(--radius-sm); background: var(--glass-bg); color: inherit;"'} />
        </div>
        
        <!-- Category Dropdown -->
        <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
          <label style="font-size: 13.5px; font-weight:600;">Category</label>
          <select id="editor-category" style="padding: 10px 14px; border: 1px solid hsl(var(--border)); border-radius: var(--radius-sm); background: var(--glass-bg); color: hsl(var(--foreground));">
            <option value="Culture & Training" ${page.category === 'Culture & Training' ? 'selected' : ''}>Culture & Training</option>
            <option value="Policies & Laws" ${page.category === 'Policies & Laws' ? 'selected' : ''}>Policies & Laws</option>
            <option value="Emergency & Safety" ${page.category === 'Emergency & Safety' ? 'selected' : ''}>Emergency & Safety</option>
            <option value="Songbook & Skits" ${page.category === 'Songbook & Skits' ? 'selected' : ''}>Songbook & Skits</option>
            <option value="General" ${page.category === 'General' ? 'selected' : ''}>General</option>
          </select>
        </div>
      </div>

      <!-- Page Tags -->
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <label style="font-size: 13.5px; font-weight:600;">Tags (comma separated)</label>
        <input type="text" id="editor-tags" placeholder="e.g., safety, wildlife, bearbox" value="${(page.tags || []).join(', ')}" style="padding: 10px 14px; border: 1px solid hsl(var(--border)); border-radius: var(--radius-sm); background: var(--glass-bg); color: inherit;" />
      </div>

      <!-- Markdown Toolbar & Content Editor -->
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <label style="font-size: 13.5px; font-weight:600;">Page Content (Markdown supported)</label>
        
        <div class="wysiwyg-editor-wrapper" style="display: flex; flex-direction: column; border: 1px solid hsl(var(--border)); border-radius: var(--radius-sm); overflow: hidden;">
          <!-- Custom wiki toolbar -->
          <div class="wysiwyg-toolbar" style="display: flex; gap: 8px; background: hsl(var(--secondary) / 0.3); border-bottom: 1px solid hsl(var(--border) / 0.5); padding: 8px 12px; align-items:center;">
            <button type="button" class="toolbar-btn" data-cmd="bold" style="padding: 4px 8px; font-weight: 800; cursor:pointer;">B</button>
            <button type="button" class="toolbar-btn" data-cmd="italic" style="padding: 4px 8px; font-style: italic; cursor:pointer;">I</button>
            <button type="button" class="toolbar-btn" data-cmd="heading" style="padding: 4px 8px; cursor:pointer;">H2</button>
            <button type="button" class="toolbar-btn" data-cmd="heading3" style="padding: 4px 8px; cursor:pointer;">H3</button>
            <button type="button" class="toolbar-btn" data-cmd="list" style="padding: 4px 8px; cursor:pointer;">• List</button>
            <button type="button" class="toolbar-btn" data-cmd="link" style="padding: 4px 8px; text-decoration: underline; cursor:pointer;">Link</button>
            
            <span style="color: hsl(var(--border)); font-weight:300; margin: 0 4px;">|</span>

            <!-- Wiki link helper dropdown -->
            <label style="font-size: 12px; color: hsl(var(--muted-foreground)); font-weight: 500;">Wiki Link Insert:</label>
            <select id="editor-link-helper" style="padding: 2px 6px; font-size: 11.5px; background: var(--glass-bg); color: hsl(var(--foreground)); max-width: 160px; border-radius: var(--radius-sm);">
              <option value="">-- Insert link to page --</option>
              ${wikiState.pages.map(p => `<option value="${p.title}">[[${p.title}]]</option>`).join('')}
            </select>
          </div>

          <textarea id="editor-content" placeholder="Type page content here... Write [[Article Title]] to create wiki connections between pages." style="width: 100%; min-height: 320px; border: none; font-family: monospace; font-size: 14px; padding: 16px; background: var(--glass-bg); color: inherit; line-height: 1.6; outline: none; resize: vertical;">${page.content}</textarea>
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; gap: 12px; margin-top: 10px;">
        <button id="editor-save-btn" class="welcome-banner-btn" style="padding: 12px 24px; font-weight:700;">
          Save wiki page 💾
        </button>
        <button id="editor-cancel-btn" class="glass-btn" style="padding: 12px 24px; font-weight:600; border-color: hsl(var(--border) / 0.5);">
          Cancel
        </button>
      </div>

    </div>
  `;

  // Bind Formatting Toolbar Buttons
  const contentArea = document.getElementById('editor-content');
  const toolbar = mainPanel.querySelector('.wysiwyg-toolbar');
  
  if (toolbar && contentArea) {
    toolbar.querySelectorAll('.toolbar-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cmd = btn.getAttribute('data-cmd');
        const start = contentArea.selectionStart;
        const end = contentArea.selectionEnd;
        const text = contentArea.value;
        const selected = text.substring(start, end);

        let replacement = '';
        if (cmd === 'bold') replacement = `**${selected}**`;
        else if (cmd === 'italic') replacement = `*${selected}*`;
        else if (cmd === 'heading') replacement = `\n## ${selected || 'Header'}\n`;
        else if (cmd === 'heading3') replacement = `\n### ${selected || 'Sub-header'}\n`;
        else if (cmd === 'list') replacement = `\n- ${selected || 'List item'}\n`;
        else if (cmd === 'link') replacement = `[[${selected || 'Wiki Page Title'}]]`;

        contentArea.value = text.substring(0, start) + replacement + text.substring(end);
        contentArea.focus();
        contentArea.setSelectionRange(start + 2, start + 2 + selected.length);
      });
    });
  }

  // Bind Wiki Link Helper Dropdown
  const linkHelper = document.getElementById('editor-link-helper');
  if (linkHelper && contentArea) {
    linkHelper.addEventListener('change', () => {
      const pageTitle = linkHelper.value;
      if (!pageTitle) return;

      const start = contentArea.selectionStart;
      const end = contentArea.selectionEnd;
      const text = contentArea.value;

      const linkSyntax = `[[${pageTitle}]]`;
      contentArea.value = text.substring(0, start) + linkSyntax + text.substring(end);
      
      // Reset dropdown select
      linkHelper.value = '';
      contentArea.focus();
      contentArea.setSelectionRange(start + linkSyntax.length, start + linkSyntax.length);
    });
  }

  // Bind Cancel Button
  document.getElementById('editor-cancel-btn').addEventListener('click', () => {
    if (isEdit) {
      wikiState.viewMode = 'view';
      renderWikiContent();
    } else {
      // Go back to welcome
      loadWikiPage('welcome');
    }
  });

  // Bind Save Button
  const saveBtn = document.getElementById('editor-save-btn');
  saveBtn.addEventListener('click', async () => {
    const title = document.getElementById('editor-title').value.trim();
    const category = document.getElementById('editor-category').value;
    const tagsInput = document.getElementById('editor-tags').value;
    const content = contentArea.value;

    if (!title || !content) {
      alert('Please fill in Title and Content fields.');
      return;
    }

    const slug = isEdit ? page.slug : generateSlug(title);

    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving wiki page... ⏳';

    try {
      await wikiService.savePage(slug, title, content, category, tagsInput);
      showToast('Wiki page successfully saved! 💾');

      // Refresh cache and reload page
      wikiState.pages = await wikiService.listPages();
      renderWikiSidebar();
      await loadWikiPage(slug);
    } catch (err) {
      alert(`Failed to save page: ${err.message}`);
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save wiki page 💾';
    }
  });
}

function enterCreateMode(unresolvedTitle = '') {
  wikiState.viewMode = 'create';
  wikiState.unresolvedTarget = unresolvedTitle;
  renderWikiContent();
}

function toggleGraphView() {
  wikiState.showGraph = !wikiState.showGraph;
  renderWikiContent();
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; bottom: 80px; left: 50%; transform: translate(-50%, 20px);
    background: hsl(var(--success)); color: white; padding: 10px 20px;
    border-radius: var(--radius-sm); font-weight: 700; z-index: 10000;
    opacity: 0; transition: all 0.3s ease; box-shadow: var(--shadow-md);
    font-size: 13.5px; font-family: var(--font-body);
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translate(-50%, 0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, 20px)';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
