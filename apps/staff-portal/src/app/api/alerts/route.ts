import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export const runtime = 'edge';
export const revalidate = 300; // Cache for 5 minutes

const NWS_URL = 'https://api.weather.gov';
const STATION_ID = 'QSLA3';
const ALERT_ZONE = 'AZZ504';
const USFS_RSS_URL = 'https://www.fs.usda.gov/alerts/coronado/alerts-notices?format=xml';

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  try {
    // 1. Fetch NWS Weather Observation
    let temp = '--';
    let wind = '--';
    let humidity = '--';
    let stationName = 'QSLA3 (Scout Camp RAWS)';

    try {
      const obsRes = await fetch(`${NWS_URL}/stations/${STATION_ID}/observations/latest`, {
        headers: { 'User-Agent': 'CampLawtonStaffPortal/1.0' },
        next: { revalidate: 600 }
      });
      if (obsRes.ok) {
        const obsData = await obsRes.json();
        const p = obsData.properties;
        if (p.temperature?.value !== null) temp = Math.round((p.temperature.value * 9/5) + 32).toString();
        if (p.windSpeed?.value !== null) wind = Math.round(p.windSpeed.value * 0.621371).toString();
        if (p.relativeHumidity?.value !== null) humidity = Math.round(p.relativeHumidity.value).toString();
      } else {
        throw new Error('NWS returned non-200');
      }
    } catch (nwsError) {
      console.warn('NWS API failed, falling back to OpenMeteo:', nwsError);
      try {
        const openMeteoUrl = 'https://api.open-meteo.com/v1/forecast?latitude=32.39806&longitude=-110.725&current=temperature_2m,relative_humidity_2m,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph';
        const omRes = await fetch(openMeteoUrl, { next: { revalidate: 600 } });
        if (omRes.ok) {
          const omData = await omRes.json();
          const cur = omData.current;
          temp = Math.round(cur.temperature_2m).toString();
          wind = Math.round(cur.wind_speed_10m).toString();
          humidity = Math.round(cur.relative_humidity_2m).toString();
          stationName = 'OpenMeteo (Backup)';
        }
      } catch (omError) {
        console.error('OpenMeteo fallback failed:', omError);
      }
    }

    // 2. Fetch Active NWS Alerts
    const activeAlerts: Record<string, string>[] = [];
    try {
      const alertsRes = await fetch(`${NWS_URL}/alerts/active?zone=${ALERT_ZONE}`, {
        headers: { 'User-Agent': 'CampLawtonStaffPortal/1.0' },
        next: { revalidate: 300 }
      });
      if (alertsRes.ok) {
        const alertsData = await alertsRes.json();
        alertsData.features.forEach((f: { properties: Record<string, string> }) => {
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
    } catch (alertError) {
      console.warn('NWS Alerts fetch failed:', alertError);
    }

    // 3. Fetch Forest Service RSS
    try {
      const usfsRes = await fetch(USFS_RSS_URL, { next: { revalidate: 3600 } });
      if (usfsRes.ok) {
        const xmlText = await usfsRes.text();
        // Naive XML parsing since edge runtime lacks DOMParser
        const itemRegex = /<item>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?<\/item>/gi;
        let match;
        while ((match = itemRegex.exec(xmlText)) !== null) {
          const title = match[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim();
          const link = match[2].trim();
          // Filter to only include closures/restrictions related to Santa Catalina / Mt Lemmon if possible, or include all recent
          // For now, we'll just include if title contains "Closure" or "Restriction" or "Fire"
          if (/closure|restriction|fire|danger/i.test(title)) {
            activeAlerts.push({
              id: `usfs-${Math.random().toString(36).substr(2, 9)}`,
              source: 'USFS',
              title: `USFS: ${title}`,
              description: '',
              severity: 'Warning',
              link
            });
          }
        }
      }
    } catch (usfsError) {
      console.warn('USFS RSS fetch failed:', usfsError);
    }

    // 4. Fetch Internal Camp Alerts
    try {
      // Use service role if possible? No, public read should be enabled by RLS.
      const { data: campAlerts, error } = await supabase
        .from('camp_alerts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code !== '42P01') { // Ignore relation does not exist error before migration
          console.error('Camp Alerts fetch error:', error);
        }
      } else if (campAlerts) {
        campAlerts.forEach(a => {
          activeAlerts.push({
            id: a.id,
            source: 'CAMP',
            title: a.title,
            description: a.description || '',
            severity: a.severity || 'Info',
            link: '#' // Usually no link, or could link to a detailed page
          });
        });
      }
    } catch (dbError) {
      console.warn('Camp Alerts fetch failed:', dbError);
    }

    const isCritical = activeAlerts.some(a => a.severity === 'Severe' || (a.title && a.title.toLowerCase().includes('red flag')));

    return NextResponse.json({
      weather: {
        station: stationName,
        temp,
        tempUnit: 'F',
        wind: `${wind} mph`,
        humidity: `${humidity}%`
      },
      alerts: activeAlerts,
      isCritical,
      updatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('API Alerts Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}
