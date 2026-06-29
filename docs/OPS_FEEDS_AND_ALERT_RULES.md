# Operational Feeds and Alert Rules

## Intended function

This document defines the operational awareness layer for the Camp Lawton Staff Portal.

The feature should:

- Keep critical Santa Catalina fire, weather, wildlife, closure, and camp alerts persistent at the top of the app.
- Put less critical context into a compact ticker with previous/next arrows.
- Link every item to its source data or source page.
- Treat official sources as stronger than media sources.
- Clearly label news as `NEWS CHECK`, never as official command information.
- Monitor Camp Lawton mentions only when they refer to the Arizona / Scouting / Mt. Lemmon camp, not the Civil War prison in Georgia.

This is not an evacuation command system. It is a staff-facing operational awareness layer that helps administration and staff see relevant conditions quickly.

---

## Display model

### Persistent priority bar

Use for critical or operationally important items only.

Examples:

```txt
CRITICAL FIRE · Santa Catalinas · WFIGS · Updated 2:14 PM · Source
```

```txt
ADMIN REVIEW · Fire within 15 mi + Red Flag active · Consider evacuation readiness · Source
```

```txt
WILDLIFE WARNING · Bear reported near Mt Lemmon · Verify with admin · Source
```

### Ticker rail

Use for helpful context that does not require persistent display.

Examples:

```txt
← QSLA3 · 84°F · Wind 8 mph · Humidity 22% · NWS · Source →
```

```txt
← USFS · Ski Run Road Closure · Forest Order · Source →
```

---

## Source hierarchy

| Rank | Source | Confidence | Intended use |
|---:|---|---|---|
| 1 | Camp Admin Alerts | Camp-admin | Local human override and staff instructions |
| 2 | NWS Active Alerts | Official | Red Flag, fire weather, severe weather, evacuation alerts |
| 3 | WFIGS Fire Perimeters | Official | Mapped wildfire boundaries |
| 4 | WFIGS Fire Incident Points | Official | Current wildfire locations before/without a perimeter |
| 5 | USFS Coronado Alerts | Official/page source | Closures, fire restrictions, forest orders |
| 6 | GDELT / local news scan | Media | Early warning and cross-checking only |
| 7 | AZGFD Wildlife Reference | Reference | Bear/mountain lion guidance, not live sightings |
| 8 | AZ511 | Link-only initially | Road status source link |

---

## Source URLs

### NWS

- Active alerts for Camp Lawton point: `https://api.weather.gov/alerts/active?point=32.39806,-110.725`
- QSLA3 station observation: `https://api.weather.gov/stations/QSLA3/observations/latest`
- Point discovery: `https://api.weather.gov/points/32.39806,-110.725`
- API docs: `https://www.weather.gov/documentation/services-web-api`

NWS API calls must include a unique `User-Agent` header.

### WFIGS

- Incident locations current: `https://services3.arcgis.com/T4QMspbfLg3qTGWY/ArcGIS/rest/services/WFIGS_Incident_Locations_Current/FeatureServer/0/query`
- Interagency fire perimeters current: `https://services3.arcgis.com/T4QMspbfLg3qTGWY/ArcGIS/rest/services/WFIGS_Interagency_Perimeters_Current/FeatureServer/0/query`

### USFS

- Coronado alerts: `https://www.fs.usda.gov/r03/coronado/alerts`

### AZGFD

- Living with wildlife reference: `https://www.azgfd.com/wildlife-conservation/living-with-wildlife/`

### AZ511

- Road status source link: `https://www.az511.gov/`

### GDELT

- DOC API: `https://api.gdeltproject.org/api/v2/doc/doc`
- GDELT data overview: `https://www.gdeltproject.org/data.html`

---

## Operational region settings

The app should filter for the Santa Catalina Mountains, not all of Arizona and not all of Pima County.

