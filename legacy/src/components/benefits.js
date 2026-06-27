import { benefitsPlans } from '../data/handbookData.js';

export function renderBenefits() {
  return `
    <div class="benefits-layout">
      <!-- Calculators Section -->
      <div class="benefits-section">
        
        <!-- PTO Accrual Simulator -->
        <div class="glass-panel" style="display: flex; flex-direction: column; gap: 20px;">
          <h3 style="color: hsl(var(--primary)); font-size: 18px; display: flex; align-items: center; gap: 8px;">
            <span>📅</span> Vacation Accrual Simulator
          </h3>
          
          <div class="accrual-slider-group">
            <div class="accrual-slider-label">
              <span>Months of Service</span>
              <span id="pto-months-val" style="color: hsl(var(--primary)); font-weight: 700;">1 Month</span>
            </div>
            <input type="range" min="1" max="12" value="1" class="slider-input" id="pto-months-slider" aria-label="Months of service slider" />
          </div>

          <div class="accrual-slider-group">
            <div class="accrual-slider-label">
              <span>Days Taken / Scheduled</span>
              <span id="pto-taken-val" style="color: hsl(var(--primary)); font-weight: 700;">0 Days</span>
            </div>
            <input type="range" min="0" max="25" value="0" class="slider-input" id="pto-taken-slider" aria-label="Days of vacation taken slider" />
          </div>

          <div class="accrual-display-grid">
            <div class="accrual-metric-box">
              <span class="accrual-metric-val" id="pto-accrued">1.7</span>
              <span class="accrual-metric-lbl">Total Accrued</span>
            </div>
            <div class="accrual-metric-box" id="pto-remaining-box">
              <span class="accrual-metric-val" id="pto-remaining">1.7</span>
              <span class="accrual-metric-lbl">Remaining Balance</span>
            </div>
          </div>
          
          <p style="font-size: 12.5px; color: hsl(var(--muted-foreground)); line-height: 1.4; border-top: 1px solid hsl(var(--border) / 0.5); padding-top: 12px;">
            ℹ️ You accrue <strong>1.67 days</strong> of PTO per month (~20 days/year). A maximum of <strong>5 unused days</strong> can carry over into the next calendar year.
          </p>
        </div>

        <!-- Medical Plan selector -->
        <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px;">
          <h3 style="color: hsl(var(--primary)); font-size: 18px;">🛡️ Health Insurance Options</h3>
          <div class="plan-selector-grid" id="medical-plan-mount">
            <!-- Dynamically populated -->
          </div>
        </div>

        <!-- Dental Plan selector -->
        <div class="glass-panel" style="display: flex; flex-direction: column; gap: 16px;">
          <h3 style="color: hsl(var(--primary)); font-size: 18px;">🦷 Dental Coverage</h3>
          <div class="plan-selector-grid" id="dental-plan-mount">
            <!-- Dynamically populated -->
          </div>
        </div>

      </div>

      <!-- Paycheck Calculator Chart -->
      <div class="glass-panel paycheck-summary-card">
        <h3 style="font-size: 18px; border-bottom: 1px solid hsl(var(--border)); padding-bottom: 10px;">
          Estimated Monthly Paycheck
        </h3>
        
        <div style="text-align: center; margin: 10px 0;">
          <span style="font-size: 12px; color: hsl(var(--muted-foreground)); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Net Take-Home Pay</span>
          <h2 style="font-size: 40px; font-weight: 800; font-family: var(--font-heading); color: hsl(var(--success)); margin-top: 4px;" id="paycheck-net-val">
            $5,943.75
          </h2>
          <span style="font-size: 12.5px; color: hsl(var(--muted-foreground));">based on standard $8,000.00 gross salary</span>
        </div>

        <!-- Horizontal stacked bar chart -->
        <div class="paycheck-bar-chart">
          <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; color: hsl(var(--muted-foreground));">
            <span>Deductions & Take-Home</span>
            <span id="paycheck-total-gross">$8,000.00</span>
          </div>
          
          <div class="paycheck-bar">
            <div class="bar-segment-takehome" id="bar-takehome" style="width: 74%;"></div>
            <div class="bar-segment-medical" id="bar-medical" style="width: 1.5%;"></div>
            <div class="bar-segment-dental" id="bar-dental" style="width: 0.5%;"></div>
            <div class="bar-segment-tax" id="bar-tax" style="width: 24%;"></div>
          </div>
        </div>

        <!-- Breakdown Details list -->
        <div class="paycheck-legend">
          <!-- Take home -->
          <div class="legend-item">
            <div class="legend-label-wrapper">
              <div class="legend-dot takehome"></div>
              <span class="legend-label">Net Take-Home</span>
            </div>
            <span class="legend-value" id="legend-takehome-val">$5,943.75</span>
          </div>
          <!-- Medical premium -->
          <div class="legend-item">
            <div class="legend-label-wrapper">
              <div class="legend-dot medical"></div>
              <span class="legend-label">Medical Plan Premium</span>
            </div>
            <span class="legend-value" id="legend-medical-val">$45.00</span>
          </div>
          <!-- Dental premium -->
          <div class="legend-item">
            <div class="legend-label-wrapper">
              <div class="legend-dot dental"></div>
              <span class="legend-label">Dental Plan Premium</span>
            </div>
            <span class="legend-value" id="legend-dental-val">$15.00</span>
          </div>
          <!-- Estimated Taxes -->
          <div class="legend-item">
            <div class="legend-label-wrapper">
              <div class="legend-dot tax"></div>
              <span class="legend-label">Estimated Tax (25%)</span>
            </div>
            <span class="legend-value" id="legend-tax-val">$1,996.25</span>
          </div>
        </div>

      </div>
    </div>
  `;
}

