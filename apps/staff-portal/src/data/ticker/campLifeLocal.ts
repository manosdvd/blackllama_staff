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
