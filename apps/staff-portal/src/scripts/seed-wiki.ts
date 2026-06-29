import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

function createSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL is required.');
  }

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required.');
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

async function runSeed() {
  try {
    const supabaseAdmin = createSupabaseAdmin();
    
    let categoriesUpserted = 0;
    let articlesUpserted = 0;
    const errors: Record<string, unknown>[] = [];

    const filePath = path.join(process.cwd(), 'src', 'data', 'wiki_seeded.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const seededArticles = JSON.parse(fileContent);

    const articlesArray: Record<string, unknown>[] = Array.isArray(seededArticles) ? seededArticles : (seededArticles as Record<string, unknown>).default as Record<string, unknown>[] || [];
    const uniqueCategories = Array.from(new Set(articlesArray.map((a: Record<string, unknown>) => a.category as string)));
    for (const catName of uniqueCategories) {
      const { error } = await supabaseAdmin
        .from('content_categories')
        .upsert({ name: catName, description: `Seeded category: ${catName}` }, { onConflict: 'name' });
      
      if (error) {
        errors.push({ type: 'Category Upsert Error', catName, error });
      } else {
        categoriesUpserted++;
      }
    }

    const { data: catData } = await supabaseAdmin.from('content_categories').select('id, name');
    const catMap: Record<string, string> = {};
    catData?.forEach(c => { catMap[c.name] = c.id; });

    for (const article of articlesArray) {
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
        .select('id, admin_edited_at')
        .single();
        
      if (itemError) {
        errors.push({ type: 'Article Upsert Error', slug: article.slug, error: itemError });
        continue;
      }
      
      if (itemData) {
        articlesUpserted++;
        await supabaseAdmin
          .from('content_versions')
          .insert({
            item_id: itemData.id,
            content: article.content,
            version_no: 1
          });
      }
    }

    console.log(`Seeding complete. ${categoriesUpserted} categories and ${articlesUpserted} articles upserted.`);
    if (errors.length > 0) {
      console.warn('Errors encountered:', errors);
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Seed failed:', errorMsg);
  }
}

// Run the seeder function
runSeed();
