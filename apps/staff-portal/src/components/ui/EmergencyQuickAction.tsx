'use client';

import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { EmergencyReferenceCard } from './EmergencyReferenceCard';

/**
 * Floating button on the bottom right that opens a quick emergency modal view.
 */
export function EmergencyQuickAction() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-full shadow-2xl flex items-center gap-2.5 transition-transform duration-300 hover:scale-105 active:scale-95 border-2 border-white/20 animate-bounce reduced-stimulation:animate-none reduced-stimulation:bg-red-800"
        title="Emergency Procedures"
      >
        <ShieldAlert size={20} />
        <span>🚨 EMERGENCY</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-red-500/30 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden relative flex flex-col max-h-[85vh]">
            <header className="bg-red-950/40 border-b border-red-500/20 px-6 py-4 flex items-center justify-between">
              <h3 className="text-red-500 font-extrabold text-xl tracking-wider flex items-center gap-2">
                <ShieldAlert />
                <span>EMERGENCY REFERENCE CARD</span>
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </header>
            
            <div className="p-6 overflow-y-auto flex-1">
              <EmergencyReferenceCard />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default EmergencyQuickAction;
