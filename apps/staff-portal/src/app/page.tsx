'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, User, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Staff');

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    try {
      const active = localStorage.getItem('camp_lawton_active_user');
      if (active && JSON.parse(active)?.username) {
        router.push('/dashboard');
      }
    } catch { /* ignore */ }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const userPayload = {
      username: username || 'ScoutHelper',
      role: role
    };
    localStorage.setItem('camp_lawton_active_user', JSON.stringify(userPayload));
    router.push('/dashboard');
  };

  const handlePresetLogin = (presetUser: string, presetRole: string) => {
    const userPayload = {
      username: presetUser,
      role: presetRole
    };
    localStorage.setItem('camp_lawton_active_user', JSON.stringify(userPayload));
    router.push('/dashboard');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 relative bg-cover bg-center">
      {/* Background Ember particles wrapper */}
      <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm z-0" />

      <div className="max-w-md w-full glass-panel bg-white/70 dark:bg-neutral-900/60 p-8 shadow-2xl relative z-10 flex flex-col gap-6 text-neutral-850 dark:text-neutral-200">
        <header className="text-center flex flex-col items-center gap-2">
          <Image
            src="/camp-logo.png"
            alt="Camp Lawton"
            width={64}
            height={64}
            className="w-16 h-16 object-contain filter drop-shadow-md"
            priority
          />
          <h1 className="text-3xl font-black tracking-wide text-emerald-800 dark:text-emerald-500 font-heading mt-2">
            CAMP LAWTON
          </h1>
          <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
            Staff & Administration Portal
          </p>
        </header>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-neutral-400 font-bold uppercase">Username</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. jimmy_scoutcraft"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none text-neutral-800 dark:text-neutral-250"
              />
              <User className="absolute left-3 top-3 text-neutral-400" size={14} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-neutral-400 font-bold uppercase">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none text-neutral-850 dark:text-neutral-250"
              />
              <Lock className="absolute left-3 top-3 text-neutral-400" size={14} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-neutral-400 font-bold uppercase">Simulation Role Option</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none text-neutral-850 dark:text-neutral-250"
            >
              <option value="Candidate">Candidate / CIT (Under 18)</option>
              <option value="Parent">Parent / Guardian</option>
              <option value="Staff">Active Staff Member</option>
              <option value="Admin">Administrator / Director</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 mt-2"
          >
            <span>Log In</span>
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Preset quick simulation buttons */}
        <div className="border-t border-neutral-200 dark:border-neutral-800/60 pt-4 flex flex-col gap-3">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider text-center block">
            Quick Simulation Accounts
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handlePresetLogin('bjenkins', 'Candidate')}
              className="p-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-300 text-[10px] font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 transition-colors text-center"
            >
              Bobby Jenkins<br />
              <span className="text-[8px] text-amber-500 font-bold">(Candidate)</span>
            </button>
            <button
              onClick={() => handlePresetLogin('mjenkins', 'Parent')}
              className="p-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-300 text-[10px] font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 transition-colors text-center"
            >
              Mary Jenkins<br />
              <span className="text-[8px] text-emerald-600 font-bold">(Parent)</span>
            </button>
            <button
              onClick={() => handlePresetLogin('jimmy_scoutcraft', 'Staff')}
              className="p-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-300 text-[10px] font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 transition-colors text-center"
            >
              Jimmy Tarleton<br />
              <span className="text-[8px] text-emerald-600 font-bold">(Active Staff)</span>
            </button>
            <button
              onClick={() => handlePresetLogin('marylou_director', 'Admin')}
              className="p-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-300 text-[10px] font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 transition-colors text-center"
            >
              MaryLou Chopelas<br />
              <span className="text-[8px] text-red-500 font-bold">(Admin / Director)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
