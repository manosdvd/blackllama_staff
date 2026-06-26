import re

with open('src/components/packing.js', 'r') as f:
    content = f.read()

if "import { rawHandbook }" not in content:
    content = content.replace(
        "import { state } from '../main.js';",
        "import { state } from '../main.js';\nimport { rawHandbook } from '../data/rawHandbook.js';\n\nfunction escapeHtml(str) {\n  return str.replace(/&/g, \"&amp;\").replace(/</g, \"&lt;\").replace(/>/g, \"&gt;\").replace(/\"/g, \"&quot;\").replace(/'/g, \"&#039;\");\n}\n\nfunction renderHandbookSection(h3Title, icon = '📖') {\n  const section = rawHandbook.find(s => s.h3 === h3Title || s.h2 === h3Title || s.h1 === h3Title);\n  if (!section) return '';\n  return `\n    <details class=\"glass-panel training-accordion-card\" style=\"border-left: 4px solid hsl(var(--primary)); margin-top: 16px;\">\n      <summary class=\"training-accordion-summary\" style=\"padding: 14px 18px;\">\n        <div class=\"training-accordion-header\">\n          <h4 style=\"font-weight: 700; margin: 0; font-size: 15px;\">${icon} ${section.h3 || section.h2 || section.h1}</h4>\n        </div>\n        <span class=\"training-accordion-toggle\">▼</span>\n      </summary>\n      <div class=\"training-accordion-details\" style=\"padding: 0 18px 14px 18px;\">\n        <div style=\"font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.5; white-space: pre-wrap;\">\n          ${escapeHtml(section.content)}\n        </div>\n      </div>\n    </details>\n  `;\n}"
    )

if "<!-- Appended Conduct Protocols -->" not in content:
    content = content.replace(
        "        <div class=\"signer-panel\" id=\"signer-inputs-panel\">",
        "        <!-- Appended Conduct Protocols -->\n        <div style=\"display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;\">\n          ${renderHandbookSection('Our Support & Accountability Framework', '🤝')}\n          ${renderHandbookSection('Daily Behavioral Expectations', '📋')}\n          ${renderHandbookSection('Zero-Tolerance: Immediate Discharge', '🚫')}\n        </div>\n        <div class=\"signer-panel\" id=\"signer-inputs-panel\">"
    )

if "<!-- Appended Packing Protocols -->" not in content:
    content = content.replace(
        "        </div>\n      </div>\n\n      <!-- Code of Conduct Commitment Signer -->",
        "        </div>\n        <!-- Appended Packing Protocols -->\n        <div style=\"display: flex; flex-direction: column; gap: 8px; margin-top: 16px;\">\n          ${renderHandbookSection('Necessary Clothing (Pack for 6 days)', '👕')}\n          ${renderHandbookSection('Necessary Gear', '🎒')}\n          ${renderHandbookSection('Optional Gear', '🔦')}\n          ${renderHandbookSection('Privileged Gear (Entertainment items that cannot leave the cabin and may be prohibited if they become an issue)', '🎮')}\n          ${renderHandbookSection('Strictly Prohibited (Leave at Home)', '❌')}\n        </div>\n      </div>\n\n      <!-- Code of Conduct Commitment Signer -->"
    )

with open('src/components/packing.js', 'w') as f:
    f.write(content)

print("Patched packing.js")
