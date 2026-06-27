'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  BookOpen,
  GraduationCap,
  Shield,
  MessageSquare,
  Users,
  Compass,
  Briefcase,
  Moon,
  Sun,
  Leaf,
  LogOut,
  User,
  Search
} from 'lucide-react';
import { OfflineStatusBanner } from '../offline/OfflineStatusBanner';
import { EmergencyQuickAction } from '../ui/EmergencyQuickAction';
import { MobileBottomNav } from './MobileBottomNav';
import { useOffline } from '@/hooks/useOffline';
import { performWeightedSearch, SearchResult } from '@/lib/search';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname() || '/dashboard';
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isCalm, setIsCalm] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [searchVal, setSearchVal] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleSearchChange = (val: string) => {
    setSearchVal(val);
    setSearchResults(performWeightedSearch(val));
  };

  const handleSearchResultClick = (res: SearchResult) => {
    setSearchVal('');
    setSearchResults([]);
    
    if (res.type === 'emergency') {
      // Emergency protocols trigger
      alert(`⚠️ EMERGENCY ALARM PROTOCOL TRIGGERED: ${res.title}\n\nProcedure:\n${res.snippet}`);
    } else {
      router.push(`/wiki?slug=${res.slug}`);
      // Custom event to force update selected article in state if already on page
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('wiki-navigate', { detail: res.slug }));
      }
    }
  };

  useEffect(() => {
    // Sync theme on mount
    const savedTheme = (localStorage.getItem('lawton_theme') as 'light' | 'dark') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Sync calm mode
    const calm = localStorage.getItem('camp_lawton_calm_mode') === 'true';
    setIsCalm(calm);
    if (calm) {
      document.documentElement.classList.add('reduced-stimulation');
    }

    // Sync dummy user session from local storage for simulation
    const activeUser = localStorage.getItem('camp_lawton_active_user');
    if (activeUser) {
      try {
        setUser(JSON.parse(activeUser));
      } catch {
        // ignore
      }
    } else {
      // Setup default simulation user
      const guest = { username: 'ScoutHelper', role: 'Staff' };
      setUser(guest);
      localStorage.setItem('camp_lawton_active_user', JSON.stringify(guest));
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('lawton_theme', nextTheme);
  };

  const toggleCalmMode = () => {
    const nextCalm = !isCalm;
    setIsCalm(nextCalm);
    if (nextCalm) {
      document.documentElement.classList.add('reduced-stimulation');
      localStorage.setItem('camp_lawton_calm_mode', 'true');
    } else {
      document.documentElement.classList.remove('reduced-stimulation');
      localStorage.setItem('camp_lawton_calm_mode', 'false');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('camp_lawton_active_user');
    setUser(null);
    router.push('/');
  };

  const navLinks = [
    { href: '/dashboard', label: 'Welcome / Home', icon: <Home size={18} /> },
    { href: '/wiki', label: 'Handbook Wiki', icon: <BookOpen size={18} /> },
    { href: '/about', label: 'About Camp Lawton', icon: <Compass size={18} /> },
    { href: '/training', label: 'Safety Training', icon: <GraduationCap size={18} /> },
    { href: '/policies', label: 'Policies & Procedures', icon: <Shield size={18} /> },
    { href: '/onboarding', label: 'Onboarding Wizard', icon: <Briefcase size={18} /> },
    { href: '/forum', label: 'Staff Forum', icon: <MessageSquare size={18} /> },
    { href: '/directory', label: 'Staff Directory', icon: <Users size={18} /> },
  ];

  const getHeading = () => {
    if (pathname.includes('/wiki')) return 'Handbook Wiki';
    if (pathname.includes('/training')) return 'Safety Training';
    if (pathname.includes('/policies')) return 'Policies & Procedures';
    if (pathname.includes('/onboarding')) return 'Onboarding Wizard';
    if (pathname.includes('/forum')) return 'Staff Forum';
    if (pathname.includes('/directory')) return 'Staff Directory';
    if (pathname.includes('/about')) return 'About Camp Lawton';
    return 'Dashboard';
  };

  const getSubheading = () => {
    if (pathname.includes('/wiki')) return 'Camp Lawton documentation and wiki handbook.';
    if (pathname.includes('/training')) return 'Safety courses and training certification modules.';
    if (pathname.includes('/policies')) return 'Official policies, standards, and evacuations.';
    if (pathname.includes('/onboarding')) return '19-Section staff application and health filings wizard.';
    if (pathname.includes('/forum')) return 'Discuss camp operations across boards.';
    if (pathname.includes('/directory')) return 'Connect with other Camp Lawton staff.';
    if (pathname.includes('/about')) return 'Discover camp history, coordinates, and local values.';
    return 'Welcome to your digital onboarding portal.';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <OfflineStatusBanner />

      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-[280px] bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex-col p-6 sticky top-0 h-screen select-none z-30">
          <div className="flex items-center gap-3 mb-8">
            <img
              src="/camp-logo.png"
              alt="Camp Lawton"
              className="w-12 h-12 object-contain filter drop-shadow-md"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-emerald-800 dark:text-emerald-500 font-heading">
                CAMP LAWTON
              </span>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                Staff Portal
              </span>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1">
            {navLinks.map(link => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3.5 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-emerald-800 text-white shadow-lg shadow-emerald-800/20'
                      : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer Controls */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 mt-4 flex items-center justify-between">
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn w-10 h-10 rounded-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={toggleCalmMode}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                isCalm
                  ? 'bg-emerald-700 border-emerald-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
              title="Toggle Reduced Stimulation Mode"
            >
              <Leaf size={18} />
            </button>
          </div>
        </aside>

        {/* Main Content Pane */}
        <main className="flex-1 flex flex-col min-w-0 pb-[80px] md:pb-6">
          <header className="px-6 md:px-8 py-5 border-b border-neutral-200 dark:border-neutral-800/40 flex items-center justify-between gap-4 bg-white/40 dark:bg-neutral-950/20 backdrop-blur-md sticky top-0 z-20">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-emerald-800 dark:text-emerald-500 font-heading tracking-wide">
                {getHeading()}
              </h1>
              <p className="text-xs text-neutral-400 hidden sm:block font-semibold mt-0.5">
                {getSubheading()}
              </p>
            </div>

            {/* Global Weighted Search Bar */}
            <div className="relative max-w-[260px] w-full hidden md:block">
              <div className="flex items-center gap-2 px-3 py-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full text-xs">
                <Search size={14} className="text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search handbook & emergency..."
                  value={searchVal}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-neutral-800 dark:text-neutral-250 placeholder-neutral-400 text-xs"
                />
              </div>

              {/* Search dropdown results */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-xl shadow-xl z-50 overflow-hidden max-h-[300px] overflow-y-auto py-1">
                  {searchResults.map((res, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearchResultClick(res)}
                      className="w-full text-left px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 border-b border-neutral-100 dark:border-neutral-850/40 last:border-b-0 flex flex-col gap-1 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-[11px] text-neutral-800 dark:text-neutral-200 truncate pr-2">{res.title}</span>
                        <span className={`text-[8px] font-black uppercase py-0.5 px-2 rounded-full flex-shrink-0 ${
                          res.type === 'emergency' 
                            ? 'bg-red-500/15 text-red-500' 
                            : res.type === 'safeguarding'
                            ? 'bg-amber-500/15 text-amber-500'
                            : 'bg-emerald-500/15 text-emerald-500'
                        }`}>
                          {res.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 line-clamp-1">{res.snippet}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile widget */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-3 p-1.5 pr-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full shadow-sm hover:border-emerald-600/40 dark:hover:border-emerald-500/40 transition-all select-none"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-700 to-amber-500 text-white font-bold flex items-center justify-center text-sm shadow-inner uppercase">
                  {user?.username?.substring(0, 2) || 'GU'}
                </div>
                <div className="flex flex-col text-left hidden sm:flex">
                  <span className="text-xs font-bold text-neutral-700 dark:text-neutral-200">
                    @{user?.username || 'Guest'}
                  </span>
                  <span className="text-[9px] font-extrabold uppercase text-neutral-400 tracking-wider">
                    {user?.role || 'Staff'}
                  </span>
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-xl shadow-xl z-50 overflow-hidden py-1">
                  <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-800 text-xs text-neutral-400">
                    Signed in as <strong className="text-neutral-700 dark:text-neutral-200">@{user?.username}</strong>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 font-semibold text-xs flex items-center gap-2"
                  >
                    <LogOut size={14} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </header>

          <div className="p-6 md:p-8 flex-1 flex flex-col gap-6">
            {children}
          </div>
        </main>
      </div>

      {/* Emergency Trigger */}
      <EmergencyQuickAction />

      {/* Mobile Sticky Bottom Bar */}
      <MobileBottomNav
        activeView={pathname.replace('/', '') || 'dashboard'}
        onViewChange={(v) => router.push(`/${v}`)}
        showForum={true}
      />
    </div>
  );
}
export default AppShell;
