import { createClient } from '@supabase/supabase-js';

// Types
export type OpsSource = 'camp' | 'nws' | 'wfigs' | 'usfs' | 'azgfd' | 'az511' | 'gdelt' | 'local-news';
export type OpsCategory = 'fire' | 'weather' | 'closure' | 'road' | 'wildlife' | 'medical' | 'program' | 'camp-lawton' | 'general';
export type SourceConfidence = 'official' | 'camp-admin' | 'media' | 'reference' | 'link-only';
export type OpsSeverity = 'critical' | 'admin-evacuation-review' | 'critical-safety' | 'persistent-warning' | 'persistent-watch' | 'persistent-news-check' | 'ticker' | 'reference';

export type OpsFeedItem = {
  id: string;
  source: OpsSource;
  sourceLabel: string;
  sourceConfidence: SourceConfidence;
  title: string;
  shortLabel: string;
  summary?: string;
  category: OpsCategory;
  severity: OpsSeverity;
  persistent: boolean;
  ticker: boolean;
  sourceUrl: string;
  updatedAt?: string;
  expiresAt?: string;
  regionMatch: boolean;
  distanceMilesFromCamp?: number;
  raw?: unknown;
};

export type OpsHudResponse = {
  generatedAt: string;
  stale: boolean;
  priorityItems: OpsFeedItem[];
  tickerItems: OpsFeedItem[];
};

// Config
export const OPS_REGION = {
  name: 'Santa Catalina Mountains',
  campPoint: { label: 'Camp Lawton / Mt. Bigelow area', lat: 32.39806, lon: -110.725 },
  bbox: { west: -110.98, south: 32.20, east: -110.55, north: 32.62 },
  fireDistanceMiles: { action: 5, adminReview: 15, watch: 30 },
  santaCatalinaTerms: ['santa catalina', 'santa catalinas', 'mt lemmon', 'mount lemmon', 'summerhaven', 'catalina highway', 'ski run', 'rose canyon', 'bear wallow', 'organization ridge', 'palisades', 'sabino canyon', 'bear canyon', 'general hitchcock', 'bigelow', 'camp lawton', 'catalina council'],
};

export const CAMP_LAWTON_POSITIVE_TERMS = ['camp lawton', 'catalina council', 'scouting america', 'boy scouts', 'bsa', 'mt lemmon', 'mount lemmon', 'santa catalina', 'tucson', 'summerhaven', 'arizona'];
export const CAMP_LAWTON_EXCLUDE_TERMS = ['georgia', 'millen', 'jenkins county', 'burke county', 'magnolia springs', 'magnolia springs state park', 'confederate', 'union', 'pow', 'prisoner of war', 'prisoners of war', 'stockade', 'andersonville', 'camp sumter', 'sherman', 'civil war', 'archaeology', 'archaeological', 'artifact', 'artifacts'];

const WFIGS_INCIDENT_POINTS = {
  id: 'wfigs-incident-locations-current',
  endpoint: 'https://services3.arcgis.com/T4QMspbfLg3qTGWY/ArcGIS/rest/services/WFIGS_Incident_Locations_Current/FeatureServer/0/query',
  params: {
    f: 'geojson',
    where: "IncidentTypeCategory IN ('WF','CX') AND FireOutDateTime IS NULL",
    outFields: 'OBJECTID,IncidentName,IncidentShortDescription,IncidentTypeCategory,IncidentSize,PercentContained,FireDiscoveryDateTime,FireOutDateTime,InitialLatitude,InitialLongitude,POOCounty,POOState,ModifiedOnDateTime_dt,UniqueFireIdentifier',
    geometry: '-110.98,32.20,-110.55,32.62',
    geometryType: 'esriGeometryEnvelope',
    inSR: '4269',
    spatialRel: 'esriSpatialRelIntersects',
    outSR: '4326',
    returnGeometry: 'true',
  }
};

const WFIGS_FIRE_PERIMETERS = {
  id: 'wfigs-fire-perimeters-current',
  endpoint: 'https://services3.arcgis.com/T4QMspbfLg3qTGWY/ArcGIS/rest/services/WFIGS_Interagency_Perimeters_Current/FeatureServer/0/query',
  params: {
    f: 'geojson',
    where: "attr_IncidentTypeCategory IN ('WF','CX') AND attr_FireOutDateTime IS NULL",
    outFields: 'OBJECTID,poly_IncidentName,poly_GISAcres,poly_DateCurrent,poly_PolygonDateTime,attr_IncidentName,attr_IncidentTypeCategory,attr_IncidentSize,attr_PercentContained,attr_FireDiscoveryDateTime,attr_ModifiedOnDateTime_dt,attr_FireOutDateTime,attr_UniqueFireIdentifier',
    geometry: '-110.98,32.20,-110.55,32.62',
    geometryType: 'esriGeometryEnvelope',
    inSR: '4326',
    spatialRel: 'esriSpatialRelIntersects',
    outSR: '4326',
    returnGeometry: 'true',
  }
};