```ts
export const OPS_REGION = {
  name: 'Santa Catalina Mountains',
  campPoint: {
    label: 'Camp Lawton / Mt. Bigelow area',
    lat: 32.39806,
    lon: -110.725,
  },

  bbox: {
    west: -110.98,
    south: 32.20,
    east: -110.55,
    north: 32.62,
  },

  fireDistanceMiles: {
    action: 5,
    adminReview: 15,
    watch: 30,
  },

  santaCatalinaTerms: [
    'santa catalina',
    'santa catalinas',
    'mt lemmon',
    'mount lemmon',
    'summerhaven',
    'catalina highway',
    'ski run',
    'rose canyon',
    'bear wallow',
    'organization ridge',
    'palisades',
    'sabino canyon',
    'bear canyon',
    'general hitchcock',
    'bigelow',
    'camp lawton',
    'catalina council',
  ],
};
```

A feed item is relevant if it satisfies at least one of these:

```ts
regionMatch =
  geometryIntersectsSantaCatalinaBbox ||
  distanceFromCampMiles <= 30 ||
  titleOrBodyContainsSantaCatalinaTerm;
```

---

## Severity ladder

```ts
export type OpsSeverity =
  | 'critical'
  | 'admin-evacuation-review'
  | 'critical-safety'
  | 'persistent-warning'
  | 'persistent-watch'
  | 'persistent-news-check'
  | 'ticker'
  | 'reference';
```

### Meaning

| Severity | Meaning | Display |
|---|---|---|
| `admin-evacuation-review` | Administration should actively consider evacuation readiness | Persistent priority bar |
| `critical` | Official critical Santa Catalina fire/weather/closure alert | Persistent priority bar |
| `critical-safety` | Serious local wildlife or safety issue | Persistent priority bar |
| `persistent-warning` | Local actionable warning | Persistent priority bar |
| `persistent-watch` | Important but not immediately critical | Persistent priority bar |
| `persistent-news-check` | Media report worth verifying | Persistent priority bar, clearly labeled `NEWS CHECK` |
| `ticker` | Useful context | Ticker rail |
| `reference` | Static guidance/source link | Ticker rail or emergency card |

---

## Core alert rules

```txt
1. Any official fire inside the Santa Catalinas:
   Persistent critical alert.

2. Any official fire within 15 miles of Camp Lawton:
   Persistent admin evacuation-review alert.

3. Any official Santa Catalina fire + active Red Flag Warning:
   Persistent admin evacuation-review alert.

4. Red Flag Warning at the Camp Lawton point:
   Persistent critical alert.

5. Fire Weather Watch:
   Persistent watch.

6. USFS Santa Catalina closure / fire restriction / road closure:
   Persistent warning or watch.

7. Wildlife near Camp Lawton / Mt Lemmon / Summerhaven:
   Persistent warning if local and recent.
   Critical-safety if aggressive animal, attack, closure, or official warning.

8. Camp Lawton news mentions:
   Include only if Arizona / Scouting / Mt. Lemmon context is present.
   Suppress Georgia Civil War prison context.

9. News is never official command.
   Label it NEWS CHECK.

10. Everything else:
   Ticker only.
```

---

## Normalized item type

All feeds should normalize into this shape before reaching the UI.

```ts
export type OpsSource =
  | 'camp'
  | 'nws'
  | 'wfigs'
  | 'usfs'
  | 'azgfd'
  | 'az511'
  | 'gdelt'
  | 'local-news';

export type OpsCategory =
  | 'fire'
  | 'weather'
  | 'closure'
  | 'road'
  | 'wildlife'
  | 'medical'
  | 'program'
  | 'camp-lawton'
  | 'general';

export type SourceConfidence =
  | 'official'
  | 'camp-admin'
  | 'media'
  | 'reference'
  | 'link-only';

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
```

---

## Classification helpers

