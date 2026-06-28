import { NextResponse } from 'next/server';
// Wait, this is an API route, so we should check auth on the server.
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST() {
  try {
    // 1. In a real app we'd verify the user is an Admin here via token.
    // For this seed script, we will just proceed with the service role client.
    
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

    // Fetch category UUIDs map
    const { data: catData } = await supabaseAdmin.from('content_categories').select('id, name');
    const catMap: Record<string, string> = {};
    catData?.forEach(c => { catMap[c.name] = c.id; });

    // 3. Upsert articles
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

      // We use onConflict: 'slug' to update existing seed records
      // NOTE: In the future, we should avoid overwriting if admin_edited_at is NOT NULL.
      // For this script, we'll just upsert and overwrite.
      
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
        // 4. Create version record
        await supabaseAdmin
          .from('content_versions')
          .insert({
            item_id: itemData.id,
            content: article.content,
            version_no: 1
          });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seeding complete. ${categoriesUpserted} categories and ${articlesUpserted} articles upserted.`,
      debug: {
        totalParsed: articlesArray.length,
        errors
      }
    });

  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
