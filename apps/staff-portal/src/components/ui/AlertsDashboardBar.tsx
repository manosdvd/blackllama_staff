'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, ExternalLink } from 'lucide-react';

interface FeedAlert {
  label: string;
  message: string;
  link: string;
  source: string;
}

// Defined outside component so the array reference is stable
const FEED_ALERTS: FeedAlert[] = [
  {
    label: '🌤️ NWS GRIDPOINT',
    message: 'Mount Lemmon Forecast Station active at Grid Gridpoints TWC/94,59.',
    link: 'https://api.weather.gov/gridpoints/TWC/94,59/forecast',
    source: 'National Weather Service'
  },
  {
    label: '🌊 FLOOD MONITORS',
    message: 'Pima ALERT rainfall and flash flood streamflow sensors online.',
    link: 'https://www.pima.gov/1686/Precipitation-Streamflow-Data',
    source: 'Pima County Hydrology'
  },
  {
    label: '🔥 WILDLAND INCIWEB',
    message: 'Coronado National Forest incident feed active. Track wildfire status.',
    link: 'https://www.fs.usda.gov/r03/coronado/alerts',
    source: 'InciWeb Feed'
  },
  {
    label: '⚠️ HIGHWAY WARNINGS',
    message: 'AzEIN Emergency updates: Mt Lemmon highway closures and smoke alerts.',
    link: 'https://ein.az.gov/taxonomy/term/2159',
    source: 'AzEIN Coronado Feed'
  },
  {
    label: '🚨 MASS ALERTS',
    message: 'Everbridge location-based text alerts registered for camp location.',
    link: 'https://emergencyalerts.pima.gov',
    source: 'Pima MyAlerts Everbridge'
  },
  {
    label: '📢 LATEST BLOG POST',
    message: '"Safety Protocols for Coronado National Forest Summer Season 2026"',
    link: '/wiki?slug=welcome-to-camp-lawton-staff',
    source: 'Camp Lawton Blog'
  }
];

export function AlertsDashboardBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % FEED_ALERTS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const activeAlert = FEED_ALERTS[currentIndex];

  return (
    <div className="bg-neutral-900 border-b border-red-500/25 px-4 py-2 flex items-center justify-between text-[11px] font-bold tracking-wide relative overflow-hidden select-none z-40">
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <span className="bg-red-500/10 border border-red-500/20 text-red-500 py-0.5 px-2 rounded-full flex items-center gap-1 uppercase text-[9px] flex-shrink-0 animate-pulse">
          <AlertCircle size={10} />
          <span>Active System Feed</span>
        </span>
        <div className="flex items-center gap-1.5 truncate text-neutral-300">
          <span className="text-amber-500 uppercase">{activeAlert.label}:</span>
          <span className="truncate">{activeAlert.message}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0 pl-4 border-l border-neutral-800">
        <span className="text-[10px] text-neutral-500 italic hidden sm:inline">Source: {activeAlert.source}</span>
        <a
          href={activeAlert.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-lg text-[9px] transition-colors"
        >
          <span>Learn More</span>
          <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
}
export default AlertsDashboardBar;
