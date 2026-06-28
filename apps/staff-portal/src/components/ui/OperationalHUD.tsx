'use client';

import React, { useState } from 'react';
import { Cloud, Flame, Trees } from 'lucide-react';
import { useOffline } from '@/hooks/useOffline';

interface WeatherData {
  temp: number;
  condition: string;
  updatedAt: string;
  isCached: boolean;
}

const defaultWeather: WeatherData = {
  temp: 72,
  condition: 'Sunny / Mild',
  updatedAt: '03:14 PM',
  isCached: false
};

const readWeatherCache = () => {
  if (typeof window === 'undefined') return defaultWeather;
  try {
    const saved = localStorage.getItem('camp_lawton_weather_cache');
    if (saved) {
      return { ...(JSON.parse(saved) as Omit<WeatherData, 'isCached'>), isCached: true };
    }

    const freshDefault = {
      temp: defaultWeather.temp,
      condition: defaultWeather.condition,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    localStorage.setItem('camp_lawton_weather_cache', JSON.stringify(freshDefault));
    return { ...freshDefault, isCached: false };
  } catch {
    return defaultWeather;
  }
};

export function OperationalHUD() {
  const isOffline = useOffline();
  const [weather] = useState<WeatherData>(readWeatherCache);

  // In production this would be fetched from NWS API — static const for now
  const fireDanger: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME' = 'HIGH';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      {/* Weather Station Panel */}
      <div className="glass-panel flex items-center justify-between gap-4 p-4 border-l-4 border-sky-500 bg-white/70 dark:bg-neutral-900/60">
        <div className="flex items-center gap-3">
          <div className="bg-sky-500/10 text-sky-600 dark:text-sky-400 p-2.5 rounded-lg">
            <Cloud size={22} />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Tucson Mt. Lemmon Weather</div>
            <div className="text-lg font-extrabold text-neutral-800 dark:text-neutral-200">
              {weather.temp}°F • <span className="text-sm font-semibold">{weather.condition}</span>
            </div>
          </div>
        </div>
        <div className="text-right text-[10px] text-neutral-400 font-semibold">
          {isOffline ? (
            <span className="text-red-500 font-bold">Offline Cache</span>
          ) : (
            <span>Updated {weather.updatedAt}</span>
          )}
        </div>
      </div>

      {/* Fire Danger HUD */}
      <div className="glass-panel flex items-center justify-between gap-4 p-4 border-l-4 border-amber-600 bg-white/70 dark:bg-neutral-900/60">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/10 text-amber-600 dark:text-amber-500 p-2.5 rounded-lg">
            <Flame size={22} />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider">USFS Fire Danger rating</div>
            <div className="text-lg font-extrabold text-amber-600 dark:text-amber-500">
              {fireDanger} INDEX
            </div>
          </div>
        </div>
        <div className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 py-1 px-2.5 rounded-full font-bold uppercase tracking-wide">
          Restrictions Active
        </div>
      </div>

      {/* Forest Alerts Banner */}
      <div className="glass-panel flex items-center justify-between gap-4 p-4 border-l-4 border-emerald-600 bg-white/70 dark:bg-neutral-900/60">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-2.5 rounded-lg">
            <Trees size={22} />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Coronado National Forest Alerts</div>
            <div className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
              Camp Catalina highway open • No active red flags
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default OperationalHUD;
