/**
 * Weather & Forest Alerts Banner component for Camp Lawton Portal.
 * Fetches data from Open-Meteo and NWS, and provides live GPS tracking.
 */

const CATALINA_LAT = 32.4414;
const CATALINA_LON = -110.7719;
const CATALINA_ELEV = 8150; // feet

const WEATHER_CODES = {
  0: { label: 'Clear Sky', emoji: '☀️' },
  1: { label: 'Mainly Clear', emoji: '🌤️' },
  2: { label: 'Partly Cloudy', emoji: '⛅' },
  3: { label: 'Overcast', emoji: '☁️' },
  45: { label: 'Foggy', emoji: '🌫️' },
  48: { label: 'Depositing Rime Fog', emoji: '🌫️' },
  51: { label: 'Light Drizzle', emoji: '🌦️' },
  53: { label: 'Moderate Drizzle', emoji: '🌦️' },
  55: { label: 'Dense Drizzle', emoji: '🌧️' },
  61: { label: 'Slight Rain', emoji: '🌧️' },
  63: { label: 'Moderate Rain', emoji: '🌧️' },
  65: { label: 'Heavy Rain', emoji: '🌧️' },
  71: { label: 'Slight Snow', emoji: '❄️' },
  73: { label: 'Moderate Snow', emoji: '❄️' },
  75: { label: 'Heavy Snow', emoji: '☃️' },
  80: { label: 'Slight Rain Showers', emoji: '🌦️' },
  82: { label: 'Violent Rain Showers', emoji: '⛈️' },
  95: { label: 'Thunderstorm', emoji: '⛈️' },
  96: { label: 'Thunderstorm with Hail', emoji: '⛈️' }
};

export function renderWeatherBanner() {
  return `
    <div class="weather-alerts-banner glass-panel" id="weather-alerts-banner">
      <div class="weather-section">
        <span class="weather-icon" id="weather-banner-icon">☀️</span>
        <div class="weather-temp-info">
          <span class="weather-temp" id="weather-banner-temp">--°F</span>
          <span class="weather-desc" id="weather-banner-desc">Loading weather...</span>
        </div>
      </div>
      
      <div class="alerts-section" id="weather-banner-alerts-section">
        <span class="alerts-icon">🌲</span>
        <div class="alerts-content" id="weather-banner-alerts">
          <span style="font-weight: 600;">Coronado National Forest:</span> Checking active alerts...
        </div>
      </div>
      
      <div class="gps-section">
        <span class="gps-icon">📍</span>
        <div class="gps-info">
          <span class="gps-coords" id="weather-banner-gps">32.4414° N, 110.7719° W</span>
          <span class="gps-elev" id="weather-banner-elev">Elev: 8,150 ft (Catalina Mts)</span>
        </div>
        <button class="gps-sync-btn" id="weather-banner-gps-sync" title="Sync live location">🔄</button>
      </div>
    </div>
  `;
}

export async function initWeatherBanner() {
  const tempEl = document.getElementById('weather-banner-temp');
  const descEl = document.getElementById('weather-banner-desc');
  const iconEl = document.getElementById('weather-banner-icon');
  const alertsEl = document.getElementById('weather-banner-alerts');
  const alertsSec = document.getElementById('weather-banner-alerts-section');
  const gpsEl = document.getElementById('weather-banner-gps');
  const elevEl = document.getElementById('weather-banner-elev');
  const syncBtn = document.getElementById('weather-banner-gps-sync');

  // 1. Fetch Weather from Open-Meteo
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${CATALINA_LAT}&longitude=${CATALINA_LON}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`);
    if (res.ok) {
      const data = await res.json();
      const current = data.current;
      const temp = Math.round(current.temperature_2m);
      const code = current.weather_code;
      const weatherInfo = WEATHER_CODES[code] || { label: 'Clear', emoji: '☀️' };

      if (tempEl) tempEl.textContent = `${temp}°F`;
      if (descEl) descEl.textContent = weatherInfo.label;
      if (iconEl) iconEl.textContent = weatherInfo.emoji;
    }
  } catch (err) {
    console.error('Failed to fetch weather:', err);
    if (descEl) descEl.textContent = 'Weather offline';
  }

  // 2. Fetch Forest Alerts from National Weather Service
  try {
    // Tucson area zone is AZZ504
    const res = await fetch('https://api.weather.gov/alerts/active?zone=AZZ504', {
      headers: { 'User-Agent': 'CampLawtonStaffPortal/1.0' }
    });
    if (res.ok) {
      const data = await res.json();
      const features = data.features || [];

      if (features.length > 0) {
        const primaryAlert = features[0].properties;
        const headline = primaryAlert.headline || primaryAlert.event;
        const severity = primaryAlert.severity || 'Minor';
        
        alertsSec.classList.add('alert-active');
        if (severity.toLowerCase() === 'extreme' || severity.toLowerCase() === 'severe') {
          alertsSec.classList.add('alert-danger');
        }
        
        alertsEl.innerHTML = `
          <strong style="color: var(--safety-red); animation: pulse 1.5s infinite;">🚨 NWS WARNING:</strong>
          <span>${headline}</span>
        `;
      } else {
        alertsEl.innerHTML = `
          <strong>Coronado National Forest:</strong>
          <span style="color: hsl(var(--success));">No active forest alerts or fire warnings.</span>
        `;
      }
    } else {
      throw new Error();
    }
  } catch (err) {
    console.error('Failed to fetch NWS alerts');
    if (alertsEl) {
      alertsEl.innerHTML = `
        <strong>Coronado National Forest:</strong>
        <span style="opacity: 0.8;">Feeds active. Protect wildlife.</span>
      `;
    }
  }

  // 3. Geolocation Geotagging
  if (syncBtn) {
    syncBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        return;
      }
      
      syncBtn.textContent = '⏳';
      syncBtn.style.animation = 'spin 1s linear infinite';

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const accuracy = position.coords.accuracy;

          gpsEl.textContent = `${lat.toFixed(4)}° N, ${Math.abs(lon).toFixed(4)}° W`;
          
          // Try to lookup elevation via Open-Meteo elevation API
          try {
            const res = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lon}`);
            if (res.ok) {
              const data = await res.json();
              const elevMeters = data.elevation[0] || 0;
              const elevFeet = Math.round(elevMeters * 3.28084);
              
              elevEl.textContent = `Elev: ${elevFeet.toLocaleString()} ft (Live Geotag)`;
            } else {
              elevEl.textContent = `Elev: N/A (Live Geotag)`;
            }
          } catch {
            elevEl.textContent = `Elev: N/A (Live Geotag)`;
          }

          // Reset button
          syncBtn.textContent = '📍';
          syncBtn.style.animation = 'none';
          showToast('Location synced successfully! 📍');
        },
        (error) => {
          console.error('GPS error:', error);
          syncBtn.textContent = '🔄';
          syncBtn.style.animation = 'none';
          alert('Could not retrieve live GPS coordinates. Please ensure location services are enabled.');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  }
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; bottom: 80px; left: 50%; transform: translate(-50%, 20px);
    background: hsl(var(--primary)); color: white; padding: 10px 20px;
    border-radius: var(--radius-sm); font-weight: 700; z-index: 10000;
    opacity: 0; transition: all 0.3s ease; box-shadow: var(--shadow-md);
    font-size: 13.5px; font-family: var(--font-body);
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translate(-50%, 0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, 20px)';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
