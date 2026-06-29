'use client';

import React, { useState, useEffect } from 'react';
import { Cloud, Wind, Droplets, ExternalLink, RefreshCw, ChevronLeft, ChevronRight, AlertTriangle, AlertCircle, Info, WifiOff, ShieldAlert } from 'lucide-react';
import { useOffline } from '@/hooks/useOffline';
import { OpsFeedItem, OpsHudResponse } from '@/lib/ops/build-hud';
import { CampLifeTickerItem, CAMP_LIFE_LOCAL_ITEMS } from '@/data/ticker/campLifeLocal';

function getTickerColor(source?: string) {
  switch (source) {
    case 'wfigs': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
    case 'nws': return 'bg-sky-500/20 text-sky-400 border border-sky-500/30';
    case 'gdelt': return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
    case 'camp': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    case 'azgfd': return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    case 'az511': return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
    case 'usfs': return 'bg-green-500/20 text-green-400 border border-green-500/30';
    default: return 'bg-neutral-800 text-neutral-300';
  }
}

export function GlobalHUD() {
  const isOffline = useOffline();
  const [weather, setWeather] = useState({ station: 'QSLA3', temp: '--', tempUnit: 'F', wind: '-- mph', humidity: '--%' });
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [opsData, setOpsData] = useState<OpsHudResponse | null>(null);
  
  const [tickerIndex, setTickerIndex] = useState(0);
  const [campLifeItems, setCampLifeItems] = useState<CampLifeTickerItem[]>([]);
  const [campLifeIndex, setCampLifeIndex] = useState(0);

  // Weather fetch
  useEffect(() => {
    let mounted = true;
    const fetchWeather = async () => {
      if (isOffline) {
        if (mounted) setWeatherLoading(false);
        return;
      }
      try {
        let temp = '--', wind = '--', humidity = '--', stationName = 'QSLA3 (RAWS)';
        const obsRes = await fetch('https://api.weather.gov/stations/QSLA3/observations/latest', { headers: { 'User-Agent': 'CampLawtonStaffPortal/1.0' } });
        if (obsRes.ok) {
          const obsData = await obsRes.json();
          const p = obsData.properties;
          if (p.temperature?.value !== null && p.temperature?.value !== undefined) temp = Math.round((p.temperature.value * 9/5) + 32).toString();
          if (p.windSpeed?.value !== null && p.windSpeed?.value !== undefined) wind = Math.round(p.windSpeed.value * 0.621371).toString();
          if (p.relativeHumidity?.value !== null && p.relativeHumidity?.value !== undefined) humidity = Math.round(p.relativeHumidity.value).toString();
          if (temp === '--') throw new Error('NWS empty');
        } else throw new Error('NWS non-200');
        
        if (mounted) setWeather({ station: stationName, temp, tempUnit: 'F', wind: `${wind} mph`, humidity: `${humidity}%` });
      } catch (e) {
        try {
          const omRes = await fetch('https://api.open-meteo.com/v1/forecast?latitude=32.39806&longitude=-110.725&current=temperature_2m,relative_humidity_2m,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph');
          if (omRes.ok) {
            const omData = await omRes.json();
            if (mounted) {
              setWeather({
                station: 'OpenMeteo (Backup)',
                temp: Math.round(omData.current.temperature_2m).toString(),
                tempUnit: 'F',
                wind: `${Math.round(omData.current.wind_speed_10m)} mph`,
                humidity: `${Math.round(omData.current.relative_humidity_2m)}%`
              });
            }
          }
        } catch(err) {}
      } finally {
        if (mounted) setWeatherLoading(false);
      }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 5 * 60 * 1000);
    return () => { mounted = false; clearInterval(interval); };
  }, [isOffline]);

  // Combined Ops & CampLife fetch
  useEffect(() => {
    let mounted = true;
    const fetchHUDData = async () => {
      if (isOffline) return;

      try {
        const res = await fetch('/api/ops/hud');
        if (res.ok) {
          const data: OpsHudResponse = await res.json();
          if (mounted) {
            setOpsData(data);
            setTickerIndex(0);
          }
          if ((data as any).weather) {
            setWeather((data as any).weather);
          }
          
          localStorage.setItem('ops_hud_cache', JSON.stringify({
            savedAt: new Date().toISOString(),
            data
          }));
        }
      } catch (err) {
        console.error('Failed to fetch operational HUD, falling back to cache');
        const cached = localStorage.getItem('ops_hud_cache');
        if (cached) {
          try {
            const { data } = JSON.parse(cached);
            setOpsData(data);
            if ((data as any).weather) setWeather((data as any).weather);
          } catch {
            // ignore
          }
        }
      }

      try {
        const campLifeRes = await fetch('/api/camp-life');
        if (campLifeRes.ok) {
          const campLifeData = await campLifeRes.json();
          const items = Array.isArray(campLifeData.items) ? campLifeData.items : [];
          setCampLifeItems(items);
          localStorage.setItem('camp_life_ticker_cache', JSON.stringify({
            savedAt: new Date().toISOString(),
            items,
          }));
        }
      } catch {
        try {
          const cached = JSON.parse(localStorage.getItem('camp_life_ticker_cache') || 'null');
          if (Array.isArray(cached?.items) && cached.items.length > 0) {
            setCampLifeItems(cached.items);
          } else {
            setCampLifeItems(CAMP_LIFE_LOCAL_ITEMS);
          }
        } catch {
          setCampLifeItems(CAMP_LIFE_LOCAL_ITEMS);
        }
      }
    };

    fetchHUDData();
    const interval = setInterval(fetchHUDData, 60 * 1000);
    return () => { mounted = false; clearInterval(interval); };
  }, [isOffline]);

  // Rotations
  useEffect(() => {
    const items = opsData?.tickerItems || [];
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [opsData?.tickerItems]);

  useEffect(() => {
    if (campLifeItems.length <= 1) return;
    const timer = setInterval(() => {
      setCampLifeIndex((current) => (current + 1) % campLifeItems.length);
    }, 12000);
    return () => clearInterval(timer);
  }, [campLifeItems.length]);

  if (isOffline && !opsData) {
    return (
      <div className="w-full bg-neutral-900 border-b border-neutral-800 p-2 text-center text-[10px] text-neutral-500 font-bold uppercase tracking-widest z-50 relative">
        System Offline - HUD Unavailable
      </div>
    );
  }

  const priorityItems = opsData?.priorityItems || [];
  const tickerItems = opsData?.tickerItems || [];
  const topPriority = priorityItems[0];
  const isEmergency = priorityItems.some(i => i.severity === 'critical' || i.severity === 'admin-evacuation-review');

  const currentTickerItem = tickerItems[tickerIndex] || null;
  const activeCampLifeItem = campLifeItems.length ? campLifeItems[campLifeIndex % campLifeItems.length] : null;

  const nextTicker = () => setTickerIndex(i => (i + 1) % tickerItems.length);
  const prevTicker = () => setTickerIndex(i => (i - 1 + tickerItems.length) % tickerItems.length);

  return (
    <div className={`w-full flex flex-col md:flex-row items-stretch border-b z-50 relative shadow-md transition-colors ${
      isEmergency ? 'bg-red-950 border-red-500' : 'bg-neutral-950 dark:bg-black border-neutral-800'
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
            <span>{weather.station}</span>
            {weatherLoading && <RefreshCw size={10} className="animate-spin text-sky-500" />}
            <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className={`text-xl font-black font-heading tracking-tight ${isEmergency ? 'text-red-100' : 'text-neutral-100'}`}>
              {weather.temp}°{weather.tempUnit}
            </span>
            <div className={`flex items-center gap-2 text-xs font-semibold ${isEmergency ? 'text-red-300' : 'text-neutral-400'}`}>
              <span className="flex items-center gap-1"><Wind size={12}/> {weather.wind}</span>
              <span className="flex items-center gap-1"><Droplets size={12}/> {weather.humidity}</span>
            </div>
          </div>
        </div>
      </a>

      {/* 2. PRIORITY BAR */}
      <div className={`${priorityItems.length > 0 ? 'flex-1 min-w-0' : 'flex-none'} flex flex-col justify-center px-4 py-3 md:border-r ${isEmergency ? 'border-red-900/50 bg-red-900/10' : 'border-neutral-800/50 bg-black/10'}`}>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">
          {priorityItems.length > 0 ? (
            <>
              <AlertTriangle size={10} className={isEmergency ? 'text-red-500 animate-pulse' : 'text-amber-500'} />
              <span className={isEmergency ? 'text-red-400' : 'text-amber-500'}>
                Priority Alerts ({priorityItems.length})
              </span>
            </>
          ) : (
            <>
              <ShieldAlert size={10} className="text-emerald-500" />
              <span>Status Normal</span>
            </>
          )}
        </div>
        
        {topPriority ? (
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${
              topPriority.severity === 'critical' || topPriority.severity === 'admin-evacuation-review' || topPriority.severity === 'critical-safety'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : topPriority.severity === 'persistent-news-check'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {topPriority.severity === 'persistent-news-check' ? 'NEWS CHECK' : topPriority.sourceLabel}
            </span>
            <span className={`text-sm font-bold truncate ${isEmergency ? 'text-red-100' : 'text-white'}`}>
              {topPriority.title}
            </span>
            <a href={topPriority.sourceUrl} target="_blank" rel="noopener noreferrer" className="ml-auto flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors flex-shrink-0">
              Source <ExternalLink size={10} />
            </a>
          </div>
        ) : (
          <div className="text-sm font-semibold text-emerald-500/80">
            No active Santa Catalina priority alerts.
          </div>
        )}
      </div>

      {/* 3. TICKER RAIL & CAMPLIFE */}
      <div className="flex flex-col flex-1 min-w-0">
        {tickerItems.length > 0 && (
          <div className="flex flex-col justify-center px-4 py-2 flex-1 min-w-0 border-b border-neutral-800/50">
            <div className="flex items-center justify-between gap-1.5 text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">
              <span>Ticker & Context</span>
              {tickerItems.length > 1 && (
                <div className="flex items-center gap-1">
                  <button onClick={prevTicker} className="p-0.5 hover:bg-neutral-800 rounded transition-colors"><ChevronLeft size={12} /></button>
                  <span className="text-[9px] opacity-60 font-mono">{tickerIndex + 1}/{tickerItems.length}</span>
                  <button onClick={nextTicker} className="p-0.5 hover:bg-neutral-800 rounded transition-colors"><ChevronRight size={12} /></button>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider flex-shrink-0 ${getTickerColor(currentTickerItem?.source)}`}>
                {currentTickerItem?.sourceLabel}
              </span>
              <a 
                href={currentTickerItem?.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-neutral-300 hover:text-white truncate transition-colors flex-1 block group flex items-center gap-1.5"
                title="View source"
              >
                {currentTickerItem?.title}
                <ExternalLink size={10} className="opacity-0 group-hover:opacity-50 transition-opacity flex-shrink-0" />
              </a>
            </div>
          </div>
        )}

        {activeCampLifeItem && (
          <a
            href={activeCampLifeItem.sourceUrl || '#'}
            target={activeCampLifeItem.sourceUrl ? '_blank' : undefined}
            rel={activeCampLifeItem.sourceUrl ? 'noopener noreferrer' : undefined}
            className="flex-1 flex items-center gap-2 px-4 py-2 min-w-0 border-t border-neutral-800 bg-black/20 hover:bg-white/5 transition-colors group"
          >
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 flex-shrink-0">
              {activeCampLifeItem.label}
            </span>
            <span className="text-xs font-semibold text-neutral-300 group-hover:text-white truncate transition-colors block flex-1">
              {activeCampLifeItem.text}
            </span>
            <span className="text-[10px] text-neutral-500 flex-shrink-0 hidden sm:inline group-hover:text-neutral-400 transition-colors">
              · {activeCampLifeItem.sourceName}
            </span>
          </a>
        )}
      </div>

    </div>
  );
}
