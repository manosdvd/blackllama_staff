import { timelineData } from '../data/timelineData.js';

export function renderTimeline() {
  const cardsHtml = timelineData.map((item, index) => {
    const alignClass = index % 2 === 0 ? 'left' : 'right';
    return `
      <div class="timeline-item ${alignClass} hidden-timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content glass-panel">
          <div class="timeline-year">${item.year}</div>
          <h3 class="timeline-title">${item.event}</h3>
          <p class="timeline-desc">${item.description}</p>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="timeline-container" style="animation: tabFadeIn 0.4s ease;">
      <div class="timeline-header">
        <img src="/camp-logo.png" alt="Camp Lawton Logo" class="timeline-logo">
        <h2 style="color: hsl(var(--primary)); font-family: var(--font-heading);">A Century on the Mountain</h2>
        <p style="color: hsl(var(--muted-foreground)); max-width: 600px; margin: 0 auto;">The institutional, environmental, and cultural evolution of Camp Lawton (1921–2026).</p>
      </div>
      
      <div class="timeline-track-wrapper">
        <div class="timeline-center-line"></div>
        ${cardsHtml}
      </div>
    </div>
  `;
}

export function initTimeline() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show-timeline-item');
        // Keep it visible once scrolled past
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  const timelineItems = document.querySelectorAll('.hidden-timeline-item');
  timelineItems.forEach(item => observer.observe(item));
}
