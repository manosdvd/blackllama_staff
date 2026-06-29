# Camp Life Ticker Feeds

## Purpose

This document defines a safe, useful, and lively non-operational ticker layer for the Camp Lawton Staff Portal.

The existing operational HUD should continue to answer:

> Is the mountain safe right now?

The Camp Life ticker should answer:

> What is useful, cheerful, Scout-like, or interesting while we are here?

Do not mix these two jobs. Live content from blogs, magazines, joke APIs, trivia feeds, or science feeds must never become a priority alert. It may appear in the ticker only as clearly labeled low-stakes context.

---

## Current repo assumptions

The current app is a static-export Next.js app deployed through Netlify. The existing `netlify.toml` routes `/api/*` to Netlify Functions in `legacy/netlify/functions`.

Recommended MVP:

```txt
legacy/netlify/functions/camp-life-feed.mjs
apps/staff-portal/src/components/ui/GlobalHUD.tsx
apps/staff-portal/src/data/ticker/campLifeLocal.ts
```

Do **not** implement this as a Next.js App Router API route unless the app stops using static export.

---

## Content lanes

```ts
export type TickerLane =
  | 'ops'
  | 'scouting-news'
  | 'outdoor-skill'
  | 'field-notes'
  | 'camp-life-live'
  | 'camp-life-local'
  | 'evergreen';
```

### Display labels

Use short labels that make the item feel intentional:

```txt
SCOUTING UPDATE
OUTDOOR SKILL
FIELD NOTES
WORD OF THE DAY
DAD JOKE
TRIVIA
SKYWATCH
GOOD TURN
SCOUT LAW
NATURE NUGGET
CAMP TIP
OUTDOOR ETHIC
```

---

## Source policy

### Green-light live sources

These are safe enough for live ingestion after filtering, caching, and text cleanup.

| Source | Endpoint / URL | Lane | Notes |
|---|---|---|---|
| On Scouting | `https://blog.scoutingmagazine.org/feed/` | `scouting-news`, `outdoor-skill` | Best fit. Official Scouting America blog content. |
| Scouting Newsroom | `https://www.scoutingnewsroom.org/feed/` | `scouting-news` | Filter harder. Avoid controversy/legal/political headlines in normal ticker. |
| Scout Life | `https://scoutlife.org/feed/` | `camp-life-live`, `outdoor-skill` | Youth-friendly Scouting magazine content. Test endpoint during implementation. |
| Merriam-Webster Word of the Day | `https://www.merriam-webster.com/wotd/feed/rss2` | `camp-life-live` | Great daily vocabulary filler. |
| icanhazdadjoke | `https://icanhazdadjoke.com/` | `camp-life-live` | Use `Accept: application/json` and a custom `User-Agent`. |
| NASA RSS feeds | `https://www.nasa.gov/rss-feeds/` | `field-notes`, `skywatch` | Use Image of the Day / space content. Link out; do not assume all images are reusable. |
| ScienceDaily Earth & Climate | `https://www.sciencedaily.com/rss/earth_climate.xml` | `field-notes` | Filter for camp-relevant nature/weather/conservation content. |
| ScienceDaily Plants & Animals | `https://www.sciencedaily.com/rss/plants_animals.xml` | `field-notes`, `nature-watch` | Good wildlife/ecology content; filter medical/grim items. |
| Open Trivia DB | `https://opentdb.com/api.php` | `camp-life-live` | Free JSON trivia. Attribute OpenTDB / CC BY-SA. Cache aggressively. |
| JokeAPI | `https://v2.jokeapi.dev/` | `camp-life-live` | Use only safe mode + strict blacklist. Keep as optional fallback after dad jokes. |

### Optional / disabled-by-default sources

| Source | Why optional |
|---|---|
| Good News Network | Positive, but broader than camp. It may include celebrities, horoscopes, health claims, affiliates, or religion-adjacent content. Use only after filters are proven. |
| Useless Facts APIs | Can be fun, but many facts will not fit Scout tone. Use only with strong filtering. |
| General news search | Too noisy and too easy to make the HUD feel political, grim, or distracting. |
| Social media | Keep out of this ticker. If added later, make it admin-only and reviewable. |

### Local/offline sources

Use curated local packs for:

- Scout Law prompts
- Scout Oath reminders
- Good Turn prompts
- Camp Lawton trivia
- trail tips
- knot tips
- nature facts
- Leave No Trace prompts
- wholesome riddles
- approved dad jokes
- words of the day fallback