export function initBenefits() {
  const monthsSlider = document.getElementById('pto-months-slider');
  const takenSlider = document.getElementById('pto-taken-slider');
  const monthsVal = document.getElementById('pto-months-val');
  const takenVal = document.getElementById('pto-taken-val');
  const accruedDisplay = document.getElementById('pto-accrued');
  const remainingDisplay = document.getElementById('pto-remaining');
  const remainingBox = document.getElementById('pto-remaining-box');

  const medicalMount = document.getElementById('medical-plan-mount');
  const dentalMount = document.getElementById('dental-plan-mount');

  let selectedMedicalId = 'med-basic';
  let selectedDentalId = 'dent-standard';

  // Gross settings
  const baseSalary = 8000;
  const taxRate = 0.25;

  if (!monthsSlider || !takenSlider) return;

  // Render health plans
  function renderHealthPlans() {
    if (medicalMount) {
      medicalMount.innerHTML = benefitsPlans.medical.map(plan => `
        <div class="plan-option-card ${plan.id === selectedMedicalId ? 'selected' : ''}" data-plan-id="${plan.id}" data-type="medical">
          <div class="plan-radio"></div>
          <div class="plan-details">
            <span class="plan-name">${plan.name}</span>
            <span class="plan-desc">${plan.description}</span>
          </div>
          <span class="plan-cost">${plan.cost === 0 && plan.id === 'med-waive' ? '+$50 Credit' : `$${plan.cost}/mo`}</span>
        </div>
      `).join('');

      medicalMount.querySelectorAll('.plan-option-card').forEach(card => {
        card.addEventListener('click', () => {
          selectedMedicalId = card.getAttribute('data-plan-id');
          renderHealthPlans();
          updatePaycheck();
        });
      });
    }

    if (dentalMount) {
      dentalMount.innerHTML = benefitsPlans.dental.map(plan => `
        <div class="plan-option-card ${plan.id === selectedDentalId ? 'selected' : ''}" data-plan-id="${plan.id}" data-type="dental">
          <div class="plan-radio"></div>
          <div class="plan-details">
            <span class="plan-name">${plan.name}</span>
            <span class="plan-desc">${plan.description}</span>
          </div>
          <span class="plan-cost">$${plan.cost}/mo</span>
        </div>
      `).join('');

      dentalMount.querySelectorAll('.plan-option-card').forEach(card => {
        card.addEventListener('click', () => {
          selectedDentalId = card.getAttribute('data-plan-id');
          renderHealthPlans();
          updatePaycheck();
        });
      });
    }
  }

  // Paycheck computation
  function updatePaycheck() {
    const medPlan = benefitsPlans.medical.find(p => p.id === selectedMedicalId);
    const dentPlan = benefitsPlans.dental.find(p => p.id === selectedDentalId);

    const medCost = medPlan ? medPlan.cost : 0;
    const dentCost = dentPlan ? dentPlan.cost : 0;
    
    // Waive medical gives 50 credit
    let gross = baseSalary;
    if (selectedMedicalId === 'med-waive') {
      gross += 50;
    }

    // pre-tax health premium calculations
    const medicalPreTaxDeduction = medCost;
    const dentalPreTaxDeduction = dentCost;
    const taxableIncome = Math.max(0, gross - medicalPreTaxDeduction - dentalPreTaxDeduction);
    const taxes = taxableIncome * taxRate;
    const netPay = taxableIncome - taxes;

    // UI elements
    const netValDisplay = document.getElementById('paycheck-net-val');
    const grossDisplay = document.getElementById('paycheck-total-gross');
    const takehomeLegend = document.getElementById('legend-takehome-val');
    const medicalLegend = document.getElementById('legend-medical-val');
    const dentalLegend = document.getElementById('legend-dental-val');
    const taxLegend = document.getElementById('legend-tax-val');

    const barTakehome = document.getElementById('bar-takehome');
    const barMedical = document.getElementById('bar-medical');
    const barDental = document.getElementById('bar-dental');
    const barTax = document.getElementById('bar-tax');

    // Update numbers
    if (netValDisplay) netValDisplay.textContent = `$${netPay.toFixed(2)}`;
    if (grossDisplay) grossDisplay.textContent = `$${gross.toFixed(2)}`;
    if (takehomeLegend) takehomeLegend.textContent = `$${netPay.toFixed(2)}`;
    if (medicalLegend) medicalLegend.textContent = `$${medicalPreTaxDeduction.toFixed(2)}`;
    if (dentalLegend) dentalLegend.textContent = `$${dentalPreTaxDeduction.toFixed(2)}`;
    if (taxLegend) taxLegend.textContent = `$${taxes.toFixed(2)}`;

    // Update chart segments based on percentages
    const pctTakehome = (netPay / gross) * 100;
    const pctMedical = (medicalPreTaxDeduction / gross) * 100;
    const pctDental = (dentalPreTaxDeduction / gross) * 100;
    const pctTax = (taxes / gross) * 100;

    if (barTakehome) barTakehome.style.width = `${pctTakehome}%`;
    if (barMedical) barMedical.style.width = `${pctMedical}%`;
    if (barDental) barDental.style.width = `${pctDental}%`;
    if (barTax) barTax.style.width = `${pctTax}%`;
  }

  // PTO calculations
  function updatePTO() {
    const months = parseInt(monthsSlider.value);
    const taken = parseInt(takenSlider.value);

    // Update sliders label displays
    monthsVal.textContent = months === 1 ? '1 Month' : `${months} Months`;
    takenVal.textContent = taken === 1 ? '1 Day' : `${taken} Days`;

    // Calculate accrued days: 1.67 per month
    const accrued = months * benefitsPlans.vacationAccrual.daysPerMonth;
    const remaining = accrued - taken;

    accruedDisplay.textContent = accrued.toFixed(1);
    remainingDisplay.textContent = remaining.toFixed(1);

    // Set styling based on positive/negative remaining balance
    if (remaining < 0) {
      remainingBox.style.borderColor = 'hsl(var(--danger) / 0.5)';
      remainingBox.style.background = 'hsl(var(--danger) / 0.05)';
      remainingDisplay.style.color = 'hsl(var(--danger))';
    } else {
      remainingBox.style.borderColor = 'hsl(var(--border) / 0.5)';
      remainingBox.style.background = 'hsl(var(--secondary) / 0.5)';
      remainingDisplay.style.color = 'hsl(var(--primary))';
    }
  }

  // Slider events
  monthsSlider.addEventListener('input', () => {
    updatePTO();
  });

  takenSlider.addEventListener('input', () => {
    updatePTO();
  });

  // Render & Compute initial state
  renderHealthPlans();
  updatePTO();
  updatePaycheck();
}
