(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[{id:`checklist-1`,text:`Submit Medical Forms A, B, and C`,category:`HR`},{id:`checklist-2`,text:`Complete Safeguarding Youth Training (SYT)`,category:`Training`},{id:`checklist-3`,text:`Complete online Hazardous Weather module`,category:`Training`},{id:`checklist-4`,text:`Sign the Code of Conduct commitment sheet`,category:`Code`},{id:`checklist-5`,text:`Take the Camp Lawton Certification Quiz`,category:`Quiz`}];function t(){return`
    <div class="dashboard-grid">
      <!-- Welcome Banner -->
      <div class="welcome-banner-card">
        <div class="welcome-banner-text">
          <h2>Welcome to the Mountain, <span id="dashboard-username">${B.username}</span>! 🌲</h2>
          <p>Congratulations on joining the Camp Lawton team! As Camp Staff, you are now part of a century-old legacy of shaping lives through the outdoor experience. Complete your readiness checks below to get set up for the summer.</p>
        </div>
        <button class="welcome-banner-btn" id="dashboard-explore-btn">Go to Camp Schedule</button>
      </div>

      <!-- WAM Hydration Alert Widget -->
      <div class="wam-alert-card" id="wam-card">
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <h3 style="font-size: 20px; font-weight: 800; font-family: var(--font-heading);">💦 Water Appreciation Moment (WAM)</h3>
          <p style="font-size: 14.5px; opacity: 0.9;">Shout "WAM!" and everyone drinks. Dehydration is a real hazard at 8,000 ft.</p>
          <span style="font-size: 13px; font-weight: 700; background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 4px; align-self: flex-start; margin-top: 6px;" id="wam-counter-display">Drinks Logged: ${B.wamCount}</span>
        </div>
        <button class="wam-button" id="wam-btn">Take a Drink! 🥤</button>
      </div>

      <!-- Checklist Section -->
      <div class="glass-panel checklist-card">
        <div class="checklist-title-bar">
          <h3>Staff Readiness Tasks</h3>
        </div>
        <div class="checklist-items-list" id="dashboard-checklist-mount">
          <!-- Injected dynamically -->
        </div>
      </div>

      <!-- Progress Section -->
      <div class="glass-panel progress-card">
        <h3>Readiness Progress</h3>
        <p style="color: hsl(var(--muted-foreground)); font-size: 14px;">Complete all items to get cleared by administration.</p>
        <div class="progress-circle-container">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle class="progress-circle-bg" cx="80" cy="80" r="70" />
            <circle class="progress-circle-fill" id="progress-circle" cx="80" cy="80" r="70" />
          </svg>
          <div class="progress-text-overlay">
            <span class="progress-percentage" id="progress-pct-display">0%</span>
            <span class="progress-fraction" id="progress-frac-display">0/5 Tasks</span>
          </div>
        </div>
        <p style="font-weight: 600; font-size: 14px;" id="progress-encouragement">Let's get ready!</p>
      </div>
    </div>
  `}function n(){let e=document.getElementById(`dashboard-username`);e&&(e.textContent=B.username);let t=document.getElementById(`dashboard-explore-btn`);t&&t.addEventListener(`click`,()=>Q(`schedule`));let n=document.getElementById(`wam-btn`),a=document.getElementById(`wam-card`),o=document.getElementById(`wam-counter-display`);n&&a&&n.addEventListener(`click`,e=>{B.incrementWam();let t=document.createElement(`div`);t.classList.add(`wam-ripple-effect`);let n=a.getBoundingClientRect(),r=e.clientX-n.left,i=e.clientY-n.top;t.style.left=`${r}px`,t.style.top=`${i}px`,a.appendChild(t),setTimeout(()=>t.remove(),1200)}),r(),i();let s=()=>{r(),i()},c=()=>{o&&(o.textContent=`Drinks Logged: ${B.wamCount}`)},l=()=>{window.removeEventListener(`state-tasks-updated`,s),window.removeEventListener(`state-wam-updated`,c),window.removeEventListener(`before-view-change`,l)};window.addEventListener(`before-view-change`,l),window.addEventListener(`state-tasks-updated`,s),window.addEventListener(`state-wam-updated`,c)}function r(){let t=document.getElementById(`dashboard-checklist-mount`);t&&(t.innerHTML=e.map(e=>{let t=B.completedTasks.includes(e.id);return`
      <div class="checklist-item ${t?`checked`:``}" data-task-id="${e.id}" role="checkbox" aria-checked="${t}">
        <div class="checklist-checkbox-container">
          <div class="checklist-checkbox"></div>
        </div>
        <span class="checklist-item-text">${e.text}</span>
        <span class="checklist-category-badge">${e.category}</span>
      </div>
    `}).join(``),t.querySelectorAll(`.checklist-item`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-task-id`);t===`checklist-4`?Q(`packing`):t===`checklist-5`?Q(`quiz`):B.toggleTask(t)})}))}function i(){let t=document.getElementById(`progress-pct-display`),n=document.getElementById(`progress-frac-display`),r=document.getElementById(`progress-circle`),i=document.getElementById(`progress-encouragement`);if(!t||!r)return;let a=e.length,o=e.filter(e=>B.completedTasks.includes(e.id)).length,s=a>0?Math.round(o/a*100):0,c=2*Math.PI*70;r.style.strokeDasharray=`${c} ${c}`;let l=c-s/100*c;r.style.strokeDashoffset=l,t.textContent=`${s}%`,n&&(n.textContent=`${o}/${a} Tasks`),i&&(s===0?(i.textContent=`Welcome! Let's get ready 🌲`,i.style.color=`inherit`):s<50?(i.textContent=`Making progress! 🚶`,i.style.color=`inherit`):s<100?(i.textContent=`Almost cleared for camp! ⛺`,i.style.color=`inherit`):(i.textContent=`All clear! Ready to lead! 🏆`,i.style.color=`hsl(var(--success))`))}var a=[{id:`pack-cloth-1`,name:`Field Uniform Shirt (Class A) - 2+ recommended`,category:`Clothing`,status:`necessary`},{id:`pack-cloth-2`,name:`Activity Uniform - Staff Shirts (Class B)`,category:`Clothing`,status:`necessary`},{id:`pack-cloth-3`,name:`Scout Pants / Shorts`,category:`Clothing`,status:`necessary`},{id:`pack-cloth-4`,name:`Scout Belt (scout-approved buckle)`,category:`Clothing`,status:`necessary`},{id:`pack-cloth-5`,name:`Off-Duty Clothes ("Civvies")`,category:`Clothing`,status:`necessary`},{id:`pack-cloth-6`,name:`Jacket, fleece, or heavy sweater`,category:`Clothing`,status:`necessary`},{id:`pack-cloth-7`,name:`Closed-toed shoes / hiking boots`,category:`Clothing`,status:`necessary`},{id:`pack-cloth-8`,name:`Shower shoes (flip-flops/crocs)`,category:`Clothing`,status:`necessary`},{id:`pack-cloth-9`,name:`Underwear, socks, and pajamas`,category:`Clothing`,status:`necessary`},{id:`pack-cloth-10`,name:`Hat (brimmed for sun protection)`,category:`Clothing`,status:`necessary`},{id:`pack-gear-1`,name:`Completed Medical Form (Parts A, B, C)`,category:`Gear`,status:`necessary`},{id:`pack-gear-2`,name:`Sleeping bag or bedding & pillow`,category:`Gear`,status:`necessary`},{id:`pack-gear-3`,name:`Lockable trunk or heavy duffel bag`,category:`Gear`,status:`necessary`},{id:`pack-gear-4`,name:`Canteen or large water bottle (uniform part)`,category:`Gear`,status:`necessary`},{id:`pack-gear-5`,name:`Flashlight & extra batteries`,category:`Gear`,status:`necessary`},{id:`pack-gear-6`,name:`Towels & washcloths`,category:`Gear`,status:`necessary`},{id:`pack-gear-7`,name:`Personal hygiene (lightly-scented soap, brush, etc.)`,category:`Gear`,status:`necessary`},{id:`pack-gear-8`,name:`Laundry bag & sunscreen`,category:`Gear`,status:`necessary`},{id:`pack-gear-9`,name:`Pocket knife (if Tot'n Chip card held)`,category:`Gear`,status:`necessary`},{id:`pack-gear-10`,name:`Tot'n Chip & Firem'n Chit cards`,category:`Gear`,status:`necessary`},{id:`pack-opt-1`,name:`Scouts BSA Handbook`,category:`Optional`,status:`optional`},{id:`pack-opt-2`,name:`Camera (dedicated device preferred)`,category:`Optional`,status:`optional`},{id:`pack-opt-3`,name:`Compass & sewing kit`,category:`Optional`,status:`optional`},{id:`pack-opt-4`,name:`Hangers & light twine/rope`,category:`Optional`,status:`optional`},{id:`pack-opt-5`,name:`Musical Instruments & reading books`,category:`Optional`,status:`optional`},{id:`pack-priv-1`,name:`Smartphone (use in cabin only)`,category:`Privileged`,status:`privileged`},{id:`pack-priv-2`,name:`Portable gaming console (Switch, etc.)`,category:`Privileged`,status:`privileged`},{id:`pack-priv-3`,name:`Headphones / Bluetooth speaker (for cabin)`,category:`Privileged`,status:`privileged`},{id:`pack-priv-4`,name:`Laptop screen (cabin use only)`,category:`Privileged`,status:`privileged`},{id:`pack-proh-1`,name:`Sheath knives or novelty knives`,category:`Prohibited`,status:`prohibited`},{id:`pack-proh-2`,name:`Personal firearms, ammo, or Air Soft toys`,category:`Prohibited`,status:`prohibited`},{id:`pack-proh-3`,name:`Fireworks or personal firestarters`,category:`Prohibited`,status:`prohibited`},{id:`pack-proh-4`,name:`Full-size TVs or desktop rigs`,category:`Prohibited`,status:`prohibited`},{id:`pack-proh-5`,name:`Open-toed sandals/shoes outside cabin`,category:`Prohibited`,status:`prohibited`},{id:`pack-proh-6`,name:`Personal food and snacks (attracts bears)`,category:`Prohibited`,status:`prohibited`},{id:`pack-proh-7`,name:`Pets, adult posters, or alcohol/drugs/marijuana`,category:`Prohibited`,status:`prohibited`}],o=[{id:`step1`,title:`12:00 PM: Report & Sign In`,description:`Arrive at the Camp Office, sign in, and get your cabin assignment.`},{id:`step2`,title:`1:00 PM: Staff Meeting`,description:`Report to flags in Class A uniform for the first weekly staff brief.`},{id:`step3`,title:`2:00 PM: Camper Check-in`,description:`Scouts arrive. Assist with parking, back vehicles into spots facing out for EAP evacuations.`},{id:`step4`,title:`Medical Screening`,description:`Medic reviews health forms and checks in troop medications.`},{id:`step5`,title:`Campsite Tour`,description:`As a Troop Friend, guide your assigned unit on a tour of flags, Dining Hall, and program areas.`},{id:`step6`,title:`Setup & Flag Assembly`,description:`Troops unpack, report to the parade grounds for flags, and head to dinner.`}],s=[{time:`6:00 AM`,activity:`Eagle Trail Hike`,uniform:`Class B / Optional`,notes:`Inspirational hike up Eagle Hill with your buddy or friend troop.`},{time:`7:45 AM`,activity:`Morning Flags Assembly`,uniform:`Class A (Field)`,notes:`Be lined up early. Short flag ceremony and daily announcements.`},{time:`8:00 AM`,activity:`Breakfast on the Logs`,uniform:`Class A / Class B`,notes:`Lead songs on the logs, sit with campers, socialise, and perform assigned KP duties.`},{time:`9:00 AM - 11:50 AM`,activity:`Morning Program Session`,uniform:`Class B (Activity)`,notes:`Teach merit badge classes in your area. Be ready to start exactly at 9:00 AM.`},{time:`12:00 PM`,activity:`Lunch & Dining KP`,uniform:`Class B (Activity)`,notes:`Eat with scouts, complete kitchen steward cleanups if on duty roster.`},{time:`1:00 PM - 2:00 PM`,activity:`Daily Siesta (Nap Time)`,uniform:`Any / Cabin Area`,notes:`Crucial rest hour in cabins to decompress. No loud music or off-hill activities.`},{time:`2:00 PM - 5:00 PM`,activity:`Afternoon Program Session`,uniform:`Class B (Activity)`,notes:`Merit badges, open range shoots, climbing wall routes, and specialized area work.`},{time:`5:45 PM`,activity:`Evening Flags Assembly`,uniform:`Class A (Field)`,notes:`Full Field uniform. Lowering the colors before heading into dinner.`},{time:`6:00 PM`,activity:`Dinner & Social`,uniform:`Class A (Field)`,notes:`Dining Hall seating. Talk with leaders and scouts to build relationships.`},{time:`7:00 PM - 9:00 PM`,activity:`Evening Programs & Meetings`,uniform:`Class B / Class A`,notes:`Staff meetings, campfires, Scout Own chapels, or commissioner socials.`},{time:`10:00 PM`,activity:`Lights Out / Quiet Hours`,uniform:`Sleepwear`,notes:`All staff in quarters. Restore energy for the next high-stimulus day.`}],c=[{id:`song-funky`,title:`Ain't That Funky Now`,description:`An easy rhythm rap to get kids singing. Excellent for warming up a crowd on the Logs or at campfires.`,actions:[{beat:1,text:`Thigh-Clap Rhythm starts`},{beat:5,text:`Hump-ty-dump`},{beat:9,text:`Hump-hump-ty-dump-ty-dumpty`},{beat:13,text:`Jack and Jill went up the hill`},{beat:18,text:`To fetch a pail of water`},{beat:22,text:`Jack fell down and broke his crown`},{beat:26,text:`And Jill said... UH! (Clap!)`},{beat:29,text:`Ain't That Funky Now!!!`}],lyrics:`(Start thigh-clap tempo)

[Chorus]
Hump-ty-dump
Hump-hump-ty-dump-ty-dumpty
Hump-ty-dump
Hump-hump-ty-dump-ty-dumpty

Jack and Jill went up the hill
To fetch a pail of water
Jack fell down and broke his crown
And Jill said…
UH! Ain’t That Funky Now!!!

[Chorus]

Jack be nimble
Jack be quick
Jack jumped over the candlestick
The candle flared and Jack got scared,
Said…
UH! Ain’t that funky now!!!

[Chorus]`},{id:`song-alfalfa`,title:`The Alfalfa Anthem`,description:`A zero-friction classic sung to the tune of "Auld Lang Syne". Perfect for quietening or unifying a rowdy logs gathering.`,actions:[{beat:1,text:`Sway back and forth`},{beat:3,text:`Alfalfa hey, Alfalfa hey`},{beat:7,text:`Alfalfa hey hey hey`}],lyrics:`(Tune: Auld Lang Syne)

Alfalfa hey, Alfalfa hey
Alfalfa hey hey hey
Alfalfa hey, Alfalfa hey
Alfalfa hey hey hey`},{id:`song-alive`,title:`Alive, Awake, Alert, Enthusiastic`,description:`Great physical action song to wake up campers. Accelerates in speed with each round.`,actions:[{beat:1,text:`I'm alive... (Pat knees)`},{beat:3,text:`Awake... (Clap hands)`},{beat:5,text:`Alert... (Snap fingers above shoulders)`},{beat:7,text:`Enthusiastic! (Wiggle whole body)`}],lyrics:`(Tune: "If You're Happy and You Know It")

I’m alive (pat knees)
Awake (clap)
Alert (snap fingers above shoulders)
Enthusiastic! (wiggle all over)

I’m alive, awake, alert, enthusiastic!
I’m alive, awake, alert
I’m alert, awake, alive
I’m alive, awake, alert, enthusiastic!`},{id:`song-bananas`,title:`Bananas Unite!`,description:`Rhythmic action shout that demands total physical participation and high vocal volume.`,actions:[{beat:1,text:`UNITE! (Clap hands high overhead)`},{beat:5,text:`Pick bananas... (Mimic picking)`},{beat:10,text:`Peel bananas... (Mimic peeling)`},{beat:15,text:`Eat bananas... (Mimic eating)`},{beat:20,text:`GO BANANAS! (Jump and go wild!)`}],lyrics:`BANANAS OF THE WORLD! UNITE!!

Pick bananas, pick-pick bananas
Pick bananas, pick-pick bananas
Pick bananas, pick-pick bananas
Pick bananas, pick-pick bananas

BANANAS OF THE WORLD! UNITE!!

Peel bananas, peel-peel bananas...
Eat bananas, eat-eat bananas...
GO BANANAS!!!`},{id:`song-birdie`,title:`The Birdie Song`,description:`A morning action chant. Shouting the waking sequence after a quiet rest segment is key.`,actions:[{beat:1,text:`Way up in the sky... (Stretch arms high)`},{beat:6,text:`Wing on the left / right... (Flap elbows)`},{beat:12,text:`Slumber... (Shhh, put head on folded hands)`},{beat:18,text:`WAKE THE BIRDS! (Shout and cheer)`}],lyrics:`Waaaaaaay up in the sky
The little birds fly
While down in the nest
The little birds rest
With a wing on the left
And a wing on the right
The little birds slumber
All through the night

Shhhhhhhh!!!!! YOU’LL WAKE THE SLEEPING BIRDS!!!!!

The bright sun comes up
The dew falls away
“Good morning! Good morning!”
The little birds say.`},{id:`song-crazy`,title:`Ain't It Great To Be Crazy`,description:`An absurdist zipper song built of silly verses and a highly energetic recurring chorus.`,actions:[{beat:1,text:`Boom, Boom... (Stomp, Stomp)`},{beat:5,text:`NUTS! (Shout loudly)`},{beat:10,text:`Way down south... (Sway)`}],lyrics:`[Chorus]
Boom, Boom, ain’t it great to be crazy?
Boom, Boom, ain’t it great to be crazy (nuts!)
Giddy and foolish all day long,
Boom, Boom, ain’t it great to be crazy!

Way down south where bananas grow,
A flea stepped on an elephant’s toe.
The elephant cried with tears in his eyes,
"Why don’t you pick on someone your own size?"

[Chorus]

Late last night I had a real strange dream,
Ate a nine-pound marshmallow mama gave me.
When I woke up, I knew something was wrong,
I looked around and saw my pillow was gone!

[Chorus]

A horse, a flea, and three blind mice,
Sat on a toadstool shooting dice.
Up jumped the horse, sat on the flea,
"Oops," said the flea, "there’s a horse on me!"

[Chorus]`},{id:`song-camper`,title:`Sleeping Camper`,description:`Modified sea shanty sung to the tune of "Drunken Sailor". Highlights common morning routines and pranks.`,actions:[{beat:1,text:`What do you do... (Shrug shoulders)`},{beat:6,text:`Way hey late... (Swing arms)`},{beat:12,text:`Throw him in pool... (Throwing motion)`}],lyrics:`What do you do with a sleeping camper?
What do you do with a sleeping camper?
What do you do with a sleeping camper?
Early in the mornin’!

[Chorus]
Way hey late, ye risers
Way hey late, ye risers
Way hey late, ye risers
Early in the Mornin’!

Throw him in the pool with his pants on backwards
Throw him in the pool with his pants on backwards
Throw him in the pool with his pants on backwards
Early in the mornin’!

[Chorus]

-Pull him out of bed with a running Bowline
-Hit him in the face with a sopping wet towel
-Put him into bed at a sooner hour
Early in the evening!

[Chorus]`}],l=[{id:1,question:`Under Arizona State Law (ARS 13-3620), what is your legal duty regarding suspected child abuse or neglect?`,options:[`Ignore it unless you see it happen multiple times`,`Report it directly to the Camp Director, who will handle it internally`,`You are a mandated reporter and must report immediately to the Arizona DCS Hotline (1-888-SOS-CHILD)`,`Discuss it with the scoutmaster of the youth's troop first`],answerIndex:2,explanation:`As a camp staff member in Arizona, you are a legally mandated reporter. You must report any good-faith suspicion of abuse directly to the Department of Child Safety (1-888-SOS-CHILD or 911 in an emergency). This duty cannot be delegated.`},{id:2,question:`According to the Lightning Safety 30/30 rule, what triggers immediate suspension of outdoor activities, and where should shelter be taken?`,options:[`Heavy rain; take shelter under canvas dining flys or large trees`,`Thunder within 30 seconds of a lightning flash; seek shelter in the Dining Hall`,`Visible lightning over the ridge; stay in open golf carts`,`Wind gusts of 15 mph; shelter in individual tents`],answerIndex:1,explanation:`The 30/30 rule states that if thunder is heard within 30 seconds of a flash, lightning is within 6 miles. You must suspend activities immediately. Tents and open pavilions offer zero protection. In Camp Lawton, the primary lightning shelter is the Dining Hall.`},{id:3,question:`What do the radio alert terms "Code Blue" and "Code Brown" stand for respectively?`,options:[`Code Blue = Medical check-in; Code Brown = Kitchen food delivery`,`Code Blue = Lost Camper / Missing Person; Code Brown = Bear Sighting`,`Code Blue = Severe Weather; Code Brown = Evacuation Drill`,`Code Blue = Visitor Arrival; Code Brown = Maintenance Hazard`],answerIndex:1,explanation:`Under Camp Lawton emergency protocols, "Code Blue" represents a Missing Person / Lost Camper report (which halts all other activity until resolved), and "Code Brown" signals a Bear Sighting to alert the Ranger and Camp Director.`},{id:4,question:`What is a "WAM" (Water Appreciation Moment) and what is expected of you when you hear it?`,options:[`A meeting with the Camp Director; report to the office`,`A campsite inspection; clean your cabin immediately`,`A hydration alert; everyone within earshot must immediately take a drink of water`,`A flag raising ceremony; wear your Class A uniform`],answerIndex:2,explanation:`Dehydration is a critical hazard at 8,000 ft in the Arizona mountains. "WAM" stands for Water Appreciation Moment. When someone shouts "WAM!", everyone nearby is required to drink water immediately.`},{id:5,question:`What are the minimum age requirements for Camp Director/Program Director and Area Directors under NCAP guidelines?`,options:[`Camp/Program Director: 18; Area Director: 16`,`Camp/Program Director: 21; Area Director: 18`,`Camp/Program Director: 25; Area Director: 21`,`Camp/Program Director: 18; Area Director: 18`],answerIndex:1,explanation:`To comply with the National Camp Accreditation Program (NCAP), the Camp Director, Program Director, Climbing Director, and Range activities Director must be at least 21 years old. Area Directors must be at least 18 years old.`},{id:6,question:`Under youth labor guidelines, what are the restrictions on Counselors-in-Training (CIT) aged 14 and 15?`,options:[`Can work up to 12 hours, from 6 AM to 10 PM, and teach classes alone`,`Can only work up to 8 hours/day, between 7 AM and 9 PM, and must never be left to teach a merit badge alone`,`Are restricted to kitchen cleanup duties and cannot leave the main lodge area`,`Have no limits on hours but cannot wear staff uniforms`],answerIndex:1,explanation:`CITs are in a training program. Labor laws limit 14 and 15-year-olds to a maximum of 8 hours of work per day between 7 AM and 9 PM. They are not cleanup servants, but nor should they ever be left to teach a merit badge alone.`},{id:7,question:`What must you do the moment you hear the camp-wide emergency alarm (the Dining Hall bell ringing continuously)?`,options:[`Run to your cabin and pack your bags for evacuation`,`Go to the Camp Office to ask what the emergency is`,`Secure immediate hazards in your program area (e.g. put out fires) and immediately escort all scouts to the Parade Grounds for a headcount`,`Wait for a radio announcement before taking any action`],answerIndex:2,explanation:`A continuous ringing of the Dining Hall bell signals an immediate emergency or drill. You must drop what you are doing, quickly secure any immediate hazards (like fires or dangerous tools), and immediately escort all scouts with you to the Parade Grounds. Do not let scouts return to campsites.`},{id:8,question:`Which of the following represents correct, FCC-compliant radio protocol at Camp Lawton?`,options:[`Press the button, call "Hey Dave, it's Mike, can you come over to Scoutcraft?"`,`Wait for a clear channel, press the button, wait 1 second, call "[YOU] to [AREA]" (e.g., "Scoutcraft to HQ"), and avoid real names`,`Use real names and personal details to ensure accuracy in communications`,`Keep the radio button held down during conversations to keep the channel open`],answerIndex:1,explanation:`Official camp radios are subject to FCC regulations. Correct protocol is: press button, wait a second, call "[YOU] to [AREA]" (e.g., "Scoutcraft to HQ"). The response should be "[YOUR AREA], go ahead." Do not use real names; use program areas or code names.`},{id:9,question:`Under the camp's "Smellables" policy to prevent bear encounters, what must be done with scented toiletries (deodorant, soap, snacks)?`,options:[`They must be kept in youth tents for easy access`,`They must be stored in open cardboard boxes under bunk beds`,`They must be secured in the Smellables Shed (next to the youth shower house) in the "Bear Box" overnight`,`No toiletries are allowed in camp whatsoever`],answerIndex:2,explanation:`To prevent dangerous wildlife encounters (Code Brown), no food, drinks, or smellables (toiletries, deodorant, scented products) are allowed in cabins or campsites (except plain water). Overnight, they must be secured in the "Bear Box" in the Smellables Shed by the youth shower house.`},{id:10,question:`What are the rules regarding staff parking and personal vehicles on Staff Hill?`,options:[`Vehicles can be parked in any direction, and any staff member can drive within the camp proper`,`All vehicles must be backed in facing the exit road for quick EAP evacuation, and staff under 18 must have parental/director permits to bring a vehicle`,`Only adult staff over 25 are permitted to park on camp grounds`,`Vehicles must be parked at the main gate and staff must hike up to Staff Hill`],answerIndex:1,explanation:`Staff park on Staff Hill, backing in facing the exit for quick departure in emergencies. Staff under 18 must have written parental approval and Camp Director approval to bring a vehicle, and junior staff riding with others must have written parental permission.`}],u={mission:{statement:`The mission of Scouting America is to prepare young people to make ethical and moral choices over their lifetimes by instilling in them the values of the Scout Oath and Law.`,vision:`Scouting America will prepare every eligible youth in America to become a responsible, participating citizen and leader who is guided by the Scout Oath and Law.`},pillars:[{title:`Physical`,description:`Camp helps develop habits of healthy living through balanced meals and supervised physical activities.`},{title:`Mental`,description:`Advancement programs offer challenges that build self-sufficiency and responsibility.`},{title:`Social`,description:`The community of a summer camp helps build strong, morally rich people skills.`},{title:`Spiritual`,description:`Spiritually rich time in nature helps develop a deeper understanding of a scout's place in the universe.`}],aims:[`Character`,`Citizenship`,`Personal Fitness`,`Leadership`],methods:[`Ideals`,`Patrols`,`Outdoor Programs`,`Advancement`,`Association with Adults`,`Personal Growth`,`Leadership Development`,`Uniform`],whatMakesAStaff:[{trait:`Appearance`,description:`Hygiene, uniform, and how you present yourself make an impression. Before you speak, your appearance will have spoken.`},{trait:`Attitude`,description:`Stay positive and remember you are there to serve as well as have fun. Try to have fun serving.`},{trait:`Personality`,description:`Patience, friendliness, humor, respect and enthusiasm; these traits make all the difference.`},{trait:`Knowledge`,description:`When teaching a Merit Badge or skill, the staff member should be an authority on the subject.`}],stressManagement:[{step:`1. Work the Problem`,description:`Run a self-diagnostic: Are you dehydrated? Are you fueled? Are you sleep-deprived?`},{step:`2. Use Your Siesta`,description:`Napping for a short time each day improves mental health. Use the daily 'Siesta' gap to reboot.`},{step:`3. Manage Sensory Overload`,description:`Find a quiet space out of sight to safely decompress and give your nervous system a chance to return to baseline.`},{step:`4. Tag Out (The Strategic Retreat)`,description:`If a scout is pushing your buttons, tell your Area Director, 'I need five minutes.' Take a few deep breaths.`},{step:`5. Call in the Grown-Ups`,description:`If your mental health is slipping, go to an adult staff member. You are never expected to go through anything alone.`}],glossary:[{term:`Class A / Field Uniform`,def:`Official Scout uniform shirt, scout pants/shorts, belt, closed-toed shoes, and socks.`},{term:`Class B / Activity Uniform`,def:`Camp Lawton Staff Shirt, scout pants/shorts, closed-toed shoes, and a Water Bottle.`},{term:`The Logs`,def:`The bleacher seating in front of the Dining Hall where scouts gather for meals and songs.`},{term:`WAM`,def:`Water Appreciation Moment. If heard, everyone within earshot must take a drink of water.`},{term:`Troop Friend`,def:`A youth staff member assigned to act as a unit's guide, liaison, and friend throughout the week.`},{term:`Staff Hill`,def:`The hill on the north end of camp designated for Staff living facilities.`},{term:`Smellables`,def:`Anything with an odor or scent that might attract wildlife, which must be secured in the Smellables Shed.`}],customerService:{disney:[{title:`Hire for Attitude`,desc:`Prioritize hiring naturally friendly people and train skills later.`},{title:`Everything Speaks`,desc:`Every detail sends a message. Own every aspect of the experience.`},{title:`It's a Stage`,desc:`Treat every employee as a cast member. Maintain a clear distinction between 'onstage' and 'backstage'.`},{title:`Map First`,desc:`Map out every touchpoint through the lens of the customer.`},{title:`Systems over Scripts`,desc:`Build excellence into repeatable systems, rather than rigid scripts.`}],fish:[{title:`Play`,desc:`Bring a lighthearted, spontaneous energy to your environment.`},{title:`Make Their Day`,desc:`Look for ways to create a memorable, positive experience for someone else.`},{title:`Be There`,desc:`Give the customer your complete, undivided attention.`},{title:`Choose Your Attitude`,desc:`Take total responsibility for the mindset you bring to work each day.`}]}},d={healthAndSafety:[{type:`Emergency`,code:`Code Blue`,protocol:`Missing Person Protocol: Gather details (Name, Unit, Clothing, Last Location). Initiate Code Blue over radio to Camp Director. Stand by for centralized search commands. Do not self-assign.`},{type:`Emergency`,code:`Code Brown`,protocol:`Bear Sighting Protocol: Remain calm. Do not approach. Report Code Brown to Camp Director. Maintain safe visual. If an attack occurs, yell loudly, throw rocks, sound alarm.`},{type:`Emergency`,code:`Bell Alarm`,protocol:`Continuous Bell: Drop everything (except securing immediate hazards). Escort scouts directly to Parade Grounds. Do not let them return to campsites. Take strict headcount.`},{type:`Weather`,code:`Lightning 30/30 Rule`,protocol:`If thunder follows lightning by < 30 seconds, immediately cease outdoor activities and seek shelter in the Dining Hall. Do not move through open high ground.`},{type:`Emergency`,code:`Fire`,protocol:`Report any out-of-control fire immediately. Alarm will sound. Absolute first priority is assisting scouts to evacuate safely. Personal gear is secondary.`},{type:`Incident`,code:`Active Shooter`,protocol:`Assume active shooter if gunshots are heard. Hide, find secure shelter, flee into woods, or fight back if necessary. Keep scouts safe.`}],legalPolicies:[{title:`At Will Employment`,content:`Employment is 'at-will' and can be terminated by either party at any time without cause.`},{title:`Equal Employment Opportunity`,content:`Camp Lawton is an EEO employer. No discrimination based on race, religion, sex, etc. Accommodations provided where reasonable.`},{title:`Employee Grievances`,content:`Raise concerns with Area Directors first. If unresolved, submit a signed written grievance to the Camp Director. No retaliation will occur.`},{title:`Whistleblower Policy`,content:`Zero tolerance for retaliation against employees making good faith complaints regarding legal violations, safety dangers, or discrimination.`}],rules:[{title:`Phones`,content:`Keep it put away. Camp needs you here. Will begin with no blanket ban, but abuse will bring the hammer.`},{title:`Fraternization`,content:`Keep the physical stuff out of camp. Represent scouting values. Fraternization can lead to drama and professionalism issues.`},{title:`Media`,content:`Video games/movies are fine in off-time, but MUST be scout appropriate. No M-rated games, R-rated movies, or excessive language.`}]},f={paperwork:[{id:`pw-1`,name:`Staff Application`},{id:`pw-2`,name:`Letter of Agreement`},{id:`pw-3`,name:`Code of Conduct (signed)`},{id:`pw-4`,name:`Medical Forms A, B, and C`},{id:`pw-5`,name:`Vehicle Permit Form (if applicable)`},{id:`pw-6`,name:`Venture/Leader Application`},{id:`pw-7`,name:`I-9 Form and W-4 (if paid)`}]};function p(){return`
    <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
      <!-- Tabs selectors -->
      <div class="schedule-tabs-container">
        <button class="schedule-tab-btn active" id="tab-btn-sunday">Sunday Arrival & Check-In</button>
        <button class="schedule-tab-btn" id="tab-btn-daily">Daily Life Routine</button>
        <button class="schedule-tab-btn" id="tab-btn-roles">Staff Duties & Roles</button>
      </div>

      <!-- Content panels mount point -->
      <div id="schedule-panel-mount">
        <!-- Renders dynamically -->
      </div>
    </div>
  `}function m(){let e=document.getElementById(`tab-btn-sunday`),t=document.getElementById(`tab-btn-daily`),n=document.getElementById(`tab-btn-roles`),r=document.getElementById(`schedule-panel-mount`);if(!r)return;function i(){e.classList.add(`active`),t.classList.remove(`active`),n.classList.remove(`active`),r.innerHTML=`
      <div class="schedule-content-panel">
        <div style="background: hsl(var(--primary) / 0.05); border: 1px dashed hsl(var(--primary) / 0.2); border-radius: var(--radius-md); padding: 16px;">
          <h4 style="font-weight: 700; color: hsl(var(--primary)); margin-bottom: 6px;">Sunday Check-In Instructions:</h4>
          <p style="font-size: 14px; line-height: 1.5; color: hsl(var(--muted-foreground));">
            All staff are expected to report to camp by <strong>12:00 PM on Sunday</strong>. Sign in at the office in Class A Field uniform. You will be assigned a troop as their <strong>Troop Friend</strong>. Visit them daily to pass evaluations and act as their liaison!
          </p>
        </div>
        
        <div class="sunday-check-in-grid">
          ${o.map((e,t)=>`
      <div class="glass-panel sunday-step-card" style="animation: tabFadeIn 0.3s ease both; animation-delay: ${t*.05}s;">
        <div class="sunday-step-number">${t+1}</div>
        <div class="sunday-step-info">
          <h4>${e.title}</h4>
          <p>${e.description}</p>
        </div>
      </div>
    `).join(``)}
        </div>
      </div>
    `}function a(){e.classList.remove(`active`),t.classList.add(`active`),n.classList.remove(`active`),r.innerHTML=`
      <div class="schedule-content-panel">
        <div style="background: hsl(var(--accent) / 0.08); border: 1px dashed hsl(var(--accent) / 0.3); border-radius: var(--radius-md); padding: 16px; font-size: 14.5px; line-height: 1.5;">
          💤 <strong>Siesta Policy:</strong> The daily gap between lunch and afternoon session (1:00 PM - 2:00 PM) is a designated quiet hour. Go to cabins, relax, rest, and reset your nervous system. Music must not be played outside.
        </div>
        
        <div class="daily-timeline">
          ${s.map((e,t)=>`
      <div class="daily-timeline-item" style="animation: tabFadeIn 0.3s ease both; animation-delay: ${t*.04}s;">
        <div class="daily-timeline-dot"></div>
        <div class="daily-timeline-time-box">
          <span class="daily-timeline-time">${e.time}</span>
          <span class="daily-timeline-uniform">${e.uniform}</span>
        </div>
        <div class="daily-timeline-card">
          <h4>${e.activity}</h4>
          <p>${e.notes}</p>
        </div>
      </div>
    `).join(``)}
        </div>
      </div>
    `}function c(){e.classList.remove(`active`),t.classList.remove(`active`),n.classList.add(`active`),r.innerHTML=`
      <div class="schedule-content-panel">
        <div style="background: hsl(var(--primary) / 0.05); border: 1px dashed hsl(var(--primary) / 0.2); border-radius: var(--radius-md); padding: 16px; font-size: 14.5px; line-height: 1.5;">
          🛡️ <strong>Staff Age Requirements & Boundaries:</strong> Different roles carry strict age restrictions to comply with national and state guidelines. Safeguarding Youth guidelines apply to all staff levels.
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 20px; margin-top: 10px;">
          
          <div class="glass-panel" style="display: flex; flex-direction: column; gap: 10px; border-top: 4px solid #10b981; animation: tabFadeIn 0.3s ease both;">
            <h4 style="font-weight: 700; display: flex; align-items: center; gap: 6px;">🎒 Counselors in Training (CIT)</h4>
            <span style="font-size: 11px; font-weight: bold; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; width: fit-content;">Ages 14-15</span>
            <ul style="font-size: 13.5px; color: hsl(var(--muted-foreground)); padding-left: 18px; line-height: 1.5; display: flex; flex-direction: column; gap: 6px;">
              <li><strong>Hours:</strong> Max 8 hours/day, restricted strictly between 7:00 AM and 9:00 PM.</li>
              <li><strong>Teaching Limits:</strong> Must <em>never</em> be left to teach a merit badge or class by themselves.</li>
              <li><strong>Role Definition:</strong> CITs are part of a training program. They are not go-fers or cleanup servants, but nor are they full employees.</li>
              <li><strong>Respect:</strong> Treated with the same professional respect. The distinction between a full-season staffer and volunteer/CIT must be invisible to visitors.</li>
            </ul>
          </div>

          <div class="glass-panel" style="display: flex; flex-direction: column; gap: 10px; border-top: 4px solid #3b82f6; animation: tabFadeIn 0.3s ease both; animation-delay: 0.05s;">
            <h4 style="font-weight: 700; display: flex; align-items: center; gap: 6px;">🏕️ Junior Staff</h4>
            <span style="font-size: 11px; font-weight: bold; background: #dbeafe; color: #1d4ed8; padding: 2px 6px; border-radius: 4px; width: fit-content;">Ages 16-17</span>
            <ul style="font-size: 13.5px; color: hsl(var(--muted-foreground)); padding-left: 18px; line-height: 1.5; display: flex; flex-direction: column; gap: 6px;">
              <li><strong>Job Status:</strong> Classified as a summer job. Teaches interpersonal skills, professional behavior, food service, cleaning, and procedural compliance.</li>
              <li><strong>Restrictions:</strong> Subject to youth protection housing and buddy guidelines. Vehicles require parent and director written permits.</li>
              <li><strong>Duty Rosters:</strong> Expected to fully participate in cleaning, food service, and campsite assistance duties.</li>
            </ul>
          </div>

          <div class="glass-panel" style="display: flex; flex-direction: column; gap: 10px; border-top: 4px solid #8b5cf6; animation: tabFadeIn 0.3s ease both; animation-delay: 0.1s;">
            <h4 style="font-weight: 700; display: flex; align-items: center; gap: 6px;">⚖️ Adult Staff</h4>
            <span style="font-size: 11px; font-weight: bold; background: #f3e8ff; color: #6b21a8; padding: 2px 6px; border-radius: 4px; width: fit-content;">Ages 18+</span>
            <ul style="font-size: 13.5px; color: hsl(var(--muted-foreground)); padding-left: 18px; line-height: 1.5; display: flex; flex-direction: column; gap: 6px;">
              <li><strong>SYT Transition:</strong> Turning 18 instantly triggers adult rules (separate lodging, absolute prohibition of one-on-one contact with youth).</li>
              <li><strong>Responsibilities:</strong> Adults are not exempt from chores (meal cleanup, logs, campfire cleanup). It is not fair to ask youth to do work adults won't.</li>
              <li><strong>Leadership Ages:</strong> Area Directors must be 18+; Camp Director, Program Director, Range/Climbing Directors must be 21+.</li>
            </ul>
          </div>

        </div>
      </div>
    `}e.addEventListener(`click`,i),t.addEventListener(`click`,a),n.addEventListener(`click`,c),i()}var h={};(function e(t,n,r,i){var a=!!(t.Worker&&t.Blob&&t.Promise&&t.OffscreenCanvas&&t.OffscreenCanvasRenderingContext2D&&t.HTMLCanvasElement&&t.HTMLCanvasElement.prototype.transferControlToOffscreen&&t.URL&&t.URL.createObjectURL),o=typeof Path2D==`function`&&typeof DOMMatrix==`function`,s=(function(){if(!t.OffscreenCanvas)return!1;try{var e=new OffscreenCanvas(1,1),n=e.getContext(`2d`);n.fillRect(0,0,1,1);var r=e.transferToImageBitmap();n.createPattern(r,`no-repeat`)}catch{return!1}return!0})();function c(){}function l(e){var r=n.exports.Promise,i=r===void 0?t.Promise:r;return typeof i==`function`?new i(e):(e(c,c),null)}var u=(function(e,t){return{transform:function(n){if(e)return n;if(t.has(n))return t.get(n);var r=new OffscreenCanvas(n.width,n.height);return r.getContext(`2d`).drawImage(n,0,0),t.set(n,r),r},clear:function(){t.clear()}}})(s,new Map),d=function(){var e=16,t,n,r={},i=0;return typeof requestAnimationFrame==`function`&&typeof cancelAnimationFrame==`function`?(t=function(t){var n=Math.random();return r[n]=requestAnimationFrame(function a(o){i===o||i+e-1<o?(i=o,delete r[n],t()):r[n]=requestAnimationFrame(a)}),n},n=function(e){r[e]&&cancelAnimationFrame(r[e])}):(t=function(t){return setTimeout(t,e)},n=function(e){return clearTimeout(e)}),{frame:t,cancel:n}}(),f=(function(){var t,n,i={};function o(e){function t(t,n){e.postMessage({options:t||{},callback:n})}e.init=function(t){var n=t.transferControlToOffscreen();e.postMessage({canvas:n},[n])},e.fire=function(r,a,o){if(n)return t(r,null),n;var s=Math.random().toString(36).slice(2);return n=l(function(a){function c(t){t.data.callback===s&&(delete i[s],e.removeEventListener(`message`,c),n=null,u.clear(),o(),a())}e.addEventListener(`message`,c),t(r,s),i[s]=c.bind(null,{data:{callback:s}})}),n},e.reset=function(){for(var t in e.postMessage({reset:!0}),i)i[t](),delete i[t]}}return function(){if(t)return t;if(!r&&a){var n=[`var CONFETTI, SIZE = {}, module = {};`,`(`+e.toString()+`)(this, module, true, SIZE);`,`onmessage = function(msg) {`,`  if (msg.data.options) {`,`    CONFETTI(msg.data.options).then(function () {`,`      if (msg.data.callback) {`,`        postMessage({ callback: msg.data.callback });`,`      }`,`    });`,`  } else if (msg.data.reset) {`,`    CONFETTI && CONFETTI.reset();`,`  } else if (msg.data.resize) {`,`    SIZE.width = msg.data.resize.width;`,`    SIZE.height = msg.data.resize.height;`,`  } else if (msg.data.canvas) {`,`    SIZE.width = msg.data.canvas.width;`,`    SIZE.height = msg.data.canvas.height;`,`    CONFETTI = module.exports.create(msg.data.canvas);`,`  }`,`}`].join(`
`);try{t=new Worker(URL.createObjectURL(new Blob([n])))}catch(e){return typeof console<`u`&&typeof console.warn==`function`&&console.warn(`🎊 Could not load worker`,e),null}o(t)}return t}})(),p={particleCount:50,angle:90,spread:45,startVelocity:45,decay:.9,gravity:1,drift:0,ticks:200,x:.5,y:.5,shapes:[`square`,`circle`],zIndex:100,colors:[`#26ccff`,`#a25afd`,`#ff5e7e`,`#88ff5a`,`#fcff42`,`#ffa62d`,`#ff36ff`],disableForReducedMotion:!1,scalar:1};function m(e,t){return t?t(e):e}function h(e){return e!=null}function g(e,t,n){return m(e&&h(e[t])?e[t]:p[t],n)}function _(e){return e<0?0:Math.floor(e)}function v(e,t){return Math.floor(Math.random()*(t-e))+e}function y(e){return parseInt(e,16)}function b(e){return e.map(x)}function x(e){var t=String(e).replace(/[^0-9a-f]/gi,``);return t.length<6&&(t=t[0]+t[0]+t[1]+t[1]+t[2]+t[2]),{r:y(t.substring(0,2)),g:y(t.substring(2,4)),b:y(t.substring(4,6))}}function S(e){var t=g(e,`origin`,Object);return t.x=g(t,`x`,Number),t.y=g(t,`y`,Number),t}function C(e){e.width=document.documentElement.clientWidth,e.height=document.documentElement.clientHeight}function w(e){var t=e.getBoundingClientRect();e.width=t.width,e.height=t.height}function T(e){var t=document.createElement(`canvas`);return t.style.position=`fixed`,t.style.top=`0px`,t.style.left=`0px`,t.style.pointerEvents=`none`,t.style.zIndex=e,t}function E(e,t,n,r,i,a,o,s,c){e.save(),e.translate(t,n),e.rotate(a),e.scale(r,i),e.arc(0,0,1,o,s,c),e.restore()}function D(e){var t=e.angle*(Math.PI/180),n=e.spread*(Math.PI/180);return{x:e.x,y:e.y,wobble:Math.random()*10,wobbleSpeed:Math.min(.11,Math.random()*.1+.05),velocity:e.startVelocity*.5+Math.random()*e.startVelocity,angle2D:-t+(.5*n-Math.random()*n),tiltAngle:(Math.random()*.5+.25)*Math.PI,color:e.color,shape:e.shape,tick:0,totalTicks:e.ticks,decay:e.decay,drift:e.drift,random:Math.random()+2,tiltSin:0,tiltCos:0,wobbleX:0,wobbleY:0,gravity:e.gravity*3,ovalScalar:.6,scalar:e.scalar,flat:e.flat}}function O(e,t){t.x+=Math.cos(t.angle2D)*t.velocity+t.drift,t.y+=Math.sin(t.angle2D)*t.velocity+t.gravity,t.velocity*=t.decay,t.flat?(t.wobble=0,t.wobbleX=t.x+10*t.scalar,t.wobbleY=t.y+10*t.scalar,t.tiltSin=0,t.tiltCos=0,t.random=1):(t.wobble+=t.wobbleSpeed,t.wobbleX=t.x+10*t.scalar*Math.cos(t.wobble),t.wobbleY=t.y+10*t.scalar*Math.sin(t.wobble),t.tiltAngle+=.1,t.tiltSin=Math.sin(t.tiltAngle),t.tiltCos=Math.cos(t.tiltAngle),t.random=Math.random()+2);var n=t.tick++/t.totalTicks,r=t.x+t.random*t.tiltCos,i=t.y+t.random*t.tiltSin,a=t.wobbleX+t.random*t.tiltCos,s=t.wobbleY+t.random*t.tiltSin;if(e.fillStyle=`rgba(`+t.color.r+`, `+t.color.g+`, `+t.color.b+`, `+(1-n)+`)`,e.beginPath(),o&&t.shape.type===`path`&&typeof t.shape.path==`string`&&Array.isArray(t.shape.matrix))e.fill(N(t.shape.path,t.shape.matrix,t.x,t.y,Math.abs(a-r)*.1,Math.abs(s-i)*.1,Math.PI/10*t.wobble));else if(t.shape.type===`bitmap`){var c=Math.PI/10*t.wobble,l=Math.abs(a-r)*.1,d=Math.abs(s-i)*.1,f=t.shape.bitmap.width*t.scalar,p=t.shape.bitmap.height*t.scalar,m=new DOMMatrix([Math.cos(c)*l,Math.sin(c)*l,-Math.sin(c)*d,Math.cos(c)*d,t.x,t.y]);m.multiplySelf(new DOMMatrix(t.shape.matrix));var h=e.createPattern(u.transform(t.shape.bitmap),`no-repeat`);h.setTransform(m),e.globalAlpha=1-n,e.fillStyle=h,e.fillRect(t.x-f/2,t.y-p/2,f,p),e.globalAlpha=1}else if(t.shape===`circle`)e.ellipse?e.ellipse(t.x,t.y,Math.abs(a-r)*t.ovalScalar,Math.abs(s-i)*t.ovalScalar,Math.PI/10*t.wobble,0,2*Math.PI):E(e,t.x,t.y,Math.abs(a-r)*t.ovalScalar,Math.abs(s-i)*t.ovalScalar,Math.PI/10*t.wobble,0,2*Math.PI);else if(t.shape===`star`)for(var g=Math.PI/2*3,_=4*t.scalar,v=8*t.scalar,y=t.x,b=t.y,x=5,S=Math.PI/x;x--;)y=t.x+Math.cos(g)*v,b=t.y+Math.sin(g)*v,e.lineTo(y,b),g+=S,y=t.x+Math.cos(g)*_,b=t.y+Math.sin(g)*_,e.lineTo(y,b),g+=S;else e.moveTo(Math.floor(t.x),Math.floor(t.y)),e.lineTo(Math.floor(t.wobbleX),Math.floor(i)),e.lineTo(Math.floor(a),Math.floor(s)),e.lineTo(Math.floor(r),Math.floor(t.wobbleY));return e.closePath(),e.fill(),t.tick<t.totalTicks}function k(e,t,n,a,o){var s=t.slice(),c=e.getContext(`2d`),f,p,m=l(function(t){function l(){f=p=null,c.clearRect(0,0,a.width,a.height),u.clear(),o(),t()}function m(){r&&!(a.width===i.width&&a.height===i.height)&&(a.width=e.width=i.width,a.height=e.height=i.height),!a.width&&!a.height&&(n(e),a.width=e.width,a.height=e.height),c.clearRect(0,0,a.width,a.height),s=s.filter(function(e){return O(c,e)}),s.length?f=d.frame(m):l()}f=d.frame(m),p=l});return{addFettis:function(e){return s=s.concat(e),m},canvas:e,promise:m,reset:function(){f&&d.cancel(f),p&&p()}}}function A(e,n){var r=!e,i=!!g(n||{},`resize`),o=!1,s=g(n,`disableForReducedMotion`,Boolean),c=a&&g(n||{},`useWorker`)?f():null,u=r?C:w,d=e&&c?!!e.__confetti_initialized:!1,p=typeof matchMedia==`function`&&matchMedia(`(prefers-reduced-motion)`).matches,m;function h(t,n,r){for(var i=g(t,`particleCount`,_),a=g(t,`angle`,Number),o=g(t,`spread`,Number),s=g(t,`startVelocity`,Number),c=g(t,`decay`,Number),l=g(t,`gravity`,Number),d=g(t,`drift`,Number),f=g(t,`colors`,b),p=g(t,`ticks`,Number),h=g(t,`shapes`),y=g(t,`scalar`),x=!!g(t,`flat`),C=S(t),w=i,T=[],E=e.width*C.x,O=e.height*C.y;w--;)T.push(D({x:E,y:O,angle:a,spread:o,startVelocity:s,color:f[w%f.length],shape:h[v(0,h.length)],ticks:p,decay:c,gravity:l,drift:d,scalar:y,flat:x}));return m?m.addFettis(T):(m=k(e,T,u,n,r),m.promise)}function y(n){var a=s||g(n,`disableForReducedMotion`,Boolean),f=g(n,`zIndex`,Number);if(a&&p)return l(function(e){e()});r&&m?e=m.canvas:r&&!e&&(e=T(f),document.body.appendChild(e)),i&&!d&&u(e);var _={width:e.width,height:e.height};c&&!d&&c.init(e),d=!0,c&&(e.__confetti_initialized=!0);function v(){if(c){var t={getBoundingClientRect:function(){if(!r)return e.getBoundingClientRect()}};u(t),c.postMessage({resize:{width:t.width,height:t.height}});return}_.width=_.height=null}function y(){m=null,i&&(o=!1,t.removeEventListener(`resize`,v)),r&&e&&(document.body.contains(e)&&document.body.removeChild(e),e=null,d=!1)}return i&&!o&&(o=!0,t.addEventListener(`resize`,v,!1)),c?c.fire(n,_,y):h(n,_,y)}return y.reset=function(){c&&c.reset(),m&&m.reset()},y}var j;function M(){return j||=A(null,{useWorker:!0,resize:!0}),j}function N(e,t,n,r,i,a,o){var s=new Path2D(e),c=new Path2D;c.addPath(s,new DOMMatrix(t));var l=new Path2D;return l.addPath(c,new DOMMatrix([Math.cos(o)*i,Math.sin(o)*i,-Math.sin(o)*a,Math.cos(o)*a,n,r])),l}function P(e){if(!o)throw Error(`path confetti are not supported in this browser`);var t,n;typeof e==`string`?t=e:(t=e.path,n=e.matrix);var r=new Path2D(t),i=document.createElement(`canvas`).getContext(`2d`);if(!n){for(var a=1e3,s=a,c=a,l=0,u=0,d,f,p=0;p<a;p+=2)for(var m=0;m<a;m+=2)i.isPointInPath(r,p,m,`nonzero`)&&(s=Math.min(s,p),c=Math.min(c,m),l=Math.max(l,p),u=Math.max(u,m));d=l-s,f=u-c;var h=10,g=Math.min(h/d,h/f);n=[g,0,0,g,-Math.round(d/2+s)*g,-Math.round(f/2+c)*g]}return{type:`path`,path:t,matrix:n}}function F(e){var t,n=1,r=`#000000`,i=`"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", "Twemoji Mozilla", "system emoji", sans-serif`;typeof e==`string`?t=e:(t=e.text,n=`scalar`in e?e.scalar:n,i=`fontFamily`in e?e.fontFamily:i,r=`color`in e?e.color:r);var a=10*n,o=``+a+`px `+i,s=new OffscreenCanvas(a,a),c=s.getContext(`2d`);c.font=o;var l=c.measureText(t),u=Math.ceil(l.actualBoundingBoxRight+l.actualBoundingBoxLeft),d=Math.ceil(l.actualBoundingBoxAscent+l.actualBoundingBoxDescent),f=2,p=l.actualBoundingBoxLeft+f,m=l.actualBoundingBoxAscent+f;u+=f+f,d+=f+f,s=new OffscreenCanvas(u,d),c=s.getContext(`2d`),c.font=o,c.fillStyle=r,c.fillText(t,p,m);var h=1/n;return{type:`bitmap`,bitmap:s.transferToImageBitmap(),matrix:[h,0,0,h,-u*h/2,-d*h/2]}}n.exports=function(){return M().apply(this,arguments)},n.exports.reset=function(){M().reset()},n.exports.create=A,n.exports.shapeFromPath=P,n.exports.shapeFromText=F})((function(){return typeof window<`u`?window:typeof self<`u`?self:this||{}})(),h,!1);var g=h.exports;h.exports.create;var _=[{id:`zone-parade`,name:`Parade Grounds (Assembly flags)`,type:`emergency`,description:`Central grassy assembly grounds. The main assembly point for all emergency alarms and daily morning/evening flag ceremonies.`,note:`🛎️ If emergency bell rings, report here immediately.`},{id:`zone-dining`,name:`Dining Hall (Primary Lightning Shelter)`,type:`emergency`,description:`Primary dining hall and kitchen. Main indoor space, serves as the designated shelter for severe storms, lightning, and microbursts.`,note:`⚡ Primary lightning shelter. Tents offer zero protection.`},{id:`zone-scoutcraft`,name:`Scoutcraft Area`,type:`program`,description:`Under Area Director Jim Tarleton. Teaching pioneering, wilderness survival, camping, and rope work.`,note:`🗺️ Scoutcraft teaches traditional outdoor skills.`},{id:`zone-handicraft`,name:`Handicraft Area`,type:`program`,description:`Under Area Director Jack Erickson. Teaching woodcarving, basketry, leatherwork, and art.`,note:`🎨 Keep area clean and return all blades/tools to lockers.`},{id:`zone-nature`,name:`Nature Lodge`,type:`program`,description:`Under Area Director Andrew Rasmussen. Teaching astronomy, geology, forestry, environmental science, and reptile study.`,note:`🐍 Non-venomous educational animals housed here.`},{id:`zone-ranges`,name:`Range and Target Activities`,type:`program`,description:`Under Area Director Brian Rome. Archery, rifle, and shotgun ranges.`,note:`🎯 Strictly controlled zones. Suspension under high winds.`},{id:`zone-climbing`,name:`Climbing Wall & Tower`,type:`program`,description:`Under Director Jim Harrington. Rock wall climbing and rappelling training tower.`,note:`🧗 Minimum age of director is 21.`},{id:`zone-staffhill`,name:`Staff Hill (Cabins)`,type:`staff`,description:`North end of camp. Staff quarters, living cabins, and youth/adult staff shower houses.`,note:`🔒 Strictly off-limits to campers. Respect roommate privacy.`},{id:`zone-health`,name:`Health Lodge / Medic Office`,type:`staff`,description:`Medic office and emergency recovery beds. Coordinates first aid, logs injuries, and stores medications.`,note:`🩹 Report all injuries, no matter how minor, immediately.`},{id:`zone-trading`,name:`Trading Post`,type:`staff`,description:`Camp general store and business headquarters. Sells gear, snacks, and souvenirs.`,note:`🎟️ No staff discount or credit tabs. Cash/card only.`}];function v(){return`
    <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;" id="map-parent">
      <!-- Search & Category Filters -->
      <div class="org-chart-controls">
        <div class="search-input-wrapper">
          <svg class="search-icon-svg" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="camp-map-search" placeholder="Search camp area or shelter..." aria-label="Search map zones" />
        </div>
        
        <div class="map-filters">
          <button class="map-filter-btn active" data-filter="all">All Areas</button>
          <button class="map-filter-btn" data-filter="program">Program Areas</button>
          <button class="map-filter-btn" data-filter="emergency">Emergency Shelters</button>
          <button class="map-filter-btn" data-filter="staff">Support & Staff</button>
        </div>
      </div>

      <!-- Map & Sidebar layout -->
      <div class="map-layout-grid">
        <!-- SVG Map Container -->
        <div class="glass-panel" style="padding: 12px; display: flex; flex-direction: column; align-items: center;" id="map-svg-container">
          <div class="map-svg-holder">
            <svg class="office-svg map-svg-element" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="none" />

              <!-- Outer property boundary outline -->
              <rect x="15" y="15" width="770" height="470" fill="none" stroke="hsl(var(--border))" stroke-width="2" stroke-dasharray="8 4" rx="12" />

              <!-- STAF HILL (NORTH) -->
              <rect x="250" y="30" width="300" height="90" class="map-svg-node" id="zone-staffhill" rx="8" />
              <text x="400" y="80" class="map-text">Staff Hill (North Cabins) 🏠</text>

              <!-- RANGE & TARGET AREA (TOP) -->
              <rect x="40" y="30" width="180" height="130" class="map-svg-node" id="zone-ranges" rx="8" />
              <text x="130" y="100" class="map-text">Range & Target 🎯</text>

              <!-- NATURE LODGE -->
              <rect x="40" y="180" width="180" height="90" class="map-svg-node" id="zone-nature" rx="8" />
              <text x="130" y="230" class="map-text">Nature Lodge 🔬</text>

              <!-- SCOUTCRAFT -->
              <rect x="40" y="290" width="180" height="110" class="map-svg-node" id="zone-scoutcraft" rx="8" />
              <text x="130" y="350" class="map-text">Scoutcraft 🗺️</text>

              <!-- CLIMBING TOWER -->
              <circle cx="280" cy="220" r="45" class="map-svg-node" id="zone-climbing" />
              <text x="280" y="225" class="map-text">Climbing 🧗</text>

              <!-- PARADE GROUNDS (CENTER - ASSEMBLY) -->
              <rect x="350" y="160" width="220" height="170" class="map-svg-node evac-grounds" id="zone-parade" rx="10" />
              <text x="460" y="240" class="map-text" style="fill: hsl(var(--accent)); font-weight: 800;">Parade Grounds 🛎️</text>
              <text x="460" y="260" class="map-text" style="font-size: 11px; fill: hsl(var(--accent));">(Evacuation Assembly)</text>

              <!-- DINING HALL (BOTTOM LEFT - SHELTER) -->
              <rect x="250" y="350" width="260" height="110" class="map-svg-node lightning-shelter" id="zone-dining" rx="8" />
              <text x="380" y="405" class="map-text" style="fill: #1d4ed8; font-weight: 800;">Dining Hall 🍽️</text>
              <text x="380" y="425" class="map-text" style="font-size: 11px; fill: #1d4ed8;">(Primary Storm Shelter)</text>

              <!-- HEALTH LODGE -->
              <rect x="590" y="160" width="170" height="90" class="map-svg-node" id="zone-health" rx="8" />
              <text x="675" y="210" class="map-text">Health Lodge 🩹</text>

              <!-- TRADING POST -->
              <rect x="590" y="270" width="170" height="110" class="map-svg-node" id="zone-trading" rx="8" />
              <text x="675" y="330" class="map-text">Trading Post 🎟️</text>

              <!-- HANDICRAFT -->
              <rect x="540" y="390" width="220" height="70" class="map-svg-node" id="zone-handicraft" rx="8" />
              <text x="650" y="430" class="map-text">Handicraft 🎨</text>

              <!-- Entrance road indicator -->
              <path d="M 400 480 L 400 460" stroke="hsl(var(--muted-foreground))" stroke-width="3" stroke-dasharray="4 4" />
              <text x="400" y="495" class="map-text" style="font-size: 10px; fill: hsl(var(--muted-foreground)); font-weight: 500;">Entrance Gate Parking 🚗</text>
            </svg>
          </div>
        </div>

        <!-- Sidebar Inspector / EAP Game panel -->
        <div class="glass-panel" style="display: flex; flex-direction: column; gap: 20px;">
          <button class="welcome-banner-btn" style="background: hsl(var(--danger)); box-shadow: 0 4px 12px hsl(var(--danger)/0.25);" id="eap-bell-btn">
            🚨 Sound EAP Bell Alarm!
          </button>
          
          <div id="map-sidebar-mount">
            <!-- Details shown here -->
            <div class="map-info-placeholder">
              <span style="font-size: 32px; display: block; margin-bottom: 10px;">🔍</span>
              Hover or click on any map zone to inspect descriptions, safety rules, and operational details.
            </div>
          </div>
        </div>
      </div>
    </div>
  `}function y(){let e=document.getElementById(`camp-map-search`),t=document.querySelectorAll(`.map-filter-btn`),n=document.getElementById(`map-sidebar-mount`),r=document.querySelectorAll(`.map-svg-node`),i=document.getElementById(`eap-bell-btn`);document.getElementById(`map-parent`);let a=document.getElementById(`map-svg-container`),o=null;if(!n)return;function s(e){let t=e.id;r.forEach(e=>e.classList.remove(`selected-zone`)),e.classList.add(`selected-zone`);let n=_.find(e=>e.id===t);n&&c(n)}function c(e){n.innerHTML=`
      <div style="animation: tabFadeIn 0.25s ease;">
        <h3 style="color: hsl(var(--primary)); margin-bottom: 8px;">${e.name}</h3>
        <p style="font-size: 14px; line-height: 1.5; margin-bottom: 14px;">${e.description}</p>
        
        <div style="background: hsl(var(--secondary) / 0.5); padding: 12px; border-radius: var(--radius-sm); border-left: 4px solid hsl(var(--primary)); font-size: 13.5px; font-weight: 500; line-height: 1.4;">
          ${e.note}
        </div>
      </div>
    `}r.forEach(e=>{e.addEventListener(`click`,()=>{s(e)})}),t.forEach(e=>{e.addEventListener(`click`,()=>{t.forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`);let n=e.getAttribute(`data-filter`);r.forEach(e=>{let t=e.id,r=_.find(e=>e.id===t);n===`all`||r&&r.type===n?(e.style.opacity=`1`,e.style.filter=`none`):(e.style.opacity=`0.2`,e.style.filter=`grayscale(60%)`)})})}),e.addEventListener(`input`,()=>{let t=e.value.toLowerCase().trim();if(t===``){r.forEach(e=>{e.classList.remove(`selected-zone`),e.style.opacity=`1`,e.style.filter=`none`});return}let n=!1;r.forEach(e=>{let r=e.id,i=_.find(e=>e.id===r);if(!i)return;let a=i.name.toLowerCase().includes(t),o=i.description.toLowerCase().includes(t),c=i.note.toLowerCase().includes(t);a||o||c?(e.style.opacity=`1`,e.style.filter=`none`,e.classList.add(`selected-zone`),n||=(s(e),!0)):(e.style.opacity=`0.2`,e.style.filter=`grayscale(60%)`,e.classList.remove(`selected-zone`))})}),i.addEventListener(`click`,()=>{o===null?l():u()});function l(){o=1,i.textContent=`🛑 Cancel EAP Alarm`,i.style.background=`hsl(var(--foreground))`,a.classList.add(`emergency-alarm-active`),d()}function u(){o=null,i.textContent=`🚨 Sound EAP Bell Alarm!`,i.style.background=`hsl(var(--danger))`,a.classList.remove(`emergency-alarm-active`),n.innerHTML=`
      <div class="map-info-placeholder">
        <span style="font-size: 32px; display: block; margin-bottom: 10px;">🔍</span>
        Hover or click on any map zone to inspect descriptions, safety rules, and operational details.
      </div>
    `}function d(){if(o===1)n.innerHTML=`
        <div class="eap-simulation-panel" style="animation: fadeIn 0.25s ease;">
          <div class="eap-simulation-title">
            <span>🛎️</span> EAP Step 1: Secure Hazards
          </div>
          <p style="font-size: 13px; line-height: 1.4;">
            The camp dining bell is ringing continuously! Your first priority is to quickly secure any active hazards in your program area (extinguish fires, lock gear).
          </p>
          <button class="eap-sim-btn" id="eap-step1-btn">Secure Area Hazards! ✔️</button>
        </div>
      `,document.getElementById(`eap-step1-btn`).addEventListener(`click`,()=>{o=2,d()});else if(o===2){let e=document.getElementById(`zone-parade`);e&&e.classList.add(`selected-zone`),n.innerHTML=`
        <div class="eap-simulation-panel" style="animation: fadeIn 0.25s ease;">
          <div class="eap-simulation-title">
            <span>🚶</span> EAP Step 2: Escort Scouts
          </div>
          <p style="font-size: 13px; line-height: 1.4;">
            Your area is secure. Immediately escort all scouts in your vicinity directly to the Parade Grounds. Do NOT let them return to campsites.
          </p>
          <button class="eap-sim-btn" id="eap-step2-btn">Escort Scouts to Parade Grounds! ➡️</button>
        </div>
      `,document.getElementById(`eap-step2-btn`).addEventListener(`click`,()=>{o=3,d()})}else o===3&&(n.innerHTML=`
        <div class="eap-simulation-panel" style="animation: fadeIn 0.25s ease;">
          <div class="eap-simulation-title">
            <span>📋</span> EAP Step 3: Roll-Call Account
          </div>
          <p style="font-size: 13px; line-height: 1.4;">
            Assembly complete. Scouts line up by troops and cabins. Submit a headcount of your scouts to the Camp Director for registration verification.
          </p>
          <button class="eap-sim-btn" id="eap-step3-btn" style="background: hsl(var(--success));">Check in Headcount! 🎉</button>
        </div>
      `,document.getElementById(`eap-step3-btn`).addEventListener(`click`,()=>{f()}))}function f(){o=null,i.textContent=`🚨 Sound EAP Bell Alarm!`,i.style.background=`hsl(var(--danger))`,a.classList.remove(`emergency-alarm-active`),g({particleCount:100,spread:70,origin:{y:.6}}),n.innerHTML=`
      <div class="glass-panel" style="text-align: center; border-color: hsl(var(--success)); background: hsl(var(--success-light) / 0.15); display: flex; flex-direction: column; gap: 12px; padding: 20px;">
        <span style="font-size: 40px;">🏆</span>
        <h4 style="color: hsl(var(--success)); font-weight: 800; font-family: var(--font-heading);">Evacuation Drill Completed!</h4>
        <p style="font-size: 13px; line-height: 1.4;">
          Excellent! You have successfully completed the Emergency Action Plan simulation. Remember: <strong>Secure Hazards -> Escort directly to flags -> Report headcount</strong>.
        </p>
        <button class="welcome-banner-btn" style="background: hsl(var(--success)); width: 100%; margin-top: 6px;" id="eap-reset-inspector">Reset Map</button>
      </div>
    `,document.getElementById(`eap-reset-inspector`).addEventListener(`click`,()=>{r.forEach(e=>e.classList.remove(`selected-zone`)),n.innerHTML=`
        <div class="map-info-placeholder">
          <span style="font-size: 32px; display: block; margin-bottom: 10px;">🔍</span>
          Hover or click on any map zone to inspect descriptions, safety rules, and operational details.
        </div>
      `})}}function b(e=880,t=.15){try{let n=new(window.AudioContext||window.webkitAudioContext),r=n.createOscillator(),i=n.createGain();r.type=`sine`,r.frequency.setValueAtTime(e,n.currentTime),i.gain.setValueAtTime(.04,n.currentTime),i.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+t),r.connect(i),i.connect(n.destination),r.start(),r.stop(n.currentTime+t)}catch(e){console.warn(`AudioContext block`,e)}}function x(e=.25){try{let t=new(window.AudioContext||window.webkitAudioContext),n=t.sampleRate*e,r=t.createBuffer(1,n,t.sampleRate),i=r.getChannelData(0);for(let e=0;e<n;e++)i[e]=Math.random()*2-1;let a=t.createBufferSource();a.buffer=r;let o=t.createBiquadFilter();o.type=`bandpass`,o.frequency.value=1e3;let s=t.createGain();s.gain.setValueAtTime(.02,t.currentTime),s.gain.exponentialRampToValueAtTime(1e-4,t.currentTime+e),a.connect(o),o.connect(s),s.connect(t.destination),a.start()}catch(e){console.warn(`AudioContext block`,e)}}function S(){return`
    <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
      <!-- Tabs selectors -->
      <div class="schedule-tabs-container">
        <button class="schedule-tab-btn active" id="safety-tab-flowcharts">Emergency Flowcharts</button>
        <button class="schedule-tab-btn" id="safety-tab-radio">Interactive Radio Simulator</button>
        <button class="schedule-tab-btn" id="safety-tab-guidelines">Camp Guidelines</button>
        <button class="schedule-tab-btn" id="safety-tab-legal">Legal Policies</button>
      </div>

      <!-- Content panels mount point -->
      <div id="safety-panel-mount">
        <!-- Renders dynamically -->
      </div>
    </div>
  `}function C(){let e=document.getElementById(`safety-tab-flowcharts`),t=document.getElementById(`safety-tab-radio`),n=document.getElementById(`safety-tab-guidelines`),r=document.getElementById(`safety-tab-legal`),i=document.getElementById(`safety-panel-mount`);if(!i)return;let a=[];function o(){a.forEach(e=>clearTimeout(e)),a=[];let e=document.getElementById(`radio-led`),t=document.getElementById(`radio-screen-channel`),n=document.getElementById(`radio-screen-status`);e&&(e.style.background=`#10b981`,e.style.boxShadow=`0 0 6px #10b981`),t&&(t.textContent=`CH 1: ADMIN`),n&&(n.textContent=`IDLE READY`)}function s(){e.classList.add(`active`),t.classList.remove(`active`),n.classList.remove(`active`),r.classList.remove(`active`),o(),i.innerHTML=`
      <div class="schedule-content-panel" style="animation: tabFadeIn 0.3s ease both;">
        <p style="color: hsl(var(--muted-foreground)); font-size: 15px; max-width: 750px; line-height: 1.5; margin-bottom: 10px;">
          As camp staff, protecting youth and ensuring property safety is your primary duty. Review these interactive guides for severe weather drills, wildlife protocols, and mandatory Arizona reporting laws.
        </p>

        <div class="safety-flowcharts-grid">
          <!-- Lightning Safety Flowchart -->
          <div class="glass-panel flowchart-container">
            <h3 style="color: hsl(var(--primary)); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <span>⚡</span> Lightning Safety (30/30 Rule)
            </h3>
            
            <div class="flowchart-card action">
              <strong>Lightning flash or audible thunder detected</strong>
            </div>
            
            <div class="flowchart-arrow">↓</div>
            
            <div class="flowchart-card decision">
              <strong>Time between flash & thunder &le; 30 seconds?</strong>
              <div style="display: flex; justify-content: space-around; margin-top: 8px; font-weight: bold; font-size: 12px;">
                <span style="color: hsl(var(--danger));">YES</span>
                <span style="color: hsl(var(--muted-foreground));">NO</span>
              </div>
            </div>
            
            <div style="display: flex; gap: 20px; width: 100%; justify-content: center;">
              <div style="display: flex; flex-direction: column; align-items: center; width: 48%;">
                <div class="flowchart-arrow">↓</div>
                <div class="flowchart-card emergency" style="font-size: 12px; padding: 10px;">
                  <strong>Evacuate to Dining Hall!</strong>
                  <p style="font-size: 10px; margin-top: 4px; opacity: 0.85;">Tents offer zero protection.</p>
                </div>
                <div class="flowchart-arrow">↓</div>
                <div class="flowchart-card action" style="font-size: 11px; padding: 8px;">
                  Wait 30 minutes after last visible flash/thunder.
                </div>
              </div>
              
              <div style="display: flex; flex-direction: column; align-items: center; width: 48%;">
                <div class="flowchart-arrow">↓</div>
                <div class="flowchart-card action" style="font-size: 12px; padding: 10px; height: fit-content; margin-top: 10px;">
                  <strong>Monitor weather</strong>
                  <p style="font-size: 10px; margin-top: 4px; opacity: 0.85;">Stay alert for shifts.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Bear & Wildlife Flowchart -->
          <div class="glass-panel flowchart-container">
            <h3 style="color: hsl(var(--primary)); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <span>🐻</span> Bear Sighting (Code Brown)
            </h3>
            
            <div class="flowchart-card action">
              <strong>Bear spotted on camp grounds</strong>
            </div>
            
            <div class="flowchart-arrow">↓</div>
            
            <div class="flowchart-card decision">
              <strong>Remain Calm & Assess Threat</strong>
              <p style="font-size: 10px; opacity: 0.85; margin-top: 2px;">Ensure no smellables/food in sight.</p>
            </div>
            
            <div class="flowchart-arrow">↓</div>
            
            <div class="flowchart-card action">
              <strong>Radio "Code Brown" to Camp Director</strong>
              <p style="font-size: 10px; opacity: 0.85; margin-top: 2px;">Keep distant visual (Adults only).</p>
            </div>
            
            <div class="flowchart-arrow">↓</div>
            
            <div class="flowchart-card emergency">
              <strong>If bear attacks / charges:</strong>
              <p style="font-size: 12px; margin-top: 4px; font-weight: bold; color: hsl(var(--danger));">Yell loudly, throw objects. Do NOT run. Sound dining bell alarm.</p>
            </div>
          </div>

          <!-- Mandatory Abuse Reporting (ARS 13-3620) -->
          <div class="glass-panel flowchart-container" style="grid-column: 1 / -1; max-width: 100%;">
            <h3 style="color: hsl(var(--primary)); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <span>🛡️</span> Mandatory Reporting Hotline (ARS 13-3620)
            </h3>
            
            <div class="flowchart-card action" style="max-width: 500px;">
              <strong>Good-faith suspicion of child abuse or neglect</strong>
            </div>
            
            <div class="flowchart-arrow">↓</div>
            
            <div class="flowchart-card emergency" style="max-width: 500px;">
              <strong>Your Legal Duty: Mandated Reporter</strong>
              <p style="font-size: 12.5px; opacity: 0.9; margin-top: 4px;">You must report immediately. This duty cannot be delegated to supervisors.</p>
            </div>
            
            <div class="flowchart-arrow">↓</div>
            
            <div style="display: flex; gap: 20px; width: 100%; max-width: 700px; justify-content: center; flex-wrap: wrap;">
              <div class="flowchart-card action" style="flex: 1; min-width: 220px;">
                <h4 style="color: hsl(var(--primary)); font-size: 15px; font-weight: 700;">DCS Hotline 📞</h4>
                <p style="font-weight: 800; font-size: 17px; margin: 4px 0; color: hsl(var(--danger));">1-888-SOS-CHILD</p>
                <span style="font-size: 11px; opacity: 0.85;">(1-888-767-2445) Arizona State Hotline</span>
              </div>
              
              <div class="flowchart-card action" style="flex: 1; min-width: 220px;">
                <h4 style="color: hsl(var(--primary)); font-size: 15px; font-weight: 700;">Scouts First Helpline 📞</h4>
                <p style="font-weight: 800; font-size: 17px; margin: 4px 0;">1-844-SCOUTS1</p>
                <span style="font-size: 11px; opacity: 0.85;">(1-844-726-8871) 24hr Youth Safety helpline</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Heat Stress Matrix -->
        <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px;">
          <h3 style="color: hsl(var(--primary));">☀️ Heat Stress Diagnostics</h3>
          <p style="font-size: 14.5px; color: hsl(var(--muted-foreground));">Review symptoms to identify heat illnesses on dry mountain trails.</p>
          
          <div class="heat-matrix">
            <div class="heat-card exhaustion">
              <h4 style="color: hsl(var(--warning)); font-weight: 800; font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
                <span>⚠️</span> Heat Exhaustion
              </h4>
              <div style="font-size: 13.5px; line-height: 1.5;">
                <strong>Symptoms:</strong> Heavy sweating, pale or clammy skin, nausea or vomiting, dizziness, weakness, headache, muscle cramps.
                <br><br>
                <strong>Treatment:</strong> Move to shade immediately. Cool down with wet towels, remove excess clothing, sip cool water slowly. Do NOT give salt tablets.
              </div>
            </div>
            
            <div class="heat-card stroke">
              <h4 style="color: hsl(var(--danger)); font-weight: 800; font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
                <span>🚨</span> Heatstroke (Emergency!)
              </h4>
              <div style="font-size: 13.5px; line-height: 1.5;">
                <strong>Symptoms:</strong> Altered mental state (confusion, slurred speech), extremely hot, red, or flushed dry skin, rapid strong pulse, loss of consciousness.
                <br><br>
                <strong>Treatment:</strong> <strong>Call 911 immediately.</strong> Move to shade, cool rapidly using ice packs or cold water immersion. Do NOT give anything by mouth.
              </div>
            </div>
          </div>
        </div>
      </div>
    `}function c(){e.classList.remove(`active`),t.classList.add(`active`),n.classList.remove(`active`),r.classList.remove(`active`),o(),i.innerHTML=`
      <div class="schedule-content-panel" style="animation: tabFadeIn 0.3s ease both;">
        <div style="background: hsl(var(--primary) / 0.05); border: 1px dashed hsl(var(--primary) / 0.2); border-radius: var(--radius-md); padding: 16px; font-size: 14px; line-height: 1.5; color: hsl(var(--muted-foreground));">
          📻 <strong>Official Radio Simulator:</strong> Under FCC regulations, camp radios are for official purposes only. Play scenarios to check proper, compliant communication protocols (no real names, specific designations).
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 24px; margin-top: 10px;">
          <!-- Handheld Walkie-Talkie UI -->
          <div class="glass-panel" style="display: flex; flex-direction: column; align-items: center; padding: 24px; background: hsl(var(--secondary) / 0.2); border: 2px solid hsl(var(--border)); border-radius: 24px; position: relative; max-width: 320px; margin: auto; width: 100%;">
            
            <!-- Dial Knobs -->
            <div style="width: 20px; height: 12px; background: #1e293b; position: absolute; top: -12px; left: 60px; border-radius: 3px 3px 0 0;"></div>
            <div style="width: 14px; height: 45px; background: #334155; position: absolute; top: -45px; right: 80px; border-radius: 2px 2px 0 0;"></div>
            
            <!-- LED Light -->
            <div style="display: flex; gap: 6px; align-self: flex-end; align-items: center; margin-bottom: 12px;">
              <span style="font-size: 9px; font-weight: 700; color: hsl(var(--muted-foreground)); letter-spacing: 0.5px;">TX/RX</span>
              <div id="radio-led" style="width: 10px; height: 10px; border-radius: 50%; background: #10b981; box-shadow: 0 0 6px #10b981; transition: all 0.2s;"></div>
            </div>

            <!-- Radio Digital Screen -->
            <div style="width: 100%; height: 90px; background: #0f172a; border-radius: var(--radius-sm); border: 2px solid #334155; padding: 10px; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #38bdf8; font-family: monospace; text-shadow: 0 0 4px #0284c7; box-shadow: inset 0 2px 8px rgba(0,0,0,0.8); margin-bottom: 20px;">
              <div style="font-size: 9px; color: #475569; letter-spacing: 1px; font-weight: bold;">CAMP LAWTON COMMS</div>
              <div id="radio-screen-channel" style="font-size: 15px; font-weight: bold; margin-top: 4px;">CH 1: ADMIN</div>
              <div id="radio-screen-status" style="font-size: 10px; color: #a7f3d0; margin-top: 4px;">IDLE READY</div>
            </div>

            <!-- Speaker holes design -->
            <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 24px; width: 80%; opacity: 0.5;">
              <div style="height: 3px; background: #475569; border-radius: 2px;"></div>
              <div style="height: 3px; background: #475569; border-radius: 2px; width: 90%; margin: auto;"></div>
              <div style="height: 3px; background: #475569; border-radius: 2px; width: 80%; margin: auto;"></div>
              <div style="height: 3px; background: #475569; border-radius: 2px; width: 70%; margin: auto;"></div>
            </div>

            <!-- PTT Button -->
            <button id="radio-ptt-btn" style="width: 100%; padding: 14px; border-radius: var(--radius-md); background: hsl(var(--primary)); color: white; border: none; font-weight: 800; cursor: pointer; box-shadow: var(--shadow-md); transition: all 0.2s; font-family: var(--font-heading); font-size: 13px;" aria-label="Push-to-Talk button">
              🎤 PRESS PTT TO TEST
            </button>
            <span style="font-size: 10px; color: hsl(var(--muted-foreground)); margin-top: 6px; font-weight: 500;">Hold to chirp microphone</span>
          </div>

          <!-- Script Triggers & Real-Time Transcript Display -->
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div class="glass-panel" style="padding: 18px; display: flex; flex-direction: column; gap: 10px;">
              <h4 style="font-weight: 700; margin-bottom: 4px;">Simulate Scenario Calls:</h4>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <button class="welcome-banner-btn radio-scenario-btn" data-scenario="routine" style="padding: 10px; font-size: 13px; text-align: left; background: hsl(var(--primary) / 0.08); border: 1px solid hsl(var(--primary) / 0.3); color: hsl(var(--primary));">
                  <strong>💬 Routine Call:</strong> "Scoutcraft to HQ"
                </button>
                <button class="welcome-banner-btn radio-scenario-btn" data-scenario="wildlife" style="padding: 10px; font-size: 13px; text-align: left; background: hsl(var(--accent) / 0.08); border: 1px solid hsl(var(--accent) / 0.3); color: hsl(var(--accent));">
                  <strong>🐻 Code Brown:</strong> Bear sighting report
                </button>
                <button class="welcome-banner-btn radio-scenario-btn" data-scenario="medical" style="padding: 10px; font-size: 13px; text-align: left; background: hsl(var(--danger) / 0.08); border: 1px solid hsl(var(--danger) / 0.3); color: hsl(var(--danger));">
                  <strong>🚨 Code Blue:</strong> Medical emergency call
                </button>
                <button class="welcome-banner-btn radio-scenario-btn" data-scenario="illegal" style="padding: 10px; font-size: 13px; text-align: left; background: hsl(var(--secondary)); border: 1px solid hsl(var(--border)); color: inherit;">
                  <strong>❌ FCC Violation:</strong> Non-official/names call
                </button>
              </div>
            </div>

            <!-- Transcript Logs -->
            <div class="glass-panel" style="flex-grow: 1; display: flex; flex-direction: column; padding: 18px; min-height: 200px;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid hsl(var(--border)); padding-bottom: 8px; margin-bottom: 10px;">
                <h4 style="font-weight: 700; font-size: 14px;">Radio Transcript Logs</h4>
                <button id="radio-clear-log" style="font-size: 11px; background: transparent; border: none; cursor: pointer; color: hsl(var(--muted-foreground)); font-weight: 600;">Clear</button>
              </div>
              <div id="radio-transcript-mount" style="font-family: monospace; font-size: 12px; display: flex; flex-direction: column; gap: 8px; overflow-y: auto; height: 160px; max-height: 160px; padding-right: 6px;">
                <div style="color: hsl(var(--muted-foreground)); font-style: italic;">No active transmissions. Press a scenario to begin or hold PTT to test.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,l()}function l(){let e=document.getElementById(`radio-ptt-btn`),t=document.getElementById(`radio-led`),n=document.getElementById(`radio-screen-channel`),r=document.getElementById(`radio-screen-status`),i=document.getElementById(`radio-clear-log`),s=document.getElementById(`radio-transcript-mount`),c=!1;if(e){let i=e=>{e.preventDefault(),!c&&(c=!0,o(),b(980,.1),t&&(t.style.background=`#ef4444`,t.style.boxShadow=`0 0 8px #ef4444`),r&&(r.textContent=`TRANSMITTING`),n&&(n.textContent=`CH 1: TX TEST`),s.innerHTML=`<div style="color: hsl(var(--primary)); font-weight: bold;">[TX TEST] Mic open. Release button to end transmission.</div>`)},a=()=>{c&&(c=!1,x(.15),t&&(t.style.background=`#10b981`,t.style.boxShadow=`0 0 6px #10b981`),r&&(r.textContent=`IDLE READY`),n&&(n.textContent=`CH 1: ADMIN`),s.innerHTML+=`<div style="color: hsl(var(--muted-foreground)); font-style: italic;">Transmission ended. [STATIC]</div>`,s.scrollTop=s.scrollHeight)};e.addEventListener(`mousedown`,i),e.addEventListener(`mouseup`,a),e.addEventListener(`mouseleave`,a),e.addEventListener(`touchstart`,i),e.addEventListener(`touchend`,a)}i&&s&&i.addEventListener(`click`,()=>{o(),s.innerHTML=`<div style="color: hsl(var(--muted-foreground)); font-style: italic;">Logs cleared. Select a scenario.</div>`}),document.querySelectorAll(`.radio-scenario-btn`).forEach(e=>{e.addEventListener(`click`,()=>{u(e.getAttribute(`data-scenario`))})});let l={routine:[{type:`beep`},{type:`tx`,sender:`Scoutcraft`,text:`Scoutcraft to HQ. Over.`},{type:`static`},{type:`rx`,sender:`HQ`,text:`HQ, go ahead. Over.`},{type:`beep`},{type:`tx`,sender:`Scoutcraft`,text:`Scoutcraft program area is locked and secure. Instructors returning to Staff Hill. Out.`},{type:`static`},{type:`rx`,sender:`HQ`,text:`HQ Copy. Scoutcraft clear. Out.`}],wildlife:[{type:`beep`},{type:`tx`,sender:`Commissioner`,text:`Commissioner to Ranger. Over.`},{type:`static`},{type:`rx`,sender:`Ranger`,text:`Ranger, go ahead. Over.`},{type:`beep`},{type:`tx`,sender:`Commissioner`,text:`Report a Code Brown near the youth shower house, moving east. Over.`},{type:`static`},{type:`rx`,sender:`Ranger`,text:`Ranger Copy. Code Brown logged. Contacting Camp Director. Out.`}],medical:[{type:`beep`},{type:`tx`,sender:`Nature`,text:`Nature to Medic. Urgent. Over.`},{type:`static`},{type:`rx`,sender:`Medic`,text:`Medic, go ahead. Over.`},{type:`beep`},{type:`tx`,sender:`Nature`,text:`Code Blue at Nature Trail entrance. Scout fell. Conscious, but possible sprain. Over.`},{type:`static`},{type:`rx`,sender:`Medic`,text:`Medic copy. Responding now. All stations clear air for Code Blue. Out.`}],illegal:[{type:`beep`},{type:`tx`,sender:`Nature`,text:`Hey Dave, is Jim there? Can you tell him to bring my sunglasses to Nature Lodge?`},{type:`violation`,title:`⚠️ FCC PROTOCOL VIOLATION DETECTED`,text:`Reason: Ties up official emergency channel, uses real names, and contains non-official business. Keep the air clean!`}]};function u(e){if(o(),!s)return;s.innerHTML=`<div style="color: hsl(var(--primary)); font-weight: 700; font-style: italic;">Starting Scenario: ${e.toUpperCase()}...</div>`;let i=l[e],c=300;i.forEach((e,o)=>{let l=setTimeout(()=>{s&&(e.type===`beep`?(b(880,.12),t&&(t.style.background=`#ef4444`,t.style.boxShadow=`0 0 8px #ef4444`),r&&(r.textContent=`TRANSMITTING`),n&&(n.textContent=`CH 1: TX`)):e.type===`static`?(x(.18),t&&(t.style.background=`#f59e0b`,t.style.boxShadow=`0 0 8px #f59e0b`),r&&(r.textContent=`RECEIVING`),n&&(n.textContent=`CH 1: RX`)):e.type===`tx`?s.innerHTML+=`
              <div style="color: hsl(var(--primary)); margin-top: 4px;">
                <strong>Outgoing (TX): [${e.sender}]</strong> "${e.text}"
              </div>
            `:e.type===`rx`?s.innerHTML+=`
              <div style="color: hsl(var(--accent)); margin-top: 4px;">
                <strong>Incoming (RX): [${e.sender}]</strong> "${e.text}"
              </div>
            `:e.type===`violation`&&(t&&(t.style.background=`#ef4444`,t.style.boxShadow=`0 0 10px #ef4444`),r&&(r.textContent=`ALERT ERROR`),s.innerHTML+=`
              <div style="color: hsl(var(--danger)); font-weight: 800; margin-top: 8px; border: 1px dashed hsl(var(--danger)); padding: 8px; border-radius: var(--radius-sm); background: hsl(var(--danger) / 0.05);">
                ${e.title}
                <p style="font-size: 11px; font-weight: 500; margin-top: 4px; color: inherit;">${e.text}</p>
              </div>
            `,b(440,.4)),s.scrollTop=s.scrollHeight,o===i.length-1&&e.type!==`violation`&&setTimeout(()=>{t&&(t.style.background=`#10b981`,t.style.boxShadow=`0 0 6px #10b981`),r&&(r.textContent=`IDLE READY`),n&&(n.textContent=`CH 1: ADMIN`)},800))},c);a.push(l),e.type===`beep`||e.type===`static`?c+=250:c+=1400})}}function u(){e.classList.remove(`active`),t.classList.remove(`active`),n.classList.add(`active`),r.classList.remove(`active`),o(),i.innerHTML=`
      <div class="schedule-content-panel" style="animation: tabFadeIn 0.3s ease both;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 20px;">
          
          <!-- Cabin Guidelines -->
          <div class="glass-panel" style="display: flex; flex-direction: column; gap: 12px; border-top: 4px solid hsl(var(--primary));">
            <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
              <span>🏠</span> Cabin Rules & Hygiene
            </h3>
            <ul style="font-size: 13.5px; color: hsl(var(--muted-foreground)); padding-left: 20px; line-height: 1.5; display: flex; flex-direction: column; gap: 8px;">
              <li><strong>Mutual Respect:</strong> Maintain an orderly and hygienic living environment. Cabin occupancy is up to 8 staff members. Respect personal space.</li>
              <li><strong>Clear Pathways:</strong> Keep all pathways clear of obstructions. Arrange equipment thoughtfully to ensure egress routes.</li>
              <li><strong>Lockable Trunks:</strong> Use one or two lockable trunks fitting under/beside bunks to organize and protect personal belongings.</li>
              <li><strong>Laundry limits:</strong> Keep a laundry bag handy. Dirty socks shouldn't become a shared sensory experience. Handwash or arrange mountain laundromat runs.</li>
              <li><strong>Inspections:</strong> Quarters are an extension of the onstage experience. Admin reserves the right to conduct inspections for health, safety, and rules, adhering strictly to Safeguarding Youth protocols.</li>
              <li><strong>Music Restriction:</strong> No music played outside of the cabin, including the porch. Lights Out (10 PM - 6 AM) must be respected.</li>
            </ul>
          </div>

          <!-- Vehicle Guidelines -->
          <div class="glass-panel" style="display: flex; flex-direction: column; gap: 12px; border-top: 4px solid hsl(var(--accent));">
            <h3 style="color: hsl(var(--accent)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
              <span>🚗</span> Vehicles & Parking Hills
            </h3>
            <ul style="font-size: 13.5px; color: hsl(var(--muted-foreground)); padding-left: 20px; line-height: 1.5; display: flex; flex-direction: column; gap: 8px;">
              <li><strong>Backed In:</strong> Staff park on Staff Hill. All vehicles must be backed in and face the exit road for quick evacuation during EAP emergencies.</li>
              <li><strong>Under-18 Permit:</strong> Staff under 18 must have written parental approval and Camp Director approval to bring a motor vehicle.</li>
              <li><strong>Passenger Safety:</strong> Junior staff transported by persons other than parents must have written parental permission.</li>
              <li><strong>Restricted Access:</strong> Vehicles must remain in the Staff Hill parking lot. No motorized vehicles inside camp proper unless explicitly vetted.</li>
              <li><strong>Locked Cabin-only Items:</strong> Tobacco products possessed by staff 21+ must be locked in their vehicles. Smoking is allowed ONLY inside vehicles with windows closed.</li>
            </ul>
          </div>

          <!-- Visitor Procedures -->
          <div class="glass-panel" style="display: flex; flex-direction: column; gap: 12px; border-top: 4px solid #3b82f6;">
            <h3 style="color: #3b82f6; font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
              <span>👥</span> Visitor Safety Protocols
            </h3>
            <ul style="font-size: 13.5px; color: hsl(var(--muted-foreground)); padding-left: 20px; line-height: 1.5; display: flex; flex-direction: column; gap: 8px;">
              <li><strong>Prior Approval:</strong> Visitors must give advance notice and be approved by the Camp or Program Director before arrival.</li>
              <li><strong>Office Sign-In:</strong> Immediately sign in at the Guest Sign-In sheet at the Camp Office upon arrival. Sign out upon departure.</li>
              <li><strong>Overnight Stays:</strong> Overnights are allowed only with Camp Director permission, requiring a completed BSA Health Form (Parts A & B) and a Health Officer check.</li>
              <li><strong>Camp Rules:</strong> Guests are expected to follow all camp rules, dress appropriately, and stay out of staff quarters (strictly off-limits).</li>
              <li><strong>Intruder Alerts:</strong> Report any unauthorized persons on camp grounds immediately to the Camp Director.</li>
            </ul>
          </div>

        </div>
      </div>
    `}function f(){r.classList.add(`active`),t.classList.remove(`active`),n.classList.remove(`active`),e.classList.remove(`active`),i.innerHTML=`
      <div class="schedule-content-panel" style="animation: tabFadeIn 0.3s ease both;">
        <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
          <span>⚖️</span> Legal & Administrative Policies
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap: 16px;">
          ${d.legalPolicies.map((e,t)=>`
      <div style="background: hsl(var(--card)); border: 1px solid hsl(var(--border)); padding: 18px; border-radius: var(--radius-sm); border-left: 4px solid hsl(var(--primary));">
        <h4 style="font-weight: 700; margin-bottom: 8px;">${e.title}</h4>
        <p style="font-size: 13.5px; color: hsl(var(--muted-foreground)); line-height: 1.5;">${e.content}</p>
      </div>
    `).join(``)}
        </div>
      </div>
    `}e.addEventListener(`click`,s),t.addEventListener(`click`,c),n.addEventListener(`click`,u),r.addEventListener(`click`,f);let p=()=>{o(),window.removeEventListener(`before-view-change`,p)};window.addEventListener(`before-view-change`,p),s()}function w(){return`
    <div style="display: flex; flex-direction: column; gap: 32px; width: 100%;">
      <!-- Paperwork Checklist Section -->
      <div class="glass-panel" style="display: flex; flex-direction: column; gap: 20px;">
        <div class="packing-header-bar">
          <h3 style="color: hsl(var(--primary)); font-size: 18px; display: flex; align-items: center; gap: 8px;">
            <span>📝</span> Required Paperwork Checklist
          </h3>
          <span style="font-size: 14px; font-weight: 700; color: hsl(var(--primary));" id="paperwork-progress-val">Done: 0/7</span>
        </div>
        <div class="packing-items-grid" id="paperwork-mount">
          <!-- Injected dynamically -->
        </div>
      </div>

      <!-- Packing List Section -->
      <div class="glass-panel" style="display: flex; flex-direction: column; gap: 20px;">
        <div class="packing-header-bar">
          <h3 style="color: hsl(var(--primary)); font-size: 18px; display: flex; align-items: center; gap: 8px;">
            <span>🎒</span> Camp Packing Assistant
          </h3>
          <span style="font-size: 14px; font-weight: 700; color: hsl(var(--primary));" id="packing-progress-val">Packed: 0/0 items</span>
        </div>
        
        <!-- Filters tab bar -->
        <div class="packing-filter-tabs">
          <button class="packing-filter-tab active" data-filter="all">All Items</button>
          <button class="packing-filter-tab" data-filter="Clothing">Clothing</button>
          <button class="packing-filter-tab" data-filter="Gear">Necessary Gear</button>
          <button class="packing-filter-tab" data-filter="Optional">Optional</button>
          <button class="packing-filter-tab" data-filter="Privileged">Privileged</button>
          <button class="packing-filter-tab" data-filter="Prohibited" style="color: hsl(var(--danger));">Prohibited</button>
        </div>

        <div class="packing-items-grid" id="packing-mount">
          <!-- Injected dynamically -->
        </div>
      </div>

      <!-- Code of Conduct Commitment Signer -->
      <div class="glass-panel" style="display: flex; flex-direction: column; gap: 20px;">
        <h3 style="color: hsl(var(--primary)); font-size: 18px; display: flex; align-items: center; gap: 8px;">
          <span>✍️</span> Code of Conduct Commitment Signer
        </h3>
        
        <div style="font-size: 14px; line-height: 1.5; color: hsl(var(--muted-foreground)); max-height: 250px; overflow-y: auto; padding: 12px; background: hsl(var(--secondary) / 0.3); border-radius: var(--radius-sm); border: 1px solid hsl(var(--border) / 0.5);">
          <strong style="color: hsl(var(--primary)); font-size: 15px; display: block; margin-bottom: 8px;">CAMP LAWTON SUMMER CAMP STAFF - COMMITMENT & CODE OF CONDUCT</strong>
          The Scout Oath and Law are the foundation of our camp culture. As a Camp Lawton staff member, your personal habits and actions are the living embodiment of Scouting.
          <br><br>
          <strong>Accountability Framework:</strong>
          We resolve issues through a progressive support model:
          <ul>
            <li>Phase 1: Coaching & Realignment (Discussion with Area Director)</li>
            <li>Phase 2: Formal Intervention (Documented plan, parent notification if under 18)</li>
            <li>Phase 3: Separation (Dismissal if incompatible with camp expectations)</li>
          </ul>
          <br>
          <strong>Daily Behavioral Expectations:</strong>
          Uphold professionalism (be present on time, stay sharp in uniform, respect the hierarchy) and respect the community (no pranks, maintain restroom privacy, no sexual activity, protect camp equipment).
          <br><br>
          <strong>Zero-Tolerance (Immediate Discharge):</strong>
          Involvement in YPT violations, possession of alcohol/drugs/marijuana, theft or vandalism, possession of prohibited weapons, or transport of minors without parental forms leads to immediate dismissal and legal reporting.
        </div>

        <div class="signer-panel" id="signer-inputs-panel">
          <!-- Form -->
          <div class="signer-inputs-row">
            <div class="signer-field">
              <label for="conduct-name-input">Staff Member Name</label>
              <input type="text" id="conduct-name-input" readonly />
            </div>
            
            <div class="signer-field">
              <label for="conduct-sig-input">Digital Signature (Type Full Name)</label>
              <input type="text" id="conduct-sig-input" placeholder="Type signature here..." />
            </div>

            <div class="signer-field">
              <label for="conduct-date-input">Signing Date</label>
              <input type="date" id="conduct-date-input" />
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 10px; margin-top: 6px;">
            <input type="checkbox" id="conduct-agree-chk" style="width: 18px; height: 18px; cursor: pointer;" />
            <label for="conduct-agree-chk" style="font-size: 13.5px; font-weight: 500; cursor: pointer;">
              I agree to live by this Code of Conduct, Camp Staff Guide, my Letter of Agreement, and the Scout Oath and Law.
            </label>
          </div>

          <button class="welcome-banner-btn" style="width: fit-content; margin-top: 10px;" id="conduct-sign-btn">
            Sign Code of Conduct
          </button>
        </div>

        <!-- Success overlay if signed -->
        <div id="signer-success-panel" style="display: none; text-align: center; border-color: hsl(var(--success)); background: hsl(var(--success-light) / 0.15); border-radius: var(--radius-sm); border: 1px solid hsl(var(--success)); padding: 20px; flex-direction: column; gap: 8px;">
          <h4 style="color: hsl(var(--success)); font-weight: 800; font-family: var(--font-heading);">✓ Digital Commitment Signed</h4>
          <p style="font-size: 13px; line-height: 1.4;">
            Thank you, <strong id="signed-name-val">Alex</strong>! Your signed Code of Conduct is on file. This task has been marked complete on your readiness checklist.
          </p>
          <button class="quiz-restart-btn" style="align-self: center; margin-top: 4px; padding: 6px 14px; font-size: 12.5px;" id="conduct-unsign-btn">Unsign / Reset Form</button>
        </div>

      </div>
    </div>
  `}function T(){let e=document.getElementById(`packing-mount`),t=document.getElementById(`packing-progress-val`),n=document.querySelectorAll(`.packing-filter-tab`),r=document.getElementById(`conduct-name-input`),i=document.getElementById(`conduct-sig-input`),o=document.getElementById(`conduct-date-input`),s=document.getElementById(`conduct-agree-chk`),c=document.getElementById(`conduct-sign-btn`),l=document.getElementById(`conduct-unsign-btn`),u=document.getElementById(`signer-inputs-panel`),d=document.getElementById(`signer-success-panel`),p=document.getElementById(`signed-name-val`),m=document.getElementById(`paperwork-mount`),h=document.getElementById(`paperwork-progress-val`);if(!e)return;let g=JSON.parse(localStorage.getItem(`lawton_packed_items`))||[],_=JSON.parse(localStorage.getItem(`lawton_paperwork_items`))||[];function v(){localStorage.setItem(`lawton_paperwork_items`,JSON.stringify(_)),y()}function y(){if(!h)return;let e=f.paperwork.length;h.textContent=`Done: ${_.length}/${e}`}function b(){m&&(m.innerHTML=f.paperwork.map(e=>{let t=_.includes(e.id);return`
        <div class="packing-item-card ${t?`packed`:``}" data-pw-id="${e.id}" role="checkbox" aria-checked="${t}">
          <div class="packing-item-checkbox"></div>
          <span class="packing-item-name">${e.name}</span>
        </div>
      `}).join(``),m.querySelectorAll(`.packing-item-card`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-pw-id`),n=_.indexOf(t);n>-1?(_.splice(n,1),e.classList.remove(`packed`)):(_.push(t),e.classList.add(`packed`)),v()})}))}function x(){localStorage.setItem(`lawton_packed_items`,JSON.stringify(g)),S()}function S(){if(!t)return;let e=a.filter(e=>e.status!==`prohibited`).length;t.textContent=`Packed: ${a.filter(e=>e.status!==`prohibited`&&g.includes(e.id)).length}/${e} items`}function C(t=`all`){e.innerHTML=a.filter(e=>t===`all`?!0:e.category===t).map(e=>{let t=e.status===`prohibited`,n=g.includes(e.id);return`
        <div class="packing-item-card ${n&&!t?`packed`:``} ${t?`prohibited`:``}" data-item-id="${e.id}" role="checkbox" aria-checked="${n}">
          <div class="packing-item-checkbox"></div>
          <span class="packing-item-name">${e.name}</span>
        </div>
      `}).join(``),e.querySelectorAll(`.packing-item-card`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-item-id`),n=a.find(e=>e.id===t);if(n&&n.status!==`prohibited`){let n=g.indexOf(t);n>-1?(g.splice(n,1),e.classList.remove(`packed`)):(g.push(t),e.classList.add(`packed`)),x()}})})}n.forEach(e=>{e.addEventListener(`click`,()=>{n.forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`),C(e.getAttribute(`data-filter`))})});function w(){B.signedConduct?(u&&(u.style.display=`none`),d&&(d.style.display=`flex`,p.textContent=B.username)):(u&&(u.style.display=`flex`),d&&(d.style.display=`none`),r&&(r.value=B.username),o&&(o.value=new Date().toISOString().split(`T`)[0]))}c&&c.addEventListener(`click`,()=>{let e=i.value.trim(),t=s.checked;if(!e){alert(`Please type your name in the Digital Signature field.`);return}if(!t){alert(`You must check the agreement box to sign the Code of Conduct.`);return}B.setSignedConduct(!0),w()}),l&&l.addEventListener(`click`,()=>{B.setSignedConduct(!1),i&&(i.value=``),s&&(s.checked=!1),w()}),C(),b(),S(),y(),w()}function E(){return`
    <div class="songbook-layout">
      
      <!-- Left sidebar list -->
      <div class="song-list-sidebar">
        <!-- Comedy Class Card -->
        <button class="song-sidebar-btn active" id="btn-show-comedy">
          <span class="song-sidebar-title">🎭 Campfire Comedy Class</span>
          <span class="song-sidebar-desc">How to write funny skits from scratch.</span>
        </button>

        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: hsl(var(--muted-foreground)); letter-spacing: 0.5px; margin: 10px 0 4px 6px;">
          Campfire Songbook
        </div>

        <!-- Injected dynamic songs list -->
        <div id="songs-list-mount" style="display: flex; flex-direction: column; gap: 8px;"></div>
      </div>

      <!-- Right detail view -->
      <div class="glass-panel" id="song-details-mount">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `}function D(){let e=document.getElementById(`songs-list-mount`),t=document.getElementById(`song-details-mount`),n=document.getElementById(`btn-show-comedy`);if(!e||!t)return;let r=null,i=null,a=0,o=[];function s(){e.innerHTML=c.map(e=>`
      <button class="song-sidebar-btn ${e.id===r?`active`:``}" data-song-id="${e.id}">
        <span class="song-sidebar-title">${e.title}</span>
        <span class="song-sidebar-desc">${e.description.substring(0,50)}...</span>
      </button>
    `).join(``),e.querySelectorAll(`.song-sidebar-btn`).forEach(t=>{t.addEventListener(`click`,()=>{f(),n.classList.remove(`active`),e.querySelectorAll(`.song-sidebar-btn`).forEach(e=>e.classList.remove(`active`)),t.classList.add(`active`),r=t.getAttribute(`data-song-id`);let i=c.find(e=>e.id===r);i&&u(i)})})}function l(){r=null,f(),n.classList.add(`active`),e.querySelectorAll(`.song-sidebar-btn`).forEach(e=>e.classList.remove(`active`)),t.innerHTML=`
      <div style="display: flex; flex-direction: column; gap: 20px; animation: tabFadeIn 0.3s ease;">
        <h2 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
          <span>🎭</span> Campfire Comedy Master Class
        </h2>
        <p style="font-size: 14.5px; color: hsl(var(--muted-foreground)); line-height: 1.5;">
          Don't fall back on the same old 50-year-old skits. You can write fresh, appropriate, and genuinely funny sketches yourself by using the following core improvisation guidelines.
        </p>

        <div class="comedy-matrix">
          <div class="glass-panel comedy-card">
            <span class="comedy-card-num">1</span>
            <h4>Find a Concept</h4>
            <p>Establish a winning core concept. Test it: if the basic premise doesn't get a "first laugh" from friends, it won't hold as a full skit.</p>
          </div>
          
          <div class="glass-panel comedy-card">
            <span class="comedy-card-num">2</span>
            <h4>Base Reality</h4>
            <p>Establish the "Who, What, Where" clearly up front. Ground the scene in normal context so the jokes have something solid to contrast against.</p>
          </div>

          <div class="glass-panel comedy-card">
            <span class="comedy-card-num">3</span>
            <h4>The "One" Unusual Thing</h4>
            <p>Introduce only ONE impossible element into the comedy world. Riff: "If this unusual thing is true, then what else is true?"</p>
          </div>

          <div class="glass-panel comedy-card">
            <span class="comedy-card-num">4</span>
            <h4>Character Archetypes</h4>
            <p>Keep characters two-dimensional representations of human flaws (e.g. Bumbling Authority, Trickster). Let their traits drive their dialogue naturally.</p>
          </div>

          <div class="glass-panel comedy-card">
            <span class="comedy-card-num">5</span>
            <h4>Escalate the Stakes</h4>
            <p>Skits must build momentum. Every joke beat should escalate the stakes, making the situation bigger, crazier, and more absurd.</p>
          </div>

          <div class="glass-panel comedy-card">
            <span class="comedy-card-num">6</span>
            <h4>Button Closer</h4>
            <p>End the skit with a "button" - a final, definitive punchline. This is the only place you can break internal logic for a final surprise.</p>
          </div>
        </div>
      </div>
    `}function u(e){o=e.actions||[],t.innerHTML=`
      <div class="lyrics-player-card" style="animation: tabFadeIn 0.3s ease;">
        <h2 style="color: hsl(var(--primary)); font-family: var(--font-heading); margin-bottom: 2px;">${e.title}</h2>
        <p style="font-size: 14px; color: hsl(var(--muted-foreground));">${e.description}</p>
        
        <!-- Rhythmic Metronome cue track -->
        <div class="metronome-cue-track">
          <div class="metronome-controls">
            <button class="metronome-play-btn" id="metronome-play-btn" aria-label="Play metronome">▶️</button>
            <span style="font-size: 13px; font-weight: 700;">Action Cue Trainer</span>
          </div>

          <!-- Metronome Blinking Dots -->
          <div class="metronome-dot-row">
            <div class="metronome-dot" id="dot-0"></div>
            <div class="metronome-dot" id="dot-1"></div>
            <div class="metronome-dot" id="dot-2"></div>
            <div class="metronome-dot" id="dot-3"></div>
          </div>

          <!-- scrolling prompts -->
          <span class="action-cue-text" id="action-prompt">Get Ready...</span>
        </div>

        <div class="lyrics-pre">
          ${e.lyrics}
        </div>
      </div>
    `;let n=document.getElementById(`metronome-play-btn`);n&&n.addEventListener(`click`,()=>{i?f():d()})}function d(){let e=document.getElementById(`metronome-play-btn`);e&&(e.textContent=`⏸️`),a=0;let t=[document.getElementById(`dot-0`),document.getElementById(`dot-1`),document.getElementById(`dot-2`),document.getElementById(`dot-3`)],n=document.getElementById(`action-prompt`);i=setInterval(()=>{let e=a%4;t.forEach((t,n)=>{t&&(n===e?t.classList.add(`active`):t.classList.remove(`active`))});let r=o.find(e=>e.beat===a);r&&n?(n.textContent=r.text,n.style.transform=`scale(1.1)`,setTimeout(()=>{n&&(n.style.transform=`none`)},200)):n&&a===0&&(n.textContent=`Sing! 🎵`),a++;let i=o.length>0?Math.max(...o.map(e=>e.beat))+4:16;a>i&&f()},500)}function f(){i&&=(clearInterval(i),null);let e=document.getElementById(`metronome-play-btn`);e&&(e.textContent=`▶️`),[document.getElementById(`dot-0`),document.getElementById(`dot-1`),document.getElementById(`dot-2`),document.getElementById(`dot-3`)].forEach(e=>{e&&e.classList.remove(`active`)});let t=document.getElementById(`action-prompt`);t&&(t.textContent=`Metronome Stopped`)}n.addEventListener(`click`,()=>{l()});let p=()=>{f(),window.removeEventListener(`before-view-change`,p)};window.addEventListener(`before-view-change`,p),s(),l()}function O(){return`
    <div class="quiz-container">
      <div class="glass-panel" id="quiz-mount">
        <!-- Renders dynamically -->
      </div>
    </div>
  `}function k(){let e=document.getElementById(`quiz-mount`);if(!e)return;let t=0,n=0,r=null,i=[];function a(){let i=l.length,a=l[t],s=t/i*100;e.innerHTML=`
      <div class="quiz-header">
        <span>Question ${t+1} of ${i}</span>
        <span>Score: ${n}/${i}</span>
      </div>
      
      <div class="quiz-progress-bar-bg" style="margin: 12px 0 24px 0;">
        <div class="quiz-progress-bar-fill" style="width: ${s}%;"></div>
      </div>

      <div class="quiz-question-box">
        <h3 class="quiz-question-text">${a.question}</h3>
        
        <div class="quiz-options-list">
          ${a.options.map((e,t)=>`
            <button class="quiz-option-btn" data-option-idx="${t}" aria-label="Option ${t+1}: ${e}">
              ${e}
            </button>
          `).join(``)}
        </div>

        <div id="quiz-feedback-mount" style="display: none;"></div>

        <div class="quiz-action-bar" style="display: none;" id="quiz-next-bar">
          <button class="quiz-next-btn" id="quiz-next-btn">
            ${t===i-1?`Finish Quiz`:`Next Question`}
          </button>
        </div>
      </div>
    `,e.querySelectorAll(`.quiz-option-btn`).forEach(e=>{e.addEventListener(`click`,()=>{r===null&&o(parseInt(e.getAttribute(`data-option-idx`)))})})}function o(a){r=a,i[t]=a;let o=l[t],c=a===o.answerIndex;c&&n++,e.querySelectorAll(`.quiz-option-btn`).forEach((e,t)=>{t===o.answerIndex?e.classList.add(`correct`):t===a&&e.classList.add(`incorrect`),e.disabled=!0});let u=document.getElementById(`quiz-feedback-mount`);u&&(u.style.display=`block`,u.innerHTML=`
        <div class="quiz-feedback-box">
          <span class="quiz-feedback-title ${c?`correct`:`incorrect`}">
            ${c?`✨ Correct!`:`❌ Incorrect`}
          </span>
          <p style="font-weight: 500; font-size: 13.5px; line-height: 1.4; margin-top: 4px;">${o.explanation}</p>
        </div>
      `);let d=document.getElementById(`quiz-next-bar`);if(d){d.style.display=`flex`;let e=document.getElementById(`quiz-next-btn`);e&&e.addEventListener(`click`,s)}}function s(){r=null,t++,t<l.length?a():c()}function c(){let o=l.length,s=Math.round(n/o*100),c=s>=80;c&&(B.completedTasks.includes(`checklist-5`)||B.toggleTask(`checklist-5`),u());let d=l.filter((e,t)=>i[t]!==e.answerIndex),f=``;f=d.length>0?`
        <div class="quiz-review-board" style="margin-top: 24px; text-align: left; width: 100%; display: flex; flex-direction: column; gap: 16px;">
          <h3 style="font-size: 18px; font-weight: 700; color: hsl(var(--danger)); border-bottom: 2px solid hsl(var(--border)); padding-bottom: 8px; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
            <span>📚</span> Study Review Board (${d.length} Incorrect Answers)
          </h3>
          <p style="font-size: 13.5px; color: hsl(var(--muted-foreground)); line-height: 1.5; margin-bottom: 8px;">
            Review the correct answers and explanations below to consolidate your camp safety knowledge:
          </p>
          <div style="display: flex; flex-direction: column; gap: 14px; width: 100%;">
            ${d.map(e=>{let t=i[e.id-1],n=t===void 0?`No Answer`:e.options[t],r=e.options[e.answerIndex];return`
                <div class="glass-panel" style="padding: 16px; border-left: 4px solid hsl(var(--danger)); display: flex; flex-direction: column; gap: 8px; background: hsl(var(--card));">
                  <h4 style="font-weight: 700; font-size: 14px; line-height: 1.4;">Q${e.id}: ${e.question}</h4>
                  <div style="font-size: 13px;">
                    <span style="color: hsl(var(--danger)); font-weight: bold;">❌ Your Answer:</span> ${n}
                  </div>
                  <div style="font-size: 13px;">
                    <span style="color: hsl(var(--success)); font-weight: bold;">✅ Correct Answer:</span> ${r}
                  </div>
                  <div style="font-size: 12.5px; font-style: italic; color: hsl(var(--muted-foreground)); margin-top: 6px; line-height: 1.4; padding: 10px; background: hsl(var(--secondary) / 0.4); border-radius: var(--radius-sm);">
                    ℹ️ <strong>Handbook Explanation:</strong> ${e.explanation}
                  </div>
                </div>
              `}).join(``)}
          </div>
        </div>
      `:`
        <div class="glass-panel" style="margin-top: 24px; text-align: center; color: hsl(var(--success)); font-weight: 700; padding: 20px; background: hsl(var(--success-light) / 0.1); border: 1px dashed hsl(var(--success) / 0.3);">
          ✨ Perfect score! You answered every question correctly on the first attempt!
        </div>
      `,e.innerHTML=`
      <div class="quiz-complete-card" style="display: flex; flex-direction: column; align-items: center; width: 100%; text-align: center;">
        <div class="quiz-badge-graphic" style="margin-bottom: 16px;">
          ${c?`🏆`:`📚`}
        </div>
        
        <h2 class="quiz-complete-title" style="font-size: 24px; font-weight: 800; font-family: var(--font-heading); margin-bottom: 4px;">
          ${c?`Congratulations!`:`Review & Retry`}
        </h2>
        
        <div style="font-size: 16px; font-weight: 700; color: hsl(var(--primary)); margin-bottom: 12px;">
          You scored ${n} out of ${o} (${s}%)
        </div>

        <p class="quiz-complete-desc" style="max-width: 550px; font-size: 14.5px; color: hsl(var(--muted-foreground)); line-height: 1.5; margin-bottom: 20px;">
          ${c?`Excellent job, ${B.username}! You have proven a strong command of Camp Lawton safety rules, emergency alarm protocols, hydration, and mandatory Arizona state reporting laws. You are officially certified for summer staff!`:`You need at least 80% (8 out of 10 correct) to earn your Camp Lawton certification badge. Review the safety guides, schedule details, and the study review board below, then try again!`}
        </p>

        <div style="display: flex; gap: 14px; margin-bottom: 24px;">
          <button class="quiz-restart-btn" id="quiz-restart-btn" style="padding: 10px 20px; border-radius: var(--radius-sm); font-weight: 700; cursor: pointer;">Try Quiz Again</button>
          ${c?`<button class="welcome-banner-btn" id="quiz-dashboard-btn" style="padding: 10px 20px;">Back to Dashboard</button>`:``}
        </div>

        <!-- Inject detailed review board -->
        ${f}
      </div>
    `,document.getElementById(`quiz-restart-btn`).addEventListener(`click`,()=>{t=0,n=0,r=null,i=[],a()}),c&&document.getElementById(`quiz-dashboard-btn`).addEventListener(`click`,()=>{Q(`dashboard`)})}function u(){let e=4*1e3,t=Date.now()+e,n={startVelocity:30,spread:360,ticks:60,zIndex:1e4};function r(e,t){return Math.random()*(t-e)+e}let i=setInterval(function(){let a=t-Date.now();if(a<=0)return clearInterval(i);let o=a/e*50;g({...n,particleCount:o,origin:{x:r(.1,.3),y:Math.random()-.2}}),g({...n,particleCount:o,origin:{x:r(.7,.9),y:Math.random()-.2}})},250)}a()}function A(){return`
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
  `}function j(){let e=document.getElementById(`training-tab-scouting`),t=document.getElementById(`training-tab-culture`),n=document.getElementById(`training-tab-service`),r=document.getElementById(`training-tab-program`),i=document.getElementById(`training-panel-mount`);if(!i)return;function a(){i.querySelectorAll(`.flip-card`).forEach(e=>{e.addEventListener(`click`,()=>{e.classList.toggle(`flipped`)})})}function o(){e.classList.add(`active`),t.classList.remove(`active`),n.classList.remove(`active`),r.classList.remove(`active`),i.innerHTML=`
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
    `,a()}function s(){e.classList.remove(`active`),t.classList.remove(`active`),n.classList.add(`active`),r.classList.remove(`active`),i.innerHTML=`
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
    `,a()}function c(){e.classList.remove(`active`),t.classList.add(`active`),n.classList.remove(`active`),r.classList.remove(`active`);let a=u.rules?u.rules.map((e,t)=>`
      <div style="background: hsl(var(--card)); border: 1px solid hsl(var(--border)); padding: 14px; border-radius: var(--radius-sm); border-left: 4px solid hsl(var(--danger));">
        <h4 style="font-weight: 700; margin-bottom: 6px;">${e.title}</h4>
        <p style="font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.4;">${e.content}</p>
      </div>
    `).join(``):``,o=u.stressManagement.map((e,t)=>`
      <div style="background: hsl(var(--card)); border: 1px solid hsl(var(--border)); padding: 14px; border-radius: var(--radius-sm); border-left: 4px solid hsl(var(--accent));">
        <h4 style="font-weight: 700; margin-bottom: 6px;">${e.step}</h4>
        <p style="font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.4;">${e.description}</p>
      </div>
    `).join(``),s=u.glossary.map((e,t)=>`
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid hsl(var(--border)); font-weight: 600;">${e.term}</td>
        <td style="padding: 10px; border-bottom: 1px solid hsl(var(--border)); color: hsl(var(--muted-foreground)); font-size: 14px;">${e.def}</td>
      </tr>
    `).join(``);i.innerHTML=`
      <div class="schedule-content-panel" style="animation: tabFadeIn 0.3s ease both;">
        
        <!-- Mission & Vision -->
        <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px; background: linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--accent) / 0.1));">
          <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
            <span>🚀</span> Mission & Vision
          </h3>
          <p style="font-size: 15px; font-weight: 500; font-style: italic; line-height: 1.5; text-align: center;">
            "${u.mission.statement}"
          </p>
        </div>

        <!-- Rules -->
        <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px;">
          <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
            <span>⚠️</span> Camp Rules
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 16px;">
            ${a}
          </div>
        </div>

        <!-- Stress Management -->
        <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px;">
          <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
            <span>💆</span> Stress Management (Mental Stability)
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 16px;">
            ${o}
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
                ${s}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `}function l(){e.classList.remove(`active`),t.classList.remove(`active`),n.classList.remove(`active`),r.classList.add(`active`),i.innerHTML=`
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
    `}e.addEventListener(`click`,o),t.addEventListener(`click`,c),n.addEventListener(`click`,s),r.addEventListener(`click`,l),o()}var M=0,N=JSON.parse(localStorage.getItem(`camp_lawton_app_draft`))||{};function P(e){e.innerHTML=`
    <div style="max-width: 800px; margin: 0 auto; padding-bottom: 60px;">
      
      <!-- Progress Bar -->
      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 30px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h2 style="color: hsl(var(--primary)); font-family: var(--font-heading); font-size: 24px;">Staff Application</h2>
          <span style="font-size: 14px; color: hsl(var(--muted-foreground)); font-weight: 500;">Step ${M+1} of 5</span>
        </div>
        <div style="height: 8px; background: hsl(var(--border)); border-radius: 4px; overflow: hidden; position: relative;">
          <div style="position: absolute; top: 0; left: 0; height: 100%; width: ${M/4*100}%; background: hsl(var(--primary)); transition: width 0.4s ease; border-radius: 4px;"></div>
        </div>
      </div>

      <!-- Form Container -->
      <div class="glass-panel" style="animation: tabFadeIn 0.4s ease;">
        <form id="application-form" style="display: flex; flex-direction: column; gap: 24px;">
          <div id="step-content"></div>
          
          <div style="display: flex; justify-content: space-between; margin-top: 20px; border-top: 1px solid hsl(var(--border)); padding-top: 20px;">
            <button type="button" id="app-prev-btn" class="welcome-banner-btn" style="background: hsl(var(--secondary)); color: hsl(var(--foreground)); ${M===0?`visibility: hidden;`:``}">Back</button>
            <button type="button" id="app-next-btn" class="welcome-banner-btn">${M===4?`Sign & Submit`:`Next Section`}</button>
          </div>
        </form>
      </div>
    </div>
  `,F(document.getElementById(`step-content`)),I()}function F(e){let t=``;switch(M){case 0:t=`
        <h3 style="color: hsl(var(--foreground)); margin-bottom: 16px;">Section I: Demographics & Legal Eligibility</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          ${R(`First Name`,`firstName`)}
          ${R(`Last Name`,`lastName`)}
          ${R(`Preferred Name / Nickname`,`nickname`)}
          ${R(`Phone Number`,`phone`,`tel`)}
        </div>
        ${R(`Email Address`,`email`,`email`)}
        ${R(`Primary Address`,`address`)}
        
        <h4 style="margin-top: 16px; color: hsl(var(--primary));">Age Eligibility (as of June 1, 2026)</h4>
        <select id="ageEligibility" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: hsl(var(--foreground)); width: 100%;">
          <option value="">Select Age Group...</option>
          <option value="14" ${N.ageEligibility===`14`?`selected`:``}>14-15 years old (CIT Minimum)</option>
          <option value="16" ${N.ageEligibility===`16`?`selected`:``}>16-17 years old (Junior Staff)</option>
          <option value="18" ${N.ageEligibility===`18`?`selected`:``}>18-20 years old (Adult Status)</option>
          <option value="21" ${N.ageEligibility===`21`?`selected`:``}>21+ years old (Camp Management)</option>
        </select>

        ${z(`workAuth`,`I am legally authorized to work in the United States (Proof required upon hire).`)}
        ${z(`scoutReg`,`I am currently registered with Scouting America OR agree to register if hired.`)}
      `;break;case 1:t=`
        <h3 style="color: hsl(var(--foreground)); margin-bottom: 16px;">Section II: Position Preferences</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          ${R(`Available Start Date`,`startDate`,`date`)}
          ${R(`Available End Date`,`endDate`,`date`)}
        </div>
        
        <h4 style="margin-top: 16px; color: hsl(var(--primary));">Top Position Preferences</h4>
        ${R(`1st Choice`,`pref1`)}
        ${R(`2nd Choice`,`pref2`)}
        ${R(`3rd Choice`,`pref3`)}

        <h4 style="margin-top: 16px; color: hsl(var(--primary));">Uniform Sizing</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <select id="shirtSize" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: hsl(var(--foreground));">
            <option value="">T-Shirt Size...</option>
            ${[`S`,`M`,`L`,`XL`,`2XL`,`3XL`].map(e=>`<option value="${e}" ${N.shirtSize===e?`selected`:``}>${e}</option>`).join(``)}
          </select>
          <select id="jacketSize" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: hsl(var(--foreground));">
            <option value="">Jacket Size...</option>
            ${[`S`,`M`,`L`,`XL`,`2XL`,`3XL`].map(e=>`<option value="${e}" ${N.jacketSize===e?`selected`:``}>${e}</option>`).join(``)}
          </select>
        </div>
      `;break;case 2:t=`
        <h3 style="color: hsl(var(--foreground)); margin-bottom: 16px;">Section III: Experience & References</h3>
        ${R(`Current Scouting Rank (if any)`,`scoutRank`)}
        ${z(`oaMember`,`I am an Order of the Arrow Member`)}
        
        <h4 style="margin-top: 16px; color: hsl(var(--primary));">Previous Employment / Camp Staff</h4>
        ${R(`Most Recent Employer / Camp`,`employer`)}
        ${R(`Primary Duties / Role`,`duties`)}
        
        <h4 style="margin-top: 16px; color: hsl(var(--primary));">Professional References (Need 3)</h4>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${R(`Reference 1 (Name, Relation, Contact)`,`ref1`)}
          ${R(`Reference 2 (Name, Relation, Contact)`,`ref2`)}
          ${R(`Reference 3 (Name, Relation, Contact)`,`ref3`)}
        </div>
      `;break;case 3:t=`
        <h3 style="color: hsl(var(--foreground)); margin-bottom: 16px;">Section IV: Essential Functions</h3>
        <p style="font-size: 14px; color: hsl(var(--muted-foreground)); margin-bottom: 16px;">
          Camp Lawton is located at 8,000 feet elevation. By checking these boxes, you acknowledge the essential functions of the role.
        </p>
        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${z(`ackAltitude`,`<strong>High-Altitude & Terrain:</strong> I understand this requires physical exertion and navigating rugged terrain.`)}
          ${z(`ackWildlife`,`<strong>Wildlife & Smellables:</strong> I agree to strictly adhere to the camp wildlife protocols.`)}
          ${z(`ackSanitation`,`<strong>Water & Sanitation:</strong> I acknowledge water scarcity, shower limits, and that duties include cleaning latrines.`)}
          ${z(`ackMedical`,`<strong>Medical Clearances:</strong> I must provide a current BSA Annual Health Record (Parts A, B, and C) upon hire.`)}
        </div>
        <h4 style="margin-top: 16px; color: hsl(var(--primary));">Current Certifications</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          ${z(`certCPR`,`CPR / AED`)}
          ${z(`certWFA`,`Wilderness First Aid`)}
        </div>
      `;break;case 4:t=`
        <h3 style="color: hsl(var(--foreground)); margin-bottom: 16px;">Section V: Agreements & Signature</h3>
        <div style="background: hsl(var(--secondary)); padding: 16px; border-radius: var(--radius-sm); margin-bottom: 16px; font-size: 13.5px; display: flex; flex-direction: column; gap: 10px;">
          <p><strong>BSA Code of Conduct:</strong> I agree to conduct myself in accordance with the Scout Oath and Scout Law.</p>
          <p><strong>Substance Abuse:</strong> Zero-tolerance policy regarding alcohol, illegal drugs, and unauthorized meds.</p>
          <p><strong>At-Will Employment:</strong> Employment may be terminated at any time with or without cause.</p>
        </div>
        ${z(`ackAgreements`,`I agree to the above terms and certify all provided info is accurate.`)}
        
        <div style="margin-top: 20px;">
          ${R(`Digital Signature (Type Full Legal Name)`,`signature`)}
          ${R(`Date`,`sigDate`,`date`)}
        </div>
      `;break}e.innerHTML=t,e.querySelectorAll(`input, select`).forEach(e=>{e.type===`checkbox`?e.checked=N[e.id]||!1:e.value=N[e.id]||``})}function I(){let e=document.getElementById(`application-form`),t=document.getElementById(`app-prev-btn`),n=document.getElementById(`app-next-btn`);e.addEventListener(`input`,()=>{e.querySelectorAll(`input, select`).forEach(e=>{e.type===`checkbox`?N[e.id]=e.checked:N[e.id]=e.value}),localStorage.setItem(`camp_lawton_app_draft`,JSON.stringify(N))}),t.addEventListener(`click`,()=>{M>0&&(M--,P(document.getElementById(`view-mount-point`)))}),n.addEventListener(`click`,()=>{M<4?(M++,P(document.getElementById(`view-mount-point`))):L()})}function L(){if(!N.signature||!N.ackAgreements){alert(`Please provide a digital signature and check the agreement box before submitting.`);return}localStorage.removeItem(`camp_lawton_app_draft`),N={},M=0;let e=document.getElementById(`view-mount-point`);e.innerHTML=`
    <div class="glass-panel" style="max-width: 600px; margin: 40px auto; text-align: center; animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
      <div style="font-size: 64px; margin-bottom: 20px;">🎉</div>
      <h2 style="color: hsl(var(--primary)); font-family: var(--font-heading); margin-bottom: 12px; font-size: 28px;">Application Submitted!</h2>
      <p style="color: hsl(var(--muted-foreground)); line-height: 1.6; margin-bottom: 24px;">
        Thank you for applying to Camp Lawton! Your application for the 2026 season has been received. Our leadership team will review your details and contact you shortly.
      </p>
      <button class="welcome-banner-btn" onclick="document.getElementById('nav-btn-dashboard').click()">Return to Dashboard</button>
    </div>
  `}function R(e,t,n=`text`){return`
    <div style="display: flex; flex-direction: column; gap: 6px;">
      <label for="${t}" style="font-size: 14px; font-weight: 500;">${e}</label>
      <input type="${n}" id="${t}" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: hsl(var(--foreground)); width: 100%;" />
    </div>
  `}function z(e,t){return`
    <label style="display: flex; gap: 10px; align-items: flex-start; cursor: pointer; font-size: 14.5px;">
      <input type="checkbox" id="${e}" style="margin-top: 4px; accent-color: hsl(var(--primary)); width: 16px; height: 16px;" />
      <span style="color: hsl(var(--foreground)); line-height: 1.4;">${t}</span>
    </label>
  `}var B={username:localStorage.getItem(`lawton_username`)||`Alex`,completedTasks:JSON.parse(localStorage.getItem(`lawton_tasks`))||[],wamCount:parseInt(localStorage.getItem(`lawton_wam_count`)||`0`),signedConduct:localStorage.getItem(`lawton_signed_conduct`)===`true`,activeView:`dashboard`,setUsername(e){this.username=e,localStorage.setItem(`lawton_username`,e),Z()},toggleTask(e){let t=this.completedTasks.indexOf(e);t>-1?this.completedTasks.splice(t,1):this.completedTasks.push(e),localStorage.setItem(`lawton_tasks`,JSON.stringify(this.completedTasks)),window.dispatchEvent(new CustomEvent(`state-tasks-updated`))},incrementWam(){this.wamCount++,localStorage.setItem(`lawton_wam_count`,this.wamCount.toString()),window.dispatchEvent(new CustomEvent(`state-wam-updated`))},setSignedConduct(e){this.signedConduct=e,localStorage.setItem(`lawton_signed_conduct`,e?`true`:`false`),window.dispatchEvent(new CustomEvent(`state-conduct-updated`));let t=`checklist-4`,n=this.completedTasks.includes(t);(e&&!n||!e&&n)&&this.toggleTask(t)}},V={dashboard:{title:`Dashboard`,subtitle:`Welcome to the Camp Lawton digital staff portal.`,render:t,init:n},training:{title:`Training & Culture`,subtitle:`Camp Lawton pillars, scouting methods, Disney standards, and program controls.`,render:A,init:j},schedule:{title:`Camp Schedule`,subtitle:`Sunday check-in protocols and daily life schedule.`,render:p,init:m},officemap:{title:`Camp Map & EAP`,subtitle:`Interactive map and emergency evacuation drill simulator.`,render:v,init:y},safetyguides:{title:`Policies & Procedures`,subtitle:`Emergency flowcharts, radio simulator, and legal guidelines.`,render:S,init:C},packing:{title:`Onboarding`,subtitle:`Paperwork checklist, gear lists, and Code of Conduct signer.`,render:w,init:T},songs:{title:`Songbook & Comedy Class`,subtitle:`Rousing logs songs, action cued lyrics, and comedy writing guides.`,render:E,init:D},quiz:{title:`Staff Handbook Quiz`,subtitle:`Complete the training review to get Camp Lawton certified.`,render:O,init:k},application:{title:`Staff Application 2026`,subtitle:`Apply to join the Catalina Council at Camp Lawton.`,render:P,init:()=>{}}},H=document.getElementById(`view-title`),U=document.getElementById(`view-subtitle`),W=document.getElementById(`view-mount-point`),G=document.querySelectorAll(`.nav-item`),K=document.getElementById(`theme-toggle`),q=document.getElementById(`user-avatar`),ee=document.getElementById(`user-name-display`),te=document.getElementById(`user-badge`),J=document.getElementById(`profile-dialog`),ne=document.getElementById(`profile-dialog-close`),Y=document.getElementById(`profile-name-input`),re=document.getElementById(`profile-save-btn`),X=document.getElementById(`app-dialog`),ie=document.getElementById(`dialog-close`);function ae(){let e=localStorage.getItem(`lawton_theme`)||(window.matchMedia(`(prefers-color-scheme: dark)`).matches?`dark`:`light`);document.documentElement.setAttribute(`data-theme`,e)}function oe(){let e=document.documentElement.getAttribute(`data-theme`)===`dark`?`light`:`dark`;document.documentElement.setAttribute(`data-theme`,e),localStorage.setItem(`lawton_theme`,e)}function Z(){ee.textContent=B.username,q.textContent=B.username?B.username.charAt(0).toUpperCase():`?`;let e=V[B.activeView];e&&e.init&&e.init()}function se(){X&&X.close()}function Q(e){let t=V[e];if(!t)return;B.activeView=e,G.forEach(t=>{t.getAttribute(`data-view`)===e?t.classList.add(`active`):t.classList.remove(`active`)});let n=()=>{window.dispatchEvent(new CustomEvent(`before-view-change`)),H.textContent=t.title,U.textContent=t.subtitle,W.innerHTML=t.render(),t.init&&t.init()};document.startViewTransition?document.startViewTransition(n).finished.finally(()=>{H.focus()}):(n(),H.focus())}function $(e){e&&(`closedBy`in HTMLDialogElement.prototype||e.addEventListener(`click`,t=>{if(t.target!==e)return;let n=e.getBoundingClientRect();n.top<=t.clientY&&t.clientY<=n.top+n.height&&n.left<=t.clientX&&t.clientX<=n.left+n.width||e.close()}))}document.addEventListener(`DOMContentLoaded`,()=>{ae(),Z(),Q(`dashboard`),G.forEach(e=>{e.addEventListener(`click`,()=>{Q(e.getAttribute(`data-view`))})}),K.addEventListener(`click`,oe),te.addEventListener(`click`,()=>{J&&Y&&(Y.value=B.username,J.showModal())}),ne.addEventListener(`click`,()=>J.close()),ie.addEventListener(`click`,se),re.addEventListener(`click`,()=>{let e=Y.value.trim();e&&B.setUsername(e),J.close()}),$(X),$(J)});