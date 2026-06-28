import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 600; // Cache for 10 minutes (600 seconds)

const NWS_URL = 'https://api.weather.gov';
const STATION_ID = 'QSLA3'; // Scout Camp RAWS near Mount Lemmon
const ALERT_ZONE = 'AZZ504'; // Catalina Mountains Zone

export async function GET() {
  try {
    // 1. Fetch Latest Observation from QSLA3 (or fallback to OpenMeteo)
    let temp = '--';
    let wind = '--';
    let humidity = '--';
    let stationName = 'QSLA3 (Scout Camp RAWS)';

    try {
      const obsRes = await fetch(`${NWS_URL}/stations/${STATION_ID}/observations/latest`, {
        headers: {
          'User-Agent': 'CampLawtonStaffPortal/1.0 (contact: admin@camplawton.org)'
        },
        next: { revalidate: 600 }
      });

      if (obsRes.ok) {
        const obsData = await obsRes.json();
        const p = obsData.properties;
        if (p.temperature?.value !== null) {
          temp = Math.round((p.temperature.value * 9/5) + 32).toString();
        }
        if (p.windSpeed?.value !== null) {
          wind = Math.round(p.windSpeed.value * 0.621371).toString();
        }
        if (p.relativeHumidity?.value !== null) {
          humidity = Math.round(p.relativeHumidity.value).toString();
        }
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
        console.error('OpenMeteo fallback also failed:', omError);
      }
    }

    let activeAlerts: any[] = [];
    let isCritical = false;

    // 2. Fetch Active Alerts for the Zone
    try {
      const alertsRes = await fetch(`${NWS_URL}/alerts/active?zone=${ALERT_ZONE}`, {
        headers: {
          'User-Agent': 'CampLawtonStaffPortal/1.0 (contact: admin@camplawton.org)'
        },
        next: { revalidate: 300 } // Alerts every 5 min
      });
      
      if (alertsRes.ok) {
        const alertsData = await alertsRes.json();
        activeAlerts = alertsData.features.map((f: any) => ({
          event: f.properties.event,
          severity: f.properties.severity,
          urgency: f.properties.urgency,
          description: f.properties.description
        }));
      }
      
      // Determine critical level
      isCritical = activeAlerts.some((a: any) => 
        a.severity === 'Severe' || 
        a.severity === 'Extreme' || 
        (a.event && (
          a.event.toLowerCase().includes('red flag') ||
          a.event.toLowerCase().includes('fire') ||
          a.event.toLowerCase().includes('flood') ||
          a.event.toLowerCase().includes('tornado')
        ))
      );
    } catch (alertError) {
      console.warn('NWS Alerts fetch failed:', alertError);
      // Fail gracefully and just return no active alerts
    }

    return NextResponse.json({
      station: stationName,
      temp,
      tempUnit: 'F',
      wind: `${wind} mph`,
      humidity: `${humidity}%`,
      alerts: activeAlerts,
      isCritical,
      updatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('NWS Weather API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
