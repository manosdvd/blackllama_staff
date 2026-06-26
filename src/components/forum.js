/**
 * Camp Discussion Board (Reddit-style Forum)
 * Allows staff and admins to discuss camp updates, plan events, and chat.
 * Prominently features YPT & Scouting values.
 */
import { state, navigateTo } from '../main.js';
import { api } from '../services/apiClient.js';
import { AuthService } from '../services/auth.js';

let loadedPosts = [];
let activePostId = null; // null for list, UUID for thread details
let isCreatingPost = false;

export function renderForum() {
  const isUserAdmin = AuthService.isAdmin();
  
  // Safeguarding banner
  const safeguardingHtml = `
    <div class="forum-rules-banner">
      <h3 style="color: hsl(var(--primary)); font-size: 16px; display: flex; align-items: center; gap: 8px;">
        <span>🛡️</span> Digital Safeguarding & Scouting Values
      </h3>
      <p style="font-size: 13.5px; line-height: 1.5; margin: 0;">
        Youth Protection Policies (YPT) apply to all digital interactions. Staff must maintain professional boundaries:
      </p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 8px;">
        <div class="forum-rule-item">
          🤝 <strong>No 1-on-1 Chats:</strong> Private online messages between adults and youth are strictly prohibited. Keep all communication public.
        </div>
        <div class="forum-rule-item">
          ⚜️ <strong>Living the Scout Law:</strong> Be trustworthy, loyal, helpful, friendly, courteous, kind, obedient, cheerful, thrifty, brave, clean, and reverent.
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

  return `
    <div class="forum-container">
      ${safeguardingHtml}

      <div class="forum-posts-grid">
        <!-- Main flow -->
        <div class="forum-main-flow">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <h3 style="font-size: 20px; color: hsl(var(--primary));">General Discussions</h3>
            <button class="welcome-banner-btn" id="forum-new-post-btn" style="font-size: 13.5px; padding: 6px 14px;">
              ${isCreatingPost ? '✕ Cancel' : '➕ Create Post'}
            </button>
          </div>

          <div id="forum-creator-mount"></div>
          <div id="forum-list-mount" style="display: flex; flex-direction: column; gap: 16px;">
            Loading general discussions...
          </div>
        </div>

        <!-- Sidebar / Guidelines details -->
        <div class="forum-sidebar" style="display: flex; flex-direction: column; gap: 20px;">
          <div class="glass-panel" style="padding: 20px;">
            <h4 style="color: hsl(var(--primary)); margin-top: 0; margin-bottom: 8px; font-size: 16px;">🌲 Board Guidelines</h4>
            <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.5; display: flex; flex-direction: column; gap: 6px;">
              <li>Use this forum to coordinate campfire skits, schedule events, and ask questions.</li>
              <li>Always check weather updates and NWS warnings before scheduling outdoor events.</li>
              <li>Do not post personal contact information of CITs or minors.</li>
              <li>Flag inappropriate content to Camp Directors immediately.</li>
            </ul>
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

  loadPostsList();
}

