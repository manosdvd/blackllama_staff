import { companyValues } from '../data/handbookData.js';
import { openAppDialog } from '../main.js';

export function renderValues() {
  const cardsHtml = companyValues.map(value => {
    return `
      <div class="glass-panel glass-panel-interactive value-card" data-value-id="${value.id}">
        <div class="value-card-icon">${value.icon}</div>
        <h3 class="value-card-title">${value.title}</h3>
        <p class="value-card-tagline">${value.tagline}</p>
        <p class="value-card-description">${value.description.substring(0, 100)}...</p>
        <button class="value-card-action" aria-label="Learn more about ${value.title}">Read Story</button>
      </div>
    `;
  }).join('');

  return `
    <div style="display: flex; flex-direction: column; gap: 28px;">
      <p style="color: hsl(var(--muted-foreground)); font-size: 15px; max-width: 700px; line-height: 1.5;">
        Our culture represents how we interact, make decisions, and guide product direction. Click on any card below to read a story highlighting how we apply these values in our day-to-day operations.
      </p>
      
      <div class="values-grid">
        ${cardsHtml}
      </div>
    </div>
  `;
}

export function initValues() {
  const container = document.querySelector('.values-grid');
  if (!container) return;

  container.querySelectorAll('.value-card').forEach(card => {
    card.addEventListener('click', () => {
      const valueId = card.getAttribute('data-value-id');
      const value = companyValues.find(v => v.id === valueId);
      if (value) {
        showValueDetails(value);
      }
    });
  });
}

function showValueDetails(value) {
  const html = `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <span style="font-size: 36px; padding: 12px; background: hsl(var(--primary) / 0.1); border-radius: var(--radius-md);">${value.icon}</span>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <h2 id="dialog-title" style="font-size: 24px; font-weight: 800; font-family: var(--font-heading);">${value.title}</h2>
          <span style="font-weight: 600; color: hsl(var(--primary)); font-size: 14px;">${value.tagline}</span>
        </div>
      </div>
      
      <p style="line-height: 1.6; font-size: 15px; color: hsl(var(--foreground)); margin-top: 8px;">
        ${value.description}
      </p>
      
      <div style="background: hsl(var(--secondary) / 0.5); border-left: 4px solid hsl(var(--primary)); padding: 16px; border-radius: 0 var(--radius-md) var(--radius-md) 0; margin-top: 8px;">
        <h4 style="font-weight: 700; margin-bottom: 6px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: hsl(var(--primary));">Value in Action:</h4>
        <p style="font-style: italic; font-size: 14.5px; line-height: 1.5;">"${value.example}"</p>
      </div>
    </div>
  `;

  openAppDialog(html);
}
