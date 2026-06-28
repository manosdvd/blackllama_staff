'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, ExternalLink } from 'lucide-react';

interface FeedAlert {
  label: string;
  message: string;
  link: string;
  source: string;
  isCritical?: boolean;
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
  const [alertsList, setAlertsList] = useState<FeedAlert[]>(FEED_ALERTS);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('/api/weather');
        if (res.ok) {
          const data = await res.json();
          const dynamicAlerts: FeedAlert[] = [];
          
          if (data.alerts && data.alerts.length > 0) {
            data.alerts.forEach((alert: any) => {
              dynamicAlerts.push({
                label: `⚠️ NWS ALERT: ${alert.severity}`,
                message: alert.event,
                link: 'https://forecast.weather.gov/MapClick.php?lat=32.4434&lon=-110.7881',
                source: 'National Weather Service'
              });
            });
          }
          
          dynamicAlerts.push({
            label: '🌤️ LIVE FORECAST',
            message: `Mt. Lemmon Station: ${data.temp}°${data.tempUnit} and ${data.condition}. Wind: ${data.wind}.`,
            link: 'https://forecast.weather.gov/MapClick.php?lat=32.4434&lon=-110.7881',
            source: 'NWS api.weather.gov'
          });
          
          dynamicAlerts.push({
            label: '🔥 FIRE DANGER',
            message: `Current USFS Fire Danger rating is ${data.fireDanger}.`,
            link: 'https://www.fs.usda.gov/r03/coronado/alerts',
            source: 'USFS Coronado',
            isCritical: data.fireDanger === 'EXTREME' || data.fireDanger === 'HIGH'
          });
          
          setAlertsList(dynamicAlerts);
        }
      } catch (e) {
        // keep defaults if offline
      }
    };
    
    fetchWeather();
    const fetchInterval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(fetchInterval);
  }, []);

  useEffect(() => {
    if (alertsList.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % alertsList.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [alertsList.length]);

  const activeAlert = alertsList[currentIndex] || alertsList[0];
  if (!activeAlert) return null;

  const isEmergency = activeAlert.isCritical || activeAlert.label.includes('⚠️ NWS ALERT');

  return (
    <div className={`border-b px-4 py-2 flex items-center justify-between text-[11px] font-bold tracking-wide relative overflow-hidden select-none z-40 transition-colors ${
      isEmergency 
        ? 'bg-red-700 border-red-500 text-white' 
        : 'bg-neutral-900 border-red-500/25 text-neutral-300'
    }`}>
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <span className={`py-0.5 px-2 rounded-full flex items-center gap-1 uppercase text-[9px] flex-shrink-0 animate-pulse ${
          isEmergency ? 'bg-white/20 text-white border border-white/30' : 'bg-red-500/10 border border-red-500/20 text-red-500'
        }`}>
          <AlertCircle size={10} />
          <span>{isEmergency ? 'CRITICAL ALERT' : 'Active System Feed'}</span>
        </span>
        <div className="flex items-center gap-1.5 truncate">
          <span className={`${isEmergency ? 'text-white font-black' : 'text-amber-500'} uppercase`}>{activeAlert.label}:</span>
          <span className="truncate">{activeAlert.message}</span>
        </div>
      </div>

      <div className={`flex items-center gap-3 flex-shrink-0 pl-4 border-l ${isEmergency ? 'border-red-500/50' : 'border-neutral-800'}`}>
        <span className={`text-[10px] italic hidden sm:inline ${isEmergency ? 'text-red-200' : 'text-neutral-500'}`}>Source: {activeAlert.source}</span>
        <a
          href={activeAlert.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-1 py-1 px-3 rounded-lg text-[9px] transition-colors ${
            isEmergency 
              ? 'bg-white text-red-800 hover:bg-neutral-100' 
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          <span>Learn More</span>
          <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
}
export default AlertsDashboardBar;
