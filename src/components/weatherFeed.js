/**
 * Weather & Forest Alerts Banner component for Camp Lawton Portal.
 * Fetches data from Open-Meteo and NWS, and provides live GPS tracking.
 */

const CATALINA_LAT = 32.39806;
const CATALINA_LON = -110.725;
const CATALINA_ELEV = 7554; // feet

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
      <!-- NWS QSLA3 Scout Camp Weather Section -->
      <a href="https://forecast.weather.gov/MapClick.php?lat=32.3981&lon=-110.725" target="_blank" rel="noopener" class="weather-section banner-link" id="weather-banner-weather-link" style="text-decoration: none; color: inherit;">
        <span class="weather-icon" id="weather-banner-icon">☀️</span>
        <div class="weather-temp-info">
          <div style="display: flex; align-items: baseline; gap: 8px;">
            <span class="weather-temp" id="weather-banner-temp">--°F</span>
            <span class="weather-desc" id="weather-banner-desc">Loading weather...</span>
          </div>
          <span class="weather-station-label" style="font-size: 11px; font-weight: 600; color: hsl(var(--primary)); letter-spacing: 0.3px; margin-top: 1px;">⛰️ Scout Camp (QSLA3)</span>
        </div>
      </a>
      
      <!-- Coronado National Forest (USFS) Alert Panel -->
      <a href="https://www.fs.usda.gov/alerts/coronado/alerts-notices" target="_blank" rel="noopener" class="agency-alert-box usfs-box banner-link" id="weather-banner-usfs-section" style="text-decoration: none; color: inherit;">
        <span class="agency-icon">🌲</span>
        <div class="agency-alert-content">
          <div class="agency-title">Coronado National Forest</div>
          <div class="agency-status" id="weather-banner-alerts-forest">Checking active alerts...</div>
        </div>
      </a>

      <!-- Mt. Lemmon Fire District (MLFD) Alert Panel -->
      <a href="https://www.mtlemmonfire.org/" target="_blank" rel="noopener" class="agency-alert-box mlfd-box banner-link" id="weather-banner-mlfd-section" style="text-decoration: none; color: inherit;">
        <span class="agency-icon">🚒</span>
        <div class="agency-alert-content">
          <div class="agency-title">Mt. Lemmon Fire District</div>
          <div class="agency-status" id="weather-banner-alerts-fire">Checking fire danger...</div>
        </div>
      </a>
      
      <!-- GPS Location Geotagger Section -->
      <div class="gps-section">
        <span class="gps-icon">📍</span>
        <div class="gps-info">
          <span class="gps-coords" id="weather-banner-gps">32.3981° N, 110.7250° W</span>
          <span class="gps-elev" id="weather-banner-elev">Elev: 7,554 ft (QSLA3 Scout Camp)</span>
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
  const usfsStatusEl = document.getElementById('weather-banner-alerts-forest');
  const mlfdStatusEl = document.getElementById('weather-banner-alerts-fire');
  const usfsSection = document.getElementById('weather-banner-usfs-section');
  const mlfdSection = document.getElementById('weather-banner-mlfd-section');
  const gpsEl = document.getElementById('weather-banner-gps');
  const elevEl = document.getElementById('weather-banner-elev');
  const syncBtn = document.getElementById('weather-banner-gps-sync');

  let tempF = null;
  let rh = null;
  let windMph = null;
  let windGustMph = null;

  // 1. Fetch live observations from NWS Scout Camp (QSLA3) station
  try {
    const nwsRes = await fetch('https://api.weather.gov/stations/QSLA3/observations/latest', {
      headers: { 'User-Agent': 'CampLawtonStaffPortal/1.0 (manosdvd@gmail.com)' }
    });
    if (nwsRes.ok) {
      const nwsData = await nwsRes.json();
      const props = nwsData.properties || {};
      
      if (props.temperature && props.temperature.value !== null) {
        tempF = Math.round((props.temperature.value * 9/5) + 32);
      }
      
      if (props.relativeHumidity && props.relativeHumidity.value !== null) {
        rh = Math.round(props.relativeHumidity.value);
      }
      
      if (props.windSpeed && props.windSpeed.value !== null) {
        windMph = Math.round(props.windSpeed.value * 0.621371);
      }

      if (props.windGust && props.windGust.value !== null) {
        windGustMph = Math.round(props.windGust.value * 0.621371);
      }
    }
  } catch (err) {
    console.error('Failed to fetch NWS QSLA3 observations:', err);
  }

  // 2. Fetch condition metadata from Open-Meteo as visual/status fallback
  let openMeteoTemp = null;
  let weatherInfo = { label: 'Clear Sky', emoji: '☀️' };

  try {
    const omRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${CATALINA_LAT}&longitude=${CATALINA_LON}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`);
    if (omRes.ok) {
      const omData = await omRes.json();
      if (omData.current) {
        openMeteoTemp = Math.round(omData.current.temperature_2m);
        const code = omData.current.weather_code;
        if (WEATHER_CODES[code]) {
          weatherInfo = WEATHER_CODES[code];
        }
      }
    }
  } catch (err) {
    console.error('Failed to fetch Open-Meteo forecast:', err);
  }

  // Set weather visual displays
  const displayTemp = tempF !== null ? tempF : openMeteoTemp;
  if (tempEl) {
    tempEl.textContent = displayTemp !== null ? `${displayTemp}°F` : '--°F';
  }
  
  if (descEl) {
    if (windMph !== null || rh !== null) {
      let descText = `${weatherInfo.label} • Wind: ${windMph !== null ? windMph + ' mph' : '--'}`;
      if (windGustMph) {
        descText += ` (G: ${windGustMph} mph)`;
      }
      descText += ` • RH: ${rh !== null ? rh + '%' : '--'}`;
      descEl.textContent = descText;
    } else {
      descEl.textContent = weatherInfo.label;
    }
  }
  
  if (iconEl) {
    iconEl.textContent = weatherInfo.emoji;
  }

  // 3. Fetch active NWS warnings for Scout Camp coordinates
  try {
    const alertsRes = await fetch(`https://api.weather.gov/alerts/active?point=${CATALINA_LAT},${CATALINA_LON}`, {
      headers: { 'User-Agent': 'CampLawtonStaffPortal/1.0 (manosdvd@gmail.com)' }
    });
    
    if (alertsRes.ok) {
      const alertsData = await alertsRes.json();
      const features = alertsData.features || [];
      
      const fireAlerts = [];
      const generalAlerts = [];
      
      features.forEach(feat => {
        const props = feat.properties || {};
        const event = (props.event || '').toLowerCase();
        const headline = props.headline || props.event || '';
        const severity = props.severity || 'Minor';
        const description = props.description || '';
        const id = props.id || '';
        
        const alertObj = { event: props.event, headline, severity, description, id };
        
        if (event.includes('fire') || event.includes('red flag') || event.includes('smoke') || event.includes('burn')) {
          fireAlerts.push(alertObj);
        } else {
          generalAlerts.push(alertObj);
        }
      });
      
      // Update USFS box
      if (generalAlerts.length > 0) {
        const primary = generalAlerts[0];
        const isSevere = primary.severity.toLowerCase() === 'extreme' || primary.severity.toLowerCase() === 'severe';
        
        if (usfsSection) {
          usfsSection.className = `agency-alert-box usfs-box alert-active ${isSevere ? 'alert-danger' : 'alert-warning'} banner-link`;
          usfsSection.href = 'https://forecast.weather.gov/MapClick.php?lat=32.3981&lon=-110.725';
        }
        if (usfsStatusEl) {
          usfsStatusEl.innerHTML = `<span style="font-weight: 700; color: ${isSevere ? 'var(--safety-red)' : 'var(--camp-gold)'}">${primary.event}:</span> ${primary.headline}`;
        }
      } else {
        if (usfsSection) {
          usfsSection.className = 'agency-alert-box usfs-box banner-link';
          usfsSection.href = 'https://www.fs.usda.gov/alerts/coronado/alerts-notices';
        }
        if (usfsStatusEl) {
          usfsStatusEl.innerHTML = '<span style="color: hsl(var(--success)); font-weight: 600;">🟢 No Active Alerts</span>';
        }
      }
      
      // Update MLFD box
      if (fireAlerts.length > 0) {
        const primary = fireAlerts[0];
        if (mlfdSection) {
          mlfdSection.className = 'agency-alert-box mlfd-box alert-active alert-danger banner-link';
          mlfdSection.href = 'https://forecast.weather.gov/MapClick.php?lat=32.3981&lon=-110.725';
        }
        if (mlfdStatusEl) {
          mlfdStatusEl.innerHTML = `
            <span style="font-weight: 700; color: var(--safety-red); animation: pulse 1.5s infinite; display: inline-block;">🚨 ${primary.event.toUpperCase()}:</span> 
            <span>${primary.headline}</span>
          `;
        }
      } else {
        // Dynamic Fire Danger calculation
        let fireRiskLabel = 'Moderate';
        let riskClass = 'normal';
        let riskEmoji = '🟢';
        let riskColor = 'hsl(var(--success))';

        if (rh !== null && windMph !== null) {
          if (rh <= 15 && windMph >= 15) {
            fireRiskLabel = 'CRITICAL (Low RH / Windy)';
            riskClass = 'danger';
            riskEmoji = '🚨';
            riskColor = 'var(--safety-red)';
          } else if (rh <= 20 || windMph >= 20) {
            fireRiskLabel = 'ELEVATED (High Fire Risk)';
            riskClass = 'warning';
            riskEmoji = '⚠️';
            riskColor = 'var(--camp-gold)';
          }
        }
        
        if (mlfdSection) {
          if (riskClass === 'danger') {
            mlfdSection.className = 'agency-alert-box mlfd-box alert-active alert-danger banner-link';
            mlfdSection.href = 'https://forecast.weather.gov/MapClick.php?lat=32.3981&lon=-110.725';
          } else if (riskClass === 'warning') {
            mlfdSection.className = 'agency-alert-box mlfd-box alert-active alert-warning banner-link';
            mlfdSection.href = 'https://forecast.weather.gov/MapClick.php?lat=32.3981&lon=-110.725';
          } else {
            mlfdSection.className = 'agency-alert-box mlfd-box banner-link';
            mlfdSection.href = 'https://www.mtlemmonfire.org/';
          }
        }
        
        if (mlfdStatusEl) {
          mlfdStatusEl.innerHTML = `<span style="color: ${riskColor}; font-weight: 600;">${riskEmoji} Fire Danger: ${fireRiskLabel}</span>`;
        }
      }
    } else {
      throw new Error();
    }
  } catch (err) {
    console.error('Failed to fetch coordinate NWS alerts, trying zone backup:', err);
    // Zone AZZ511 fallback
    try {
      const backupRes = await fetch('https://api.weather.gov/alerts/active?zone=AZZ511', {
        headers: { 'User-Agent': 'CampLawtonStaffPortal/1.0 (manosdvd@gmail.com)' }
      });
      if (backupRes.ok) {
        const backupData = await backupRes.json();
        const features = backupData.features || [];
        const fireAlerts = [];
        const generalAlerts = [];
        
        features.forEach(feat => {
          const props = feat.properties || {};
          const event = (props.event || '').toLowerCase();
          const headline = props.headline || props.event || '';
          const severity = props.severity || 'Minor';
          const alertObj = { event: props.event, headline, severity };
          
          if (event.includes('fire') || event.includes('red flag') || event.includes('smoke') || event.includes('burn')) {
            fireAlerts.push(alertObj);
          } else {
            generalAlerts.push(alertObj);
          }
        });

        if (generalAlerts.length > 0) {
          const primary = generalAlerts[0];
          const isSevere = primary.severity.toLowerCase() === 'extreme' || primary.severity.toLowerCase() === 'severe';
          if (usfsSection) {
            usfsSection.className = `agency-alert-box usfs-box alert-active ${isSevere ? 'alert-danger' : 'alert-warning'} banner-link`;
            usfsSection.href = 'https://forecast.weather.gov/MapClick.php?lat=32.3981&lon=-110.725';
          }
          if (usfsStatusEl) {
            usfsStatusEl.innerHTML = `<span style="font-weight: 700; color: ${isSevere ? 'var(--safety-red)' : 'var(--camp-gold)'};">${primary.event}:</span> ${primary.headline}`;
          }
        } else {
          if (usfsSection) {
            usfsSection.className = 'agency-alert-box usfs-box banner-link';
            usfsSection.href = 'https://www.fs.usda.gov/alerts/coronado/alerts-notices';
          }
          if (usfsStatusEl) {
            usfsStatusEl.innerHTML = '<span style="color: hsl(var(--success)); font-weight: 600;">🟢 No Active Alerts</span>';
          }
        }

        if (fireAlerts.length > 0) {
          const primary = fireAlerts[0];
          if (mlfdSection) {
            mlfdSection.className = 'agency-alert-box mlfd-box alert-active alert-danger banner-link';
            mlfdSection.href = 'https://forecast.weather.gov/MapClick.php?lat=32.3981&lon=-110.725';
          }
          if (mlfdStatusEl) {
            mlfdStatusEl.innerHTML = `<span style="font-weight: 700; color: var(--safety-red); animation: pulse 1.5s infinite; display: inline-block;">🚨 ${primary.event.toUpperCase()}:</span> ${primary.headline}`;
          }
        } else {
          if (mlfdSection) {
            mlfdSection.className = 'agency-alert-box mlfd-box banner-link';
            mlfdSection.href = 'https://www.mtlemmonfire.org/';
          }
          if (mlfdStatusEl) {
            mlfdStatusEl.innerHTML = '<span style="color: hsl(var(--success)); font-weight: 600;">🟢 Fire Danger: Moderate</span>';
          }
        }
      } else {
        throw new Error();
      }
    } catch {
      if (usfsSection) usfsSection.href = 'https://www.fs.usda.gov/alerts/coronado/alerts-notices';
      if (mlfdSection) mlfdSection.href = 'https://www.mtlemmonfire.org/';
      if (usfsStatusEl) usfsStatusEl.innerHTML = '<span style="opacity: 0.8;">Feeds active. Protect wilderness.</span>';
      if (mlfdStatusEl) mlfdStatusEl.innerHTML = '<span style="opacity: 0.8;">Fire danger active. Check restrictions.</span>';
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