The local pack keeps the ticker alive when offline and prevents the app from feeling broken.

---

## Safety rules

Live internet content is allowed only after all of these steps:

```txt
1. Fetch from whitelisted source.
2. Strip HTML.
3. Decode entities.
4. Truncate to ticker-safe length.
5. Block unsafe or off-tone terms.
6. Score for Scout/outdoor relevance.
7. Cache result.
8. Mix with local fallback items.
9. Display only as ticker/context, never as an operational alert.
```

### Blocklist

This should start strict and be relaxed only after review.

```ts
export const BLOCKED_TICKER_TERMS = [
  'abuse',
  'assault',
  'bankruptcy',
  'death',
  'died',
  'killed',
  'murder',
  'suicide',
  'sex',
  'sexual',
  'nsfw',
  'porn',
  'onlyfans',
  'alcohol',
  'beer',
  'weed',
  'marijuana',
  'drug',
  'drugs',
  'politics',
  'election',
  'trump',
  'biden',
  'lawsuit',
  'weapon',
  'gun',
  'shooting',
  'war',
  'horoscope',
  'celebrity',
  'affiliate',
  'sponsored',
  'review',
  'idiot',
  'stupid',
  'fat',
  'racist',
  'sexist',
];
```

### Boost terms

```ts
export const BOOST_TICKER_TERMS = [
  'scout',
  'scouting',
  'camp',
  'camping',
  'outdoor',
  'hiking',
  'trail',
  'first aid',
  'safety',
  'leader',
  'leadership',
  'service',
  'good turn',
  'eagle scout',
  'conservation',
  'nature',
  'wildlife',
  'astronomy',
  'space',
  'earth',
  'weather',
  'forest',
  'water',
  'leave no trace',
  'outdoor ethic',
];
```

---

## Normalized item type

Keep this separate from operational `OpsFeedItem` unless the existing type is intentionally expanded.

```ts
export type CampLifeTickerItem = {
  id: string;
  lane:
    | 'scouting-news'
    | 'outdoor-skill'
    | 'field-notes'
    | 'camp-life-live'
    | 'camp-life-local'
    | 'evergreen'
    | 'skywatch';

  label: string;
  text: string;
  answer?: string;

  sourceName: string;
  sourceUrl?: string;
  attribution?: string;

  fetchedAt: string;
  expiresAt: string;
  safe: boolean;
  score: number;
};
```

Suggested response shape:

```ts
export type CampLifeFeedResponse = {
  generatedAt: string;
  stale: boolean;
  liveCount: number;
  localCount: number;
  items: CampLifeTickerItem[];
};
```

---

## Local fallback pack

Create:

```txt
apps/staff-portal/src/data/ticker/campLifeLocal.ts
```

```ts
import type { CampLifeTickerItem } from '@/types/ticker';

const now = new Date().toISOString();
const farFuture = '2099-12-31T23:59:59.000Z';

export const CAMP_LIFE_LOCAL_ITEMS: CampLifeTickerItem[] = [
  {
    id: 'local-good-turn-trash',
    lane: 'camp-life-local',
    label: 'GOOD TURN',
    text: 'Pick up three pieces of trash before flags. Quiet service still counts.',
    sourceName: 'Camp Lawton',
    fetchedAt: now,
    expiresAt: farFuture,
    safe: true,
    score: 10,
  },
  {
    id: 'local-scout-law-helpful',
    lane: 'evergreen',
    label: 'SCOUT LAW',
    text: 'Helpful · Look for one small job nobody asked you to do.',
    sourceName: 'Camp Lawton',
    fetchedAt: now,
    expiresAt: farFuture,
    safe: true,
    score: 10,
  },
  {
    id: 'local-word-cairn',
    lane: 'camp-life-local',
    label: 'WORD OF THE DAY',
    text: 'Cairn · A stack of stones used as a trail marker.',
    sourceName: 'Camp Lawton',
    fetchedAt: now,
    expiresAt: farFuture,
    safe: true,
    score: 9,
  },
  {
    id: 'local-riddle-map',
    lane: 'camp-life-local',
    label: 'RIDDLE',
    text: 'I have lakes with no water and roads with no cars. What am I?',
    answer: 'A map.',
    sourceName: 'Camp Lawton',
    fetchedAt: now,
    expiresAt: farFuture,
    safe: true,
    score: 8,
  },
  {
    id: 'local-lnt-wildlife',
    lane: 'evergreen',
    label: 'OUTDOOR ETHIC',
    text: 'Respect wildlife. Watch from a distance and let animals stay wild.',
    sourceName: 'Leave No Trace prompt',
    fetchedAt: now,
    expiresAt: farFuture,
    safe: true,
    score: 9,
  },
  {
    id: 'local-camp-tip-cotton',
    lane: 'camp-life-local',
    label: 'CAMP TIP',
    text: 'Cotton gets cold fast when wet. Wool and synthetics are better on the mountain.',
    sourceName: 'Camp Lawton',
    fetchedAt: now,
    expiresAt: farFuture,
    safe: true,
    score: 9,
  },
  {
    id: 'local-joke-fog',
    lane: 'camp-life-local',
    label: 'DAD JOKE',
    text: 'I tried to catch fog yesterday. Mist.',
    sourceName: 'Camp Lawton approved joke',
    fetchedAt: now,
    expiresAt: farFuture,
    safe: true,
    score: 7,
  },
  {
    id: 'local-nature-ponderosa',
    lane: 'camp-life-local',
    label: 'NATURE NUGGET',
    text: 'Warm ponderosa pine bark can smell a little like vanilla or butterscotch.',
    sourceName: 'Camp Lawton',
    fetchedAt: now,
    expiresAt: farFuture,
    safe: true,
    score: 8,
  },
];
```

