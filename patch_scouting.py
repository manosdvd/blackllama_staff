import re

with open('src/components/training.js', 'r') as f:
    content = f.read()

# We need to replace the entire renderScouting function.
# It starts at: function renderScouting() {
# It ends right before: function renderService() {
# Let's find the indices.

start_idx = content.find('function renderScouting() {')
end_idx = content.find('function renderService() {')

if start_idx == -1 or end_idx == -1:
    print("Could not find renderScouting or renderService boundaries.")
    exit(1)

# Keep the original renderScouting function's inner code (the HTML strings)
# But we will inject a screen-based structure.

new_render_scouting = """
  function renderScouting() {
    scoutingBtn.classList.add('active');
    cultureBtn.classList.remove('active');
    serviceBtn.classList.remove('active');
    programBtn.classList.remove('active');
    if (rolesBtn) rolesBtn.classList.remove('active');
    if (commsBtn) commsBtn.classList.remove('active');

    if (window.scoutingStep === undefined) window.scoutingStep = 0;

    const sections = [
      {
        title: "Our Mission & Vision",
        html: `
          <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px;">
            <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
              <span>🚀</span> Our Mission & Vision
            </h3>
            <p style="font-size: 14.5px; color: hsl(var(--muted-foreground)); line-height: 1.5;">
              The mission of the Boy Scouts of America is to prepare young people to make ethical and moral choices over their lifetimes by instilling in them the values of the Scout Oath and Law.
            </p>
            <p style="font-size: 14.5px; color: hsl(var(--muted-foreground)); line-height: 1.5;">
              The vision of the Boy Scouts of America is to prepare every eligible youth in America to become a responsible, participating citizen and leader who is guided by the Scout Oath and Law.
            </p>
          </div>
        `
      },
      {
        title: "The Core Pillars of Summer Camp",
        html: `
          <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px;">
            <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
              <span>🌲</span> The Core Pillars of Summer Camp
            </h3>
            <p style="font-size: 14.5px; color: hsl(var(--muted-foreground)); line-height: 1.5;">
              An organized camping program like ours is an educational powerhouse that targets growth in four specific areas:
            </p>
            <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 8px;">
              <details class="glass-panel training-accordion-card" style="border-left: 4px solid hsl(var(--primary));" open>
                <summary class="training-accordion-summary" style="padding: 14px 18px;">
                  <div class="training-accordion-header">
                    <h4 style="font-weight: 700; margin: 0; font-size: 15px;">🏃 Physical Development</h4>
                  </div>
                  <span class="training-accordion-toggle">▼</span>
                </summary>
                <div class="training-accordion-details" style="padding: 0 18px 14px 18px;">
                  <p style="margin: 0; font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.45;">Develops habits of healthy living through balanced meals and supervised physical activities.</p>
                </div>
              </details>
              <details class="glass-panel training-accordion-card" style="border-left: 4px solid hsl(var(--accent));" open>
                <summary class="training-accordion-summary" style="padding: 14px 18px;">
                  <div class="training-accordion-header">
                    <h4 style="font-weight: 700; margin: 0; font-size: 15px;">🧠 Mental Development</h4>
                  </div>
                  <span class="training-accordion-toggle">▼</span>
                </summary>
                <div class="training-accordion-details" style="padding: 0 18px 14px 18px;">
                  <p style="margin: 0; font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.45;">Advancement programs offer challenges that build self-sufficiency and responsibility.</p>
                </div>
              </details>
              <details class="glass-panel training-accordion-card" style="border-left: 4px solid #3b82f6;" open>
                <summary class="training-accordion-summary" style="padding: 14px 18px;">
                  <div class="training-accordion-header">
                    <h4 style="font-weight: 700; margin: 0; font-size: 15px;">🤝 Social Development</h4>
                  </div>
                  <span class="training-accordion-toggle">▼</span>
                </summary>
                <div class="training-accordion-details" style="padding: 0 18px 14px 18px;">
                  <p style="margin: 0; font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.45;">The community of a summer camp helps build strong, morally rich people skills.</p>
                </div>
              </details>
              <details class="glass-panel training-accordion-card" style="border-left: 4px solid #8b5cf6;" open>
                <summary class="training-accordion-summary" style="padding: 14px 18px;">
                  <div class="training-accordion-header">
                    <h4 style="font-weight: 700; margin: 0; font-size: 15px;">🌌 Spiritual Development</h4>
                  </div>
                  <span class="training-accordion-toggle">▼</span>
                </summary>
                <div class="training-accordion-details" style="padding: 0 18px 14px 18px;">
                  <p style="margin: 0; font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.45;">Spiritually rich time in nature helps develop a deeper understanding of a scout's place in the universe.</p>
                </div>
              </details>
            </div>
          </div>
        `
      },
      {
        title: "The Aims of Scouting",
        html: `
          <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px;">
            <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
              <span>🎯</span> The Aims of Scouting
            </h3>
            <p style="font-size: 14.5px; color: hsl(var(--muted-foreground)); line-height: 1.5;">
              These key goals drive all scouting activities:
            </p>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <details class="glass-panel training-accordion-card" open><summary class="training-accordion-summary" style="padding: 12px 16px;"><div class="training-accordion-header"><h4 style="font-weight: 700; font-size: 14.5px; margin: 0;">Character Development</h4></div></summary><div class="training-accordion-details" style="padding: 0 16px 12px 16px; font-size: 13px; color: hsl(var(--muted-foreground));">Fostering personal growth, self-reliance, moral strength, and integrity through the practice of Scouting ideals.</div></details>
              <details class="glass-panel training-accordion-card" open><summary class="training-accordion-summary" style="padding: 12px 16px;"><div class="training-accordion-header"><h4 style="font-weight: 700; font-size: 14.5px; margin: 0;">Citizenship Training</h4></div></summary><div class="training-accordion-details" style="padding: 0 16px 12px 16px; font-size: 13px; color: hsl(var(--muted-foreground));">Preparing youth to participate in, serve, and lead their communities, nations, and the world with civic pride.</div></details>
              <details class="glass-panel training-accordion-card" open><summary class="training-accordion-summary" style="padding: 12px 16px;"><div class="training-accordion-header"><h4 style="font-weight: 700; font-size: 14.5px; margin: 0;">Personal Fitness</h4></div></summary><div class="training-accordion-details" style="padding: 0 16px 12px 16px; font-size: 13px; color: hsl(var(--muted-foreground));">Promoting physical, mental, and emotional health to help youth reach their full potential.</div></details>
              <details class="glass-panel training-accordion-card" open><summary class="training-accordion-summary" style="padding: 12px 16px;"><div class="training-accordion-header"><h4 style="font-weight: 700; font-size: 14.5px; margin: 0;">Leadership</h4></div></summary><div class="training-accordion-details" style="padding: 0 16px 12px 16px; font-size: 13px; color: hsl(var(--muted-foreground));">Providing practical, real-world experiences in guiding, teaching, and organizing others.</div></details>
            </div>
          </div>
        `
      },
      {
        title: "The Methods of Scouting",
        html: `
          <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px;">
            <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
              <span>🧭</span> The Methods of Scouting
            </h3>
            <p style="font-size: 14.5px; color: hsl(var(--muted-foreground)); line-height: 1.5;">
              These are the vehicles through which we deliver the Aims of Scouting:
            </p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
              <details class="glass-panel training-accordion-card" open><summary class="training-accordion-summary" style="padding: 12px 16px;"><div class="training-accordion-header"><h4 style="font-weight: 700; font-size: 14.5px; margin: 0;">Ideals</h4></div></summary><div class="training-accordion-details" style="padding: 0 16px 12px 16px; font-size: 13px; color: hsl(var(--muted-foreground));">Instilling the Scout Oath, Law, Motto, and Slogan.</div></details>
              <details class="glass-panel training-accordion-card" open><summary class="training-accordion-summary" style="padding: 12px 16px;"><div class="training-accordion-header"><h4 style="font-weight: 700; font-size: 14.5px; margin: 0;">Patrol Method</h4></div></summary><div class="training-accordion-details" style="padding: 0 16px 12px 16px; font-size: 13px; color: hsl(var(--muted-foreground));">Small, youth-led groups for cooperation and democracy.</div></details>
              <details class="glass-panel training-accordion-card" open><summary class="training-accordion-summary" style="padding: 12px 16px;"><div class="training-accordion-header"><h4 style="font-weight: 700; font-size: 14.5px; margin: 0;">Outdoor Programs</h4></div></summary><div class="training-accordion-details" style="padding: 0 16px 12px 16px; font-size: 13px; color: hsl(var(--muted-foreground));">Using the natural world as a setting for adventure.</div></details>
              <details class="glass-panel training-accordion-card" open><summary class="training-accordion-summary" style="padding: 12px 16px;"><div class="training-accordion-header"><h4 style="font-weight: 700; font-size: 14.5px; margin: 0;">Advancement</h4></div></summary><div class="training-accordion-details" style="padding: 0 16px 12px 16px; font-size: 13px; color: hsl(var(--muted-foreground));">Self-esteem and goal-setting through merit badges.</div></details>
              <details class="glass-panel training-accordion-card" open><summary class="training-accordion-summary" style="padding: 12px 16px;"><div class="training-accordion-header"><h4 style="font-weight: 700; font-size: 14.5px; margin: 0;">Adult Mentors</h4></div></summary><div class="training-accordion-details" style="padding: 0 16px 12px 16px; font-size: 13px; color: hsl(var(--muted-foreground));">Positive, high-character adult role models.</div></details>
              <details class="glass-panel training-accordion-card" open><summary class="training-accordion-summary" style="padding: 12px 16px;"><div class="training-accordion-header"><h4 style="font-weight: 700; font-size: 14.5px; margin: 0;">Personal Growth</h4></div></summary><div class="training-accordion-details" style="padding: 0 16px 12px 16px; font-size: 13px; color: hsl(var(--muted-foreground));">Self-evaluation, service, and goal achievement.</div></details>
              <details class="glass-panel training-accordion-card" open><summary class="training-accordion-summary" style="padding: 12px 16px;"><div class="training-accordion-header"><h4 style="font-weight: 700; font-size: 14.5px; margin: 0;">Leadership</h4></div></summary><div class="training-accordion-details" style="padding: 0 16px 12px 16px; font-size: 13px; color: hsl(var(--muted-foreground));">Opportunities to lead operations and organize projects.</div></details>
              <details class="glass-panel training-accordion-card" open><summary class="training-accordion-summary" style="padding: 12px 16px;"><div class="training-accordion-header"><h4 style="font-weight: 700; font-size: 14.5px; margin: 0;">Uniform</h4></div></summary><div class="training-accordion-details" style="padding: 0 16px 12px 16px; font-size: 13px; color: hsl(var(--muted-foreground));">Developing equality, belonging, and identity.</div></details>
            </div>
          </div>
        `
      },
      {
        title: "What Makes a Staff?",
        html: `
          <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px;">
            <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
              <span>🤝</span> What Makes a Staff? (The 4 Pillars of Staff)
            </h3>
            <p style="font-size: 14.5px; color: hsl(var(--muted-foreground)); line-height: 1.5;">
              A Camp Staff is more than a group of employees—you are dedicated Scouts leading by example. <strong>Tap/click</strong> on any card to flip it and read the guidelines:
            </p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr)); gap: 16px; margin-top: 8px;">
              <div class="flip-card"><div class="flip-card-inner"><div class="flip-card-front"><span style="font-size: 32px;">🥾</span><h4 style="font-weight: 700; margin-top: 8px;">Appearance</h4><span style="font-size: 11px; color: hsl(var(--muted-foreground)); margin-top: auto;">Click to Flip</span></div><div class="flip-card-back"><h4 style="font-weight: 700; color: hsl(var(--primary)); margin-bottom: 8px;">Appearance</h4><p style="font-size: 12.5px; line-height: 1.4; color: hsl(var(--muted-foreground));">Hygiene, neat uniforms, and how you present yourself. Before you speak, your appearance has already spoken. Dress cleanly, shave regularly, and stay presentable!</p></div></div></div>
              <div class="flip-card"><div class="flip-card-inner"><div class="flip-card-front"><span style="font-size: 32px;">🌟</span><h4 style="font-weight: 700; margin-top: 8px;">Attitude</h4><span style="font-size: 11px; color: hsl(var(--muted-foreground)); margin-top: auto;">Click to Flip</span></div><div class="flip-card-back"><h4 style="font-weight: 700; color: hsl(var(--primary)); margin-bottom: 8px;">Attitude</h4><p style="font-size: 12.5px; line-height: 1.4; color: hsl(var(--muted-foreground));">Stay positive and remember you are here to serve as well as have fun. Be cheerful, supportive, and try to find genuine satisfaction in helping the campers and leaders.</p></div></div></div>
              <div class="flip-card"><div class="flip-card-inner"><div class="flip-card-front"><span style="font-size: 32px;">😊</span><h4 style="font-weight: 700; margin-top: 8px;">Personality</h4><span style="font-size: 11px; color: hsl(var(--muted-foreground)); margin-top: auto;">Click to Flip</span></div><div class="flip-card-back"><h4 style="font-weight: 700; color: hsl(var(--primary)); margin-bottom: 8px;">Personality</h4><p style="font-size: 12.5px; line-height: 1.4; color: hsl(var(--muted-foreground));">Patience, friendliness, humor, respect, and enthusiasm—these key traits make all the difference in making scouts feel welcomed and creating lifelong memories.</p></div></div></div>
              <div class="flip-card"><div class="flip-card-inner"><div class="flip-card-front"><span style="font-size: 32px;">📚</span><h4 style="font-weight: 700; margin-top: 8px;">Knowledge</h4><span style="font-size: 11px; color: hsl(var(--muted-foreground)); margin-top: auto;">Click to Flip</span></div><div class="flip-card-back"><h4 style="font-weight: 700; color: hsl(var(--primary)); margin-bottom: 8px;">Knowledge</h4><p style="font-size: 12.5px; line-height: 1.4; color: hsl(var(--muted-foreground));">Be an authority on what you teach. Know your merit badge requirements. Additionally, understand the structure and general emergency operations of Camp Lawton.</p></div></div></div>
            </div>

            <!-- Interactive EDGE Method step-through -->
            <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 24px;">
              <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
                <span>🎓</span> Interactive EDGE Method Simulator
              </h3>
              <p style="font-size: 14.5px; color: hsl(var(--muted-foreground)); line-height: 1.5;">
                The EDGE method is how we teach skills in Scouting. Use the interactive step-through below to experience the E-D-G-E process for tying a Square Knot:
              </p>

              <div class="edge-simulator-card" style="background: hsl(var(--secondary) / 0.1); border: 1px solid hsl(var(--border)); border-radius: var(--radius-md); padding: 24px; position: relative;">
                <div class="edge-progress-bar" style="display: flex; gap: 8px; margin-bottom: 20px;">
                  <div class="edge-progress-step active" data-step="0" style="flex: 1; height: 6px; background: hsl(var(--accent)); border-radius: 3px; transition: background 0.3s;"></div>
                  <div class="edge-progress-step" data-step="1" style="flex: 1; height: 6px; background: hsl(var(--muted-foreground) / 0.2); border-radius: 3px; transition: background 0.3s;"></div>
                  <div class="edge-progress-step" data-step="2" style="flex: 1; height: 6px; background: hsl(var(--muted-foreground) / 0.2); border-radius: 3px; transition: background 0.3s;"></div>
                  <div class="edge-progress-step" data-step="3" style="flex: 1; height: 6px; background: hsl(var(--muted-foreground) / 0.2); border-radius: 3px; transition: background 0.3s;"></div>
                </div>

                <div id="edge-step-content" style="min-height: 160px; display: flex; flex-direction: column; justify-content: center; gap: 12px; transition: all 0.3s ease;">
                  <!-- Dynamic step content goes here -->
                </div>

                <div style="display: flex; justify-content: space-between; margin-top: 20px; border-top: 1px solid hsl(var(--border) / 0.5); padding-top: 16px;">
                  <button class="welcome-banner-btn" id="edge-prev-btn" style="padding: 8px 16px; font-size: 13.5px;" disabled>Previous</button>
                  <button class="welcome-banner-btn" id="edge-next-btn" style="padding: 8px 16px; font-size: 13.5px;">Next step (Demonstrate) ➜</button>
                </div>
              </div>
            </div>
          </div>
        `
      }
    ];

    function buildScreen() {
      const idx = window.scoutingStep;
      const section = sections[idx];
      panelMount.innerHTML = `
        <div class="schedule-content-panel" style="animation: tabFadeIn 0.3s ease both;">
          
          <!-- Screen Navigation Bar -->
          <div style="display: flex; gap: 8px; margin-bottom: 16px; border-bottom: 1px solid hsl(var(--border) / 0.5); padding-bottom: 16px; overflow-x: auto;">
            ${sections.map((s, i) => `
              <button class="scouting-nav-btn ${i === idx ? 'active' : ''}" data-index="${i}" style="padding: 8px 12px; border-radius: var(--radius-sm); border: none; background: ${i === idx ? 'hsl(var(--primary) / 0.1)' : 'transparent'}; color: ${i === idx ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}; font-weight: ${i === idx ? '600' : '400'}; font-size: 13px; cursor: pointer; white-space: nowrap; transition: all 0.2s;">
                ${i+1}. ${s.title}
              </button>
            `).join('')}
          </div>

          <!-- Screen Content -->
          <div id="scouting-screen-content">
            ${section.html}
          </div>

          <!-- Bottom Navigation controls -->
          <div style="display: flex; justify-content: space-between; margin-top: 24px; padding-top: 20px; border-top: 1px solid hsl(var(--border) / 0.5);">
            <button id="scouting-prev-btn" class="glass-btn" style="padding: 10px 16px;" ${idx === 0 ? 'disabled style="opacity: 0.5;"' : ''}>← Previous</button>
            <span style="font-size: 13px; color: hsl(var(--muted-foreground)); align-self: center;">Screen ${idx + 1} of ${sections.length}</span>
            <button id="scouting-next-btn" class="glass-btn primary" style="padding: 10px 16px;" ${idx === sections.length - 1 ? 'disabled style="opacity: 0.5;"' : ''}>Next →</button>
          </div>
        </div>
      `;

      // Re-attach listeners for the current screen
      if (idx === 4) {
        setupFlipListeners();
        updateEdgeSimulator();
        setupEdgeListeners();
      }

      // Attach navigation listeners
      const prevBtn = document.getElementById('scouting-prev-btn');
      const nextBtn = document.getElementById('scouting-next-btn');
      const navBtns = document.querySelectorAll('.scouting-nav-btn');

      if (prevBtn) prevBtn.addEventListener('click', () => {
        if (window.scoutingStep > 0) { window.scoutingStep--; buildScreen(); }
      });
      if (nextBtn) nextBtn.addEventListener('click', () => {
        if (window.scoutingStep < sections.length - 1) { window.scoutingStep++; buildScreen(); }
      });
      navBtns.forEach(btn => btn.addEventListener('click', (e) => {
        window.scoutingStep = parseInt(e.target.getAttribute('data-index'));
        buildScreen();
      }));
    }

    buildScreen();

    if (commsBtn) commsBtn.addEventListener('click', renderCommunication);
    if (rolesBtn) rolesBtn.addEventListener('click', renderRoles);
  }
"""

new_content = content[:start_idx] + new_render_scouting + "\n" + content[end_idx:]

with open('src/components/training.js', 'w') as f:
    f.write(new_content)

print("Updated renderScouting to use 5 screens.")

