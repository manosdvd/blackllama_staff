import { state } from '../main.js';

const applicationSchema = {
  steps: [
    { id: 'sec1', title: 'Demographics & Eligibility' },
    { id: 'sec2', title: 'Position & Operations' },
    { id: 'sec3', title: 'Experience & Education' },
    { id: 'sec4', title: 'Essential Functions' },
    { id: 'sec5', title: 'Agreements & Signature' }
  ]
};

let currentStep = 0;
let formData = JSON.parse(localStorage.getItem('camp_lawton_app_draft')) || {};

export function render(mountPoint) {
  mountPoint.innerHTML = `
    <div style="max-width: 800px; margin: 0 auto; padding-bottom: 60px;">
      
      <!-- Progress Bar -->
      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 30px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h2 style="color: hsl(var(--primary)); font-family: var(--font-heading); font-size: 24px;">Staff Application</h2>
          <span style="font-size: 14px; color: hsl(var(--muted-foreground)); font-weight: 500;">Step ${currentStep + 1} of 5</span>
        </div>
        <div style="height: 8px; background: hsl(var(--border)); border-radius: 4px; overflow: hidden; position: relative;">
          <div style="position: absolute; top: 0; left: 0; height: 100%; width: ${(currentStep / 4) * 100}%; background: hsl(var(--primary)); transition: width 0.4s ease; border-radius: 4px;"></div>
        </div>
      </div>

      <!-- Form Container -->
      <div class="glass-panel" style="animation: tabFadeIn 0.4s ease;">
        <form id="application-form" style="display: flex; flex-direction: column; gap: 24px;">
          <div id="step-content"></div>
          
          <div style="display: flex; justify-content: space-between; margin-top: 20px; border-top: 1px solid hsl(var(--border)); padding-top: 20px;">
            <button type="button" id="app-prev-btn" class="welcome-banner-btn" style="background: hsl(var(--secondary)); color: hsl(var(--foreground)); ${currentStep === 0 ? 'visibility: hidden;' : ''}">Back</button>
            <button type="button" id="app-next-btn" class="welcome-banner-btn">${currentStep === 4 ? 'Sign & Submit' : 'Next Section'}</button>
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
        <h3 style="color: hsl(var(--foreground)); margin-bottom: 16px;">Section I: Demographics & Legal Eligibility</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          ${inputField('First Name', 'firstName')}
          ${inputField('Last Name', 'lastName')}
          ${inputField('Preferred Name / Nickname', 'nickname')}
          ${inputField('Phone Number', 'phone', 'tel')}
        </div>
        ${inputField('Email Address', 'email', 'email')}
        ${inputField('Primary Address', 'address')}
        
        <h4 style="margin-top: 16px; color: hsl(var(--primary));">Age Eligibility (as of June 1, 2026)</h4>
        <select id="ageEligibility" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: hsl(var(--foreground)); width: 100%;">
          <option value="">Select Age Group...</option>
          <option value="14" ${formData.ageEligibility === '14' ? 'selected' : ''}>14-15 years old (CIT Minimum)</option>
          <option value="16" ${formData.ageEligibility === '16' ? 'selected' : ''}>16-17 years old (Junior Staff)</option>
          <option value="18" ${formData.ageEligibility === '18' ? 'selected' : ''}>18-20 years old (Adult Status)</option>
          <option value="21" ${formData.ageEligibility === '21' ? 'selected' : ''}>21+ years old (Camp Management)</option>
        </select>

        ${checkboxField('workAuth', 'I am legally authorized to work in the United States (Proof required upon hire).')}
        ${checkboxField('scoutReg', 'I am currently registered with Scouting America OR agree to register if hired.')}
      `;
      break;
    case 1:
      html = `
        <h3 style="color: hsl(var(--foreground)); margin-bottom: 16px;">Section II: Position Preferences</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          ${inputField('Available Start Date', 'startDate', 'date')}
          ${inputField('Available End Date', 'endDate', 'date')}
        </div>
        
        <h4 style="margin-top: 16px; color: hsl(var(--primary));">Top Position Preferences</h4>
        ${inputField('1st Choice', 'pref1')}
        ${inputField('2nd Choice', 'pref2')}
        ${inputField('3rd Choice', 'pref3')}

        <h4 style="margin-top: 16px; color: hsl(var(--primary));">Uniform Sizing</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <select id="shirtSize" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: hsl(var(--foreground));">
            <option value="">T-Shirt Size...</option>
            ${['S','M','L','XL','2XL','3XL'].map(s => `<option value="${s}" ${formData.shirtSize === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
          <select id="jacketSize" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: hsl(var(--foreground));">
            <option value="">Jacket Size...</option>
            ${['S','M','L','XL','2XL','3XL'].map(s => `<option value="${s}" ${formData.jacketSize === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </div>
      `;
      break;
    case 2:
      html = `
        <h3 style="color: hsl(var(--foreground)); margin-bottom: 16px;">Section III: Experience & References</h3>
        ${inputField('Current Scouting Rank (if any)', 'scoutRank')}
        ${checkboxField('oaMember', 'I am an Order of the Arrow Member')}
        
        <h4 style="margin-top: 16px; color: hsl(var(--primary));">Previous Employment / Camp Staff</h4>
        ${inputField('Most Recent Employer / Camp', 'employer')}
        ${inputField('Primary Duties / Role', 'duties')}
        
        <h4 style="margin-top: 16px; color: hsl(var(--primary));">Professional References (Need 3)</h4>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${inputField('Reference 1 (Name, Relation, Contact)', 'ref1')}
          ${inputField('Reference 2 (Name, Relation, Contact)', 'ref2')}
          ${inputField('Reference 3 (Name, Relation, Contact)', 'ref3')}
        </div>
      `;
      break;
    case 3:
      html = `
        <h3 style="color: hsl(var(--foreground)); margin-bottom: 16px;">Section IV: Essential Functions</h3>
        <p style="font-size: 14px; color: hsl(var(--muted-foreground)); margin-bottom: 16px;">
          Camp Lawton is located at 8,000 feet elevation. By checking these boxes, you acknowledge the essential functions of the role.
        </p>
        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${checkboxField('ackAltitude', '<strong>High-Altitude & Terrain:</strong> I understand this requires physical exertion and navigating rugged terrain.')}
          ${checkboxField('ackWildlife', '<strong>Wildlife & Smellables:</strong> I agree to strictly adhere to the camp wildlife protocols.')}
          ${checkboxField('ackSanitation', '<strong>Water & Sanitation:</strong> I acknowledge water scarcity, shower limits, and that duties include cleaning latrines.')}
          ${checkboxField('ackMedical', '<strong>Medical Clearances:</strong> I must provide a current BSA Annual Health Record (Parts A, B, and C) upon hire.')}
        </div>
        <h4 style="margin-top: 16px; color: hsl(var(--primary));">Current Certifications</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          ${checkboxField('certCPR', 'CPR / AED')}
          ${checkboxField('certWFA', 'Wilderness First Aid')}
        </div>
      `;
      break;
    case 4:
      html = `
        <h3 style="color: hsl(var(--foreground)); margin-bottom: 16px;">Section V: Agreements & Signature</h3>
        <div style="background: hsl(var(--secondary)); padding: 16px; border-radius: var(--radius-sm); margin-bottom: 16px; font-size: 13.5px; display: flex; flex-direction: column; gap: 10px;">
          <p><strong>BSA Code of Conduct:</strong> I agree to conduct myself in accordance with the Scout Oath and Scout Law.</p>
          <p><strong>Substance Abuse:</strong> Zero-tolerance policy regarding alcohol, illegal drugs, and unauthorized meds.</p>
          <p><strong>At-Will Employment:</strong> Employment may be terminated at any time with or without cause.</p>
        </div>
        ${checkboxField('ackAgreements', 'I agree to the above terms and certify all provided info is accurate.')}
        
        <div style="margin-top: 20px;">
          ${inputField('Digital Signature (Type Full Legal Name)', 'signature')}
          ${inputField('Date', 'sigDate', 'date')}
        </div>
      `;
      break;
  }
  container.innerHTML = html;

  // Restore input values
  container.querySelectorAll('input, select').forEach(el => {
    if (el.type === 'checkbox') {
      el.checked = formData[el.id] || false;
    } else {
      el.value = formData[el.id] || '';
    }
  });
}

function attachListeners() {
  const form = document.getElementById('application-form');
  const prevBtn = document.getElementById('app-prev-btn');
  const nextBtn = document.getElementById('app-next-btn');

  const saveState = () => {
    form.querySelectorAll('input, select').forEach(el => {
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
    if (currentStep > 0) {
      currentStep--;
      render(document.getElementById('view-mount-point'));
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentStep < 4) {
      currentStep++;
      render(document.getElementById('view-mount-point'));
    } else {
      submitApplication();
    }
  });
}

function submitApplication() {
  if (!formData.signature || !formData.ackAgreements) {
    alert("Please provide a digital signature and check the agreement box before submitting.");
    return;
  }

  // Save to the database
  const applications = JSON.parse(localStorage.getItem('camp_lawton_applications') || '[]');
  const newApp = {
    id: 'app_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    username: state.username || 'guest',
    submittedAt: new Date().toISOString(),
    status: 'Pending',
    formData: { ...formData }
  };
  
  const existingIdx = applications.findIndex(app => app.username.toLowerCase() === newApp.username.toLowerCase());
  if (existingIdx > -1) {
    applications[existingIdx] = newApp;
  } else {
    applications.push(newApp);
  }
  
  localStorage.setItem('camp_lawton_applications', JSON.stringify(applications));

  // Clear draft
  localStorage.removeItem('camp_lawton_app_draft');
  formData = {};
  currentStep = 0;

  // Dispatch custom event to notify other parts of the app
  window.dispatchEvent(new CustomEvent('camp-application-submitted', { detail: newApp }));

  // Show Success Screen
  const mount = document.getElementById('view-mount-point');
  mount.innerHTML = `
    <div class="glass-panel" style="max-width: 600px; margin: 40px auto; text-align: center; animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
      <div style="font-size: 64px; margin-bottom: 20px;">🎉</div>
      <h2 style="color: hsl(var(--primary)); font-family: var(--font-heading); margin-bottom: 12px; font-size: 28px;">Application Submitted!</h2>
      <p style="color: hsl(var(--muted-foreground)); line-height: 1.6; margin-bottom: 24px;">
        Thank you for applying to Camp Lawton! Your application for the 2026 season has been received. Our leadership team will review your details and contact you shortly.
      </p>
      <button class="welcome-banner-btn" onclick="document.getElementById('nav-btn-dashboard').click()">Return to Dashboard</button>
    </div>
  `;
}

// Helpers
function inputField(label, id, type='text') {
  return `
    <div style="display: flex; flex-direction: column; gap: 6px;">
      <label for="${id}" style="font-size: 14px; font-weight: 500;">${label}</label>
      <input type="${type}" id="${id}" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: var(--glass-bg); color: hsl(var(--foreground)); width: 100%;" />
    </div>
  `;
}

function checkboxField(id, labelHtml) {
  return `
    <label style="display: flex; gap: 10px; align-items: flex-start; cursor: pointer; font-size: 14.5px;">
      <input type="checkbox" id="${id}" style="margin-top: 4px; accent-color: hsl(var(--primary)); width: 16px; height: 16px;" />
      <span style="color: hsl(var(--foreground)); line-height: 1.4;">${labelHtml}</span>
    </label>
  `;
}
