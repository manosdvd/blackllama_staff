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

const standaloneExactMatch = new Set([
  'phones',
  'photography and social media',
  'video games and other recreation',
  'drugs, alcohol, pornography',
  'fraternization',
  'severe weather preparedness',
  'lightning safety',
  'heat & thermal stress mitigation',
  'safeguarding youth',
  'mandatory reporting',
  'missing person / code blue',
  'bear & wildlife safety',
  'fire safety',
  'armed intruder / active shooter',
  'fatality protocol',
  'packing list',
  'required paperwork',
  'code of conduct',
  'camp address',
  'catalina council/camp lawton leadership'
]);

const markdown = normalizeMarkdown(readFileSync(handbookPath, 'utf8'));
const lines = markdown.split(/\r?\n/);

const current_section = { level: 0, title: "Root", lines: [], children: [], category: 'Introduction & Culture' };
const stack = [current_section];
let currentCategory = 'Introduction & Culture';

for (let line of lines) {
  const match = /^(#{1,6})\s+(.*)$/.exec(line);
  if (match) {
    const level = match[1].length;
    const title = cleanHeading(match[2]);
    currentCategory = nextCategory(currentCategory, title);
    
    const new_section = { level, title, lines: [], children: [], category: currentCategory, section: 'General' };
    
    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }
    
    if (stack.length > 0) {
      stack[stack.length - 1].children.push(new_section);
    }
    
    stack.push(new_section);
  } else {
    if (stack.length > 0) {
      stack[stack.length - 1].lines.push(line);
    }
  }
}

const articles = [];

function process_node(node, parent_article = null) {
  const titleKey = node.title.toLowerCase();
  const level = node.level;
  
  let is_standalone = false;
  if (level > 0 && level <= 2) {
    is_standalone = true;
  }
  if (standaloneExactMatch.has(titleKey)) {
    is_standalone = true;
  }
  
  if (skipTitles.has(titleKey) || /^part\s+\d+$/i.test(node.title)) {
    is_standalone = false;
  }
  
  if (level === 0) {
    is_standalone = false;
  }

  let current_article = null;
  
  if (is_standalone) {
    current_article = {
      title: node.title,
      category: node.category,
      section: node.section || 'General',
      content: node.lines.join('\n').trim(),
      slug: null, // assigned later
    };
    articles.push(current_article);
    
    if (parent_article) {
      parent_article.content += `\n\n[[${node.title}]]\n\n`;
    }
  } else {
    if (parent_article && level > 0) {
      parent_article.content += `\n\n${'#'.repeat(level)} ${node.title}\n`;
      parent_article.content += node.lines.join('\n').trim();
    }
  }
  
  for (const child of node.children) {
    if (!is_standalone && level > 0) {
      child.section = node.title;
    } else if (parent_article) {
      child.section = node.section;
    } else {
      child.section = child.title;
    }
    process_node(child, is_standalone ? current_article : parent_article);
  }
}

process_node(current_section);

// Clean up contents and metadata
for (let article of articles) {
  article.content = cleanContent(article.content);
  article.slug = uniqueSlug(slugify(article.title), articles);
  article.offline_priority = inferOfflinePriority(article.title, article.content);
  article.tags = buildTags(article.title, article.content, article.category);
  article.aliases = buildAliases(article.title, article.content);
  article.revision_no = 1;
}

// Remove empty articles
const validArticles = articles.filter(a => a.content && a.content.length >= 12);

validArticles.sort((a, b) => {
  const categoryDelta = categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
  return categoryDelta || 0; // maintain relative order inside categories
});

validArticles.forEach((article, index) => {
  article.source_index = index;
});

writeFileSync(outputPath, JSON.stringify(validArticles, null, 2) + '\n', 'utf8');
console.log(`Generated ${validArticles.length} wiki articles from staffHandbookCL.md.`);

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
  const used = new Set(existing.map((article) => article.slug).filter(Boolean));
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

function buildAliases(title, content) {
  const text = `${title}\n${content}`.toLowerCase();
  const aliases = [];
  
  const rules = [
    ['missing person', ['code blue', 'lost scout']],
    ['safeguarding youth', ['youth protection', 'ypt', 'abuse']],
    ['medical', ['first aid', 'injury', 'health lodge']],
    ['severe weather', ['monsoon', 'lightning', 'thunderstorm']],
    ['phones', ['cell phone', 'reception', 'wifi']],
    ['fire safety', ['code red', 'wildfire', 'evacuation']],
  ];

  for (const [key, related] of rules) {
    if (text.includes(key)) {
      aliases.push(...related);
    }
  }

  return Array.from(new Set(aliases));
}
