import re

with open('src/components/safetyGuides.js', 'r') as f:
    content = f.read()

if "import { rawHandbook }" not in content:
    content = content.replace(
        "import { policiesProceduresData } from '../data/handbookData.js';",
        "import { policiesProceduresData } from '../data/handbookData.js';\nimport { rawHandbook } from '../data/rawHandbook.js';\n\nfunction escapeHtml(str) {\n  return str.replace(/&/g, \"&amp;\").replace(/</g, \"&lt;\").replace(/>/g, \"&gt;\").replace(/\"/g, \"&quot;\").replace(/'/g, \"&#039;\");\n}\n\nfunction renderHandbookSection(h3Title, icon = '📖') {\n  const section = rawHandbook.find(s => s.h3 === h3Title);\n  if (!section) return '';\n  return `\n    <details class=\"glass-panel training-accordion-card\" style=\"border-left: 4px solid hsl(var(--primary)); margin-top: 16px;\">\n      <summary class=\"training-accordion-summary\" style=\"padding: 14px 18px;\">\n        <div class=\"training-accordion-header\">\n          <h4 style=\"font-weight: 700; margin: 0; font-size: 15px;\">${icon} ${section.h3}</h4>\n        </div>\n        <span class=\"training-accordion-toggle\">▼</span>\n      </summary>\n      <div class=\"training-accordion-details\" style=\"padding: 0 18px 14px 18px;\">\n        <div style=\"font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.5; white-space: pre-wrap;\">\n          ${escapeHtml(section.content)}\n        </div>\n      </div>\n    </details>\n  `;\n}"
    )

# Append handbook sections to flowcharts
if "Severe Weather Preparedness" not in content and "renderHandbookSection('Severe Weather Preparedness'" not in content:
    content = content.replace(
        "<!-- Heat Stress Matrix -->",
        """
        <!-- Appended Handbook Protocols -->
        <div style="margin-top: 24px;">
          ${renderHandbookSection('Severe Weather Preparedness', '🌪️')}
          ${renderHandbookSection('Safeguarding Youth', '🛡️')}
          ${renderHandbookSection('Bear and Wildlife Safety', '🐻')}
          ${renderHandbookSection('Fire Safety and Evacuation Procedures', '🔥')}
          ${renderHandbookSection('Lightning and Severe Thunderstorms', '⚡')}
          ${renderHandbookSection('Fatality Protocol', '🚨')}
        </div>
        <!-- Heat Stress Matrix -->
        """
    )

# Append handbook sections to guidelines
if "renderHandbookSection('The Camp Lawton Guidelines" not in content:
    content = content.replace(
        "</div>\n      </div>\n    `;\n  }",
        "</div>\n        <div style=\"margin-top: 24px;\">\n          ${renderHandbookSection('The Camp Lawton Guidelines (What we expect from everyone in camp)', '📋')}\n          ${renderHandbookSection('HEALTH AND SAFETY', '⚕️')}\n        </div>\n      </div>\n    `;\n  }"
    )

# Append handbook sections to legal
if "renderHandbookSection('LEGAL POLICIES" not in content:
    content = content.replace(
        "        </div>\n      </div>\n    `;\n  }",
        "        </div>\n        <div style=\"margin-top: 24px;\">\n          ${renderHandbookSection('LEGAL POLICIES AND INFORMATION', '⚖️')}\n        </div>\n      </div>\n    `;\n  }"
    )

with open('src/components/safetyGuides.js', 'w') as f:
    f.write(content)

print("Patched safetyGuides.js successfully")
