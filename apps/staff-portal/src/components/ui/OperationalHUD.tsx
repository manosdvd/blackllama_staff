'use client';

import React, { useState, useEffect } from 'react';
import { Cloud, Flame, Trees, RefreshCw, AlertTriangle } from 'lucide-react';
import { useOffline } from '@/hooks/useOffline';

interface WeatherData {
  temp: number;
  tempUnit: string;
  condition: string;
  wind: string;
  fireDanger: string;
  updatedAt: string;
  isCached: boolean;
  alerts: { event: string; severity: string }[];
}

const defaultWeather: WeatherData = {
  temp: 72,
  tempUnit: 'F',
  condition: 'Sunny / Mild',
  wind: '5 mph',
  fireDanger: 'MODERATE',
  updatedAt: '03:14 PM',
  isCached: true,
  alerts: []
};

const readWeatherCache = (): WeatherData => {
  if (typeof window === 'undefined') return defaultWeather;
  try {
    const saved = localStorage.getItem('camp_lawton_weather_cache');
    if (saved) {
      return { ...(JSON.parse(saved) as Omit<WeatherData, 'isCached'>), isCached: true };
    }
    return defaultWeather;
  } catch {
    return defaultWeather;
  }
};

export function OperationalHUD() {
  const isOffline = useOffline();
  const [weather, setWeather] = useState<WeatherData>(readWeatherCache);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (isOffline) return;
    setLoading(true);
    try {
      const res = await fetch('/api/weather');
      if (res.ok) {
        const data = await res.json();
        const newWeather: WeatherData = {
          temp: data.temp,
          tempUnit: data.tempUnit,
          condition: data.condition,
          wind: data.wind,
          fireDanger: data.fireDanger,
          alerts: data.alerts,
          updatedAt: new Date(data.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isCached: false
        };
        setWeather(newWeather);
        localStorage.setItem('camp_lawton_weather_cache', JSON.stringify(newWeather));
      }
    } catch (e) {
      console.error('Failed to fetch weather', e);
      setWeather(w => ({ ...w, isCached: true }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    
    // Refresh every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isOffline]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      {/* Weather Station Panel */}
      <div className="glass-panel flex items-center justify-between gap-4 p-4 border-l-4 border-sky-500 bg-white/70 dark:bg-neutral-900/60">
        <div className="flex items-center gap-3">
          <div className="bg-sky-500/10 text-sky-600 dark:text-sky-400 p-2.5 rounded-lg flex-shrink-0">
            <Cloud size={22} />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-2">
              Mt. Lemmon Station
              {loading && <RefreshCw size={10} className="animate-spin text-sky-500" />}
            </div>
            <div className="text-lg font-extrabold text-neutral-800 dark:text-neutral-200 leading-tight mt-0.5">
              {weather.temp}°{weather.tempUnit} • <span className="text-sm font-semibold truncate block sm:inline">{weather.condition}</span>
            </div>
          </div>
        </div>
        <div className="text-right text-[10px] text-neutral-400 font-semibold flex-shrink-0 ml-4 hidden sm:block">
          {(isOffline || weather.isCached) ? (
            <span className="text-red-500 font-bold">Offline Cache</span>
          ) : (
            <span>Updated {weather.updatedAt}</span>
          )}
        </div>
      </div>

      {/* Fire Danger HUD */}
      <div className="glass-panel flex items-center justify-between gap-4 p-4 border-l-4 border-amber-600 bg-white/70 dark:bg-neutral-900/60">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg flex-shrink-0 ${
            weather.fireDanger === 'EXTREME' || weather.fireDanger === 'HIGH' 
              ? 'bg-red-500/10 text-red-600 dark:text-red-500' 
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-500'
          }`}>
            <Flame size={22} />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider">USFS Fire Danger</div>
            <div className={`text-lg font-extrabold leading-tight mt-0.5 ${
              weather.fireDanger === 'EXTREME' || weather.fireDanger === 'HIGH' 
                ? 'text-red-600 dark:text-red-500' 
                : 'text-amber-600 dark:text-amber-500'
            }`}>
              {weather.fireDanger}
            </div>
          </div>
        </div>
        {(weather.fireDanger === 'EXTREME' || weather.fireDanger === 'HIGH') && (
          <div className="text-[10px] bg-red-500/10 text-red-600 dark:text-red-400 py-1 px-2.5 rounded-full font-bold uppercase tracking-wide hidden sm:block flex-shrink-0 ml-4">
            Restrictions Active
          </div>
        )}
      </div>

      {/* Forest Alerts Banner */}
      <div className="glass-panel flex items-center justify-between gap-4 p-4 border-l-4 border-emerald-600 bg-white/70 dark:bg-neutral-900/60">
        <div className="flex items-center gap-3 w-full">
          <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-2.5 rounded-lg flex-shrink-0">
            <Trees size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Coronado Forest Alerts</div>
            <div className="text-sm font-bold text-neutral-700 dark:text-neutral-300 leading-tight mt-0.5 truncate">
              {weather.alerts && weather.alerts.length > 0 
                ? <span className="text-amber-600 dark:text-amber-500 flex items-center gap-1.5"><AlertTriangle size={14} className="flex-shrink-0"/> {weather.alerts[0].event}</span>
                : 'Camp Catalina highway open • No active red flags'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default OperationalHUD;
