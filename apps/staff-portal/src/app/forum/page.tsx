'use client';

import React, { useState } from 'react';
import { ShieldAlert, Plus, Send } from 'lucide-react';

interface Thread {
  id: string;
  category: string;
  title: string;
  author: string;
  content: string;
  createdAt: string;
  replies: Reply[];
}

interface Reply {
  author: string;
  content: string;
  createdAt: string;
}

const defaultThreads: Thread[] = [
  {
    id: 't1',
    category: 'General Staff Room',
    title: 'Staff Week packing reminders',
    author: '@marylou_director',
    content: 'Hey everyone! Do not forget to bring warm sleeping gear. Temperatures drop down to 45°F at night on the mountain!',
    createdAt: 'June 1, 2026',
    replies: [
      { author: '@jim_scoutcraft', content: 'Yes, heavy blankets are a lifesaver!', createdAt: 'June 1, 2026' }
    ]
  },
  {
    id: 't2',
    category: 'Leadership Chamber',
    title: '2026 Budget and Accreditation schedule',
    author: '@marylou_director',
    content: 'This thread contains planning for the National Camp Accreditation Program (NCAP) inspection schedules.',
    createdAt: 'May 28, 2026',
    replies: []
  }
];

const readActiveRole = () => {
  if (typeof window === 'undefined') return 'CIT';
  const activeUser = localStorage.getItem('camp_lawton_active_user');
  if (!activeUser) return 'CIT';
  try {
    return JSON.parse(activeUser).role || 'CIT';
  } catch {
    return 'CIT';
  }
};

const readThreads = () => {
  if (typeof window === 'undefined') return defaultThreads;
  const local = localStorage.getItem('camp_lawton_forum_threads');
  if (!local) {
    localStorage.setItem('camp_lawton_forum_threads', JSON.stringify(defaultThreads));
    return defaultThreads;
  }
  try {
    return JSON.parse(local) as Thread[];
  } catch {
    localStorage.setItem('camp_lawton_forum_threads', JSON.stringify(defaultThreads));
    return defaultThreads;
  }
};

