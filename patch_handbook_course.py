import re

with open('src/components/handbookCourse.js', 'r') as f:
    content = f.read()

# I want to add accordion groups for each h1 section in the sidebar.
# Let's see how I can group rawHandbook by h1 in Python, but I'm just injecting JS, so I'll write the logic in JS.

new_sidebar_logic = """
        <ul id="course-sidebar-list" style="list-style: none; margin: 0; padding: 0;">
          ${(() => {
            let currentH1 = null;
            let html = '';
            
            rawHandbook.forEach((section, index) => {
              const title = section.h3 || section.h2 || section.h1 || `Lesson ${index + 1}`;
              
              if (section.h1 && section.h1 !== currentH1) {
                // If there's an open details tag from a previous group, we close it (except we're just building flat HTML here, so we'll just insert a header)
                if (currentH1 !== null) {
                  html += `</div></details>`;
                }
                currentH1 = section.h1;
                html += `
                  <details class="sidebar-h1-group" style="border-bottom: 1px solid hsl(var(--border) / 0.3);" open>
                    <summary style="padding: 12px 20px; font-weight: 700; font-size: 13px; color: hsl(var(--primary)); text-transform: uppercase; letter-spacing: 1px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; background: hsl(var(--muted) / 0.3);">
                      ${currentH1}
                      <span class="sidebar-h1-toggle">▼</span>
                    </summary>
                    <div style="padding-left: 0;">
                `;
              }

              html += `
                <button class="course-nav-btn" data-index="${index}" style="width: 100%; text-align: left; padding: 10px 20px 10px 32px; background: none; border: none; font-family: inherit; font-size: 13.5px; cursor: pointer; transition: all 0.2s ease; border-bottom: 1px solid hsl(var(--border) / 0.1);">
                  <span style="display: inline-block; width: 24px; font-weight: bold; color: hsl(var(--muted-foreground)); opacity: 0.5;">${index + 1}.</span> 
                  ${title}
                </button>
              `;
            });
            
            if (currentH1 !== null) {
              html += `</div></details>`;
            }
            
            return html;
          })()}
        </ul>
"""

# Replace the old mapping logic with the new one
start_str = "<ul id=\"course-sidebar-list\" style=\"list-style: none; margin: 0; padding: 0;\">"
end_str = "        </ul>"

start_idx = content.find(start_str)
end_idx = content.find(end_str) + len(end_str)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + new_sidebar_logic.strip() + content[end_idx:]
    with open('src/components/handbookCourse.js', 'w') as f:
        f.write(new_content)
    print("Patched handbookCourse.js successfully.")
else:
    print("Could not find sidebar list in handbookCourse.js")

