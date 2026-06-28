'use client';

import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Download, Landmark, ArrowRight, UserCheck, RefreshCw, BookOpen, Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

const supabase = createClient();

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

export default function WelcomeDashboardPage() {
  const [role, setRole] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Data states
  const [checklist, setChecklist] = useState<ChecklistItem[]>(readChecklist);
  const [welcomeContent, setWelcomeContent] = useState<string>('Camp Lawton is a premier Scouting America camp...');
  const [trainingPreview, setTrainingPreview] = useState<{title: string, excerpt: string} | null>(null);

  useEffect(() => {
    const initData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
        if (data?.role) {
          setRole(data.role);
        }
      } else {
        setRole(null); // Public Guest
      }
      
      // Fetch dynamic wiki content for welcome message
      const { data: welcomeItem } = await supabase.from('content_items').select('id').eq('slug', 'why-camp-lawton').single();
      if (welcomeItem) {
        const { data: ver } = await supabase.from('content_versions').select('content').eq('item_id', welcomeItem.id).order('version_no', { ascending: false }).limit(1).single();
        if (ver) setWelcomeContent(ver.content);
      }
      
      // Fetch random training
      // (Mocking random for now by taking the first training we find)
      const { data: trainingItem } = await supabase.from('content_items').select('id, title').eq('slug', 'youth-protection').single();
      if (trainingItem) {
        const { data: ver } = await supabase.from('content_versions').select('content').eq('item_id', trainingItem.id).order('version_no', { ascending: false }).limit(1).single();
        if (ver) {
          setTrainingPreview({
            title: trainingItem.title,
            excerpt: ver.content.substring(0, 150) + '...'
          });
        }
      } else {
        // Fallback preview
        setTrainingPreview({
          title: 'Youth Protection Training (YPT) Basics',
          excerpt: 'All staff members are required to maintain current YPT certification. This module covers the essential two-deep leadership protocols...'
        });
      }

      setAuthLoading(false);
    };

    initData();
  }, []);

  if (authLoading) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-screen">
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
  
  const allTasksCompleted = checklist.every(c => c.completed);

  // ==========================================
  // 1. PUBLIC (GUEST) VIEW
  // ==========================================
  if (!role) {
    return (
      <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full min-h-screen pt-4">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-neutral-200/20 dark:border-neutral-800/50">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-neutral-900 to-amber-900 z-0">
             {/* Fallback pattern if no image */}
             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
          </div>
          <div className="relative z-10 p-8 md:p-12 flex flex-col items-center text-center gap-6 backdrop-blur-sm bg-black/20">
            <Image
              src="/camp-logo.png"
              alt="Camp Lawton"
              width={80}
              height={80}
              className="w-20 h-20 object-contain drop-shadow-xl"
              priority
            />
            <h1 className="text-4xl md:text-5xl font-black text-white font-heading tracking-wide drop-shadow-lg">
              JOIN THE CAMP LAWTON TEAM
            </h1>
            <p className="text-emerald-50 text-sm md:text-base max-w-2xl font-medium leading-relaxed drop-shadow-md">
              {welcomeContent.substring(0, 300) || "Spend your summer at 8,000 feet! Build leadership skills, teach Scoutcraft, and create lifelong memories in the Coronado National Forest."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
              <Link
                href="/login"
                className="relative overflow-hidden group inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-black py-4 px-8 rounded-xl shadow-[0_0_40px_-10px_rgba(245,158,11,0.5)] transition-all animate-pulse"
              >
                <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                <span className="tracking-wide uppercase">Apply Now</span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold py-4 px-8 rounded-xl backdrop-blur-md transition-all"
              >
                <span>Existing Staff Login</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-8 flex flex-col gap-4">
            <h3 className="font-extrabold text-xl text-emerald-800 dark:text-emerald-500 font-heading">
              WHY WORK HERE?
            </h3>
            <div className="prose prose-sm dark:prose-invert prose-emerald text-neutral-600 dark:text-neutral-400">
              {/* In a full implementation, we'd use a Markdown renderer here. */}
              <p>{welcomeContent}</p>
            </div>
          </div>

          <div className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-8 flex flex-col gap-4">
            <h3 className="font-extrabold text-xl text-emerald-800 dark:text-emerald-500 font-heading flex items-center gap-2">
              <BookOpen size={20} />
              TRAINING SNEAK PEEK
            </h3>
            <div className="bg-neutral-100 dark:bg-neutral-800/50 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700/50 flex flex-col gap-3">
              <h4 className="font-bold text-neutral-800 dark:text-neutral-200">{trainingPreview?.title}</h4>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                "{trainingPreview?.excerpt}"
              </p>
              <Link href="/login" className="text-emerald-600 dark:text-emerald-500 text-xs font-bold hover:underline mt-2 inline-flex items-center gap-1">
                Unlock full training catalog <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. CANDIDATE VIEW
  // ==========================================
  if (role === 'Candidate') {
    return (
      <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
        <div className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-6 border-l-4 border-amber-600 flex flex-col gap-3">
          <span className="text-[10px] bg-amber-500/10 text-amber-800 dark:text-amber-400 py-1 px-2.5 rounded-full font-bold uppercase tracking-wider self-start">
            Application Status: Pending
          </span>
          <h2 className="text-2xl font-black text-neutral-850 dark:text-neutral-100 font-heading">
            APPLICATION IN PROGRESS
          </h2>
          <p className="text-neutral-600 dark:text-neutral-350 text-sm leading-relaxed">
            Your 2026 Camp Lawton Staff Application has been initiated. You can continue, edit, or retract your application at any time before the final review.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-6 flex flex-col justify-between gap-4">
            <h3 className="font-extrabold text-lg text-emerald-800 dark:text-emerald-500 font-heading">
              CONTINUE APPLICATION
            </h3>
            <p className="text-xs text-neutral-500 leading-normal">
              Open the 19-section wizard to fill out your health and preference details.
            </p>
            <Link
              href="/onboarding"
              className="flex items-center justify-center gap-1.5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              <span>Open Wizard</span>
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

  // ==========================================
  // 3. STAFF / ALUMNI / ADMIN VIEW
  // ==========================================
  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Banner */}
      <div className="glass-panel flex flex-col gap-4 border-l-4 border-emerald-800 bg-white/70 dark:bg-neutral-900/60 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-black text-emerald-800 dark:text-emerald-500 font-heading uppercase">
          {role === 'Alumni' ? 'Welcome Back, Alumni!' : 'Ready for the 2026 Season?'}
        </h2>
        <p className="text-neutral-600 dark:text-neutral-350 text-sm md:text-base leading-relaxed max-w-3xl">
          {role === 'Alumni' 
            ? 'Thank you for your past service. Use this portal to reconnect on the forum and browse the camp wiki.' 
            : 'Welcome to the digital Camp Lawton Staff Portal. Use this system to review handbook wikis, verify safety protocols, and complete training courses.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Blog & Training */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-6 flex flex-col gap-4">
            <h3 className="font-extrabold text-xl text-neutral-800 dark:text-neutral-200 font-heading">
              CAMP BLOG & UPDATES
            </h3>
            <div className="bg-neutral-50 dark:bg-neutral-800/40 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700/50">
              <span className="text-[10px] text-neutral-400 font-bold uppercase mb-1 block">April 12, 2026</span>
              <h4 className="font-bold text-emerald-700 dark:text-emerald-400 mb-2">Pre-Camp Work Weekend Scheduled</h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Join us for the annual chainsaw and trail-clearing weekend! We'll be focusing on the path to the rifle range and replacing the tent platforms in Apache campsite. Lunch is provided.
              </p>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-800/40 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700/50">
              <span className="text-[10px] text-neutral-400 font-bold uppercase mb-1 block">March 28, 2026</span>
              <h4 className="font-bold text-emerald-700 dark:text-emerald-400 mb-2">New Handbook Published</h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                The 2026 staff handbook has been fully migrated to the digital Wiki. Please review the updated bear protocol and radio etiquette sections.
              </p>
            </div>
          </div>
          
          <div className="glass-panel bg-emerald-900/5 dark:bg-emerald-900/10 p-6 flex items-start gap-4 border border-emerald-500/20">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl text-emerald-700 dark:text-emerald-400 shrink-0">
              <BookOpen size={24} />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-extrabold text-emerald-800 dark:text-emerald-500 font-heading">
                TRAINING SPOTLIGHT: {trainingPreview?.title || 'Safety Protocols'}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                "{trainingPreview?.excerpt}"
              </p>
              <Link href="/training" className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline mt-1">
                Read Full Module &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Readiness Checklist */}
        {!allTasksCompleted && (
          <div className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-6 flex flex-col gap-5 h-fit">
            <div>
              <h3 className="font-black text-lg text-neutral-850 dark:text-neutral-100 font-heading tracking-wide leading-tight">
                ONBOARDING TASKS
              </h3>
              <p className="text-neutral-400 text-[10px] uppercase font-bold mt-1">
                Disappears when admin verified
              </p>
            </div>
            
            <div className="flex items-center gap-2.5 bg-neutral-100 dark:bg-neutral-800 p-3 rounded-lg">
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-300"
                  style={{ width: `${getProgressPercent()}%` }}
                />
              </div>
              <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 w-8 text-right">
                {getProgressPercent()}%
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {checklist.map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                    item.completed
                      ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-400'
                      : 'bg-white/40 dark:bg-neutral-900/30 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {item.completed ? (
                      <CheckSquare className="text-emerald-700 dark:text-emerald-500" size={16} />
                    ) : (
                      <Square className="text-neutral-400" size={16} />
                    )}
                  </div>
                  <span className="text-[11px] font-semibold leading-snug">{item.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
