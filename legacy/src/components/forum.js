/**
 * Camp Operational Communications Board (Staff Forum)
 * Strictly structured operational board for coordination and planning.
 * Enforces safeguarding, YPT values, and role-based category gating.
 */
import { state, navigateTo } from '../main.js';
import { api } from '../services/apiClient.js';
import { AuthService } from '../services/auth.js';

let loadedPosts = [];
let activePostId = null; // null for list, UUID for thread details
let isCreatingPost = false;
let selectedCategoryFilter = ''; // Empty string for 'All Categories'

const FORUM_CATEGORIES = [
  { id: 'Questions for Leadership', label: '❓ Questions for Leadership', desc: 'Ask directors and leaders about operations.', staffWrite: true, adultOnly: false, directorOnly: false },
  { id: 'Staff Week Prep', label: '⛺ Staff Week Prep', desc: 'Coordination for setup and staff training week.', staffWrite: true, adultOnly: false, directorOnly: false },
  { id: 'Onboarding Help', label: '📋 Onboarding Help', desc: 'Questions about forms, health records, or contracts.', staffWrite: true, adultOnly: false, directorOnly: false },
  { id: 'Gear and Packing', label: '🎒 Gear & Packing', desc: 'Gear advice, trading resources, or packing list queries.', staffWrite: true, adultOnly: false, directorOnly: false },
  { id: 'Program Area Planning', label: '🏹 Program Area Planning', desc: 'Coordinate lesson plans and program schedules.', staffWrite: true, adultOnly: false, directorOnly: false },
  { id: 'Handbook Questions', label: '📖 Handbook Questions', desc: 'Discuss policies, rules, and procedures.', staffWrite: true, adultOnly: false, directorOnly: false },
  { id: 'Songbook and Campfire Ideas', label: '🔥 Campfire & Songs', desc: 'Plan campfire programs, skits, and songs.', staffWrite: true, adultOnly: false, directorOnly: false },
  { id: 'Training Games and Challenges', label: '🎲 Training Games', desc: 'Share team-building exercises and games.', staffWrite: true, adultOnly: false, directorOnly: false },
  { id: 'IT Help', label: '💻 IT Support', desc: 'Issues with the portal, wifi, or local devices.', staffWrite: true, adultOnly: false, directorOnly: false },
  { id: 'Announcements', label: '📢 Announcements', desc: 'Important operational bulletins. Read-only for general staff.', staffWrite: false, adultOnly: false, directorOnly: false },
  { id: 'Adult/Admin-only', label: '🔒 Adult Staff Room', desc: 'Restricted to adult staff (18+) for coordinator planning.', staffWrite: true, adultOnly: true, directorOnly: false },
  { id: 'Director/Admin-only', label: '👑 leadership Chamber', desc: 'Restricted to Camp/Program Directors & Admins.', staffWrite: false, adultOnly: false, directorOnly: true }
];

// Helper to check category authorization
function isAuthorizedForCategory(catId) {
  const cat = FORUM_CATEGORIES.find(c => c.id === catId);
  if (!cat) return false;

  const user = AuthService.getCurrentUser();
  const isAdmin = AuthService.isAdmin();
  
  if (cat.directorOnly && !isAdmin) {
    return false;
  }
  
  if (cat.adultOnly) {
    const isCIT = user?.role === 'CIT';
    if (isCIT) return false;
  }

  return true;
}

function parseCategoryAndTitle(rawTitle) {
  const match = rawTitle.match(/^\[(.*?)\] (.*)$/);
  if (match) {
    return { category: match[1], title: match[2] };
  }
  return { category: 'Questions for Leadership', title: rawTitle }; // Fallback
}

