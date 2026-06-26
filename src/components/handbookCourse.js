import { rawHandbook } from '../data/rawHandbook.js';
import { marked } from 'marked';

// Determine image based on the title
function getContextualImage(h3) {
  if (!h3) return null;
  const title = h3.toLowerCase();
  if (title.includes('welcome')) return '/images/welcome_mission_1782503700417.png';
  if (title.includes('rules') || title.includes('conduct')) return '/images/the_rules_1782503707686.png';
  if (title.includes('stress management')) return '/images/stress_management_1782503718009.png';
  if (title.includes('program areas')) return '/images/program_areas_1782503726243.png';
  return null;
}

export function renderHandbookCourse() {
  return `
    <div class="course-container" style="display: flex; gap: 24px; min-height: calc(100vh - 200px); align-items: stretch;">
      
      <!-- Sidebar Syllabus -->
      <aside class="course-sidebar glass-panel" style="width: 320px; flex-shrink: 0; padding: 0; overflow-y: auto; max-height: calc(100vh - 200px); border-radius: var(--radius-md);">
        <div style="padding: 20px; border-bottom: 1px solid hsl(var(--border) / 0.5);">
          <h2 style="margin: 0; font-size: 18px;">Course Syllabus</h2>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: hsl(var(--muted-foreground));">Camp Lawton Staff Handbook</p>
        </div>
        <ul id="course-sidebar-list" style="list-style: none; margin: 0; padding: 0;">
          ${rawHandbook.map((section, index) => {
            const title = section.h3 || section.h2 || section.h1 || `Lesson ${index + 1}`;
            return `
              <li style="border-bottom: 1px solid hsl(var(--border) / 0.3);">
                <button class="course-nav-btn" data-index="${index}" style="width: 100%; text-align: left; padding: 12px 20px; background: none; border: none; font-family: inherit; font-size: 14px; cursor: pointer; transition: all 0.2s ease;">
                  <span style="display: inline-block; width: 24px; font-weight: bold; color: hsl(var(--muted-foreground));">${index + 1}.</span> 
                  ${title}
                </button>
              </li>
            `;
          }).join('')}
        </ul>
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

    </div>
  `;
}

export function initHandbookCourse() {
  const sidebarButtons = document.querySelectorAll('.course-nav-btn');
  const lessonMount = document.getElementById('course-lesson-mount');
  const prevBtn = document.getElementById('course-prev-btn');
  const nextBtn = document.getElementById('course-next-btn');
  const progressText = document.getElementById('course-progress');

  // We'll store current index on the window or use a localized let, 
  // but to persist across re-renders in SPA, we should ideally use global state.
  // We'll use window.state if available, otherwise fallback to local let.
  const state = window.state || { currentLessonIndex: 0 };
  if (state.currentLessonIndex === undefined) state.currentLessonIndex = 0;

  function renderLesson(index) {
    if (index < 0 || index >= rawHandbook.length) return;
    
    // Update State
    state.currentLessonIndex = index;

    const section = rawHandbook[index];
    const title = section.h3 || section.h2 || section.h1 || `Lesson ${index + 1}`;
    const headerTitle = section.h1 ? `<p style="text-transform: uppercase; letter-spacing: 2px; font-size: 12px; font-weight: 700; color: hsl(var(--primary)); margin: 0 0 8px 0;">${section.h1} ${section.h2 ? '— ' + section.h2 : ''}</p>` : '';
    
    // Check for contextual image
    const imagePath = getContextualImage(title);
    const imageHtml = imagePath ? `<img src="${imagePath}" alt="${title}" style="width: 100%; height: 240px; object-fit: cover; border-radius: var(--radius-sm); margin-bottom: 32px; box-shadow: var(--shadow-md);">` : '';

    // Convert markdown content
    const htmlContent = marked.parse(section.content || '');

    lessonMount.innerHTML = `
      <div style="animation: scroll-fade-in 0.4s ease-out forwards; animation-timeline: auto;">
        ${imageHtml}
        ${headerTitle}
        <h1 style="font-size: 32px; margin-top: 0; margin-bottom: 24px;">${title}</h1>
        <div class="markdown-body" style="font-size: 16px; line-height: 1.7; color: hsl(var(--foreground));">
          ${htmlContent}
        </div>
      </div>
    `;

    // Scroll to top of lesson
    const contentArea = document.querySelector('.course-content');
    if (contentArea) contentArea.scrollTop = 0;

    // Update Sidebar Active State
    sidebarButtons.forEach(btn => {
      btn.style.background = 'none';
      btn.style.color = 'inherit';
      btn.style.fontWeight = 'normal';
      btn.style.borderLeft = 'none';
      
      if (parseInt(btn.getAttribute('data-index')) === index) {
        btn.style.background = 'hsl(var(--primary) / 0.1)';
        btn.style.color = 'hsl(var(--primary))';
        btn.style.fontWeight = '700';
        btn.style.borderLeft = '4px solid hsl(var(--primary))';
      }
    });

    // Update Controls
    prevBtn.disabled = index === 0;
    prevBtn.style.opacity = index === 0 ? '0.5' : '1';
    prevBtn.style.pointerEvents = index === 0 ? 'none' : 'auto';
    
    nextBtn.disabled = index === rawHandbook.length - 1;
    nextBtn.style.opacity = index === rawHandbook.length - 1 ? '0.5' : '1';
    nextBtn.style.pointerEvents = index === rawHandbook.length - 1 ? 'none' : 'auto';

    progressText.textContent = `Lesson ${index + 1} of ${rawHandbook.length}`;
  }

  // Event Listeners
  sidebarButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-index'));
      renderLesson(idx);
    });
  });

  prevBtn.addEventListener('click', () => {
    if (state.currentLessonIndex > 0) renderLesson(state.currentLessonIndex - 1);
  });

  nextBtn.addEventListener('click', () => {
    if (state.currentLessonIndex < rawHandbook.length - 1) renderLesson(state.currentLessonIndex + 1);
  });

  // Initial Render
  renderLesson(state.currentLessonIndex);
}
