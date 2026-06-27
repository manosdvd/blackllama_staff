import seededArticles from '@/data/wiki_seeded.json';

export interface SearchResult {
  title: string;
  slug: string;
  category: string;
  snippet: string;
  score: number;
  type: 'emergency' | 'safeguarding' | 'policy' | 'handbook' | 'checklist';
}

/**
 * Searches wiki pages, emergency protocols, and checklists with weighted scores:
 * 1. Emergency (weight = 2.0)
 * 2. Safeguarding (weight = 1.8)
 * 3. Policy (weight = 1.5)
 * 4. Checklist (weight = 1.2)
 * 5. Handbook (weight = 1.0)
 */
export function performWeightedSearch(query: string): SearchResult[] {
  if (!query || query.trim() === '') return [];

  const term = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  // 1. Index wiki articles (Handbook & Policies)
  seededArticles.forEach(art => {
    const titleLower = art.title.toLowerCase();
    const contentLower = art.content.toLowerCase();

    if (titleLower.includes(term) || contentLower.includes(term)) {
      let type: 'emergency' | 'safeguarding' | 'policy' | 'handbook' = 'handbook';
      let multiplier = 1.0;

      const categoryLower = art.category.toLowerCase();
      if (titleLower.includes('emergency') || contentLower.includes('evac') || contentLower.includes('lightning') || contentLower.includes('fire')) {
        type = 'emergency';
        multiplier = 2.0;
      } else if (titleLower.includes('safeguarding') || titleLower.includes('ypt') || titleLower.includes('reporting')) {
        type = 'safeguarding';
        multiplier = 1.8;
      } else if (categoryLower.includes('policy') || titleLower.includes('conduct') || titleLower.includes('dismissal')) {
        type = 'policy';
        multiplier = 1.5;
      }

      // Calculate simple match score
      let score = 0;
      if (titleLower.startsWith(term)) score += 50;
      else if (titleLower.includes(term)) score += 25;
      
      // Word count matches in content
      const occurrences = (contentLower.match(new RegExp(escapeRegExp(term), 'g')) || []).length;
      score += occurrences * 5;

      // Apply multiplier
      score *= multiplier;

      // Generate snippet
      let snippet = art.content.substring(0, 140);
      const termIndex = contentLower.indexOf(term);
      if (termIndex > 40) {
        snippet = '...' + art.content.substring(termIndex - 40, termIndex + 100) + '...';
      }

      results.push({
        title: art.title,
        slug: art.slug,
        category: art.category,
        snippet,
        score,
        type
      });
    }
  });

  // 2. Add static emergency response rules index
  const staticEmergencies = [
    { title: 'Code Red Fire Evacuation Plan', slug: 'fire-evac', category: 'Emergency Protocols', content: 'Ring the dining hall bell continuously or blast airhorn three times. Gather at Parade Ground.', type: 'emergency' as const, multiplier: 2.0 },
    { title: 'Bear & Smellables Rules', slug: 'bear-safety', category: 'Emergency Protocols', content: 'Store food in bear boxes or smellables shed. Never keep food inside tents.', type: 'emergency' as const, multiplier: 2.0 },
    { title: 'Severe Monsoon Lightning Drill', slug: 'monsoon-lightning', category: 'Emergency Protocols', content: 'Take cover in enclosed Dining Hall or Program Offices when thunder sounds under 30s.', type: 'emergency' as const, multiplier: 2.0 }
  ];

  staticEmergencies.forEach(em => {
    const titleLower = em.title.toLowerCase();
    const contentLower = em.content.toLowerCase();

    if (titleLower.includes(term) || contentLower.includes(term)) {
      let score = 30;
      if (titleLower.startsWith(term)) score += 50;
      score *= em.multiplier;

      results.push({
        title: em.title,
        slug: em.slug,
        category: em.category,
        snippet: em.content,
        score,
        type: em.type
      });
    }
  });

  // Sort results by score descending
  return results.sort((a, b) => b.score - a.score);
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
