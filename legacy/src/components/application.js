import { state } from '../main.js';
import { api } from '../services/apiClient.js';

let currentStep = 0;
let formData = JSON.parse(localStorage.getItem('camp_lawton_app_draft')) || {};

// Helper to determine if applicant is a minor based on birthdate
function isMinorApplicant() {
  if (!formData.birthdate) return false;
  const birthDate = new Date(formData.birthdate);
  const campDate = new Date('2026-06-01'); // Age as of June 1, 2026
  let age = campDate.getFullYear() - birthDate.getFullYear();
  const m = campDate.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && campDate.getDate() < birthDate.getDate())) {
    age--;
  }
  return age < 18;
}

export async function syncPendingApplications() {
  if (!navigator.onLine) return;
  const pending = JSON.parse(localStorage.getItem('camp_lawton_pending_submissions') || '[]');
  if (pending.length === 0) return;

  console.log('Reconnected! Attempting to synchronize pending offline submissions...');
  
  for (const app of pending) {
    try {
      if (app.username) {
        await api.submitApplication(app.formData);
      }
      
      // Remove from pending submissions
      const currentPending = JSON.parse(localStorage.getItem('camp_lawton_pending_submissions') || '[]');
      const updatedPending = currentPending.filter(a => a.id !== app.id);
      localStorage.setItem('camp_lawton_pending_submissions', JSON.stringify(updatedPending));

      // Append to official applications list in local storage
      const appsList = JSON.parse(localStorage.getItem('camp_lawton_applications') || '[]');
      const syncedApp = {
        ...app,
        status: 'Pending',
        submittedAt: new Date().toISOString()
      };
      
      const existingIdx = appsList.findIndex(a => a.username.toLowerCase() === syncedApp.username.toLowerCase());
      if (existingIdx > -1) {
        appsList[existingIdx] = syncedApp;
      } else {
        appsList.push(syncedApp);
      }
      localStorage.setItem('camp_lawton_applications', JSON.stringify(appsList));
      console.log(`Auto-synchronized pending application for @${app.username} successfully!`);
      
      // Dispatch custom event to notify dashboard
      window.dispatchEvent(new CustomEvent('camp-application-submitted', { detail: syncedApp }));
    } catch (err) {
      console.error('Failed to sync pending application online:', err);
    }
  }
}

// Register auto sync on online event
window.addEventListener('online', syncPendingApplications);