export default function ForumPage() {
  const [threads, setThreads] = useState<Thread[]>(readThreads);
  const [activeCategory, setActiveCategory] = useState('General Staff Room');
  
  // Creation States
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Reply States
  const [replyContent, setReplyContent] = useState('');
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  // Simulation user role
  const [role] = useState(readActiveRole); // Default to CIT for strict safety testing

  const categories = [
    'General Staff Room',
    'Scoutcraft',
    'Nature',
    'Shooting Sports',
    'Aquatics',
    'Handicraft',
    'CITs & Volunteers',
    'Kitchen Staff',
    'Ranger & Maintenance',
    'Health Lodge',
    'Trading Post',
    'Leadership Chamber' // Gated: Admins/Directors only
  ];

  const isCategoryRestricted = (cat: string) => {
    if (cat === 'Leadership Chamber' && role !== 'Admin') {
      return true;
    }
    // Gating minors (CITs) from the Leadership Chamber
    if (cat === 'Adult Staff Room' && role === 'CIT') {
      return true;
    }
    return false;
  };

  const handleCreateThread = () => {
    if (!newTitle || !newContent) return;

    const newThread: Thread = {
      id: 't_' + Date.now(),
      category: activeCategory,
      title: newTitle,
      author: '@ScoutHelper',
      content: newContent,
      createdAt: 'Just now',
      replies: []
    };

    const updated = [newThread, ...threads];
    setThreads(updated);
    localStorage.setItem('camp_lawton_forum_threads', JSON.stringify(updated));

    setNewTitle('');
    setNewContent('');
    setIsCreating(false);
  };

  const handlePostReply = (threadId: string) => {
    if (!replyContent.trim()) return;

    const updated = threads.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          replies: [
            ...t.replies,
            {
              author: '@ScoutHelper',
              content: replyContent,
              createdAt: 'Just now'
            }
          ]
        };
      }
      return t;
    });

    setThreads(updated);
    localStorage.setItem('camp_lawton_forum_threads', JSON.stringify(updated));
    setReplyContent('');
  };

  const activeThreads = threads.filter(t => t.category === activeCategory);

  return (
    <div className="flex flex-col gap-6">
      {/* Safeguarding Warning Banner */}
      <div className="glass-panel border-l-4 border-amber-600 bg-amber-500/5 p-4 rounded-xl flex gap-3 text-xs leading-relaxed text-amber-800 dark:text-amber-400">
        <ShieldAlert className="flex-shrink-0 mt-0.5" size={18} />
        <div>
          <strong>🛡️ DIGITAL SAFEGUARDING & YPT NOTICE:</strong> All conversations on the staff forum are strictly auditable. To ensure the safety of youth staff and CITs:
          <ul className="list-disc list-inside mt-1.5 space-y-1 pl-1">
            <li>Private Messaging (DMs) is disabled. Keep all conversations on public category boards.</li>
            <li>Minors under 18 (CITs and Junior Staff) are restricted from accessing adult-only and leadership-only threads.</li>
            <li>Maintain respect and professional boundaries in line with the Scouting America Code of Conduct.</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Category List */}
        <div className="lg:w-[260px] flex-shrink-0 flex flex-col gap-1.5">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider px-2">
            Operational Boards
          </span>
          <div className="flex flex-wrap lg:flex-col gap-1">
            {categories.map(cat => {
              const restricted = isCategoryRestricted(cat);
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  disabled={restricted}
                  onClick={() => {
                    setActiveCategory(cat);
                    setActiveThreadId(null);
                  }}
                  className={`py-2 px-3 rounded-xl text-left text-xs font-semibold flex justify-between items-center transition-all ${
                    active
                      ? 'bg-emerald-800 text-white font-bold'
                      : restricted
                      ? 'opacity-40 cursor-not-allowed text-neutral-500 bg-neutral-200 dark:bg-neutral-800/20'
                      : 'bg-white/40 dark:bg-neutral-900/30 text-neutral-700 dark:text-neutral-355 hover:bg-white dark:hover:bg-neutral-800/40'
                  }`}
                >
                  <span>{cat}</span>
                  {restricted && <span>🔒</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Threads Area */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-lg text-emerald-800 dark:text-emerald-500 font-heading">
              BOARD: {activeCategory.toUpperCase()}
            </h3>
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-1 bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors"
            >
              <Plus size={14} />
              <span>New Thread</span>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {activeThreads.map(thread => {
              const isExpanded = activeThreadId === thread.id;
              return (
                <div
                  key={thread.id}
                  className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-5 flex flex-col gap-3"
                >
                  <header className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                        {thread.title}
                      </h4>
                      <div className="text-[10px] text-neutral-400 font-semibold mt-1">
                        Posted by {thread.author} • {thread.createdAt}
                      </div>
                    </div>
                  </header>
                  <p className="text-xs text-neutral-600 dark:text-neutral-350 leading-relaxed whitespace-pre-wrap">
                    {thread.content}
                  </p>

                  <div className="border-t border-neutral-200 dark:border-neutral-800/60 pt-3 mt-1 flex flex-col gap-3">
                    <button
                      onClick={() => setActiveThreadId(isExpanded ? null : thread.id)}
                      className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold hover:underline text-left self-start"
                    >
                      {thread.replies.length} Replies {isExpanded ? '▲' : '▼'}
                    </button>

                    {isExpanded && (
                      <div className="flex flex-col gap-3 pl-3 border-l-2 border-neutral-200 dark:border-neutral-800">
                        {thread.replies.map((rep, idx) => (
                          <div key={idx} className="bg-neutral-50 dark:bg-neutral-850 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs">
                            <div className="font-bold text-neutral-800 dark:text-neutral-200">{rep.author}</div>
                            <div className="text-neutral-500 text-[10px] mt-0.5">{rep.createdAt}</div>
                            <p className="text-neutral-600 dark:text-neutral-350 mt-1.5 whitespace-pre-wrap">{rep.content}</p>
                          </div>
                        ))}

                        <div className="flex gap-2 mt-2">
                          <input
                            type="text"
                            placeholder="Type your reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="flex-1 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none text-neutral-700 dark:text-neutral-200"
                          />
                          <button
                            onClick={() => handlePostReply(thread.id)}
                            className="bg-emerald-800 hover:bg-emerald-700 text-white p-2.5 rounded-xl transition-colors"
                          >
                            <Send size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {activeThreads.length === 0 && (
              <div className="text-neutral-500 italic text-xs">No threads on this category board.</div>
            )}
          </div>
        </div>
      </div>

      {/* Creation Modal Overlay */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl flex flex-col gap-4 text-neutral-850 dark:text-neutral-200">
            <h3 className="font-extrabold text-lg font-heading text-emerald-800 dark:text-emerald-500 tracking-wide">
              NEW DISCUSSION THREAD
            </h3>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Thread Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none"
              />
              <textarea
                placeholder="Write your topic post..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={5}
                className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none font-sans"
              />
            </div>

            <div className="flex gap-2 justify-end border-t border-neutral-200 dark:border-neutral-800/60 pt-4">
              <button
                onClick={() => setIsCreating(false)}
                className="py-2 px-4 rounded-xl border border-neutral-350 dark:border-neutral-700 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateThread}
                className="py-2 px-5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Post Thread
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