```ts
export function isPersistent(severity: OpsSeverity) {
  return [
    'critical',
    'admin-evacuation-review',
    'critical-safety',
    'persistent-warning',
    'persistent-watch',
    'persistent-news-check',
  ].includes(severity);
}

export function classifyFireSeverity(args: {
  insideSantaCatalinas: boolean;
  distanceMilesFromCamp?: number;
  redFlagActive: boolean;
}): OpsSeverity {
  const { insideSantaCatalinas, distanceMilesFromCamp, redFlagActive } = args;

  if (insideSantaCatalinas && redFlagActive) {
    return 'admin-evacuation-review';
  }

  if (
    typeof distanceMilesFromCamp === 'number' &&
    distanceMilesFromCamp <= 15
  ) {
    return 'admin-evacuation-review';
  }

  if (insideSantaCatalinas) {
    return 'critical';
  }

  if (
    typeof distanceMilesFromCamp === 'number' &&
    distanceMilesFromCamp <= 30
  ) {
    return 'persistent-watch';
  }

  return 'ticker';
}

export function classifyNwsEvent(eventName: string): OpsSeverity {
  const event = eventName.toLowerCase();

  if (
    [
      'red flag warning',
      'fire warning',
      'evacuation immediate',
      'flash flood warning',
      'severe thunderstorm warning',
      'high wind warning',
    ].some((term) => event.includes(term))
  ) {
    return 'critical';
  }

  if (
    [
      'fire weather watch',
      'wind advisory',
      'special weather statement',
      'air quality alert',
    ].some((term) => event.includes(term))
  ) {
    return 'persistent-watch';
  }

  return 'ticker';
}
```

---

## Camp Lawton mention filtering

The phrase `Camp Lawton` can refer to multiple things. The portal should monitor for the Arizona / Scouting camp and suppress the Civil War prison in Georgia.

```ts
export const CAMP_LAWTON_POSITIVE_TERMS = [
  'camp lawton',
  'catalina council',
  'scouting america',
  'boy scouts',
  'bsa',
  'mt lemmon',
  'mount lemmon',
  'santa catalina',
  'tucson',
  'summerhaven',
  'arizona',
];

export const CAMP_LAWTON_EXCLUDE_TERMS = [
  'georgia',
  'millen',
  'jenkins county',
  'burke county',
  'magnolia springs',
  'magnolia springs state park',
  'confederate',
  'union',
  'pow',
  'prisoner of war',
  'prisoners of war',
  'stockade',
  'andersonville',
  'camp sumter',
  'sherman',
  'civil war',
  'archaeology',
  'archaeological',
  'artifact',
  'artifacts',
];

export function isGeorgiaCivilWarCampLawton(text: string) {
  const normalized = text.toLowerCase();

  return CAMP_LAWTON_EXCLUDE_TERMS.some((term) =>
    normalized.includes(term)
  );
}

export function isArizonaCampLawtonMention(text: string) {
  const normalized = text.toLowerCase();

  if (!normalized.includes('camp lawton')) return false;
  if (isGeorgiaCivilWarCampLawton(normalized)) return false;

  return CAMP_LAWTON_POSITIVE_TERMS.some((term) =>
    normalized.includes(term)
  );
}

export function classifyCampLawtonNews(text: string): OpsSeverity {
  const normalized = text.toLowerCase();

  if (!isArizonaCampLawtonMention(normalized)) {
    return 'ticker';
  }

  const fireOrClosure = [
    'fire',
    'wildfire',
    'smoke',
    'evacuation',
    'closure',
    'lightning',
    'flood',
    'storm',
  ].some((term) => normalized.includes(term));

  const wildlife = [
    'bear',
    'black bear',
    'mountain lion',
    'cougar',
    'wildlife',
  ].some((term) => normalized.includes(term));

  if (fireOrClosure) return 'persistent-news-check';
  if (wildlife) return classifyWildlifeNews(normalized);

  return 'ticker';
}
```

---

## Wildlife classification

```ts
export function classifyWildlifeNews(text: string): OpsSeverity {
  const normalized = text.toLowerCase();

  const wildlifeMatch = [
    'bear',
    'black bear',
    'mountain lion',
    'cougar',
    'wildlife',
  ].some((term) => normalized.includes(term));

  if (!wildlifeMatch) return 'ticker';

  if (
    ['attack', 'aggressive', 'closure', 'near campground', 'near camp'].some(
      (term) => normalized.includes(term)
    )
  ) {
    return 'critical-safety';
  }

  if (
    ['sighting', 'reported', 'seen', 'near mt lemmon', 'near mount lemmon'].some(
      (term) => normalized.includes(term)
    )
  ) {
    return 'persistent-warning';
  }

  return 'ticker';
}
```

