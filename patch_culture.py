import re

with open('src/components/training.js', 'r') as f:
    content = f.read()

# Replace the manual content inside renderCulture with our new dynamic rendering for Rules, Stress, Glossary
# Actually we can just append it below the existing content to be safe.
if "<!-- Appended Culture -->" not in content:
    content = content.replace(
        "          </div>\n        </div>\n      </div>\n    `;\n  }",
        "          </div>\n        </div>\n        <!-- Appended Culture -->\n        <div style=\"display: flex; flex-direction: column; gap: 16px; margin-top: 24px;\">\n          ${renderHandbookSection('The Rules', '📜')}\n          ${renderHandbookSection('Stress Management and Mental Stability', '🧘')}\n          ${renderHandbookSection('Glossary', '📖')}\n        </div>\n      </div>\n    `;\n  }"
    )

with open('src/components/training.js', 'w') as f:
    f.write(content)

print("Patched training culture")