export function renderForum() {
  const isUserAdmin = AuthService.isAdmin();
  const currentUser = AuthService.getCurrentUser();
  const isCIT = currentUser?.role === 'CIT';

  // Safeguarding banner
  const safeguardingHtml = `
    <div class="forum-rules-banner" style="background: hsl(var(--secondary) / 0.15); border: 1.5px solid var(--accent); padding: 20px; border-radius: var(--radius-sm); margin-bottom: 24px;">
      <h3 style="color: hsl(var(--primary)); font-size: 16px; margin: 0 0 8px 0; display: flex; align-items: center; gap: 8px; font-family: var(--font-heading);">
        <span>🛡️</span> Digital Safeguarding & Operational Conduct
      </h3>
      <p style="font-size: 13px; line-height: 1.5; margin: 0; color: hsl(var(--muted-foreground));">
        Youth Protection Policies (YPT) apply strictly. This board is for operational camp business only:
      </p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; margin-top: 12px; font-size: 12.5px;">
        <div style="background: hsl(var(--background) / 0.4); padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border) / 0.3);">
          🚫 <strong>No 1-on-1 Chats:</strong> Direct messaging is disabled. All communications must remain visible to the community and admins.
        </div>
        <div style="background: hsl(var(--background) / 0.4); padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border) / 0.3);">
          📝 <strong>Identity Verified:</strong> Anonymous posts are disabled. Every post is linked to your official staff profile.
        </div>
        <div style="background: hsl(var(--background) / 0.4); padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border) / 0.3);">
          💾 <strong>Logged Moderation:</strong> All moderation actions, deletions, and edits are archived in the audit logs.
        </div>
      </div>
    </div>
  `;

  if (activePostId) {
    return `
      <div class="forum-container">
        ${safeguardingHtml}
        <div id="forum-thread-mount">Loading thread discussion...</div>
      </div>
    `;
  }

  // Filter categories down to only authorized ones for display
  const visibleCategories = FORUM_CATEGORIES.filter(cat => isAuthorizedForCategory(cat.id));

  const categoryOptionsHtml = visibleCategories
    .map(c => `
      <button class="forum-category-filter-btn ${selectedCategoryFilter === c.id ? 'active' : ''}" 
              data-cat-id="${c.id}" 
              style="width: 100%; text-align: left; padding: 10px 12px; border-radius: var(--radius-sm); border: none; background: ${selectedCategoryFilter === c.id ? 'hsl(var(--primary))' : 'transparent'}; color: ${selectedCategoryFilter === c.id ? 'white' : 'inherit'}; font-weight: ${selectedCategoryFilter === c.id ? '700' : '500'}; font-size: 13.5px; cursor: pointer; display: flex; flex-direction: column; gap: 2px;">
        <span>${c.label}</span>
        <span style="font-size: 10.5px; opacity: 0.8; font-weight: normal;">${c.desc}</span>
      </button>
    `).join('');

  return `
    <div class="forum-container">
      ${safeguardingHtml}

      <div class="forum-posts-grid" style="display: grid; grid-template-columns: 240px 1fr; gap: 24px;">
        
        <!-- Left: Category List -->
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <h4 style="color: hsl(var(--primary)); margin: 0; font-size: 16px; font-family: var(--font-heading);">Categories</h4>
          
          <button class="forum-category-filter-btn ${selectedCategoryFilter === '' ? 'active' : ''}" 
                  data-cat-id="" 
                  style="width: 100%; text-align: left; padding: 10px 12px; border-radius: var(--radius-sm); border: none; background: ${selectedCategoryFilter === '' ? 'hsl(var(--primary))' : 'transparent'}; color: ${selectedCategoryFilter === '' ? 'white' : 'inherit'}; font-weight: 700; font-size: 13.5px; cursor: pointer;">
            🗂️ All Categories
          </button>
          
          <div style="display: flex; flex-direction: column; gap: 6px; border-top: 1px solid hsl(var(--border) / 0.4); padding-top: 10px;">
            ${categoryOptionsHtml}
          </div>
        </div>

        <!-- Right: Posts List & Creator -->
        <div class="forum-main-flow" style="display: flex; flex-direction: column; gap: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="font-size: 20px; color: hsl(var(--primary)); font-family: var(--font-heading); margin: 0;">
              ${selectedCategoryFilter ? FORUM_CATEGORIES.find(c => c.id === selectedCategoryFilter).label : 'Operational Boards'}
            </h3>
            <button class="welcome-banner-btn" id="forum-new-post-btn" style="font-size: 13.5px; padding: 6px 14px; font-weight: 700;">
              ${isCreatingPost ? '✕ Cancel' : '➕ Create Post'}
            </button>
          </div>

          <div id="forum-creator-mount"></div>
          
          <div id="forum-list-mount" style="display: flex; flex-direction: column; gap: 16px;">
            Loading operational boards...
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initForum() {
  if (activePostId) {
    initThreadView();
    return;
  }

  const newPostBtn = document.getElementById('forum-new-post-btn');
  if (newPostBtn) {
    newPostBtn.addEventListener('click', () => {
      isCreatingPost = !isCreatingPost;
      newPostBtn.innerHTML = isCreatingPost ? '✕ Cancel' : '➕ Create Post';
      renderPostCreator();
    });
  }

  // Bind category filters
  const filterBtns = document.querySelectorAll('.forum-category-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedCategoryFilter = btn.getAttribute('data-cat-id') || '';
      
      // Re-render
      const viewMount = document.getElementById('view-mount-point');
      if (viewMount) {
        viewMount.innerHTML = renderForum();
        initForum();
      }
    });
  });

  loadPostsList();
}

function renderPostCreator() {
  const mount = document.getElementById('forum-creator-mount');
  if (!mount) return;

  if (!isCreatingPost) {
    mount.innerHTML = '';
    return;
  }

  // Categories the current user is allowed to write to
  const visibleCategories = FORUM_CATEGORIES.filter(cat => {
    const user = AuthService.getCurrentUser();
    const isAdmin = AuthService.isAdmin();
    
    // Check write rules
    if (!cat.staffWrite && !isAdmin) return false;
    // Check category gate
    return isAuthorizedForCategory(cat.id);
  });

  const catOptions = visibleCategories.map(c => 
    `<option value="${c.id}" ${selectedCategoryFilter === c.id ? 'selected' : ''}>${c.label}</option>`
  ).join('');

  mount.innerHTML = `
    <div class="glass-panel" style="margin-bottom: 20px; display: flex; flex-direction: column; gap: 16px; animation: tabFadeIn 0.3s; padding: 24px;">
      <h4 style="color: hsl(var(--primary)); margin: 0; font-size: 16px; font-family: var(--font-heading);">Create Operational Thread</h4>
      
      <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 16px;">
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <label for="post-title" style="font-size: 13px; font-weight: 600;">Thread Title *</label>
          <input type="text" id="post-title" placeholder="e.g. Campsite 3 latrine latch is broken" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: inherit;" />
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <label for="post-category" style="font-size: 13px; font-weight: 600;">Operational Board *</label>
          <select id="post-category" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: hsl(var(--foreground));">
            <option value="">Select board category...</option>
            ${catOptions}
          </select>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 6px;">
        <label for="post-content" style="font-size: 13px; font-weight: 600;">Thread Details *</label>
        <textarea id="post-content" placeholder="Share operational details, safety hazards, questions or plans..." style="min-height: 100px; padding: 12px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: inherit; line-height: 1.5; outline: none;"></textarea>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center;">
        <button class="welcome-banner-btn" id="post-submit-btn" style="padding: 10px 20px; font-weight:700;">Publish Thread 🚀</button>
        <span style="font-size:11px; color:hsl(var(--muted-foreground)); font-style:italic;">⚠️ Logged under ID: @${AuthService.getCurrentUser()?.username}</span>
      </div>
    </div>
  `;

  const submitBtn = document.getElementById('post-submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      const title = document.getElementById('post-title').value.trim();
      const category = document.getElementById('post-category').value;
      const content = document.getElementById('post-content').value.trim();

      if (!title || !category || !content) {
        alert('Please fill out Title, Category Board, and Details.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Publishing... ⏳';

      // Prefix the title with the category name: [Category] Title
      const prefixedTitle = `[${category}] ${title}`;

      try {
        await api.forum.createPost(prefixedTitle, content);
        isCreatingPost = false;
        
        // Match sidebar filter to newly created post's category
        selectedCategoryFilter = category;

        // Re-render
        const viewMount = document.getElementById('view-mount-point');
        if (viewMount) {
          viewMount.innerHTML = renderForum();
          initForum();
        }
      } catch (err) {
        alert(`Failed to publish: ${err.message}`);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Publish Thread 🚀';
      }
    });
  }
}

async function loadPostsList() {
  const mount = document.getElementById('forum-list-mount');
  if (!mount) return;

  try {
    const data = await api.forum.listPosts();
    loadedPosts = data.posts || [];

    // Parse categories from title and filter out unauthorized items
    const parsedPosts = loadedPosts.map(post => {
      const parsed = parseCategoryAndTitle(post.title);
      return {
        ...post,
        category: parsed.category,
        displayTitle: parsed.title
      };
    }).filter(post => {
      // Gate access
      if (!isAuthorizedForCategory(post.category)) return false;
      
      // Sidebar category filter matching
      if (selectedCategoryFilter && post.category !== selectedCategoryFilter) return false;
      
      return true;
    });

    if (parsedPosts.length === 0) {
      mount.innerHTML = `
        <div style="text-align: center; color: hsl(var(--muted-foreground)); padding: 40px; font-style: italic; background: hsl(var(--secondary) / 0.1); border-radius: var(--radius-sm); border: 1px dashed hsl(var(--border) / 0.4);">
          No active discussions in this board category. 📡
        </div>
      `;
      return;
    }

    mount.innerHTML = parsedPosts.map(post => {
      const dateStr = new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      const isOwner = post.user_id === AuthService.getCurrentUser()?.id;
      const isAdmin = AuthService.isAdmin();
      const catObj = FORUM_CATEGORIES.find(c => c.id === post.category);
      const catLabel = catObj ? catObj.label : post.category;

      return `
        <div class="glass-panel forum-post-card" data-post-id="${post.id}" style="cursor: pointer; display: flex; flex-direction: column; gap: 10px; padding: 18px; position:relative;">
          <div class="forum-post-header" style="display:flex; justify-content:space-between; align-items:center; font-size:12.5px;">
            <div class="forum-post-meta" style="display:flex; align-items:center; gap:8px;">
              <span style="font-weight: 700; background: hsl(var(--secondary)); padding: 2px 6px; border-radius: 4px; font-size: 11px;">${catLabel}</span>
              <span class="forum-user-badge" style="color: hsl(var(--primary)); font-weight:700;">@${post.username}</span>
              <span style="color: hsl(var(--muted-foreground));">${dateStr}</span>
            </div>
            ${(isOwner || isAdmin) ? `
              <button class="forum-action-btn delete forum-delete-post-btn" data-post-id="${post.id}" style="border: none; background: none; font-size: 12px; cursor: pointer; color: hsl(var(--danger)); font-weight:600;">
                🗑️ Delete Thread
              </button>
            ` : ''}
          </div>
          <h4 class="forum-post-title" style="margin: 0; color: hsl(var(--foreground)); font-size: 16px; font-family: var(--font-heading);">${escapeHtml(post.displayTitle)}</h4>
          <div class="forum-post-body" style="font-size: 13.5px; color: hsl(var(--muted-foreground)); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${escapeHtml(post.content)}</div>
          <div class="forum-post-footer" style="display:flex; justify-content:space-between; align-items:center; border-top: 1px solid hsl(var(--border) / 0.3); padding-top: 8px; font-size: 12px;">
            <span style="color: hsl(var(--muted-foreground)); font-weight: 600;">
              💬 ${post.commentCount || 0} Comments
            </span>
            <span style="font-size: 12px; color: hsl(var(--primary)); font-weight: 700; display:flex; align-items:center; gap:4px;">Read Coordination Thread ➔</span>
          </div>
        </div>
      `;
    }).join('');

    // Bind thread click
    mount.querySelectorAll('.forum-post-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.forum-delete-post-btn')) return;
        
        const id = card.getAttribute('data-post-id');
        activePostId = id;
        
        const viewMount = document.getElementById('view-mount-point');
        if (viewMount) {
          viewMount.innerHTML = renderForum();
          initForum();
        }
      });
    });

    // Bind delete clicks
    mount.querySelectorAll('.forum-delete-post-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-post-id');
        if (confirm('Delete this coordination thread? This deletes all replies. Moderation deletion events are archived.')) {
          try {
            await api.forum.deletePost(id);
            loadPostsList();
          } catch (err) {
            alert(`Error deleting post: ${err.message}`);
          }
        }
      });
    });

  } catch (err) {
    console.error(err);
    mount.innerHTML = `
      <div style="color: hsl(var(--danger)); border: 1px dashed hsl(var(--danger)); padding: 20px; border-radius: var(--radius-sm); text-align: center; font-weight: 600;">
        ⚠️ Failed to load board discussions. Connection offline.
      </div>
    `;
  }
}

async function initThreadView() {
  const mount = document.getElementById('forum-thread-mount');
  if (!mount) return;

  try {
    const data = await api.forum.getPost(activePostId);
    const post = data.post;
    const comments = data.comments || [];

    const parsed = parseCategoryAndTitle(post.title);
    const catObj = FORUM_CATEGORIES.find(c => c.id === parsed.category);
    const catLabel = catObj ? catObj.label : parsed.category;

    const dateStr = new Date(post.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    mount.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <!-- Back Navigation -->
        <button class="glass-btn" id="forum-back-btn" style="align-self: flex-start; font-size: 13px; padding: 8px 16px; font-weight: 600; display:flex; align-items:center; gap:6px;">
          ⬅ Back to Category Boards
        </button>

        <!-- Original Post Card -->
        <div class="glass-panel" style="padding: 24px;">
          <div class="forum-post-meta" style="margin-bottom: 12px; display:flex; align-items:center; gap:8px; font-size:12.5px;">
            <span style="font-weight: 700; background: hsl(var(--secondary)); padding: 2px 6px; border-radius: 4px; font-size: 11px;">${catLabel}</span>
            <span class="forum-user-badge" style="font-weight: 700; color: hsl(var(--primary));">@${post.username}</span>
            <span style="color: hsl(var(--muted-foreground));">${dateStr}</span>
          </div>
          <h2 style="font-size: 22px; color: hsl(var(--foreground)); font-family: var(--font-heading); margin: 0 0 14px 0;">${escapeHtml(parsed.title)}</h2>
          <div class="forum-post-body" style="font-size: 14.5px; line-height: 1.6; white-space: pre-line; color: hsl(var(--foreground));">${escapeHtml(post.content)}</div>
        </div>

        <!-- Comments Section -->
        <div class="forum-comments-container" style="background: hsl(var(--secondary) / 0.1); border-radius: var(--radius-sm); padding: 20px;">
          <h3 style="font-size: 16px; color: hsl(var(--primary)); font-family: var(--font-heading); margin-top: 0; margin-bottom: 16px;">Replies (${comments.length})</h3>
          
          <div id="forum-comments-list" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
            ${comments.length === 0 ? `
              <div style="color: hsl(var(--muted-foreground)); font-style: italic; font-size: 13.5px; padding: 10px 0;">
                No replies on this coordination thread yet. Speak up!
              </div>
            ` : comments.map(comment => {
              const commDate = new Date(comment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
              const isCommentOwner = comment.user_id === AuthService.getCurrentUser()?.id;
              const isAdmin = AuthService.isAdmin();

              return `
                <div class="glass-panel" style="background: hsl(var(--background) / 0.6); padding: 12px 16px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border) / 0.3); display: flex; flex-direction: column; gap: 6px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
                    <div class="forum-post-meta" style="display:flex; align-items:center; gap:6px;">
                      <span class="forum-user-badge" style="background: hsl(var(--muted) / 0.5); padding: 2px 6px; border-radius: 4px; font-weight:700;">@${comment.username}</span>
                      <span style="color: hsl(var(--muted-foreground));">${commDate}</span>
                    </div>
                    ${(isCommentOwner || isAdmin) ? `
                      <button class="forum-action-btn delete comment-delete-btn" data-comment-id="${comment.id}" style="border: none; background: none; font-size: 11px; cursor: pointer; color: hsl(var(--danger)); font-weight:600;">
                        🗑️ Delete Reply
                      </button>
                    ` : ''}
                  </div>
                  <div style="font-size: 13.5px; line-height: 1.4; color: hsl(var(--foreground)); white-space: pre-line;">${escapeHtml(comment.content)}</div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Add Comment Form -->
          <div class="glass-panel" style="display: flex; flex-direction: column; gap: 10px; padding: 18px; background: hsl(var(--background) / 0.5);">
            <label for="new-comment-input" style="font-weight: 600; font-size: 13px;">Add reply to thread</label>
            <textarea id="new-comment-input" placeholder="Type your reply, coordination feedback, or questions..." style="min-height: 60px; padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: inherit; font-size: 14px; line-height: 1.4; outline: none;"></textarea>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <button class="welcome-banner-btn" id="comment-submit-btn" style="padding: 8px 16px; font-size: 13px; font-weight:700;">Post Reply 💬</button>
              <span style="font-size:11px; color:hsl(var(--muted-foreground)); font-style:italic;">🔒 Replying as @${AuthService.getCurrentUser()?.username}</span>
            </div>
          </div>
        </div>

      </div>
    `;

    // Bind back button
    document.getElementById('forum-back-btn').addEventListener('click', () => {
      activePostId = null;
      const viewMount = document.getElementById('view-mount-point');
      if (viewMount) {
        viewMount.innerHTML = renderForum();
        initForum();
      }
    });

    // Bind comment submit button
    const submitCommentBtn = document.getElementById('comment-submit-btn');
    if (submitCommentBtn) {
      submitCommentBtn.addEventListener('click', async () => {
        const commentInput = document.getElementById('new-comment-input');
        const content = commentInput.value.trim();

        if (!content) {
          alert('Reply content cannot be empty.');
          return;
        }

        submitCommentBtn.disabled = true;
        submitCommentBtn.textContent = 'Posting...';

        try {
          await api.forum.createComment(activePostId, content);
          initThreadView();
        } catch (err) {
          alert(`Failed to post reply: ${err.message}`);
          submitCommentBtn.disabled = false;
          submitCommentBtn.textContent = 'Post Reply 💬';
        }
      });
    }

    // Bind comment delete buttons
    mount.querySelectorAll('.comment-delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-comment-id');
        if (confirm('Delete this reply? Moderation deletion events are archived.')) {
          try {
            await api.forum.deleteComment(id);
            initThreadView();
          } catch (err) {
            alert(`Error deleting comment: ${err.message}`);
          }
        }
      });
    });

  } catch (err) {
    console.error(err);
    mount.innerHTML = `
      <div style="color: hsl(var(--danger)); font-weight: 600; text-align: center; padding: 24px;">
        ⚠️ Failed to load thread details. Connection offline.
      </div>
    `;
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
