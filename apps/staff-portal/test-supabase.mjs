import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import WebSocket from 'ws';
globalThis.WebSocket = WebSocket;

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || ''
);

async function seed() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'wiki_seeded.json');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const seededArticles = JSON.parse(fileContent);
  let categoriesUpserted = 0;
  let articlesUpserted = 0;

  console.log('seededArticles length:', seededArticles.length);

  const uniqueCategories = Array.from(new Set(seededArticles.map(a => a.category)));
  for (const catName of uniqueCategories) {
    const { error } = await supabaseAdmin
      .from('content_categories')
      .upsert({ name: catName, description: `Seeded category: ${catName}` }, { onConflict: 'name' });
    if (error) console.error('Category Upsert Error:', error);
    else categoriesUpserted++;
  }

  const { data: catData } = await supabaseAdmin.from('content_categories').select('id, name');
  const catMap = {};
  catData?.forEach(c => { catMap[c.name] = c.id; });

  for (const article of seededArticles) {
    const categoryId = catMap[article.category];
    const itemPayload = {
      slug: article.slug,
      title: article.title,
      category_id: categoryId,
      is_published: true,
      offline_priority: article.offline_priority || 0,
      section: article.section || 'General',
      tags: article.tags || [],
      aliases: article.aliases || [],
      source_key: article.slug,
    };
    const { data: itemData, error: itemError } = await supabaseAdmin
      .from('content_items')
      .upsert(itemPayload, { onConflict: 'slug', ignoreDuplicates: false })
      .select('id').single();
    if (itemError) {
      console.error(`Article Upsert Error [${article.slug}]:`, itemError);
      continue;
    }
    const versionPayload = {
      item_id: itemData.id,
      version_no: article.revision_no || 1,
      content: article.content
    };
    await supabaseAdmin.from('content_versions').delete().eq('item_id', itemData.id);
    const { error: versionError } = await supabaseAdmin
      .from('content_versions')
      .insert(versionPayload);
    if (versionError) console.error(`Version Upsert Error [${article.slug}]:`, versionError);
    else articlesUpserted++;
  }
  console.log(`Seeding complete. ${categoriesUpserted} categories and ${articlesUpserted} articles upserted.`);
}

seed();
