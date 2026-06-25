import { packingList, onboardingData } from '../data/handbookData.js';
import { state } from '../main.js';

export function renderPacking() {
  return `
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
  `;
}

export function initPacking() {
  const mount = document.getElementById('packing-mount');
  const progressText = document.getElementById('packing-progress-val');
  const filterTabs = document.querySelectorAll('.packing-filter-tab');
  
  const conductName = document.getElementById('conduct-name-input');
  const conductSig = document.getElementById('conduct-sig-input');
  const conductDate = document.getElementById('conduct-date-input');
  const conductAgree = document.getElementById('conduct-agree-chk');
  const conductSignBtn = document.getElementById('conduct-sign-btn');
  const conductUnsignBtn = document.getElementById('conduct-unsign-btn');

  const inputsPanel = document.getElementById('signer-inputs-panel');
  const successPanel = document.getElementById('signer-success-panel');
  const signedNameVal = document.getElementById('signed-name-val');

  const paperworkMount = document.getElementById('paperwork-mount');
  const paperworkProgressText = document.getElementById('paperwork-progress-val');

  if (!mount) return;

  // Load packed and paperwork items from localStorage
  let packedItems = JSON.parse(localStorage.getItem('lawton_packed_items')) || [];
  let paperworkItems = JSON.parse(localStorage.getItem('lawton_paperwork_items')) || [];

  function savePaperworkItems() {
    localStorage.setItem('lawton_paperwork_items', JSON.stringify(paperworkItems));
    updatePaperworkProgressText();
  }

  function updatePaperworkProgressText() {
    if (!paperworkProgressText) return;
    const totalCount = onboardingData.paperwork.length;
    const packedCount = paperworkItems.length;
    paperworkProgressText.textContent = `Done: ${packedCount}/${totalCount}`;
  }

  function renderPaperwork() {
    if (!paperworkMount) return;
    paperworkMount.innerHTML = onboardingData.paperwork.map(item => {
      const isDone = paperworkItems.includes(item.id);
      return `
        <div class="packing-item-card ${isDone ? 'packed' : ''}" data-pw-id="${item.id}" role="checkbox" aria-checked="${isDone}">
          <div class="packing-item-checkbox"></div>
          <span class="packing-item-name">${item.name}</span>
        </div>
      `;
    }).join('');

    paperworkMount.querySelectorAll('.packing-item-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-pw-id');
        const index = paperworkItems.indexOf(id);
        if (index > -1) {
          paperworkItems.splice(index, 1);
          card.classList.remove('packed');
        } else {
          paperworkItems.push(id);
          card.classList.add('packed');
        }
        savePaperworkItems();
      });
    });
  }

  function savePackedItems() {
    localStorage.setItem('lawton_packed_items', JSON.stringify(packedItems));
    updateProgressText();
  }

  function updateProgressText() {
    if (!progressText) return;
    const totalCount = packingList.filter(item => item.status !== 'prohibited').length;
    const packedCount = packingList.filter(item => item.status !== 'prohibited' && packedItems.includes(item.id)).length;
    progressText.textContent = `Packed: ${packedCount}/${totalCount} items`;
  }

  function renderList(categoryFilter = 'all') {
    const filteredList = packingList.filter(item => {
      if (categoryFilter === 'all') return true;
      return item.category === categoryFilter;
    });

    mount.innerHTML = filteredList.map(item => {
      const isProhibited = item.status === 'prohibited';
      const isPacked = packedItems.includes(item.id);

      return `
        <div class="packing-item-card ${isPacked && !isProhibited ? 'packed' : ''} ${isProhibited ? 'prohibited' : ''}" data-item-id="${item.id}" role="checkbox" aria-checked="${isPacked}">
          <div class="packing-item-checkbox"></div>
          <span class="packing-item-name">${item.name}</span>
        </div>
      `;
    }).join('');

    // Bind card clicks
    mount.querySelectorAll('.packing-item-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-item-id');
        const item = packingList.find(p => p.id === id);
        
        if (item && item.status !== 'prohibited') {
          const index = packedItems.indexOf(id);
          if (index > -1) {
            packedItems.splice(index, 1);
            card.classList.remove('packed');
          } else {
            packedItems.push(id);
            card.classList.add('packed');
          }
          savePackedItems();
        }
      });
    });
  }

  // Filter clicks
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.getAttribute('data-filter');
      renderList(filter);
    });
  });

  // Code signer sync
  function syncSignerStatus() {
    if (state.signedConduct) {
      if (inputsPanel) inputsPanel.style.display = 'none';
      if (successPanel) {
        successPanel.style.display = 'flex';
        signedNameVal.textContent = state.username;
      }
    } else {
      if (inputsPanel) inputsPanel.style.display = 'flex';
      if (successPanel) successPanel.style.display = 'none';
      
      if (conductName) conductName.value = state.username;
      if (conductDate) {
        // Default to today
        const today = new Date().toISOString().split('T')[0];
        conductDate.value = today;
      }
    }
  }

  // Bind signatures
  if (conductSignBtn) {
    conductSignBtn.addEventListener('click', () => {
      const sigName = conductSig.value.trim();
      const isAgree = conductAgree.checked;

      if (!sigName) {
        alert('Please type your name in the Digital Signature field.');
        return;
      }
      if (!isAgree) {
        alert('You must check the agreement box to sign the Code of Conduct.');
        return;
      }

      state.setSignedConduct(true);
      syncSignerStatus();
    });
  }

  if (conductUnsignBtn) {
    conductUnsignBtn.addEventListener('click', () => {
      state.setSignedConduct(false);
      if (conductSig) conductSig.value = '';
      if (conductAgree) conductAgree.checked = false;
      syncSignerStatus();
    });
  }

  // Run lists
  renderList();
  renderPaperwork();
  updateProgressText();
  updatePaperworkProgressText();
  syncSignerStatus();
}
