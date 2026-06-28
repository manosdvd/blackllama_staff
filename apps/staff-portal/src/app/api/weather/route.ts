import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 600; // Cache for 10 minutes (600 seconds)

const NWS_URL = 'https://api.weather.gov';
const CAMP_LAWTON_COORDS = '32.4116,-110.7516'; // Approx Mt. Lemmon / Camp Lawton area

export async function GET() {
  try {
    // 1. Get grid endpoint from coordinates
    const pointsRes = await fetch(`${NWS_URL}/points/${CAMP_LAWTON_COORDS}`, {
      headers: {
        'User-Agent': 'CampLawtonStaffPortal/1.0 (contact: admin@camplawton.org)'
      },
      next: { revalidate: 86400 } // Grid points rarely change
    });
    
    if (!pointsRes.ok) {
      throw new Error(`Failed to fetch NWS points: ${pointsRes.status}`);
    }

    const pointsData = await pointsRes.json();
    const forecastUrl = pointsData.properties.forecast;
    
    // 2. Fetch the actual forecast
    const forecastRes = await fetch(forecastUrl, {
      headers: {
        'User-Agent': 'CampLawtonStaffPortal/1.0 (contact: admin@camplawton.org)'
      },
      next: { revalidate: 600 } // Fetch every 10 min
    });

    if (!forecastRes.ok) {
      throw new Error(`Failed to fetch NWS forecast: ${forecastRes.status}`);
    }

    const forecastData = await forecastRes.json();
    
    // Extract current period (usually the first one in the array)
    const currentPeriod = forecastData.properties.periods[0];
    
    // 3. Fetch active alerts for the zone
    const zoneId = pointsData.properties.county.split('/').pop();
    const alertsRes = await fetch(`${NWS_URL}/alerts/active?zone=${zoneId}`, {
      headers: {
        'User-Agent': 'CampLawtonStaffPortal/1.0 (contact: admin@camplawton.org)'
      },
      next: { revalidate: 300 } // Alerts every 5 min
    });
    
    let activeAlerts = [];
    let fireDanger = 'MODERATE'; // Fallback
    
    if (alertsRes.ok) {
      const alertsData = await alertsRes.json();
      activeAlerts = alertsData.features.map((f: any) => ({
        event: f.properties.event,
        headline: f.properties.headline,
        severity: f.properties.severity
      }));
      
      // Determine fire danger based on red flag warnings
      const hasRedFlag = activeAlerts.some((a: any) => 
        a.event.toLowerCase().includes('red flag') || 
        a.event.toLowerCase().includes('fire')
      );
      if (hasRedFlag) {
        fireDanger = 'EXTREME';
      }
    }

    return NextResponse.json({
      temp: currentPeriod.temperature,
      tempUnit: currentPeriod.temperatureUnit,
      condition: currentPeriod.shortForecast,
      wind: currentPeriod.windSpeed,
      icon: currentPeriod.icon,
      isDaytime: currentPeriod.isDaytime,
      fireDanger,
      alerts: activeAlerts,
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
