import re

with open('src/components/training.js', 'r') as f:
    content = f.read()

# Add rawHandbook import
if "import { rawHandbook }" not in content:
    content = content.replace(
        "import { trainingCultureData } from '../data/handbookData.js';",
        "import { trainingCultureData } from '../data/handbookData.js';\nimport { rawHandbook } from '../data/rawHandbook.js';\n\nfunction escapeHtml(str) {\n  return str.replace(/&/g, \"&amp;\").replace(/</g, \"&lt;\").replace(/>/g, \"&gt;\").replace(/\"/g, \"&quot;\").replace(/'/g, \"&#039;\");\n}\n\nfunction renderHandbookSection(h3Title, icon = '📖') {\n  const section = rawHandbook.find(s => s.h3 === h3Title);\n  if (!section) return '';\n  return `\n    <details class=\"glass-panel training-accordion-card\" style=\"border-left: 4px solid hsl(var(--primary));\">\n      <summary class=\"training-accordion-summary\" style=\"padding: 14px 18px;\">\n        <div class=\"training-accordion-header\">\n          <h4 style=\"font-weight: 700; margin: 0; font-size: 15px;\">${icon} ${section.h3}</h4>\n        </div>\n        <span class=\"training-accordion-toggle\">▼</span>\n      </summary>\n      <div class=\"training-accordion-details\" style=\"padding: 0 18px 14px 18px;\">\n        <div style=\"font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.5; white-space: pre-wrap;\">\n          ${escapeHtml(section.content)}\n        </div>\n      </div>\n    </details>\n  `;\n}"
    )

# Add new tabs
if "id=\"training-tab-communication\"" not in content:
    content = content.replace(
        '<button class="schedule-tab-btn" id="training-tab-roles">Staff Structure & NCS</button>',
        '<button class="schedule-tab-btn" id="training-tab-roles">Staff Structure</button>\n        <button class="schedule-tab-btn" id="training-tab-communication">Communication & Duties</button>'
    )

with open('src/components/training.js', 'w') as f:
    f.write(content)

print("Updated training.js with helpers and new tab")
