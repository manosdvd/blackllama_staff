'use client';

import React from 'react';
import { Landmark, Compass } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="glass-panel flex flex-col gap-4 bg-white/70 dark:bg-neutral-900/60 p-6">
        <h2 className="text-2xl font-black text-emerald-800 dark:text-emerald-500 font-heading">
          ABOUT CAMP LAWTON
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
          Established in 1921, Camp Lawton is nestled high on Mount Lemmon in the Coronado National Forest at 8,000 feet of elevation. For over a century, the camp has provided rich outdoor programs and leadership development for Scouts across the Catalina Council.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel flex flex-col gap-3 bg-white/70 dark:bg-neutral-900/60 p-6">
          <h3 className="font-extrabold text-lg text-emerald-800 dark:text-emerald-500 font-heading">
            CAMP ADDRESS & MAIL
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Family and friends can send letters and care packages during the season to:
          </p>
          <div className="bg-neutral-150 dark:bg-neutral-800/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-semibold leading-normal">
            Staff's Name, Camp Staff<br />
            Camp Lawton, BSA<br />
            PO Box 786<br />
            Mt. Lemmon, AZ 85619
          </div>
        </div>

        <div className="glass-panel flex flex-col gap-3 bg-white/70 dark:bg-neutral-900/60 p-6">
          <h3 className="font-extrabold text-lg text-emerald-800 dark:text-emerald-500 font-heading">
            COUNCIL ADMINISTRATION
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Administration offices and registration inquiries are managed by the main office:
          </p>
          <div className="bg-neutral-150 dark:bg-neutral-800/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-semibold leading-normal flex gap-2">
            <Landmark size={18} className="text-neutral-400" />
            <div>
              <strong>Catalina Council, Scouting America</strong><br />
              3501 E Broadway Blvd,<br />
              Tucson, AZ 85716<br />
              Phone: (520) 750-0385
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
