'use client';

import React, { useState } from 'react';
import { Flame, Trees, UserMinus, CloudLightning, Activity, Radio } from 'lucide-react';

type EmergencyCategory = 'fire' | 'wildlife' | 'lost' | 'weather' | 'medical';

export function EmergencyReferenceCard() {
  const [activeTab, setActiveTab] = useState<EmergencyCategory>('fire');

  const tabs: { id: EmergencyCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'fire', label: 'Fire / Evac', icon: <Flame size={16} /> },
    { id: 'wildlife', label: 'Bear / Wildlife', icon: <Trees size={16} /> },
    { id: 'lost', label: 'Lost Camper', icon: <UserMinus size={16} /> },
    { id: 'weather', label: 'Severe Weather', icon: <CloudLightning size={16} /> },
    { id: 'medical', label: 'Medical Emergency', icon: <Activity size={16} /> }
  ];

  return (
    <div className="flex flex-col gap-6 text-neutral-200">
      {/* Navigation tabs */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-800 pb-3">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-4 rounded-lg font-bold text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-red-950/60 border border-red-500/40 text-red-400'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="bg-neutral-800/40 border border-neutral-800 rounded-xl p-5 min-h-[220px]">
        {activeTab === 'fire' && (
          <div className="flex flex-col gap-4">
            <h4 className="text-red-400 font-extrabold text-lg flex items-center gap-2">
              <span>🔥</span>
              <span>FIRE & SMOKE PROTOCOL (CODE RED)</span>
            </h4>
            <ol className="list-decimal list-inside text-sm text-neutral-300 space-y-3 leading-relaxed">
              <li><strong>Sound the Alarm:</strong> Ring the dining hall bell continuously OR blast three short blasts on your airhorn.</li>
              <li><strong>Evacuate Campers:</strong> Guide all youth to the Camp Parade Ground immediately. Check attendance against roster.</li>
              <li><strong>Report to Ranger:</strong> Contact Ranger Station on Radio Channel 1. State size, location, and direction of fire.</li>
              <li><strong>Evacuation Assembly:</strong> If campfire or structural escape is required, marshal staff at the Tucson Catalina Council Scout Office or Catalina Highway parking hub.</li>
            </ol>
          </div>
        )}

        {activeTab === 'wildlife' && (
          <div className="flex flex-col gap-4">
            <h4 className="text-amber-500 font-extrabold text-lg flex items-center gap-2">
              <span>🐻</span>
              <span>BEAR & MOUNTAIN LION PROTOCOL</span>
            </h4>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Camp Lawton is located in the Santa Catalina Mountains, which is active black bear territory.
            </p>
            <ul className="list-disc list-inside text-sm text-neutral-300 space-y-3 leading-relaxed">
              <li><strong>Smellables:</strong> Absolutely NO food, candy, toothpaste, or sweet drinks inside tents. All smellables must reside in the bear box or dining hall metal cupboards.</li>
              <li><strong>Encounters:</strong> Make yourself look large, throw rocks, wave arms, and speak loudly. Do NOT run. Back away slowly.</li>
              <li><strong>Cougars:</strong> Maintain direct eye contact, scream, and fight back vigorously if attacked.</li>
            </ul>
          </div>
        )}

        {activeTab === 'lost' && (
          <div className="flex flex-col gap-4">
            <h4 className="text-sky-400 font-extrabold text-lg flex items-center gap-2">
              <span>👥</span>
              <span>LOST CAMPER SEARCH PROTOCOLS</span>
            </h4>
            <ol className="list-decimal list-inside text-sm text-neutral-300 space-y-3 leading-relaxed">
              <li><strong>Verify Absence:</strong> Double check latrines, trading post, campsite tents, and program areas.</li>
              <li><strong>Notify HQ:</strong> Call Program Director or Camp Commissioner on Radio Channel 1. Lock down camp exits.</li>
              <li><strong>Mobilize Search:</strong> Form a staff search sweep starting at the camper&apos;s last known location.</li>
              <li><strong>External Alert:</strong> The Camp Director will notify the Pima County Sheriff&apos;s Search and Rescue if the youth is not located within 30 minutes.</li>
            </ol>
          </div>
        )}

        {activeTab === 'weather' && (
          <div className="flex flex-col gap-4">
            <h4 className="text-yellow-500 font-extrabold text-lg flex items-center gap-2">
              <span>⚡</span>
              <span>LIGHTNING DRILLS & SEVERE MONSOONS</span>
            </h4>
            <ul className="list-disc list-inside text-sm text-neutral-300 space-y-3 leading-relaxed">
              <li><strong>Flash-to-Bang:</strong> If thunder sounds within 30 seconds of lightning (under 6 miles), initiate the Lightning Evacuation Drill.</li>
              <li><strong>Safe Structures:</strong> Move campers into fully enclosed buildings (Dining Hall, Health Lodge, Program Offices). Tents are NOT safe.</li>
              <li><strong>Drill Standby:</strong> Wait in shelter until 30 minutes after the last thunderclap before resuming outdoor program.</li>
            </ul>
          </div>
        )}

        {activeTab === 'medical' && (
          <div className="flex flex-col gap-4">
            <h4 className="text-emerald-400 font-extrabold text-lg flex items-center gap-2">
              <span>🩹</span>
              <span>MEDICAL CRISIS RESPONSE</span>
            </h4>
            <ol className="list-decimal list-inside text-sm text-neutral-300 space-y-3 leading-relaxed">
              <li><strong>Assess & Secure:</strong> Ensure the scene is safe for you and the victim. Do not move victim if head/spinal injury is suspected.</li>
              <li><strong>Apply First Aid:</strong> Act within your level of training (CPR/AED, Wilderness First Aid, etc.).</li>
              <li><strong>Contact Health Lodge:</strong> Alert the Camp Health Officer on Radio Channel 2. Specify exact location and vitals.</li>
              <li><strong>911 Protocol:</strong> If emergency transport is required, the Ranger will unlock the front gate and guide Mount Lemmon Fire Department responders.</li>
            </ol>
          </div>
        )}
      </div>

      {/* Emergency Radio Channels Info */}
      <div className="border border-neutral-800 rounded-xl p-4 bg-neutral-900/50 flex items-center gap-4 text-xs">
        <div className="bg-red-950/60 p-2.5 rounded-lg border border-red-500/20 text-red-500">
          <Radio size={20} />
        </div>
        <div className="flex-1">
          <h5 className="font-extrabold text-red-500 uppercase tracking-wide mb-1">Emergency Radio Frequency Allocation</h5>
          <p className="text-neutral-400 leading-normal">
            Channel 1: Operational & Logistics (Ranger, Director) • Channel 2: Medical & Safety (Health Officer) • Channel 3: Program & Area Coordination.
          </p>
        </div>
      </div>
    </div>
  );
}
export default EmergencyReferenceCard;
