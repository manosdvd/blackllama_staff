'use client';

import React from 'react';
import { ShieldAlert, Lock, Mail, Phone } from 'lucide-react';

interface StaffProfile {
  id: string;
  name: string;
  role: string;
  age: number;
  hometown: string;
  favSong: string;
  bio: string;
  avatarColor: string;
}

// Static staff list defined outside component for performance stability
const STAFF_LIST: StaffProfile[] = [
  {
    id: 's1',
    name: 'MaryLou Chopelas',
    role: 'Camp Ranger & Camp Director',
    age: 48,
    hometown: 'Tucson, AZ',
    favSong: 'The Mountain Song',
    bio: 'Serving Camp Lawton since 2018. Love hiking, wilderness scouting, and maintaining Mt Lemmon trails.',
    avatarColor: '#1F4D3A'
  },
  {
    id: 's2',
    name: 'Jimmy Tarleton',
    role: 'Scoutcraft Area Director',
    age: 22,
    hometown: 'Phoenix, AZ',
    favSong: 'Campfire Flicker Song',
    bio: 'NCS certified in outdoor skills. Expert in knot tying, lashings, and building pioneering camp structures.',
    avatarColor: '#D9A521'
  },
  {
    id: 's3',
    name: 'Bobby Jenkins',
    role: 'CIT / Volunteer',
    age: 15, // Minor
    hometown: 'Sierra Vista, AZ',
    favSong: 'Silly Songs',
    bio: 'Excited for my first season on Staff Hill! Learning handicraft and nature skills.',
    avatarColor: '#1A2B3C'
  }
];

export default function DirectoryPage() {

  return (
    <div className="flex flex-col gap-6">
      {/* Privacy Warning Disclosures */}
      <div className="glass-panel border-l-4 border-emerald-800 bg-emerald-500/5 p-4 rounded-xl flex gap-3 text-xs leading-relaxed text-emerald-800 dark:text-emerald-400">
        <ShieldAlert className="flex-shrink-0 mt-0.5" size={18} />
        <div>
          <strong>👥 STAFF PRIVACY & SAFEGUARDING NOTICE:</strong> Contact details (phone numbers, email addresses, mailing logs) are strictly private and hidden from public views.
          <ul className="list-disc list-inside mt-1.5 space-y-1 pl-1">
            <li>Profiles of minor staff under 18 (CITs and Junior Staff) are restricted. Personal details such as hometown, bio, and favorite song are hidden from other staff members for digital safety.</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STAFF_LIST.map(staff => {
          const isMinor = staff.age < 18;
          return (
            <div
              key={staff.id}
              className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-5 flex flex-col gap-4 border border-neutral-200 dark:border-neutral-800/80 hover:border-emerald-700/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white uppercase text-base shadow-sm"
                  style={{ backgroundColor: staff.avatarColor }}
                >
                  {staff.name.substring(0, 2)}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-neutral-850 dark:text-neutral-200">
                    {staff.name}
                  </h4>
                  <span className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-wide">
                    {staff.role} {isMinor && '• MINOR'}
                  </span>
                </div>
              </div>

              {/* Profile Bio Details */}
              <div className="flex-1 flex flex-col gap-2.5 mt-2 border-t border-neutral-250/20 pt-3">
                {isMinor ? (
                  <div className="bg-neutral-100 dark:bg-neutral-850 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 flex gap-2 items-center text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
                    <Lock size={12} />
                    <span>Minor Protection — Profile details locked</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-350">
                    <div><strong>Hometown:</strong> {staff.hometown}</div>
                    <div><strong>Favorite Song:</strong> {staff.favSong}</div>
                    <p className="italic text-neutral-500 mt-1">"{staff.bio}"</p>
                  </div>
                )}
              </div>

              {/* Contact Buttons */}
              <div className="flex gap-2 mt-2">
                <button
                  disabled
                  className="flex-1 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-[10px] font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 cursor-not-allowed flex items-center justify-center gap-1.5"
                  title="Contact details are private"
                >
                  <Mail size={12} />
                  <span>Email (Private)</span>
                </button>
                <button
                  disabled
                  className="flex-1 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-[10px] font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 cursor-not-allowed flex items-center justify-center gap-1.5"
                  title="Contact details are private"
                >
                  <Phone size={12} />
                  <span>Call (Private)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
