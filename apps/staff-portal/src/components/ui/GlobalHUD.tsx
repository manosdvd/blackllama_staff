'use client';

import React, { useState, useEffect } from 'react';
import { Cloud, Flame, AlertTriangle, Wind, Droplets, ExternalLink, RefreshCw, ShieldAlert, BellRing } from 'lucide-react';
import { useOffline } from '@/hooks/useOffline';

interface UnifiedAlert {
  id: string;
  source: string;
  title: string;
  description: string;
  severity: string;
  link: string;
}

interface HUDData {
  weather: {
    station: string;
    temp: string;
    tempUnit: string;
    wind: string;
    humidity: string;
  };
  alerts: UnifiedAlert[];
  isCritical: boolean;
  updatedAt: string;
}

export function GlobalHUD() {
  const isOffline = useOffline();
  const [data, setData] = useState<HUDData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    const fetchHUDData = async () => {
      if (isOffline) {
        if (mounted) setLoading(false);
        return;
      }
      
      try {
        const { createClient } = await import('@/utils/supabase/client');
        const supabase = createClient();
        
        let temp = '--', wind = '--', humidity = '--', stationName = 'QSLA3 (Scout Camp RAWS)';
        
        // 1. Weather
        try {
          const obsRes = await fetch('https://api.weather.gov/stations/QSLA3/observations/latest', { headers: { 'User-Agent': 'CampLawtonStaffPortal/1.0' } });
          if (obsRes.ok) {
            const obsData = await obsRes.json();
            const p = obsData.properties;
            if (p.temperature?.value !== null && p.temperature?.value !== undefined) temp = Math.round((p.temperature.value * 9/5) + 32).toString();
            if (p.windSpeed?.value !== null && p.windSpeed?.value !== undefined) wind = Math.round(p.windSpeed.value * 0.621371).toString();
            if (p.relativeHumidity?.value !== null && p.relativeHumidity?.value !== undefined) humidity = Math.round(p.relativeHumidity.value).toString();
            if (temp === '--') throw new Error('NWS empty');
          } else throw new Error('NWS non-200');
        } catch (e) {
          try {
            const omRes = await fetch('https://api.open-meteo.com/v1/forecast?latitude=32.39806&longitude=-110.725&current=temperature_2m,relative_humidity_2m,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph');
            if (omRes.ok) {
              const omData = await omRes.json();
              temp = Math.round(omData.current.temperature_2m).toString();
              wind = Math.round(omData.current.wind_speed_10m).toString();
              humidity = Math.round(omData.current.relative_humidity_2m).toString();
              stationName = 'OpenMeteo (Backup)';
            }
          } catch(err) {}
        }

        const activeAlerts: UnifiedAlert[] = [];
        
        // 2. NWS Alerts
        try {
          const alertsRes = await fetch('https://api.weather.gov/alerts/active?zone=AZZ504', { headers: { 'User-Agent': 'CampLawtonStaffPortal/1.0' } });
          if (alertsRes.ok) {
            const alertsData = await alertsRes.json();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            alertsData.features.forEach((f: any) => {
              activeAlerts.push({
                id: `nws-${f.properties.id || Math.random().toString()}`,
                source: 'NWS',
                title: f.properties.event,
                description: f.properties.headline || f.properties.description,
                severity: f.properties.severity === 'Severe' || f.properties.severity === 'Extreme' ? 'Severe' : 'Warning',
                link: 'https://forecast.weather.gov/MapClick.php?zoneid=AZZ504'
              });
            });
          }
        } catch(e) {}

        // 3. Camp Alerts
        try {
          const { data: campAlerts } = await supabase.from('camp_alerts').select('*').eq('is_active', true).order('created_at', { ascending: false });
          if (campAlerts) {
            campAlerts.forEach(a => {
              activeAlerts.push({
                id: a.id,
                source: 'CAMP',
                title: a.title,
                description: a.description || '',
                severity: a.severity || 'Info',
                link: '#'
              });
            });
          }
        } catch(e) {}

        if (!mounted) return;

        const isCritical = activeAlerts.some(a => a.severity === 'Severe' || (a.title && a.title.toLowerCase().includes('red flag')));
        
        setData({
          weather: { station: stationName, temp, tempUnit: 'F', wind: `${wind} mph`, humidity: `${humidity}%` },
          alerts: activeAlerts,
          isCritical,
          updatedAt: new Date().toISOString()
        });
      } catch (e) {
        console.error('Failed to fetch HUD data', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchHUDData();
    const interval = setInterval(fetchHUDData, 5 * 60 * 1000); // Poll every 5 minutes
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [isOffline]);

  if (isOffline && !data) {
    return (
      <div className="w-full bg-neutral-900 border-b border-neutral-800 p-2 text-center text-[10px] text-neutral-500 font-bold uppercase tracking-widest z-50 relative">
        System Offline - HUD Unavailable
      </div>
    );
  }

  const isEmergency = data?.isCritical || false;

  const campAlerts = data?.alerts.filter(a => a.source === 'CAMP') || [];
  const externalAlerts = data?.alerts.filter(a => a.source !== 'CAMP') || [];

  return (
    <div className={`w-full flex flex-col md:flex-row items-stretch border-b z-50 relative shadow-md transition-colors ${
      isEmergency 
        ? 'bg-red-950 border-red-500' 
        : 'bg-neutral-950 dark:bg-black border-neutral-800'
    }`}>
      
      {/* 1. WEATHER & CONDITIONS */}
      <a 
        href="https://forecast.weather.gov/MapClick.php?lat=32.39806&lon=-110.725"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-4 px-4 py-3 md:border-r ${isEmergency ? 'border-red-900/50 hover:bg-red-900/20' : 'border-neutral-800 hover:bg-white/5'} flex-shrink-0 transition-colors cursor-pointer group`}
      >
        <div className={`p-2 rounded-xl flex items-center justify-center ${isEmergency ? 'bg-red-500/20 text-red-400 group-hover:bg-red-500/30' : 'bg-sky-500/10 text-sky-400 group-hover:bg-sky-500/20'} transition-colors`}>
          <Cloud size={24} />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-neutral-300 transition-colors">
            <span>{data?.weather.station || 'WEATHER STATION'}</span>
            {loading && <RefreshCw size={10} className="animate-spin text-sky-500" />}
            <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className={`text-xl font-black font-heading tracking-tight ${isEmergency ? 'text-red-100' : 'text-neutral-100'}`}>
              {data?.weather.temp || '--'}°{data?.weather.tempUnit || 'F'}
            </span>
            <div className={`flex items-center gap-2 text-xs font-semibold ${isEmergency ? 'text-red-300' : 'text-neutral-400'}`}>
              <span className="flex items-center gap-1"><Wind size={12}/> {data?.weather.wind || '-- mph'}</span>
              <span className="flex items-center gap-1"><Droplets size={12}/> {data?.weather.humidity || '--%'}</span>
            </div>
          </div>
        </div>
      </a>

      {/* 2. CAMP ALERTS (Internal Admin Broadcasts) */}
      {campAlerts.length > 0 && (
        <div className="flex-1 flex flex-col justify-center px-4 py-3 min-w-0 md:border-r border-neutral-800/50 bg-black/10">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">
            <BellRing size={10} className="text-emerald-500" />
            <span>Camp Alerts</span>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {campAlerts.map((alert) => (
              <div 
                key={alert.id}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border max-w-full ${
                  alert.severity === 'Severe' || isEmergency
                    ? 'bg-red-500/20 text-red-300 border-red-500/30'
                    : alert.severity === 'Warning'
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                }`}
              >
                {alert.severity !== 'Info' && <AlertTriangle size={12} className="flex-shrink-0 animate-pulse" />}
                <span className="truncate">{alert.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. EXTERNAL ALERTS (NWS / USFS) */}
      <div className="flex-1 flex flex-col justify-center px-4 py-3 min-w-0">
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">
          <span>Regional Alerts</span>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {externalAlerts.length === 0 ? (
            <span className="text-emerald-500 font-bold text-xs flex items-center gap-1.5">
              <ShieldAlert size={14} /> No active regional alerts.
            </span>
          ) : (
            externalAlerts.map((alert) => (
              <a 
                key={alert.id} 
                href={alert.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border max-w-full hover:opacity-80 transition-opacity ${
                  alert.severity === 'Severe' || alert.severity === 'Extreme' || isEmergency
                    ? 'bg-red-500/20 text-red-300 border-red-500/30'
                    : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                }`}
              >
                <AlertTriangle size={12} className="flex-shrink-0 animate-pulse" />
                <span className="truncate">{alert.title}</span>
                <ExternalLink size={10} className="ml-1 opacity-60 flex-shrink-0" />
              </a>
            ))
          )}
        </div>
      </div>

      {/* 4. QUICK LINKS (Forest Service & Fire Dist) */}
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
