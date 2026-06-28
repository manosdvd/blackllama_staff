'use client';

import React, { useState, useEffect } from 'react';
import { Cloud, Flame, AlertTriangle, Wind, Droplets, ExternalLink, RefreshCw, ShieldAlert } from 'lucide-react';
import { useOffline } from '@/hooks/useOffline';

interface Alert {
  event: string;
  severity: string;
  urgency: string;
  description: string;
}

interface HUDData {
  station: string;
  temp: string;
  tempUnit: string;
  wind: string;
  humidity: string;
  alerts: Alert[];
  isCritical: boolean;
  updatedAt: string;
}

export function GlobalHUD() {
  const isOffline = useOffline();
  const [data, setData] = useState<HUDData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHUDData = async () => {
    if (isOffline) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/weather');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error('Failed to fetch HUD data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHUDData();
    const interval = setInterval(fetchHUDData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isOffline]);

  if (isOffline && !data) {
    return (
      <div className="w-full bg-neutral-900 border-b border-neutral-800 p-2 text-center text-[10px] text-neutral-500 font-bold uppercase tracking-widest z-50 relative">
        System Offline - HUD Unavailable
      </div>
    );
  }

  const isEmergency = data?.isCritical;

  return (
    <div className={`w-full flex flex-col md:flex-row items-stretch border-b z-50 relative shadow-md transition-colors ${
      isEmergency 
        ? 'bg-red-950 border-red-500' 
        : 'bg-neutral-950 dark:bg-black border-neutral-800'
    }`}>
      
      {/* 1. WEATHER & CONDITIONS (QSLA3) */}
      <div className={`flex items-center gap-4 px-4 py-3 md:border-r ${isEmergency ? 'border-red-900/50' : 'border-neutral-800'} flex-shrink-0`}>
        <div className={`p-2 rounded-xl flex items-center justify-center ${isEmergency ? 'bg-red-500/20 text-red-400' : 'bg-sky-500/10 text-sky-400'}`}>
          <Cloud size={24} />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-neutral-400">
            <span>{data?.station || 'QSLA3 STATION'}</span>
            {loading && <RefreshCw size={10} className="animate-spin text-sky-500" />}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className={`text-xl font-black font-heading tracking-tight ${isEmergency ? 'text-red-100' : 'text-neutral-100'}`}>
              {data?.temp || '--'}°{data?.tempUnit || 'F'}
            </span>
            <div className={`flex items-center gap-2 text-xs font-semibold ${isEmergency ? 'text-red-300' : 'text-neutral-400'}`}>
              <span className="flex items-center gap-1"><Wind size={12}/> {data?.wind || '-- mph'}</span>
              <span className="flex items-center gap-1"><Droplets size={12}/> {data?.humidity || '--%'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NWS ALERTS (AZZ504) */}
      <div className="flex-1 flex flex-col justify-center px-4 py-3 min-w-0">
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">
          <span>Catalina Mountains Alerts</span>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {(!data?.alerts || data.alerts.length === 0) ? (
            <span className="text-emerald-500 font-bold text-xs flex items-center gap-1.5">
              <ShieldAlert size={14} /> No active weather alerts.
            </span>
          ) : (
            data.alerts.map((alert, idx) => (
              <div key={idx} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border max-w-full ${
                alert.severity === 'Severe' || alert.severity === 'Extreme' || isEmergency
                  ? 'bg-red-500/20 text-red-300 border-red-500/30'
                  : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
              }`}>
                <AlertTriangle size={12} className="flex-shrink-0 animate-pulse" />
                <span className="truncate">{alert.event}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. QUICK LINKS (Forest Service & Fire Dist) */}
      <div className={`flex md:flex-col justify-center gap-2 px-4 py-3 md:border-l ${isEmergency ? 'border-red-900/50' : 'border-neutral-800'} flex-shrink-0 bg-black/20`}>
        <a 
          href="https://www.fs.usda.gov/r03/coronado/alerts" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-300 hover:text-white transition-colors"
        >
          <Flame size={12} className={isEmergency ? 'text-red-400' : 'text-amber-500'} />
          <span>Coronado FS Alerts</span>
          <ExternalLink size={10} className="opacity-50" />
        </a>
        <a 
          href="https://ein.az.gov/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-300 hover:text-white transition-colors"
        >
          <ShieldAlert size={12} className="text-sky-500" />
          <span>AzEIN & Mt Lemmon</span>
          <ExternalLink size={10} className="opacity-50" />
        </a>
      </div>

    </div>
  );
}
