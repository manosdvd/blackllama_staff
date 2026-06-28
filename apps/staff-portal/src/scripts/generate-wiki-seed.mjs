import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const appDir = join(scriptDir, '..', '..');
const repoRoot = join(appDir, '..', '..');
const handbookPath = join(repoRoot, 'staffHandbookCL.md');
const outputPath = join(appDir, 'src', 'data', 'wiki_seeded.json');

const categoryOrder = [
  'Introduction & Culture',
  'Safety & Training',
  'Policies & Procedures',
  'Campfire & Songbook',
  'Onboarding',
];

const skipTitles = new Set([
  'camp lawton staff handbook',
  'part 1',
  'part 2',
  'part 3 campfire master class and songbook',
  'part 4 onboarding',
]);

const markdown = normalizeMarkdown(readFileSync(handbookPath, 'utf8'));
const lines = markdown.split(/\r?\n/);
const headings = [];
let currentCategory = 'Introduction & Culture';

for (let index = 0; index < lines.length; index += 1) {
  const match = /^(#{1,6})\s+(.*)$/.exec(lines[index]);
  if (!match) continue;

  const level = match[1].length;
  const title = cleanHeading(match[2]);
  if (!title) continue;

  currentCategory = nextCategory(currentCategory, title);
  headings.push({ index, level, title, category: currentCategory });
}

const articles = [];
let sourceIndex = 0;

for (let i = 0; i < headings.length; i += 1) {
  const heading = headings[i];
  const titleKey = heading.title.toLowerCase();
  if (heading.level > 2 || skipTitles.has(titleKey) || /^part\s+\d+$/i.test(heading.title)) {
    continue;
  }

  const nextHeading = headings
    .slice(i + 1)
    .find((candidate) => candidate.level <= 2);
  const endIndex = nextHeading ? nextHeading.index : lines.length;
  const content = cleanContent(lines.slice(heading.index + 1, endIndex).join('\n'));
  if (!content || content.length < 12) continue;

  const category = heading.category;
  articles.push({
    slug: uniqueSlug(slugify(heading.title), articles),
    title: heading.title,
    category,
    content,
    offline_priority: inferOfflinePriority(heading.title, content),
    tags: buildTags(heading.title, content, category),
    revision_no: 1,
    source_index: sourceIndex,
  });
  sourceIndex += 1;
}

articles.sort((a, b) => {
  const categoryDelta = categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
  return categoryDelta || a.source_index - b.source_index;
});

articles.forEach((article, index) => {
  article.source_index = index;
});

writeFileSync(outputPath, `${JSON.stringify(articles, null, 2)}\n`, 'utf8');
console.log(`Generated ${articles.length} wiki articles from staffHandbookCL.md.`);

function normalizeMarkdown(value) {
  return value
    .replace(/^\uFEFF/, '')
    .replace(/\\([!#().\-_=|`*[\]])/g, '$1')
    .replace(/\u01AF/g, 'ff');
}

function cleanHeading(value) {
  return value
    .replace(/\*\*/g, '')
    .replace(/\\/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/:$/, '');
}

function cleanContent(value) {
  return value
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s*#{1,6}\s*$/gm, '')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function uniqueSlug(baseSlug, existing) {
  const fallback = baseSlug || 'article';
  let slug = fallback;
  let suffix = 2;
  const used = new Set(existing.map((article) => article.slug));
  while (used.has(slug)) {
    slug = `${fallback}-${suffix}`;
    suffix += 1;
  }
  return slug;
}

function nextCategory(currentCategory, title) {
  const text = title.toLowerCase();

  if (
    text.includes('part 3') ||
    text.includes('master class') ||
    text.includes('how to write funny') ||
    text.includes('writing songs') ||
    text.includes('songbook') ||
    text === 'campfires'
  ) {
    return 'Campfire & Songbook';
  }

  if (
    text.includes('part 4') ||
    text.includes('required paperwork') ||
    text.includes('packing list') ||
    text.includes('camp lawton summer camp staff') ||
    text.includes('commitment') ||
    text.includes('code of conduct')
  ) {
    return 'Onboarding';
  }

  if (
    text.includes('part 2') ||
    text.includes('severe weather') ||
    text.includes('safeguarding') ||
    text.includes('health and safety') ||
    text.includes('emergencies and other incidents')
  ) {
    return 'Safety & Training';
  }

  if (
    text.includes('policies and procedures') ||
    text.includes('policies, procedures') ||
    text.includes('legal policies') ||
    text.includes('camp opening procedures')
  ) {
    return 'Policies & Procedures';
  }

  if (
    text.includes('part 1') ||
    text.includes('camp staff training and culture') ||
    text.includes('staff expectations') ||
    text.includes('stress management') ||
    text.includes('customer service') ||
    text.includes('how to do your job') ||
    text.includes('communication:')
  ) {
    return 'Introduction & Culture';
  }

  return currentCategory;
}

function inferOfflinePriority(title, content) {
  const text = `${title}\n${content}`.toLowerCase();
  return /(emergency|evac|lightning|missing person|code blue|code brown|fire|bear|injur|fatality|active shooter|armed intruder|mandatory reporting)/.test(text) ? 1 : 0;
}

function buildTags(title, content, category) {
  const text = `${title}\n${content}`.toLowerCase();
  const tags = [category.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')];
  const candidates = [
    ['emergency', /emergency|evac|alarm/],
    ['safeguarding', /safeguarding|youth protection|mandatory reporting/],
    ['weather', /weather|lightning|heat|wind/],
    ['wildlife', /bear|wildlife|smellables/],
    ['training', /training|lesson|teaching|edge/],
    ['policy', /policy|procedure|legal|employment/],
    ['campfire', /campfire|song|skit|ceremon/],
    ['onboarding', /paperwork|packing|conduct|commitment/],
  ];

  for (const [tag, pattern] of candidates) {
    if (pattern.test(text)) tags.push(tag);
  }

  return Array.from(new Set(tags));
}
