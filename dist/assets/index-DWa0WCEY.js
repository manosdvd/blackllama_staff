var e=Object.defineProperty,t=(t,n)=>{let r={};for(var i in t)e(r,i,{get:t[i],enumerable:!0});return n||e(r,Symbol.toStringTag,{value:`Module`}),r};(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var n=[{id:`pack-cloth-1`,name:`Field Uniform Shirt (Class A) - 2+ recommended`,category:`Clothing`,status:`necessary`},{id:`pack-cloth-2`,name:`Activity Uniform - Staff Shirts (Class B)`,category:`Clothing`,status:`necessary`},{id:`pack-cloth-3`,name:`Scout Pants / Shorts`,category:`Clothing`,status:`necessary`},{id:`pack-cloth-4`,name:`Scout Belt (scout-approved buckle)`,category:`Clothing`,status:`necessary`},{id:`pack-cloth-5`,name:`Off-Duty Clothes ("Civvies")`,category:`Clothing`,status:`necessary`},{id:`pack-cloth-6`,name:`Jacket, fleece, or heavy sweater`,category:`Clothing`,status:`necessary`},{id:`pack-cloth-7`,name:`Closed-toed shoes / hiking boots`,category:`Clothing`,status:`necessary`},{id:`pack-cloth-8`,name:`Shower shoes (flip-flops/crocs)`,category:`Clothing`,status:`necessary`},{id:`pack-cloth-9`,name:`Underwear, socks, and pajamas`,category:`Clothing`,status:`necessary`},{id:`pack-cloth-10`,name:`Hat (brimmed for sun protection)`,category:`Clothing`,status:`necessary`},{id:`pack-gear-1`,name:`Completed Medical Form (Parts A, B, C)`,category:`Gear`,status:`necessary`},{id:`pack-gear-2`,name:`Sleeping bag or bedding & pillow`,category:`Gear`,status:`necessary`},{id:`pack-gear-3`,name:`Lockable trunk or heavy duffel bag`,category:`Gear`,status:`necessary`},{id:`pack-gear-4`,name:`Canteen or large water bottle (uniform part)`,category:`Gear`,status:`necessary`},{id:`pack-gear-5`,name:`Flashlight & extra batteries`,category:`Gear`,status:`necessary`},{id:`pack-gear-6`,name:`Towels & washcloths`,category:`Gear`,status:`necessary`},{id:`pack-gear-7`,name:`Personal hygiene (lightly-scented soap, brush, etc.)`,category:`Gear`,status:`necessary`},{id:`pack-gear-8`,name:`Laundry bag & sunscreen`,category:`Gear`,status:`necessary`},{id:`pack-gear-9`,name:`Pocket knife (if Tot'n Chip card held)`,category:`Gear`,status:`necessary`},{id:`pack-gear-10`,name:`Tot'n Chip & Firem'n Chit cards`,category:`Gear`,status:`necessary`},{id:`pack-opt-1`,name:`Scouts BSA Handbook`,category:`Optional`,status:`optional`},{id:`pack-opt-2`,name:`Camera (dedicated device preferred)`,category:`Optional`,status:`optional`},{id:`pack-opt-3`,name:`Compass & sewing kit`,category:`Optional`,status:`optional`},{id:`pack-opt-4`,name:`Hangers & light twine/rope`,category:`Optional`,status:`optional`},{id:`pack-opt-5`,name:`Musical Instruments & reading books`,category:`Optional`,status:`optional`},{id:`pack-priv-1`,name:`Smartphone (use in cabin only)`,category:`Privileged`,status:`privileged`},{id:`pack-priv-2`,name:`Portable gaming console (Switch, etc.)`,category:`Privileged`,status:`privileged`},{id:`pack-priv-3`,name:`Headphones / Bluetooth speaker (for cabin)`,category:`Privileged`,status:`privileged`},{id:`pack-priv-4`,name:`Laptop screen (cabin use only)`,category:`Privileged`,status:`privileged`},{id:`pack-proh-1`,name:`Sheath knives or novelty knives`,category:`Prohibited`,status:`prohibited`},{id:`pack-proh-2`,name:`Personal firearms, ammo, or Air Soft toys`,category:`Prohibited`,status:`prohibited`},{id:`pack-proh-3`,name:`Fireworks or personal firestarters`,category:`Prohibited`,status:`prohibited`},{id:`pack-proh-4`,name:`Full-size TVs or desktop rigs`,category:`Prohibited`,status:`prohibited`},{id:`pack-proh-5`,name:`Open-toed sandals/shoes outside cabin`,category:`Prohibited`,status:`prohibited`},{id:`pack-proh-6`,name:`Personal food and snacks (attracts bears)`,category:`Prohibited`,status:`prohibited`},{id:`pack-proh-7`,name:`Pets, adult posters, or alcohol/drugs/marijuana`,category:`Prohibited`,status:`prohibited`}],r=[{id:`step1`,title:`12:00 PM: Report & Sign In`,description:`Arrive at the Camp Office, sign in, and get your cabin assignment.`},{id:`step2`,title:`1:00 PM: Staff Meeting`,description:`Report to flags in Class A uniform for the first weekly staff brief.`},{id:`step3`,title:`2:00 PM: Camper Check-in`,description:`Scouts arrive. Assist with parking, back vehicles into spots facing out for EAP evacuations.`},{id:`step4`,title:`Medical Screening`,description:`Medic reviews health forms and checks in troop medications.`},{id:`step5`,title:`Campsite Tour`,description:`As a Troop Friend, guide your assigned unit on a tour of flags, Dining Hall, and program areas.`},{id:`step6`,title:`Setup & Flag Assembly`,description:`Troops unpack, report to the parade grounds for flags, and head to dinner.`}],i=[{time:`6:00 AM`,activity:`Eagle Trail Hike`,uniform:`Class B / Optional`,notes:`Inspirational hike up Eagle Hill with your buddy or friend troop.`},{time:`7:45 AM`,activity:`Morning Flags Assembly`,uniform:`Class A (Field)`,notes:`Be lined up early. Short flag ceremony and daily announcements.`},{time:`8:00 AM`,activity:`Breakfast on the Logs`,uniform:`Class A / Class B`,notes:`Lead songs on the logs, sit with campers, socialise, and perform assigned KP duties.`},{time:`9:00 AM - 11:50 AM`,activity:`Morning Program Session`,uniform:`Class B (Activity)`,notes:`Teach merit badge classes in your area. Be ready to start exactly at 9:00 AM.`},{time:`12:00 PM`,activity:`Lunch & Dining KP`,uniform:`Class B (Activity)`,notes:`Eat with scouts, complete kitchen steward cleanups if on duty roster.`},{time:`1:00 PM - 2:00 PM`,activity:`Daily Siesta (Nap Time)`,uniform:`Any / Cabin Area`,notes:`Crucial rest hour in cabins to decompress. No loud music or off-hill activities.`},{time:`2:00 PM - 5:00 PM`,activity:`Afternoon Program Session`,uniform:`Class B (Activity)`,notes:`Merit badges, open range shoots, climbing wall routes, and specialized area work.`},{time:`5:45 PM`,activity:`Evening Flags Assembly`,uniform:`Class A (Field)`,notes:`Full Field uniform. Lowering the colors before heading into dinner.`},{time:`6:00 PM`,activity:`Dinner & Social`,uniform:`Class A (Field)`,notes:`Dining Hall seating. Talk with leaders and scouts to build relationships.`},{time:`7:00 PM - 9:00 PM`,activity:`Evening Programs & Meetings`,uniform:`Class B / Class A`,notes:`Staff meetings, campfires, Scout Own chapels, or commissioner socials.`},{time:`10:00 PM`,activity:`Lights Out / Quiet Hours`,uniform:`Sleepwear`,notes:`All staff in quarters. Restore energy for the next high-stimulus day.`}],a=[{id:`song-funky`,title:`Ain't That Funky Now`,description:`An easy rhythm rap to get kids singing. Excellent for warming up a crowd on the Logs or at campfires.`,actions:[{beat:1,text:`Thigh-Clap Rhythm starts`},{beat:5,text:`Hump-ty-dump`},{beat:9,text:`Hump-hump-ty-dump-ty-dumpty`},{beat:13,text:`Jack and Jill went up the hill`},{beat:18,text:`To fetch a pail of water`},{beat:22,text:`Jack fell down and broke his crown`},{beat:26,text:`And Jill said... UH! (Clap!)`},{beat:29,text:`Ain't That Funky Now!!!`}],lyrics:`(Start thigh-clap tempo)

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

[Chorus]`}],o=[{id:1,question:`Under Arizona State Law (ARS 13-3620), what is your legal duty regarding suspected child abuse or neglect?`,options:[`Ignore it unless you see it happen multiple times`,`Report it directly to the Camp Director, who will handle it internally`,`You are a mandated reporter and must report immediately to the Arizona DCS Hotline (1-888-SOS-CHILD)`,`Discuss it with the scoutmaster of the youth's troop first`],answerIndex:2,explanation:`As a camp staff member in Arizona, you are a legally mandated reporter. You must report any good-faith suspicion of abuse directly to the Department of Child Safety (1-888-SOS-CHILD or 911 in an emergency). This duty cannot be delegated.`},{id:2,question:`According to the Lightning Safety 30/30 rule, what triggers immediate suspension of outdoor activities, and where should shelter be taken?`,options:[`Heavy rain; take shelter under canvas dining flys or large trees`,`Thunder within 30 seconds of a lightning flash; seek shelter in the Dining Hall`,`Visible lightning over the ridge; stay in open golf carts`,`Wind gusts of 15 mph; shelter in individual tents`],answerIndex:1,explanation:`The 30/30 rule states that if thunder is heard within 30 seconds of a flash, lightning is within 6 miles. You must suspend activities immediately. Tents and open pavilions offer zero protection. In Camp Lawton, the primary lightning shelter is the Dining Hall.`},{id:3,question:`What do the radio alert terms "Code Blue" and "Code Brown" stand for respectively?`,options:[`Code Blue = Medical check-in; Code Brown = Kitchen food delivery`,`Code Blue = Lost Camper / Missing Person; Code Brown = Bear Sighting`,`Code Blue = Severe Weather; Code Brown = Evacuation Drill`,`Code Blue = Visitor Arrival; Code Brown = Maintenance Hazard`],answerIndex:1,explanation:`Under Camp Lawton emergency protocols, "Code Blue" represents a Missing Person / Lost Camper report (which halts all other activity until resolved), and "Code Brown" signals a Bear Sighting to alert the Ranger and Camp Director.`},{id:4,question:`What is a "WAM" (Water Appreciation Moment) and what is expected of you when you hear it?`,options:[`A meeting with the Camp Director; report to the office`,`A campsite inspection; clean your cabin immediately`,`A hydration alert; everyone within earshot must immediately take a drink of water`,`A flag raising ceremony; wear your Class A uniform`],answerIndex:2,explanation:`Dehydration is a critical hazard at 8,000 ft in the Arizona mountains. "WAM" stands for Water Appreciation Moment. When someone shouts "WAM!", everyone nearby is required to drink water immediately.`},{id:5,question:`What are the minimum age requirements for Camp Director/Program Director and Area Directors under NCAP guidelines?`,options:[`Camp/Program Director: 18; Area Director: 16`,`Camp/Program Director: 21; Area Director: 18`,`Camp/Program Director: 25; Area Director: 21`,`Camp/Program Director: 18; Area Director: 18`],answerIndex:1,explanation:`To comply with the National Camp Accreditation Program (NCAP), the Camp Director, Program Director, Climbing Director, and Range activities Director must be at least 21 years old. Area Directors must be at least 18 years old.`},{id:6,question:`Under youth labor guidelines, what are the restrictions on Counselors-in-Training (CIT) aged 14 and 15?`,options:[`Can work up to 12 hours, from 6 AM to 10 PM, and teach classes alone`,`Can only work up to 8 hours/day, between 7 AM and 9 PM, and must never be left to teach a merit badge alone`,`Are restricted to kitchen cleanup duties and cannot leave the main lodge area`,`Have no limits on hours but cannot wear staff uniforms`],answerIndex:1,explanation:`CITs are in a training program. Labor laws limit 14 and 15-year-olds to a maximum of 8 hours of work per day between 7 AM and 9 PM. They are not cleanup servants, but nor should they ever be left to teach a merit badge alone.`},{id:7,question:`What must you do the moment you hear the camp-wide emergency alarm (the Dining Hall bell ringing continuously)?`,options:[`Run to your cabin and pack your bags for evacuation`,`Go to the Camp Office to ask what the emergency is`,`Secure immediate hazards in your program area (e.g. put out fires) and immediately escort all scouts to the Parade Grounds for a headcount`,`Wait for a radio announcement before taking any action`],answerIndex:2,explanation:`A continuous ringing of the Dining Hall bell signals an immediate emergency or drill. You must drop what you are doing, quickly secure any immediate hazards (like fires or dangerous tools), and immediately escort all scouts with you to the Parade Grounds. Do not let scouts return to campsites.`},{id:8,question:`Which of the following represents correct, FCC-compliant radio protocol at Camp Lawton?`,options:[`Press the button, call "Hey Dave, it's Mike, can you come over to Scoutcraft?"`,`Wait for a clear channel, press the button, wait 1 second, call "[YOU] to [AREA]" (e.g., "Scoutcraft to HQ"), and avoid real names`,`Use real names and personal details to ensure accuracy in communications`,`Keep the radio button held down during conversations to keep the channel open`],answerIndex:1,explanation:`Official camp radios are subject to FCC regulations. Correct protocol is: press button, wait a second, call "[YOU] to [AREA]" (e.g., "Scoutcraft to HQ"). The response should be "[YOUR AREA], go ahead." Do not use real names; use program areas or code names.`},{id:9,question:`Under the camp's "Smellables" policy to prevent bear encounters, what must be done with scented toiletries (deodorant, soap, snacks)?`,options:[`They must be kept in youth tents for easy access`,`They must be stored in open cardboard boxes under bunk beds`,`They must be secured in the Smellables Shed (next to the youth shower house) in the "Bear Box" overnight`,`No toiletries are allowed in camp whatsoever`],answerIndex:2,explanation:`To prevent dangerous wildlife encounters (Code Brown), no food, drinks, or smellables (toiletries, deodorant, scented products) are allowed in cabins or campsites (except plain water). Overnight, they must be secured in the "Bear Box" in the Smellables Shed by the youth shower house.`},{id:10,question:`What are the rules regarding staff parking and personal vehicles on Staff Hill?`,options:[`Vehicles can be parked in any direction, and any staff member can drive within the camp proper`,`All vehicles must be backed in facing the exit road for quick EAP evacuation, and staff under 18 must have parental/director permits to bring a vehicle`,`Only adult staff over 25 are permitted to park on camp grounds`,`Vehicles must be parked at the main gate and staff must hike up to Staff Hill`],answerIndex:1,explanation:`Staff park on Staff Hill, backing in facing the exit for quick departure in emergencies. Staff under 18 must have written parental approval and Camp Director approval to bring a vehicle, and junior staff riding with others must have written parental permission.`}],s={mission:{statement:`The mission of Scouting America is to prepare young people to make ethical and moral choices over their lifetimes by instilling in them the values of the Scout Oath and Law.`,vision:`Scouting America will prepare every eligible youth in America to become a responsible, participating citizen and leader who is guided by the Scout Oath and Law.`},pillars:[{title:`Physical`,description:`Camp helps develop habits of healthy living through balanced meals and supervised physical activities.`},{title:`Mental`,description:`Advancement programs offer challenges that build self-sufficiency and responsibility.`},{title:`Social`,description:`The community of a summer camp helps build strong, morally rich people skills.`},{title:`Spiritual`,description:`Spiritually rich time in nature helps develop a deeper understanding of a scout's place in the universe.`}],aims:[`Character`,`Citizenship`,`Personal Fitness`,`Leadership`],methods:[`Ideals`,`Patrols`,`Outdoor Programs`,`Advancement`,`Association with Adults`,`Personal Growth`,`Leadership Development`,`Uniform`],whatMakesAStaff:[{trait:`Appearance`,description:`Hygiene, uniform, and how you present yourself make an impression. Before you speak, your appearance will have spoken.`},{trait:`Attitude`,description:`Stay positive and remember you are there to serve as well as have fun. Try to have fun serving.`},{trait:`Personality`,description:`Patience, friendliness, humor, respect and enthusiasm; these traits make all the difference.`},{trait:`Knowledge`,description:`When teaching a Merit Badge or skill, the staff member should be an authority on the subject.`}],stressManagement:[{step:`1. Work the Problem`,description:`Run a self-diagnostic: Are you dehydrated? Are you fueled? Are you sleep-deprived?`},{step:`2. Use Your Siesta`,description:`Napping for a short time each day improves mental health. Use the daily 'Siesta' gap to reboot.`},{step:`3. Manage Sensory Overload`,description:`Find a quiet space out of sight to safely decompress and give your nervous system a chance to return to baseline.`},{step:`4. Tag Out (The Strategic Retreat)`,description:`If a scout is pushing your buttons, tell your Area Director, 'I need five minutes.' Take a few deep breaths.`},{step:`5. Call in the Grown-Ups`,description:`If your mental health is slipping, go to an adult staff member. You are never expected to go through anything alone.`}],glossary:[{term:`Class A / Field Uniform`,def:`Official Scout uniform shirt, scout pants/shorts, belt, closed-toed shoes, and socks.`},{term:`Class B / Activity Uniform`,def:`Camp Lawton Staff Shirt, scout pants/shorts, closed-toed shoes, and a Water Bottle.`},{term:`The Logs`,def:`The bleacher seating in front of the Dining Hall where scouts gather for meals and songs.`},{term:`WAM`,def:`Water Appreciation Moment. If heard, everyone within earshot must take a drink of water.`},{term:`Troop Friend`,def:`A youth staff member assigned to act as a unit's guide, liaison, and friend throughout the week.`},{term:`Staff Hill`,def:`The hill on the north end of camp designated for Staff living facilities.`},{term:`Smellables`,def:`Anything with an odor or scent that might attract wildlife, which must be secured in the Smellables Shed.`}],customerService:{disney:[{title:`Hire for Attitude`,desc:`Prioritize hiring naturally friendly people and train skills later.`},{title:`Everything Speaks`,desc:`Every detail sends a message. Own every aspect of the experience.`},{title:`It's a Stage`,desc:`Treat every employee as a cast member. Maintain a clear distinction between 'onstage' and 'backstage'.`},{title:`Map First`,desc:`Map out every touchpoint through the lens of the customer.`},{title:`Systems over Scripts`,desc:`Build excellence into repeatable systems, rather than rigid scripts.`}],fish:[{title:`Play`,desc:`Bring a lighthearted, spontaneous energy to your environment.`},{title:`Make Their Day`,desc:`Look for ways to create a memorable, positive experience for someone else.`},{title:`Be There`,desc:`Give the customer your complete, undivided attention.`},{title:`Choose Your Attitude`,desc:`Take total responsibility for the mindset you bring to work each day.`}]}},c={healthAndSafety:[{type:`Emergency`,code:`Code Blue`,protocol:`Missing Person Protocol: Gather details (Name, Unit, Clothing, Last Location). Initiate Code Blue over radio to Camp Director. Stand by for centralized search commands. Do not self-assign.`},{type:`Emergency`,code:`Code Brown`,protocol:`Bear Sighting Protocol: Remain calm. Do not approach. Report Code Brown to Camp Director. Maintain safe visual. If an attack occurs, yell loudly, throw rocks, sound alarm.`},{type:`Emergency`,code:`Bell Alarm`,protocol:`Continuous Bell: Drop everything (except securing immediate hazards). Escort scouts directly to Parade Grounds. Do not let them return to campsites. Take strict headcount.`},{type:`Weather`,code:`Lightning 30/30 Rule`,protocol:`If thunder follows lightning by < 30 seconds, immediately cease outdoor activities and seek shelter in the Dining Hall. Do not move through open high ground.`},{type:`Emergency`,code:`Fire`,protocol:`Report any out-of-control fire immediately. Alarm will sound. Absolute first priority is assisting scouts to evacuate safely. Personal gear is secondary.`},{type:`Incident`,code:`Active Shooter`,protocol:`Assume active shooter if gunshots are heard. Hide, find secure shelter, flee into woods, or fight back if necessary. Keep scouts safe.`}],legalPolicies:[{title:`At Will Employment`,content:`Employment is 'at-will' and can be terminated by either party at any time without cause.`},{title:`Equal Employment Opportunity`,content:`Camp Lawton is an EEO employer. No discrimination based on race, religion, sex, etc. Accommodations provided where reasonable.`},{title:`Employee Grievances`,content:`Raise concerns with Area Directors first. If unresolved, submit a signed written grievance to the Camp Director. No retaliation will occur.`},{title:`Whistleblower Policy`,content:`Zero tolerance for retaliation against employees making good faith complaints regarding legal violations, safety dangers, or discrimination.`}],rules:[{title:`Phones`,content:`Keep it put away. Camp needs you here. Will begin with no blanket ban, but abuse will bring the hammer.`},{title:`Fraternization`,content:`Keep the physical stuff out of camp. Represent scouting values. Fraternization can lead to drama and professionalism issues.`},{title:`Media`,content:`Video games/movies are fine in off-time, but MUST be scout appropriate. No M-rated games, R-rated movies, or excessive language.`}]},l={paperwork:[{id:`pw-1`,name:`Staff Application`},{id:`pw-2`,name:`Letter of Agreement`},{id:`pw-3`,name:`Code of Conduct (signed)`},{id:`pw-4`,name:`Medical Forms A, B, and C`},{id:`pw-5`,name:`Vehicle Permit Form (if applicable)`},{id:`pw-6`,name:`Venture/Leader Application`},{id:`pw-7`,name:`I-9 Form and W-4 (if paid)`}]},u=[{id:`emp-1`,name:`Phil Shipley`,role:`Territorial Director, Acting CEO`,department:`Executive`,email:`Philip.shipley@scouting.org`,phone:`555-0100`,bio:`Acting Council CEO overseeing territorial camping programs and resources.`,funFact:`Can name all BSA camps in Arizona in under 20 seconds.`,avatarGradient:`linear-gradient(135deg, #11998e, #38ef7d)`,reportsTo:null},{id:`emp-2`,name:`Mike Korcheck`,role:`Council Operations Manager`,department:`Executive`,email:`Michael.korcheck@scouting.org`,phone:`555-0101`,bio:`Manages operations and resources across Council camps and properties.`,funFact:`Once hiked the entire Grand Canyon rim-to-rim in a single day.`,avatarGradient:`linear-gradient(135deg, #fc4a1a, #f7b733)`,reportsTo:`emp-1`},{id:`emp-3`,name:`Ethan Crisp`,role:`Council District Executive`,department:`Executive`,email:`ethan.crisp@scouting.org`,phone:`555-0102`,bio:`Coordinates camping programs and community district outreach initiatives.`,funFact:`Collects vintage Scouting memorabilia and merit badge patches.`,avatarGradient:`linear-gradient(135deg, #00b09b, #96c93d)`,reportsTo:`emp-1`},{id:`emp-4`,name:`MaryLou Chopelas`,role:`Council Camp Ranger & Camp Director`,department:`People Ops`,email:`marylou.chopelas@scouting.org`,phone:`555-0103`,bio:`Full-time Ranger and Camp Director for Camp Lawton. Oversees facilities and safety.`,funFact:`Has met four bears in person on Staff Hill and won every stare-down.`,avatarGradient:`linear-gradient(135deg, #FF512F, #DD2476)`,reportsTo:`emp-2`},{id:`emp-5`,name:`Alexis Smith`,role:`Camp Program Director`,department:`People Ops`,email:`lexismith8600@gmail.com`,phone:`555-0104`,bio:`Directs the daily program schedule, campfires, and merit badge areas.`,funFact:`Writes all the campfire opening skits and plays the banjo.`,avatarGradient:`linear-gradient(135deg, #8A2387, #E94057)`,reportsTo:`emp-2`},{id:`emp-6`,name:`Jim Tarleton`,role:`Scoutcraft Area Director`,department:`Engineering`,email:`jhtarleton@comcast.net`,phone:`555-0105`,bio:`Area Director for Scoutcraft. Teaches pioneering, camping, and wilderness survival.`,funFact:`Can tie a running bowline behind his back in under 3 seconds.`,avatarGradient:`linear-gradient(135deg, #4286f4, #373B44)`,reportsTo:`emp-3`},{id:`emp-7`,name:`Jack Erickson`,role:`Handicraft Area Director`,department:`Engineering`,email:`ericksonjack2@gmail.com`,phone:`555-0106`,bio:`Area Director for Handicraft. Teaches woodcarving, basketry, and leatherwork.`,funFact:`Carved a full-size wooden eagle using only a pocket knife during siesta.`,avatarGradient:`linear-gradient(135deg, #f12711, #f5af19)`,reportsTo:`emp-3`},{id:`emp-8`,name:`Andrew Rasmussen`,role:`Nature Area Director`,department:`Engineering`,email:`andrewdr2@gmail.com`,phone:`555-0107`,bio:`Area Director for Nature & Ecology. Teaches environmental science and forestry.`,funFact:`Can identify 42 species of mountain birds by their call alone.`,avatarGradient:`linear-gradient(135deg, #56ab2f, #a8e063)`,reportsTo:`emp-3`},{id:`emp-9`,name:`Brian Rome`,role:`Range & Target Sports Director`,department:`Product`,email:`scoutdad@rome1989.com`,phone:`555-0108`,bio:`Area Director for Shooting Sports. Manages rifle, shotgun, and archery ranges.`,funFact:`Has a perfect bullseye record at the archery range since 2018.`,avatarGradient:`linear-gradient(135deg, #7F00FF, #E100FF)`,reportsTo:`emp-3`},{id:`emp-10`,name:`Jim Harrington`,role:`Climbing Wall Director`,department:`Product`,email:`jnherriman@gmail.com`,phone:`555-0109`,bio:`Area Director for Climbing & Rappelling. Manages cook rosters and climbing wall.`,funFact:`Cooks a legendary Dutch Oven peach cobbler over open campfire coals.`,avatarGradient:`linear-gradient(135deg, #ff007f, #7f00ff)`,reportsTo:`emp-3`},{id:`emp-11`,name:`Jack Pickell`,role:`Camp Maintenance Director`,department:`People Ops`,email:`jjpickell58@gmail.com`,phone:`555-0110`,bio:`Manages facilities repair, water pumps, electrical systems, and campgrounds.`,funFact:`Has fixed every single water leak in camp using only spare washers and duct tape.`,avatarGradient:`linear-gradient(135deg, #3a7bd5, #3a6073)`,reportsTo:`emp-2`}],d=[{id:`val-1`,icon:`🌲`,title:`Trustworthiness`,tagline:`A Scout is trustworthy.`,description:`Honesty, integrity, and safety are the bedrock of our staff. We protect the physical and emotional safety of scouts under our care, keeping our word to leaders, parents, and each other.`,example:`When a parent dropped a wallet containing troop funds on the trail, a CIT immediately turned it in to the Camp Office, securing the money for the troop.`},{id:`val-2`,icon:`🤝`,title:`Helpful Service`,tagline:`A Scout is helpful.`,description:`We are here to serve our campers and unit leaders. Whether it is helping a scoutmaster back their vehicle, teaching a complex merit badge, or clearing dining hall tables, we do it cheerfully.`,example:`Ranger MaryLou spent four hours in the cold mountain rain helping Troop 402 set up their dining canopy when their trailer axle snapped on the access road.`},{id:`val-3`,icon:`😊`,title:`Cheerful Character`,tagline:`A Scout is friendly and cheerful.`,description:`Summer camp can be exhausting and high-stimulus, but a positive attitude is contagious. We greet everyone with a smile, lead energetic songs on the logs, and support each other backstage.`,example:`During a heavy afternoon storm delay, Alexis Smith led a 20-minute indoor rhythmic clapping game that turned a room of cold campers into a roaring, laughing party.`},{id:`val-4`,icon:`🌌`,title:`Outdoor Stewardship`,tagline:`A Scout is clean and reverent.`,description:`We protect the natural beauty of the Catalina Mountains. We practice Leave No Trace, lock up smellables to protect native wildlife, and teach scouts to respect and protect their outdoor surroundings.`,example:`The entire staff stayed out for 30 minutes after campfire to conduct a clean-sweep for micro-trash, leaving the amphitheater cleaner than they found it.`}];function f(){return`
    <div style="display: flex; flex-direction: column; gap: 32px; width: 100%;">
      <!-- Paperwork Checklist Section -->
      <div class="glass-panel paperwork-panel" style="display: flex; flex-direction: column; gap: 20px;">
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
      <div class="glass-panel packing-panel" style="display: flex; flex-direction: column; gap: 20px;">
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
      <div class="glass-panel conduct-panel" style="display: flex; flex-direction: column; gap: 20px;">
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
  `}function p(){let e=document.getElementById(`packing-mount`),t=document.getElementById(`packing-progress-val`),r=document.querySelectorAll(`.packing-filter-tab`),i=document.getElementById(`conduct-name-input`),a=document.getElementById(`conduct-sig-input`),o=document.getElementById(`conduct-date-input`),s=document.getElementById(`conduct-agree-chk`),c=document.getElementById(`conduct-sign-btn`);document.getElementById(`conduct-unsign-btn`);let u=document.getElementById(`signer-inputs-panel`),d=document.getElementById(`signer-success-panel`);document.getElementById(`signed-name-val`);let f=document.getElementById(`paperwork-mount`),p=document.getElementById(`paperwork-progress-val`);if(!e)return;let m=JSON.parse(localStorage.getItem(`lawton_packed_items`))||[],h=JSON.parse(localStorage.getItem(`lawton_paperwork_items`))||[];function g(){localStorage.setItem(`lawton_paperwork_items`,JSON.stringify(h)),_()}function _(){if(!p)return;let e=l.paperwork.length;p.textContent=`Done: ${h.length}/${e}`}function v(){f&&(f.innerHTML=l.paperwork.map(e=>{let t=h.includes(e.id);return`
        <div class="packing-item-card ${t?`packed`:``}" data-pw-id="${e.id}" role="checkbox" aria-checked="${t}">
          <div class="packing-item-checkbox"></div>
          <span class="packing-item-name">${e.name}</span>
        </div>
      `}).join(``),f.querySelectorAll(`.packing-item-card`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-pw-id`),n=h.indexOf(t);n>-1?(h.splice(n,1),e.classList.remove(`packed`)):(h.push(t),e.classList.add(`packed`)),g()})}))}function y(){localStorage.setItem(`lawton_packed_items`,JSON.stringify(m)),b()}function b(){if(!t)return;let e=n.filter(e=>e.status!==`prohibited`).length;t.textContent=`Packed: ${n.filter(e=>e.status!==`prohibited`&&m.includes(e.id)).length}/${e} items`}function x(t=`all`){e.innerHTML=n.filter(e=>t===`all`?!0:e.category===t).map(e=>{let t=e.status===`prohibited`,n=m.includes(e.id);return`
        <div class="packing-item-card ${n&&!t?`packed`:``} ${t?`prohibited`:``}" data-item-id="${e.id}" role="checkbox" aria-checked="${n}">
          <div class="packing-item-checkbox"></div>
          <span class="packing-item-name">${e.name}</span>
        </div>
      `}).join(``),e.querySelectorAll(`.packing-item-card`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-item-id`),r=n.find(e=>e.id===t);if(r&&r.status!==`prohibited`){let n=m.indexOf(t);n>-1?(m.splice(n,1),e.classList.remove(`packed`)):(m.push(t),e.classList.add(`packed`)),y()}})})}r.forEach(e=>{e.addEventListener(`click`,()=>{r.forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`),x(e.getAttribute(`data-filter`))})});function S(){if(!G.username){u&&(u.style.display=`none`),d&&(d.style.display=`flex`,d.style.borderColor=`hsl(var(--warning))`,d.style.background=`hsl(var(--warning) / 0.1)`,d.innerHTML=`
          <h4 style="color: hsl(var(--warning)); font-weight: 800; font-family: var(--font-heading); margin-bottom: 6px;">🔒 Log In Required</h4>
          <p style="font-size: 13px; line-height: 1.4; margin-bottom: 10px;">
            Please log in or create a staff account to digitally sign the Code of Conduct commitment sheet.
          </p>
          <button class="welcome-banner-btn" style="align-self: center; padding: 6px 14px; font-size: 12.5px;" id="conduct-login-prompt-btn">Log In / Sign Up</button>
        `,document.getElementById(`conduct-login-prompt-btn`).addEventListener(`click`,()=>{document.getElementById(`user-badge`).click()}));return}G.signedConduct?(u&&(u.style.display=`none`),d&&(d.style.display=`flex`,d.style.borderColor=`hsl(var(--success))`,d.style.background=`hsl(var(--success-light) / 0.15)`,d.innerHTML=`
          <h4 style="color: hsl(var(--success)); font-weight: 800; font-family: var(--font-heading); margin-bottom: 6px;">✓ Digital Commitment Signed</h4>
          <p style="font-size: 13px; line-height: 1.4; margin-bottom: 10px;">
            Thank you, <strong id="signed-name-val">${G.username}</strong>! Your signed Code of Conduct is on file. This task has been marked complete on your readiness checklist.
          </p>
          <button class="quiz-restart-btn" style="align-self: center; padding: 6px 14px; font-size: 12.5px;" id="conduct-unsign-btn">Unsign / Reset Form</button>
        `,document.getElementById(`conduct-unsign-btn`).addEventListener(`click`,()=>{G.setSignedConduct(!1),a&&(a.value=``),s&&(s.checked=!1),S()}))):(u&&(u.style.display=`flex`),d&&(d.style.display=`none`),i&&(i.value=G.username),o&&(o.value=new Date().toISOString().split(`T`)[0]))}c&&c.addEventListener(`click`,()=>{let e=a.value.trim(),t=s.checked;if(!e){alert(`Please type your name in the Digital Signature field.`);return}if(!t){alert(`You must check the agreement box to sign the Code of Conduct.`);return}G.setSignedConduct(!0),S()}),x(),v(),b(),_(),S()}var m={};(function e(t,n,r,i){var a=!!(t.Worker&&t.Blob&&t.Promise&&t.OffscreenCanvas&&t.OffscreenCanvasRenderingContext2D&&t.HTMLCanvasElement&&t.HTMLCanvasElement.prototype.transferControlToOffscreen&&t.URL&&t.URL.createObjectURL),o=typeof Path2D==`function`&&typeof DOMMatrix==`function`,s=(function(){if(!t.OffscreenCanvas)return!1;try{var e=new OffscreenCanvas(1,1),n=e.getContext(`2d`);n.fillRect(0,0,1,1);var r=e.transferToImageBitmap();n.createPattern(r,`no-repeat`)}catch{return!1}return!0})();function c(){}function l(e){var r=n.exports.Promise,i=r===void 0?t.Promise:r;return typeof i==`function`?new i(e):(e(c,c),null)}var u=(function(e,t){return{transform:function(n){if(e)return n;if(t.has(n))return t.get(n);var r=new OffscreenCanvas(n.width,n.height);return r.getContext(`2d`).drawImage(n,0,0),t.set(n,r),r},clear:function(){t.clear()}}})(s,new Map),d=function(){var e=16,t,n,r={},i=0;return typeof requestAnimationFrame==`function`&&typeof cancelAnimationFrame==`function`?(t=function(t){var n=Math.random();return r[n]=requestAnimationFrame(function a(o){i===o||i+e-1<o?(i=o,delete r[n],t()):r[n]=requestAnimationFrame(a)}),n},n=function(e){r[e]&&cancelAnimationFrame(r[e])}):(t=function(t){return setTimeout(t,e)},n=function(e){return clearTimeout(e)}),{frame:t,cancel:n}}(),f=(function(){var t,n,i={};function o(e){function t(t,n){e.postMessage({options:t||{},callback:n})}e.init=function(t){var n=t.transferControlToOffscreen();e.postMessage({canvas:n},[n])},e.fire=function(r,a,o){if(n)return t(r,null),n;var s=Math.random().toString(36).slice(2);return n=l(function(a){function c(t){t.data.callback===s&&(delete i[s],e.removeEventListener(`message`,c),n=null,u.clear(),o(),a())}e.addEventListener(`message`,c),t(r,s),i[s]=c.bind(null,{data:{callback:s}})}),n},e.reset=function(){for(var t in e.postMessage({reset:!0}),i)i[t](),delete i[t]}}return function(){if(t)return t;if(!r&&a){var n=[`var CONFETTI, SIZE = {}, module = {};`,`(`+e.toString()+`)(this, module, true, SIZE);`,`onmessage = function(msg) {`,`  if (msg.data.options) {`,`    CONFETTI(msg.data.options).then(function () {`,`      if (msg.data.callback) {`,`        postMessage({ callback: msg.data.callback });`,`      }`,`    });`,`  } else if (msg.data.reset) {`,`    CONFETTI && CONFETTI.reset();`,`  } else if (msg.data.resize) {`,`    SIZE.width = msg.data.resize.width;`,`    SIZE.height = msg.data.resize.height;`,`  } else if (msg.data.canvas) {`,`    SIZE.width = msg.data.canvas.width;`,`    SIZE.height = msg.data.canvas.height;`,`    CONFETTI = module.exports.create(msg.data.canvas);`,`  }`,`}`].join(`
`);try{t=new Worker(URL.createObjectURL(new Blob([n])))}catch(e){return typeof console<`u`&&typeof console.warn==`function`&&console.warn(`🎊 Could not load worker`,e),null}o(t)}return t}})(),p={particleCount:50,angle:90,spread:45,startVelocity:45,decay:.9,gravity:1,drift:0,ticks:200,x:.5,y:.5,shapes:[`square`,`circle`],zIndex:100,colors:[`#26ccff`,`#a25afd`,`#ff5e7e`,`#88ff5a`,`#fcff42`,`#ffa62d`,`#ff36ff`],disableForReducedMotion:!1,scalar:1};function m(e,t){return t?t(e):e}function h(e){return e!=null}function g(e,t,n){return m(e&&h(e[t])?e[t]:p[t],n)}function _(e){return e<0?0:Math.floor(e)}function v(e,t){return Math.floor(Math.random()*(t-e))+e}function y(e){return parseInt(e,16)}function b(e){return e.map(x)}function x(e){var t=String(e).replace(/[^0-9a-f]/gi,``);return t.length<6&&(t=t[0]+t[0]+t[1]+t[1]+t[2]+t[2]),{r:y(t.substring(0,2)),g:y(t.substring(2,4)),b:y(t.substring(4,6))}}function S(e){var t=g(e,`origin`,Object);return t.x=g(t,`x`,Number),t.y=g(t,`y`,Number),t}function C(e){e.width=document.documentElement.clientWidth,e.height=document.documentElement.clientHeight}function w(e){var t=e.getBoundingClientRect();e.width=t.width,e.height=t.height}function T(e){var t=document.createElement(`canvas`);return t.style.position=`fixed`,t.style.top=`0px`,t.style.left=`0px`,t.style.pointerEvents=`none`,t.style.zIndex=e,t}function ee(e,t,n,r,i,a,o,s,c){e.save(),e.translate(t,n),e.rotate(a),e.scale(r,i),e.arc(0,0,1,o,s,c),e.restore()}function E(e){var t=e.angle*(Math.PI/180),n=e.spread*(Math.PI/180);return{x:e.x,y:e.y,wobble:Math.random()*10,wobbleSpeed:Math.min(.11,Math.random()*.1+.05),velocity:e.startVelocity*.5+Math.random()*e.startVelocity,angle2D:-t+(.5*n-Math.random()*n),tiltAngle:(Math.random()*.5+.25)*Math.PI,color:e.color,shape:e.shape,tick:0,totalTicks:e.ticks,decay:e.decay,drift:e.drift,random:Math.random()+2,tiltSin:0,tiltCos:0,wobbleX:0,wobbleY:0,gravity:e.gravity*3,ovalScalar:.6,scalar:e.scalar,flat:e.flat}}function D(e,t){t.x+=Math.cos(t.angle2D)*t.velocity+t.drift,t.y+=Math.sin(t.angle2D)*t.velocity+t.gravity,t.velocity*=t.decay,t.flat?(t.wobble=0,t.wobbleX=t.x+10*t.scalar,t.wobbleY=t.y+10*t.scalar,t.tiltSin=0,t.tiltCos=0,t.random=1):(t.wobble+=t.wobbleSpeed,t.wobbleX=t.x+10*t.scalar*Math.cos(t.wobble),t.wobbleY=t.y+10*t.scalar*Math.sin(t.wobble),t.tiltAngle+=.1,t.tiltSin=Math.sin(t.tiltAngle),t.tiltCos=Math.cos(t.tiltAngle),t.random=Math.random()+2);var n=t.tick++/t.totalTicks,r=t.x+t.random*t.tiltCos,i=t.y+t.random*t.tiltSin,a=t.wobbleX+t.random*t.tiltCos,s=t.wobbleY+t.random*t.tiltSin;if(e.fillStyle=`rgba(`+t.color.r+`, `+t.color.g+`, `+t.color.b+`, `+(1-n)+`)`,e.beginPath(),o&&t.shape.type===`path`&&typeof t.shape.path==`string`&&Array.isArray(t.shape.matrix))e.fill(A(t.shape.path,t.shape.matrix,t.x,t.y,Math.abs(a-r)*.1,Math.abs(s-i)*.1,Math.PI/10*t.wobble));else if(t.shape.type===`bitmap`){var c=Math.PI/10*t.wobble,l=Math.abs(a-r)*.1,d=Math.abs(s-i)*.1,f=t.shape.bitmap.width*t.scalar,p=t.shape.bitmap.height*t.scalar,m=new DOMMatrix([Math.cos(c)*l,Math.sin(c)*l,-Math.sin(c)*d,Math.cos(c)*d,t.x,t.y]);m.multiplySelf(new DOMMatrix(t.shape.matrix));var h=e.createPattern(u.transform(t.shape.bitmap),`no-repeat`);h.setTransform(m),e.globalAlpha=1-n,e.fillStyle=h,e.fillRect(t.x-f/2,t.y-p/2,f,p),e.globalAlpha=1}else if(t.shape===`circle`)e.ellipse?e.ellipse(t.x,t.y,Math.abs(a-r)*t.ovalScalar,Math.abs(s-i)*t.ovalScalar,Math.PI/10*t.wobble,0,2*Math.PI):ee(e,t.x,t.y,Math.abs(a-r)*t.ovalScalar,Math.abs(s-i)*t.ovalScalar,Math.PI/10*t.wobble,0,2*Math.PI);else if(t.shape===`star`)for(var g=Math.PI/2*3,_=4*t.scalar,v=8*t.scalar,y=t.x,b=t.y,x=5,S=Math.PI/x;x--;)y=t.x+Math.cos(g)*v,b=t.y+Math.sin(g)*v,e.lineTo(y,b),g+=S,y=t.x+Math.cos(g)*_,b=t.y+Math.sin(g)*_,e.lineTo(y,b),g+=S;else e.moveTo(Math.floor(t.x),Math.floor(t.y)),e.lineTo(Math.floor(t.wobbleX),Math.floor(i)),e.lineTo(Math.floor(a),Math.floor(s)),e.lineTo(Math.floor(r),Math.floor(t.wobbleY));return e.closePath(),e.fill(),t.tick<t.totalTicks}function O(e,t,n,a,o){var s=t.slice(),c=e.getContext(`2d`),f,p,m=l(function(t){function l(){f=p=null,c.clearRect(0,0,a.width,a.height),u.clear(),o(),t()}function m(){r&&!(a.width===i.width&&a.height===i.height)&&(a.width=e.width=i.width,a.height=e.height=i.height),!a.width&&!a.height&&(n(e),a.width=e.width,a.height=e.height),c.clearRect(0,0,a.width,a.height),s=s.filter(function(e){return D(c,e)}),s.length?f=d.frame(m):l()}f=d.frame(m),p=l});return{addFettis:function(e){return s=s.concat(e),m},canvas:e,promise:m,reset:function(){f&&d.cancel(f),p&&p()}}}function k(e,n){var r=!e,i=!!g(n||{},`resize`),o=!1,s=g(n,`disableForReducedMotion`,Boolean),c=a&&g(n||{},`useWorker`)?f():null,u=r?C:w,d=e&&c?!!e.__confetti_initialized:!1,p=typeof matchMedia==`function`&&matchMedia(`(prefers-reduced-motion)`).matches,m;function h(t,n,r){for(var i=g(t,`particleCount`,_),a=g(t,`angle`,Number),o=g(t,`spread`,Number),s=g(t,`startVelocity`,Number),c=g(t,`decay`,Number),l=g(t,`gravity`,Number),d=g(t,`drift`,Number),f=g(t,`colors`,b),p=g(t,`ticks`,Number),h=g(t,`shapes`),y=g(t,`scalar`),x=!!g(t,`flat`),C=S(t),w=i,T=[],ee=e.width*C.x,D=e.height*C.y;w--;)T.push(E({x:ee,y:D,angle:a,spread:o,startVelocity:s,color:f[w%f.length],shape:h[v(0,h.length)],ticks:p,decay:c,gravity:l,drift:d,scalar:y,flat:x}));return m?m.addFettis(T):(m=O(e,T,u,n,r),m.promise)}function y(n){var a=s||g(n,`disableForReducedMotion`,Boolean),f=g(n,`zIndex`,Number);if(a&&p)return l(function(e){e()});r&&m?e=m.canvas:r&&!e&&(e=T(f),document.body.appendChild(e)),i&&!d&&u(e);var _={width:e.width,height:e.height};c&&!d&&c.init(e),d=!0,c&&(e.__confetti_initialized=!0);function v(){if(c){var t={getBoundingClientRect:function(){if(!r)return e.getBoundingClientRect()}};u(t),c.postMessage({resize:{width:t.width,height:t.height}});return}_.width=_.height=null}function y(){m=null,i&&(o=!1,t.removeEventListener(`resize`,v)),r&&e&&(document.body.contains(e)&&document.body.removeChild(e),e=null,d=!1)}return i&&!o&&(o=!0,t.addEventListener(`resize`,v,!1)),c?c.fire(n,_,y):h(n,_,y)}return y.reset=function(){c&&c.reset(),m&&m.reset()},y}var te;function ne(){return te||=k(null,{useWorker:!0,resize:!0}),te}function A(e,t,n,r,i,a,o){var s=new Path2D(e),c=new Path2D;c.addPath(s,new DOMMatrix(t));var l=new Path2D;return l.addPath(c,new DOMMatrix([Math.cos(o)*i,Math.sin(o)*i,-Math.sin(o)*a,Math.cos(o)*a,n,r])),l}function j(e){if(!o)throw Error(`path confetti are not supported in this browser`);var t,n;typeof e==`string`?t=e:(t=e.path,n=e.matrix);var r=new Path2D(t),i=document.createElement(`canvas`).getContext(`2d`);if(!n){for(var a=1e3,s=a,c=a,l=0,u=0,d,f,p=0;p<a;p+=2)for(var m=0;m<a;m+=2)i.isPointInPath(r,p,m,`nonzero`)&&(s=Math.min(s,p),c=Math.min(c,m),l=Math.max(l,p),u=Math.max(u,m));d=l-s,f=u-c;var h=10,g=Math.min(h/d,h/f);n=[g,0,0,g,-Math.round(d/2+s)*g,-Math.round(f/2+c)*g]}return{type:`path`,path:t,matrix:n}}function M(e){var t,n=1,r=`#000000`,i=`"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", "Twemoji Mozilla", "system emoji", sans-serif`;typeof e==`string`?t=e:(t=e.text,n=`scalar`in e?e.scalar:n,i=`fontFamily`in e?e.fontFamily:i,r=`color`in e?e.color:r);var a=10*n,o=``+a+`px `+i,s=new OffscreenCanvas(a,a),c=s.getContext(`2d`);c.font=o;var l=c.measureText(t),u=Math.ceil(l.actualBoundingBoxRight+l.actualBoundingBoxLeft),d=Math.ceil(l.actualBoundingBoxAscent+l.actualBoundingBoxDescent),f=2,p=l.actualBoundingBoxLeft+f,m=l.actualBoundingBoxAscent+f;u+=f+f,d+=f+f,s=new OffscreenCanvas(u,d),c=s.getContext(`2d`),c.font=o,c.fillStyle=r,c.fillText(t,p,m);var h=1/n;return{type:`bitmap`,bitmap:s.transferToImageBitmap(),matrix:[h,0,0,h,-u*h/2,-d*h/2]}}n.exports=function(){return ne().apply(this,arguments)},n.exports.reset=function(){ne().reset()},n.exports.create=k,n.exports.shapeFromPath=j,n.exports.shapeFromText=M})((function(){return typeof window<`u`?window:typeof self<`u`?self:this||{}})(),m,!1);var h=m.exports;m.exports.create;function g(){return`
    <div class="quiz-container">
      <div class="glass-panel" id="quiz-mount">
        <!-- Renders dynamically -->
      </div>
    </div>
  `}function _(){let e=document.getElementById(`quiz-mount`);if(!e)return;let t=0,n=0,r=null,i=[];function a(){let i=o.length,a=o[t],c=t/i*100;e.innerHTML=`
      <div class="quiz-header">
        <span>Question ${t+1} of ${i}</span>
        <span>Score: ${n}/${i}</span>
      </div>
      
      <div class="quiz-progress-bar-bg" style="margin: 12px 0 24px 0;">
        <div class="quiz-progress-bar-fill" style="width: ${c}%;"></div>
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
    `,e.querySelectorAll(`.quiz-option-btn`).forEach(e=>{e.addEventListener(`click`,()=>{r===null&&s(parseInt(e.getAttribute(`data-option-idx`)))})})}function s(a){r=a,i[t]=a;let s=o[t],l=a===s.answerIndex;l&&n++,e.querySelectorAll(`.quiz-option-btn`).forEach((e,t)=>{t===s.answerIndex?e.classList.add(`correct`):t===a&&e.classList.add(`incorrect`),e.disabled=!0});let u=document.getElementById(`quiz-feedback-mount`);u&&(u.style.display=`block`,u.innerHTML=`
        <div class="quiz-feedback-box">
          <span class="quiz-feedback-title ${l?`correct`:`incorrect`}">
            ${l?`✨ Correct!`:`❌ Incorrect`}
          </span>
          <p style="font-weight: 500; font-size: 13.5px; line-height: 1.4; margin-top: 4px;">${s.explanation}</p>
        </div>
      `);let d=document.getElementById(`quiz-next-bar`);if(d){d.style.display=`flex`;let e=document.getElementById(`quiz-next-btn`);e&&e.addEventListener(`click`,c)}}function c(){r=null,t++,t<o.length?a():l()}function l(){let s=o.length,c=Math.round(n/s*100),l=c>=80;l&&(G.completedTasks.includes(`checklist-5`)||G.toggleTask(`checklist-5`),u());let d=o.filter((e,t)=>i[t]!==e.answerIndex),f=``;f=d.length>0?`
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
          ${l?`🏆`:`📚`}
        </div>
        
        <h2 class="quiz-complete-title" style="font-size: 24px; font-weight: 800; font-family: var(--font-heading); margin-bottom: 4px;">
          ${l?`Congratulations!`:`Review & Retry`}
        </h2>
        
        <div style="font-size: 16px; font-weight: 700; color: hsl(var(--primary)); margin-bottom: 12px;">
          You scored ${n} out of ${s} (${c}%)
        </div>

        <p class="quiz-complete-desc" style="max-width: 550px; font-size: 14.5px; color: hsl(var(--muted-foreground)); line-height: 1.5; margin-bottom: 20px;">
          ${l?`Excellent job${G.username?`, `+G.username:``}! You have proven a strong command of Camp Lawton safety rules, emergency alarm protocols, hydration, and mandatory Arizona state reporting laws. You are officially certified for summer staff!`:`You need at least 80% (8 out of 10 correct) to earn your Camp Lawton certification badge. Review the safety guides, schedule details, and the study review board below, then try again!`}
        </p>

        <div style="display: flex; gap: 14px; margin-bottom: 24px;">
          <button class="quiz-restart-btn" id="quiz-restart-btn" style="padding: 10px 20px; border-radius: var(--radius-sm); font-weight: 700; cursor: pointer;">Try Quiz Again</button>
          ${l?`<button class="welcome-banner-btn" id="quiz-dashboard-btn" style="padding: 10px 20px;">Back to Dashboard</button>`:``}
        </div>

        <!-- Inject detailed review board -->
        ${f}
      </div>
    `,document.getElementById(`quiz-restart-btn`).addEventListener(`click`,()=>{t=0,n=0,r=null,i=[],a()}),l&&document.getElementById(`quiz-dashboard-btn`).addEventListener(`click`,()=>{X(`dashboard`)})}function u(){let e=4*1e3,t=Date.now()+e,n={startVelocity:30,spread:360,ticks:60,zIndex:1e4};function r(e,t){return Math.random()*(t-e)+e}let i=setInterval(function(){let a=t-Date.now();if(a<=0)return clearInterval(i);let o=a/e*50;h({...n,particleCount:o,origin:{x:r(.1,.3),y:Math.random()-.2}}),h({...n,particleCount:o,origin:{x:r(.7,.9),y:Math.random()-.2}})},250)}a()}var v=0,y=JSON.parse(localStorage.getItem(`camp_lawton_app_draft`))||{};function b(e){e.innerHTML=`
    <div style="max-width: 800px; margin: 0 auto; padding-bottom: 60px;">
      
      <!-- Progress Bar -->
      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 30px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h2 style="color: hsl(var(--primary)); font-family: var(--font-heading); font-size: 24px;">Staff Application</h2>
          <span style="font-size: 14px; color: hsl(var(--muted-foreground)); font-weight: 500;">Step ${v+1} of 5</span>
        </div>
        <div style="height: 8px; background: hsl(var(--border)); border-radius: 4px; overflow: hidden; position: relative;">
          <div style="position: absolute; top: 0; left: 0; height: 100%; width: ${v/4*100}%; background: hsl(var(--primary)); transition: width 0.4s ease; border-radius: 4px;"></div>
        </div>
      </div>

      <!-- Form Container -->
      <div class="glass-panel" style="animation: tabFadeIn 0.4s ease;">
        <form id="application-form" style="display: flex; flex-direction: column; gap: 24px;">
          <div id="step-content"></div>
          
          <div style="display: flex; justify-content: space-between; margin-top: 20px; border-top: 1px solid hsl(var(--border)); padding-top: 20px;">
            <button type="button" id="app-prev-btn" class="welcome-banner-btn" style="background: hsl(var(--secondary)); color: hsl(var(--foreground)); ${v===0?`visibility: hidden;`:``}">Back</button>
            <button type="button" id="app-next-btn" class="welcome-banner-btn">${v===4?`Sign & Submit`:`Next Section`}</button>
          </div>
        </form>
      </div>
    </div>
  `,x(document.getElementById(`step-content`)),S()}function x(e){let t=``;switch(v){case 0:t=`
        <h3 style="color: hsl(var(--foreground)); margin-bottom: 16px;">Section I: Demographics & Legal Eligibility</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          ${w(`First Name`,`firstName`)}
          ${w(`Last Name`,`lastName`)}
          ${w(`Preferred Name / Nickname`,`nickname`)}
          ${w(`Phone Number`,`phone`,`tel`)}
        </div>
        ${w(`Email Address`,`email`,`email`)}
        ${w(`Primary Address`,`address`)}
        
        <h4 style="margin-top: 16px; color: hsl(var(--primary));">Age Eligibility (as of June 1, 2026)</h4>
        <select id="ageEligibility" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: hsl(var(--foreground)); width: 100%;">
          <option value="">Select Age Group...</option>
          <option value="14" ${y.ageEligibility===`14`?`selected`:``}>14-15 years old (CIT Minimum)</option>
          <option value="16" ${y.ageEligibility===`16`?`selected`:``}>16-17 years old (Junior Staff)</option>
          <option value="18" ${y.ageEligibility===`18`?`selected`:``}>18-20 years old (Adult Status)</option>
          <option value="21" ${y.ageEligibility===`21`?`selected`:``}>21+ years old (Camp Management)</option>
        </select>

        ${T(`workAuth`,`I am legally authorized to work in the United States (Proof required upon hire).`)}
        ${T(`scoutReg`,`I am currently registered with Scouting America OR agree to register if hired.`)}
      `;break;case 1:t=`
        <h3 style="color: hsl(var(--foreground)); margin-bottom: 16px;">Section II: Position Preferences</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          ${w(`Available Start Date`,`startDate`,`date`)}
          ${w(`Available End Date`,`endDate`,`date`)}
        </div>
        
        <h4 style="margin-top: 16px; color: hsl(var(--primary));">Top Position Preferences</h4>
        ${w(`1st Choice`,`pref1`)}
        ${w(`2nd Choice`,`pref2`)}
        ${w(`3rd Choice`,`pref3`)}

        <h4 style="margin-top: 16px; color: hsl(var(--primary));">Uniform Sizing</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <select id="shirtSize" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: hsl(var(--foreground));">
            <option value="">T-Shirt Size...</option>
            ${[`S`,`M`,`L`,`XL`,`2XL`,`3XL`].map(e=>`<option value="${e}" ${y.shirtSize===e?`selected`:``}>${e}</option>`).join(``)}
          </select>
          <select id="jacketSize" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: hsl(var(--foreground));">
            <option value="">Jacket Size...</option>
            ${[`S`,`M`,`L`,`XL`,`2XL`,`3XL`].map(e=>`<option value="${e}" ${y.jacketSize===e?`selected`:``}>${e}</option>`).join(``)}
          </select>
        </div>
      `;break;case 2:t=`
        <h3 style="color: hsl(var(--foreground)); margin-bottom: 16px;">Section III: Experience & References</h3>
        ${w(`Current Scouting Rank (if any)`,`scoutRank`)}
        ${T(`oaMember`,`I am an Order of the Arrow Member`)}
        
        <h4 style="margin-top: 16px; color: hsl(var(--primary));">Previous Employment / Camp Staff</h4>
        ${w(`Most Recent Employer / Camp`,`employer`)}
        ${w(`Primary Duties / Role`,`duties`)}
        
        <h4 style="margin-top: 16px; color: hsl(var(--primary));">Professional References (Need 3)</h4>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${w(`Reference 1 (Name, Relation, Contact)`,`ref1`)}
          ${w(`Reference 2 (Name, Relation, Contact)`,`ref2`)}
          ${w(`Reference 3 (Name, Relation, Contact)`,`ref3`)}
        </div>
      `;break;case 3:t=`
        <h3 style="color: hsl(var(--foreground)); margin-bottom: 16px;">Section IV: Essential Functions</h3>
        <p style="font-size: 14px; color: hsl(var(--muted-foreground)); margin-bottom: 16px;">
          Camp Lawton is located at 8,000 feet elevation. By checking these boxes, you acknowledge the essential functions of the role.
        </p>
        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${T(`ackAltitude`,`<strong>High-Altitude & Terrain:</strong> I understand this requires physical exertion and navigating rugged terrain.`)}
          ${T(`ackWildlife`,`<strong>Wildlife & Smellables:</strong> I agree to strictly adhere to the camp wildlife protocols.`)}
          ${T(`ackSanitation`,`<strong>Water & Sanitation:</strong> I acknowledge water scarcity, shower limits, and that duties include cleaning latrines.`)}
          ${T(`ackMedical`,`<strong>Medical Clearances:</strong> I must provide a current BSA Annual Health Record (Parts A, B, and C) upon hire.`)}
        </div>
        <h4 style="margin-top: 16px; color: hsl(var(--primary));">Current Certifications</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          ${T(`certCPR`,`CPR / AED`)}
          ${T(`certWFA`,`Wilderness First Aid`)}
        </div>
      `;break;case 4:t=`
        <h3 style="color: hsl(var(--foreground)); margin-bottom: 16px;">Section V: Agreements & Signature</h3>
        <div style="background: hsl(var(--secondary)); padding: 16px; border-radius: var(--radius-sm); margin-bottom: 16px; font-size: 13.5px; display: flex; flex-direction: column; gap: 10px;">
          <p><strong>BSA Code of Conduct:</strong> I agree to conduct myself in accordance with the Scout Oath and Scout Law.</p>
          <p><strong>Substance Abuse:</strong> Zero-tolerance policy regarding alcohol, illegal drugs, and unauthorized meds.</p>
          <p><strong>At-Will Employment:</strong> Employment may be terminated at any time with or without cause.</p>
        </div>
        ${T(`ackAgreements`,`I agree to the above terms and certify all provided info is accurate.`)}
        
        <div style="margin-top: 20px;">
          ${w(`Digital Signature (Type Full Legal Name)`,`signature`)}
          ${w(`Date`,`sigDate`,`date`)}
        </div>
      `;break}e.innerHTML=t,e.querySelectorAll(`input, select`).forEach(e=>{e.type===`checkbox`?e.checked=y[e.id]||!1:e.value=y[e.id]||``})}function S(){let e=document.getElementById(`application-form`),t=document.getElementById(`app-prev-btn`),n=document.getElementById(`app-next-btn`);e.addEventListener(`input`,()=>{e.querySelectorAll(`input, select`).forEach(e=>{e.type===`checkbox`?y[e.id]=e.checked:y[e.id]=e.value}),localStorage.setItem(`camp_lawton_app_draft`,JSON.stringify(y))}),t.addEventListener(`click`,()=>{v>0&&(v--,b(document.getElementById(`view-mount-point`)))}),n.addEventListener(`click`,()=>{v<4?(v++,b(document.getElementById(`view-mount-point`))):C()})}function C(){if(!y.signature||!y.ackAgreements){alert(`Please provide a digital signature and check the agreement box before submitting.`);return}let e=JSON.parse(localStorage.getItem(`camp_lawton_applications`)||`[]`),t={id:`app_`+Date.now()+`_`+Math.random().toString(36).substr(2,9),username:G.username||`guest`,submittedAt:new Date().toISOString(),status:`Pending`,formData:{...y}},n=e.findIndex(e=>e.username.toLowerCase()===t.username.toLowerCase());n>-1?e[n]=t:e.push(t),localStorage.setItem(`camp_lawton_applications`,JSON.stringify(e)),localStorage.removeItem(`camp_lawton_app_draft`),y={},v=0,window.dispatchEvent(new CustomEvent(`camp-application-submitted`,{detail:t}));let r=document.getElementById(`view-mount-point`);r.innerHTML=`
    <div class="glass-panel" style="max-width: 600px; margin: 40px auto; text-align: center; animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
      <div style="font-size: 64px; margin-bottom: 20px;">🎉</div>
      <h2 style="color: hsl(var(--primary)); font-family: var(--font-heading); margin-bottom: 12px; font-size: 28px;">Application Submitted!</h2>
      <p style="color: hsl(var(--muted-foreground)); line-height: 1.6; margin-bottom: 24px;">
        Thank you for applying to Camp Lawton! Your application for the 2026 season has been received. Our leadership team will review your details and contact you shortly.
      </p>
      <button class="welcome-banner-btn" onclick="document.getElementById('nav-btn-dashboard').click()">Return to Dashboard</button>
    </div>
  `}function w(e,t,n=`text`){return`
    <div style="display: flex; flex-direction: column; gap: 6px;">
      <label for="${t}" style="font-size: 14px; font-weight: 500;">${e}</label>
      <input type="${n}" id="${t}" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: hsl(var(--foreground)); width: 100%;" />
    </div>
  `}function T(e,t){return`
    <label style="display: flex; gap: 10px; align-items: flex-start; cursor: pointer; font-size: 14.5px;">
      <input type="checkbox" id="${e}" style="margin-top: 4px; accent-color: hsl(var(--primary)); width: 16px; height: 16px;" />
      <span style="color: hsl(var(--foreground)); line-height: 1.4;">${t}</span>
    </label>
  `}var ee=t({activeOnboardingTab:()=>E,initOnboarding:()=>k,renderOnboarding:()=>O,setOnboardingTab:()=>D}),E=`checklists`;function D(e){E=e}function O(){return`
    <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
      <!-- Tab Selector -->
      <div class="schedule-tabs-container">
        <button class="schedule-tab-btn ${E===`checklists`?`active`:``}" data-tab="checklists">🎒 Checklists & Gear</button>
        <button class="schedule-tab-btn ${E===`conduct`?`active`:``}" data-tab="conduct">✍️ Code of Conduct</button>
        <button class="schedule-tab-btn ${E===`quiz`?`active`:``}" data-tab="quiz">🏆 Handbook Quiz</button>
        <button class="schedule-tab-btn ${E===`apply`?`active`:``}" data-tab="apply">📝 Apply Now</button>
      </div>

      <!-- Mount point for sub tabs -->
      <div id="onboarding-subtab-mount">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `}function k(){E===`conduct`?document.documentElement.setAttribute(`data-theme-mode`,`code-red`):document.documentElement.removeAttribute(`data-theme-mode`),document.querySelectorAll(`[data-tab]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-tab`);if(t){E=t;let e=document.getElementById(`view-mount-point`);e&&(e.innerHTML=O(),k())}})});let e=document.getElementById(`onboarding-subtab-mount`);if(e)if(window.dispatchEvent(new CustomEvent(`before-view-change`)),E===`checklists`){e.innerHTML=f(),p();let t=document.querySelector(`.conduct-panel`);t&&(t.style.display=`none`)}else if(E===`conduct`){e.innerHTML=f(),p();let t=document.querySelector(`.paperwork-panel`),n=document.querySelector(`.packing-panel`);t&&(t.style.display=`none`),n&&(n.style.display=`none`)}else E===`quiz`?(e.innerHTML=g(),_()):E===`apply`&&b(e)}var te=`modulepreload`,ne=function(e){return`/`+e},A={},j=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?import.meta.resolve(e):new URL(e,new URL(`../../../src/node/plugins/importAnalysisBuild.ts`,import.meta.url)).href}r=o(t.map(t=>{if(t=ne(t,n),t=s(t),t in A)return;A[t]=!0;let r=t.endsWith(`.css`);for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}let i=document.createElement(`link`);if(i.rel=r?`stylesheet`:te,r||(i.as=`script`),i.crossOrigin=``,i.href=t,a&&i.setAttribute(`nonce`,a),document.head.appendChild(i),r)return new Promise((e,n)=>{i.addEventListener(`load`,e),i.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},M=[{id:`checklist-1`,text:`Submit Medical Forms A, B, and C`,category:`HR`},{id:`checklist-2`,text:`Complete Safeguarding Youth Training (SYT)`,category:`Training`},{id:`checklist-3`,text:`Complete online Hazardous Weather module`,category:`Training`},{id:`checklist-4`,text:`Sign the Code of Conduct commitment sheet`,category:`Code`},{id:`checklist-5`,text:`Take the Camp Lawton Certification Quiz`,category:`Quiz`}],re=[{icon:`🐻`,title:`Code Brown Review`,text:`Brush up on the bear encounter protocol before your next hike.`,linkView:`policies`,linkTab:`safety`,color:`var(--safety-red)`,bg:`rgba(200, 35, 44, 0.1)`},{icon:`🔥`,title:`Campfire Builder`,text:`Did you know you can build and submit campfire programs digitally?`,linkView:`songbook`,linkTab:`builder`,color:`#f59e0b`,bg:`rgba(245, 158, 11, 0.1)`},{icon:`⛺`,title:`Packing Checklist`,text:`Check your gear! Review what is privileged and what is prohibited.`,linkView:`onboarding`,linkTab:`checklists`,color:`#10b981`,bg:`rgba(16, 185, 129, 0.1)`},{icon:`⚡`,title:`Severe Weather`,text:`Practice the 30/30 Lightning rule before monsoon season hits.`,linkView:`policies`,linkTab:`safety`,color:`#3b82f6`,bg:`rgba(59, 130, 246, 0.1)`},{icon:`📻`,title:`Radio Protocol`,text:`Practice your radio transmission scripts in the training sandbox.`,linkView:`policies`,linkTab:`radio`,color:`#8b5cf6`,bg:`rgba(139, 92, 246, 0.1)`}],N=null;function ie(){let e=JSON.parse(localStorage.getItem(`camp_lawton_applications`)||`[]`),t=G.username?e.find(e=>e.username.toLowerCase()===G.username.toLowerCase()):null;if(!t)return`
      <div class="glass-panel app-banner-card" id="dashboard-app-banner">
        <div class="app-banner-content">
          <span class="app-banner-icon">📝</span>
          <div class="app-banner-text">
            <h3>Ready to join the 2026 staff?</h3>
            <p>Fill out and submit your interactive Camp Lawton Staff Application today.</p>
          </div>
        </div>
        <button class="welcome-banner-btn" style="pointer-events: none;">Apply Now</button>
      </div>
    `;let n=`pending`,r=`Pending Review`,i=`⏳`;return t.status===`Approved`?(n=`approved`,r=`Approved`,i=`✅`):t.status===`Rejected`&&(n=`rejected`,r=`Rejected / Incomplete`,i=`❌`),`
    <div class="glass-panel app-banner-card submitted" id="dashboard-app-banner">
      <div class="app-banner-content">
        <span class="app-banner-icon">📝</span>
        <div class="app-banner-text">
          <h3>Your 2026 Staff Application</h3>
          <p>Submitted: ${new Date(t.submittedAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div class="app-status-badge ${n}">
        <span>${i}</span>
        <span>${r}</span>
      </div>
    </div>
  `}function ae(){return`
    <div class="dashboard-grid">
      <!-- Welcome Banner -->
      <div class="welcome-banner-card">
        <div class="welcome-banner-text">
          <h2>${G.username?`Welcome to the Mountain, <span id="dashboard-username">${G.username}</span>! 🌲`:`Welcome to the Mountain! 🌲`}</h2>
          <p>Congratulations on joining the Camp Lawton team! As Camp Staff, you are now part of a century-old legacy of shaping lives through the outdoor experience. Complete your readiness checks below to get set up for the summer.</p>
        </div>
        <button class="welcome-banner-btn" id="dashboard-explore-btn">Go to Camp Schedule</button>
      </div>

      <!-- Application Banner -->
      ${ie()}

      <!-- Semi-Random Highlight Box -->
      ${N=re[Math.floor(Math.random()*re.length)],`
          <div class="glass-panel dashboard-flex-panel highlight-box-hover" id="dashboard-highlight-box" style="grid-column: 1 / -1; background: ${N.bg}; border: 1px solid ${N.color}; cursor: pointer;">
            <div class="dashboard-flex-panel-content">
              <span style="font-size: 32px;">${N.icon}</span>
              <div>
                <h3 style="margin: 0 0 4px 0; color: ${N.color}; font-size: 18px;">Training Spotlight: ${N.title}</h3>
                <p style="margin: 0; font-size: 14.5px; color: hsl(var(--foreground)); opacity: 0.9;">${N.text}</p>
              </div>
            </div>
            <span class="dashboard-flex-panel-action" style="color: ${N.color}; font-weight: 800;">Review ➔</span>
          </div>
        `}

      <!-- WAM Hydration Alert Widget -->
      <div class="wam-alert-card" id="wam-card">
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <h3 style="font-size: 20px; font-weight: 800; font-family: var(--font-heading);">💦 Water Appreciation Moment (WAM)</h3>
          <p style="font-size: 14.5px; opacity: 0.9;">Shout "WAM!" and everyone drinks. Dehydration is a real hazard at 8,000 ft.</p>
          <span style="font-size: 13px; font-weight: 700; background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 4px; align-self: flex-start; margin-top: 6px;" id="wam-counter-display">Drinks Logged: ${G.wamCount}</span>
        </div>
        <button class="wam-button" id="wam-btn">Take a Drink! 🥤</button>
      </div>

      <!-- Tag Out Protocol Widget -->
      <div class="glass-panel dashboard-flex-panel" style="grid-column: 1 / -1; background: rgba(139, 92, 246, 0.1); border: 1px solid #8b5cf6;">
        <div class="dashboard-flex-panel-content">
          <h3 style="margin: 0 0 8px 0; color: #8b5cf6; font-size: 18px;">🧘 The "Tag Out" Protocol</h3>
          <p style="margin: 0; font-size: 14px; color: hsl(var(--foreground)); line-height: 1.5;">
            Feeling overwhelmed? It is completely valid. If a camper is escalating, or you just hit a wall, you have the right to request a <strong>Strategic Retreat</strong>. Ask your Area Director to tag in while you take 5 minutes to reset.
          </p>
        </div>
        <button id="tag-out-btn" class="dashboard-flex-panel-action" style="background: #8b5cf6; color: white; border: none; padding: 12px 24px; border-radius: var(--radius-sm); font-weight: 700; font-family: var(--font-heading); font-size: 16px; cursor: pointer; transition: all 0.2s ease;">
          Acknowledge Tag Out Right
        </button>
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
  `}function oe(){let e=document.getElementById(`dashboard-username`);e&&(e.textContent=G.username);let t=document.getElementById(`dashboard-explore-btn`);t&&t.addEventListener(`click`,()=>{j(()=>Promise.resolve().then(()=>be).then(e=>e.setCampLawtonTab(`schedule`)),void 0),X(`camplawton`)});let n=document.getElementById(`dashboard-highlight-box`);n&&N&&(n.addEventListener(`click`,()=>{N.linkView===`policies`?j(()=>Promise.resolve().then(()=>ke).then(e=>e.setPoliciesTab(N.linkTab)),void 0):N.linkView===`songbook`?j(()=>Promise.resolve().then(()=>Be).then(e=>e.activeSongbookTab=N.linkTab),void 0):N.linkView===`onboarding`&&j(()=>Promise.resolve().then(()=>ee).then(e=>e.setOnboardingTab(N.linkTab)),void 0),X(N.linkView)}),n.addEventListener(`mouseenter`,()=>n.style.transform=`translateY(-2px)`),n.addEventListener(`mouseleave`,()=>n.style.transform=`translateY(0)`));let r=document.getElementById(`dashboard-app-banner`);r&&r.addEventListener(`click`,()=>{setPart4Tab(`apply`),X(`onboarding`)});let i=document.getElementById(`wam-btn`),a=document.getElementById(`wam-card`),o=document.getElementById(`wam-counter-display`);i&&a&&i.addEventListener(`click`,e=>{G.incrementWam();let t=document.createElement(`div`);t.classList.add(`wam-ripple-effect`);let n=a.getBoundingClientRect(),r=e.clientX-n.left,i=e.clientY-n.top;t.style.left=`${r}px`,t.style.top=`${i}px`,a.appendChild(t),setTimeout(()=>t.remove(),1200)});let s=document.getElementById(`tag-out-btn`);s&&s.addEventListener(`click`,()=>{s.innerHTML=`✅ Retreat Acknowledged`,s.style.background=`rgba(139, 92, 246, 0.2)`,s.style.color=`#8b5cf6`,s.style.pointerEvents=`none`,alert(`Your Area Director has been notified via the simulation network. Retreat and reset.`)}),se(),ce();let c=()=>{se(),ce()},l=()=>{o&&(o.textContent=`Drinks Logged: ${G.wamCount}`)},u=()=>{window.removeEventListener(`state-tasks-updated`,c),window.removeEventListener(`state-wam-updated`,l),window.removeEventListener(`before-view-change`,u)};window.addEventListener(`before-view-change`,u),window.addEventListener(`state-tasks-updated`,c),window.addEventListener(`state-wam-updated`,l)}function se(){let e=document.getElementById(`dashboard-checklist-mount`);e&&(e.innerHTML=M.map(e=>{let t=G.completedTasks.includes(e.id);return`
      <div class="checklist-item ${t?`checked`:``}" data-task-id="${e.id}" role="checkbox" aria-checked="${t}">
        <div class="checklist-checkbox-container">
          <div class="checklist-checkbox"></div>
        </div>
        <span class="checklist-item-text">${e.text}</span>
        <span class="checklist-category-badge">${e.category}</span>
      </div>
    `}).join(``),e.querySelectorAll(`.checklist-item`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-task-id`);t===`checklist-4`?X(`packing`):t===`checklist-5`?X(`quiz`):G.toggleTask(t)})}))}function ce(){let e=document.getElementById(`progress-pct-display`),t=document.getElementById(`progress-frac-display`),n=document.getElementById(`progress-circle`),r=document.getElementById(`progress-encouragement`);if(!e||!n)return;let i=M.length,a=M.filter(e=>G.completedTasks.includes(e.id)).length,o=i>0?Math.round(a/i*100):0,s=2*Math.PI*70;n.style.strokeDasharray=`${s} ${s}`;let c=s-o/100*s;n.style.strokeDashoffset=c,e.textContent=`${o}%`,t&&(t.textContent=`${a}/${i} Tasks`),r&&(o===0?(r.textContent=`Welcome! Let's get ready 🌲`,r.style.color=`inherit`):o<50?(r.textContent=`Making progress! 🚶`,r.style.color=`inherit`):o<100?(r.textContent=`Almost cleared for camp! ⛺`,r.style.color=`inherit`):(r.textContent=`All clear! Ready to lead! 🏆`,r.style.color=`hsl(var(--success))`))}function le(){return`
    <div style="display: flex; flex-direction: column; gap: 28px;">
      <p style="color: hsl(var(--muted-foreground)); font-size: 15px; max-width: 700px; line-height: 1.5;">
        Our culture represents how we interact, make decisions, and guide product direction. Click on any card below to read a story highlighting how we apply these values in our day-to-day operations.
      </p>
      
      <div class="values-grid">
        ${d.map(e=>`
      <div class="glass-panel glass-panel-interactive value-card" data-value-id="${e.id}">
        <div class="value-card-icon">${e.icon}</div>
        <h3 class="value-card-title">${e.title}</h3>
        <p class="value-card-tagline">${e.tagline}</p>
        <p class="value-card-description">${e.description.substring(0,100)}...</p>
        <button class="value-card-action" aria-label="Learn more about ${e.title}">Read Story</button>
      </div>
    `).join(``)}
      </div>
    </div>
  `}function ue(){let e=document.querySelector(`.values-grid`);e&&e.querySelectorAll(`.value-card`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-value-id`),n=d.find(e=>e.id===t);n&&de(n)})})}function de(e){pt(`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <span style="font-size: 36px; padding: 12px; background: hsl(var(--primary) / 0.1); border-radius: var(--radius-md);">${e.icon}</span>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <h2 id="dialog-title" style="font-size: 24px; font-weight: 800; font-family: var(--font-heading);">${e.title}</h2>
          <span style="font-weight: 600; color: hsl(var(--primary)); font-size: 14px;">${e.tagline}</span>
        </div>
      </div>
      
      <p style="line-height: 1.6; font-size: 15px; color: hsl(var(--foreground)); margin-top: 8px;">
        ${e.description}
      </p>
      
      <div style="background: hsl(var(--secondary) / 0.5); border-left: 4px solid hsl(var(--primary)); padding: 16px; border-radius: 0 var(--radius-md) var(--radius-md) 0; margin-top: 8px;">
        <h4 style="font-weight: 700; margin-bottom: 6px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: hsl(var(--primary));">Value in Action:</h4>
        <p style="font-style: italic; font-size: 14.5px; line-height: 1.5;">"${e.example}"</p>
      </div>
    </div>
  `)}function fe(){return`
    <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
      <!-- Search & Filters Header -->
      <div class="org-chart-controls">
        <div class="search-input-wrapper">
          <svg class="search-icon-svg" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="org-search" placeholder="Search by name, role, or department..." aria-label="Search employee directory" />
        </div>
        
        <select class="filter-select" id="org-dept-filter" aria-label="Filter by department">
          <option value="all">All Departments</option>
          <option value="Executive">Executive</option>
          <option value="Engineering">Engineering</option>
          <option value="Product">Product</option>
          <option value="People Ops">People Ops</option>
        </select>
      </div>

      <!-- Tree container -->
      <div class="org-tree-container" id="org-tree-mount">
        <!-- Render tree levels dynamically -->
      </div>
    </div>
  `}function pe(){let e=document.getElementById(`org-tree-mount`),t=document.getElementById(`org-search`),n=document.getElementById(`org-dept-filter`);if(!e)return;let r=u.filter(e=>!e.reportsTo),i=u.filter(e=>e.reportsTo===`emp-1`),a=u.filter(e=>e.reportsTo===`emp-2`),o=u.filter(e=>e.reportsTo===`emp-3`),s=[...a,...o];function c(){e.innerHTML=`
      <!-- Level 0 (Executive) -->
      <div class="org-level">
        ${r.map(e=>l(e)).join(``)}
      </div>

      <!-- Level 1 (VPs / Ops) -->
      <div class="org-level" style="margin-top: 20px;">
        ${i.map(e=>l(e)).join(``)}
      </div>

      <!-- Level 2 (Contributors) -->
      <div class="org-level" style="margin-top: 20px;">
        ${s.map(e=>l(e)).join(``)}
      </div>
    `,e.querySelectorAll(`.org-node`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-emp-id`),n=u.find(e=>e.id===t);n&&me(n)})})}function l(e){let t=e.name.split(` `).map(e=>e.charAt(0)).join(``);return`
      <div class="org-node" data-emp-id="${e.id}" id="node-${e.id}">
        <div class="org-node-avatar" style="background: ${e.avatarGradient};">
          ${t}
        </div>
        <div class="org-node-details">
          <span class="org-node-name">${e.name}</span>
          <span class="org-node-role">${e.role}</span>
          <span class="org-node-dept">${e.department}</span>
        </div>
      </div>
    `}function d(){let e=t.value.toLowerCase().trim(),r=n.value;u.forEach(t=>{let n=document.getElementById(`node-${t.id}`);if(!n)return;let i=t.name.toLowerCase().includes(e),a=t.role.toLowerCase().includes(e),o=t.department.toLowerCase().includes(e),s=e===``||i||a||o,c=r===`all`||t.department===r;s&&c?(n.classList.remove(`dimmed`),n.classList.add(`highlighted`),e===``&&r===`all`&&n.classList.remove(`highlighted`)):(n.classList.remove(`highlighted`),n.classList.add(`dimmed`))})}c(),t.addEventListener(`input`,d),n.addEventListener(`change`,d)}function me(e){let t=e.name.split(` `).map(e=>e.charAt(0)).join(``);pt(`
    <div style="display: flex; flex-direction: column; gap: 20px;">
      <div style="display: flex; align-items: center; gap: 20px; border-bottom: 1px solid hsl(var(--border)); padding-bottom: 20px;">
        <div style="width: 72px; height: 72px; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 26px; box-shadow: var(--shadow-md); background: ${e.avatarGradient};">
          ${t}
        </div>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <h2 id="dialog-title" style="font-size: 22px; font-weight: 800; font-family: var(--font-heading); margin-bottom: 0;">${e.name}</h2>
          <span style="font-weight: 600; color: hsl(var(--primary)); font-size: 14px;">${e.role}</span>
          <span style="align-self: flex-start; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 8px; background: hsl(var(--secondary)); border-radius: 4px; color: hsl(var(--muted-foreground));">${e.department}</span>
        </div>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 12px; font-size: 14.5px;">
        <div>
          <span style="font-weight: 700; color: hsl(var(--muted-foreground)); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Bio</span>
          <p style="margin-top: 4px; line-height: 1.6;">${e.bio}</p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 8px;">
          <div>
            <span style="font-weight: 700; color: hsl(var(--muted-foreground)); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Email</span>
            <p style="margin-top: 4px; font-weight: 600;"><a href="mailto:${e.email}" style="color: hsl(var(--primary));">${e.email}</a></p>
          </div>
          <div>
            <span style="font-weight: 700; color: hsl(var(--muted-foreground)); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Phone</span>
            <p style="margin-top: 4px; font-weight: 600;">${e.phone}</p>
          </div>
        </div>

        <div style="background: hsl(var(--primary) / 0.05); border: 1px dashed hsl(var(--primary) / 0.2); border-radius: var(--radius-md); padding: 14px; margin-top: 8px; display: flex; align-items: flex-start; gap: 12px;">
          <span style="font-size: 20px; line-height: 1;">🎭</span>
          <div>
            <h4 style="font-weight: 700; font-size: 13px; color: hsl(var(--primary)); margin-bottom: 2px;">Fun Fact:</h4>
            <p style="font-size: 13.5px; font-style: italic; line-height: 1.4;">${e.funFact}</p>
          </div>
        </div>
      </div>
    </div>
  `)}function he(){return`
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
  `}function ge(){let e=document.getElementById(`tab-btn-sunday`),t=document.getElementById(`tab-btn-daily`),n=document.getElementById(`tab-btn-roles`),a=document.getElementById(`schedule-panel-mount`);if(!a)return;function o(){e.classList.add(`active`),t.classList.remove(`active`),n.classList.remove(`active`),a.innerHTML=`
      <div class="schedule-content-panel">
        <div style="background: hsl(var(--primary) / 0.05); border: 1px dashed hsl(var(--primary) / 0.2); border-radius: var(--radius-md); padding: 16px;">
          <h4 style="font-weight: 700; color: hsl(var(--primary)); margin-bottom: 6px;">Sunday Check-In Instructions:</h4>
          <p style="font-size: 14px; line-height: 1.5; color: hsl(var(--muted-foreground));">
            All staff are expected to report to camp by <strong>12:00 PM on Sunday</strong>. Sign in at the office in Class A Field uniform. You will be assigned a troop as their <strong>Troop Friend</strong>. Visit them daily to pass evaluations and act as their liaison!
          </p>
        </div>
        
        <div class="sunday-check-in-grid">
          ${r.map((e,t)=>`
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
    `}function s(){e.classList.remove(`active`),t.classList.add(`active`),n.classList.remove(`active`),a.innerHTML=`
      <div class="schedule-content-panel">
        <div style="background: hsl(var(--accent) / 0.08); border: 1px dashed hsl(var(--accent) / 0.3); border-radius: var(--radius-md); padding: 16px; font-size: 14.5px; line-height: 1.5;">
          💤 <strong>Siesta Policy:</strong> The daily gap between lunch and afternoon session (1:00 PM - 2:00 PM) is a designated quiet hour. Go to cabins, relax, rest, and reset your nervous system. Music must not be played outside.
        </div>
        
        <div class="daily-timeline">
          ${i.map((e,t)=>`
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
    `}function c(){e.classList.remove(`active`),t.classList.remove(`active`),n.classList.add(`active`),a.innerHTML=`
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
    `}e.addEventListener(`click`,o),t.addEventListener(`click`,s),n.addEventListener(`click`,c),o()}var _e=[{year:`1910`,event:`Scouting Arrives in Arizona`,description:`First Boy Scout troops are established in Prescott and Tombstone, pre-dating Arizona statehood, setting the foundation for regional youth education.`},{year:`1914`,event:`James M. Lawton Relocates`,description:`Harvard-educated CPA James M. Lawton arrives in Tucson, building the essential financial networks required to launch the local Scouting council.`},{year:`1921`,event:`Camp Founded & Subsidized`,description:`The newly chartered Rotary Club of Tucson provides $400 for the initial camp site near Palisades Ranger Station (~8,000 feet).`},{year:`1923`,event:`Tribe of Papago Established`,description:`Camp Director Harry Ogle creates a highly localized honor society based on conservation labor and peer leadership.`},{year:`1926`,event:`Strategic Relocation`,description:`The camp physically moves down the ridge to secure vital access to natural springs and emergency telephone lines.`},{year:`1933`,event:`Control Road Expansion`,description:`Federal prisoners utilize the camp as a staging ground to physically connect the mountain road infrastructure to the facility.`},{year:`1947`,event:`"Al's Well" Engineered`,description:`Hydrologist Al Christensen successfully taps three permanent springs, permanently solving decades of critical water scarcity.`},{year:`1948`,event:`Health Lodge Dedicated`,description:`Built and dedicated to Bobby Morrow, signaling a shift toward a permanent, medically secure campus.`},{year:`1951`,event:`Butler Hall & Nature Lodge`,description:`Expansion of the dining capacity and the formal establishment of ecological education under the guidance of Dr. R.B. Streets.`},{year:`1953`,event:`Papago Lodge 494 Chartered`,description:`Order of the Arrow is formalized; the original Tribe of Papago is gracefully retained strictly as a camp service alumni group.`},{year:`1955`,event:`Girl Scout Camp Built`,description:`Following years of sharing Camp Lawton, local Girl Scouts complete their own permanent Catalina facility funded by cookie sales.`},{year:`1956`,event:`The Disneyland Excursion`,description:`Director Cliff Waetje rewards his unpaid, dedicated summer staff by driving them to California in lieu of seasonal wages.`},{year:`1957`,event:`Ranger Cabin Constructed`,description:`A massive volunteer network establishes permanent, year-round structural housing for professional caretakers.`},{year:`1958`,event:`Alpine Pool Installed`,description:`A massive concrete basin is engineered at 7,900 feet, initiating decades of aquatic instruction and the "Llama Lunge" tradition.`},{year:`1962`,event:`First BSA Accreditation`,description:`Camp Lawton is officially certified by the National Camping School, validating its rigorous safety and pedagogical standards.`},{year:`1986`,event:`Tohono O'odham Name`,description:`The local Native American tribe changes its name, but requests the camp retain the "Papago" moniker as a mark of historic respect.`},{year:`2003`,event:`The Devastating Aspen Fire`,description:`An 84,750-acre wildfire stops within 100 yards of camp; the resulting threat forces a massive transition from canvas tents to log cabins.`},{year:`2010`,event:`Structural Snow Collapse`,description:`Extreme late-season winter weather destroys the historic 1957 Ranger Cabin roof, requiring a massive volunteer rebuild.`},{year:`2019`,event:`Co-ed Scouting Integration`,description:`Camp Lawton successfully launches inclusive resident programs for female youth and leadership.`},{year:`2020`,event:`USFS Master Development Plan`,description:`The Coronado National Forest authorizes comprehensive footprint modernization, including new prefabricated kitchen facilities.`},{year:`2021`,event:`Centennial Celebration`,description:`The camp celebrates 100 years of operation, marked by the publication of a comprehensive historical text by the Tucson Westerners.`},{year:`2025`,event:`Fiscal Restructuring`,description:`The Catalina Council proactively reallocates $389,000 from its endowment to ensure operational continuity amidst economic shifts.`},{year:`2026`,event:`Independence & Program Pivot`,description:`The Council boldly rejects a statewide merger; Director MaryLou Chopelas successfully compresses the season into efficient 3-day weekend tracks.`}];function ve(){return`
    <div class="timeline-container" style="animation: tabFadeIn 0.4s ease;">
      <div class="timeline-header">
        <img src="/camp-logo.png" alt="Camp Lawton Logo" class="timeline-logo">
        <h2 style="color: hsl(var(--primary)); font-family: var(--font-heading);">A Century on the Mountain</h2>
        <p style="color: hsl(var(--muted-foreground)); max-width: 600px; margin: 0 auto;">The institutional, environmental, and cultural evolution of Camp Lawton (1921–2026).</p>
      </div>
      
      <div class="timeline-track-wrapper">
        <div class="timeline-center-line"></div>
        ${_e.map((e,t)=>`
      <div class="timeline-item ${t%2==0?`left`:`right`} hidden-timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content glass-panel">
          <div class="timeline-year">${e.year}</div>
          <h3 class="timeline-title">${e.event}</h3>
          <p class="timeline-desc">${e.description}</p>
        </div>
      </div>
    `).join(``)}
      </div>
    </div>
  `}function ye(){let e=new IntersectionObserver(t=>{t.forEach(t=>{t.isIntersecting&&(t.target.classList.add(`show-timeline-item`),e.unobserve(t.target))})},{threshold:.1,rootMargin:`0px 0px -50px 0px`});document.querySelectorAll(`.hidden-timeline-item`).forEach(t=>e.observe(t))}var be=t({activeCampLawtonTab:()=>P,initCampLawton:()=>I,renderCampLawton:()=>F,setCampLawtonTab:()=>xe}),P=`values`;function xe(e){P=e}function F(){return`
    <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
      <!-- Tab Selector -->
      <div class="schedule-tabs-container">
        <button class="schedule-tab-btn ${P===`values`?`active`:``}" data-tab="values">🌲 Core Values</button>
        <button class="schedule-tab-btn ${P===`orgchart`?`active`:``}" data-tab="orgchart">🗺️ Chain of Command</button>
        <button class="schedule-tab-btn ${P===`schedule`?`active`:``}" data-tab="schedule">📅 Daily Schedule</button>
        <button class="schedule-tab-btn ${P===`history`?`active`:``}" data-tab="history">📜 History & Timeline</button>
      </div>

      <!-- Mount point for sub tabs -->
      <div id="camplawton-subtab-mount">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `}function I(){document.querySelectorAll(`[data-tab]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-tab`);if(t){P=t;let e=document.getElementById(`view-mount-point`);e&&(e.innerHTML=F(),I())}})});let e=document.getElementById(`camplawton-subtab-mount`);e&&(window.dispatchEvent(new CustomEvent(`before-view-change`)),P===`values`?(e.innerHTML=le(),ue()):P===`orgchart`?(e.innerHTML=fe(),pe()):P===`schedule`?(e.innerHTML=he(),ge()):P===`history`&&(e.innerHTML=ve(),ye()))}function Se(){return`
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
  `}function Ce(){let e=document.getElementById(`training-tab-scouting`),t=document.getElementById(`training-tab-culture`),n=document.getElementById(`training-tab-service`),r=document.getElementById(`training-tab-program`),i=document.getElementById(`training-panel-mount`);if(!i)return;let a=0,o=[{title:`1. Explain (Talk about it)`,desc:`Tell them what you are going to do and why it is important. Describe the steps, use analogies, and encourage questions before touching any ropes.`,tip:`💡 <strong>Camp Tip:</strong> Tell the scouts: 'Today we will learn the Square Knot, which is used to join two ropes of equal width. Remember the rule: Left over right, right over left.'`,badge:`🗣️`},{title:`2. Demonstrate (Show it)`,desc:`Perform the skill yourself slowly and clearly. Talk through each action as you do it. Make sure they have a clear line of sight from your perspective.`,tip:`💡 <strong>Camp Tip:</strong> Tie the knot in front of them slowly. Say: 'I take the left rope, put it over the right one, twist it under. Now I take the right rope, put it over the left, twist it under, and pull.'`,badge:`👀`},{title:`3. Guide (Practice together)`,desc:`Hand the materials to the learner. Let them try the skill while you guide them verbally. Offer encouraging corrections. Do not tie the knot for them!`,tip:`💡 <strong>Camp Tip:</strong> Hand them the ropes. Let them try. If they get stuck, ask questions: 'Which side did you put over first? Yes, left over right. Now what is the next part?'`,badge:`🤝`},{title:`4. Enable (Let them lead)`,desc:`Step back and let them do it independently. They have mastered the skill when they can do it without your guidance and can explain it to someone else.`,tip:`💡 <strong>Camp Tip:</strong> Ask the scout to tie three square knots successfully. Then ask them to teach it to a new scout. Once they can teach it, they are fully enabled!`,badge:`🎓`}];function c(){let e=document.getElementById(`edge-step-content`),t=document.getElementById(`edge-prev-btn`),n=document.getElementById(`edge-next-btn`),r=document.querySelectorAll(`.edge-progress-step`);if(!e)return;let i=o[a];e.innerHTML=`
      <div style="display: flex; gap: 16px; align-items: flex-start; animation: tabFadeIn 0.3s ease both;">
        <div style="font-size: 48px; background: hsl(var(--primary) / 0.1); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          ${i.badge}
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <h4 style="font-size: 18px; color: hsl(var(--primary)); font-family: var(--font-heading); margin: 0;">${i.title}</h4>
          <p style="font-size: 13.5px; line-height: 1.5; color: hsl(var(--foreground)); margin: 0;">${i.desc}</p>
          <div style="background: hsl(var(--card)); border: 1px solid hsl(var(--border)); padding: 10px 14px; border-radius: var(--radius-sm); font-size: 13px; line-height: 1.4; margin-top: 4px; color: hsl(var(--muted-foreground)); font-weight: 500;">
            ${i.tip}
          </div>
        </div>
      </div>
    `,r.forEach((e,t)=>{t<=a?e.style.background=`hsl(var(--accent))`:e.style.background=`hsl(var(--muted-foreground) / 0.2)`}),t.disabled=a===0,a===o.length-1?n.innerHTML=`Restart Simulator 🔄`:n.innerHTML=`Next step (${o[a+1].title.split(` `)[1]}) ➜`}function l(){let e=document.getElementById(`edge-prev-btn`),t=document.getElementById(`edge-next-btn`);e&&t&&(e.addEventListener(`click`,()=>{a>0&&(a--,c())}),t.addEventListener(`click`,()=>{a<o.length-1?(a++,c()):(a=0,c())}))}function u(){i.querySelectorAll(`.flip-card`).forEach(e=>{e.addEventListener(`click`,()=>{e.classList.toggle(`flipped`)})})}function d(){e.classList.add(`active`),t.classList.remove(`active`),n.classList.remove(`active`),r.classList.remove(`active`),i.innerHTML=`
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

        <!-- Interactive EDGE Method step-through -->
        <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px;">
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
    `,u(),c(),l()}function f(){e.classList.remove(`active`),t.classList.remove(`active`),n.classList.add(`active`),r.classList.remove(`active`),i.innerHTML=`
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
    `,u()}function p(){e.classList.remove(`active`),t.classList.add(`active`),n.classList.remove(`active`),r.classList.remove(`active`);let a=s.rules?s.rules.map((e,t)=>`
      <div style="background: hsl(var(--card)); border: 1px solid hsl(var(--border)); padding: 14px; border-radius: var(--radius-sm); border-left: 4px solid hsl(var(--danger));">
        <h4 style="font-weight: 700; margin-bottom: 6px;">${e.title}</h4>
        <p style="font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.4;">${e.content}</p>
      </div>
    `).join(``):``,o=s.stressManagement.map((e,t)=>`
      <div style="background: hsl(var(--card)); border: 1px solid hsl(var(--border)); padding: 14px; border-radius: var(--radius-sm); border-left: 4px solid hsl(var(--accent));">
        <h4 style="font-weight: 700; margin-bottom: 6px;">${e.step}</h4>
        <p style="font-size: 13px; color: hsl(var(--muted-foreground)); line-height: 1.4;">${e.description}</p>
      </div>
    `).join(``),c=s.glossary.map((e,t)=>`
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
            "${s.mission.statement}"
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
                ${c}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `}function m(){e.classList.remove(`active`),t.classList.remove(`active`),n.classList.remove(`active`),r.classList.add(`active`),i.innerHTML=`
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
    `}e.addEventListener(`click`,d),t.addEventListener(`click`,p),n.addEventListener(`click`,f),r.addEventListener(`click`,m),d()}function L(e=880,t=.15){try{let n=new(window.AudioContext||window.webkitAudioContext),r=n.createOscillator(),i=n.createGain();r.type=`sine`,r.frequency.setValueAtTime(e,n.currentTime),i.gain.setValueAtTime(.04,n.currentTime),i.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+t),r.connect(i),i.connect(n.destination),r.start(),r.stop(n.currentTime+t)}catch(e){console.warn(`AudioContext block`,e)}}function we(e=.25){try{let t=new(window.AudioContext||window.webkitAudioContext),n=t.sampleRate*e,r=t.createBuffer(1,n,t.sampleRate),i=r.getChannelData(0);for(let e=0;e<n;e++)i[e]=Math.random()*2-1;let a=t.createBufferSource();a.buffer=r;let o=t.createBiquadFilter();o.type=`bandpass`,o.frequency.value=1e3;let s=t.createGain();s.gain.setValueAtTime(.02,t.currentTime),s.gain.exponentialRampToValueAtTime(1e-4,t.currentTime+e),a.connect(o),o.connect(s),s.connect(t.destination),a.start()}catch(e){console.warn(`AudioContext block`,e)}}function Te(){return`
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
  `}function Ee(){let e=document.getElementById(`safety-tab-flowcharts`),t=document.getElementById(`safety-tab-radio`),n=document.getElementById(`safety-tab-guidelines`),r=document.getElementById(`safety-tab-legal`),i=document.getElementById(`safety-panel-mount`);if(!i)return;let a=[];function o(){a.forEach(e=>clearTimeout(e)),a=[];let e=document.getElementById(`radio-led`),t=document.getElementById(`radio-screen-channel`),n=document.getElementById(`radio-screen-status`);e&&(e.style.background=`#10b981`,e.style.boxShadow=`0 0 6px #10b981`),t&&(t.textContent=`CH 1: ADMIN`),n&&(n.textContent=`IDLE READY`)}function s(){e.classList.add(`active`),t.classList.remove(`active`),n.classList.remove(`active`),r.classList.remove(`active`),o(),i.innerHTML=`
      <div class="schedule-content-panel" style="animation: tabFadeIn 0.3s ease both;">
        <p style="color: hsl(var(--muted-foreground)); font-size: 15px; max-width: 750px; line-height: 1.5; margin-bottom: 20px;">
          As camp staff, protecting youth and ensuring property safety is your primary duty. Review these structured, step-by-step procedures for emergencies, severe weather, and mandatory Arizona reporting laws.
        </p>

        <div class="protocol-accordion">
          <!-- Missing Person (Code Blue) -->
          <div class="protocol-item">
            <button class="protocol-header" aria-expanded="false" data-protocol-idx="0">
              <span class="protocol-title"><span>🚨</span> Code Blue — Missing Person / Lost Camper</span>
              <span class="protocol-arrow-icon">▼</span>
            </button>
            <div class="protocol-body">
              <div class="protocol-call-banner">
                <span class="protocol-call-text">⚠️ MISSING PERSON: INPUT DETAILS BELOW</span>
                <span style="font-size: 13px; opacity: 0.9;">Do NOT self-assign a search. Submit details to generate radio script.</span>
              </div>
              <div style="background: hsl(var(--card)); padding: 16px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); margin-bottom: 16px;">
                <form id="code-blue-form" style="display: flex; flex-direction: column; gap: 12px;">
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <label style="font-size: 12px; font-weight: 700; color: hsl(var(--muted-foreground));">First Name</label>
                    <input type="text" id="cb-name" required placeholder="e.g. John" style="padding: 8px; border: 1px solid hsl(var(--border)); border-radius: 4px; background: var(--glass-bg); color: hsl(var(--foreground));" />
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <label style="font-size: 12px; font-weight: 700; color: hsl(var(--muted-foreground));">Troop/Unit Number</label>
                    <input type="text" id="cb-unit" required placeholder="e.g. Troop 404" style="padding: 8px; border: 1px solid hsl(var(--border)); border-radius: 4px; background: var(--glass-bg); color: hsl(var(--foreground));" />
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <label style="font-size: 12px; font-weight: 700; color: hsl(var(--muted-foreground));">Physical Description (Clothing, Hat, etc.)</label>
                    <input type="text" id="cb-desc" required placeholder="e.g. Red class B shirt, blue shorts, BSA hat" style="padding: 8px; border: 1px solid hsl(var(--border)); border-radius: 4px; background: var(--glass-bg); color: hsl(var(--foreground));" />
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <label style="font-size: 12px; font-weight: 700; color: hsl(var(--muted-foreground));">Last Known Location & Time</label>
                    <input type="text" id="cb-loc" required placeholder="e.g. Archery range, 10 minutes ago" style="padding: 8px; border: 1px solid hsl(var(--border)); border-radius: 4px; background: var(--glass-bg); color: hsl(var(--foreground));" />
                  </div>
                  <button type="submit" class="primary-btn" style="background: var(--safety-red); color: white; border: none; padding: 12px; border-radius: 6px; font-weight: 700; cursor: pointer; margin-top: 8px;">
                    GENERATE RADIO PROTOCOL
                  </button>
                </form>
                <div id="code-blue-result" style="display: none; margin-top: 16px; padding: 16px; border-left: 4px solid var(--safety-red); background: rgba(200, 35, 44, 0.1);">
                  <h4 style="margin: 0 0 8px 0; color: var(--safety-red); font-size: 16px;">🚨 RADIO SCRIPT GENERATED</h4>
                  <p style="margin: 0 0 12px 0; font-family: monospace; font-size: 14px; background: rgba(0,0,0,0.2); padding: 12px; border-radius: 4px;" id="cb-script-text"></p>
                  <p style="margin: 0; font-size: 13px; font-weight: 700; color: var(--safety-red);">⚠️ DO NOT LEAVE YOUR CURRENT AREA TO SEARCH. STAND BY FOR CAMP DIRECTOR ORDERS.</p>
                  <button id="cb-reset-btn" style="margin-top: 12px; background: transparent; border: 1px solid hsl(var(--border)); color: hsl(var(--foreground)); padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">Reset</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Bear Sighting (Code Brown) -->
          <div class="protocol-item">
            <button class="protocol-header" aria-expanded="false" data-protocol-idx="1">
              <span class="protocol-title"><span>🐻</span> Code Brown — Bear Sighting & Encounter</span>
              <span class="protocol-arrow-icon">▼</span>
            </button>
            <div class="protocol-body">
              <div class="protocol-call-banner">
                <span class="protocol-call-text">⚠️ REPORT SIGHTING AND MAINTAIN SAFEST DISTANCE</span>
                <a href="tel:1-555-LAWTON-CD" class="protocol-call-btn">📞 Radio Camp Ranger</a>
              </div>
              <div style="background: rgba(200, 35, 44, 0.1); border: 2px solid var(--safety-red); padding: 16px; border-radius: var(--radius-sm); margin-bottom: 16px;">
                <h4 style="margin: 0 0 8px 0; color: var(--safety-red); font-size: 16px; font-weight: 800;">CRITICAL INSTRUCTION:</h4>
                <p style="margin: 0; font-size: 14px; font-weight: 700; color: hsl(var(--foreground));">DO NOT APPROACH. Scare the bear away by yelling loudly and throwing rocks/sticks. Immediately report a CODE BROWN to the Camp Director via radio.</p>
              </div>
              <ol class="protocol-steps">
                <li><strong>Remain Calm:</strong> Retreat slowly and quietly, keeping your eyes on the bear (but avoid direct eye contact). Do NOT run.</li>
                <li><strong>Establish Visual Check:</strong> Maintain a safe visual check from a distance (adult staff only). Escort all scouts and CITs to a secure, indoor area immediately.</li>
              </ol>
            </div>
          </div>

          <!-- Lightning Safety (30/30 Rule) -->
          <div class="protocol-item">
            <button class="protocol-header" aria-expanded="false" data-protocol-idx="2">
              <span class="protocol-title"><span>⚡</span> Lightning Safety — Severe Weather</span>
              <span class="protocol-arrow-icon">▼</span>
            </button>
            <div class="protocol-body">
              <div class="protocol-call-banner">
                <span class="protocol-call-text">⚠️ SUSPEND OUTDOOR ACTIVITIES IMMEDIATELY</span>
                <button class="protocol-call-btn" onclick="alert('Broadcasting weather alert on radio channel 1...')">📻 Radio Weather Warning</button>
              </div>
              
              <div style="background: hsl(var(--card)); padding: 16px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); margin-bottom: 16px; text-align: center;">
                <h4 style="margin: 0 0 12px 0; font-size: 16px;">30/30 Rule Lightning Calculator</h4>
                <div style="display: flex; gap: 12px; justify-content: center; margin-bottom: 16px;">
                  <button id="btn-flash" style="flex: 1; padding: 16px; font-size: 18px; font-weight: 800; border-radius: 8px; border: none; background: #eab308; color: #000; cursor: pointer; box-shadow: 0 4px 0 #ca8a04;">
                    ⚡ SAW FLASH
                  </button>
                  <button id="btn-thunder" disabled style="flex: 1; padding: 16px; font-size: 18px; font-weight: 800; border-radius: 8px; border: none; background: hsl(var(--muted)); color: hsl(var(--muted-foreground)); cursor: not-allowed; box-shadow: 0 4px 0 hsl(var(--border));">
                    🔊 HEARD THUNDER
                  </button>
                </div>
                <div id="lightning-result" style="padding: 12px; border-radius: 8px; font-weight: 700; font-size: 15px; display: none;"></div>
                <div id="lightning-timer" style="font-family: monospace; font-size: 24px; font-weight: 800; color: hsl(var(--muted-foreground)); display: none;">0.0s</div>
              </div>

              <ol class="protocol-steps">
                <li><strong>Monitor Flash-to-Bang:</strong> If you see a lightning flash and hear thunder within 30 seconds (indicating lightning is within 6 miles), suspend all outdoor programs immediately.</li>
                <li><strong>Seek Safe Shelter:</strong> Immediately escort all scouts, leaders, and staff to the Dining Hall. Open-sided pavilions, canvas dining flies, and canvas tents offer ZERO lightning protection.</li>
                <li><strong>Wait It Out:</strong> Wait at least 30 minutes after the last visible lightning flash or sound of thunder before allowing anyone to leave the shelter or resuming programs.</li>
              </ol>
            </div>
          </div>

          <!-- Fire Evacuation -->
          <div class="protocol-item">
            <button class="protocol-header" aria-expanded="false" data-protocol-idx="3">
              <span class="protocol-title"><span>🔥</span> Fire Evacuation Protocol</span>
              <span class="protocol-arrow-icon">▼</span>
            </button>
            <div class="protocol-body">
              <div class="protocol-call-banner">
                <span class="protocol-call-text">⚠️ REPORT SMOKE/FIRE AND ALARM SITE</span>
                <a href="tel:911" class="protocol-call-btn">📞 Dial 911 Immediately</a>
              </div>
              <ol class="protocol-steps">
                <li><strong>Report Fire:</strong> Call 911 or radio the Camp Director/Camp Office the moment you spot an out-of-control fire or heavy smoke. State the exact location.</li>
                <li><strong>Evacuate Safely:</strong> Drop all program operations. Assist all scouts, leaders, and visitors to evacuate the area immediately. Escort everyone to the Parade Grounds.</li>
                <li><strong>Prioritize Youth:</strong> Leave all personal gear, luggage, and camp equipment behind. The safety of human lives is our absolute and first priority.</li>
              </ol>
            </div>
          </div>

          <!-- Bell Alarm (Emergency Evacuation Drill) -->
          <div class="protocol-item">
            <button class="protocol-header" aria-expanded="false" data-protocol-idx="4">
              <span class="protocol-title"><span>🔔</span> Bell Alarm — Evacuation & Headcount</span>
              <span class="protocol-arrow-icon">▼</span>
            </button>
            <div class="protocol-body">
              <div class="protocol-call-banner">
                <span class="protocol-call-text">⚠️ ESCORT ALL USERS TO PARADE GROUNDS ON CONTINUOUS BELL</span>
                <button class="protocol-call-btn" onclick="alert('Drill coordinates sent to Staff Area.')">📻 Radio HQ Headcount</button>
              </div>
              <ol class="protocol-steps">
                <li><strong>Secure Immediate Hazards:</strong> If the Dining Hall bell rings continuously, drop all activities. Quickly secure critical hazards in your area (e.g. put away archery bows, turn off fire pits).</li>
                <li><strong>Escort Scouts:</strong> Immediately escort all scouts, leaders, and visitors with you to the Parade Grounds. Do NOT let scouts return to their campsites to fetch gear.</li>
                <li><strong>Take Strict Headcount:</strong> Group scouts by troop unit. Take a strict headcount immediately and report the results to the Program Director or Camp Director at the center flagpole.</li>
              </ol>
            </div>
          </div>

          <!-- Active Shooter -->
          <div class="protocol-item">
            <button class="protocol-header" aria-expanded="false" data-protocol-idx="5">
              <span class="protocol-title"><span>🔫</span> Armed Intruder / Active Shooter</span>
              <span class="protocol-arrow-icon">▼</span>
            </button>
            <div class="protocol-body">
              <div class="protocol-call-banner">
                <span class="protocol-call-text">⚠️ DIAL 911 IMMEDIATELY — DO NOT CONFRONT INTRUDER</span>
                <a href="tel:911" class="protocol-call-btn">📞 Dial 911 (Police)</a>
              </div>
              <ol class="protocol-steps">
                <li><strong>Flee/Run:</strong> If a safe escape path is clear, immediately flee the area. Lead scouts into the surrounding woods, away from the sounds of gunfire, and seek safety off-property.</li>
                <li><strong>Hide/Barricade:</strong> If escape is impossible, lock and barricade yourself and scouts inside the nearest cabin or solid building. Stay out of sight, silence all phones, turn off lights, and lie flat on the floor.</li>
                <li><strong>Fight:</strong> As a last resort, and only when your life is in imminent danger, act with maximum physical aggression to disarm and disrupt the shooter. Use any heavy tool or object as a weapon.</li>
              </ol>
            </div>
          </div>

          <!-- Mandatory Abuse Reporting (ARS 13-3620) -->
          <div class="protocol-item">
            <button class="protocol-header" aria-expanded="false" data-protocol-idx="6">
              <span class="protocol-title"><span>🛡️</span> Mandatory Abuse Reporting (ARS 13-3620)</span>
              <span class="protocol-arrow-icon">▼</span>
            </button>
            <div class="protocol-body">
              <div class="protocol-call-banner">
                <span class="protocol-call-text">⚠️ MANDATED REPORTING LAWS REQUIRE IMMEDIATE REPORTING</span>
                <a href="tel:1-888-767-2445" class="protocol-call-btn" style="background: var(--safety-red);">📞 Call Arizona DCS (1-888-SOS-CHILD)</a>
              </div>
              <ol class="protocol-steps">
                <li><strong>Identify Suspicion:</strong> If you have a good-faith suspicion of child abuse, sexual abuse, physical abuse, or neglect of a camper or CIT, you are legally required to report it.</li>
                <li><strong>Personal Legal Duty:</strong> As a summer camp staff member in Arizona, you are a Mandated Reporter under ARS 13-3620. This is a personal legal obligation.</li>
                <li><strong>No Delegation:</strong> You must report directly to the Arizona Department of Child Safety (1-888-SOS-CHILD) or local law enforcement (911). You CANNOT delegate this report to the Camp Director, Area Directors, or other staff.</li>
                <li><strong>Report Internally:</strong> Once the legal report has been made to DCS/911, notify the Camp Director immediately so the Council Scout Executive can be alerted and Scouts First Helpline contacted (1-844-SCOUTS1).</li>
              </ol>
            </div>
          </div>
        </div>

        <!-- Heat Stress Matrix -->
        <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px; margin-top: 24px;">
          <h3 style="color: hsl(var(--primary)); font-family: var(--font-heading); font-size: 22px;">☀️ Heat Stress Diagnostics</h3>
          <p style="font-size: 14.5px; color: hsl(var(--muted-foreground));">Review symptoms to identify heat illnesses on dry mountain trails.</p>
          
          <div class="heat-matrix">
            <div class="heat-card exhaustion">
              <h4 style="color: hsl(var(--warning)); font-weight: 800; font-family: var(--font-heading); display: flex; align-items: center; gap: 8px; font-size: 18px;">
                <span>⚠️</span> Heat Exhaustion
              </h4>
              <div style="font-size: 13.5px; line-height: 1.5;">
                <strong>Symptoms:</strong> Heavy sweating, pale or clammy skin, nausea or vomiting, dizziness, weakness, headache, muscle cramps.
                <br><br>
                <strong>Treatment:</strong> Move to shade immediately. Cool down with wet towels, remove excess clothing, sip cool water slowly. Do NOT give salt tablets.
              </div>
            </div>
            
            <div class="heat-card stroke">
              <h4 style="color: var(--safety-red); font-weight: 800; font-family: var(--font-heading); display: flex; align-items: center; gap: 8px; font-size: 18px;">
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
    `,i.querySelectorAll(`.protocol-header`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.closest(`.protocol-item`),n=t.classList.contains(`active`);i.querySelectorAll(`.protocol-item`).forEach(e=>{e.classList.remove(`active`),e.querySelector(`.protocol-header`).setAttribute(`aria-expanded`,`false`)}),n||(t.classList.add(`active`),e.setAttribute(`aria-expanded`,`true`))})});let a=document.getElementById(`code-blue-form`);a&&(a.addEventListener(`submit`,e=>{e.preventDefault();let t=document.getElementById(`cb-name`).value,n=document.getElementById(`cb-unit`).value,r=document.getElementById(`cb-desc`).value,i=document.getElementById(`cb-loc`).value;document.getElementById(`code-blue-result`).style.display=`block`,document.getElementById(`cb-script-text`).innerText=`"Camp Director, this is [Your Area]. Code Blue. ${t} from ${n}, last seen at ${i}. Wearing ${r}. Standing by for instructions."`,a.style.display=`none`}),document.getElementById(`cb-reset-btn`)?.addEventListener(`click`,()=>{a.reset(),a.style.display=`flex`,document.getElementById(`code-blue-result`).style.display=`none`}));let s=document.getElementById(`btn-flash`),c=document.getElementById(`btn-thunder`),l=document.getElementById(`lightning-timer`),u=document.getElementById(`lightning-result`),d=0,f=null;s&&c&&(s.addEventListener(`click`,()=>{d=Date.now(),s.disabled=!0,s.style.opacity=`0.5`,c.disabled=!1,c.style.background=`#3b82f6`,c.style.color=`#fff`,u.style.display=`none`,l.style.display=`block`,clearInterval(f),f=setInterval(()=>{l.innerText=((Date.now()-d)/1e3).toFixed(1)+`s`},100)}),c.addEventListener(`click`,()=>{clearInterval(f);let e=(Date.now()-d)/1e3;l.innerText=e.toFixed(1)+`s`,c.disabled=!0,c.style.background=`hsl(var(--muted))`,c.style.color=`hsl(var(--muted-foreground))`,s.disabled=!1,s.style.opacity=`1`,u.style.display=`block`,e<=30?(u.style.background=`rgba(200, 35, 44, 0.1)`,u.style.border=`2px solid var(--safety-red)`,u.style.color=`var(--safety-red)`,u.innerHTML=`⚠️ DANGER: Storm is ~${(e/5).toFixed(1)} miles away.<br>SUSPEND ACTIVITIES AND EVACUATE TO DINING HALL IMMEDIATELY!`):(u.style.background=`rgba(16, 185, 129, 0.1)`,u.style.border=`2px solid #10b981`,u.style.color=`#10b981`,u.innerHTML=`✅ SAFE: Storm is ~${(e/5).toFixed(1)} miles away.<br>Continue to monitor.`)}))}function l(){e.classList.remove(`active`),t.classList.add(`active`),n.classList.remove(`active`),r.classList.remove(`active`),o(),i.innerHTML=`
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
    `,u()}function u(){let e=document.getElementById(`radio-ptt-btn`),t=document.getElementById(`radio-led`),n=document.getElementById(`radio-screen-channel`),r=document.getElementById(`radio-screen-status`),i=document.getElementById(`radio-clear-log`),s=document.getElementById(`radio-transcript-mount`),c=!1;if(e){let i=e=>{e.preventDefault(),!c&&(c=!0,o(),L(980,.1),t&&(t.style.background=`#ef4444`,t.style.boxShadow=`0 0 8px #ef4444`),r&&(r.textContent=`TRANSMITTING`),n&&(n.textContent=`CH 1: TX TEST`),s.innerHTML=`<div style="color: hsl(var(--primary)); font-weight: bold;">[TX TEST] Mic open. Release button to end transmission.</div>`)},a=()=>{c&&(c=!1,we(.15),t&&(t.style.background=`#10b981`,t.style.boxShadow=`0 0 6px #10b981`),r&&(r.textContent=`IDLE READY`),n&&(n.textContent=`CH 1: ADMIN`),s.innerHTML+=`<div style="color: hsl(var(--muted-foreground)); font-style: italic;">Transmission ended. [STATIC]</div>`,s.scrollTop=s.scrollHeight)};e.addEventListener(`mousedown`,i),e.addEventListener(`mouseup`,a),e.addEventListener(`mouseleave`,a),e.addEventListener(`touchstart`,i),e.addEventListener(`touchend`,a)}i&&s&&i.addEventListener(`click`,()=>{o(),s.innerHTML=`<div style="color: hsl(var(--muted-foreground)); font-style: italic;">Logs cleared. Select a scenario.</div>`}),document.querySelectorAll(`.radio-scenario-btn`).forEach(e=>{e.addEventListener(`click`,()=>{u(e.getAttribute(`data-scenario`))})});let l={routine:[{type:`beep`},{type:`tx`,sender:`Scoutcraft`,text:`Scoutcraft to HQ. Over.`},{type:`static`},{type:`rx`,sender:`HQ`,text:`HQ, go ahead. Over.`},{type:`beep`},{type:`tx`,sender:`Scoutcraft`,text:`Scoutcraft program area is locked and secure. Instructors returning to Staff Hill. Out.`},{type:`static`},{type:`rx`,sender:`HQ`,text:`HQ Copy. Scoutcraft clear. Out.`}],wildlife:[{type:`beep`},{type:`tx`,sender:`Commissioner`,text:`Commissioner to Ranger. Over.`},{type:`static`},{type:`rx`,sender:`Ranger`,text:`Ranger, go ahead. Over.`},{type:`beep`},{type:`tx`,sender:`Commissioner`,text:`Report a Code Brown near the youth shower house, moving east. Over.`},{type:`static`},{type:`rx`,sender:`Ranger`,text:`Ranger Copy. Code Brown logged. Contacting Camp Director. Out.`}],medical:[{type:`beep`},{type:`tx`,sender:`Nature`,text:`Nature to Medic. Urgent. Over.`},{type:`static`},{type:`rx`,sender:`Medic`,text:`Medic, go ahead. Over.`},{type:`beep`},{type:`tx`,sender:`Nature`,text:`Code Blue at Nature Trail entrance. Scout fell. Conscious, but possible sprain. Over.`},{type:`static`},{type:`rx`,sender:`Medic`,text:`Medic copy. Responding now. All stations clear air for Code Blue. Out.`}],illegal:[{type:`beep`},{type:`tx`,sender:`Nature`,text:`Hey Dave, is Jim there? Can you tell him to bring my sunglasses to Nature Lodge?`},{type:`violation`,title:`⚠️ FCC PROTOCOL VIOLATION DETECTED`,text:`Reason: Ties up official emergency channel, uses real names, and contains non-official business. Keep the air clean!`}]};function u(e){if(o(),!s)return;s.innerHTML=`<div style="color: hsl(var(--primary)); font-weight: 700; font-style: italic;">Starting Scenario: ${e.toUpperCase()}...</div>`;let i=l[e],c=300;i.forEach((e,o)=>{let l=setTimeout(()=>{s&&(e.type===`beep`?(L(880,.12),t&&(t.style.background=`#ef4444`,t.style.boxShadow=`0 0 8px #ef4444`),r&&(r.textContent=`TRANSMITTING`),n&&(n.textContent=`CH 1: TX`)):e.type===`static`?(we(.18),t&&(t.style.background=`#f59e0b`,t.style.boxShadow=`0 0 8px #f59e0b`),r&&(r.textContent=`RECEIVING`),n&&(n.textContent=`CH 1: RX`)):e.type===`tx`?s.innerHTML+=`
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
            `,L(440,.4)),s.scrollTop=s.scrollHeight,o===i.length-1&&e.type!==`violation`&&setTimeout(()=>{t&&(t.style.background=`#10b981`,t.style.boxShadow=`0 0 6px #10b981`),r&&(r.textContent=`IDLE READY`),n&&(n.textContent=`CH 1: ADMIN`)},800))},c);a.push(l),e.type===`beep`||e.type===`static`?c+=250:c+=1400})}}function d(){e.classList.remove(`active`),t.classList.remove(`active`),n.classList.add(`active`),r.classList.remove(`active`),o(),i.innerHTML=`
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
          ${c.legalPolicies.map((e,t)=>`
      <div style="background: hsl(var(--card)); border: 1px solid hsl(var(--border)); padding: 18px; border-radius: var(--radius-sm); border-left: 4px solid hsl(var(--primary));">
        <h4 style="font-weight: 700; margin-bottom: 8px;">${e.title}</h4>
        <p style="font-size: 13.5px; color: hsl(var(--muted-foreground)); line-height: 1.5;">${e.content}</p>
      </div>
    `).join(``)}
        </div>
      </div>
    `}e.addEventListener(`click`,s),t.addEventListener(`click`,l),n.addEventListener(`click`,d),r.addEventListener(`click`,f);let p=()=>{o(),window.removeEventListener(`before-view-change`,p)};window.addEventListener(`before-view-change`,p),s()}var R=[{id:`zone-parade`,name:`Parade Grounds (Assembly flags)`,type:`emergency`,description:`Central grassy assembly grounds. The main assembly point for all emergency alarms and daily morning/evening flag ceremonies.`,note:`🛎️ If emergency bell rings, report here immediately.`},{id:`zone-dining`,name:`Dining Hall (Primary Lightning Shelter)`,type:`emergency`,description:`Primary dining hall and kitchen. Main indoor space, serves as the designated shelter for severe storms, lightning, and microbursts.`,note:`⚡ Primary lightning shelter. Tents offer zero protection.`},{id:`zone-scoutcraft`,name:`Scoutcraft Area`,type:`program`,description:`Under Area Director Jim Tarleton. Teaching pioneering, wilderness survival, camping, and rope work.`,note:`🗺️ Scoutcraft teaches traditional outdoor skills.`},{id:`zone-handicraft`,name:`Handicraft Area`,type:`program`,description:`Under Area Director Jack Erickson. Teaching woodcarving, basketry, leatherwork, and art.`,note:`🎨 Keep area clean and return all blades/tools to lockers.`},{id:`zone-nature`,name:`Nature Lodge`,type:`program`,description:`Under Area Director Andrew Rasmussen. Teaching astronomy, geology, forestry, environmental science, and reptile study.`,note:`🐍 Non-venomous educational animals housed here.`},{id:`zone-ranges`,name:`Range and Target Activities`,type:`program`,description:`Under Area Director Brian Rome. Archery, rifle, and shotgun ranges.`,note:`🎯 Strictly controlled zones. Suspension under high winds.`},{id:`zone-climbing`,name:`Climbing Wall & Tower`,type:`program`,description:`Under Director Jim Harrington. Rock wall climbing and rappelling training tower.`,note:`🧗 Minimum age of director is 21.`},{id:`zone-staffhill`,name:`Staff Hill (Cabins)`,type:`staff`,description:`North end of camp. Staff quarters, living cabins, and youth/adult staff shower houses.`,note:`🔒 Strictly off-limits to campers. Respect roommate privacy.`},{id:`zone-health`,name:`Health Lodge / Medic Office`,type:`staff`,description:`Medic office and emergency recovery beds. Coordinates first aid, logs injuries, and stores medications.`,note:`🩹 Report all injuries, no matter how minor, immediately.`},{id:`zone-trading`,name:`Trading Post`,type:`staff`,description:`Camp general store and business headquarters. Sells gear, snacks, and souvenirs.`,note:`🎟️ No staff discount or credit tabs. Cash/card only.`}];function De(){return`
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
  `}function Oe(){let e=document.getElementById(`camp-map-search`),t=document.querySelectorAll(`.map-filter-btn`),n=document.getElementById(`map-sidebar-mount`),r=document.querySelectorAll(`.map-svg-node`),i=document.getElementById(`eap-bell-btn`);document.getElementById(`map-parent`);let a=document.getElementById(`map-svg-container`),o=null;if(!n)return;function s(e){let t=e.id;r.forEach(e=>e.classList.remove(`selected-zone`)),e.classList.add(`selected-zone`);let n=R.find(e=>e.id===t);n&&c(n)}function c(e){n.innerHTML=`
      <div style="animation: tabFadeIn 0.25s ease;">
        <h3 style="color: hsl(var(--primary)); margin-bottom: 8px;">${e.name}</h3>
        <p style="font-size: 14px; line-height: 1.5; margin-bottom: 14px;">${e.description}</p>
        
        <div style="background: hsl(var(--secondary) / 0.5); padding: 12px; border-radius: var(--radius-sm); border-left: 4px solid hsl(var(--primary)); font-size: 13.5px; font-weight: 500; line-height: 1.4;">
          ${e.note}
        </div>
      </div>
    `}r.forEach(e=>{e.addEventListener(`click`,()=>{s(e)})}),t.forEach(e=>{e.addEventListener(`click`,()=>{t.forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`);let n=e.getAttribute(`data-filter`);r.forEach(e=>{let t=e.id,r=R.find(e=>e.id===t);n===`all`||r&&r.type===n?(e.style.opacity=`1`,e.style.filter=`none`):(e.style.opacity=`0.2`,e.style.filter=`grayscale(60%)`)})})}),e.addEventListener(`input`,()=>{let t=e.value.toLowerCase().trim();if(t===``){r.forEach(e=>{e.classList.remove(`selected-zone`),e.style.opacity=`1`,e.style.filter=`none`});return}let n=!1;r.forEach(e=>{let r=e.id,i=R.find(e=>e.id===r);if(!i)return;let a=i.name.toLowerCase().includes(t),o=i.description.toLowerCase().includes(t),c=i.note.toLowerCase().includes(t);a||o||c?(e.style.opacity=`1`,e.style.filter=`none`,e.classList.add(`selected-zone`),n||=(s(e),!0)):(e.style.opacity=`0.2`,e.style.filter=`grayscale(60%)`,e.classList.remove(`selected-zone`))})}),i.addEventListener(`click`,()=>{o===null?l():u()});function l(){o=1,i.textContent=`🛑 Cancel EAP Alarm`,i.style.background=`hsl(var(--foreground))`,a.classList.add(`emergency-alarm-active`),d()}function u(){o=null,i.textContent=`🚨 Sound EAP Bell Alarm!`,i.style.background=`hsl(var(--danger))`,a.classList.remove(`emergency-alarm-active`),n.innerHTML=`
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
      `,document.getElementById(`eap-step3-btn`).addEventListener(`click`,()=>{f()}))}function f(){o=null,i.textContent=`🚨 Sound EAP Bell Alarm!`,i.style.background=`hsl(var(--danger))`,a.classList.remove(`emergency-alarm-active`),h({particleCount:100,spread:70,origin:{y:.6}}),n.innerHTML=`
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
      `})}}var ke=t({activePoliciesTab:()=>z,initPolicies:()=>Me,renderPolicies:()=>je,setPoliciesTab:()=>Ae}),z=`safety`;function Ae(e){z=e}function je(){return`
    <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
      <!-- Continuous Bell Protocol Banner -->
      <div style="background: var(--safety-red); color: white; padding: 16px; border-radius: var(--radius-sm); border: 2px solid #b11f26; display: flex; align-items: center; gap: 16px; box-shadow: 0 4px 12px rgba(200, 35, 44, 0.3);">
        <span style="font-size: 32px;">🔔</span>
        <div>
          <h3 style="margin: 0; font-size: 18px; font-weight: 800; letter-spacing: 0.5px;">CONTINUOUS BELL PROTOCOL</h3>
          <p style="margin: 4px 0 0 0; font-size: 14px; font-weight: 500;">If you hear a continuous, unbroken ringing of the Dining Hall bell: <strong>DROP EVERYTHING. SECURE HAZARDS. EVACUATE TO THE PARADE GROUNDS IMMEDIATELY.</strong></p>
        </div>
      </div>

      <!-- Tab Selector -->
      <div class="schedule-tabs-container">
        <button class="schedule-tab-btn ${z===`safety`?`active`:``}" data-tab="safety">🛟 Emergency Policies & Radio</button>
        <button class="schedule-tab-btn ${z===`map`?`active`:``}" data-tab="map">🗺️ Camp Map & EAP Drill</button>
      </div>

      <!-- Mount point for sub tabs -->
      <div id="policies-subtab-mount">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `}function Me(){document.documentElement.setAttribute(`data-theme-mode`,`code-red`),document.querySelectorAll(`[data-tab]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-tab`);if(t){z=t;let e=document.getElementById(`view-mount-point`);e&&(e.innerHTML=je(),Me())}})});let e=document.getElementById(`policies-subtab-mount`);e&&(window.dispatchEvent(new CustomEvent(`before-view-change`)),z===`safety`?(e.innerHTML=Te(),Ee()):z===`map`&&(e.innerHTML=De(),Oe()))}function Ne(){return`
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

        <!-- Filter Chips Section -->
        <div class="song-filters" style="display: flex; flex-direction: column; gap: 8px; margin: 0 6px 12px 6px; padding-bottom: 10px; border-bottom: 1px solid hsl(var(--border) / 0.5);">
          <!-- Setting Filter -->
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 10px; font-weight: 700; color: hsl(var(--muted-foreground));">Setting:</span>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button class="filter-chip active" data-filter-type="setting" data-value="all" style="font-size: 11px; padding: 4px 8px; border-radius: 12px; border: 1px solid hsl(var(--border)); background: hsl(var(--card)); cursor: pointer; font-weight: 600;">All</button>
              <button class="filter-chip" data-filter-type="setting" data-value="Logs" style="font-size: 11px; padding: 4px 8px; border-radius: 12px; border: 1px solid hsl(var(--border)); background: hsl(var(--card)); cursor: pointer; font-weight: 600;">🪵 Logs</button>
              <button class="filter-chip" data-filter-type="setting" data-value="Campfire" style="font-size: 11px; padding: 4px 8px; border-radius: 12px; border: 1px solid hsl(var(--border)); background: hsl(var(--card)); cursor: pointer; font-weight: 600;">🔥 Campfire</button>
            </div>
          </div>
          <!-- Energy Filter -->
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 10px; font-weight: 700; color: hsl(var(--muted-foreground));">Energy:</span>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button class="filter-chip active" data-filter-type="energy" data-value="all" style="font-size: 11px; padding: 4px 8px; border-radius: 12px; border: 1px solid hsl(var(--border)); background: hsl(var(--card)); cursor: pointer; font-weight: 600;">All</button>
              <button class="filter-chip" data-filter-type="energy" data-value="rowdy" style="font-size: 11px; padding: 4px 8px; border-radius: 12px; border: 1px solid hsl(var(--border)); background: hsl(var(--card)); cursor: pointer; font-weight: 600;">⚡ Rowdy</button>
              <button class="filter-chip" data-filter-type="energy" data-value="calm" style="font-size: 11px; padding: 4px 8px; border-radius: 12px; border: 1px solid hsl(var(--border)); background: hsl(var(--card)); cursor: pointer; font-weight: 600;">🧘 Calm</button>
            </div>
          </div>
        </div>

        <!-- Injected dynamic songs list -->
        <div id="songs-list-mount" style="display: flex; flex-direction: column; gap: 8px;"></div>
      </div>

      <!-- Right detail view -->
      <div class="glass-panel" id="song-details-mount">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `}function Pe(){let e=document.getElementById(`songs-list-mount`),t=document.getElementById(`song-details-mount`),n=document.getElementById(`btn-show-comedy`);if(!e||!t)return;let r={"song-funky":{tune:`Rhythm Rap`,energy:`rowdy`,setting:`Logs`},"song-alfalfa":{tune:`Auld Lang Syne`,energy:`calm`,setting:`Logs`},"song-alive":{tune:`If You're Happy`,energy:`rowdy`,setting:`Campfire`},"song-bananas":{tune:`Action Shout`,energy:`rowdy`,setting:`Campfire`},"song-birdie":{tune:`Morning Action Chant`,energy:`calm`,setting:`Logs`},"song-crazy":{tune:`Zipper Song`,energy:`rowdy`,setting:`Campfire`},"song-camper":{tune:`Drunken Sailor`,energy:`rowdy`,setting:`Logs`}},i=null,o=null,s=0,c=[],l=`all`,u=`all`;function d(){let t=a.filter(e=>{let t=r[e.id]||{tune:``,energy:`rowdy`,setting:`Logs`},n=l===`all`||t.setting===l,i=u===`all`||t.energy===u;return n&&i});if(t.length===0){e.innerHTML=`<div style="font-size: 13px; color: hsl(var(--muted-foreground)); padding: 12px 6px; font-weight: 500; text-align: center;">No matching songs.</div>`;return}e.innerHTML=t.map(e=>`
      <button class="song-sidebar-btn ${e.id===i?`active`:``}" data-song-id="${e.id}">
        <span class="song-sidebar-title">${e.title}</span>
        <span class="song-sidebar-desc">${e.description.substring(0,50)}...</span>
      </button>
    `).join(``),e.querySelectorAll(`.song-sidebar-btn`).forEach(t=>{t.addEventListener(`click`,()=>{g(),n.classList.remove(`active`),e.querySelectorAll(`.song-sidebar-btn`).forEach(e=>e.classList.remove(`active`)),t.classList.add(`active`),i=t.getAttribute(`data-song-id`);let r=a.find(e=>e.id===i);r&&m(r)})})}function f(){document.querySelectorAll(`.filter-chip`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-filter-type`),n=e.getAttribute(`data-value`);document.querySelectorAll(`.filter-chip[data-filter-type="${t}"]`).forEach(e=>{e.classList.remove(`active`)}),e.classList.add(`active`),t===`setting`?l=n:t===`energy`&&(u=n),d()})})}function p(){i=null,g(),n.classList.add(`active`),e.querySelectorAll(`.song-sidebar-btn`).forEach(e=>e.classList.remove(`active`)),t.innerHTML=`
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
    `}function m(e){c=e.actions||[],t.innerHTML=`
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
    `;let n=document.getElementById(`metronome-play-btn`);n&&n.addEventListener(`click`,()=>{o?g():h()})}function h(){let e=document.getElementById(`metronome-play-btn`);e&&(e.textContent=`⏸️`),s=0;let t=[document.getElementById(`dot-0`),document.getElementById(`dot-1`),document.getElementById(`dot-2`),document.getElementById(`dot-3`)],n=document.getElementById(`action-prompt`);o=setInterval(()=>{let e=s%4;t.forEach((t,n)=>{t&&(n===e?t.classList.add(`active`):t.classList.remove(`active`))});let r=c.find(e=>e.beat===s);r&&n?(n.textContent=r.text,n.style.transform=`scale(1.1)`,setTimeout(()=>{n&&(n.style.transform=`none`)},200)):n&&s===0&&(n.textContent=`Sing! 🎵`),s++;let i=c.length>0?Math.max(...c.map(e=>e.beat))+4:16;s>i&&g()},500)}function g(){o&&=(clearInterval(o),null);let e=document.getElementById(`metronome-play-btn`);e&&(e.textContent=`▶️`),[document.getElementById(`dot-0`),document.getElementById(`dot-1`),document.getElementById(`dot-2`),document.getElementById(`dot-3`)].forEach(e=>{e&&e.classList.remove(`active`)});let t=document.getElementById(`action-prompt`);t&&(t.textContent=`Metronome Stopped`)}n.addEventListener(`click`,()=>{p()});let _=()=>{g(),window.removeEventListener(`before-view-change`,_)};window.addEventListener(`before-view-change`,_),d(),p(),f()}var Fe=class{constructor(e){this.collectionName=e}_read(){return JSON.parse(localStorage.getItem(this.collectionName)||`[]`)}_write(e){localStorage.setItem(this.collectionName,JSON.stringify(e))}findAll(e=()=>!0){return this._read().filter(e)}findOne(e){return this._read().find(e)||null}create(e){let t=this._read(),n={id:crypto.randomUUID(),createdAt:new Date().toISOString(),...e};return t.push(n),this._write(t),n}update(e,t){let n=this._read(),r=n.findIndex(t=>t.id===e);return r===-1?null:(n[r]={...n[r],...t,updatedAt:new Date().toISOString()},this._write(n),n[r])}delete(e){let t=this._read(),n=t.filter(t=>t.id!==e);return this._write(n),n.length!==t.length}},B=new Fe(`lawton_db_users`);new Fe(`camp_lawton_applications`);var Ie=new Fe(`lawton_db_campfires`),Le={"song-funky":{energy:`rowdy`},"song-alfalfa":{energy:`calm`},"song-alive":{energy:`rowdy`},"song-bananas":{energy:`rowdy`},"song-birdie":{energy:`calm`},"song-crazy":{energy:`rowdy`},"song-camper":{energy:`rowdy`}};function Re(){let e=a.map(e=>{let t=Le[e.id]?.energy||`rowdy`;return`<option value="${e.id}" data-energy="${t}">${e.title} (${t})</option>`}).join(``);return`
    <div class="schedule-content-panel" style="animation: tabFadeIn 0.3s ease both;">
      <h2 style="color: hsl(var(--primary)); margin-top: 0;">🔥 Campfire Program Builder</h2>
      <p style="color: hsl(var(--muted-foreground)); font-size: 14.5px;">Build your campfire utilizing the "Campfire Curve" pacing guidelines. Spark and Early Flame items cannot be 'calm'. Embers and Last Light items cannot be 'rowdy'.</p>
      
      <form id="campfire-form" style="display: flex; flex-direction: column; gap: 20px;">
        <!-- Stage 1 -->
        <div class="builder-stage">
          <label>1. Spark / Ignition (High Energy)</label>
          <select id="stage-1" required>
            <option value="">-- Select an item --</option>
            ${e}
          </select>
          <div class="error-msg" id="err-stage-1" style="color: var(--safety-red); font-size: 12px; display: none;">Error: Cannot place a calm item here.</div>
        </div>

        <!-- Stage 2 -->
        <div class="builder-stage">
          <label>2. Early Flame (Building Energy)</label>
          <select id="stage-2" required>
            <option value="">-- Select an item --</option>
            ${e}
          </select>
          <div class="error-msg" id="err-stage-2" style="color: var(--safety-red); font-size: 12px; display: none;">Error: Cannot place a calm item here.</div>
        </div>

        <!-- Stage 3 -->
        <div class="builder-stage">
          <label>3. Steady Burn (Pacing)</label>
          <select id="stage-3" required>
            <option value="">-- Select an item --</option>
            ${e}
          </select>
        </div>

        <!-- Stage 4 -->
        <div class="builder-stage">
          <label>4. Climax (Peak Engagement)</label>
          <select id="stage-4" required>
            <option value="">-- Select an item --</option>
            ${e}
          </select>
        </div>

        <!-- Stage 5 -->
        <div class="builder-stage">
          <label>5. Embers (Winding Down)</label>
          <select id="stage-5" required>
            <option value="">-- Select an item --</option>
            ${e}
          </select>
          <div class="error-msg" id="err-stage-5" style="color: var(--safety-red); font-size: 12px; display: none;">Error: Cannot place a rowdy item here.</div>
        </div>

        <!-- Stage 6 -->
        <div class="builder-stage">
          <label>6. Last Light (Quiet Reflection)</label>
          <select id="stage-6" required>
            <option value="">-- Select an item --</option>
            ${e}
          </select>
          <div class="error-msg" id="err-stage-6" style="color: var(--safety-red); font-size: 12px; display: none;">Error: Cannot place a rowdy item here.</div>
        </div>

        <!-- NCS Compliance Gatekeeper -->
        <div style="background: hsl(var(--card)); padding: 16px; border: 1px solid hsl(var(--border)); border-radius: var(--radius-sm);">
          <h4 style="margin: 0 0 12px 0;">🛡️ NCS Compliance Gatekeeper</h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <label style="display: flex; gap: 8px; font-size: 14px; cursor: pointer;">
              <input type="checkbox" id="chk-water" required /> I verify there is no physical water/getting wet in any skit.
            </label>
            <label style="display: flex; gap: 8px; font-size: 14px; cursor: pointer;">
              <input type="checkbox" id="chk-bathroom" required /> I verify there is zero bathroom humor.
            </label>
            <label style="display: flex; gap: 8px; font-size: 14px; cursor: pointer;">
              <input type="checkbox" id="chk-food" required /> I verify no real food will be wasted or thrown.
            </label>
            <label style="display: flex; gap: 8px; font-size: 14px; cursor: pointer;">
              <input type="checkbox" id="chk-underpants" required /> I verify no references to undergarments.
            </label>
            <label style="display: flex; gap: 8px; font-size: 14px; cursor: pointer; color: var(--safety-red); font-weight: 700; margin-top: 8px;">
              <input type="checkbox" id="chk-vetting" required /> I acknowledge the Program Director must vet this schedule before performance.
            </label>
          </div>
        </div>

        <button type="submit" id="submit-campfire" class="primary-btn" style="background: var(--camp-forest); color: white; border: none; padding: 12px; border-radius: 6px; font-weight: 700; cursor: pointer;">
          SUBMIT FOR AREA DIRECTOR APPROVAL
        </button>
      </form>
      
      <div id="campfire-success" style="display: none; padding: 16px; background: rgba(16, 185, 129, 0.1); border: 2px solid #10b981; border-radius: var(--radius-sm); color: #10b981; font-weight: 700; margin-top: 20px;">
        ✅ Program Submitted! Sent to Program Director for review.
      </div>
    </div>
  `}function ze(){let e=document.getElementById(`campfire-form`);if(!e)return;function t(e,t){let n=document.getElementById("stage-${stageNum}"),r=document.getElementById("err-stage-${stageNum}");return n.value?n.options[n.selectedIndex].getAttribute(`data-energy`)===t?(r.style.display=`block`,n.style.borderColor=`var(--safety-red)`,!1):(r.style.display=`none`,n.style.borderColor=`hsl(var(--border))`,!0):(r.style.display=`none`,!0)}[1,2].forEach(e=>document.getElementById("stage-${n}").addEventListener(`change`,()=>t(e,`calm`))),[5,6].forEach(e=>document.getElementById("stage-${n}").addEventListener(`change`,()=>t(e,`rowdy`))),e.addEventListener(`submit`,n=>{n.preventDefault();let r=t(1,`calm`),i=t(2,`calm`),a=t(5,`rowdy`),o=t(6,`rowdy`);if(!r||!i||!a||!o){alert(`Please fix the pacing errors highlighted in red.`);return}let s={spark:document.getElementById(`stage-1`).value,earlyFlame:document.getElementById(`stage-2`).value,steadyBurn:document.getElementById(`stage-3`).value,climax:document.getElementById(`stage-4`).value,embers:document.getElementById(`stage-5`).value,lastLight:document.getElementById(`stage-6`).value,status:`pending`};Ie.create(s),e.style.display=`none`,document.getElementById(`campfire-success`).style.display=`block`})}var Be=t({activeSongbookTab:()=>V,initSongbook:()=>He,renderSongbook:()=>Ve}),V=`songbook`;function Ve(){return`
    <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
      <!-- Tab Selector -->
      <div class="schedule-tabs-container">
        <button class="schedule-tab-btn ${V===`songbook`?`active`:``}" data-tab="songbook">🎤 Songbook & Comedy</button>
        <button class="schedule-tab-btn ${V===`builder`?`active`:``}" data-tab="builder">🔥 Campfire Program Builder</button>
      </div>

      <!-- Mount point for sub tabs -->
      <div id="songbook-subtab-mount">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `}function He(){window.dispatchEvent(new CustomEvent(`before-view-change`)),document.querySelectorAll(`[data-tab]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-tab`);if(t){V=t;let e=document.getElementById(`view-mount-point`);e&&(e.innerHTML=Ve(),He())}})});let e=document.getElementById(`songbook-subtab-mount`);e&&(V===`songbook`?(e.innerHTML=Ne(),Pe()):V===`builder`&&(e.innerHTML=Re(),ze()))}function Ue(e){return new TextEncoder().encode(e)}function We(e){return Array.from(new Uint8Array(e)).map(e=>e.toString(16).padStart(2,`0`)).join(``)}async function Ge(e,t){let n=await window.crypto.subtle.importKey(`raw`,Ue(e),{name:`PBKDF2`},!1,[`deriveBits`,`deriveKey`]);return We(await window.crypto.subtle.deriveBits({name:`PBKDF2`,salt:Ue(t),iterations:1e5,hash:`SHA-256`},n,256))}function Ke(){return crypto.randomUUID()}var H=class{static async register(e,t,n=`Staff`){let r=e.trim().toLowerCase();if(B.findOne(e=>e.normalizedUsername===r))throw Error(`Username already exists`);let i=Ke(),a=await Ge(t,i),o=B.create({username:e.trim(),normalizedUsername:r,passwordHash:a,salt:i,role:n,status:`active`});return{id:o.id,username:o.username,role:o.role}}static async login(e,t){let n=e.trim().toLowerCase(),r=B.findOne(e=>e.normalizedUsername===n);if(!r)throw Error(`Invalid username or password`);if(r.status===`inactive`)throw Error(`Account deactivated by admin`);if(await Ge(t,r.salt)!==r.passwordHash)throw Error(`Invalid username or password`);let i=btoa(JSON.stringify({id:r.id,username:r.username,role:r.role,exp:Date.now()+864e5}));return localStorage.setItem(`lawton_session`,i),this.getCurrentUser()}static logout(){localStorage.removeItem(`lawton_session`)}static getCurrentUser(){let e=localStorage.getItem(`lawton_session`);if(!e)return null;try{let t=JSON.parse(atob(e));if(t.exp<Date.now())return this.logout(),null;let n=B.findOne(e=>e.id===t.id);return!n||n.status===`inactive`?(this.logout(),null):{id:n.id,username:n.username,role:n.role}}catch{return this.logout(),null}}static isAdmin(){let e=this.getCurrentUser();return e?[`Admin`,`Camp Director`,`Program Director`].includes(e.role):!1}static requireAdmin(){if(!this.isAdmin())throw Error(`Insufficient permissions`)}};function qe(){let e=B.findAll();return`
    <div style="display: flex; flex-direction: column; gap: 28px;">
      
      <!-- Stats Summary -->
      <div class="admin-stats-grid">
        <div class="admin-stat-card">
          <span class="admin-stat-num">${e.length}</span>
          <span class="admin-stat-label">Total Users</span>
        </div>
        <div class="admin-stat-card approved">
          <span class="admin-stat-num">${e.filter(e=>e.status===`active`).length}</span>
          <span class="admin-stat-label">Active Accounts</span>
        </div>
        <div class="admin-stat-card rejected">
          <span class="admin-stat-num">${e.filter(e=>e.status===`inactive`).length}</span>
          <span class="admin-stat-label">Deactivated</span>
        </div>
        <div class="admin-stat-card pending">
          <span class="admin-stat-num">${e.filter(e=>[`Admin`,`Camp Director`,`Program Director`].includes(e.role)).length}</span>
          <span class="admin-stat-label">Admin Level Users</span>
        </div>
      </div>

      <!-- Applicant Registry List -->
      <div class="glass-panel" style="padding: 0; overflow-x: auto; border: 1px solid hsl(var(--border)); border-radius: var(--radius-lg);">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th style="text-align: right; padding-right: 24px;">Action</th>
            </tr>
          </thead>
          <tbody id="admin-users-table-body">
            <!-- Dynamic matching rows injected here -->
          </tbody>
        </table>
      </div>
    </div>
  `}function Je(){let e=document.getElementById(`admin-users-table-body`);e&&(e.innerHTML=B.findAll().map(e=>{let t=e.createdAt?new Date(e.createdAt).toLocaleDateString():`Legacy`,n=H.getCurrentUser(),r=n&&n.id===e.id,i=e.status===`active`?`approved`:`rejected`,a=[`Staff`,`Scoutcraft`,`Nature`,`Handicraft`,`CIT`,`Ranger`,`Medic`,`Program Director`,`Camp Director`,`Admin`].map(t=>`<option value="${t}" ${e.role===t?`selected`:``}>${t}</option>`).join(``);return`
        <tr class="user-row" data-id="${e.id}">
          <td style="font-weight: 600;">
            ${e.username}
            ${r?`<span style="font-size: 11px; background: hsl(var(--primary)); color: white; padding: 2px 6px; border-radius: 4px; margin-left: 8px;">YOU</span>`:``}
          </td>
          <td>
            <select class="role-select" data-id="${e.id}" ${r?`disabled`:``} style="padding: 6px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: hsl(var(--foreground)); font-size: 13px;">
              ${a}
            </select>
          </td>
          <td>
            <span class="app-status-badge ${i}" style="display: inline-flex; width: fit-content; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase;">
              ${e.status}
            </span>
          </td>
          <td>${t}</td>
          <td style="text-align: right; padding-right: 24px;">
            <button class="welcome-banner-btn toggle-status-btn" data-id="${e.id}" data-status="${e.status}" ${r?`disabled`:``} style="padding: 6px 14px; font-size: 13px; background: ${e.status===`active`?`hsl(var(--danger) / 0.1)`:`hsl(var(--success) / 0.1)`}; color: ${e.status===`active`?`hsl(var(--danger))`:`hsl(var(--success))`}; border: 1px solid currentColor;">
              ${e.status===`active`?`Deactivate`:`Activate`}
            </button>
          </td>
        </tr>
      `}).join(``),e.querySelectorAll(`.role-select`).forEach(e=>{e.addEventListener(`change`,e=>{let t=e.target.getAttribute(`data-id`),n=e.target.value;B.update(t,{role:n}),document.getElementById(`view-mount-point`)&&window.dispatchEvent(new CustomEvent(`camp-admin-refresh`))})}),e.querySelectorAll(`.toggle-status-btn`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.target.getAttribute(`data-id`),n=e.target.getAttribute(`data-status`)===`active`?`inactive`:`active`;B.update(t,{status:n}),window.dispatchEvent(new CustomEvent(`camp-admin-refresh`))})}))}var U=`applications`,Ye=[{id:`app_mock1`,username:`counselor_cody`,submittedAt:new Date(Date.now()-864e5*3).toISOString(),status:`Pending`,formData:{firstName:`Cody`,lastName:`Campfire`,nickname:`Cody`,phone:`555-0199`,email:`cody@campfire.org`,address:`123 Pine Needle Way, Flagstaff, AZ`,ageEligibility:`18`,workAuth:!0,scoutReg:!0,startDate:`2026-06-01`,endDate:`2026-08-15`,pref1:`Scoutcraft Instructor`,pref2:`Nature Instructor`,pref3:`Handicraft Instructor`,shirtSize:`L`,jacketSize:`L`,scoutRank:`Eagle Scout`,oaMember:!0,employer:`Camp Lawton`,duties:`Junior Counselor last year, led knot tying and fire building.`,ref1:`Scoutmaster Dave, Troop 450, 555-0101`,ref2:`Teacher Mrs. Smith, Flagstaff High, 555-0102`,ref3:`Area Director Dan, Camp Lawton, 555-0103`,ackAltitude:!0,ackWildlife:!0,ackSanitation:!0,ackMedical:!0,certCPR:!0,certWFA:!0,ackAgreements:!0,signature:`Cody Campfire`,sigDate:`2026-06-21`}},{id:`app_mock2`,username:`cit_sam`,submittedAt:new Date(Date.now()-864e5*5).toISOString(),status:`Approved`,formData:{firstName:`Samantha`,lastName:`Scout`,nickname:`Sam`,phone:`555-0177`,email:`sam@scouting.org`,address:`456 Mountain Trail Road, Tucson, AZ`,ageEligibility:`14`,workAuth:!0,scoutReg:!0,startDate:`2026-06-05`,endDate:`2026-07-28`,pref1:`Counselor in Training (CIT)`,pref2:`Handicraft Assistant`,pref3:`Program Assistant`,shirtSize:`M`,jacketSize:`M`,scoutRank:`First Class`,oaMember:!1,employer:`Tucson School District`,duties:`Library assistant volunteer.`,ref1:`Patrol Leader Tommy, 555-0201`,ref2:`Uncle Bob, Family Friend, 555-0202`,ref3:`Coach Nelson, Tucson Soccer, 555-0203`,ackAltitude:!0,ackWildlife:!0,ackSanitation:!0,ackMedical:!0,certCPR:!1,certWFA:!1,ackAgreements:!0,signature:`Samantha Scout`,sigDate:`2026-06-19`}}];function Xe(){localStorage.getItem(`camp_lawton_applications`)||localStorage.setItem(`camp_lawton_applications`,JSON.stringify(Ye))}function Ze(){let e=`
    <div style="display: flex; border-bottom: 1px solid hsl(var(--border)); padding-bottom: 0; margin-bottom: 20px;">
      <button id="admin-tab-apps" class="schedule-tab-btn ${U===`applications`?`active`:``}" style="margin-right: 16px;">Applicant Registry</button>
      <button id="admin-tab-users" class="schedule-tab-btn ${U===`users`?`active`:``}">User Management</button>
    </div>
  `;if(U===`users`)return e+qe();Xe();let t=JSON.parse(localStorage.getItem(`camp_lawton_applications`)||`[]`);return e+`
    <div style="display: flex; flex-direction: column; gap: 28px;">
      
      <!-- Stats Summary -->
      <div class="admin-stats-grid">
        <div class="admin-stat-card">
          <span class="admin-stat-num">${t.length}</span>
          <span class="admin-stat-label">Total Applications</span>
        </div>
        <div class="admin-stat-card pending">
          <span class="admin-stat-num">${t.filter(e=>e.status===`Pending`).length}</span>
          <span class="admin-stat-label">Pending Review</span>
        </div>
        <div class="admin-stat-card approved">
          <span class="admin-stat-num">${t.filter(e=>e.status===`Approved`).length}</span>
          <span class="admin-stat-label">Approved Candidates</span>
        </div>
        <div class="admin-stat-card rejected">
          <span class="admin-stat-num">${t.filter(e=>e.status===`Rejected`).length}</span>
          <span class="admin-stat-label">Rejected / Incomplete</span>
        </div>
      </div>

      <!-- Filters & Toolbar -->
      <div class="glass-panel admin-toolbar" style="display: flex; flex-direction: column; gap: 16px; padding: 20px;">
        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center; width: 100%;">
          
          <div style="flex: 1; min-width: 200px; display: flex; align-items: center; background: var(--glass-bg); border: 1px solid hsl(var(--border)); border-radius: var(--radius-sm); padding: 6px 12px; gap: 8px;">
            <span style="font-size: 16px;">🔍</span>
            <input type="text" id="admin-search-input" placeholder="Search applicant name or email..." style="background: none; border: none; outline: none; font-size: 14.5px; width: 100%; color: inherit;" />
          </div>

          <select id="admin-filter-status" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: hsl(var(--foreground)); font-size: 14.5px;">
            <option value="All">All Statuses</option>
            <option value="Pending">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select id="admin-filter-role" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: hsl(var(--foreground)); font-size: 14.5px;">
            <option value="All">All Position Choices</option>
            <option value="Scoutcraft">Scoutcraft</option>
            <option value="Nature">Nature / Ecology</option>
            <option value="CIT">Counselor in Training (CIT)</option>
            <option value="Handicraft">Handicraft</option>
            <option value="Program">Program / Operations</option>
          </select>

          <div style="margin-left: auto; display: flex; gap: 10px;">
            <button class="welcome-banner-btn" id="admin-btn-export" style="background: hsl(var(--primary)); color: white; display: flex; align-items: center; gap: 8px; font-size: 14px;">
              <span>📥</span> Export Registry
            </button>
            <button class="welcome-banner-btn" id="admin-btn-reset" style="background: hsl(var(--secondary)); color: hsl(var(--foreground)); border: 1px solid hsl(var(--border)); display: flex; align-items: center; gap: 8px; font-size: 14px;">
              <span>🔄</span> Reset Mock Data
            </button>
          </div>

        </div>
      </div>

      <!-- Applicant Registry List -->
      <div class="glass-panel" style="padding: 0; overflow-x: auto; border: 1px solid hsl(var(--border)); border-radius: var(--radius-lg);">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Applicant Name</th>
              <th>Preferred Role</th>
              <th>Submitted Date</th>
              <th>Eligibility</th>
              <th>Status</th>
              <th style="text-align: right; padding-right: 24px;">Action</th>
            </tr>
          </thead>
          <tbody id="admin-table-body">
            <!-- Dynamic matching rows injected here -->
          </tbody>
        </table>
      </div>

    </div>
  `}function Qe(){let e=document.getElementById(`admin-tab-apps`),t=document.getElementById(`admin-tab-users`);if(e&&e.addEventListener(`click`,()=>{U=`applications`,window.dispatchEvent(new CustomEvent(`camp-admin-refresh`))}),t&&t.addEventListener(`click`,()=>{U=`users`,window.dispatchEvent(new CustomEvent(`camp-admin-refresh`))}),window.adminRefreshBound||(window.addEventListener(`camp-admin-refresh`,()=>{let e=document.getElementById(`view-mount-point`);e&&G.activeView===`admin`&&(e.innerHTML=Ze(),Qe())}),window.adminRefreshBound=!0),U===`users`){Je();return}let n=document.getElementById(`admin-search-input`),r=document.getElementById(`admin-filter-status`),i=document.getElementById(`admin-filter-role`),a=document.getElementById(`admin-btn-export`),o=document.getElementById(`admin-btn-reset`),s=()=>{Xe();let e=JSON.parse(localStorage.getItem(`camp_lawton_applications`)||`[]`),t=n?n.value.trim().toLowerCase():``,a=r?r.value:`All`,o=i?i.value:`All`,s=e.filter(e=>{let n=e.formData||{},r=`${n.firstName||``} ${n.lastName||``}`.toLowerCase(),i=(n.email||``).toLowerCase(),s=r.includes(t)||i.includes(t),c=a===`All`||e.status===a,l=!0;if(o!==`All`){let e=(n.pref1||``).toLowerCase(),t=(n.pref2||``).toLowerCase(),r=(n.pref3||``).toLowerCase(),i=o.toLowerCase();l=e.includes(i)||t.includes(i)||r.includes(i)}return s&&c&&l}),c=document.getElementById(`admin-table-body`);if(c){if(s.length===0){c.innerHTML=`
        <tr>
          <td colspan="6" style="text-align: center; padding: 32px; color: hsl(var(--muted-foreground)); font-weight: 500;">
            No applications found matching the selected filters.
          </td>
        </tr>
      `;return}c.innerHTML=s.map(e=>{let t=e.formData||{},n=new Date(e.submittedAt).toLocaleDateString(),r=t.ageEligibility?`${t.ageEligibility}+ yrs`:`Unknown`,i=t.pref1||`Not Specified`,a=`pending`,o=`Pending Review`;return e.status===`Approved`?(a=`approved`,o=`Approved`):e.status===`Rejected`&&(a=`rejected`,o=`Rejected`),`
        <tr class="applicant-row" data-id="${e.id}">
          <td style="font-weight: 600;">
            ${t.firstName||`Anonymous`} ${t.lastName||``}
            ${t.nickname?`<div style="font-size: 12px; font-weight: normal; color: hsl(var(--muted-foreground));">"${t.nickname}"</div>`:``}
          </td>
          <td style="font-size: 14.5px;">${i}</td>
          <td>${n}</td>
          <td>
            <span style="font-size: 12px; background: hsl(var(--secondary)); padding: 2px 6px; border-radius: 4px; font-weight: 600;">${r}</span>
          </td>
          <td>
            <span class="app-status-badge ${a}" style="display: inline-flex; width: fit-content; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase;">
              ${e.status===`Approved`?`✅`:e.status===`Rejected`?`❌`:`⏳`} ${o}
            </span>
          </td>
          <td style="text-align: right; padding-right: 24px;">
            <button class="welcome-banner-btn inspect-btn" data-id="${e.id}" style="padding: 6px 14px; font-size: 13px;">Review File</button>
          </td>
        </tr>
      `}).join(``),c.querySelectorAll(`.inspect-btn`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation(),$e(e.getAttribute(`data-id`))})}),c.querySelectorAll(`.applicant-row`).forEach(e=>{e.addEventListener(`click`,()=>{$e(e.getAttribute(`data-id`))})})}};n&&n.addEventListener(`input`,s),r&&r.addEventListener(`change`,s),i&&i.addEventListener(`change`,s),a&&a.addEventListener(`click`,()=>{Xe();let e=localStorage.getItem(`camp_lawton_applications`)||`[]`,t=new Blob([e],{type:`application/json`}),n=URL.createObjectURL(t),r=document.createElement(`a`);r.href=n,r.download=`camp_lawton_applications_${new Date().toISOString().slice(0,10)}.json`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(n)}),o&&o.addEventListener(`click`,()=>{confirm(`Are you sure you want to restore the default mock applications? This will overwrite the current application registry.`)&&(localStorage.setItem(`camp_lawton_applications`,JSON.stringify(Ye)),s(),window.dispatchEvent(new CustomEvent(`camp-application-submitted`)))}),s()}function $e(e){let t=JSON.parse(localStorage.getItem(`camp_lawton_applications`)||`[]`),n=t.find(t=>t.id===e);if(!n)return;let r=n.formData||{},i=[];r.certCPR&&i.push(`CPR / AED`),r.certWFA&&i.push(`Wilderness First Aid`),pt(`
    <div style="display: flex; flex-direction: column; gap: 20px; max-height: 80vh; overflow-y: auto; padding-right: 10px;">
      
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid hsl(var(--border)); padding-bottom: 16px;">
        <div>
          <h2 style="font-family: var(--font-heading); font-size: 26px; color: hsl(var(--primary)); margin: 0 0 4px 0;">
            ${r.firstName||`Anonymous`} ${r.lastName||``}
          </h2>
          <p style="margin: 0; font-size: 14px; color: hsl(var(--muted-foreground));">
            Candidate Application Registry ID: <code>${n.id}</code>
          </p>
        </div>
        <div class="app-status-badge ${n.status.toLowerCase()}" style="font-weight: 700; text-transform: uppercase; padding: 6px 14px; border-radius: 20px; font-size: 13px;">
          ${n.status===`Approved`?`✅ Approved`:n.status===`Rejected`?`❌ Rejected`:`⏳ Pending Review`}
        </div>
      </div>

      <!-- Applicant Detailed Content -->
      <div class="admin-details-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 14px;">
        
        <!-- Section I -->
        <div style="background: hsl(var(--secondary) / 0.2); padding: 16px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border) / 0.5);">
          <h4 style="color: hsl(var(--primary)); margin-top: 0; border-bottom: 1px dashed hsl(var(--border)); padding-bottom: 6px; margin-bottom: 10px;">Section I: Demographics & Eligibility</h4>
          <p><strong>Nickname/Preferred:</strong> ${r.nickname||`None`}</p>
          <p><strong>Phone:</strong> ${r.phone||`Not provided`}</p>
          <p><strong>Email:</strong> ${r.email||`Not provided`}</p>
          <p><strong>Address:</strong> ${r.address||`Not provided`}</p>
          <p><strong>Age Group (as of June 1):</strong> ${r.ageEligibility||`Not provided`}</p>
          <p><strong>Legally Auth to Work in US:</strong> ${r.workAuth?`Yes`:`No`}</p>
          <p><strong>Scouting America Registered:</strong> ${r.scoutReg?`Yes`:`No`}</p>
        </div>

        <!-- Section II -->
        <div style="background: hsl(var(--secondary) / 0.2); padding: 16px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border) / 0.5);">
          <h4 style="color: hsl(var(--primary)); margin-top: 0; border-bottom: 1px dashed hsl(var(--border)); padding-bottom: 6px; margin-bottom: 10px;">Section II: Positions & Operations</h4>
          <p><strong>Available Dates:</strong> ${r.startDate||`TBD`} to ${r.endDate||`TBD`}</p>
          <p><strong>1st Choice:</strong> ${r.pref1||`None`}</p>
          <p><strong>2nd Choice:</strong> ${r.pref2||`None`}</p>
          <p><strong>3rd Choice:</strong> ${r.pref3||`None`}</p>
          <p><strong>T-Shirt Sizing:</strong> ${r.shirtSize||`TBD`}</p>
          <p><strong>Jacket Sizing:</strong> ${r.jacketSize||`TBD`}</p>
        </div>

        <!-- Section III -->
        <div style="background: hsl(var(--secondary) / 0.2); padding: 16px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border) / 0.5); grid-column: 1 / -1;">
          <h4 style="color: hsl(var(--primary)); margin-top: 0; border-bottom: 1px dashed hsl(var(--border)); padding-bottom: 6px; margin-bottom: 10px;">Section III: Experience & References</h4>
          <p><strong>Scouting Rank:</strong> ${r.scoutRank||`None`}</p>
          <p><strong>OA Member:</strong> ${r.oaMember?`Yes`:`No`}</p>
          <p><strong>Prior Employer:</strong> ${r.employer||`None`}</p>
          <p><strong>Prior Duties:</strong> ${r.duties||`None`}</p>
          <div style="margin-top: 10px;">
            <strong>References:</strong>
            <ul style="margin: 4px 0 0 20px; padding: 0;">
              <li>${r.ref1||`Not listed`}</li>
              <li>${r.ref2||`Not listed`}</li>
              <li>${r.ref3||`Not listed`}</li>
            </ul>
          </div>
        </div>

        <!-- Section IV & V -->
        <div style="background: hsl(var(--secondary) / 0.2); padding: 16px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border) / 0.5); grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <h4 style="color: hsl(var(--primary)); margin-top: 0; border-bottom: 1px dashed hsl(var(--border)); padding-bottom: 6px; margin-bottom: 10px;">Section IV: Requirements Check</h4>
            <p>⛰️ <strong>Altitude:</strong> ${r.ackAltitude?`Acknowledged`:`❌`}</p>
            <p>🐻 <strong>Wildlife:</strong> ${r.ackWildlife?`Acknowledged`:`❌`}</p>
            <p>🚰 <strong>Sanitation:</strong> ${r.ackSanitation?`Acknowledged`:`❌`}</p>
            <p>🏥 <strong>Medical Form A/B/C:</strong> ${r.ackMedical?`Acknowledged`:`❌`}</p>
            <p>📜 <strong>Certifications:</strong> ${i.length>0?i.join(`, `):`None`}</p>
          </div>
          <div>
            <h4 style="color: hsl(var(--primary)); margin-top: 0; border-bottom: 1px dashed hsl(var(--border)); padding-bottom: 6px; margin-bottom: 10px;">Section V: Agreements & Signature</h4>
            <p>🤝 <strong>Conduct & Substance Policy:</strong> ${r.ackAgreements?`Averred`:`❌`}</p>
            <p>✍️ <strong>Digital Signature:</strong> <span style="font-family: 'Bebas Neue', sans-serif; font-size: 16px; letter-spacing: 0.5px; color: hsl(var(--primary));">${r.signature||`Unsigned`}</span></p>
            <p>📅 <strong>Signature Date:</strong> ${r.sigDate||`TBD`}</p>
          </div>
        </div>

      </div>

      <!-- Action Panel -->
      <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; border-top: 1px solid hsl(var(--border)); padding-top: 16px;">
        <button class="welcome-banner-btn" id="modal-reject-btn" style="background: hsl(var(--danger) / 0.1); border: 1px solid hsl(var(--danger) / 0.3); color: hsl(var(--danger));">Reject / Archive</button>
        <button class="welcome-banner-btn" id="modal-approve-btn" style="background: hsl(var(--success)); color: white;">Approve Candidate</button>
      </div>

    </div>
  `);let a=document.getElementById(`modal-approve-btn`),o=document.getElementById(`modal-reject-btn`),s=n=>{let r=t.map(t=>t.id===e?{...t,status:n}:t);localStorage.setItem(`camp_lawton_applications`,JSON.stringify(r)),mt();let i=document.getElementById(`view-mount-point`);i&&G.activeView===`admin`&&(i.innerHTML=Ze(),Qe()),window.dispatchEvent(new CustomEvent(`camp-application-submitted`))};a&&a.addEventListener(`click`,()=>{s(`Approved`)}),o&&o.addEventListener(`click`,()=>{s(`Rejected`)})}var et=class{constructor(e,t){this.canvas=e,this.mode=t,this.reset()}reset(){if(this.x=Math.random()*this.canvas.width,this.mode===`ember`){this.y=this.canvas.height+Math.random()*80,this.size=Math.random()*3+1,this.speedY=-(Math.random()*1.5+.5),this.speedX=(Math.random()-.5)*.8;let e=Math.floor(Math.random()*40+10);this.color=`hsl(${e}, 100%, 60%)`,this.opacity=Math.random()*.6+.3,this.decay=Math.random()*.004+.002,this.wiggleFactor=Math.random()*.04,this.angle=Math.random()*Math.PI*2}else{this.y=Math.random()*this.canvas.height,this.size=Math.random()*2.5+1.2,this.speedY=(Math.random()-.5)*.25,this.speedX=-(Math.random()*.4+.15);let e=Math.floor(Math.random()>.3?Math.random()*15+40:Math.random()*15+75);this.color=`hsl(${e}, 85%, 65%)`,this.opacity=Math.random()*.35+.15,this.decay=0,this.wiggleFactor=Math.random()*.02,this.angle=Math.random()*Math.PI*2}}update(){this.mode===`ember`?(this.y+=this.speedY,this.angle+=this.wiggleFactor,this.x+=Math.sin(this.angle)*.4+this.speedX,this.opacity-=this.decay,(this.opacity<=0||this.y<-10)&&this.reset()):(this.y+=this.speedY,this.x+=this.speedX,this.angle+=this.wiggleFactor,this.y+=Math.sin(this.angle)*.08,this.x<-10&&(this.x=this.canvas.width+10,this.y=Math.random()*this.canvas.height),(this.y<-10||this.y>this.canvas.height+10)&&(this.y=Math.random()*this.canvas.height,this.x=this.canvas.width+10))}draw(e){e.save(),e.beginPath(),e.arc(this.x,this.y,this.size,0,Math.PI*2),e.fillStyle=this.color,this.mode===`ember`?(e.shadowBlur=this.size*2.5,e.shadowColor=this.color,e.globalAlpha=this.opacity):(e.globalAlpha=this.opacity,e.shadowBlur=this.size*1.5,e.shadowColor=`rgba(255, 235, 170, 0.3)`),e.fill(),e.restore()}},W=class{constructor(e){this.canvas=e,this.reset()}reset(){this.x=Math.random()*this.canvas.width,this.widthTop=Math.random()*60+30,this.widthBottom=this.widthTop*(Math.random()*2+1.5),this.angle=(Math.random()*12+12)*(Math.PI/180),Math.random()>.5&&(this.angle=-this.angle),this.maxOpacity=Math.random()*.04+.015,this.opacity=0,this.speed=Math.random()*.003+.001,this.state=`fadein`,this.visibleTime=Math.random()*300+150}update(){this.state===`fadein`?(this.opacity+=this.speed,this.opacity>=this.maxOpacity&&(this.opacity=this.maxOpacity,this.state=`visible`)):this.state===`visible`?(this.visibleTime--,this.visibleTime<=0&&(this.state=`fadeout`)):this.state===`fadeout`&&(this.opacity-=this.speed,this.opacity<=0&&this.reset())}draw(e){e.save(),e.globalAlpha=this.opacity;let t=this.canvas.height,n=this.x-this.widthTop/2,r=this.x+this.widthTop/2,i=t*Math.tan(this.angle),a=n+i-this.widthBottom/2,o=r+i+this.widthBottom/2;e.beginPath(),e.moveTo(n,0),e.lineTo(r,0),e.lineTo(o,t),e.lineTo(a,t),e.closePath();let s=e.createLinearGradient(n,0,r,0);s.addColorStop(0,`rgba(255, 255, 255, 0)`),s.addColorStop(.3,`rgba(255, 250, 220, 0.4)`),s.addColorStop(.5,`rgba(255, 255, 240, 0.5)`),s.addColorStop(.7,`rgba(255, 250, 220, 0.4)`),s.addColorStop(1,`rgba(255, 255, 255, 0)`),e.fillStyle=s,e.fill(),e.restore()}};function tt(){let e=document.getElementById(`bg-ambiance-canvas`);if(!e)return;let t=e.getContext(`2d`),n=[],r=[],i=``,a,o=()=>{e.width=window.innerWidth,e.height=window.innerHeight};window.addEventListener(`resize`,o),o();let s=()=>{let o=document.documentElement.getAttribute(`data-theme`)===`dark`,c=document.documentElement.getAttribute(`data-theme-mode`)===`code-red`,l=o||c?`night`:`day`;if(i!==l)if(i=l,n=[],r=[],l===`night`)for(let t=0;t<45;t++){let t=new et(e,`ember`);t.y=Math.random()*e.height,n.push(t)}else{for(let t=0;t<35;t++){let t=new et(e,`pollen`);t.y=Math.random()*e.height,n.push(t)}r=[new W(e),new W(e),new W(e),new W(e)]}t.clearRect(0,0,e.width,e.height),i===`day`&&r.forEach(e=>{e.update(),e.draw(t)}),n.forEach(e=>{e.update(),e.draw(t)}),a=requestAnimationFrame(s)};return s(),()=>{window.removeEventListener(`resize`,o),cancelAnimationFrame(a)}}var G={username:H.getCurrentUser()?.username||``,role:H.getCurrentUser()?.role||``,completedTasks:[],wamCount:parseInt(localStorage.getItem(`lawton_wam_count`)||`0`),signedConduct:!1,activeView:`dashboard`,syncUser(){let e=H.getCurrentUser();this.username=e?.username||``,this.role=e?.role||``,this.loadUserData(this.username),ft(),window.dispatchEvent(new CustomEvent(`state-tasks-updated`)),window.dispatchEvent(new CustomEvent(`state-conduct-updated`))},toggleTask(e){let t=this.completedTasks.indexOf(e);t>-1?this.completedTasks.splice(t,1):this.completedTasks.push(e),this.username&&localStorage.setItem(`lawton_tasks_${this.username}`,JSON.stringify(this.completedTasks)),window.dispatchEvent(new CustomEvent(`state-tasks-updated`))},incrementWam(){this.wamCount++,localStorage.setItem(`lawton_wam_count`,this.wamCount.toString()),window.dispatchEvent(new CustomEvent(`state-wam-updated`))},setSignedConduct(e){this.signedConduct=e,this.username&&localStorage.setItem(`lawton_conduct_${this.username}`,e?`true`:`false`),window.dispatchEvent(new CustomEvent(`state-conduct-updated`));let t=`checklist-4`,n=this.completedTasks.includes(t);(e&&!n||!e&&n)&&this.toggleTask(t)},loadUserData(e){if(!e){this.completedTasks=[],this.signedConduct=!1,this.role=``;return}this.completedTasks=JSON.parse(localStorage.getItem(`lawton_tasks_${e}`))||[],this.signedConduct=localStorage.getItem(`lawton_conduct_${e}`)===`true`,this.role=localStorage.getItem(`lawton_role_${e}`)||`Staff`},logout(){H.logout(),this.syncUser(),this.completedTasks=[],this.signedConduct=!1,window.dispatchEvent(new CustomEvent(`state-tasks-updated`)),window.dispatchEvent(new CustomEvent(`state-wam-updated`)),window.dispatchEvent(new CustomEvent(`state-conduct-updated`))}};G.loadUserData(G.username);var nt={dashboard:{title:`Dashboard`,subtitle:`Welcome to the Camp Lawton digital staff portal.`,render:ae,init:oe},camplawton:{title:`Camp Lawton`,subtitle:`History, pillars, schedule, and values.`,render:F,init:I},training:{title:`Training`,subtitle:`Training modules and EDGE method.`,render:Se,init:Ce},policies:{title:`Policies & Safety`,subtitle:`Emergency flowcharts, radio simulator, EAP drills, and legal guidelines.`,render:je,init:Me},songbook:{title:`Songbook & Comedy`,subtitle:`Rousing logs songs, action cued metronome lyrics, and comedy writing guides.`,render:Ve,init:He},onboarding:{title:`Onboarding`,subtitle:`Paperwork checklist, gear lists, and digital Code of Conduct signer.`,render:O,init:k},admin:{title:`Admin Portal`,subtitle:`Review candidate applications and manage staff onboarding credentials.`,render:Ze,init:Qe}},K,rt,q,it,at,ot,st,ct,J,Y,lt;function ut(){let e=localStorage.getItem(`lawton_theme`)||(window.matchMedia(`(prefers-color-scheme: dark)`).matches?`dark`:`light`);document.documentElement.setAttribute(`data-theme`,e)}function dt(){let e=document.documentElement.getAttribute(`data-theme`)===`dark`?`light`:`dark`;document.documentElement.setAttribute(`data-theme`,e),localStorage.setItem(`lawton_theme`,e)}function ft(){st&&(st.textContent=G.username||`Guest`),ot&&(ot.textContent=G.username?G.username.charAt(0).toUpperCase():`?`);let e=document.getElementById(`nav-item-admin`);if(e){let t=H.isAdmin();if(e.style.display=t?`block`:`none`,G.activeView===`admin`&&!t){X(`dashboard`);return}}let t=nt[G.activeView];t&&t.init&&t.init()}function pt(e){let t=document.getElementById(`dialog-mount-point`);t&&Y&&(t.innerHTML=e,Y.showModal())}function mt(){Y&&Y.close()}function X(e){let t=nt[e];if(!t)return;G.activeView=e,document.documentElement.removeAttribute(`data-theme-mode`),it.forEach(t=>{t.getAttribute(`data-view`)===e?t.classList.add(`active`):t.classList.remove(`active`)});let n=()=>{window.dispatchEvent(new CustomEvent(`before-view-change`)),K.textContent=t.title,rt.textContent=t.subtitle,q.innerHTML=t.render(),t.init&&t.init()};document.startViewTransition?document.startViewTransition(n).finished.finally(()=>{K.focus(),wt(q)}):(n(),K.focus(),wt(q))}var ht=[{title:`Core Pillars of Summer Camp`,snippet:`🏃 Physical, 🧠 Mental, 🤝 Social, 🌌 Spiritual development areas.`,viewId:`training`,tabId:null,isSafety:!1},{title:`The Aims of Scouting`,snippet:`Character Development, Citizenship Training, Personal Fitness, and Leadership.`,viewId:`training`,tabId:null,isSafety:!1},{title:`The Methods of Scouting`,snippet:`Ideals, Patrol Method, Outdoor Programs, Advancement, Association with Adults...`,viewId:`training`,tabId:null,isSafety:!1},{title:`What Makes a Staff? (4 Pillars)`,snippet:`Appearance, Attitude, Personality, and Knowledge guidelines.`,viewId:`training`,tabId:null,isSafety:!1},{title:`Stress Management & Self-Care`,snippet:`Work the problem, Use your Siesta, sensory overload management, Tag Out, and adult support.`,viewId:`training`,tabId:null,isSafety:!1},{title:`Camp Schedule & Sunday Arrival`,snippet:`Sunday sign-in, Staff meetings, Camper check-in, KP rosters and quiet hours.`,viewId:`camplawton`,tabId:`schedule`,isSafety:!1},{title:`Chain of Command & Leadership`,snippet:`Camp Leadership directory: Council Executives, Ranger, Program Director, Area Directors.`,viewId:`camplawton`,tabId:`orgchart`,isSafety:!1},{title:`Code Blue — Missing Person Protocol`,snippet:`Gather Details (Name, Troop, Clothing, Location) and initiate Radio Alarm immediately.`,viewId:`policies`,tabId:`safety`,isSafety:!0},{title:`Code Brown — Bear Sighting Protocol`,snippet:`Remain calm, report to Ranger, keep distant visual. If attacked, yell and stand ground.`,viewId:`policies`,tabId:`safety`,isSafety:!0},{title:`Lightning Safety (30/30 Rule)`,snippet:`Cease outdoor programs immediately when thunder is <30s of flash. Evacuate to Dining Hall.`,viewId:`policies`,tabId:`safety`,isSafety:!0},{title:`Fire Evacuation & Reporting`,snippet:`Call 911/Radio Camp Office. Evacuate to Parade Grounds. Personal gear is secondary.`,viewId:`policies`,tabId:`safety`,isSafety:!0},{title:`Bell Alarm (Continuous Bell)`,snippet:`Secure area hazards, escort scouts to Parade Grounds, take headcount by troop.`,viewId:`policies`,tabId:`safety`,isSafety:!0},{title:`Armed Intruder / Active Shooter`,snippet:`Run (flee to woods), Hide (lock & barricade cabin), Fight (act with physical aggression).`,viewId:`policies`,tabId:`safety`,isSafety:!0},{title:`Mandatory Abuse Reporting (ARS 13-3620)`,snippet:`Arizona mandated reporting laws require direct report to DCS Hotline (1-888-SOS-CHILD).`,viewId:`policies`,tabId:`safety`,isSafety:!0},{title:`Heat Stress Diagnostics`,snippet:`Heat Exhaustion vs. Heatstroke symptoms and emergency shade/ice pack treatments.`,viewId:`policies`,tabId:`safety`,isSafety:!0},{title:`Camp Map & EAP Evacuation Drill`,snippet:`Interactive map and emergency alarm drill simulator.`,viewId:`policies`,tabId:`map`,isSafety:!0},{title:`Camp Rules (Phones, Fraternization, Media)`,snippet:`Guidelines on mobile phone usage, cabin rules, and age/role labor limits.`,viewId:`policies`,tabId:`safety`,isSafety:!1},{title:`Campfire Songbook`,snippet:`Metronome Action Cue trainer. Songs: Funky, Alfalfa, Bananas, Birdie, Crazy, Drunken Camper.`,viewId:`songbook`,tabId:null,isSafety:!1},{title:`Campfire Comedy Master Class`,snippet:`Skit writing guidelines: Concept, Base reality, One unusual thing, Stake escalation, Button closer.`,viewId:`songbook`,tabId:null,isSafety:!1},{title:`Required Onboarding Paperwork`,snippet:`Application, Letter of Agreement, Medical Forms A, B, C, Vehicle Permit, I-9 forms.`,viewId:`onboarding`,tabId:`checklists`,isSafety:!1},{title:`Camp Packing List Assistant`,snippet:`Clothing, Gear, Optional, Privileged, and Prohibited item categories.`,viewId:`onboarding`,tabId:`checklists`,isSafety:!1},{title:`Code of Conduct Commitment Signer`,snippet:`Digital agreement form. Zero-tolerance policy on YPT, alcohol, drugs, weapons.`,viewId:`onboarding`,tabId:`conduct`,isSafety:!0},{title:`Handbook Quiz & Certification`,snippet:`10-question training certification quiz on weather, safety, and reporting policies.`,viewId:`onboarding`,tabId:`quiz`,isSafety:!1},{title:`Staff Application 2026`,snippet:`Apply to join the Camp Lawton staff.`,viewId:`onboarding`,tabId:`apply`,isSafety:!1}];function gt(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)}var _t={KYBO:`Keep Your Bowels Operating. Summer camp slang for the latrines / restrooms. Go ahead, use it in a sentence.`,WAM:`Water Appreciation Moment. Drink water immediately. No, seriously, do it now. 8,000 feet of elevation does not mess around.`,"The Logs":`The logs/benches in front of the Dining Hall. The center of all camp music, rowdiness, and announcements.`,"Staff Hill":`The housing area where the staff sleep, talk, and try to get a bar of cell signal. Off-limits to scouts.`,Smellables:`Scented items (deodorant, snacks, toothpaste) that attract bears. Keep them out of cabins, lock them in the Smellables Shed.`,"Code Blue":`Missing Person / Lost Camper alarm. Immediately stops all normal operations. No jokes, find the kid.`,"Code Brown":`Bear sighting. Ranger MaryLou and the Camp Director are on their way. Keep distance, look big.`,WFA:`Wilderness First Aid. The specialized training that teaches you what to do when you are hours away from an ambulance.`},Z=null;function vt(){document.getElementById(`global-glossary-tooltip`)||(Z=document.createElement(`div`),Z.id=`global-glossary-tooltip`,Z.className=`glossary-tooltip-bubble`,document.body.appendChild(Z))}function yt(e,t){Z||vt(),Z.textContent=e,Z.classList.add(`visible`);let n=t.getBoundingClientRect(),r=Z.offsetWidth||260,i=Z.offsetHeight||80,a=n.left+n.width/2-r/2,o=n.top-i-12;a<10&&(a=10),a+r>window.innerWidth-10&&(a=window.innerWidth-r-10),o<10&&(o=n.bottom+12),Z.style.left=`${a}px`,Z.style.top=`${o}px`}function bt(){Z&&Z.classList.remove(`visible`)}function xt(e){e.querySelectorAll(`.glossary-term`).forEach(e=>{let t=_t[e.getAttribute(`data-term`)];t&&(e.addEventListener(`mouseenter`,()=>yt(t,e)),e.addEventListener(`mouseleave`,bt),e.addEventListener(`touchstart`,n=>{n.preventDefault(),yt(t,e)}),e.addEventListener(`touchend`,()=>{setTimeout(bt,3e3)}))})}var St;function Ct(){let e=document.getElementById(`view-mount-point`);if(!e)return;St=new MutationObserver(n=>{St.disconnect(),wt(e),t()});function t(){St.observe(e,{childList:!0,subtree:!0})}t()}function wt(e){if(!e)return;let t=Object.keys(_t),n=RegExp(`\\b(${t.map(e=>i(e)).join(`|`)})\\b`,`gi`);function r(e){if(e.nodeType===Node.TEXT_NODE){let r=e.parentNode;if(!r)return;let i=r.tagName.toLowerCase();if([`script`,`style`,`button`,`input`,`textarea`,`select`,`option`,`a`,`dialog`,`h1`,`h2`,`h3`,`h4`].includes(i)||r.closest(`.glossary-term`)||r.closest(`#global-search-dropdown`)||r.closest(`.theme-toggle-btn`)||r.closest(`.quick-helpline-bar`))return;let a=e.nodeValue;if(n.test(a)){let i=document.createElement(`span`);n.lastIndex=0,i.innerHTML=a.replace(n,e=>`<span class="glossary-term" data-term="${t.find(t=>t.toLowerCase()===e.toLowerCase())||e}">${e}</span>`),r.replaceChild(i,e)}}else if(e.nodeType===Node.ELEMENT_NODE){let t=e.tagName.toLowerCase();[`script`,`style`,`button`,`input`,`textarea`,`select`,`a`,`dialog`,`h1`,`h2`,`h3`,`h4`].includes(t)||Array.from(e.childNodes).forEach(r)}}function i(e){return e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`)}r(e),xt(e)}function Tt(e){e&&(`closedBy`in HTMLDialogElement.prototype||e.addEventListener(`click`,t=>{if(t.target!==e)return;let n=e.getBoundingClientRect();n.top<=t.clientY&&t.clientY<=n.top+n.height&&n.left<=t.clientX&&t.clientX<=n.left+n.width||e.close()}))}var Q=`login`;function $(e=``){let t=document.getElementById(`profile-dialog-content`);if(t)if(!G.username)t.innerHTML=`
      <button class="dialog-close-btn" id="profile-dialog-close" aria-label="Close dialog">✕</button>
      <h3 style="margin-bottom: 20px; font-family: var(--font-heading); color: hsl(var(--primary)); text-align: center; font-size: 22px;">Camp Staff Gateway</h3>
      
      <div style="display: flex; border-bottom: 1px solid hsl(var(--border)); margin-bottom: 20px;">
        <button id="tab-login" class="schedule-tab-btn ${Q===`login`?`active`:``}" style="flex: 1; padding: 10px; font-weight: 600; cursor: pointer;">Log In</button>
        <button id="tab-signup" class="schedule-tab-btn ${Q===`signup`?`active`:``}" style="flex: 1; padding: 10px; font-weight: 600; cursor: pointer;">Sign Up</button>
      </div>

      ${e?`<div style="color: hsl(var(--danger)); background: hsl(var(--danger) / 0.1); padding: 10px; border-radius: var(--radius-sm); font-size: 13.5px; font-weight: 600; margin-bottom: 16px; border: 1px dashed hsl(var(--danger));">${e}</div>`:``}

      ${Q===`login`?`
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label for="login-username" style="font-size: 14px; font-weight: 500;">Username</label>
            <input type="text" id="login-username" placeholder="Enter username" style="padding: 10px 14px; border: 1px solid hsl(var(--border)); border-radius: var(--radius-sm); font-size: 15px; background: var(--glass-bg); color: inherit;" />
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label for="login-password" style="font-size: 14px; font-weight: 500;">Password</label>
            <input type="password" id="login-password" placeholder="Enter password" style="padding: 10px 14px; border: 1px solid hsl(var(--border)); border-radius: var(--radius-sm); font-size: 15px; background: var(--glass-bg); color: inherit;" />
          </div>
          <button id="auth-login-submit" class="welcome-banner-btn" style="width: 100%; padding: 12px; margin-top: 10px; font-weight: 700;">Log In to Portal</button>
        </div>
      `:`
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label for="signup-username" style="font-size: 14px; font-weight: 500;">Username</label>
            <input type="text" id="signup-username" placeholder="Choose username" style="padding: 10px 14px; border: 1px solid hsl(var(--border)); border-radius: var(--radius-sm); font-size: 15px; background: var(--glass-bg); color: inherit;" />
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label for="signup-password" style="font-size: 14px; font-weight: 500;">Password</label>
            <input type="password" id="signup-password" placeholder="Choose password" style="padding: 10px 14px; border: 1px solid hsl(var(--border)); border-radius: var(--radius-sm); font-size: 15px; background: var(--glass-bg); color: inherit;" />
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label for="signup-role" style="font-size: 14px; font-weight: 500;">Camp Program Area / Role</label>
            <select id="signup-role" style="padding: 10px 14px; border: 1px solid hsl(var(--border)); border-radius: var(--radius-sm); font-size: 15px; background: var(--glass-bg); color: hsl(var(--foreground)); width: 100%;">
              <option value="Staff">General Staff</option>
              <option value="Scoutcraft">Scoutcraft Instructor</option>
              <option value="Nature">Nature / Ecology Instructor</option>
              <option value="Shooting Sports">Shooting Sports Director</option>
              <option value="Handicraft">Handicraft Instructor</option>
              <option value="CIT">Counselor in Training (CIT)</option>
              <option value="Ranger">Camp Ranger</option>
              <option value="Medic">Health Officer / Medic</option>
              <option value="Program Director">Program Director</option>
              <option value="Camp Director">Camp Director</option>
            </select>
          </div>
          <button id="auth-signup-submit" class="welcome-banner-btn" style="width: 100%; padding: 12px; margin-top: 10px; font-weight: 700;">Create Staff Account</button>
        </div>
      `}
    `,document.getElementById(`profile-dialog-close`).addEventListener(`click`,()=>J.close()),document.getElementById(`tab-login`).addEventListener(`click`,()=>{Q=`login`,$()}),document.getElementById(`tab-signup`).addEventListener(`click`,()=>{Q=`signup`,$()}),Q===`login`?document.getElementById(`auth-login-submit`).addEventListener(`click`,Et):document.getElementById(`auth-signup-submit`).addEventListener(`click`,Dt);else{let e=G.completedTasks.length,n=Math.round(e/5*100);t.innerHTML=`
      <button class="dialog-close-btn" id="profile-dialog-close" aria-label="Close dialog">✕</button>
      <h3 style="margin-bottom: 16px; font-family: var(--font-heading); color: hsl(var(--primary)); font-size: 22px;">Staff Profile</h3>
      
      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px; background: hsl(var(--secondary) / 0.3); padding: 16px; border-radius: var(--radius-md); border: 1px solid hsl(var(--border));">
        <div style="width: 50px; height: 50px; border-radius: 50%; background: hsl(var(--primary)); color: white; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 800; font-family: var(--font-heading);">
          ${G.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h4 style="font-size: 18px; margin: 0; color: hsl(var(--foreground));">${G.username}</h4>
          <span style="font-size: 13.5px; color: hsl(var(--accent)); font-weight: 700;">${G.role}</span>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; font-size: 14.5px;">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid hsl(var(--border) / 0.5); padding-bottom: 8px;">
          <span style="color: hsl(var(--muted-foreground));">Readiness Tasks:</span>
          <span style="font-weight: 700; color: ${n===100?`hsl(var(--success))`:`inherit`};">${e}/5 (${n}%)</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid hsl(var(--border) / 0.5); padding-bottom: 8px;">
          <span style="color: hsl(var(--muted-foreground));">Code of Conduct:</span>
          <span style="font-weight: 700;">${G.signedConduct?`✅ Signed`:`❌ Unsigned`}</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid hsl(var(--border) / 0.5); padding-bottom: 8px;">
          <span style="color: hsl(var(--muted-foreground));">Water Logged:</span>
          <span style="font-weight: 700;">🥤 ${G.wamCount} WAMs</span>
        </div>
      </div>

      <button id="auth-logout" class="welcome-banner-btn" style="width: 100%; padding: 12px; background: hsl(var(--danger) / 0.1); border: 1px solid hsl(var(--danger) / 0.3); color: hsl(var(--danger)); font-weight: 700; transition: all 0.2s; cursor: pointer;">
        👋 Log Out
      </button>
    `,document.getElementById(`profile-dialog-close`).addEventListener(`click`,()=>J.close()),document.getElementById(`auth-logout`).addEventListener(`click`,()=>{G.logout(),$(),J.close()})}}async function Et(){let e=document.getElementById(`login-username`),t=document.getElementById(`login-password`);if(!e||!t)return;let n=e.value.trim(),r=t.value;if(!n||!r){$(`Please fill in all fields.`);return}try{await H.login(n,r),G.syncUser(),J.close()}catch(e){$(e.message||`Invalid username or password.`)}}async function Dt(){let e=document.getElementById(`signup-username`),t=document.getElementById(`signup-password`),n=document.getElementById(`signup-role`);if(!e||!t||!n)return;let r=e.value.trim(),i=t.value,a=n.value;if(!r||!i){$(`Please fill in all fields.`);return}if(r.length<3){$(`Username must be at least 3 characters.`);return}try{await H.register(r,i,a),await H.login(r,i),G.syncUser(),J.close()}catch(e){$(e.message||`Error creating account.`)}}document.addEventListener(`DOMContentLoaded`,()=>{K=document.getElementById(`view-title`),rt=document.getElementById(`view-subtitle`),q=document.getElementById(`view-mount-point`),it=document.querySelectorAll(`.nav-item`),at=document.getElementById(`theme-toggle`),ot=document.getElementById(`user-avatar`),st=document.getElementById(`user-name-display`),ct=document.getElementById(`user-badge`),J=document.getElementById(`profile-dialog`),document.getElementById(`profile-dialog-close`),document.getElementById(`profile-name-input`),document.getElementById(`profile-save-btn`),Y=document.getElementById(`app-dialog`),lt=document.getElementById(`dialog-close`),ut(),tt(),ft(),X(`dashboard`),it.forEach(e=>{e.addEventListener(`click`,()=>{X(e.getAttribute(`data-view`))})}),at.addEventListener(`click`,dt),ct.addEventListener(`click`,()=>{J&&($(),J.showModal())}),lt.addEventListener(`click`,mt),Tt(Y),Tt(J),vt(),Ct();let e=document.getElementById(`global-search-input`),t=document.getElementById(`global-search-dropdown`);e&&t&&(e.addEventListener(`input`,()=>{let n=e.value.trim().toLowerCase();if(!n){t.style.display=`none`,t.innerHTML=``;return}let r=ht.filter(e=>e.title.toLowerCase().includes(n)||e.snippet.toLowerCase().includes(n));if(r.sort((e,t)=>e.isSafety&&!t.isSafety?-1:!e.isSafety&&t.isSafety?1:0),r.length===0){t.innerHTML=`<div style="font-size: 13px; color: hsl(var(--muted-foreground)); padding: 12px; text-align: center; font-weight: 500;">No results found for "${gt(n)}"</div>`,t.style.display=`block`;return}t.innerHTML=r.map(e=>`
        <div class="search-result-item" data-view-id="${e.viewId}" data-tab-id="${e.tabId||``}">
          <span class="search-result-title">${gt(e.title)}</span>
          <span class="search-result-snippet">${gt(e.snippet)}</span>
          <span class="search-result-badge ${e.isSafety?`safety`:``}">${e.isSafety?`🚨 SAFETY`:`📖 GENERAL`}</span>
        </div>
      `).join(``),t.style.display=`block`,t.querySelectorAll(`.search-result-item`).forEach(n=>{n.addEventListener(`click`,()=>{let r=n.getAttribute(`data-view-id`),i=n.getAttribute(`data-tab-id`);e.value=``,t.style.display=`none`,r===`camplawton`&&i?xe(i):r===`policies`&&i?Ae(i):r===`onboarding`&&i&&D(i),X(r)})})}),document.addEventListener(`click`,n=>{!e.contains(n.target)&&!t.contains(n.target)&&(t.style.display=`none`)}));let n=document.getElementById(`quick-emergency-btn`);n&&n.addEventListener(`click`,()=>{Ae(`safety`),X(`policies`)});function r(){let e=new Date().getHours();if(e>=12&&e<14){if(!document.documentElement.classList.contains(`siesta-mode`)&&(document.documentElement.classList.add(`siesta-mode`),document.documentElement.setAttribute(`data-theme`,`dark`),!document.getElementById(`siesta-banner`))){let e=document.createElement(`div`);e.id=`siesta-banner`,e.style.cssText=`position: fixed; top: 0; left: 0; right: 0; background: #8b5cf6; color: white; text-align: center; padding: 8px; z-index: 10000; font-family: var(--font-heading); font-weight: 800; font-size: 14px;`,e.innerText=`🧘 SIESTA REBOOT ACTIVE: Low-stimulus mode engaged. Please rest quietly in your quarters until 2:00 PM.`,document.body.prepend(e)}}else if(document.documentElement.classList.contains(`siesta-mode`)){document.documentElement.classList.remove(`siesta-mode`);let e=localStorage.getItem(`lawton_theme`)||`light`;document.documentElement.setAttribute(`data-theme`,e);let t=document.getElementById(`siesta-banner`);t&&t.remove()}}r(),setInterval(r,6e4),`serviceWorker`in navigator&&window.navigator.serviceWorker.register(`/sw.js`).then(e=>console.log(`Service Worker registered successfully:`,e.scope)).catch(e=>console.log(`Service Worker registration failed:`,e))});