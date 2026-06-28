'use client';

import React, { useState } from 'react';
import { Shield, Search } from 'lucide-react';

interface Policy {
  id: string;
  title: string;
  category: string;
  content: string;
}

export default function PoliciesPage() {
  const [search, setSearch] = useState('');

  const policies: Policy[] = [
    {
      id: 'conduct',
      title: 'Scouting America Code of Conduct',
      category: 'General Behavior',
      content: 'All staff must abide by the Scout Oath and Scout Law at all times. Professional boundaries with youth, fellow staff members, and visitors must be strictly maintained.'
    },
    {
      id: 'drug-free',
      title: 'Substance Use Policy',
      category: 'Safety',
      content: 'Camp Lawton is a drug-free and alcohol-free facility. Possession or consumption of alcohol, illegal drugs, or misuse of prescription medication is grounds for immediate termination.'
    },
    {
      id: 'background',
      title: 'Criminal Background Verification',
      category: 'Legal',
      content: 'All applicants must submit to and pass a criminal background check and national sex offender registry query as a condition of employment.'
    },
    {
      id: 'employment',
      title: 'At-Will Employment Policy',
      category: 'Legal',
      content: 'Staff employment is at-will. Either the employee or the council may terminate the employment relationship at any time, with or without cause.'
    }
  ];

  const filtered = policies.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Search policy bar */}
      <div className="relative max-w-sm w-full">
        <input
          type="text"
          placeholder="Filter policies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/50 text-xs outline-none"
        />
        <Search className="absolute left-3 top-3 text-neutral-400" size={14} />
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map(policy => (
          <div
            key={policy.id}
            className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-6 flex flex-col gap-3 border-l-4 border-emerald-800"
          >
            <div className="flex justify-between items-center">
              <span className="text-[9px] bg-emerald-800/10 text-emerald-850 dark:text-emerald-400 py-1 px-2.5 rounded-full font-bold uppercase">
                {policy.category}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-emerald-800 dark:text-emerald-400 font-bold">
                <Shield size={12} />
                <span>Enforced</span>
              </div>
            </div>
            <h3 className="font-extrabold text-lg text-neutral-900 dark:text-neutral-200 font-heading">
              {policy.title}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-350 text-sm leading-relaxed">
              {policy.content}
            </p>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-neutral-500 italic text-sm">No matching policies found.</div>
        )}
      </div>
    </div>
  );
}
