'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, User, Lock, Mail, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (authError) throw authError;
        router.push('/dashboard');
      } else {
        // Sign up
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (authError) throw authError;
        
        // If a user was created and we have an ID, we can create their profile.
        // Wait, normally this is done by a Postgres trigger, but if not, we can insert it here.
        // Since we are mocking the trigger if it doesn't exist, we will try to insert a profile record.
        if (authData.user) {
          const { error: profileError } = await supabase.from('profiles').insert([
            {
              id: authData.user.id,
              username: username || email.split('@')[0],
              role: 'Candidate', // Default role
              status: 'Active'
            }
          ]);
          
          if (profileError && profileError.code !== '23505') { 
            // ignore unique violation if trigger already created it
            console.warn('Profile creation issue:', profileError);
          }
        }
        
        // If email confirmation is required, they might not be logged in yet
        if (authData.session) {
          router.push('/dashboard');
        } else {
          setError('Registration successful! Please check your email to confirm your account.');
          setLoading(false);
        }
      }
    } catch (err: unknown) {
      console.error("Authentication error:", err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setLoading(false);
    }
  };

  if (loading && !error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4 relative bg-cover bg-center">
        <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm z-0" />
        <RefreshCw className="animate-spin text-emerald-500 z-10" size={32} />
      </div>
    );
  }

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

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-xs flex items-start gap-2">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex bg-neutral-200 dark:bg-neutral-800 rounded-lg p-1">
          <button 
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${isLogin ? 'bg-white dark:bg-neutral-700 shadow-sm text-emerald-700 dark:text-emerald-400' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
            onClick={() => { setIsLogin(true); setError(null); }}
          >
            Log In
          </button>
          <button 
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${!isLogin ? 'bg-white dark:bg-neutral-700 shadow-sm text-emerald-700 dark:text-emerald-400' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
            onClick={() => { setIsLogin(false); setError(null); }}
          >
            Register
          </button>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {!isLogin && (
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-neutral-400 font-bold uppercase">Display Username</label>
              <div className="relative">
                <input
                  type="text"
                  required={!isLogin}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. jimmy_scoutcraft"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none text-neutral-800 dark:text-neutral-250"
                />
                <User className="absolute left-3 top-3 text-neutral-400" size={14} />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-neutral-400 font-bold uppercase">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ranger@camplawton.org"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none text-neutral-800 dark:text-neutral-250"
              />
              <Mail className="absolute left-3 top-3 text-neutral-400" size={14} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-neutral-400 font-bold uppercase">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none text-neutral-850 dark:text-neutral-250"
              />
              <Lock className="absolute left-3 top-3 text-neutral-400" size={14} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 mt-2"
          >
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <span>{isLogin ? 'Secure Log In' : 'Create Account'}</span>}
            {!loading && <ArrowRight size={14} />}
          </button>
        </form>
      </div>
    </div>
  );
}
