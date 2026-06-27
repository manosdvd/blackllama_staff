'use client';

import { Home, BookOpen, GraduationCap, MessageSquare } from 'lucide-react';

interface MobileBottomNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
  showForum: boolean;
}

const NAV_ITEMS_BASE = [
  { id: 'dashboard', label: 'Home', icon: <Home size={18} /> },
  { id: 'wiki', label: 'Wiki', icon: <BookOpen size={18} /> },
  { id: 'training', label: 'Training', icon: <GraduationCap size={18} /> },
];

const FORUM_ITEM = { id: 'forum', label: 'Forum', icon: <MessageSquare size={18} /> };

export function MobileBottomNav({ activeView, onViewChange, showForum }: MobileBottomNavProps) {
  const items = showForum ? [...NAV_ITEMS_BASE, FORUM_ITEM] : NAV_ITEMS_BASE;

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 h-[65px] bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 z-40 md:hidden flex justify-around items-center px-2"
    >
      {items.map(item => {
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-col items-center gap-1 flex-1 py-2 text-[10px] font-bold uppercase transition-colors duration-150 ${
              isActive
                ? 'text-emerald-700 dark:text-emerald-500 font-extrabold'
                : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
export default MobileBottomNav;
