'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GraduationCap, CheckCircle, ArrowRight, Play, Square, Plus, Trash2, Smartphone, XCircle } from 'lucide-react';

interface Question {
  q: string;
  opts: string[];
  correct: number;
  explanation: string;
}

export default function TrainingPage() {
  const [activeTab, setActiveTab] = useState<'safety' | 'campfire' | 'radio'>('safety');

  // Safety quiz state
  const [activeQuiz, setActiveQuiz] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [wrongAnswered, setWrongAnswered] = useState<boolean[]>([]);

  // Campfire Builder state
  const [bpm, setBpm] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [program, setProgram] = useState<string[]>([]);
  const [metronomeTick, setMetronomeTick] = useState(false);
  const metronomeRef = useRef<NodeJS.Timeout | null>(null);

  // Radio practice state
  const [radioScenario, setRadioScenario] = useState(0);
  const [radioAnswer, setRadioAnswer] = useState<string | null>(null);
  const [radioCorrect, setRadioCorrect] = useState<boolean | null>(null);

  const questions: Question[] = [
    {
      q: 'Under the Youth Protection Guidelines (YPT), what is the "Two-Deep Leadership" rule?',
      opts: [
        'A single leader can meet with one scout in a private cabin.',
        'At least two registered adult leaders, or one adult leader and a parent/guardian, must be present during all scouting activities.',
        'At least two youth scouts must lead every program activity.',
        'Two leaders must co-sign all payroll documents.'
      ],
      correct: 1,
      explanation: 'Two-deep leadership requires two registered adult leaders (or one leader and a parent) to ensure the safety and oversight of youth and leaders alike.'
    },
    {
      q: 'What is the correct protocol when severe lighting is observed under the "Flash-to-Bang" rule (thunder is within 30 seconds of lightning)?',
      opts: [
        'Continue program under open tents.',
        'Gather under the tallest pine trees.',
        'Immediately evacuate all scouts to fully enclosed structures (e.g. Dining Hall, offices) and wait 30 minutes after last thunder.',
        'Carry hiking poles high in the air.'
      ],
      correct: 2,
      explanation: 'Lightning requires immediate evacuation to fully enclosed structures. Wait at least 30 minutes after the last thunderclap before resuming outdoor program.'
    },
    {
      q: 'What should you do if you suspect child abuse or neglect during summer camp?',
      opts: [
        'Ignore it if it did not happen at camp.',
        'Wait until the end of the summer to write a report.',
        'Verbally tell a fellow CIT but do not log it.',
        'State law requires immediately reporting any reasonable suspicion to the Pima County Sheriff (911) or child welfare, then notifying the Camp Director.'
      ],
      correct: 3,
      explanation: 'Arizona state law mandates immediate direct reporting of suspected child abuse to law enforcement or child welfare services by all educational/scouting employees.'
    }
  ];

  const songCatalog = [
    'The Mountain Song',
    'Campfire Flicker Song',
    'Silly Songs',
    'The Green Trees Song',
    'Fast Metronome Beat'
  ];

  const radioScenarios = [
    {
      q: 'A scout has slipped on the trail near the Nature Area and twisted their ankle. Which radio channel do you use?',
      opts: ['Channel 1 (Administration & Logistics)', 'Channel 2 (Emergency & Medical Dispatch)'],
      correct: 'Channel 2 (Emergency & Medical Dispatch)',
      explanation: 'All injuries, safety evacuation, and medical situations belong strictly on Channel 2 for immediate dispatcher tracking.'
    },
    {
      q: 'Trading Post needs another case of soda cans brought down from the dry storage locker.',
      opts: ['Channel 1 (Administration & Logistics)', 'Channel 2 (Emergency & Medical Dispatch)'],
      correct: 'Channel 1 (Administration & Logistics)',
      explanation: 'Logistics, food transport, and administrative checks must reside on Channel 1 to preserve Channel 2 availability for emergency calls.'
    }
  ];

  // Metronome simulator logic
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = (60 / bpm) * 1000;
      metronomeRef.current = setInterval(() => {
        setMetronomeTick(prev => !prev);
      }, intervalMs);
    } else {
      if (metronomeRef.current) clearInterval(metronomeRef.current);
      setMetronomeTick(false);
    }

    return () => {
      if (metronomeRef.current) clearInterval(metronomeRef.current);
    };
  }, [isPlaying, bpm]);

  const handleStartQuiz = () => {
    setActiveQuiz(true);
    setScore(null);
    setCurrentQ(0);
    setSelectedOpt(null);
    setWrongAnswered([]);
  };

  const handleSelect = (idx: number) => {
    setSelectedOpt(idx);
  };

  const handleNext = () => {
    if (selectedOpt === null) return;

    const isCorrect = selectedOpt === questions[currentQ].correct;
    const updatedWrong = [...wrongAnswered, !isCorrect];
    setWrongAnswered(updatedWrong);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedOpt(null);
    } else {
      const numCorrect = updatedWrong.filter(w => !w).length;
      const pct = Math.round((numCorrect / questions.length) * 100);
      setScore(pct);
      setActiveQuiz(false);
      if (pct >= 80) {
        localStorage.setItem('camp_lawton_ypt_passed', 'true');
      }
    }
  };

  const handleAddSong = (song: string) => {
    setProgram([...program, song]);
  };

  const handleRemoveSong = (index: number) => {
    const updated = [...program];
    updated.splice(index, 1);
    setProgram(updated);
  };

  const handleRadioAnswer = (answer: string) => {
    setRadioAnswer(answer);
    const correct = answer === radioScenarios[radioScenario].correct;
    setRadioCorrect(correct);
  };

  const handleNextRadioScenario = () => {
    setRadioAnswer(null);
    setRadioCorrect(null);
    setRadioScenario((radioScenario + 1) % radioScenarios.length);
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
      
      {/* Tab Navigation header */}
      <div className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-6 border-l-4 border-emerald-800 flex flex-col gap-4">
        <h2 className="text-2xl font-black text-emerald-800 dark:text-emerald-500 font-heading tracking-wide flex items-center gap-2">
          <GraduationCap />
          <span>CAMP PROGRAM & SAFETY TRAINING</span>
        </h2>
        <div className="flex gap-1 border-t border-neutral-250/20 pt-4">
          <button
            onClick={() => setActiveTab('safety')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'safety' ? 'bg-emerald-800 text-white' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/40 text-neutral-500'
            }`}
          >
            Safety Exam
          </button>
          <button
            onClick={() => setActiveTab('campfire')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'campfire' ? 'bg-emerald-800 text-white' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/40 text-neutral-500'
            }`}
          >
            Campfire Sequencer
          </button>
          <button
            onClick={() => setActiveTab('radio')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'radio' ? 'bg-emerald-800 text-white' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/40 text-neutral-500'
            }`}
          >
            Radio Protocol Practice
          </button>
        </div>
      </div>

      {/* Tab 1: Safety Certification Exam */}
      {activeTab === 'safety' && (
        <div className="flex flex-col gap-4">
          {!activeQuiz && score === null && (
            <div className="glass-panel flex flex-col gap-4 bg-white/70 dark:bg-neutral-900/60 p-6 items-center text-center">
              <GraduationCap size={48} className="text-neutral-400" />
              <h3 className="font-extrabold text-lg text-neutral-800 dark:text-neutral-200 font-heading">
                YPT & SAFETY CERTIFICATION EXAM
              </h3>
              <p className="text-neutral-500 text-xs max-w-sm leading-relaxed">
                This module reviews two-deep leadership, mandatory reporting laws, monsoon safety, and bear protocol guidelines.
              </p>
              <button
                onClick={handleStartQuiz}
                className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors"
              >
                Start Certification Exam
              </button>
            </div>
          )}

          {activeQuiz && (
            <div className="glass-panel flex flex-col gap-5 bg-white/70 dark:bg-neutral-900/60 p-6">
              <div className="flex justify-between items-center text-xs text-neutral-400 font-bold uppercase border-b border-neutral-200 dark:border-neutral-800 pb-2">
                <span>Safety Exam</span>
                <span>Question {currentQ + 1} of {questions.length}</span>
              </div>

              <h4 className="font-bold text-neutral-850 dark:text-neutral-100 text-sm leading-relaxed">
                {questions[currentQ].q}
              </h4>

              <div className="flex flex-col gap-2">
                {questions[currentQ].opts.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold transition-all ${
                      selectedOpt === idx
                        ? 'bg-emerald-800/10 border-emerald-500 text-emerald-800 dark:text-emerald-400'
                        : 'bg-white/40 dark:bg-neutral-900/30 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-350 hover:bg-white dark:hover:bg-neutral-800/40'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={selectedOpt === null}
                className="mt-4 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-800 hover:bg-emerald-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-bold rounded-xl text-xs transition-colors"
              >
                <span>Next Question</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {score !== null && (
            <div className="glass-panel flex flex-col gap-4 bg-white/70 dark:bg-neutral-900/60 p-6 items-center text-center">
              <CheckCircle size={48} className="text-emerald-600" />
              <h3 className="font-extrabold text-xl text-neutral-900 dark:text-neutral-100 font-heading">
                Safety Exam Completed!
              </h3>
              <p className="text-xs text-neutral-500">
                Congratulations! You passed with a score of <strong className="text-emerald-600">{score}%</strong>. Your safety training certification is registered for the 2026 season.
              </p>
              <button
                onClick={handleStartQuiz}
                className="mt-2 py-2 px-5 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Retake Exam
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Campfire Planning Builder */}
      {activeTab === 'campfire' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Song catalog picker */}
          <div className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-6 flex flex-col gap-4">
            <h3 className="font-extrabold text-base text-neutral-850 dark:text-neutral-150 font-heading uppercase tracking-wide">
              Song Catalog
            </h3>
            <div className="flex flex-col gap-2">
              {songCatalog.map(song => (
                <button
                  key={song}
                  onClick={() => handleAddSong(song)}
                  className="p-3 bg-neutral-100 dark:bg-neutral-850 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-800 text-left text-xs font-semibold flex justify-between items-center transition-colors text-neutral-750 dark:text-neutral-250"
                >
                  <span>{song}</span>
                  <Plus size={14} className="text-emerald-700" />
                </button>
              ))}
            </div>
          </div>

          {/* Program Sequencer */}
          <div className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-6 flex flex-col gap-5">
            <header className="flex justify-between items-center">
              <h3 className="font-extrabold text-base text-neutral-850 dark:text-neutral-150 font-heading uppercase tracking-wide">
                Campfire Program
              </h3>
              
              {/* Metronome bpm clicker */}
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full transition-all duration-75 ${
                  metronomeTick ? 'bg-amber-500 scale-125 shadow-lg shadow-amber-500/30' : 'bg-neutral-350 dark:bg-neutral-700'
                }`} />
                <span className="text-[10px] text-neutral-400 font-bold">{bpm} BPM</span>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-2 rounded-lg transition-colors ${
                    isPlaying ? 'bg-red-800 text-white' : 'bg-emerald-800 text-white'
                  }`}
                >
                  {isPlaying ? <Square size={12} /> : <Play size={12} />}
                </button>
              </div>
            </header>

            <div className="flex flex-col gap-1.5 flex-1 min-h-[150px] overflow-y-auto max-h-[250px]">
              {program.map((song, index) => (
                <div
                  key={index}
                  className="p-3 bg-neutral-50 dark:bg-neutral-900/30 rounded-lg border border-neutral-200 dark:border-neutral-800 flex justify-between items-center text-xs"
                >
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">{index + 1}. {song}</span>
                  <button
                    onClick={() => handleRemoveSong(index)}
                    className="text-neutral-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
              {program.length === 0 && (
                <div className="text-neutral-500 italic text-xs text-center my-auto">Add songs from the catalog to build sequence.</div>
              )}
            </div>

            {/* Metronome Speed slider */}
            <div className="flex flex-col gap-1.5 border-t border-neutral-200 dark:border-neutral-800/60 pt-3">
              <label className="text-[10px] text-neutral-400 font-bold uppercase">Metronome Speed (BPM)</label>
              <input
                type="range"
                min={60}
                max={180}
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Radio Protocol Practice */}
      {activeTab === 'radio' && (
        <div className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-6 flex flex-col gap-5 max-w-xl mx-auto w-full">
          <header className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
              2-Way Radio Practice Drills
            </span>
            <span className="text-xs text-emerald-800 dark:text-emerald-450 font-bold flex items-center gap-1">
              <Smartphone size={13} />
              <span>Channel allocation check</span>
            </span>
          </header>

          <h3 className="font-bold text-neutral-850 dark:text-neutral-100 text-sm leading-relaxed">
            {radioScenarios[radioScenario].q}
          </h3>

          <div className="flex flex-col gap-2.5">
            {radioScenarios[radioScenario].opts.map(opt => (
              <button
                key={opt}
                disabled={radioAnswer !== null}
                onClick={() => handleRadioAnswer(opt)}
                className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold transition-all ${
                  radioAnswer === opt
                    ? radioCorrect
                      ? 'bg-emerald-800/10 border-emerald-500 text-emerald-800 dark:text-emerald-450'
                      : 'bg-red-800/10 border-red-500 text-red-650 dark:text-red-400'
                    : 'bg-white/40 dark:bg-neutral-900/30 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-350 hover:bg-white dark:hover:bg-neutral-800/40'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {radioAnswer !== null && (
            <div className={`p-4 rounded-xl border text-xs leading-relaxed flex flex-col gap-2 ${
              radioCorrect
                ? 'bg-emerald-500/5 border-emerald-500/30 text-emerald-800 dark:text-emerald-400'
                : 'bg-red-500/5 border-red-500/20 text-red-650 dark:text-red-400'
            }`}>
              <div className="font-bold">
                {radioCorrect ? '✓ CORRECT OPTION!' : '✗ INCORRECT ALLOCATION'}
              </div>
              <p>{radioScenarios[radioScenario].explanation}</p>
              <button
                onClick={handleNextRadioScenario}
                className="mt-2 self-start py-2 px-4 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] transition-colors"
              >
                Next Scenario
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