export function render(mountPoint) {
  // Clear any existing errors
  localStorage.setItem('camp_lawton_app_draft', JSON.stringify(formData));

  // Run initial pending sync check if online
  syncPendingApplications();

  const isOffline = !navigator.onLine;
  const nextBtnText = currentStep === 4 
    ? (isOffline ? 'Queue Offline Submission 📥' : 'Sign & Submit Application 💾') 
    : 'Next Section';

  mountPoint.innerHTML = `
    <div style="max-width: 800px; margin: 0 auto; padding-bottom: 60px;">
      
      <!-- Progress Indicator -->
      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 30px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h2 style="color: hsl(var(--primary)); font-family: var(--font-heading); font-size: 26px; margin: 0;">2026 Staff Application Portal</h2>
          <span style="font-size: 14px; color: hsl(var(--muted-foreground)); font-weight: 600;">Step ${currentStep + 1} of 5</span>
        </div>
        <div style="display: flex; gap: 8px;">
          ${[
            'I: Personal Details',
            'II: Preferences & Size',
            'III: Experience & Refs',
            'IV: Safety & Certs',
            'V: Agreements'
          ].map((title, idx) => {
            const activeStyle = idx <= currentStep 
              ? 'background: hsl(var(--primary)); color: white;' 
              : 'background: hsl(var(--secondary) / 0.3); color: hsl(var(--muted-foreground));';
            return `
              <div style="flex: 1; text-align: center; font-size: 11px; padding: 6px 4px; border-radius: var(--radius-sm); font-weight: 700; ${activeStyle}">
                ${title}
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Validation Error Display -->
      <div id="validation-error-alert" style="display: none; color: hsl(var(--danger)); background: hsl(var(--danger) / 0.1); border: 1px dashed hsl(var(--danger)); padding: 12px; border-radius: var(--radius-sm); font-size: 13.5px; font-weight: 700; margin-bottom: 20px;"></div>

      <!-- Form Container -->
      <div class="glass-panel" style="animation: tabFadeIn 0.3s ease; padding: 30px;">
        <form id="application-form" style="display: flex; flex-direction: column; gap: 24px;" onsubmit="return false;">
          <div id="step-content"></div>
          
          <!-- Local Draft & Network Sync Status Banner -->
          <div style="display: flex; justify-content: space-between; align-items: center; background: hsl(var(--secondary) / 0.1); border: 1px solid hsl(var(--border) / 0.4); padding: 10px 16px; border-radius: var(--radius-sm); font-size: 12.5px; margin-top: 10px; flex-wrap: wrap; gap: 8px;">
            <span style="color: hsl(var(--success)); font-weight: 600; display: flex; align-items: center; gap: 6px;">
              <span>💾</span> Draft auto-saved on this device (Not submitted yet)
            </span>
            <span id="app-network-badge" style="font-weight: 700; color: ${isOffline ? 'var(--safety-red)' : 'hsl(var(--success))'};">
              ${isOffline ? '⚠️ Offline Mode — Cannot submit directly' : '📡 System Online — Ready to submit'}
            </span>
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 15px; border-top: 1px solid hsl(var(--border) / 0.5); padding-top: 15px;">
            <button type="button" id="app-prev-btn" class="glass-btn" style="padding: 10px 20px; font-weight:600; ${currentStep === 0 ? 'visibility: hidden;' : ''}">Back</button>
            <button type="button" id="app-next-btn" class="welcome-banner-btn" style="padding: 10px 24px; font-weight:700;">${nextBtnText}</button>
          </div>
        </form>
      </div>
    </div>
  `;

  renderStep(document.getElementById('step-content'));
  attachListeners();
}

function renderStep(container) {
  let html = '';
  switch(currentStep) {
    case 0:
      html = `
        <h3 style="color: hsl(var(--primary)); margin-top:0; margin-bottom: 16px; font-family: var(--font-heading); font-size:22px; border-bottom: 1px solid hsl(var(--border) / 0.3); padding-bottom: 8px;">Section I: Identity, Demographics & Eligibility</h3>
        
        <h4 style="color: hsl(var(--accent)); margin-bottom: 12px; font-size: 15px;">1. Applicant Demographics</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          ${inputField('First Name *', 'firstName')}
          ${inputField('Last Name *', 'lastName')}
          ${inputField('Preferred Nickname', 'nickname')}
          ${inputField('Primary Phone Number *', 'phone', 'tel')}
        </div>
        ${inputField('Email Address *', 'email', 'email')}
        ${inputField('Primary Mailing Address *', 'address')}
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 12px;">
          ${inputField('Last 4 of SSN * (For payroll match)', 'ssn_last4', 'password', 'maxlength="4" pattern="[0-9]{4}" placeholder="xxxx"')}
          ${inputField('BSA Member ID (If registered)', 'bsaID')}
        </div>

        <h4 style="color: hsl(var(--accent)); margin-top: 24px; margin-bottom: 12px; font-size: 15px;">2. Age Eligibility</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: flex-end;">
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label for="birthdate" style="font-size: 13.5px; font-weight: 500;">Birth Date *</label>
            <input type="date" id="birthdate" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: hsl(var(--foreground)); width: 100%;" />
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label for="ageEligibility" style="font-size: 13.5px; font-weight: 500;">Age Classification (as of June 1, 2026) *</label>
            <select id="ageEligibility" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: hsl(var(--foreground)); width: 100%;">
              <option value="">Select Age Group...</option>
              <option value="14" ${formData.ageEligibility === '14' ? 'selected' : ''}>14-15 years old (CIT / Volunteer)</option>
              <option value="16" ${formData.ageEligibility === '16' ? 'selected' : ''}>16-17 years old (Junior Staff)</option>
              <option value="18" ${formData.ageEligibility === '18' ? 'selected' : ''}>18-20 years old (Adult Staff)</option>
              <option value="21" ${formData.ageEligibility === '21' ? 'selected' : ''}>21+ years old (Camp Management)</option>
            </select>
          </div>
        </div>

        <!-- Conditional Minor Form Section -->
        <div id="minor-section" style="display: ${isMinorApplicant() ? 'block' : 'none'}; background: hsl(var(--secondary) / 0.2); border: 1px dashed hsl(var(--border)); border-radius: var(--radius-sm); padding: 18px; margin-top: 20px;">
          <h4 style="color: hsl(var(--danger)); margin-top: 0; margin-bottom: 12px; font-size: 14.5px; font-weight: 700;">🛡️ Minor Applicant - Parent/Guardian Verification Required</h4>
          <p style="font-size: 12.5px; color: hsl(var(--muted-foreground)); margin: 0 0 14px 0; line-height: 1.4;">
            Applicants under 18 must provide legal guardian details. Digital signature by parent is required on Section V.
          </p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            ${inputField('Parent/Guardian Full Name *', 'parentName')}
            ${inputField('Parent/Guardian Phone *', 'parentPhone', 'tel')}
          </div>
          <div style="margin-top: 12px;">
            ${inputField('Parent/Guardian Email Address *', 'parentEmail', 'email')}
          </div>
        </div>

        <h4 style="color: hsl(var(--accent)); margin-top: 24px; margin-bottom: 12px; font-size: 15px;">3. Authorizations</h4>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${checkboxField('workAuth', 'I am legally authorized to work in the United States. (Federal I-9 compliance check required on site) *')}
          ${checkboxField('scoutReg', 'I am currently registered with Scouting America OR agree to register if hired.')}
        </div>

        <div id="scouting-reg-details" style="display: ${formData.scoutReg ? 'block' : 'none'}; border-left: 3px solid hsl(var(--primary)); padding-left: 14px; margin-top: 12px; display: flex; flex-direction: column; gap: 12px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
            ${inputField('Unit Type & No. (e.g. Troop 102)', 'scoutUnit')}
            ${inputField('Council (e.g. Catalina Council)', 'scoutCouncil')}
            ${inputField('Current Leadership Role', 'scoutPosition')}
          </div>
        </div>
      `;
      break;
    case 1:
      html = `
        <h3 style="color: hsl(var(--primary)); margin-top: 0; margin-bottom: 16px; font-family: var(--font-heading); font-size: 22px; border-bottom: 1px solid hsl(var(--border) / 0.3); padding-bottom: 8px;">Section II: Availability, Preferences & Uniforms</h3>
        
        <h4 style="color: hsl(var(--accent)); margin-bottom: 12px; font-size: 15px;">1. Summer Schedule Availability</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          ${inputField('Available Start Date *', 'startDate', 'date')}
          ${inputField('Available End Date *', 'endDate', 'date')}
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 12px;">
          <label for="arrivalNotes" style="font-size: 13.5px; font-weight: 500;">Late arrival / early departure reasons (if any)</label>
          <textarea id="arrivalNotes" placeholder="Explain school conflicts, family trips, or other date exceptions..." style="min-height: 70px; padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: inherit; line-height: 1.4; outline: none;">${formData.arrivalNotes || ''}</textarea>
        </div>

        <h4 style="color: hsl(var(--accent)); margin-top: 24px; margin-bottom: 12px; font-size: 15px;">2. Staff Position Preferences</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label for="pref1" style="font-size: 13.5px; font-weight: 500;">1st Choice *</label>
            <select id="pref1" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: hsl(var(--foreground));">
              <option value="">Select choice...</option>
              ${['Area Director', 'Scoutcraft Instructor', 'Nature Instructor', 'Shooting Sports Instructor', 'Handicraft Instructor', 'CIT / Volunteer', 'Kitchen Staff', 'Maintenance / Ranger Helper', 'Office / Trading Post Clerical'].map(p => `<option value="${p}" ${formData.pref1 === p ? 'selected' : ''}>${p}</option>`).join('')}
            </select>
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label for="pref2" style="font-size: 13.5px; font-weight: 500;">2nd Choice *</label>
            <select id="pref2" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: hsl(var(--foreground));">
              <option value="">Select choice...</option>
              ${['Area Director', 'Scoutcraft Instructor', 'Nature Instructor', 'Shooting Sports Instructor', 'Handicraft Instructor', 'CIT / Volunteer', 'Kitchen Staff', 'Maintenance / Ranger Helper', 'Office / Trading Post Clerical'].map(p => `<option value="${p}" ${formData.pref2 === p ? 'selected' : ''}>${p}</option>`).join('')}
            </select>
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label for="pref3" style="font-size: 13.5px; font-weight: 500;">3rd Choice</label>
            <select id="pref3" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: hsl(var(--foreground));">
              <option value="">Select choice...</option>
              ${['Area Director', 'Scoutcraft Instructor', 'Nature Instructor', 'Shooting Sports Instructor', 'Handicraft Instructor', 'CIT / Volunteer', 'Kitchen Staff', 'Maintenance / Ranger Helper', 'Office / Trading Post Clerical'].map(p => `<option value="${p}" ${formData.pref3 === p ? 'selected' : ''}>${p}</option>`).join('')}
            </select>
          </div>
        </div>

        <h4 style="color: hsl(var(--accent)); margin-top: 24px; margin-bottom: 12px; font-size: 15px;">3. Programmatic Area Expertise</h4>
        <p style="font-size:12.5px; color:hsl(var(--muted-foreground)); margin: 0 0 10px 0;">Check all areas where you have personal experience, skills, or interest:</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; font-size: 13.5px;">
          ${checkboxField('expScoutcraft', 'Scoutcraft / Knots / Camping')}
          ${checkboxField('expNature', 'Nature / Ecology / Weather')}
          ${checkboxField('expShooting', 'Shooting Sports (Rifle/Archery)')}
          ${checkboxField('expAquatics', 'Aquatics / Lifeguarding')}
          ${checkboxField('expHandicraft', 'Handicraft / Art / Crafts')}
          ${checkboxField('expClimbing', 'Climbing / High Ropes')}
          ${checkboxField('expFirstAid', 'First Aid / Medical Emergency')}
          ${checkboxField('expOffice', 'Business / Office Admin')}
          ${checkboxField('expCooking', 'Cooking / Food Prep')}
        </div>

        <h4 style="color: hsl(var(--accent)); margin-top: 24px; margin-bottom: 12px; font-size: 15px;">4. Uniform Sizing</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label for="shirtSize" style="font-size: 13.5px; font-weight: 500;">T-Shirt Sizing *</label>
            <select id="shirtSize" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: hsl(var(--foreground));">
              <option value="">T-Shirt Size...</option>
              ${['S','M','L','XL','2XL','3XL'].map(s => `<option value="${s}" ${formData.shirtSize === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label for="jacketSize" style="font-size: 13.5px; font-weight: 500;">Jacket Sizing *</label>
            <select id="jacketSize" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: hsl(var(--foreground));">
              <option value="">Jacket Size...</option>
              ${['S','M','L','XL','2XL','3XL'].map(s => `<option value="${s}" ${formData.jacketSize === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>
        </div>
      `;
      break;
    case 2:
      html = `
        <h3 style="color: hsl(var(--primary)); margin-top: 0; margin-bottom: 16px; font-family: var(--font-heading); font-size: 22px; border-bottom: 1px solid hsl(var(--border) / 0.3); padding-bottom: 8px;">Section III: Scouting, Employment & References</h3>
        
        <h4 style="color: hsl(var(--accent)); margin-bottom: 12px; font-size: 15px;">1. Scouting Background</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          ${inputField('Highest Scouting Rank Achieved', 'scoutRank')}
          <div style="display:flex; align-items:center; height: 100%;">
            ${checkboxField('oaMember', 'Order of the Arrow Member')}
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 12px;">
          <label for="scoutingExp" style="font-size: 13.5px; font-weight: 500;">Describe Scouting Leadership roles & training</label>
          <textarea id="scoutingExp" placeholder="e.g. SPL for 1 year, NYLT graduate, Eagle Scout project description..." style="min-height: 70px; padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: inherit; line-height: 1.4; outline: none;">${formData.scoutingExp || ''}</textarea>
        </div>

        <h4 style="color: hsl(var(--accent)); margin-top: 24px; margin-bottom: 12px; font-size: 15px;">2. Work & Camp Experience</h4>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label for="campExp" style="font-size: 13.5px; font-weight: 500;">Previous Camp Staff Experience (Camps, positions, years)</label>
            <textarea id="campExp" placeholder="e.g. Camp Lawton CIT (2024), Scoutcraft Instructor (2025)..." style="min-height: 60px; padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: inherit; line-height: 1.4; outline: none;">${formData.campExp || ''}</textarea>
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label for="employmentExp" style="font-size: 13.5px; font-weight: 500;">General Employment History (Employer, role, dates)</label>
            <textarea id="employmentExp" placeholder="e.g. Part-time cashier at Target (Sep 2025 - Present)..." style="min-height: 60px; padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: inherit; line-height: 1.4; outline: none;">${formData.employmentExp || ''}</textarea>
          </div>
        </div>

        <h4 style="color: hsl(var(--accent)); margin-top: 24px; margin-bottom: 12px; font-size: 15px;">3. Education & Skills</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          ${inputField('School / University Level', 'school')}
          ${inputField('Extracurricular Activities & Skills', 'extracurriculars')}
        </div>

        <h4 style="color: hsl(var(--accent)); margin-top: 24px; margin-bottom: 12px; font-size: 15px;">4. Character References (Need 3) *</h4>
        <p style="font-size:12.5px; color:hsl(var(--muted-foreground)); margin: 0 0 10px 0;">Please provide name, relationship, phone/email, and years known for three references.</p>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${inputField('Reference 1 (Full Contact info) *', 'ref1Details', 'text', 'placeholder="e.g. John Doe, Scoutmaster, 520-555-0199, 4 years"')}
          ${inputField('Reference 2 (Full Contact info) *', 'ref2Details', 'text', 'placeholder="e.g. Jane Smith, Teacher, jane.smith@email.com, 2 years"')}
          ${inputField('Reference 3 (Full Contact info) *', 'ref3Details', 'text', 'placeholder="e.g. Pastor David, Religious Leader, 520-555-9988, 5 years"')}
        </div>
      `;
      break;
    case 3:
      html = `
        <h3 style="color: hsl(var(--primary)); margin-top: 0; margin-bottom: 16px; font-family: var(--font-heading); font-size: 22px; border-bottom: 1px solid hsl(var(--border) / 0.3); padding-bottom: 8px;">Section IV: Essential Functions & Safety Certifications</h3>
        
        <p style="font-size: 13.5px; color: hsl(var(--muted-foreground)); margin-bottom: 18px; line-height: 1.5;">
          Camp Lawton is situated at 8,000 feet of elevation in remote mountain terrain. To ensure the safety of our scouts and staff, check each box to acknowledge the physical and environmental requirements:
        </p>
        
        <h4 style="color: hsl(var(--accent)); margin-bottom: 12px; font-size: 15px;">1. Environmental Acknowledgements *</h4>
        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${checkboxField('ackAltitude', '<strong>Elevation & Climate:</strong> I acknowledge that camp operates at 8,000 feet, which requires physical exertion under strong mountain sun and low oxygen conditions.')}
          ${checkboxField('ackTerrain', '<strong>Terrain & Travel:</strong> I agree to travel on steep, rugged mountain pathways daily, sometimes carrying equipment.')}
          ${checkboxField('ackWildlife', '<strong>Smellables & Bears:</strong> I agree to strictly adhere to the camp bear and wildlife prevention smellables storage rules.')}
          ${checkboxField('ackSanitation', '<strong>Sanitation & Work duties:</strong> I agree that my role includes general campsite sanitation, cleaning latrines (KYBOs), and trash removal duties.')}
          ${checkboxField('ackMedical', '<strong>Medical Clearance:</strong> I certify that I will provide a completed BSA Annual Health Record (Parts A, B, and C) signed by a physician before arrival.')}
        </div>

        <h4 style="color: hsl(var(--accent)); margin-top: 24px; margin-bottom: 12px; font-size: 15px;">2. Life-Safety Certifications</h4>
        ${checkboxField('ackCertsRequired', 'I understand that certain program roles require active certifications before camp begins (Lifeguarding, CPR, WFA, etc.) *')}
        
        <p style="font-size:12.5px; color:hsl(var(--muted-foreground)); margin: 12px 0 8px 0;">Check all active certifications you currently hold:</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13.5px;">
          ${checkboxField('certCPR', 'First Aid / CPR / AED')}
          ${checkboxField('certWFA', 'Wilderness First Aid (WFA)')}
          ${checkboxField('certLGT', 'BSA Lifeguard / LGT')}
          ${checkboxField('certShooting', 'NRA Range Safety Officer / Archery')}
        </div>
      `;
      break;
    case 4:
      html = `
        <h3 style="color: hsl(var(--primary)); margin-top: 0; margin-bottom: 16px; font-family: var(--font-heading); font-size: 22px; border-bottom: 1px solid hsl(var(--border) / 0.3); padding-bottom: 8px;">Section V: Disclosures, Agreements & Signatures</h3>
        
        <h4 style="color: hsl(var(--accent)); margin-bottom: 12px; font-size: 15px;">1. Legal Disclosures & Agreements *</h4>
        <div style="background: hsl(var(--secondary) / 0.15); border: 1px solid hsl(var(--border) / 0.4); padding: 18px; border-radius: var(--radius-sm); margin-bottom: 18px; font-size: 13.5px; display: flex; flex-direction: column; gap: 12px; line-height: 1.5;">
          <div><strong>Background Checks:</strong> I consent to Scouting America performing a criminal background check and sex offender registry verification as a condition of membership/employment.</div>
          <div><strong>Substance Policy:</strong> I agree to comply with the camp\'s drug-free policy. Posessing or being under the influence of alcohol, illegal drugs, or unauthorized medications is grounds for immediate dismissal.</div>
          <div><strong>At-Will Employment:</strong> Employment is at-will. Either the employee or the council may terminate the relationship at any time, for any reason.</div>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
          ${checkboxField('ackBackgroundCheck', 'I consent to criminal background checks and sex offender verification *')}
          ${checkboxField('ackDrugPolicy', 'I agree to the zero-tolerance substance policy *')}
          ${checkboxField('ackAtWill', 'I acknowledge the terms of at-will employment *')}
          ${checkboxField('ackAgreements', 'I certify that all statements in this application are true and complete *')}
        </div>

        <h4 style="color: hsl(var(--accent)); margin-bottom: 12px; font-size: 15px;">2. Applicant Digital Signature *</h4>
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px;">
          ${inputField('Applicant Digital Signature (Type Legal Name) *', 'signature')}
          ${inputField('Signature Date *', 'sigDate', 'date')}
        </div>

        <!-- Conditional Minor Parent Signature Section -->
        <div id="minor-signature-section" style="display: ${isMinorApplicant() ? 'block' : 'none'}; background: hsl(var(--secondary) / 0.2); border: 1px dashed hsl(var(--border)); border-radius: var(--radius-sm); padding: 18px; margin-top: 20px;">
          <h4 style="color: hsl(var(--danger)); margin-top: 0; margin-bottom: 10px; font-size: 14.5px; font-weight: 700;">🛡️ Parent/Guardian Joint Signature Required</h4>
          <p style="font-size: 12.5px; color: hsl(var(--muted-foreground)); margin: 0 0 14px 0; line-height: 1.4;">
            Because the applicant is under 18, a parent or legal guardian must review this application and co-sign below:
          </p>
          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px;">
            ${inputField('Parent/Guardian Digital Signature (Type Legal Name) *', 'parentSignature')}
            ${inputField('Parent Signature Date *', 'parentSigDate', 'date')}
          </div>
        </div>
      `;
      break;
  }
  container.innerHTML = html;

  // Restore input values
  container.querySelectorAll('input, select, textarea').forEach(el => {
    if (el.type === 'checkbox') {
      el.checked = formData[el.id] || false;
    } else {
      el.value = formData[el.id] || '';
    }
  });

  // Re-bind minor toggle on birthdate change in step 0
  if (currentStep === 0) {
    const bdate = document.getElementById('birthdate');
    if (bdate) {
      bdate.addEventListener('input', () => {
        formData.birthdate = bdate.value;
        const minorSec = document.getElementById('minor-section');
        if (minorSec) {
          minorSec.style.display = isMinorApplicant() ? 'block' : 'none';
        }
      });
    }

    const regChk = document.getElementById('scoutReg');
    if (regChk) {
      regChk.addEventListener('change', () => {
        const details = document.getElementById('scouting-reg-details');
        if (details) {
          details.style.display = regChk.checked ? 'block' : 'none';
        }
      });
    }
  }
}

function validateCurrentStep() {
  const errBox = document.getElementById('validation-error-alert');
  if (errBox) errBox.style.display = 'none';

  let errors = [];

  if (currentStep === 0) {
    // Demographics
    if (!formData.firstName) errors.push('First Name is required.');
    if (!formData.lastName) errors.push('Last Name is required.');
    if (!formData.phone) errors.push('Phone Number is required.');
    if (!formData.email) errors.push('Email Address is required.');
    if (!formData.address) errors.push('Mailing Address is required.');
    if (!formData.ssn_last4 || formData.ssn_last4.length !== 4) errors.push('Last 4 digits of SSN are required.');
    if (!formData.birthdate) errors.push('Birth Date is required.');
    if (!formData.ageEligibility) errors.push('Age Classification is required.');
    if (!formData.workAuth) errors.push('You must verify work authorization eligibility.');

    // Conditional Minor validation
    if (isMinorApplicant()) {
      if (!formData.parentName) errors.push('Parent/Guardian Name is required for minors.');
      if (!formData.parentPhone) errors.push('Parent/Guardian Phone is required for minors.');
      if (!formData.parentEmail) errors.push('Parent/Guardian Email is required for minors.');
    }
  } 
  
  else if (currentStep === 1) {
    // Availability & Preferences
    if (!formData.startDate) errors.push('Available Start Date is required.');
    if (!formData.endDate) errors.push('Available End Date is required.');
    if (!formData.pref1) errors.push('1st Choice Position Preference is required.');
    if (!formData.pref2) errors.push('2nd Choice Position Preference is required.');
    if (!formData.shirtSize) errors.push('T-Shirt Size is required.');
    if (!formData.jacketSize) errors.push('Jacket Size is required.');
  } 
  
  else if (currentStep === 2) {
    // Experience & Refs
    if (!formData.ref1Details) errors.push('Reference 1 contact details are required.');
    if (!formData.ref2Details) errors.push('Reference 2 contact details are required.');
    if (!formData.ref3Details) errors.push('Reference 3 contact details are required.');
  } 
  
  else if (currentStep === 3) {
    // Essential Functions
    if (!formData.ackAltitude) errors.push('You must acknowledge high-altitude requirements.');
    if (!formData.ackTerrain) errors.push('You must acknowledge mountain terrain requirements.');
    if (!formData.ackWildlife) errors.push('You must acknowledge bear/wildlife prevention rules.');
    if (!formData.ackSanitation) errors.push('You must acknowledge KYBO sanitation/cleaning duties.');
    if (!formData.ackMedical) errors.push('You must acknowledge BSA Health Record requirements.');
    if (!formData.ackCertsRequired) errors.push('You must acknowledge life-safety certifications requirements.');
  } 
  
  else if (currentStep === 4) {
    // Agreements & Signatures
    if (!formData.ackBackgroundCheck) errors.push('You must consent to background check disclosures.');
    if (!formData.ackDrugPolicy) errors.push('You must agree to the substance policy.');
    if (!formData.ackAtWill) errors.push('You must acknowledge at-will employment.');
    if (!formData.ackAgreements) errors.push('You must check the agreement certificate box.');
    if (!formData.signature) errors.push('Applicant signature is required.');
    if (!formData.sigDate) errors.push('Signature Date is required.');

    // Conditional Minor Parent Signature validation
    if (isMinorApplicant()) {
      if (!formData.parentSignature) errors.push('Parent/Guardian digital signature co-signing is required.');
      if (!formData.parentSigDate) errors.push('Parent signature co-signing date is required.');
    }
  }

  if (errors.length > 0) {
    if (errBox) {
      errBox.innerHTML = `<ul style="margin: 0; padding-left: 20px; display:flex; flex-direction:column; gap:4px;">${errors.map(e => `<li>${e}</li>`).join('')}</ul>`;
      errBox.style.display = 'block';
      const mainContent = document.querySelector('.course-content');
      if (mainContent) mainContent.scrollTop = 0;
    }
    return false;
  }

  return true;
}

function attachListeners() {
  const form = document.getElementById('application-form');
  const prevBtn = document.getElementById('app-prev-btn');
  const nextBtn = document.getElementById('app-next-btn');

  const saveState = () => {
    form.querySelectorAll('input, select, textarea').forEach(el => {
      if (el.type === 'checkbox') {
        formData[el.id] = el.checked;
      } else {
        formData[el.id] = el.value;
      }
    });
    localStorage.setItem('camp_lawton_app_draft', JSON.stringify(formData));
  };

  form.addEventListener('input', saveState);

  prevBtn.addEventListener('click', () => {
    saveState();
    if (currentStep > 0) {
      currentStep--;
      render(document.getElementById('view-mount-point'));
    }
  });

  nextBtn.addEventListener('click', () => {
    saveState();
    if (validateCurrentStep()) {
      if (currentStep < 4) {
        currentStep++;
        render(document.getElementById('view-mount-point'));
      } else {
        submitApplication();
      }
    }
  });

  // Dynamic network connection state handler in wizard UI
  const handleConnectionChange = () => {
    const isOffline = !navigator.onLine;
    const badge = document.getElementById('app-network-badge');
    if (badge) {
      badge.textContent = isOffline ? '⚠️ Offline Mode — Cannot submit directly' : '📡 System Online — Ready to submit';
      badge.style.color = isOffline ? 'var(--safety-red)' : 'hsl(var(--success))';
    }
    if (nextBtn && currentStep === 4) {
      nextBtn.textContent = isOffline ? 'Queue Offline Submission 📥' : 'Sign & Submit Application 💾';
    }
  };
  window.addEventListener('online', handleConnectionChange);
  window.addEventListener('offline', handleConnectionChange);
}

async function submitApplication() {
  const isOffline = !navigator.onLine;
  const username = state.username || 'guest';
  const appId = 'app_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  
  const appPayload = {
    id: appId,
    username: username,
    submittedAt: new Date().toISOString(),
    status: 'Pending',
    formData: { ...formData }
  };

  if (isOffline) {
    // Queue offline submission
    const pending = JSON.parse(localStorage.getItem('camp_lawton_pending_submissions') || '[]');
    pending.push(appPayload);
    localStorage.setItem('camp_lawton_pending_submissions', JSON.stringify(pending));

    // Clear draft
    localStorage.removeItem('camp_lawton_app_draft');
    formData = {};
    currentStep = 0;

    const mount = document.getElementById('view-mount-point');
    mount.innerHTML = `
      <div class="glass-panel" style="max-width: 600px; margin: 40px auto; text-align: center; padding: 40px; border-left: 4px solid var(--accent); animation: bounceIn 0.5s ease;">
        <div style="font-size: 64px; margin-bottom: 20px;">📝</div>
        <h2 style="color: hsl(var(--primary)); font-family: var(--font-heading); margin-bottom: 12px; font-size: 26px;">Application Saved Locally & Queued!</h2>
        <p style="color: hsl(var(--muted-foreground)); line-height: 1.6; margin-bottom: 24px; font-size: 14.5px;">
          Your application has been **saved locally** as a pending draft on this device because you are offline. It has **NOT** been received by the council or Camp Director yet.
        </p>
        <div style="background: hsl(var(--secondary) / 0.15); border: 1px dashed hsl(var(--border) / 0.4); padding: 18px; border-radius: var(--radius-sm); font-size: 13.5px; margin-bottom: 24px; text-align: left; line-height: 1.5; color: hsl(var(--foreground));">
          <strong>Next Steps to Complete Submission:</strong>
          <ol style="margin: 8px 0 0 20px; padding: 0; display:flex; flex-direction:column; gap:6px;">
            <li>Keep this device connected or reconnect to the internet.</li>
            <li>Once you are online, reopen this application portal. The queued draft will automatically synchronize and submit to the council registry.</li>
          </ol>
        </div>
        <button class="welcome-banner-btn" onclick="document.getElementById('nav-btn-dashboard').click()" style="padding: 10px 24px; font-weight:700;">Return to Dashboard</button>
      </div>
    `;
    return;
  }

  // Save to local storage list
  const applications = JSON.parse(localStorage.getItem('camp_lawton_applications') || '[]');
  const existingIdx = applications.findIndex(app => app.username.toLowerCase() === appPayload.username.toLowerCase());
  if (existingIdx > -1) {
    applications[existingIdx] = appPayload;
  } else {
    applications.push(appPayload);
  }
  localStorage.setItem('camp_lawton_applications', JSON.stringify(applications));

  // Sync to database
  try {
    await api.submitApplication(formData);
  } catch (err) {
    console.error('Failed to submit application to database, stored in local storage:', err);
  }

  // Clear draft
  localStorage.removeItem('camp_lawton_app_draft');
  formData = {};
  currentStep = 0;

  window.dispatchEvent(new CustomEvent('camp-application-submitted', { detail: appPayload }));

  const mount = document.getElementById('view-mount-point');
  mount.innerHTML = `
    <div class="glass-panel" style="max-width: 600px; margin: 40px auto; text-align: center; animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); padding: 40px;">
      <div style="font-size: 64px; margin-bottom: 20px;">🎉</div>
      <h2 style="color: hsl(var(--primary)); font-family: var(--font-heading); margin-bottom: 12px; font-size: 28px;">Application Submitted!</h2>
      <p style="color: hsl(var(--muted-foreground)); line-height: 1.6; margin-bottom: 24px; font-size: 14.5px;">
        Thank you for applying to Camp Lawton! Your application for the 2026 season has been received. Our leadership team will review your details and contact you shortly.
      </p>
      <button class="welcome-banner-btn" onclick="document.getElementById('nav-btn-dashboard').click()" style="padding: 10px 24px; font-weight:700;">Return to Dashboard</button>
    </div>
  `;
}

// Helpers
function inputField(label, id, type='text', extraAttrs='') {
  return `
    <div style="display: flex; flex-direction: column; gap: 6px;">
      <label for="${id}" style="font-size: 13.5px; font-weight: 500;">${label}</label>
      <input type="${type}" id="${id}" ${extraAttrs} style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: hsl(var(--foreground)); width: 100%;" />
    </div>
  `;
}

function checkboxField(id, labelHtml) {
  return `
    <label style="display: flex; gap: 10px; align-items: flex-start; cursor: pointer; font-size: 14px;">
      <input type="checkbox" id="${id}" style="margin-top: 4px; accent-color: hsl(var(--primary)); width: 16px; height: 16px;" />
      <span style="color: hsl(var(--foreground)); line-height: 1.4;">${labelHtml}</span>
    </label>
  `;
}
