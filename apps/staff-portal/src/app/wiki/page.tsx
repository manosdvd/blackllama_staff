import { createClient } from '@/utils/supabase/server';
import { WikiClient } from '@/components/wiki/WikiClient';
import { Article } from '@/lib/wiki/idb';

interface ContentCategoryRow {
  name: string | null;
}

interface ContentVersionRow {
  content: string | null;
  version_no: number | null;
}

interface ContentItemRow {
  id: string;
  slug: string;
  title: string;
  section: string | null;
  offline_priority: number | null;
  tags: string[] | null;
  aliases: string[] | null;
  content_categories: ContentCategoryRow | ContentCategoryRow[] | null;
  content_versions: ContentVersionRow | ContentVersionRow[] | null;
}

const firstRelation = <T,>(value: T | T[] | null | undefined): T | null => {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
};

const normalizeContentItem = (row: ContentItemRow): Article => {
  const category = firstRelation(row.content_categories);
  const version = firstRelation(row.content_versions);
  const categoryName = category?.name || 'General';

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: categoryName,
    section: row.section || categoryName,
    content: version?.content || '',
    offline_priority: row.offline_priority ?? 0,
    tags: row.tags || [],
    aliases: row.aliases || [],
    revision_no: version?.version_no || 1,
  };
};

import { cookies } from 'next/headers';

export default async function WikiServerPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('content_items')
    .select(`
      id,
      slug,
      title,
      section,
      offline_priority,
      tags,
      aliases,
      content_categories ( name ),
      content_versions ( content, version_no )
    `);

  let initialArticles: Article[] = [];
  
  if (!error && data) {
    initialArticles = (data as ContentItemRow[]).map(normalizeContentItem);
  } else {
    console.error('Wiki Server fetch error:', error);
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-black text-emerald-950 dark:text-emerald-50 font-heading tracking-tight mb-2">Staff Handbook & Wiki</h1>
        <p className="text-emerald-800 dark:text-emerald-400 font-bold max-w-2xl">
          The official repository of Camp Lawton operational procedures, policies, and campfire culture.
        </p>
      </div>

      <WikiClient initialArticles={initialArticles} />
    </div>
  );
}