---

## WFIGS incident query settings

```ts
export const WFIGS_INCIDENT_POINTS = {
  id: 'wfigs-incident-locations-current',
  endpoint:
    'https://services3.arcgis.com/T4QMspbfLg3qTGWY/ArcGIS/rest/services/WFIGS_Incident_Locations_Current/FeatureServer/0/query',

  params: {
    f: 'geojson',
    where: "IncidentTypeCategory IN ('WF','CX') AND FireOutDateTime IS NULL",
    outFields: [
      'OBJECTID',
      'IncidentName',
      'IncidentShortDescription',
      'IncidentTypeCategory',
      'IncidentSize',
      'PercentContained',
      'FireDiscoveryDateTime',
      'FireOutDateTime',
      'InitialLatitude',
      'InitialLongitude',
      'POOCounty',
      'POOState',
      'ModifiedOnDateTime_dt',
      'UniqueFireIdentifier',
    ].join(','),
    geometry: '-110.98,32.20,-110.55,32.62',
    geometryType: 'esriGeometryEnvelope',
    inSR: '4269',
    spatialRel: 'esriSpatialRelIntersects',
    outSR: '4326',
    returnGeometry: 'true',
  },

  pollIntervalMinutes: 10,
  staleAfterMinutes: 30,
};
```

---

## WFIGS fire perimeter query settings

```ts
export const WFIGS_FIRE_PERIMETERS = {
  id: 'wfigs-fire-perimeters-current',
  endpoint:
    'https://services3.arcgis.com/T4QMspbfLg3qTGWY/ArcGIS/rest/services/WFIGS_Interagency_Perimeters_Current/FeatureServer/0/query',

  params: {
    f: 'geojson',
    where:
      "attr_IncidentTypeCategory IN ('WF','CX') AND attr_FireOutDateTime IS NULL",
    outFields: [
      'OBJECTID',
      'poly_IncidentName',
      'poly_GISAcres',
      'poly_DateCurrent',
      'poly_PolygonDateTime',
      'attr_IncidentName',
      'attr_IncidentTypeCategory',
      'attr_IncidentSize',
      'attr_PercentContained',
      'attr_FireDiscoveryDateTime',
      'attr_ModifiedOnDateTime_dt',
      'attr_FireOutDateTime',
      'attr_UniqueFireIdentifier',
    ].join(','),
    geometry: '-110.98,32.20,-110.55,32.62',
    geometryType: 'esriGeometryEnvelope',
    inSR: '4326',
    spatialRel: 'esriSpatialRelIntersects',
    outSR: '4326',
    returnGeometry: 'true',
  },

  pollIntervalMinutes: 10,
  staleAfterMinutes: 30,
};
```

---

## GDELT news query settings

```ts
export const GDELT_SANTA_CATALINA_NEWS = {
  id: 'gdelt-santa-catalina-news',
  endpoint: 'https://api.gdeltproject.org/api/v2/doc/doc',

  params: {
    mode: 'artlist',
    format: 'json',
    maxrecords: 25,
    sort: 'datedesc',
    timespan: '48h',
    query: [
      '(',
      '"Mt Lemmon" OR',
      '"Mount Lemmon" OR',
      '"Santa Catalina Mountains" OR',
      '"Santa Catalinas" OR',
      '"Summerhaven" OR',
      '"Catalina Highway" OR',
      '"Sabino Canyon" OR',
      '"Rose Canyon" OR',
      '"Bear Wallow" OR',
      '"Camp Lawton"',
      ')',
      '(',
      'fire OR wildfire OR smoke OR evacuation OR closure OR',
      '"red flag" OR',
      'bear OR "black bear" OR "mountain lion" OR cougar OR wildlife OR rescue',
      ')',
      '-Georgia',
      '-Millen',
      '-"Jenkins County"',
      '-"Burke County"',
      '-"Magnolia Springs"',
      '-Confederate',
      '-Union',
      '-POW',
      '-"prisoner of war"',
      '-Andersonville',
      '-"Camp Sumter"',
      '-"Civil War"',
      '-archaeology',
      '-artifact',
    ].join(' '),
  },

  pollIntervalMinutes: 15,
  staleAfterHours: 2,
};
```

