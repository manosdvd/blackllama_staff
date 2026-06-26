import re

with open('src/components/training.js', 'r') as f:
    content = f.read()

# Wire up the new button in initTraining
if "const commsBtn = document.getElementById('training-tab-communication');" not in content:
    content = content.replace(
        "const rolesBtn = document.getElementById('training-tab-roles');",
        "const rolesBtn = document.getElementById('training-tab-roles');\n  const commsBtn = document.getElementById('training-tab-communication');"
    )

if "if (rolesBtn) rolesBtn.classList.remove('active');" in content:
    content = content.replace(
        "if (rolesBtn) rolesBtn.classList.remove('active');",
        "if (rolesBtn) rolesBtn.classList.remove('active');\n    if (commsBtn) commsBtn.classList.remove('active');"
    )

if "function renderCommunication()" not in content:
    render_comms_fn = """
  function renderCommunication() {
    scoutingBtn.classList.remove('active');
    cultureBtn.classList.remove('active');
    serviceBtn.classList.remove('active');
    programBtn.classList.remove('active');
    if (rolesBtn) rolesBtn.classList.remove('active');
    if (commsBtn) commsBtn.classList.add('active');

    panelMount.innerHTML = `
      <div class="schedule-content-panel" style="animation: tabFadeIn 0.3s ease both;">
        <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px;">
          <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
            <span>🗣️</span> Communication & Duties
          </h3>
          <p style="font-size: 14.5px; color: hsl(var(--muted-foreground)); line-height: 1.5;">
            Clear communication and understanding your responsibilities are key to a successful summer.
          </p>
          <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 8px;">
            ${renderHandbookSection('What are my duties anyway?', '📋')}
            ${renderHandbookSection('Communication: Darmok and Jalad at Tanagra', '🤝')}
            ${renderHandbookSection('What can we expect from the Camp Administration?', '🏛️')}
          </div>
        </div>
      </div>
    `;
  }
"""
    # Insert renderCommunication before renderRoles or renderProgram
    content = content.replace(
        "function renderProgram() {",
        render_comms_fn + "\n  function renderProgram() {"
    )

if "commsBtn.addEventListener('click', renderCommunication);" not in content:
    # Find the bottom of initTraining
    # We can inject event listeners after setupEdgeListeners()
    content = content.replace(
        "setupEdgeListeners();\n  }",
        "setupEdgeListeners();\n\n    if (commsBtn) commsBtn.addEventListener('click', renderCommunication);\n    if (rolesBtn) rolesBtn.addEventListener('click', renderRoles);\n  }"
    )

if "function renderRoles()" not in content:
    render_roles_fn = """
  function renderRoles() {
    scoutingBtn.classList.remove('active');
    cultureBtn.classList.remove('active');
    serviceBtn.classList.remove('active');
    programBtn.classList.remove('active');
    if (rolesBtn) rolesBtn.classList.add('active');
    if (commsBtn) commsBtn.classList.remove('active');

    panelMount.innerHTML = `
      <div class="schedule-content-panel" style="animation: tabFadeIn 0.3s ease both;">
        <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px;">
          <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
            <span>👥</span> Staff Structure
          </h3>
          <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 8px;">
            ${renderHandbookSection('The Chain of Command', '🔗')}
          </div>
        </div>
      </div>
    `;
  }
"""
    content = content.replace(
        "function renderProgram() {",
        render_roles_fn + "\n  function renderProgram() {"
    )

with open('src/components/training.js', 'w') as f:
    f.write(content)

print("Wired up new tabs in training.js")
