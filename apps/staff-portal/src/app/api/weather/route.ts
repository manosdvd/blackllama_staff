import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 600; // Cache for 10 minutes (600 seconds)

const NWS_URL = 'https://api.weather.gov';
const STATION_ID = 'QSLA3'; // Scout Camp RAWS near Mount Lemmon
const ALERT_ZONE = 'AZZ504'; // Catalina Mountains Zone

export async function GET() {
  try {
    // 1. Fetch Latest Observation from QSLA3
    const obsRes = await fetch(`${NWS_URL}/stations/${STATION_ID}/observations/latest`, {
      headers: {
        'User-Agent': 'CampLawtonStaffPortal/1.0 (contact: admin@camplawton.org)'
      },
      next: { revalidate: 600 }
    });

    let temp = '--';
    let wind = '--';
    let humidity = '--';

    if (obsRes.ok) {
      const obsData = await obsRes.json();
      const p = obsData.properties;
      // Convert Celsius to Fahrenheit
      if (p.temperature?.value !== null) {
        temp = Math.round((p.temperature.value * 9/5) + 32).toString();
      }
      if (p.windSpeed?.value !== null) {
        // Convert km/h to mph
        wind = Math.round(p.windSpeed.value * 0.621371).toString();
      }
      if (p.relativeHumidity?.value !== null) {
        humidity = Math.round(p.relativeHumidity.value).toString();
      }
    }

    // 2. Fetch Active Alerts for the Zone
    const alertsRes = await fetch(`${NWS_URL}/alerts/active?zone=${ALERT_ZONE}`, {
      headers: {
        'User-Agent': 'CampLawtonStaffPortal/1.0 (contact: admin@camplawton.org)'
      },
      next: { revalidate: 300 } // Alerts every 5 min
    });
    
    let activeAlerts = [];
    let isCritical = false;
    
    if (alertsRes.ok) {
      const alertsData = await alertsRes.json();
      activeAlerts = alertsData.features.map((f: any) => ({
        event: f.properties.event,
        severity: f.properties.severity,
        urgency: f.properties.urgency,
        description: f.properties.description
      }));
      
      // Determine critical level
      isCritical = activeAlerts.some((a: any) => 
        a.severity === 'Severe' || 
        a.severity === 'Extreme' || 
        a.event.toLowerCase().includes('red flag') ||
        a.event.toLowerCase().includes('fire') ||
        a.event.toLowerCase().includes('flood') ||
        a.event.toLowerCase().includes('tornado')
      );
    }

    return NextResponse.json({
      station: 'QSLA3 (Scout Camp RAWS)',
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
