import { rawHandbook } from '../data/rawHandbook.js';
import { marked } from 'marked';

// Determine image based on the title
function getContextualImage(title) {
  if (!title) return null;
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('welcome')) return '/images/welcome_mission_1782503700417.png';
  if (lowerTitle.includes('rules') || lowerTitle.includes('conduct')) return '/images/the_rules_1782503707686.png';
  if (lowerTitle.includes('stress management')) return '/images/stress_management_1782503718009.png';
  if (lowerTitle.includes('program areas')) return '/images/program_areas_1782503726243.png';
  return null;
}

// Tree Builder for nested structure
function buildHandbookTree(rawHandbook) {
  const root = { children: [] };
  const lastActive = [root, null, null, null, null, null, null]; // Supports up to level 6

  rawHandbook.forEach((section, index) => {
    const level = section.level || 1;
    const node = {
      index,
      title: section.title,
      level,
      content: section.content,
      h1: section.h1,
      h2: section.h2,
      h3: section.h3,
      h4: section.h4,
      children: []
    };

    let parent = null;
    for (let l = level - 1; l >= 0; l--) {
      if (lastActive[l]) {
        parent = lastActive[l];
        break;
      }
    }
    if (!parent) parent = root;

    parent.children.push(node);
    lastActive[level] = node;
    for (let l = level + 1; l < lastActive.length; l++) {
      lastActive[l] = null;
    }
  });

  return root.children;
}

// Recursive renderer for syllabus nodes
function renderNode(node) {
  const hasChildren = node.children && node.children.length > 0;
  const hasContent = node.content && node.content.trim().length > 0;
  
  if (hasChildren) {
    const childHtml = node.children.map(child => renderNode(child)).join('');
    const btnClass = hasContent ? 'course-nav-btn folder-with-content' : 'course-nav-btn folder-no-content';
    
    return `
      <details class="syllabus-group level-${node.level}" data-node-index="${node.index}">
        <summary class="syllabus-summary level-${node.level}">
          <span class="chevron-icon">▼</span>
          <button class="${btnClass}" data-index="${node.index}" type="button">
            ${node.title}
          </button>
        </summary>
        <div class="syllabus-children">
          ${childHtml}
        </div>
      </details>
    `;
  } else {
    const btnClass = 'course-nav-btn leaf';
    return `
      <div class="syllabus-leaf level-${node.level}">
        <button class="${btnClass}" data-index="${node.index}" type="button">
          ${node.title}
        </button>
      </div>
    `;
  }
}

export function renderHandbookCourse() {
  const tree = buildHandbookTree(rawHandbook);
  const syllabusHtml = tree.map(node => renderNode(node)).join('');

  return `
    <div class="course-sidebar-overlay" id="sidebar-overlay"></div>
    <div class="course-container" style="display: flex; gap: 24px; min-height: calc(100vh - 200px); align-items: stretch;">
      
      <!-- Sidebar Syllabus -->
      <aside class="course-sidebar glass-panel" style="width: 320px; flex-shrink: 0; padding: 0; overflow-y: auto; max-height: calc(100vh - 200px); border-radius: var(--radius-md);">
        <div style="padding: 20px; border-bottom: 1px solid hsl(var(--border) / 0.5); background: hsl(var(--muted) / 0.1);">
          <h2 style="margin: 0; font-size: 18px; font-family: var(--font-heading); color: hsl(var(--primary));">Course Syllabus</h2>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: hsl(var(--muted-foreground));">Camp Lawton Staff Handbook</p>
        </div>
        <div id="course-sidebar-list" style="margin: 0; padding: 12px 8px;">
          ${syllabusHtml}
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="course-content glass-panel" style="flex-grow: 1; padding: 40px; display: flex; flex-direction: column; overflow-y: auto; max-height: calc(100vh - 200px); border-radius: var(--radius-md); position: relative;">
        <div id="course-lesson-mount">
          <!-- Lesson content injected here -->
        </div>
        
        <!-- Navigation Controls -->
        <div style="margin-top: auto; padding-top: 40px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid hsl(var(--border) / 0.5);">
          <button id="course-prev-btn" class="glass-btn" style="padding: 10px 20px; font-weight: 600;">← Previous Lesson</button>
          <span id="course-progress" style="font-size: 14px; color: hsl(var(--muted-foreground)); font-weight: 600;"></span>
          <button id="course-next-btn" class="glass-btn primary" style="padding: 10px 20px; font-weight: 600;">Next Lesson →</button>
        </div>
      </main>
      <button class="mobile-syllabus-fab" id="mobile-syllabus-btn">📖 Syllabus</button>

    </div>
  `;
}

