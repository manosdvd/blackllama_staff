'use client';

import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Download, Landmark, ArrowRight, UserCheck, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

const defaultChecklist: ChecklistItem[] = [
  { id: 'item1', text: 'Read the Code of Conduct in Policies', completed: false },
  { id: 'item2', text: 'Complete the Child Safeguarding (YPT) Training', completed: false },
  { id: 'item3', text: 'Complete and sign the 19-Section Application Form', completed: false },
  { id: 'item4', text: 'Review the camp packing list', completed: false },
  { id: 'item5', text: 'Pass the Safety Certification Quiz', completed: false }
];

const readChecklist = () => {
  if (typeof window === 'undefined') return defaultChecklist;
  const saved = localStorage.getItem('camp_lawton_dashboard_checklist');
  if (!saved) return defaultChecklist;
  try {
    return JSON.parse(saved) as ChecklistItem[];
  } catch {
    return defaultChecklist;
  }
};

const readParentCoSigned = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('camp_lawton_parent_cosigned') === 'true';
};

export default function DashboardPage() {
  const [role, setRole] = useState('Staff');
  const [authLoading, setAuthLoading] = useState(true);
  const [parentCoSigned, setParentCoSigned] = useState(readParentCoSigned);
  const [parentSignatureName, setParentSignatureName] = useState('');
  
  const [checklist, setChecklist] = useState<ChecklistItem[]>(readChecklist);

  useEffect(() => {
    const getRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
        if (data?.role) {
          setRole(data.role);
        }
      }
      setAuthLoading(false);
    };

    getRole();
  }, []);

  if (authLoading) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <RefreshCw className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

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

  const handleParentSignatureSubmit = () => {
    if (!parentSignatureName.trim()) return;
    setParentCoSigned(true);
    localStorage.setItem('camp_lawton_parent_cosigned', 'true');
    alert('Thank you! Your parent/guardian digital signature has been successfully logged.');
  };

  // 1. CANDIDATE DASHBOARD VIEW
  if (role === 'Candidate') {
    return (
      <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
        <div className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-6 border-l-4 border-amber-600 flex flex-col gap-3">
          <span className="text-[10px] bg-amber-500/10 text-amber-800 dark:text-amber-400 py-1 px-2.5 rounded-full font-bold uppercase tracking-wider self-start">
            Application Status: Pending
          </span>
          <h2 className="text-2xl font-black text-neutral-850 dark:text-neutral-100 font-heading">
            APPLICATION PENDING REVIEW
          </h2>
          <p className="text-neutral-600 dark:text-neutral-350 text-sm leading-relaxed">
            Your 2026 Camp Lawton Staff Application has been successfully queued. The camp administration is currently reviewing all candidate packets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-6 flex flex-col justify-between gap-4">
            <h3 className="font-extrabold text-lg text-emerald-800 dark:text-emerald-500 font-heading">
              CONTINUE APPLICATION
            </h3>
            <p className="text-xs text-neutral-500 leading-normal">
              You can make edits or review your submitted details inside the wizard.
            </p>
            <Link
              href="/onboarding"
              className="flex items-center justify-center gap-1.5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              <span>Open Wizard Draft</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-6 flex flex-col justify-between gap-4">
            <h3 className="font-extrabold text-lg text-emerald-800 dark:text-emerald-500 font-heading">
              SCOUT OFFICE ADDRESS
            </h3>
            <div className="text-xs text-neutral-500 flex gap-2.5 items-start">
              <Landmark className="text-neutral-400 mt-0.5" size={18} />
              <div>
                <strong>Catalina Council, Scouting America</strong><br />
                3501 E Broadway Blvd,<br />
                Tucson, AZ 85716<br />
                Phone: (520) 750-0385
              </div>
            </div>
            <a
              href="/downloads/camp_lawton_2026_application.pdf"
              className="flex items-center justify-center gap-1.5 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-750 dark:text-neutral-250 border border-neutral-300 dark:border-neutral-700 text-xs font-bold rounded-xl transition-colors"
            >
              <Download size={14} />
              <span>Download PDF Paper Fallback</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 2. PARENT / GUARDIAN DASHBOARD VIEW
  if (role === 'Parent') {
    return (
      <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
        <div className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-6 border-l-4 border-emerald-800">
          <h2 className="text-2xl font-black text-emerald-800 dark:text-emerald-500 font-heading">
            PARENT / GUARDIAN CENTER
          </h2>
          <p className="text-neutral-600 dark:text-neutral-350 text-sm leading-relaxed mt-1">
            Linked minor candidate: <strong>Bobby Jenkins (Age 15)</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-6 flex flex-col gap-4">
            <h3 className="font-extrabold text-base text-neutral-800 dark:text-neutral-200 font-heading uppercase">
              Parent Co-Signature Required
            </h3>
            {parentCoSigned ? (
              <div className="bg-emerald-800/10 border border-emerald-500/30 p-4 rounded-xl text-xs text-emerald-800 dark:text-emerald-400 font-bold flex items-center gap-2">
                <UserCheck size={18} />
                <span>Parent co-signature successfully logged.</span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-neutral-500 leading-normal">
                  Bobby Jenkins is under 18. You must co-sign their digital employment application:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type Parent Legal Name"
                    value={parentSignatureName}
                    onChange={(e) => setParentSignatureName(e.target.value)}
                    className="flex-1 p-2 bg-white dark:bg-neutral-950 border border-neutral-250 dark:border-neutral-800 rounded-lg text-xs outline-none"
                  />
                  <button
                    onClick={handleParentSignatureSubmit}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg text-xs transition-colors"
                  >
                    Co-Sign
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-6 flex flex-col gap-3">
            <h3 className="font-extrabold text-base text-neutral-800 dark:text-neutral-200 font-heading uppercase">
              Staff Packing Checklist
            </h3>
            <ul className="text-xs text-neutral-500 space-y-1.5 list-disc list-inside pl-1">
              <li>Heavy sleeping bag (rated to 30°F or lower)</li>
              <li>Official Scouting America field uniform shirt</li>
              <li>Sturdy hiking boots & wool trail socks</li>
              <li>Flashlight / headlamp with spare batteries</li>
              <li>Signed BSA Medical Form (Parts A, B, and C)</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // 3. ADMIN DASHBOARD METRICS VIEW
  if (role === 'Admin') {
    return (
      <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
        <div className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-6 border-l-4 border-emerald-800">
          <h2 className="text-2xl font-black text-emerald-800 dark:text-emerald-500 font-heading tracking-wide">
            ADMINISTRATOR CONSOLE
          </h2>
          <p className="text-neutral-600 dark:text-neutral-350 text-sm leading-relaxed mt-1">
            Access candidate verification queues, season configurations, and moderation tools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-5 flex flex-col gap-1 items-center justify-center text-center">
            <span className="text-[10px] text-neutral-400 font-extrabold uppercase">Total Applications</span>
            <span className="text-3xl font-black text-emerald-800 dark:text-emerald-500 mt-1">4</span>
          </div>
          <div className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-5 flex flex-col gap-1 items-center justify-center text-center">
            <span className="text-[10px] text-neutral-400 font-extrabold uppercase">Pending Review</span>
            <span className="text-3xl font-black text-amber-500 mt-1">2</span>
          </div>
          <div className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-5 flex flex-col gap-1 items-center justify-center text-center">
            <span className="text-[10px] text-neutral-400 font-extrabold uppercase">Approved Staff</span>
            <span className="text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-1">2</span>
          </div>
        </div>

        <div className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-6 flex flex-col justify-between items-center text-center gap-4">
          <h3 className="font-extrabold text-base text-neutral-800 dark:text-neutral-200 uppercase tracking-wide">
            Launch Onboarding Review Panel
          </h3>
          <p className="text-xs text-neutral-500 max-w-md leading-normal">
            Review detailed 19-Section candidate forms, post staff evaluations, audit season database changes, and promote candidates to Staff.
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 py-3 px-6 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors"
          >
            <span>Open Admin Portal</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  // 4. DEFAULT STAFF DASHBOARD VIEW
  return (
    <div className="flex flex-col gap-6">
      {/* Main Grid: Welcome + Sidebar info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Welcome Banner Card */}
        <div className="lg:col-span-2 glass-panel flex flex-col justify-between gap-6 border-l-4 border-emerald-800 bg-white/70 dark:bg-neutral-900/60 p-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-black text-emerald-800 dark:text-emerald-500 font-heading">
              READY FOR THE 2026 SEASON?
            </h2>
            <p className="text-neutral-600 dark:text-neutral-350 text-sm leading-relaxed">
              Welcome to the digital Camp Lawton Staff Portal. Use this system to review handbook wikis, verify safety protocols, complete training courses, and finalize your staff application drafts.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-emerald-800/10"
            >
              <span>Application Wizard</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/wiki"
              className="inline-flex items-center gap-2 bg-neutral-100 hover:bg-neutral-250 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-bold py-3 px-6 rounded-xl border border-neutral-300 dark:border-neutral-700 transition-all"
            >
              <span>Browse Handbook</span>
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
          <div className="bg-neutral-150 dark:bg-neutral-800/50 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 flex gap-2.5 items-start">
            <Landmark className="text-neutral-400 mt-0.5" size={18} />
            <div className="text-[11px] text-neutral-600 dark:text-neutral-350 leading-normal">
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