const GDELT_SANTA_CATALINA_NEWS = {
  id: 'gdelt-santa-catalina-news',
  endpoint: 'https://api.gdeltproject.org/api/v2/doc/doc',
  params: {
    mode: 'artlist',
    format: 'json',
    maxrecords: '25',
    sort: 'datedesc',
    timespan: '48h',
    query: '( "Mt Lemmon" OR "Mount Lemmon" OR "Santa Catalina Mountains" OR "Santa Catalinas" OR "Summerhaven" OR "Catalina Highway" OR "Sabino Canyon" OR "Rose Canyon" OR "Bear Wallow" OR "Camp Lawton" ) ( fire OR wildfire OR smoke OR evacuation OR closure OR "red flag" OR bear OR "black bear" OR "mountain lion" OR cougar OR wildlife OR rescue ) -Georgia -Millen -"Jenkins County" -"Burke County" -"Magnolia Springs" -Confederate -Union -POW -"prisoner of war" -Andersonville -"Camp Sumter" -"Civil War" -archaeology -artifact',
  }
};

// Classification Helpers
export function isPersistent(severity: OpsSeverity) {
  return ['critical', 'admin-evacuation-review', 'critical-safety', 'persistent-warning', 'persistent-watch', 'persistent-news-check'].includes(severity);
}

export function classifyFireSeverity(args: { insideSantaCatalinas: boolean; distanceMilesFromCamp?: number; redFlagActive: boolean; }): OpsSeverity {
  const { insideSantaCatalinas, distanceMilesFromCamp, redFlagActive } = args;
  if (insideSantaCatalinas && redFlagActive) return 'admin-evacuation-review';
  if (typeof distanceMilesFromCamp === 'number' && distanceMilesFromCamp <= 15) return 'admin-evacuation-review';
  if (insideSantaCatalinas) return 'critical';
  if (typeof distanceMilesFromCamp === 'number' && distanceMilesFromCamp <= 30) return 'persistent-watch';
  return 'ticker';
}

export function classifyNwsEvent(eventName: string): OpsSeverity {
  const event = eventName.toLowerCase();
  if (['red flag warning', 'fire warning', 'evacuation immediate', 'flash flood warning', 'severe thunderstorm warning', 'high wind warning'].some((term) => event.includes(term))) {
    return 'critical';
  }
  if (['fire weather watch', 'wind advisory', 'special weather statement', 'air quality alert'].some((term) => event.includes(term))) {
    return 'persistent-watch';
  }
  return 'ticker';
}

export function isGeorgiaCivilWarCampLawton(text: string) {
  const normalized = text.toLowerCase();
  return CAMP_LAWTON_EXCLUDE_TERMS.some((term) => normalized.includes(term));
}

export function isArizonaCampLawtonMention(text: string) {
  const normalized = text.toLowerCase();
  if (!normalized.includes('camp lawton')) return false;
  if (isGeorgiaCivilWarCampLawton(normalized)) return false;
  return CAMP_LAWTON_POSITIVE_TERMS.some((term) => normalized.includes(term));
}

export function classifyWildlifeNews(text: string): OpsSeverity {
  const normalized = text.toLowerCase();
  const wildlifeMatch = ['bear', 'black bear', 'mountain lion', 'cougar', 'wildlife'].some((term) => normalized.includes(term));
  if (!wildlifeMatch) return 'ticker';
  if (['attack', 'aggressive', 'closure', 'near campground', 'near camp'].some((term) => normalized.includes(term))) return 'critical-safety';
  if (['sighting', 'reported', 'seen', 'near mt lemmon', 'near mount lemmon'].some((term) => normalized.includes(term))) return 'persistent-warning';
  return 'ticker';
}

