import { trainingCultureData } from '../data/handbookData.js';

export function renderTraining() {
  return `
    <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
      <!-- Tab Selectors -->
      <div class="schedule-tabs-container">
        <button class="schedule-tab-btn active" id="training-tab-scouting">Scouting & Pillars</button>
        <button class="schedule-tab-btn" id="training-tab-culture">Mission, Rules & Self-Care</button>
        <button class="schedule-tab-btn" id="training-tab-service">Customer Service (Disney & FISH)</button>
        <button class="schedule-tab-btn" id="training-tab-program">Program Controls & Discipline</button>
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
  const panelMount = document.getElementById('training-panel-mount');

  if (!panelMount) return;

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

    panelMount.innerHTML = `
      <div class="schedule-content-panel" style="animation: tabFadeIn 0.3s ease both;">
        <!-- Core Pillars -->
        <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px;">
          <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
            <span>🌲</span> The Core Pillars of Summer Camp
          </h3>
          <p style="font-size: 14.5px; color: hsl(var(--muted-foreground)); line-height: 1.5;">
            An organized camping program like ours is an educational powerhouse that targets growth in four specific areas:
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 16px; margin-top: 8px;">
            <div style="background: hsl(var(--card)); border: 1px solid hsl(var(--border)); padding: 18px; border-radius: var(--radius-sm); border-left: 4px solid hsl(var(--primary));">
              <h4 style="font-weight: 700; margin-bottom: 6px;">🏃 Physical</h4>
              <p style="font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.4;">Develops habits of healthy living through balanced meals and supervised physical activities.</p>
            </div>
            <div style="background: hsl(var(--card)); border: 1px solid hsl(var(--border)); padding: 18px; border-radius: var(--radius-sm); border-left: 4px solid hsl(var(--accent));">
              <h4 style="font-weight: 700; margin-bottom: 6px;">🧠 Mental</h4>
              <p style="font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.4;">Advancement programs offer challenges that build self-sufficiency and responsibility.</p>
            </div>
            <div style="background: hsl(var(--card)); border: 1px solid hsl(var(--border)); padding: 18px; border-radius: var(--radius-sm); border-left: 4px solid #3b82f6;">
              <h4 style="font-weight: 700; margin-bottom: 6px;">🤝 Social</h4>
              <p style="font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.4;">The community of a summer camp helps build strong, morally rich people skills.</p>
            </div>
            <div style="background: hsl(var(--card)); border: 1px solid hsl(var(--border)); padding: 18px; border-radius: var(--radius-sm); border-left: 4px solid #8b5cf6;">
              <h4 style="font-weight: 700; margin-bottom: 6px;">🌌 Spiritual</h4>
              <p style="font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.4;">Spiritually rich time in nature helps develop a deeper understanding of a scout's place in the universe.</p>
            </div>
          </div>
        </div>

        <!-- Aims & Methods Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap: 24px;">
          <div class="glass-panel" style="display: flex; flex-direction: column; gap: 12px;">
            <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
              <span>🎯</span> The Aims of Scouting
            </h3>
            <ul style="display: flex; flex-direction: column; gap: 8px; font-size: 14.5px; padding-left: 20px; line-height: 1.5; color: hsl(var(--foreground));">
              <li><strong>Character Development:</strong> Fostering personal growth, self-reliance, and moral strength.</li>
              <li><strong>Citizenship Training:</strong> Preparing youth to participate in and lead their communities.</li>
              <li><strong>Personal Fitness:</strong> Promoting physical, mental, and emotional health.</li>
              <li><strong>Leadership:</strong> Providing practical experiences in guiding and organizing others.</li>
            </ul>
          </div>

          <div class="glass-panel" style="display: flex; flex-direction: column; gap: 12px;">
            <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
              <span>🧭</span> The Methods of Scouting
            </h3>
            <p style="font-size: 14px; color: hsl(var(--muted-foreground)); margin-bottom: 4px;">These are the vehicles through which we deliver the Aims of Scouting:</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px; color: hsl(var(--foreground)); font-weight: 500;">
              <div>⚜️ Ideals (Oath & Law)</div>
              <div>⚜️ Patrol Method</div>
              <div>⚜️ Outdoor Programs</div>
              <div>⚜️ Advancement</div>
              <div>⚜️ Association with Adults</div>
              <div>⚜️ Personal Growth</div>
              <div>⚜️ Leadership Development</div>
              <div>⚜️ Uniform</div>
            </div>
          </div>
        </div>

        <!-- What Makes a Staff Flip Cards -->
        <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px;">
          <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
            <span>🤝</span> What Makes a Staff? (The 4 Pillars of Staff)
          </h3>
          <p style="font-size: 14.5px; color: hsl(var(--muted-foreground)); line-height: 1.5;">
            A Camp Staff is more than a group of employees—you are dedicated Scouts leading by example. <strong>Tap/click</strong> on any card to flip it and read the guidelines:
          </p>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr)); gap: 16px; margin-top: 8px;">
            
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                  <span style="font-size: 32px;">🥾</span>
                  <h4 style="font-weight: 700; margin-top: 8px;">Appearance</h4>
                  <span style="font-size: 11px; color: hsl(var(--muted-foreground)); margin-top: auto;">Click to Flip</span>
                </div>
                <div class="flip-card-back">
                  <h4 style="font-weight: 700; color: hsl(var(--primary)); margin-bottom: 8px;">Appearance</h4>
                  <p style="font-size: 12.5px; line-height: 1.4; color: hsl(var(--muted-foreground));">Hygiene, neat uniforms, and how you present yourself. Before you speak, your appearance has already spoken. Dress cleanly, shave regularly, and stay presentable!</p>
                </div>
              </div>
            </div>

            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                  <span style="font-size: 32px;">🌟</span>
                  <h4 style="font-weight: 700; margin-top: 8px;">Attitude</h4>
                  <span style="font-size: 11px; color: hsl(var(--muted-foreground)); margin-top: auto;">Click to Flip</span>
                </div>
                <div class="flip-card-back">
                  <h4 style="font-weight: 700; color: hsl(var(--primary)); margin-bottom: 8px;">Attitude</h4>
                  <p style="font-size: 12.5px; line-height: 1.4; color: hsl(var(--muted-foreground));">Stay positive and remember you are here to serve as well as have fun. Be cheerful, supportive, and try to find genuine satisfaction in helping the campers and leaders.</p>
                </div>
              </div>
            </div>

            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                  <span style="font-size: 32px;">😊</span>
                  <h4 style="font-weight: 700; margin-top: 8px;">Personality</h4>
                  <span style="font-size: 11px; color: hsl(var(--muted-foreground)); margin-top: auto;">Click to Flip</span>
                </div>
                <div class="flip-card-back">
                  <h4 style="font-weight: 700; color: hsl(var(--primary)); margin-bottom: 8px;">Personality</h4>
                  <p style="font-size: 12.5px; line-height: 1.4; color: hsl(var(--muted-foreground));">Patience, friendliness, humor, respect, and enthusiasm—these key traits make all the difference in making scouts feel welcomed and creating lifelong memories.</p>
                </div>
              </div>
            </div>

            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                  <span style="font-size: 32px;">📚</span>
                  <h4 style="font-weight: 700; margin-top: 8px;">Knowledge</h4>
                  <span style="font-size: 11px; color: hsl(var(--muted-foreground)); margin-top: auto;">Click to Flip</span>
                </div>
                <div class="flip-card-back">
                  <h4 style="font-weight: 700; color: hsl(var(--primary)); margin-bottom: 8px;">Knowledge</h4>
                  <p style="font-size: 12.5px; line-height: 1.4; color: hsl(var(--muted-foreground));">Be an authority on what you teach. Know your merit badge requirements. Additionally, understand the structure and general emergency operations of Camp Lawton.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    `;
    setupFlipListeners();
  }

  function renderService() {
    scoutingBtn.classList.remove('active');
    cultureBtn.classList.remove('active');
    serviceBtn.classList.add('active');
    programBtn.classList.remove('active');

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

    const rulesHtml = trainingCultureData.rules ? trainingCultureData.rules.map((rule, idx) => `
      <div style="background: hsl(var(--card)); border: 1px solid hsl(var(--border)); padding: 14px; border-radius: var(--radius-sm); border-left: 4px solid hsl(var(--danger));">
        <h4 style="font-weight: 700; margin-bottom: 6px;">${rule.title}</h4>
        <p style="font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.4;">${rule.content}</p>
      </div>
    `).join('') : '';

    const stressHtml = trainingCultureData.stressManagement.map((step, idx) => `
      <div style="background: hsl(var(--card)); border: 1px solid hsl(var(--border)); padding: 14px; border-radius: var(--radius-sm); border-left: 4px solid hsl(var(--accent));">
        <h4 style="font-weight: 700; margin-bottom: 6px;">${step.step}</h4>
        <p style="font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.4;">${step.description}</p>
      </div>
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

  function renderProgram() {
    scoutingBtn.classList.remove('active');
    cultureBtn.classList.remove('active');
    serviceBtn.classList.remove('active');
    programBtn.classList.add('active');

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
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 14px; font-size: 14px;">
            <div style="background: hsl(var(--card)); border: 1px solid hsl(var(--border)); padding: 14px; border-radius: var(--radius-sm);">
              📚 <strong>Use Official Publications</strong>
              <p style="font-size: 12.5px; color: hsl(var(--muted-foreground)); margin-top: 4px;">Follow Scouting America merit badge pamphlets. Teach no more and no less than what the requirement states.</p>
            </div>
            <div style="background: hsl(var(--card)); border: 1px solid hsl(var(--border)); padding: 14px; border-radius: var(--radius-sm);">
              🧩 <strong>Session Divisions & Themes</strong>
              <p style="font-size: 12.5px; color: hsl(var(--muted-foreground)); margin-top: 4px;">Divide requirements appropriately over the sessions. Define daily themes and start with a quick review of the previous day.</p>
            </div>
            <div style="background: hsl(var(--card)); border: 1px solid hsl(var(--border)); padding: 14px; border-radius: var(--radius-sm);">
              🎮 <strong>Engaging Methods</strong>
              <p style="font-size: 12.5px; color: hsl(var(--muted-foreground)); margin-top: 4px;">Incorporate active games, hands-on activities, and interesting trivia beyond the book. Keep it simple and make it fun!</p>
            </div>
            <div style="background: hsl(var(--card)); border: 1px solid hsl(var(--border)); padding: 14px; border-radius: var(--radius-sm);">
              🎯 <strong>Objectives & Continuums</strong>
              <p style="font-size: 12.5px; color: hsl(var(--muted-foreground)); margin-top: 4px;">Communicate clear learning objectives, establish specific deadlines for assignments, and structure lessons from foundation to complex.</p>
            </div>
          </div>
        </div>

        <!-- Safety Inspection Controls -->
        <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px;">
          <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
            <span>🛡️</span> Program Area Safety Controls
          </h3>
          <p style="font-size: 14.5px; color: hsl(var(--muted-foreground)); line-height: 1.5;">
            Maintenance committees prepare camp facilities, but Area Directors are responsible for ongoing safety audits:
          </p>
          <ul style="display: flex; flex-direction: column; gap: 8px; font-size: 14px; padding-left: 20px; line-height: 1.5;">
            <li><strong>Inspect & Flag:</strong> Carefully examine your entire program area daily. Identify and flag hazards (dangerous trees, trail obstructions, damaged fences, loose benches).</li>
            <li><strong>Report:</strong> Report structural hazards to the Camp Ranger and Camp Director to establish a safety management plan.</li>
            <li><strong>Security:</strong> Always lock away and secure all tools, weapons, and specialized gear after operating hours.</li>
            <li><strong>Cleanliness & Aesthetics:</strong> Keep the area tidy. Clean up trash piles, fix broken tables, and maintain a professional appearance. Daily trash goes to the bins behind the kitchen.</li>
          </ul>
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

  scoutingBtn.addEventListener('click', renderScouting);
  cultureBtn.addEventListener('click', renderCulture);
  serviceBtn.addEventListener('click', renderService);
  programBtn.addEventListener('click', renderProgram);

  renderScouting();
}
