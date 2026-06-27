import { campLawtonQuiz } from '../data/handbookData.js';
import { state, navigateTo } from '../main.js';

export function renderQuiz() {
  return `
    <div class="quiz-container">
      <div class="glass-panel" id="quiz-mount">
        <!-- Renders dynamically -->
      </div>
    </div>
  `;
}

export function initQuiz() {
  const mount = document.getElementById('quiz-mount');
  if (!mount) return;

  let currentQuestionIdx = 0;
  let correctAnswersCount = 0;
  let selectedOptionIdx = null;
  let userAnswersHistory = []; // Track user selections for the review board

  function renderQuestion() {
    const total = campLawtonQuiz.length;
    const question = campLawtonQuiz[currentQuestionIdx];
    const progressPct = (currentQuestionIdx / total) * 100;

    mount.innerHTML = `
      <div class="quiz-header">
        <span>Question ${currentQuestionIdx + 1} of ${total}</span>
        <span>Score: ${correctAnswersCount}/${total}</span>
      </div>
      
      <div class="quiz-progress-bar-bg" style="margin: 12px 0 24px 0;">
        <div class="quiz-progress-bar-fill" style="width: ${progressPct}%;"></div>
      </div>

      <div class="quiz-question-box">
        <h3 class="quiz-question-text">${question.question}</h3>
        
        <div class="quiz-options-list">
          ${question.options.map((option, idx) => `
            <button class="quiz-option-btn" data-option-idx="${idx}" aria-label="Option ${idx + 1}: ${option}">
              ${option}
            </button>
          `).join('')}
        </div>

        <div id="quiz-feedback-mount" style="display: none;"></div>

        <div class="quiz-action-bar" style="display: none;" id="quiz-next-bar">
          <button class="quiz-next-btn" id="quiz-next-btn">
            ${currentQuestionIdx === total - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      </div>
    `;

    // Option clicks
    const optionBtns = mount.querySelectorAll('.quiz-option-btn');
    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (selectedOptionIdx !== null) return;
        const idx = parseInt(btn.getAttribute('data-option-idx'));
        handleOptionSelection(idx);
      });
    });
  }

  function handleOptionSelection(selectedIdx) {
    selectedOptionIdx = selectedIdx;
    userAnswersHistory[currentQuestionIdx] = selectedIdx;
    
    const question = campLawtonQuiz[currentQuestionIdx];
    const isCorrect = selectedIdx === question.answerIndex;

    if (isCorrect) {
      correctAnswersCount++;
    }

    const optionBtns = mount.querySelectorAll('.quiz-option-btn');
    optionBtns.forEach((btn, idx) => {
      if (idx === question.answerIndex) {
        btn.classList.add('correct');
      } else if (idx === selectedIdx) {
        btn.classList.add('incorrect');
      }
      btn.disabled = true;
    });

    const feedbackMount = document.getElementById('quiz-feedback-mount');
    if (feedbackMount) {
      feedbackMount.style.display = 'block';
      feedbackMount.innerHTML = `
        <div class="quiz-feedback-box">
          <span class="quiz-feedback-title ${isCorrect ? 'correct' : 'incorrect'}">
            ${isCorrect ? '✨ Correct!' : '❌ Incorrect'}
          </span>
          <p style="font-weight: 500; font-size: 13.5px; line-height: 1.4; margin-top: 4px;">${question.explanation}</p>
        </div>
      `;
    }

    const nextBar = document.getElementById('quiz-next-bar');
    if (nextBar) {
      nextBar.style.display = 'flex';
      const nextBtn = document.getElementById('quiz-next-btn');
      if (nextBtn) {
        nextBtn.addEventListener('click', navigateNext);
      }
    }
  }

  function navigateNext() {
    selectedOptionIdx = null;
    currentQuestionIdx++;
    
    if (currentQuestionIdx < campLawtonQuiz.length) {
      renderQuestion();
    } else {
      renderCompletionScreen();
    }
  }

  function renderCompletionScreen() {
    const total = campLawtonQuiz.length;
    const scorePct = Math.round((correctAnswersCount / total) * 100);
    const isCertified = scorePct >= 80;

    // Clear readiness checklist item if passed
    if (isCertified) {
      if (!state.completedTasks.includes('checklist-5')) {
        state.toggleTask('checklist-5');
      }
    }

    // Compute incorrect review list
    const incorrectQuestions = campLawtonQuiz.filter((q, idx) => userAnswersHistory[idx] !== q.answerIndex);
    let reviewHtml = '';

    if (incorrectQuestions.length > 0) {
      reviewHtml = `
        <div class="quiz-review-board" style="margin-top: 24px; text-align: left; width: 100%; display: flex; flex-direction: column; gap: 16px;">
          <h3 style="font-size: 18px; font-weight: 700; color: hsl(var(--danger)); border-bottom: 2px solid hsl(var(--border)); padding-bottom: 8px; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
            <span>📚</span> Study Review Board (${incorrectQuestions.length} Incorrect Answers)
          </h3>
          <p style="font-size: 13.5px; color: hsl(var(--muted-foreground)); line-height: 1.5; margin-bottom: 8px;">
            Review the correct answers and explanations below to consolidate your camp safety knowledge:
          </p>
          <div style="display: flex; flex-direction: column; gap: 14px; width: 100%;">
            ${incorrectQuestions.map(q => {
              const userIdx = userAnswersHistory[q.id - 1];
              const userAns = userIdx !== undefined ? q.options[userIdx] : 'No Answer';
              const correctAns = q.options[q.answerIndex];
              return `
                <div class="glass-panel" style="padding: 16px; border-left: 4px solid hsl(var(--danger)); display: flex; flex-direction: column; gap: 8px; background: hsl(var(--card));">
                  <h4 style="font-weight: 700; font-size: 14px; line-height: 1.4;">Q${q.id}: ${q.question}</h4>
                  <div style="font-size: 13px;">
                    <span style="color: hsl(var(--danger)); font-weight: bold;">❌ Your Answer:</span> ${userAns}
                  </div>
                  <div style="font-size: 13px;">
                    <span style="color: hsl(var(--success)); font-weight: bold;">✅ Correct Answer:</span> ${correctAns}
                  </div>
                  <div style="font-size: 12.5px; font-style: italic; color: hsl(var(--muted-foreground)); margin-top: 6px; line-height: 1.4; padding: 10px; background: hsl(var(--secondary) / 0.4); border-radius: var(--radius-sm);">
                    ℹ️ <strong>Handbook Explanation:</strong> ${q.explanation}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    } else {
      reviewHtml = `
        <div class="glass-panel" style="margin-top: 24px; text-align: center; color: hsl(var(--success)); font-weight: 700; padding: 20px; background: hsl(var(--success-light) / 0.1); border: 1px dashed hsl(var(--success) / 0.3);">
          ✨ Perfect score! You answered every question correctly on the first attempt!
        </div>
      `;
    }

    mount.innerHTML = `
      <div class="quiz-complete-card" style="display: flex; flex-direction: column; align-items: center; width: 100%; text-align: center;">
        <div class="quiz-badge-graphic" style="margin-bottom: 16px;">
          ${isCertified ? '🏆' : '📚'}
        </div>
        
        <h2 class="quiz-complete-title" style="font-size: 24px; font-weight: 800; font-family: var(--font-heading); margin-bottom: 4px;">
          ${isCertified ? 'Congratulations!' : 'Review & Retry'}
        </h2>
        
        <div style="font-size: 16px; font-weight: 700; color: hsl(var(--primary)); margin-bottom: 12px;">
          You scored ${correctAnswersCount} out of ${total} (${scorePct}%)
        </div>

        <p class="quiz-complete-desc" style="max-width: 550px; font-size: 14.5px; color: hsl(var(--muted-foreground)); line-height: 1.5; margin-bottom: 20px;">
          ${isCertified 
            ? `Excellent job${state.username ? ', ' + state.username : ''}! You have proven a strong command of Camp Lawton safety rules, emergency alarm protocols, hydration, and mandatory Arizona state reporting laws. You are officially certified for summer staff!`
            : `You need at least 80% (8 out of 10 correct) to earn your Camp Lawton certification badge. Review the safety guides, schedule details, and the study review board below, then try again!`
          }
        </p>

        <div style="display: flex; gap: 14px; margin-bottom: 24px;">
          <button class="quiz-restart-btn" id="quiz-restart-btn" style="padding: 10px 20px; border-radius: var(--radius-sm); font-weight: 700; cursor: pointer;">Try Quiz Again</button>
          ${isCertified ? `<button class="welcome-banner-btn" id="quiz-dashboard-btn" style="padding: 10px 20px;">Back to Dashboard</button>` : ''}
        </div>

        <!-- Inject detailed review board -->
        ${reviewHtml}
      </div>
    `;

    document.getElementById('quiz-restart-btn').addEventListener('click', () => {
      currentQuestionIdx = 0;
      correctAnswersCount = 0;
      selectedOptionIdx = null;
      userAnswersHistory = [];
      renderQuestion();
    });

    if (isCertified) {
      document.getElementById('quiz-dashboard-btn').addEventListener('click', () => {
        navigateTo('dashboard');
      });
    }
  }

  // Draw first question
  renderQuestion();
}