---

## Internal camp alerts table

Internal alerts should outrank all external context because they are the camp's own instructions.

```sql
create table public.camp_alerts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null check (
    category in ('fire', 'weather', 'closure', 'medical', 'program', 'admin')
  ),
  severity text not null check (
    severity in ('info', 'watch', 'warning', 'action')
  ),
  is_active boolean default true,
  source_url text,
  starts_at timestamptz default now(),
  expires_at timestamptz,
  created_at timestamptz default now(),
  created_by uuid references public.profiles(id)
);
```

Mapping:

```ts
function mapCampSeverity(severity: string): OpsSeverity {
  if (severity === 'action') return 'critical';
  if (severity === 'warning') return 'persistent-warning';
  if (severity === 'watch') return 'persistent-watch';
  return 'ticker';
}
```

---

## HUD builder intended flow

```ts
export async function buildOpsHud(): Promise<OpsHudResponse> {
  const generatedAt = new Date().toISOString();

  const nwsAlerts = await fetchNwsActiveAlerts();
  const redFlagActive = isRedFlagActive(nwsAlerts);

  const [
    campAlerts,
    stationTicker,
    wfigsIncidents,
    wfigsPerimeters,
    gdeltNews,
  ] = await Promise.all([
    fetchCampAlerts(),
    fetchNwsStationTicker(),
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
    ...stationTicker,
    ...getStaticTickerItems(),
  ]).filter((item) => item.regionMatch);

  const priorityItems = sortPriorityItems(
    allItems.filter((item) => isPersistent(item.severity))
  );

  const tickerItems = allItems.filter(
    (item) => !isPersistent(item.severity) || item.ticker
  );

  return {
    generatedAt,
    stale: false,
    priorityItems,
    tickerItems,
  };
}
```

---

## API route shape

The frontend should call one app endpoint, not every external source.

```ts
import { NextResponse } from 'next/server';
import { buildOpsHud } from '@/lib/ops/build-hud';

export async function GET() {
  try {
    const hud = await buildOpsHud();

    return NextResponse.json(hud, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Failed to build ops HUD', error);

    return NextResponse.json(
      {
        generatedAt: new Date().toISOString(),
        stale: true,
        priorityItems: [],
        tickerItems: [],
        error: 'Operational feed unavailable',
      },
      { status: 500 }
    );
  }
}
```

Suggested route path:

```txt
src/app/api/ops/hud/route.ts
```

---

## Frontend intended behavior

- If one or more priority items exist, show the highest-ranked one persistently.
- If multiple priority items exist, show a count and allow expansion.
- If no priority items exist, show: `No active Santa Catalina priority alerts.`
- The ticker always shows one item at a time.
- Ticker has previous/next arrow buttons.
- Every item has a `Source` link.
- Cached/stale items must be clearly marked.
- Offline mode must never imply weather/fire/news data is live.

---

## Priority sorting

```ts
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
```

---

## Ticker sorting

```ts
export function sortTickerItems(items: OpsFeedItem[]) {
  const sourceRank: Record<OpsSource, number> = {
    nws: 1,
    usfs: 2,
    wfigs: 3,
    az511: 4,
    azgfd: 5,
    gdelt: 6,
    'local-news': 7,
    camp: 8,
  };

  return [...items].sort(
    (a, b) => sourceRank[a.source] - sourceRank[b.source]
  );
}
```

---

## Implementation note

Start with server-side fetching and frontend polling. Later upgrades can add:

- Supabase cache tables for normalized feed results.
- Supabase Realtime for internal camp alerts.
- Exact polygon intersection for fire perimeters.
- Admin UI for posting camp alerts.
- Offline cache labels for stale operational data.

Do not add social feeds to the operational HUD. If Bluesky, Mastodon, or Flickr are ever added, they should live in an admin-only community pulse or recruitment/gallery feature, never in the priority alert layer.