---

## Netlify function MVP

Create:

```txt
legacy/netlify/functions/camp-life-feed.mjs
```

This dependency-free version is intentionally conservative. It uses simple RSS extraction good enough for ticker headlines. If richer parsing becomes important, add `fast-xml-parser` as a root dependency and replace `parseRssItems`.

```js
const SOURCE_TTL_MINUTES = {
  'on-scouting': 60,
  'scouting-newsroom': 180,
  'scout-life': 180,
  'merriam-webster-wotd': 720,
  'nasa-image': 720,
  'sciencedaily-earth': 180,
  'sciencedaily-plants': 180,
  'dad-joke': 360,
  trivia: 1440,
};

const RSS_SOURCES = [
  {
    id: 'on-scouting',
    name: 'On Scouting',
    url: 'https://blog.scoutingmagazine.org/feed/',
    lane: 'scouting-news',
    label: 'SCOUTING UPDATE',
    minScore: 2,
  },
  {
    id: 'scouting-newsroom',
    name: 'Scouting Newsroom',
    url: 'https://www.scoutingnewsroom.org/feed/',
    lane: 'scouting-news',
    label: 'SCOUTING NEWS',
    minScore: 4,
  },
  {
    id: 'scout-life',
    name: 'Scout Life',
    url: 'https://scoutlife.org/feed/',
    lane: 'camp-life-live',
    label: 'SCOUT LIFE',
    minScore: 2,
  },
  {
    id: 'merriam-webster-wotd',
    name: 'Merriam-Webster',
    url: 'https://www.merriam-webster.com/wotd/feed/rss2',
    lane: 'camp-life-live',
    label: 'WORD OF THE DAY',
    minScore: 0,
  },
  {
    id: 'nasa-image',
    name: 'NASA',
    url: 'https://www.nasa.gov/rss/dyn/lg_image_of_the_day.rss',
    lane: 'skywatch',
    label: 'SKYWATCH',
    minScore: 0,
  },
  {
    id: 'sciencedaily-earth',
    name: 'ScienceDaily',
    url: 'https://www.sciencedaily.com/rss/earth_climate.xml',
    lane: 'field-notes',
    label: 'FIELD NOTES',
    minScore: 3,
  },
  {
    id: 'sciencedaily-plants',
    name: 'ScienceDaily',
    url: 'https://www.sciencedaily.com/rss/plants_animals.xml',
    lane: 'field-notes',
    label: 'NATURE WATCH',
    minScore: 3,
  },
];

const LOCAL_ITEMS = [
  {
    id: 'fallback-good-turn-trash',
    lane: 'camp-life-local',
    label: 'GOOD TURN',
    text: 'Pick up three pieces of trash before flags. Quiet service still counts.',
    sourceName: 'Camp Lawton',
    score: 10,
  },
  {
    id: 'fallback-scout-law-helpful',
    lane: 'evergreen',
    label: 'SCOUT LAW',
    text: 'Helpful · Look for one small job nobody asked you to do.',
    sourceName: 'Camp Lawton',
    score: 10,
  },
  {
    id: 'fallback-riddle-map',
    lane: 'camp-life-local',
    label: 'RIDDLE',
    text: 'I have lakes with no water and roads with no cars. What am I?',
    answer: 'A map.',
    sourceName: 'Camp Lawton',
    score: 8,
  },
  {
    id: 'fallback-camp-tip-cotton',
    lane: 'camp-life-local',
    label: 'CAMP TIP',
    text: 'Cotton gets cold fast when wet. Wool and synthetics are better on the mountain.',
    sourceName: 'Camp Lawton',
    score: 9,
  },
];

const BLOCKED_TERMS = [
  'abuse', 'assault', 'bankruptcy', 'death', 'died', 'killed', 'murder', 'suicide',
  'sex', 'sexual', 'nsfw', 'porn', 'onlyfans', 'alcohol', 'beer', 'weed', 'marijuana',
  'drug', 'drugs', 'politics', 'election', 'trump', 'biden', 'lawsuit', 'weapon',
  'gun', 'shooting', 'war', 'horoscope', 'celebrity', 'affiliate', 'sponsored',
  'idiot', 'stupid', 'fat', 'racist', 'sexist',
];

const BOOST_TERMS = [
  'scout', 'scouting', 'camp', 'camping', 'outdoor', 'hiking', 'trail', 'first aid',
  'safety', 'leader', 'leadership', 'service', 'good turn', 'eagle scout',
  'conservation', 'nature', 'wildlife', 'astronomy', 'space', 'earth', 'weather',
  'forest', 'water', 'leave no trace', 'outdoor ethic',
];

function minutesFromNow(minutes) {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}

function decodeEntities(value = '') {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#039;', "'")
    .replaceAll('&apos;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

function stripHtml(value = '') {
  return decodeEntities(
    value
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

function slugify(value = '') {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

function tickerText(title, description) {
  const cleanTitle = stripHtml(title);
  const cleanDescription = stripHtml(description);
  const combined = cleanTitle || cleanDescription;
  if (combined.length <= 120) return combined;
  return `${combined.slice(0, 117).trim()}…`;
}

function isBlocked(text = '') {
  const lower = text.toLowerCase();
  return BLOCKED_TERMS.some((term) => lower.includes(term));
}

function scoreText(text = '') {
  const lower = text.toLowerCase();
  let score = 0;
  for (const term of BOOST_TERMS) {
    if (lower.includes(term)) score += 2;
  }
  if (lower.length <= 140) score += 1;
  return score;
}

function parseRssItems(xml) {
  const itemBlocks = [...xml.matchAll(/<item[\s\S]*?<\/item>/gi)].map((m) => m[0]);

  return itemBlocks.slice(0, 10).map((block) => {
    const get = (tag) => {
      const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
      return match ? stripHtml(match[1]) : '';
    };

    return {
      title: get('title'),
      description: get('description'),
      link: get('link'),
      pubDate: get('pubDate'),
    };
  });
}

async function fetchText(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'User-Agent': 'CampLawtonStaffPortal/1.0 (camp-life ticker)',
      ...(options.headers || {}),
    },
  });

  if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`);
  return res.text();
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'User-Agent': 'CampLawtonStaffPortal/1.0 (camp-life ticker)',
      ...(options.headers || {}),
    },
  });

  if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`);
  return res.json();
}

function normalizeRssItem(source, item) {
  const text = tickerText(item.title, item.description);
  const combined = `${item.title} ${item.description}`;
  if (!text || isBlocked(combined)) return null;

  const score = scoreText(combined);
  if (score < source.minScore) return null;

  const fetchedAt = new Date().toISOString();
  const ttl = SOURCE_TTL_MINUTES[source.id] || 180;

  return {
    id: `${source.id}-${slugify(item.title || item.link)}`,
    lane: source.lane,
    label: source.label,
    text,
    sourceName: source.name,
    sourceUrl: item.link || source.url,
    fetchedAt,
    expiresAt: minutesFromNow(ttl),
    safe: true,
    score,
  };
}

async function fetchRssSource(source) {
  const xml = await fetchText(source.url);
  return parseRssItems(xml)
    .map((item) => normalizeRssItem(source, item))
    .filter(Boolean);
}

async function fetchDadJoke() {
  const joke = await fetchJson('https://icanhazdadjoke.com/', {
    headers: { Accept: 'application/json' },
  });

  const text = stripHtml(joke.joke || '');
  if (!text || isBlocked(text)) return [];

  return [
    {
      id: `dad-joke-${slugify(text)}`,
      lane: 'camp-life-live',
      label: 'DAD JOKE',
      text,
      sourceName: 'icanhazdadjoke',
      sourceUrl: 'https://icanhazdadjoke.com/',
      fetchedAt: new Date().toISOString(),
      expiresAt: minutesFromNow(SOURCE_TTL_MINUTES['dad-joke']),
      safe: true,
      score: 5,
    },
  ];
}

async function fetchTrivia() {
  const url = 'https://opentdb.com/api.php?amount=1&category=17&type=multiple';
  const data = await fetchJson(url);
  const result = data?.results?.[0];
  if (!result) return [];

  const question = stripHtml(result.question || '');
  const answer = stripHtml(result.correct_answer || '');
  const combined = `${question} ${answer}`;
  if (!question || isBlocked(combined)) return [];

  return [
    {
      id: `trivia-${slugify(question)}`,
      lane: 'camp-life-live',
      label: 'TRIVIA',
      text: question.length <= 120 ? question : `${question.slice(0, 117).trim()}…`,
      answer,
      sourceName: 'Open Trivia DB',
      sourceUrl: 'https://opentdb.com/',
      attribution: 'Open Trivia DB, CC BY-SA 4.0',
      fetchedAt: new Date().toISOString(),
      expiresAt: minutesFromNow(SOURCE_TTL_MINUTES.trivia),
      safe: true,
      score: 6,
    },
  ];
}

function normalizeLocalItems() {
  const fetchedAt = new Date().toISOString();
  return LOCAL_ITEMS.map((item) => ({
    ...item,
    fetchedAt,
    expiresAt: minutesFromNow(24 * 60),
    safe: true,
  }));
}

function dedupeItems(items) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const key = `${item.label}:${item.text}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

