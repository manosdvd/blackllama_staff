import { trainingCultureData } from '../data/handbookData.js';
import { rawHandbook } from '../data/rawHandbook.js';

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function renderHandbookSection(h3Title, icon = '📖') {
  let query = h3Title;
  const section = rawHandbook.find(s => s.title === query || s.h3 === query || s.h2 === query || s.h1 === query);
  if (!section) return '';
  return `
    <details class="glass-panel training-accordion-card" style="border-left: 4px solid hsl(var(--primary));">
      <summary class="training-accordion-summary" style="padding: 14px 18px;">
        <div class="training-accordion-header">
          <h4 style="font-weight: 700; margin: 0; font-size: 15px;">${icon} ${section.title}</h4>
        </div>
        <span class="training-accordion-toggle">▼</span>
      </summary>
      <div class="training-accordion-details" style="padding: 0 18px 14px 18px;">
        <div style="font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.5; white-space: pre-wrap;">
          ${escapeHtml(section.content)}
        </div>
      </div>
    </details>
  `;
}

export function renderTraining() {
  return `
    <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
      <!-- Tab Selectors -->
      <div class="schedule-tabs-container">
        <button class="schedule-tab-btn active" id="training-tab-scouting">Scouting & Pillars</button>
        <button class="schedule-tab-btn" id="training-tab-culture">Mission, Rules & Self-Care</button>
        <button class="schedule-tab-btn" id="training-tab-service">Customer Service (Disney & FISH)</button>
        <button class="schedule-tab-btn" id="training-tab-program">Program Controls & Discipline</button>
        <button class="schedule-tab-btn" id="training-tab-roles">Staff Structure</button>
        <button class="schedule-tab-btn" id="training-tab-communication">Communication & Duties</button>
      </div>

      <!-- Panel Mount -->
      <div id="training-panel-mount"></div>
    </div>
  `;
}

export function initTraining() {
  const scoutingBtn = document.getElementById('training-tab-scouting');
  const cultureBtn = document.getElementById('training-tab-culture');
  const serviceBtn = document.getElementById('training-tab-service');
  const programBtn = document.getElementById('training-tab-program');
  const rolesBtn = document.getElementById('training-tab-roles');
  const commsBtn = document.getElementById('training-tab-communication');
  const panelMount = document.getElementById('training-panel-mount');

  if (!panelMount) return;

  let currentEdgeStep = 0;
  const edgeSteps = [
    {
      title: "1. Explain (Talk about it)",
      desc: "Tell them what you are going to do and why it is important. Describe the steps, use analogies, and encourage questions before touching any ropes.",
      tip: "💡 <strong>Camp Tip:</strong> Tell the scouts: 'Today we will learn the Square Knot, which is used to join two ropes of equal width. Remember the rule: Left over right, right over left.'",
      badge: "🗣️"
    },
    {
      title: "2. Demonstrate (Show it)",
      desc: "Perform the skill yourself slowly and clearly. Talk through each action as you do it. Make sure they have a clear line of sight from your perspective.",
      tip: "💡 <strong>Camp Tip:</strong> Tie the knot in front of them slowly. Say: 'I take the left rope, put it over the right one, twist it under. Now I take the right rope, put it over the left, twist it under, and pull.'",
      badge: "👀"
    },
    {
      title: "3. Guide (Practice together)",
      desc: "Hand the materials to the learner. Let them try the skill while you guide them verbally. Offer encouraging corrections. Do not tie the knot for them!",
      tip: "💡 <strong>Camp Tip:</strong> Hand them the ropes. Let them try. If they get stuck, ask questions: 'Which side did you put over first? Yes, left over right. Now what is the next part?'",
      badge: "🤝"
    },
    {
      title: "4. Enable (Let them lead)",
      desc: "Step back and let them do it independently. They have mastered the skill when they can do it without your guidance and can explain it to someone else.",
      tip: "💡 <strong>Camp Tip:</strong> Ask the scout to tie three square knots successfully. Then ask them to teach it to a new scout. Once they can teach it, they are fully enabled!",
      badge: "🎓"
    }
  ];

  function updateEdgeSimulator() {
    const stepContent = document.getElementById('edge-step-content');
    const prevBtn = document.getElementById('edge-prev-btn');
    const nextBtn = document.getElementById('edge-next-btn');
    const progressSteps = document.querySelectorAll('.edge-progress-step');

    if (!stepContent) return;

    const step = edgeSteps[currentEdgeStep];
    stepContent.innerHTML = `
      <div style="display: flex; gap: 16px; align-items: flex-start; animation: tabFadeIn 0.3s ease both;">
        <div style="font-size: 48px; background: hsl(var(--primary) / 0.1); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          ${step.badge}
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <h4 style="font-size: 18px; color: hsl(var(--primary)); font-family: var(--font-heading); margin: 0;">${step.title}</h4>
          <p style="font-size: 13.5px; line-height: 1.5; color: hsl(var(--foreground)); margin: 0;">${step.desc}</p>
          <div style="background: hsl(var(--card)); border: 1px solid hsl(var(--border)); padding: 10px 14px; border-radius: var(--radius-sm); font-size: 13px; line-height: 1.4; margin-top: 4px; color: hsl(var(--muted-foreground)); font-weight: 500;">
            ${step.tip}
          </div>
        </div>
      </div>
    `;

    progressSteps.forEach((bar, idx) => {
      if (idx <= currentEdgeStep) {
        bar.style.background = 'hsl(var(--accent))';
      } else {
        bar.style.background = 'hsl(var(--muted-foreground) / 0.2)';
      }
    });

    prevBtn.disabled = currentEdgeStep === 0;
    if (currentEdgeStep === edgeSteps.length - 1) {
      nextBtn.innerHTML = `Restart Simulator 🔄`;
    } else {
      const nextStepName = edgeSteps[currentEdgeStep + 1].title.split(" ")[1];
      nextBtn.innerHTML = `Next step (${nextStepName}) ➜`;
    }
  }

  function setupEdgeListeners() {
    const prevBtn = document.getElementById('edge-prev-btn');
    const nextBtn = document.getElementById('edge-next-btn');

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentEdgeStep > 0) {
          currentEdgeStep--;
          updateEdgeSimulator();
        }
      });

      nextBtn.addEventListener('click', () => {
        if (currentEdgeStep < edgeSteps.length - 1) {
          currentEdgeStep++;
          updateEdgeSimulator();
        } else {
          currentEdgeStep = 0;
          updateEdgeSimulator();
        }
      });
    }
  }

  function setupFlipListeners() {
    const cards = panelMount.querySelectorAll('.flip-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });
    });
  }

  
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

