'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Search,
  Lock,
  AlertTriangle,
  Command as CommandIcon
} from 'lucide-react';
import { Command } from 'cmdk';
import { OfflineStatusBanner } from '../offline/OfflineStatusBanner';
import { EmergencyQuickAction } from '../ui/EmergencyQuickAction';
import { MobileBottomNav } from './MobileBottomNav';
import { performWeightedSearch, SearchResult } from '@/lib/search';
import { GlobalHUD } from '../ui/GlobalHUD';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

interface AppShellProps {
  children: React.ReactNode;
}

type Theme = 'light' | 'dark';

const readTheme = (): Theme => {
  if (typeof window === 'undefined') return 'dark';
  const savedTheme = localStorage.getItem('lawton_theme');
  return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
};

const readCalmMode = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('camp_lawton_calm_mode') === 'true';
};

// ---- Static nav icon helpers (defined outside to avoid re-creation per render) ----
const NAV_ICON_HOME = <Home size={18} />;
const NAV_ICON_WIKI = <BookOpen size={18} />;
const NAV_ICON_ABOUT = <Compass size={18} />;
const NAV_ICON_TRAINING = <GraduationCap size={18} />;
const NAV_ICON_POLICIES = <Shield size={18} />;
const NAV_ICON_ONBOARDING = <Briefcase size={18} />;
const NAV_ICON_FORUM = <MessageSquare size={18} />;
const NAV_ICON_DIRECTORY = <Users size={18} />;
const NAV_ICON_ADMIN = <Lock size={18} />;

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname() || '/';
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [isCalm, setIsCalm] = useState(readCalmMode);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  
  // CMDK Command Palette state
  const [isCmdkOpen, setIsCmdkOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [emergencyAlert, setEmergencyAlert] = useState<{ title: string; snippet: string } | null>(null);

  // Ref for click-outside detection on user dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  // CMDK Keyboard shortcut Cmd+K
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isModifierPressed = e.metaKey || e.ctrlKey;
      if (isModifierPressed && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCmdkOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Debounced search logic for CMDK
  useEffect(() => {
    if (!searchVal) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const delayTimer = setTimeout(() => {
      try {
        setSearchResults(performWeightedSearch(searchVal));
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(delayTimer);
  }, [searchVal]);

  const handleSearchResultClick = (res: SearchResult) => {
    setIsCmdkOpen(false);
    setSearchVal('');
    setSearchResults([]);

    if (res.type === 'emergency') {
      setEmergencyAlert({ title: res.title, snippet: res.snippet });
    } else {
      router.push(`/wiki?slug=${res.slug}`);
      window.dispatchEvent(new CustomEvent('wiki-navigate', { detail: res.slug }));
    }
  };

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      if (isCalm) {
        document.documentElement.classList.add('reduced-stimulation');
      } else {
        document.documentElement.classList.remove('reduced-stimulation');
      }
    } catch {
      // localStorage unavailable
    }
  }, [isCalm, theme]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setUser(null);
        router.push('/');
        return;
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, role')
        .eq('id', session.user.id)
        .single();
        
      if (profile) {
        setUser(profile as { username: string; role: string });
      } else {
        setUser({ username: session.user.email?.split('@')[0] || 'Unknown', role: 'Candidate' });
      }
    };
    
    fetchUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session) {
        setUser(null);
        router.push('/');
      } else if (event === 'SIGNED_IN') {
        fetchUser();
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  // Close user dropdown when clicking outside
  useEffect(() => {
    if (!userDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  // Close search results on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEmergencyAlert(null);
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  const isStaffOrAdmin = user?.role === 'Staff' || user?.role === 'Admin';
  const isAdmin = user?.role === 'Admin';
  const isAlumni = user?.role === 'Alumni';
  const hasStaffAccess = isStaffOrAdmin || isAlumni;

  const navLinks = [
    { href: '/', label: 'Welcome / Home', icon: NAV_ICON_HOME },
    { href: '/wiki', label: 'Handbook Wiki', icon: NAV_ICON_WIKI },
    { href: '/about', label: 'About Camp Lawton', icon: NAV_ICON_ABOUT },
    { href: '/training', label: 'Safety Training', icon: NAV_ICON_TRAINING },
    { href: '/policies', label: 'Policies & Procedures', icon: NAV_ICON_POLICIES },
    { href: '/onboarding', label: 'Onboarding Wizard', icon: NAV_ICON_ONBOARDING },
    ...(hasStaffAccess
      ? [
          { href: '/forum', label: 'Staff Forum', icon: NAV_ICON_FORUM },
          { href: '/directory', label: 'Staff Directory', icon: NAV_ICON_DIRECTORY },
        ]
      : []),
    ...(isAdmin
      ? [{ href: '/admin', label: 'Admin Portal', icon: NAV_ICON_ADMIN }]
      : []),
  ];

  const activeView = pathname.split('/')[1] || '';

  const getHeading = () => {
    if (pathname.includes('/wiki')) return 'Handbook Wiki';
    if (pathname.includes('/training')) return 'Safety Training';
    if (pathname.includes('/policies')) return 'Policies & Procedures';
    if (pathname.includes('/onboarding')) return 'Onboarding Wizard';
    if (pathname.includes('/forum')) return 'Staff Forum';
    if (pathname.includes('/directory')) return 'Staff Directory';
    if (pathname.includes('/about')) return 'About Camp Lawton';
    if (pathname.includes('/admin')) return 'Admin Portal';
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
    if (pathname.includes('/admin')) return 'Manage applications, audit logs, and seasonal rollover.';
    return 'Welcome to your digital onboarding portal.';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <GlobalHUD />
      <OfflineStatusBanner />

      <div className="flex-1 flex flex-col md:flex-row relative">
        <aside className="hidden md:flex w-[280px] bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex-col p-6 sticky top-0 h-screen select-none z-30">
          <div className="flex items-center gap-3 mb-8">
            <Image
              src="/camp-logo.png"
              alt="Camp Lawton"
              width={48}
              height={48}
              className="w-12 h-12 object-contain filter drop-shadow-md"
              priority
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

          <nav aria-label="Main navigation" className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1">
            {navLinks.map(link => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
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

          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 mt-4 flex items-center justify-between">
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="theme-toggle-btn w-10 h-10 rounded-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={toggleCalmMode}
              aria-label={isCalm ? 'Disable reduced stimulation mode' : 'Enable reduced stimulation mode'}
              aria-pressed={isCalm}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                isCalm
                  ? 'bg-emerald-700 border-emerald-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              <Leaf size={18} />
            </button>
          </div>
        </aside>

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

            {/* CMDK Trigger Button */}
            <div className="relative max-w-[260px] w-full hidden md:block">
              <button
                onClick={() => setIsCmdkOpen(true)}
                className="w-full flex items-center justify-between px-3 py-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500/40 transition-colors rounded-full text-xs text-neutral-500 dark:text-neutral-400"
              >
                <div className="flex items-center gap-2">
                  <Search size={14} />
                  <span>Search handbook...</span>
                </div>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded shadow-sm text-neutral-500 dark:text-neutral-300">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Profile widget */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-label="Open user menu"
                aria-haspopup="true"
                aria-expanded={userDropdownOpen}
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
                <div
                  role="menu"
                  aria-label="User options"
                  className="absolute right-0 mt-2.5 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl z-50 overflow-hidden py-1"
                >
                  <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-800 text-xs text-neutral-400">
                    Signed in as <strong className="text-neutral-700 dark:text-neutral-200">@{user?.username}</strong>
                  </div>
                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 border-t border-neutral-100 dark:border-neutral-800 font-semibold text-xs flex items-center gap-2"
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

      {/* Inline Emergency Alert Modal (replaces browser alert()) */}
      {emergencyAlert && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="emergency-modal-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setEmergencyAlert(null)}
        >
          <div
            className="bg-white dark:bg-neutral-900 border-2 border-red-500 rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle size={22} />
              <h2 id="emergency-modal-title" className="font-black text-base uppercase tracking-wide">Emergency Protocol</h2>
            </div>
            <h3 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">{emergencyAlert.title}</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{emergencyAlert.snippet}</p>
            <button
              autoFocus
              onClick={() => setEmergencyAlert(null)}
              className="mt-2 py-2 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Acknowledged — Close
            </button>
          </div>
        </div>
      )}

      {/* CMDK Command Palette Modal */}
      {isCmdkOpen && (
        <div className="fixed inset-0 z-[150] flex items-start justify-center pt-[15vh] bg-gray-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl transition-all">
            <Command label="Global Command Palette" className="w-full" shouldFilter={false}>
              <div className="flex items-center border-b border-neutral-200 dark:border-neutral-800 px-4 py-3 gap-2">
                <Search size={16} className="text-neutral-400" />
                <Command.Input
                  autoFocus
                  value={searchVal}
                  onValueChange={setSearchVal}
                  className="w-full bg-transparent text-sm outline-none text-neutral-800 dark:text-neutral-100 placeholder-neutral-400"
                  placeholder="Search wiki, forums, or emergency procedures..."
                />
                <button
                  onClick={() => setIsCmdkOpen(false)}
                  className="text-xs font-mono text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                >
                  ESC
                </button>
              </div>

              <Command.List className="max-h-[350px] overflow-y-auto p-2 scrollbar-thin">
                {isSearching && <div className="p-4 text-xs text-center text-neutral-400">Searching index...</div>}
                {!isSearching && searchResults.length === 0 && searchVal && (
                  <div className="p-4 text-xs text-center text-neutral-400">No matching documents found.</div>
                )}
                {!isSearching && !searchVal && (
                  <div className="p-4 text-xs text-center text-neutral-400 flex flex-col gap-1 items-center">
                    <span>Start typing to search the handbook...</span>
                    <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded text-[10px] mt-2">
                      Try searching &quot;bear&quot; or &quot;fire&quot;
                    </span>
                  </div>
                )}

                {searchResults.length > 0 && (
                  <Command.Group heading="Search Results" className="text-[10px] text-neutral-400 px-2 py-2 font-bold uppercase tracking-wider">
                    {searchResults.map((res) => (
                      <Command.Item
                        key={`${res.type}-${res.slug}`}
                        onSelect={() => handleSearchResultClick(res)}
                        className="flex flex-col gap-1 px-3 py-2.5 text-sm rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 aria-selected:bg-neutral-100 dark:aria-selected:bg-neutral-800 text-neutral-700 dark:text-neutral-200 select-none transition-colors mt-1"
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="font-bold text-[13px] text-neutral-800 dark:text-neutral-200 truncate pr-2">{res.title}</span>
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
                        <p className="text-[11px] text-neutral-500 line-clamp-1">{res.snippet}</p>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}
              </Command.List>
            </Command>
          </div>
        </div>
      )}

      {/* Emergency Trigger Float */}
      <EmergencyQuickAction />

      {/* Mobile Sticky Bottom Bar */}
      <MobileBottomNav
        activeView={activeView}
        onViewChange={(v) => router.push(`/${v}`)}
        showForum={hasStaffAccess}
      />
    </div>
  );
}
export default AppShell;