export default async function campLifeFeed() {
  try {
    const settled = await Promise.allSettled([
      ...RSS_SOURCES.map(fetchRssSource),
      fetchDadJoke(),
      fetchTrivia(),
    ]);

    const liveItems = settled
      .flatMap((result) => (result.status === 'fulfilled' ? result.value : []))
      .filter((item) => item?.safe)
      .sort((a, b) => b.score - a.score)
      .slice(0, 18);

    const localItems = normalizeLocalItems();
    const items = dedupeItems([...liveItems, ...localItems]).slice(0, 24);

    return Response.json(
      {
        generatedAt: new Date().toISOString(),
        stale: false,
        liveCount: liveItems.length,
        localCount: localItems.length,
        items,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600',
        },
      }
    );
  } catch (error) {
    console.error('Failed to build camp life feed', error);

    const localItems = normalizeLocalItems();
    return Response.json(
      {
        generatedAt: new Date().toISOString(),
        stale: true,
        liveCount: 0,
        localCount: localItems.length,
        items: localItems,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=900',
        },
      }
    );
  }
}

export const config = {
  path: '/api/camp-life-feed',
};
```

---

## Optional JokeAPI fetcher

Add only after the basic feed is stable.

```js
async function fetchSafeJokeApiJoke() {
  const url = 'https://v2.jokeapi.dev/joke/Pun,Misc?type=single&safe-mode&blacklistFlags=nsfw,religious,political,racist,sexist,explicit';
  const data = await fetchJson(url);
  const text = stripHtml(data?.joke || '');
  if (!text || isBlocked(text)) return [];

  return [
    {
      id: `jokeapi-${slugify(text)}`,
      lane: 'camp-life-live',
      label: 'DAD JOKE',
      text,
      sourceName: 'JokeAPI',
      sourceUrl: 'https://v2.jokeapi.dev/',
      fetchedAt: new Date().toISOString(),
      expiresAt: minutesFromNow(360),
      safe: true,
      score: 4,
    },
  ];
}
```

---

## Client integration in GlobalHUD

Update:

```txt
apps/staff-portal/src/components/ui/GlobalHUD.tsx
```

Add a type near the existing interfaces:

```ts
type CampLifeTickerItem = {
  id: string;
  lane: string;
  label: string;
  text: string;
  answer?: string;
  sourceName: string;
  sourceUrl?: string;
  attribution?: string;
  fetchedAt: string;
  expiresAt: string;
  safe: boolean;
  score: number;
};
```

Add state inside `GlobalHUD()`:

```ts
const [campLifeItems, setCampLifeItems] = useState<CampLifeTickerItem[]>([]);
const [campLifeIndex, setCampLifeIndex] = useState(0);
```

Inside the existing `fetchHUDData`, after camp alerts / NWS fetches, add:

```ts
try {
  const campLifeRes = await fetch('/api/camp-life-feed');
  if (campLifeRes.ok) {
    const campLifeData = await campLifeRes.json();
    const items = Array.isArray(campLifeData.items) ? campLifeData.items : [];
    setCampLifeItems(items);
    localStorage.setItem('camp_life_ticker_cache', JSON.stringify({
      savedAt: new Date().toISOString(),
      items,
    }));
  }
} catch {
  try {
    const cached = JSON.parse(localStorage.getItem('camp_life_ticker_cache') || 'null');
    if (Array.isArray(cached?.items)) {
      setCampLifeItems(cached.items);
    }
  } catch {
    // ignore cache parse failure
  }
}
```

Add a rotation effect:

```ts
useEffect(() => {
  if (campLifeItems.length <= 1) return;
  const timer = setInterval(() => {
    setCampLifeIndex((current) => (current + 1) % campLifeItems.length);
  }, 12_000);

  return () => clearInterval(timer);
}, [campLifeItems.length]);
```

Then derive the active item before the return:

```ts
const activeCampLifeItem = campLifeItems.length
  ? campLifeItems[campLifeIndex % campLifeItems.length]
  : null;
