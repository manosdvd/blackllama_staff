import re

with open('src/components/songs.js', 'r') as f:
    content = f.read()

if "import { rawHandbook }" not in content:
    content = content.replace(
        "import { songbookSongs } from '../data/handbookData.js';",
        "import { songbookSongs } from '../data/handbookData.js';\nimport { rawHandbook } from '../data/rawHandbook.js';\n\nfunction escapeHtml(str) {\n  return str.replace(/&/g, \"&amp;\").replace(/</g, \"&lt;\").replace(/>/g, \"&gt;\").replace(/\"/g, \"&quot;\").replace(/'/g, \"&#039;\");\n}\n\nfunction renderHandbookSection(h3Title, icon = '📖') {\n  const section = rawHandbook.find(s => s.h3 === h3Title || s.h2 === h3Title || s.h1 === h3Title);\n  if (!section) return '';\n  return `\n    <details class=\"glass-panel comedy-card\" style=\"border-left: 4px solid hsl(var(--primary));\">\n      <summary class=\"comedy-card-summary\" style=\"padding: 14px 18px;\">\n        <div class=\"comedy-card-header\">\n          <h4 style=\"font-weight: 700; margin: 0; font-size: 15px;\">${icon} ${section.h3 || section.h2 || section.h1}</h4>\n        </div>\n        <span class=\"comedy-card-toggle\">▼</span>\n      </summary>\n      <div class=\"comedy-card-details\" style=\"padding: 0 18px 14px 18px;\">\n        <div style=\"font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.5; white-space: pre-wrap;\">\n          ${escapeHtml(section.content)}\n        </div>\n      </div>\n    </details>\n  `;\n}"
    )

if "<!-- Appended Handbook Protocols -->" not in content:
    content = content.replace(
        "        </div>\n      </div>\n    `;\n  }",
        "        </div>\n        <!-- Appended Handbook Protocols -->\n        <div style=\"display: flex; flex-direction: column; gap: 16px; margin-top: 24px;\">\n          ${renderHandbookSection('Campfires', '🔥')}\n          ${renderHandbookSection('Isn’t calling this a Master Class a bit arrogant?', '🤔')}\n          ${renderHandbookSection('How To Write Funny', '🎭')}\n          ${renderHandbookSection('Writing Songs', '🎸')}\n          ${renderHandbookSection('Here’s one last lesson on the law making things inconvenient', '⚖️')}\n        </div>\n      </div>\n    `;\n  }"
    )

with open('src/components/songs.js', 'w') as f:
    f.write(content)

print("Patched songs.js")