export function initHandbookCourse() {
  const sidebarButtons = document.querySelectorAll('.course-nav-btn');
  const lessonMount = document.getElementById('course-lesson-mount');
  const prevBtn = document.getElementById('course-prev-btn');
  const nextBtn = document.getElementById('course-next-btn');
  const progressText = document.getElementById('course-progress');

  // Haptic Helper
  function triggerHaptic(type = 'light') {
    if (navigator.vibrate) {
      if (type === 'light') navigator.vibrate(10);
      else if (type === 'medium') navigator.vibrate(20);
      else if (type === 'heavy') navigator.vibrate([20, 30, 20]);
    }
  }

  // Mobile Sidebar Toggle
  const sidebar = document.querySelector('.course-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const fab = document.getElementById('mobile-syllabus-btn');

  function toggleSidebar() {
    triggerHaptic('light');
    if (sidebar) sidebar.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
  }
  
  if (fab) fab.addEventListener('click', toggleSidebar);
  if (overlay) overlay.addEventListener('click', toggleSidebar);

  // Helper functions for finding content indices
  function findNextContentIndex(currentIndex) {
    for (let i = currentIndex + 1; i < rawHandbook.length; i++) {
      if (rawHandbook[i].content && rawHandbook[i].content.trim().length > 0) {
        return i;
      }
    }
    return -1;
  }

  function findPrevContentIndex(currentIndex) {
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (rawHandbook[i].content && rawHandbook[i].content.trim().length > 0) {
        return i;
      }
    }
    return -1;
  }

  // Swipe Gestures
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;

  if (lessonMount) {
    lessonMount.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    lessonMount.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = Math.abs(touchEndY - touchStartY);
    
    // Only trigger if horizontal swipe is significant and vertical scrolling is minimal
    if (Math.abs(deltaX) > 60 && deltaY < 40) {
      if (deltaX < 0) {
        // Swiped Left -> Next
        const nextIndex = findNextContentIndex(state.currentLessonIndex);
        if (nextIndex !== -1) {
          triggerHaptic('medium');
          renderLesson(nextIndex);
        }
      } else if (deltaX > 0) {
        // Swiped Right -> Prev
        const prevIndex = findPrevContentIndex(state.currentLessonIndex);
        if (prevIndex !== -1) {
          triggerHaptic('medium');
          renderLesson(prevIndex);
        }
      }
    }
  }

  const state = window.state || { currentLessonIndex: 0 };
  
  // Set default initial index to the first section with content
  let initialIndex = state.currentLessonIndex;
  if (initialIndex === undefined || initialIndex === null || initialIndex < 0 || initialIndex >= rawHandbook.length) {
    initialIndex = 0;
  }
  if (!rawHandbook[initialIndex].content || rawHandbook[initialIndex].content.trim().length === 0) {
    const firstContentIndex = rawHandbook.findIndex(s => s.content && s.content.trim().length > 0);
    if (firstContentIndex !== -1) {
      initialIndex = firstContentIndex;
      state.currentLessonIndex = initialIndex;
    }
  }

  function renderLesson(index) {
    if (index < 0 || index >= rawHandbook.length) return;
    
    state.currentLessonIndex = index;
    
    // Close sidebar on mobile when a lesson is selected
    if (sidebar && sidebar.classList.contains('active')) {
      toggleSidebar();
    }

    const section = rawHandbook[index];
    const title = section.title;
    
    // Header category path text
    let headerPath = '';
    const pathSegments = [];
    if (section.h1) pathSegments.push(section.h1);
    if (section.h2) pathSegments.push(section.h2);
    if (section.h3 && section.h3 !== section.title) pathSegments.push(section.h3);
    
    if (pathSegments.length > 0) {
      headerPath = `<p style="text-transform: uppercase; letter-spacing: 2px; font-size: 11px; font-weight: 700; color: hsl(var(--primary)); margin: 0 0 8px 0; opacity: 0.85;">${pathSegments.join(' — ')}</p>`;
    }
    
    // Check for contextual image
    const imagePath = getContextualImage(title);
    const imageHtml = imagePath ? `<img src="${imagePath}" alt="${title}" style="width: 100%; height: 240px; object-fit: cover; border-radius: var(--radius-sm); margin-bottom: 32px; box-shadow: var(--shadow-md);">` : '';

    // Convert markdown content
    const htmlContent = marked.parse(section.content || '');

    lessonMount.innerHTML = `
      <div style="animation: scroll-fade-in 0.4s ease-out forwards; animation-timeline: auto;">
        ${imageHtml}
        ${headerPath}
        <h1 style="font-size: 30px; font-family: var(--font-heading); margin-top: 0; margin-bottom: 24px; color: hsl(var(--foreground)); line-height: 1.2;">${title}</h1>
        <div class="markdown-body" style="font-size: 15.5px; line-height: 1.7; color: hsl(var(--foreground));">
          ${htmlContent}
        </div>
      </div>
    `;

    // Scroll to top of lesson
    const contentArea = document.querySelector('.course-content');
    if (contentArea) contentArea.scrollTop = 0;

    // Update Sidebar Active State
    sidebarButtons.forEach(btn => {
      btn.classList.remove('active-lesson');
      
      if (parseInt(btn.getAttribute('data-index')) === index) {
        btn.classList.add('active-lesson');
        
        // Auto-expand all parent <details> elements to reveal this node
        let parentDetails = btn.closest('details');
        while (parentDetails) {
          parentDetails.open = true;
          parentDetails = parentDetails.parentElement.closest('details');
        }
      }
    });

    // Update Controls using next/prev content index helpers
    const nextIndex = findNextContentIndex(index);
    const prevIndex = findPrevContentIndex(index);

    prevBtn.disabled = prevIndex === -1;
    prevBtn.style.opacity = prevIndex === -1 ? '0.5' : '1';
    prevBtn.style.pointerEvents = prevIndex === -1 ? 'none' : 'auto';
    
    nextBtn.disabled = nextIndex === -1;
    nextBtn.style.opacity = nextIndex === -1 ? '0.5' : '1';
    nextBtn.style.pointerEvents = nextIndex === -1 ? 'none' : 'auto';

    // Calculate total pages with content and current page index among them
    const totalWithContent = rawHandbook.filter(s => s.content && s.content.trim().length > 0).length;
    const currentNum = rawHandbook.slice(0, index + 1).filter(s => s.content && s.content.trim().length > 0).length;

    progressText.textContent = `Page ${currentNum} of ${totalWithContent}`;
  }

  // Event Listeners
  sidebarButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-index'));
      const section = rawHandbook[idx];
      const hasContent = section.content && section.content.trim().length > 0;
      
      if (hasContent) {
        e.stopPropagation(); // Avoid triggering double summary details toggles
        renderLesson(idx);
      } else {
        // Toggle details manually if it's an empty folder
        const details = btn.closest('details');
        if (details) {
          // Check if target is not the details click itself to prevent loops
          if (e.target.tagName === 'BUTTON') {
            e.preventDefault();
            e.stopPropagation();
            details.open = !details.open;
          }
        }
      }
    });
  });

  prevBtn.addEventListener('click', () => {
    triggerHaptic('medium');
    const prevIndex = findPrevContentIndex(state.currentLessonIndex);
    if (prevIndex !== -1) renderLesson(prevIndex);
  });

  nextBtn.addEventListener('click', () => {
    triggerHaptic('medium');
    const nextIndex = findNextContentIndex(state.currentLessonIndex);
    if (nextIndex !== -1) renderLesson(nextIndex);
  });

  // Initial Render
  renderLesson(initialIndex);
}