export function classifyCampLawtonNews(text: string): OpsSeverity {
  const normalized = text.toLowerCase();
  if (normalized.includes('camp lawton') && !isArizonaCampLawtonMention(normalized)) return 'ticker';
  const fireOrClosure = ['fire', 'wildfire', 'smoke', 'evacuation', 'closure', 'lightning', 'flood', 'storm'].some((term) => normalized.includes(term));
  const wildlife = ['bear', 'black bear', 'mountain lion', 'cougar', 'wildlife'].some((term) => normalized.includes(term));
  if (fireOrClosure) return 'persistent-news-check';
  if (wildlife) return classifyWildlifeNews(normalized);
  return 'ticker';
}

export function sortPriorityItems(items: OpsFeedItem[]) {
  const rank: Record<OpsSeverity, number> = {
    'admin-evacuation-review': 1,
    critical: 2,
    'critical-safety': 3,
    'persistent-warning': 4,
    'persistent-watch': 5,
    'persistent-news-check': 6,
    ticker: 7,
    reference: 8,
  };
  return [...items].sort((a, b) => rank[a.severity] - rank[b.severity]);
}

export function sortTickerItems(items: OpsFeedItem[]) {
  const sourceRank: Record<OpsSource, number> = {
    nws: 1, usfs: 2, wfigs: 3, az511: 4, azgfd: 5, gdelt: 6, 'local-news': 7, camp: 8,
  };
  return [...items].sort((a, b) => sourceRank[a.source] - sourceRank[b.source]);
}

