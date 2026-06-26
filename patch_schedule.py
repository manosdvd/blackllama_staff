import re

with open('src/components/schedule.js', 'r') as f:
    content = f.read()

if "import { rawHandbook }" not in content:
    content = content.replace(
        "import { getContent, wrapEditable, initEditable } from './wysiwygEditor.js';",
        "import { getContent, wrapEditable, initEditable } from './wysiwygEditor.js';\nimport { rawHandbook } from '../data/rawHandbook.js';\n\nfunction escapeHtml(str) {\n  return str.replace(/&/g, \"&amp;\").replace(/</g, \"&lt;\").replace(/>/g, \"&gt;\").replace(/\"/g, \"&quot;\").replace(/'/g, \"&#039;\");\n}\n\nfunction renderHandbookSection(h3Title, icon = '📖') {\n  const section = rawHandbook.find(s => s.h3 === h3Title);\n  if (!section) return '';\n  return `\n    <details class=\"glass-panel training-accordion-card\" style=\"border-left: 4px solid hsl(var(--primary)); margin-top: 16px;\">\n      <summary class=\"training-accordion-summary\" style=\"padding: 14px 18px;\">\n        <div class=\"training-accordion-header\">\n          <h4 style=\"font-weight: 700; margin: 0; font-size: 15px;\">${icon} ${section.h3}</h4>\n        </div>\n        <span class=\"training-accordion-toggle\">▼</span>\n      </summary>\n      <div class=\"training-accordion-details\" style=\"padding: 0 18px 14px 18px;\">\n        <div style=\"font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.5; white-space: pre-wrap;\">\n          ${escapeHtml(section.content)}\n        </div>\n      </div>\n    </details>\n  `;\n}"
    )

# Append "Stress Management and Mental Stability" and "Campfires" maybe? Actually campfires in songbook.
# Let's just append to Sunday and Daily Life. Wait, "Sunday" in handbook was under "Sunday Arrival / Daily Life" but there is no specific H3 for "Sunday", it might be under H2? 
# Wait, let's look at the parsed_handbook.json output.
# 11: Stress Management and Mental Stability (H3)
# 14: Program Areas (H3)
# 16: Campfires (H3)
# Wait, the handbook didn't have "Sunday" as an H3. It was under "This Is Your Life" but my script printed:
# 13: Customer Service
# 14: Program Areas
# 15: Communication: Darmok and Jalad at Tanagra
# 16: Campfires
# Where is Sunday Arrival? It might be merged into Customer Service or Program Areas if it lacked a proper markdown header.
# Let's check `parsed_handbook.json` to see if Sunday is in there.

with open('src/components/schedule.js', 'w') as f:
    f.write(content)