function renderService() {
    scoutingBtn.classList.remove('active');
    cultureBtn.classList.remove('active');
    serviceBtn.classList.add('active');
    programBtn.classList.remove('active');
    if (rolesBtn) rolesBtn.classList.remove('active');
    if (commsBtn) commsBtn.classList.remove('active');

    panelMount.innerHTML = `
      <div class="schedule-content-panel" style="animation: tabFadeIn 0.3s ease both;">
        
        <!-- Dennis Snow Section -->
        <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px;">
          <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
            <span>🏰</span> Dennis Snow's Disney Customer Service Tips
          </h3>
          <p style="font-size: 14.5px; color: hsl(var(--muted-foreground)); line-height: 1.5;">
            Encouraging an atmosphere where scouts can thrive is our highest goal. Dennis Snow's principles help us deliver magical customer service. <strong>Click cards to flip:</strong>
          </p>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 16px; margin-top: 8px;">
            
            <div class="flip-card" style="height: 180px;">
              <div class="flip-card-inner">
                <div class="flip-card-front" style="text-align: left; align-items: flex-start; justify-content: flex-start;">
                  <span style="font-size: 24px; margin-bottom: 6px;">🤝</span>
                  <h4 style="font-weight: 700; font-size: 15px;">1. Hire for Attitude</h4>
                  <p style="font-size: 12.5px; color: hsl(var(--muted-foreground)); margin-top: 4px;">Prioritize natural friendliness and values over raw skills.</p>
                  <span style="font-size: 10px; color: hsl(var(--muted-foreground)); margin-top: auto; align-self: flex-end;">Click to flip</span>
                </div>
                <div class="flip-card-back">
                  <h4 style="font-weight: 700; color: hsl(var(--primary)); font-size: 15px; margin-bottom: 6px;">Hire for Attitude</h4>
                  <p style="font-size: 12.5px; line-height: 1.4; color: hsl(var(--muted-foreground));">It's easy to train someone on outdoor knots or range safety, but you can't train natural kindness or a warm smile. We select for character first!</p>
                </div>
              </div>
            </div>

            <div class="flip-card" style="height: 180px;">
              <div class="flip-card-inner">
                <div class="flip-card-front" style="text-align: left; align-items: flex-start; justify-content: flex-start;">
                  <span style="font-size: 24px; margin-bottom: 6px;">👀</span>
                  <h4 style="font-weight: 700; font-size: 15px;">2. Everything Speaks</h4>
                  <p style="font-size: 12.5px; color: hsl(var(--muted-foreground)); margin-top: 4px;">Every minor detail sends a message about how much we care.</p>
                  <span style="font-size: 10px; color: hsl(var(--muted-foreground)); margin-top: auto; align-self: flex-end;">Click to flip</span>
                </div>
                <div class="flip-card-back">
                  <h4 style="font-weight: 700; color: hsl(var(--primary)); font-size: 15px; margin-bottom: 6px;">Everything Speaks</h4>
                  <p style="font-size: 12.5px; line-height: 1.4; color: hsl(var(--muted-foreground));">From trash on the trail to the tone of your voice on the radio, every detail matters. Leaders and scouts judge the camp based on these minor points.</p>
                </div>
              </div>
            </div>

            <div class="flip-card" style="height: 180px;">
              <div class="flip-card-inner">
                <div class="flip-card-front" style="text-align: left; align-items: flex-start; justify-content: flex-start;">
                  <span style="font-size: 24px; margin-bottom: 6px;">🎭</span>
                  <h4 style="font-weight: 700; font-size: 15px;">3. It's a Stage</h4>
                  <p style="font-size: 12.5px; color: hsl(var(--muted-foreground)); margin-top: 4px;">Maintain a clear boundary between "onstage" & "backstage".</p>
                  <span style="font-size: 10px; color: hsl(var(--muted-foreground)); margin-top: auto; align-self: flex-end;">Click to flip</span>
                </div>
                <div class="flip-card-back">
                  <h4 style="font-weight: 700; color: hsl(var(--primary)); font-size: 15px; margin-bottom: 6px;">It's a Stage</h4>
                  <p style="font-size: 12.5px; line-height: 1.4; color: hsl(var(--muted-foreground));">You are a cast member. Keep logistics issues or personal fatigue backstage. The camp experience should always feel positive and magical to scouts.</p>
                </div>
              </div>
            </div>

            <div class="flip-card" style="height: 180px;">
              <div class="flip-card-inner">
                <div class="flip-card-front" style="text-align: left; align-items: flex-start; justify-content: flex-start;">
                  <span style="font-size: 24px; margin-bottom: 6px;">🗺️</span>
                  <h4 style="font-weight: 700; font-size: 15px;">4. Map First</h4>
                  <p style="font-size: 12.5px; color: hsl(var(--muted-foreground)); margin-top: 4px;">Pre-empt service breakdowns by mapping the camper's journey.</p>
                  <span style="font-size: 10px; color: hsl(var(--muted-foreground)); margin-top: auto; align-self: flex-end;">Click to flip</span>
                </div>
                <div class="flip-card-back">
                  <h4 style="font-weight: 700; color: hsl(var(--primary)); font-size: 15px; margin-bottom: 6px;">Map First</h4>
                  <p style="font-size: 12.5px; line-height: 1.4; color: hsl(var(--muted-foreground));">Identify key touchpoints where scouts might get confused or frustrated (e.g. arrivals, check-in, water stops) and address issues before they occur.</p>
                </div>
              </div>
            </div>

            <div class="flip-card" style="height: 180px; grid-column: span 1;">
              <div class="flip-card-inner">
                <div class="flip-card-front" style="text-align: left; align-items: flex-start; justify-content: flex-start;">
                  <span style="font-size: 24px; margin-bottom: 6px;">⚙️</span>
                  <h4 style="font-weight: 700; font-size: 15px;">5. Systems over Scripts</h4>
                  <p style="font-size: 12.5px; color: hsl(var(--muted-foreground)); margin-top: 4px;">Reliable systems are better than robotic scripts.</p>
                  <span style="font-size: 10px; color: hsl(var(--muted-foreground)); margin-top: auto; align-self: flex-end;">Click to flip</span>
                </div>
                <div class="flip-card-back">
                  <h4 style="font-weight: 700; color: hsl(var(--primary)); font-size: 15px; margin-bottom: 6px;">Systems over Scripts</h4>
                  <p style="font-size: 12.5px; line-height: 1.4; color: hsl(var(--muted-foreground));">Build repeatable, effective methods (like clear duty lists, lesson plans) that allow natural personality to shine instead of forcing strict formulas.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- FISH Philosophy Section -->
        <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px;">
          <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
            <span>🐟</span> FISH Philosophy
          </h3>
          <p style="font-size: 14.5px; color: hsl(var(--muted-foreground)); line-height: 1.5;">
            Our day-to-day work atmosphere is vital. Use the 4 core concepts of the FISH Philosophy to stay motivated and create positive energy:
          </p>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 16px; margin-top: 8px;">
            
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                  <span style="font-size: 32px;">🤪</span>
                  <h4 style="font-weight: 700; margin-top: 8px;">Play</h4>
                  <span style="font-size: 11px; color: hsl(var(--muted-foreground)); margin-top: auto;">Click to Flip</span>
                </div>
                <div class="flip-card-back">
                  <h4 style="font-weight: 700; color: hsl(var(--primary)); margin-bottom: 8px;">Play</h4>
                  <p style="font-size: 12.5px; line-height: 1.4; color: hsl(var(--muted-foreground));">Bring a lighthearted, creative, spontaneous energy to camp. Work hard but find fun and excitement in routine chores and responsibilities.</p>
                </div>
              </div>
            </div>

            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                  <span style="font-size: 32px;">💝</span>
                  <h4 style="font-weight: 700; margin-top: 8px;">Make Their Day</h4>
                  <span style="font-size: 11px; color: hsl(var(--muted-foreground)); margin-top: auto;">Click to Flip</span>
                </div>
                <div class="flip-card-back">
                  <h4 style="font-weight: 700; color: hsl(var(--primary)); margin-bottom: 8px;">Make Their Day</h4>
                  <p style="font-size: 12.5px; line-height: 1.4; color: hsl(var(--muted-foreground));">Deliver small, unexpected gestures—remembering a name, sharing a genuine laugh, validating a concern. Leave a positive imprint on someone.</p>
                </div>
              </div>
            </div>

            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                  <span style="font-size: 32px;">👁️</span>
                  <h4 style="font-weight: 700; margin-top: 8px;">Be There</h4>
                  <span style="font-size: 11px; color: hsl(var(--muted-foreground)); margin-top: auto;">Click to Flip</span>
                </div>
                <div class="flip-card-back">
                  <h4 style="font-weight: 700; color: hsl(var(--primary)); margin-bottom: 8px;">Be There</h4>
                  <p style="font-size: 12.5px; line-height: 1.4; color: hsl(var(--muted-foreground));">Give your full, undivided attention to the person in front of you. Put away distractions and listen. Make them feel like they are the only thing that matters.</p>
                </div>
              </div>
            </div>

            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                  <span style="font-size: 32px;">⚖️</span>
                  <h4 style="font-weight: 700; margin-top: 8px;">Choose Your Attitude</h4>
                  <span style="font-size: 11px; color: hsl(var(--muted-foreground)); margin-top: auto;">Click to Flip</span>
                </div>
                <div class="flip-card-back">
                  <h4 style="font-weight: 700; color: hsl(var(--primary)); margin-bottom: 8px;">Choose Your Attitude</h4>
                  <p style="font-size: 12.5px; line-height: 1.4; color: hsl(var(--muted-foreground));">Take total responsibility for the mindset you bring to work. You can't control the weather or issues, but you can control how you react to them.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    `;
    setupFlipListeners();
  }

  function renderCulture() {
    scoutingBtn.classList.remove('active');
    cultureBtn.classList.add('active');
    serviceBtn.classList.remove('active');
    programBtn.classList.remove('active');
    if (rolesBtn) rolesBtn.classList.remove('active');
    if (commsBtn) commsBtn.classList.remove('active');

    const rulesHtml = trainingCultureData.rules ? trainingCultureData.rules.map((rule, idx) => `
      <details class="glass-panel training-accordion-card" style="border-left: 4px solid hsl(var(--danger));">
        <summary class="training-accordion-summary" style="padding: 14px 18px;">
          <div class="training-accordion-header">
            <h4 style="font-weight: 700; margin: 0; font-size: 14.5px;">⚠️ ${rule.title}</h4>
          </div>
          <span class="training-accordion-toggle">▼</span>
        </summary>
        <div class="training-accordion-details" style="padding: 0 18px 14px 18px;">
          <p style="margin: 0; font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.45;">${rule.content}</p>
        </div>
      </details>
    `).join('') : '';

    const stressHtml = trainingCultureData.stressManagement.map((step, idx) => `
      <details class="glass-panel training-accordion-card" style="border-left: 4px solid hsl(var(--accent));">
        <summary class="training-accordion-summary" style="padding: 14px 18px;">
          <div class="training-accordion-header">
            <h4 style="font-weight: 700; margin: 0; font-size: 14.5px;">${step.step}</h4>
          </div>
          <span class="training-accordion-toggle">▼</span>
        </summary>
        <div class="training-accordion-details" style="padding: 0 18px 14px 18px;">
          <p style="margin: 0; font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.45;">${step.description}</p>
        </div>
      </details>
    `).join('');

    const glossaryHtml = trainingCultureData.glossary.map((term, idx) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid hsl(var(--border)); font-weight: 600;">${term.term}</td>
        <td style="padding: 10px; border-bottom: 1px solid hsl(var(--border)); color: hsl(var(--muted-foreground)); font-size: 14px;">${term.def}</td>
      </tr>
    `).join('');

    panelMount.innerHTML = `
      <div class="schedule-content-panel" style="animation: tabFadeIn 0.3s ease both;">
        
        <!-- Mission & Vision -->
        <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px; background: linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--accent) / 0.1));">
          <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
            <span>🚀</span> Mission & Vision
          </h3>
          <p style="font-size: 15px; font-weight: 500; font-style: italic; line-height: 1.5; text-align: center;">
            "${trainingCultureData.mission.statement}"
          </p>
        </div>

        <!-- Rules -->
        <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px;">
          <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
            <span>⚠️</span> Camp Rules
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 16px;">
            ${rulesHtml}
          </div>
        </div>

        <!-- Stress Management -->
        <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px;">
          <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
            <span>💆</span> Stress Management (Mental Stability)
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 16px;">
            ${stressHtml}
          </div>
        </div>

        <!-- Glossary -->
        <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px;">
          <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
            <span>📖</span> Camp Lawton Glossary
          </h3>
          <div style="overflow-x: auto; width: 100%;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; min-width: 400px;">
              <thead>
                <tr>
                  <th style="padding: 10px; border-bottom: 2px solid hsl(var(--border)); color: hsl(var(--primary)); font-family: var(--font-heading);">Term</th>
                  <th style="padding: 10px; border-bottom: 2px solid hsl(var(--border)); color: hsl(var(--primary)); font-family: var(--font-heading);">Definition</th>
                </tr>
              </thead>
              <tbody>
                ${glossaryHtml}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  }

  
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
        <!-- Appended Culture -->
        <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 24px;">
          ${renderHandbookSection('The Rules', '📜')}
          ${renderHandbookSection('Stress Management and Mental Stability', '🧘')}
          ${renderHandbookSection('Glossary', '📖')}
        </div>
      </div>
    `;
  }

  function renderProgram() {
    scoutingBtn.classList.remove('active');
    cultureBtn.classList.remove('active');
    serviceBtn.classList.remove('active');
    programBtn.classList.add('active');
    if (rolesBtn) rolesBtn.classList.remove('active');
    if (commsBtn) commsBtn.classList.remove('active');

    panelMount.innerHTML = `
      <div class="schedule-content-panel" style="animation: tabFadeIn 0.3s ease both;">
        
        <!-- Lesson Planning -->
        <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px;">
          <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
            <span>📋</span> Area Directors: Lesson Planning Essentials
          </h3>
          <p style="font-size: 14.5px; color: hsl(var(--muted-foreground)); line-height: 1.5;">
            Area Directors must prepare structured lesson plans for merit badges prior to Staff Week. A successful plan includes:
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 14px;">
            <details class="glass-panel training-accordion-card">
              <summary class="training-accordion-summary" style="padding: 14px 18px;">
                <div class="training-accordion-header">
                  <h4 style="font-weight: 700; margin: 0; font-size: 14.5px;">📚 Use Official Publications</h4>
                </div>
                <span class="training-accordion-toggle">▼</span>
              </summary>
              <div class="training-accordion-details" style="padding: 0 18px 14px 18px;">
                <p style="margin: 0; font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.45;">Follow Scouting America merit badge pamphlets. Teach no more and no less than what the requirement states. Do not add extra criteria or pass scouts who have not completed all requirements.</p>
              </div>
            </details>
            <details class="glass-panel training-accordion-card">
              <summary class="training-accordion-summary" style="padding: 14px 18px;">
                <div class="training-accordion-header">
                  <h4 style="font-weight: 700; margin: 0; font-size: 14.5px;">🧩 Session Divisions & Themes</h4>
                </div>
                <span class="training-accordion-toggle">▼</span>
              </summary>
              <div class="training-accordion-details" style="padding: 0 18px 14px 18px;">
                <p style="margin: 0; font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.45;">Divide requirements appropriately over the sessions. Define daily themes and start with a quick review of the previous day's material to reinforce learning.</p>
              </div>
            </details>
            <details class="glass-panel training-accordion-card">
              <summary class="training-accordion-summary" style="padding: 14px 18px;">
                <div class="training-accordion-header">
                  <h4 style="font-weight: 700; margin: 0; font-size: 14.5px;">🎮 Engaging Methods</h4>
                </div>
                <span class="training-accordion-toggle">▼</span>
              </summary>
              <div class="training-accordion-details" style="padding: 0 18px 14px 18px;">
                <p style="margin: 0; font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.45;">Incorporate active games, hands-on activities, and interesting trivia beyond the book. Keep it simple, interactive, and make it fun for all scouts.</p>
              </div>
            </details>
            <details class="glass-panel training-accordion-card">
              <summary class="training-accordion-summary" style="padding: 14px 18px;">
                <div class="training-accordion-header">
                  <h4 style="font-weight: 700; margin: 0; font-size: 14.5px;">🎯 Objectives & Continuums</h4>
                </div>
                <span class="training-accordion-toggle">▼</span>
              </summary>
              <div class="training-accordion-details" style="padding: 0 18px 14px 18px;">
                <p style="margin: 0; font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.45;">Communicate clear learning objectives, establish specific deadlines for assignments, and structure lessons logically from simple foundations to complex skills.</p>
              </div>
            </details>
          </div>
        </div>

        <!-- Safety Inspection Controls -->
        <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px;">
          <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
            <span>🛡️</span> Program Area Safety Controls
          </h3>
          <p style="font-size: 14.5px; color: hsl(var(--muted-foreground)); line-height: 1.5;">
            Maintenance committees prepare camp facilities, but Area Directors are responsible for ongoing safety audits. Click to expand details:
          </p>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <details class="glass-panel training-accordion-card">
              <summary class="training-accordion-summary" style="padding: 12px 16px;">
                <div class="training-accordion-header">
                  <h4 style="font-weight: 700; font-size: 14.5px; margin: 0;">🔍 Inspect & Flag</h4>
                </div>
                <span class="training-accordion-toggle">▼</span>
              </summary>
              <div class="training-accordion-details" style="padding: 0 16px 12px 16px; font-size: 13px; color: hsl(var(--muted-foreground));">
                Carefully examine your entire program area daily. Identify and flag hazards (dangerous trees, trail obstructions, damaged fences, loose benches) to ensure camper and staff safety.
              </div>
            </details>
            <details class="glass-panel training-accordion-card">
              <summary class="training-accordion-summary" style="padding: 12px 16px;">
                <div class="training-accordion-header">
                  <h4 style="font-weight: 700; font-size: 14.5px; margin: 0;">📝 Report</h4>
                </div>
                <span class="training-accordion-toggle">▼</span>
              </summary>
              <div class="training-accordion-details" style="padding: 0 16px 12px 16px; font-size: 13px; color: hsl(var(--muted-foreground));">
                Report structural hazards to the Camp Ranger and Camp Director to establish a safety management or correction plan.
              </div>
            </details>
            <details class="glass-panel training-accordion-card">
              <summary class="training-accordion-summary" style="padding: 12px 16px;">
                <div class="training-accordion-header">
                  <h4 style="font-weight: 700; font-size: 14.5px; margin: 0;">🔒 Security</h4>
                </div>
                <span class="training-accordion-toggle">▼</span>
              </summary>
              <div class="training-accordion-details" style="padding: 0 16px 12px 16px; font-size: 13px; color: hsl(var(--muted-foreground));">
                Always lock away and secure all tools, weapons, and specialized gear (e.g. rifles, bows, climbing gear) after operating hours.
              </div>
            </details>
            <details class="glass-panel training-accordion-card">
              <summary class="training-accordion-summary" style="padding: 12px 16px;">
                <div class="training-accordion-header">
                  <h4 style="font-weight: 700; font-size: 14.5px; margin: 0;">✨ Cleanliness & Aesthetics</h4>
                </div>
                <span class="training-accordion-toggle">▼</span>
              </summary>
              <div class="training-accordion-details" style="padding: 0 16px 12px 16px; font-size: 13px; color: hsl(var(--muted-foreground));">
                Keep the area tidy. Clean up trash piles, fix broken tables, and maintain a professional appearance. Daily trash goes to the bins behind the kitchen.
              </div>
            </details>
          </div>
        </div>

        <!-- Discipline & Group Control -->
        <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px; border-left: 4px solid hsl(var(--danger));">
          <h3 style="color: hsl(var(--danger)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
            <span>👮</span> Discipline & Group Control Guidelines
          </h3>
          <p style="font-size: 14.5px; color: hsl(var(--muted-foreground)); line-height: 1.5;">
            We maintain a safe, positive environment. Discipline must reflect Scouting's values. Keep these absolute boundaries in mind:
          </p>
          <div style="background: hsl(var(--danger) / 0.03); border: 1px dashed hsl(var(--danger) / 0.3); padding: 16px; border-radius: var(--radius-sm); display: flex; flex-direction: column; gap: 10px; font-size: 14px; line-height: 1.5;">
            <div>🛑 <strong>Strictly Prohibited:</strong> Physical (corporal) punishment, isolation, humiliation, sarcasm, and ridicule are illegal and violate Scouting rules. Never use these under any circumstance.</div>
            <div>🤝 <strong>Role of Staff:</strong> Program staff do not administer discipline to scouts. If a scout is disruptive, uncooperative, or violating rules, <strong>refer the matter immediately to their Troop Scoutmaster</strong> or camp leadership.</div>
            <div>👥 <strong>Youth Protection:</strong> Ensure a minimum of two adults (21+) are present for all activities (two-deep leadership) and avoid one-on-one contact.</div>
          </div>
        </div>

      </div>
    `;
  }

  function renderRoles() {
    scoutingBtn.classList.remove('active');
    cultureBtn.classList.remove('active');
    serviceBtn.classList.remove('active');
    programBtn.classList.remove('active');
    if (rolesBtn) rolesBtn.classList.add('active');

    panelMount.innerHTML = `
      <div class="schedule-content-panel" style="animation: tabFadeIn 0.3s ease both;">
        
        <!-- Staff Structures and Classifications -->
        <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px;">
          <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
            <span>👥</span> Staff Role Classifications & Structure
          </h3>
          <p style="font-size: 14.5px; color: hsl(var(--muted-foreground)); line-height: 1.5;">
            Camp Lawton operates with distinct role tiers to comply with national standards and Arizona labor guidelines. Every colleague deserves full professional respect.
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 16px;">
            
            <details class="glass-panel training-accordion-card" style="border-top: 3px solid hsl(var(--primary));">
              <summary class="training-accordion-summary" style="padding: 16px 20px;">
                <div class="training-accordion-header">
                  <h4 style="font-weight: 700; margin: 0; color: hsl(var(--primary));">🎓 Counselors-in-Training (CIT)</h4>
                </div>
                <span class="training-accordion-toggle">▼</span>
              </summary>
              <div class="training-accordion-details" style="padding: 0 20px 16px 20px;">
                <p style="font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.45; margin: 0 0 8px 0;">
                  <strong>Ages 14-15.</strong> CITs are part of a training program (similar to interns). Labor laws strictly limit their schedule to between <strong>7 AM and 9 PM</strong> and a maximum of <strong>8 hours/day</strong>. They must be supervised by qualified staff.
                </p>
                <span style="font-size: 12px; font-weight: 700; color: hsl(var(--danger)); display: block; border-top: 1px solid hsl(var(--border) / 0.5); padding-top: 8px; margin-top: 4px;">
                  ⚠️ Critical Rule: Never leave a CIT to teach a merit badge alone. They are not clean-up servants; they are here to learn.
                </span>
              </div>
            </details>

            <details class="glass-panel training-accordion-card" style="border-top: 3px solid hsl(var(--accent));">
              <summary class="training-accordion-summary" style="padding: 16px 20px;">
                <div class="training-accordion-header">
                  <h4 style="font-weight: 700; margin: 0; color: hsl(var(--accent));">🏹 Junior Staff</h4>
                </div>
                <span class="training-accordion-toggle">▼</span>
              </summary>
              <div class="training-accordion-details" style="padding: 0 20px 16px 20px;">
                <p style="font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.45; margin: 0;">
                  <strong>Ages 16-17.</strong> A highly fulfilling summer job. Studies show camp staff roles prepare youth for the workforce better than retail or food service, building strong interpersonal, teaching, public speaking, and crisis-management skills.
                </p>
              </div>
            </details>

            <details class="glass-panel training-accordion-card" style="border-top: 3px solid #3b82f6;">
              <summary class="training-accordion-summary" style="padding: 16px 20px;">
                <div class="training-accordion-header">
                  <h4 style="font-weight: 700; margin: 0; color: #3b82f6;">🏕️ Adult Staff</h4>
                </div>
                <span class="training-accordion-toggle">▼</span>
              </summary>
              <div class="training-accordion-details" style="padding: 0 20px 16px 20px;">
                <p style="font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.45; margin: 0;">
                  <strong>Ages 18+.</strong> Generally includes Area Directors. Subject to full Safeguarding Youth (YPT) rules, which require two-deep adult leadership and strictly prohibit one-on-one contact. Adults are not exempt from program logs, campfire leading, or cleanup chores.
                </p>
              </div>
            </details>

            <details class="glass-panel training-accordion-card" style="border-top: 3px solid #8b5cf6;">
              <summary class="training-accordion-summary" style="padding: 16px 20px;">
                <div class="training-accordion-header">
                  <h4 style="font-weight: 700; margin: 0; color: #8b5cf6;">⚙️ Support Staff</h4>
                </div>
                <span class="training-accordion-toggle">▼</span>
              </summary>
              <div class="training-accordion-details" style="padding: 0 20px 16px 20px;">
                <p style="font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.45; margin: 0;">
                  Includes <strong>Kitchen, Maintenance, Commissioners, Health Lodge, Trading Post, and HQ</strong>. These departments are every bit as vital as program areas to keep the camp running smoothly. Support staff deserve the exact same respect and courtesy as any instruction leader.
                </p>
              </div>
            </details>

          </div>
        </div>

        <!-- NCS / National Camp School Certification Roles -->
        <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px;">
          <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
            <span>⚜️</span> NCS Certification & Age Requirements (NCAP Standards)
          </h3>
          <p style="font-size: 14.5px; color: hsl(var(--muted-foreground)); line-height: 1.5;">
            To meet the National Camp Accreditation Program (NCAP) standards, key leadership positions require National Camp School training or equivalent third-party credentials.
          </p>
          
          <div style="overflow-x: auto; width: 100%;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; min-width: 500px; font-size: 13.5px;">
              <thead>
                <tr style="border-bottom: 2px solid hsl(var(--border)); color: hsl(var(--primary)); font-family: var(--font-heading);">
                  <th style="padding: 10px;">Camp Position</th>
                  <th style="padding: 10px;">Min. Age</th>
                  <th style="padding: 10px;">Required Certification / Training</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid hsl(var(--border));">
                  <td style="padding: 10px; font-weight: 600;">Camp Director</td>
                  <td style="padding: 10px;">21</td>
                  <td style="padding: 10px; color: hsl(var(--muted-foreground));">NCS Camp Director Certification (Valid for 5 years)</td>
                </tr>
                <tr style="border-bottom: 1px solid hsl(var(--border));">
                  <td style="padding: 10px; font-weight: 600;">Program Director</td>
                  <td style="padding: 10px;">21</td>
                  <td style="padding: 10px; color: hsl(var(--muted-foreground));">NCS Program Director Certification (Valid for 5 years)</td>
                </tr>
                <tr style="border-bottom: 1px solid hsl(var(--border));">
                  <td style="padding: 10px; font-weight: 600;">Range Activities Director / Archery Director</td>
                  <td style="padding: 10px;">21 / 18</td>
                  <td style="padding: 10px; color: hsl(var(--muted-foreground));">NCS Shooting Sports / Archery Director Certification</td>
                </tr>
                <tr style="border-bottom: 1px solid hsl(var(--border));">
                  <td style="padding: 10px; font-weight: 600;">Climbing Director</td>
                  <td style="padding: 10px;">21</td>
                  <td style="padding: 10px; color: hsl(var(--muted-foreground));">NCS Climbing Certification</td>
                </tr>
                <tr style="border-bottom: 1px solid hsl(var(--border));">
                  <td style="padding: 10px; font-weight: 600;">Trek / High Adventure Director</td>
                  <td style="padding: 10px;">21</td>
                  <td style="padding: 10px; color: hsl(var(--muted-foreground));">NCS Trek/High Adventure Certification</td>
                </tr>
                <tr style="border-bottom: 1px solid hsl(var(--border));">
                  <td style="padding: 10px; font-weight: 600;">Outdoor Skills / Nature Directors</td>
                  <td style="padding: 10px;">18</td>
                  <td style="padding: 10px; color: hsl(var(--muted-foreground));">NCS or approved equivalent training in Scoutcraft / Ecology</td>
                </tr>
                <tr style="border-bottom: 1px solid hsl(var(--border));">
                  <td style="padding: 10px; font-weight: 600;">Camp Health Officer</td>
                  <td style="padding: 10px;">21</td>
                  <td style="padding: 10px; color: hsl(var(--muted-foreground));">Arizona state-approved license (EMT, RN, MD, CNA, or paramedic)</td>
                </tr>
                <tr style="border-bottom: 1px solid hsl(var(--border));">
                  <td style="padding: 10px; font-weight: 600;">Camp Ranger</td>
                  <td style="padding: 10px;">21</td>
                  <td style="padding: 10px; color: hsl(var(--muted-foreground));">"Camp Ranger Basic" training from Scouting U + annual continuing education</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style="font-size: 12.5px; font-style: italic; color: hsl(var(--muted-foreground)); margin: 4px 0 0 0;">
            * National Camp School is a week-long program. Catalina Council typically covers the attendance cost for required positions.
          </p>
        </div>

      </div>
    `;
  }

  scoutingBtn.addEventListener('click', renderScouting);
  cultureBtn.addEventListener('click', renderCulture);
  serviceBtn.addEventListener('click', renderService);
  programBtn.addEventListener('click', renderProgram);
  if (rolesBtn) rolesBtn.addEventListener('click', renderRoles);

  renderScouting();
}