```

Add this render block after the regional alerts block or as a new lower rail:

```tsx
{activeCampLifeItem && (
  <a
    href={activeCampLifeItem.sourceUrl || '#'}
    target={activeCampLifeItem.sourceUrl ? '_blank' : undefined}
    rel={activeCampLifeItem.sourceUrl ? 'noopener noreferrer' : undefined}
    className="flex-1 flex items-center gap-2 px-4 py-3 min-w-0 border-t md:border-t-0 md:border-l border-neutral-800 bg-black/20 hover:bg-white/5 transition-colors"
  >
    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex-shrink-0">
      {activeCampLifeItem.label}
    </span>
    <span className="text-xs font-semibold text-neutral-200 truncate">
      {activeCampLifeItem.text}
    </span>
    <span className="text-[10px] text-neutral-500 flex-shrink-0 hidden sm:inline">
      · {activeCampLifeItem.sourceName}
    </span>
  </a>
)}
```

If the rail becomes too crowded on mobile, hide source name first and keep only `LABEL · text`.

---

## Recommended ticker balance

Normal calm day:

```txt
NO PRIORITY ALERTS · Santa Catalina operational sources clear
QSLA3 · 84°F · Wind 8 mph · Humidity 22% · NWS
OUTDOOR SKILL · On Scouting · Burns happen. Here’s what to do.
WORD OF THE DAY · Merriam-Webster · cairn
DAD JOKE · I tried to catch fog yesterday. Mist.
SKYWATCH · NASA · Today’s Image of the Day is ready.
TRIVIA · Science & Nature · Which tree produces acorns?
GOOD TURN · Pick up three pieces of trash before flags.
```

Suggested rotation ratio:

```txt
2 operational/context items
1 camp-life item
2 operational/context items
1 local/offline item
```

Do not let jokes or trivia crowd out warnings, closures, weather changes, road status, fire danger, or admin alerts.

---

## Stale/offline behavior

When offline:

1. Show existing offline banner.
2. Use `camp_life_ticker_cache` from `localStorage` if available.
3. Fall back to `CAMP_LIFE_LOCAL_ITEMS`.
4. Label operational data as stale/unavailable.
5. Do not imply external feeds are live.

Example offline ticker:

```txt
OFFLINE · Live feeds unavailable · Showing saved Camp Life items
GOOD TURN · Refill a water jug before someone asks.
SCOUT LAW · Cheerful · Find the bright side and help others do the same.
```

---

## Build order

1. Add `camp-life-feed.mjs` Netlify Function.
2. Add a small local fallback pack.
3. Fetch `/api/camp-life-feed` from `GlobalHUD.tsx`.
4. Render one camp-life item in the HUD rail.
5. Add localStorage cache.
6. Test offline / failed feed behavior.
7. Add optional sources one at a time.
8. Tune blocklist and boost terms after seeing real output.

---

## Admin controls for later

Eventually add a table or config screen:

```sql
create table public.ticker_source_settings (
  id text primary key,
  enabled boolean not null default true,
  min_score integer not null default 3,
  ttl_minutes integer not null default 180,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

Useful toggles:

- enable/disable source
- adjust minimum score
- block specific words
- pin local item
- hide item until reviewed
- show only local/offline content during staff week

---

## Bottom line

Use live internet feeds, but keep them on rails.

The operational HUD protects people. The Camp Life ticker adds warmth, curiosity, Scout values, and a little camp-radio personality. If a source cannot be filtered, cached, attributed, and clearly labeled, it does not belong in the live ticker.
