/**
 * WYSIWYG Inline Editor for Camp Lawton Portal.
 * Wraps content sections in editable divs for admins and handles saving edits to Supabase.
 */
import { state } from '../main.js';
import { api } from '../services/apiClient.js';
import { AuthService } from '../services/auth.js';

// Cache to hold unsaved edits if needed
const editStates = {};

/**
 * Returns either the custom database content for a key, or the default fallback content.
 */
export function getContent(key, defaultContent) {
  if (state.siteContent && state.siteContent[key]) {
    return state.siteContent[key];
  }
  return defaultContent;
}

/**
 * Wraps HTML content with admin inline edit controls.
 */
export function wrapEditable(key, contentHtml) {
  if (!AuthService.isAdmin()) {
    return `<div id="editable-block-${key}">${contentHtml}</div>`;
  }

  return `
    <div class="editable-block-container" id="editable-container-${key}" style="position: relative; border: 1px dashed transparent; transition: border-color 0.2s;">
      <button class="welcome-banner-btn inline-edit-btn" data-editor-key="${key}" style="position: absolute; top: 10px; right: 10px; z-index: 100; padding: 4px 10px; font-size: 12px; background: hsl(var(--primary)); color: white; display: flex; align-items: center; gap: 6px;">
        <span>✏️</span> Edit Section
      </button>
      <div id="editable-block-${key}" style="padding-top: 10px;">
        ${contentHtml}
      </div>
    </div>
  `;
}

/**
 * Attaches click listeners to edit buttons and manages inline editing state.
 */
export function initEditable(key, defaultContent, onSaveCallback = null) {
  if (!AuthService.isAdmin()) return;

  const container = document.getElementById(`editable-container-${key}`);
  const block = document.getElementById(`editable-block-${key}`);
  const editBtn = container?.querySelector('.inline-edit-btn');

  if (!container || !block || !editBtn) return;

  editBtn.addEventListener('click', () => {
    const isEditing = editStates[key] || false;

    if (!isEditing) {
      // Enter Edit Mode
      editStates[key] = true;
      editBtn.innerHTML = '<span>✕</span> Cancel';
      editBtn.style.background = 'hsl(var(--danger))';

      // Capture current HTML
      const currentHtml = block.innerHTML.trim();

      // Replace block with Editor interface
      block.innerHTML = `
        <div class="wysiwyg-editor-wrapper">
          <div class="wysiwyg-toolbar" id="wysiwyg-toolbar-${key}">
            <button type="button" data-cmd="bold" title="Bold">B</button>
            <button type="button" data-cmd="italic" title="Italic">I</button>
            <button type="button" data-cmd="heading" title="Header">H3</button>
            <button type="button" data-cmd="list" title="Bullet List">List</button>
            <button type="button" data-cmd="reset" style="background: hsl(var(--danger) / 0.1); color: hsl(var(--danger)); margin-left: auto;">Reset to Default</button>
          </div>
          <textarea id="wysiwyg-textarea-${key}" class="wysiwyg-content" style="width: 100%; min-height: 280px; font-family: monospace; font-size: 13.5px; padding: 12px; border-radius: var(--radius-sm); outline: none; border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: inherit; line-height: 1.5;">${currentHtml}</textarea>
          <button class="welcome-banner-btn" id="wysiwyg-save-${key}" style="align-self: flex-start; padding: 10px 20px;">Save Page Edits 💾</button>
        </div>
      `;

      const textarea = document.getElementById(`wysiwyg-textarea-${key}`);
      const saveBtn = document.getElementById(`wysiwyg-save-${key}`);
      const toolbar = document.getElementById(`wysiwyg-toolbar-${key}`);

      // Bind formatting toolbar buttons
      if (toolbar && textarea) {
        toolbar.querySelectorAll('button[data-cmd]').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            const cmd = btn.getAttribute('data-cmd');
            
            if (cmd === 'reset') {
              if (confirm('Are you sure you want to reset this section to its default built-in handbook content? This will overwrite your custom edits.')) {
                textarea.value = defaultContent.trim();
              }
              return;
            }

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            const selected = text.substring(start, end);

            let replacement = '';
            if (cmd === 'bold') replacement = `<strong>${selected}</strong>`;
            else if (cmd === 'italic') replacement = `<em>${selected}</em>`;
            else if (cmd === 'heading') replacement = `<h3>${selected}</h3>`;
            else if (cmd === 'list') replacement = `\n<ul>\n  <li>${selected}</li>\n</ul>\n`;

            textarea.value = text.substring(0, start) + replacement + text.substring(end);
            textarea.focus();
            textarea.setSelectionRange(start + cmd.length + 3, start + cmd.length + 3 + selected.length);
          });
        });
      }

      // Bind Save Button
      if (saveBtn && textarea) {
        saveBtn.addEventListener('click', async () => {
          const newContent = textarea.value.trim();
          saveBtn.disabled = true;
          saveBtn.textContent = 'Saving... ⏳';

          try {
            await api.siteContent.update(key, newContent);
            
            // Update global state cache
            state.siteContent[key] = newContent;
            
            // Exit Edit Mode
            editStates[key] = false;
            editBtn.innerHTML = '<span>✏️</span> Edit Section';
            editBtn.style.background = 'hsl(var(--primary))';
            
            // Re-render HTML content
            block.innerHTML = newContent;
            showToast('Page content updated successfully! ✅');

            if (onSaveCallback) onSaveCallback(newContent);
          } catch (err) {
            alert(`Failed to save content: ${err.message}`);
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Page Edits 💾';
          }
        });
      }

    } else {
      // Exit Edit Mode (Cancel)
      editStates[key] = false;
      editBtn.innerHTML = '<span>✏️</span> Edit Section';
      editBtn.style.background = 'hsl(var(--primary))';
      
      // Restore previous content
      block.innerHTML = getContent(key, defaultContent);
    }
  });
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
