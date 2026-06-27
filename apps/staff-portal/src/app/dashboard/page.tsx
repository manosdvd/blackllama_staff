'use client';

import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Download, Landmark, ArrowRight } from 'lucide-react';
import { OperationalHUD } from '@/components/ui/OperationalHUD';
import Link from 'next/link';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export default function DashboardPage() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: 'item1', text: 'Read the Code of Conduct in Policies', completed: false },
    { id: 'item2', text: 'Complete the Child Safeguarding (YPT) Training', completed: false },
    { id: 'item3', text: 'Complete and sign the 19-Section Application Form', completed: false },
    { id: 'item4', text: 'Review the camp packing list', completed: false },
    { id: 'item5', text: 'Pass the Safety Certification Quiz', completed: false }
  ]);

  useEffect(() => {
    // Sync checklist state from localStorage
    const saved = localStorage.getItem('camp_lawton_dashboard_checklist');
    if (saved) {
      try {
        setChecklist(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  const toggleChecklistItem = (id: string) => {
    const updated = checklist.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updated);
    localStorage.setItem('camp_lawton_dashboard_checklist', JSON.stringify(updated));
  };

  const getProgressPercent = () => {
    const completedCount = checklist.filter(c => c.completed).length;
    return Math.round((completedCount / checklist.length) * 100);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Weather, Fire Danger, and Forest Alerts HUD */}
      <OperationalHUD />

      {/* Main Grid: Welcome + Sidebar info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Welcome Banner Card */}
        <div className="lg:col-span-2 glass-panel flex flex-col justify-between gap-6 border-l-4 border-emerald-800 bg-white/70 dark:bg-neutral-900/60 p-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-black text-emerald-800 dark:text-emerald-500 font-heading">
              READY FOR THE 2026 SEASON?
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
              Welcome to the digital Camp Lawton Staff Portal. Use this system to review handbook wikis, verify safety protocols, complete training courses, and finalize your staff application drafts.
            </p>
          </div>
          <div>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white text-sm font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-emerald-800/10"
            >
              <span>Launch Application Wizard</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Paper Fallback & Scouting Office Details */}
        <div className="glass-panel flex flex-col gap-4 bg-white/70 dark:bg-neutral-900/60 p-6">
          <h3 className="font-extrabold text-lg text-emerald-800 dark:text-emerald-500 font-heading tracking-wide">
            PAPER SUBMISSIONS
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs leading-relaxed">
            If you prefer submitting physical documents or are experiencing connectivity limitations, you can drop off applications at:
          </p>
          <div className="bg-neutral-100 dark:bg-neutral-800/50 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 flex gap-2.5 items-start">
            <Landmark className="text-neutral-400 mt-0.5" size={18} />
            <div className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-normal">
              <strong>Tucson Catalina Council Scout Office</strong><br />
              3501 E Broadway Blvd,<br />
              Tucson, AZ 85716
            </div>
          </div>
          <a
            href="/downloads/camp_lawton_2026_application.pdf"
            className="flex items-center justify-center gap-2 py-2.5 bg-neutral-100 hover:bg-neutral-250 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-bold rounded-xl border border-neutral-300 dark:border-neutral-700 transition-colors"
          >
            <Download size={14} />
            <span>Download Paper Form (PDF)</span>
          </a>
        </div>

        {/* Readiness Checklist Card */}
        <div className="lg:col-span-3 glass-panel flex flex-col gap-5 bg-white/70 dark:bg-neutral-900/60 p-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h3 className="font-black text-xl text-neutral-850 dark:text-neutral-100 font-heading tracking-wide">
                YOUR ONBOARDING READINESS CHECKLIST
              </h3>
              <p className="text-neutral-400 text-xs mt-0.5">
                Track your progress as you prepare for staff training week.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-neutral-400 font-semibold">Progress</span>
              <div className="w-24 bg-neutral-200 dark:bg-neutral-800 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-emerald-700 dark:bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${getProgressPercent()}%` }}
                />
              </div>
              <span className="text-xs font-black text-emerald-800 dark:text-emerald-500 font-heading">
                {getProgressPercent()}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {checklist.map(item => (
              <button
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className={`flex items-center gap-3.5 p-4 rounded-xl border text-left transition-all ${
                  item.completed
                    ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-400'
                    : 'bg-white/40 dark:bg-neutral-900/30 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800/40'
                }`}
              >
                <div className="flex-shrink-0">
                  {item.completed ? (
                    <CheckSquare className="text-emerald-700 dark:text-emerald-500" size={18} />
                  ) : (
                    <Square className="text-neutral-400" size={18} />
                  )}
                </div>
                <span className="text-xs font-semibold leading-snug">{item.text}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
