import re

with open('src/components/handbookCourse.js', 'r') as f:
    content = f.read()

# 1. Update renderHandbookCourse
render_start_idx = content.find('export function renderHandbookCourse() {')
render_end_idx = content.find('export function initHandbookCourse() {')
render_func = content[render_start_idx:render_end_idx]

# Add overlay and FAB
new_render_func = render_func.replace(
    '<div class="course-container"',
    '<div class="course-sidebar-overlay" id="sidebar-overlay"></div>\n    <div class="course-container"'
).replace(
    '</main>',
    '</main>\n      <button class="mobile-syllabus-fab" id="mobile-syllabus-btn">📖 Syllabus</button>'
)
content = content[:render_start_idx] + new_render_func + content[render_end_idx:]

# 2. Update initHandbookCourse
init_idx = content.find('export function initHandbookCourse() {')

# Add the haptic trigger function and touch logic to initHandbookCourse
haptic_logic = """
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
        if (state.currentLessonIndex < rawHandbook.length - 1) {
          triggerHaptic('medium');
          renderLesson(state.currentLessonIndex + 1);
        }
      } else if (deltaX > 0) {
        // Swiped Right -> Prev
        if (state.currentLessonIndex > 0) {
          triggerHaptic('medium');
          renderLesson(state.currentLessonIndex - 1);
        }
      }
    }
  }
"""

content = content.replace(
  'const progressText = document.getElementById(\'course-progress\');',
  'const progressText = document.getElementById(\'course-progress\');\n' + haptic_logic
)

# 3. Add haptics and auto-close sidebar on lesson render
render_lesson_update = """    // Update State
    state.currentLessonIndex = index;
    
    // Close sidebar on mobile when a lesson is selected
    if (sidebar && sidebar.classList.contains('active')) {
      toggleSidebar();
    }"""
content = content.replace('    // Update State\n    state.currentLessonIndex = index;', render_lesson_update)

# 4. Add haptics to button listeners
prev_btn_update = """  prevBtn.addEventListener('click', () => {
    triggerHaptic('medium');
    if (state.currentLessonIndex > 0) renderLesson(state.currentLessonIndex - 1);
  });"""
content = content.replace("  prevBtn.addEventListener('click', () => {\n    if (state.currentLessonIndex > 0) renderLesson(state.currentLessonIndex - 1);\n  });", prev_btn_update)

next_btn_update = """  nextBtn.addEventListener('click', () => {
    triggerHaptic('medium');
    if (state.currentLessonIndex < rawHandbook.length - 1) renderLesson(state.currentLessonIndex + 1);
  });"""
content = content.replace("  nextBtn.addEventListener('click', () => {\n    if (state.currentLessonIndex < rawHandbook.length - 1) renderLesson(state.currentLessonIndex + 1);\n  });", next_btn_update)


with open('src/components/handbookCourse.js', 'w') as f:
    f.write(content)
print("Patched handbookCourse.js")
