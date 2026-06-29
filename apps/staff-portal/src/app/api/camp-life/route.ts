import { NextResponse } from 'next/server';
import { CAMP_LIFE_LOCAL_ITEMS } from '@/data/ticker/campLifeLocal';

export const dynamic = 'force-static';

const SOURCE_TTL_MINUTES: Record<string, number> = {
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

function minutesFromNow(minutes: number) {
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

function tickerText(title: string, description: string) {
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

function parseRssItems(xml: string) {
  const itemBlocks = [...xml.matchAll(/<item[\s\S]*?<\/item>/gi)].map((m) => m[0]);

  return itemBlocks.slice(0, 10).map((block) => {
    const get = (tag: string) => {
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

async function fetchText(url: string, options: RequestInit = {}) {
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

async function fetchJson(url: string, options: RequestInit = {}) {
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

function normalizeRssItem(source: any, item: any) {
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

async function fetchRssSource(source: any) {
  try {
    const xml = await fetchText(source.url);
    return parseRssItems(xml)
      .map((item) => normalizeRssItem(source, item))
      .filter(Boolean);
  } catch (err) {
    return [];
  }
}

async function fetchDadJoke() {
  try {
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
  } catch (err) {
    return [];
  }
}

async function fetchTrivia() {
  try {
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
  } catch (err) {
    return [];
  }
}

function normalizeLocalItems() {
  const fetchedAt = new Date().toISOString();
  return CAMP_LIFE_LOCAL_ITEMS.map((item) => ({
    ...item,
    fetchedAt,
    expiresAt: minutesFromNow(24 * 60),
    safe: true,
  }));
}

function dedupeItems(items: any[]) {
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

function interleaveItems(items: any[]) {
  const grouped: Record<string, any[]> = {};
  for (const item of items) {
    if (!grouped[item.sourceName]) grouped[item.sourceName] = [];
    grouped[item.sourceName].push(item);
  }
  
  for (const source in grouped) {
    grouped[source].sort((a, b) => (b.score || 0) - (a.score || 0));
  }
  
  const result = [];
  const keys = Object.keys(grouped);
  let hasMore = true;
  let idx = 0;
  
  while (hasMore) {
    hasMore = false;
    for (const key of keys) {
      if (grouped[key].length > idx) {
        result.push(grouped[key][idx]);
        hasMore = true;
      }
    }
    idx++;
  }
  
  return result;
}

export async function GET() {
  try {
    const settled = await Promise.allSettled([
      ...RSS_SOURCES.map(fetchRssSource),
      fetchDadJoke(),
      fetchTrivia(),
    ]);

    const liveItems = settled
      .flatMap((result) => (result.status === 'fulfilled' ? result.value : []))
      .filter((item: any) => item && item.safe)
      .sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
      .slice(0, 18);

    const localItems = normalizeLocalItems();
    
    // Dedupe and interleave live items first to prioritize them
    const dedupedLive = dedupeItems(liveItems);
    const interleavedLive = interleaveItems(dedupedLive);
    
    // Dedupe local items and filter out any that somehow match live items
    const dedupedLocal = dedupeItems(localItems).filter(
      l => !interleavedLive.some(live => 
        `${live.label}:${live.text}`.toLowerCase() === `${l.label}:${l.text}`.toLowerCase()
      )
    );
    const interleavedLocal = interleaveItems(dedupedLocal);
    
    // Combine with live items first
    const items = [...interleavedLive, ...interleavedLocal].slice(0, 24);

    return NextResponse.json(
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
    return NextResponse.json(
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