function renderPostCreator() {
  const mount = document.getElementById('forum-creator-mount');
  if (!mount) return;

  if (!isCreatingPost) {
    mount.innerHTML = '';
    return;
  }

  mount.innerHTML = `
    <div class="glass-panel" style="margin-bottom: 20px; display: flex; flex-direction: column; gap: 16px; animation: tabFadeIn 0.3s;">
      <h4 style="color: hsl(var(--primary)); margin: 0; font-size: 16px;">Create Discussion Thread</h4>
      
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <label for="post-title" style="font-size: 13px; font-weight: 600;">Thread Title</label>
        <input type="text" id="post-title" placeholder="e.g. Ideas for the opening campfire skit next Sunday" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: inherit;" />
      </div>

      <div style="display: flex; flex-direction: column; gap: 6px;">
        <label for="post-content" style="font-size: 13px; font-weight: 600;">Thread Details</label>
        <textarea id="post-content" placeholder="Share your plans, skits, or coordinating details..." style="min-height: 120px; padding: 12px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: inherit; line-height: 1.5; outline: none;"></textarea>
      </div>

      <button class="welcome-banner-btn" id="post-submit-btn" style="align-self: flex-start;">Publish Thread 🚀</button>
    </div>
  `;

  const submitBtn = document.getElementById('post-submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      const title = document.getElementById('post-title').value.trim();
      const content = document.getElementById('post-content').value.trim();

      if (!title || !content) {
        alert('Please fill out both Title and Details.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Publishing... ⏳';

      try {
        await api.forum.createPost(title, content);
        isCreatingPost = false;
        const newPostBtn = document.getElementById('forum-new-post-btn');
        if (newPostBtn) newPostBtn.innerHTML = '➕ Create Post';
        renderPostCreator();
        loadPostsList();
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

    if (loadedPosts.length === 0) {
      mount.innerHTML = `
        <div style="text-align: center; color: hsl(var(--muted-foreground)); padding: 40px; font-style: italic;">
          No active discussions. Be the first to start a thread! 💬
        </div>
      `;
      return;
    }

    mount.innerHTML = loadedPosts.map(post => {
      const dateStr = new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      const isOwner = post.user_id === AuthService.getCurrentUser()?.id;
      const isAdmin = AuthService.isAdmin();

      return `
        <div class="glass-panel forum-post-card" data-post-id="${post.id}">
          <div class="forum-post-header">
            <div class="forum-post-meta">
              <span class="forum-user-badge">@${post.username}</span>
              <span>•</span>
              <span>${dateStr}</span>
            </div>
            ${(isOwner || isAdmin) ? `
              <button class="forum-action-btn delete forum-delete-post-btn" data-post-id="${post.id}" style="border: none; background: none; font-size: 12px; cursor: pointer;">
                🗑️ Delete
              </button>
            ` : ''}
          </div>
          <h4 class="forum-post-title">${escapeHtml(post.title)}</h4>
          <div class="forum-post-body">${escapeHtml(post.content)}</div>
          <div class="forum-post-footer">
            <span class="forum-action-btn">
              💬 ${post.commentCount || 0} Comments
            </span>
            <span style="font-size: 12px; color: hsl(var(--primary)); font-weight: 700;">Open Thread ➔</span>
          </div>
        </div>
      `;
    }).join('');

    // Bind thread click
    mount.querySelectorAll('.forum-post-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Prevent trigger if they click the delete button
        if (e.target.closest('.forum-delete-post-btn')) return;
        
        const id = card.getAttribute('data-post-id');
        activePostId = id;
        
        // Reload forum view to display thread details
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
        if (confirm('Are you sure you want to delete this thread? All comments inside will be lost.')) {
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

// ── 6. SINGLE THREAD VIEW FUNCTIONS ───────────────────────────────────────
async function initThreadView() {
  const mount = document.getElementById('forum-thread-mount');
  if (!mount) return;

  try {
    const data = await api.forum.getPost(activePostId);
    const post = data.post;
    const comments = data.comments || [];

    const dateStr = new Date(post.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    mount.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <!-- Back Navigation -->
        <button class="welcome-banner-btn" id="forum-back-btn" style="align-self: flex-start; background: hsl(var(--secondary)); color: hsl(var(--foreground)); border: 1px solid hsl(var(--border)); font-size: 13.5px; padding: 6px 14px;">
          ⬅ Back to Forum
        </button>

        <!-- Original Post Card -->
        <div class="glass-panel forum-post-card-details">
          <div class="forum-post-meta" style="margin-bottom: 10px;">
            <span class="forum-user-badge">@${post.username}</span>
            <span>•</span>
            <span>${dateStr}</span>
          </div>
          <h2 style="font-size: 22px; color: hsl(var(--primary)); font-family: var(--font-heading); margin: 0 0 12px 0;">${escapeHtml(post.title)}</h2>
          <div class="forum-post-body" style="font-size: 15px; line-height: 1.6; white-space: pre-line;">${escapeHtml(post.content)}</div>
        </div>

        <!-- Comments Section -->
        <div class="forum-comments-container">
          <h3 style="font-size: 18px; color: hsl(var(--primary)); margin-bottom: 12px;">Comments (${comments.length})</h3>
          
          <div id="forum-comments-list" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
            ${comments.length === 0 ? `
              <div style="color: hsl(var(--muted-foreground)); font-style: italic; font-size: 14px; padding: 10px 0;">
                No comments on this thread yet. Realize the Scout Law! Speak up!
              </div>
            ` : comments.map(comment => {
              const commDate = new Date(comment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
              const isCommentOwner = comment.user_id === AuthService.getCurrentUser()?.id;
              const isAdmin = AuthService.isAdmin();

              return `
                <div class="forum-comment-card">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div class="forum-post-meta">
                      <span class="forum-user-badge" style="background: hsl(var(--muted)); color: inherit;">@${comment.username}</span>
                      <span>${commDate}</span>
                    </div>
                    ${(isCommentOwner || isAdmin) ? `
                      <button class="forum-action-btn delete comment-delete-btn" data-comment-id="${comment.id}" style="border: none; background: none; font-size: 11px; cursor: pointer;">
                        🗑️ Delete
                      </button>
                    ` : ''}
                  </div>
                  <div style="font-size: 14px; line-height: 1.4; color: hsl(var(--foreground));">${escapeHtml(comment.content)}</div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Add Comment Form -->
          <div class="glass-panel" style="display: flex; flex-direction: column; gap: 10px; padding: 18px;">
            <label for="new-comment-input" style="font-weight: 600; font-size: 13.5px;">Add to discussion</label>
            <textarea id="new-comment-input" placeholder="Type your comment, skit ideas, or feedback..." style="min-height: 60px; padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: inherit; font-size: 14px; line-height: 1.4; outline: none;"></textarea>
            <button class="welcome-banner-btn" id="comment-submit-btn" style="align-self: flex-start; padding: 8px 16px; font-size: 13px;">Add Comment 💬</button>
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
          alert('Comment content cannot be empty.');
          return;
        }

        submitCommentBtn.disabled = true;
        submitCommentBtn.textContent = 'Posting...';

        try {
          await api.forum.createComment(activePostId, content);
          // Reload thread view
          initThreadView();
        } catch (err) {
          alert(`Failed to post comment: ${err.message}`);
          submitCommentBtn.disabled = false;
          submitCommentBtn.textContent = 'Add Comment 💬';
        }
      });
    }

    // Bind comment delete buttons
    mount.querySelectorAll('.comment-delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-comment-id');
        if (confirm('Are you sure you want to delete this comment?')) {
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