function dedupeItems(items: OpsFeedItem[]) {
  const seen = new Set();
  return items.filter(item => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}


// Fetchers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatWfigsSentence(props: any): string {
  const name = props.IncidentName || props.poly_IncidentName || props.attr_IncidentName || 'Unknown Fire';
  const size = props.IncidentSize || props.poly_GISAcres || props.attr_IncidentSize || 0;
  const contained = props.PercentContained ?? props.attr_PercentContained;
  const discovered = props.FireDiscoveryDateTime || props.attr_FireDiscoveryDateTime;
  const desc = props.IncidentShortDescription;
  
  const sizeStr = size > 0 ? `${Math.round(size)} acres` : 'Size unknown';
  const containedStr = typeof contained === 'number' ? `, ${Math.round(contained)}% contained` : '';
  const dateStr = discovered ? ` discovered on ${new Date(discovered).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : '';
  
  let base = `The ${name} Fire${dateStr} is currently ${sizeStr}${containedStr}.`;
  if (desc) {
    const words = desc.split(/\s+/);
    base += ` ${words.length > 30 ? words.slice(0, 30).join(' ') + '...' : desc}`;
  }
  return base.trim();
}

async function fetchNwsActiveAlerts(): Promise<OpsFeedItem[]> {
  try {
    const res = await fetch('https://api.weather.gov/alerts/active?point=32.39806,-110.725', { headers: { 'User-Agent': 'CampLawtonStaffPortal/1.0' } });
    if (!res.ok) return [];
    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.features.map((f: any) => {
      const severity = classifyNwsEvent(f.properties.event);
      return {
        id: `nws-${f.properties.id}`,
        source: 'nws',
        sourceLabel: 'NWS',
        sourceConfidence: 'official',
        title: f.properties.event,
        shortLabel: f.properties.event,
        summary: f.properties.headline || f.properties.description,
        category: 'weather',
        severity,
        persistent: isPersistent(severity),
        ticker: true,
        sourceUrl: 'https://forecast.weather.gov/MapClick.php?zoneid=AZZ504',
        regionMatch: true
      };
    });
  } catch (e) { return []; }
}

async function fetchNwsStationTicker(): Promise<OpsFeedItem[]> {
  // Handled by GlobalHUD internally or left here for completeness
  return []; 
}

async function fetchWfigsIncidentPoints(redFlagActive: boolean): Promise<OpsFeedItem[]> {
  try {
    const url = new URL(WFIGS_INCIDENT_POINTS.endpoint);
    Object.entries(WFIGS_INCIDENT_POINTS.params).forEach(([k, v]) => url.searchParams.append(k, v));
    const res = await fetch(url.toString());
    if (!res.ok) return [];
    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.features || []).map((f: any) => {
      const props = f.properties;
      const severity = classifyFireSeverity({ insideSantaCatalinas: true, redFlagActive }); // Assuming true since we filtered by bbox
      return {
        id: `wfigs-pt-${props.OBJECTID}`,
        source: 'wfigs',
        sourceLabel: 'WFIGS',
        sourceConfidence: 'official',
        title: formatWfigsSentence(props),
        shortLabel: props.IncidentName,
        category: 'fire',
        severity,
        persistent: isPersistent(severity),
        ticker: true,
        sourceUrl: 'https://inciweb.wildfire.gov/',
        regionMatch: true
      };
    });
  } catch (e) { return []; }
}

async function fetchWfigsFirePerimeters(redFlagActive: boolean): Promise<OpsFeedItem[]> {
  try {
    const url = new URL(WFIGS_FIRE_PERIMETERS.endpoint);
    Object.entries(WFIGS_FIRE_PERIMETERS.params).forEach(([k, v]) => url.searchParams.append(k, v));
    const res = await fetch(url.toString());
    if (!res.ok) return [];
    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.features || []).map((f: any) => {
      const props = f.properties;
      const severity = classifyFireSeverity({ insideSantaCatalinas: true, redFlagActive }); 
      return {
        id: `wfigs-perim-${props.OBJECTID}`,
        source: 'wfigs',
        sourceLabel: 'WFIGS Perimeter',
        sourceConfidence: 'official',
        title: formatWfigsSentence(props),
        shortLabel: props.poly_IncidentName,
        category: 'fire',
        severity,
        persistent: isPersistent(severity),
        ticker: true,
        sourceUrl: 'https://inciweb.wildfire.gov/',
        regionMatch: true
      };
    });
  } catch (e) { return []; }
}

async function fetchGdeltNews(): Promise<OpsFeedItem[]> {
  try {
    const url = new URL(GDELT_SANTA_CATALINA_NEWS.endpoint);
    Object.entries(GDELT_SANTA_CATALINA_NEWS.params).forEach(([k, v]) => url.searchParams.append(k, v));
    const res = await fetch(url.toString());
    if (!res.ok) return [];
    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.articles || []).map((art: any, i: number) => {
      const severity = classifyCampLawtonNews(art.title);
      return {
        id: `gdelt-${i}`,
        source: 'gdelt',
        sourceLabel: 'GDELT',
        sourceConfidence: 'media',
        title: art.title,
        shortLabel: 'News Check',
        category: 'general',
        severity,
        persistent: isPersistent(severity),
        ticker: true,
        sourceUrl: art.url,
        regionMatch: true
      };
    });
  } catch (e) { return []; }
}

async function fetchCampAlerts(): Promise<OpsFeedItem[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
    if (!supabaseUrl || !supabaseKey) return [];
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data } = await supabase.from('camp_alerts').select('*').eq('is_active', true);
    if (!data) return [];
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((a: any) => {
      let severity: OpsSeverity = 'ticker';
      if (a.severity === 'action') severity = 'critical';
      if (a.severity === 'warning') severity = 'persistent-warning';
      if (a.severity === 'watch') severity = 'persistent-watch';
      
      return {
        id: `camp-${a.id}`,
        source: 'camp',
        sourceLabel: 'Camp Admin',
        sourceConfidence: 'camp-admin',
        title: a.title,
        shortLabel: a.title,
        summary: a.description,
        category: a.category as OpsCategory,
        severity,
        persistent: isPersistent(severity),
        ticker: true,
        sourceUrl: a.source_url || '#',
        regionMatch: true
      };
    });
  } catch (e) { return []; }
}

function isRedFlagActive(nwsAlerts: OpsFeedItem[]): boolean {
  return nwsAlerts.some(a => a.severity === 'critical' && a.title.toLowerCase().includes('red flag'));
}

export async function buildOpsHud(): Promise<OpsHudResponse> {
  const generatedAt = new Date().toISOString();
  
  const nwsAlerts = await fetchNwsActiveAlerts();
  const redFlagActive = isRedFlagActive(nwsAlerts);

  const [
    campAlerts,
    wfigsIncidents,
    wfigsPerimeters,
    gdeltNews,
  ] = await Promise.all([
    fetchCampAlerts(),
    fetchWfigsIncidentPoints(redFlagActive),
    fetchWfigsFirePerimeters(redFlagActive),
    fetchGdeltNews(),
  ]);

  const allItems = dedupeItems([
    ...campAlerts,
    ...nwsAlerts,
    ...wfigsPerimeters,
    ...wfigsIncidents,
    ...gdeltNews,
  ]).filter((item) => item.regionMatch);

  const priorityItems = sortPriorityItems(allItems);
  const tickerItems: OpsFeedItem[] = [];

  return {
    generatedAt,
    stale: false,
    priorityItems,
    tickerItems,
  };
}
