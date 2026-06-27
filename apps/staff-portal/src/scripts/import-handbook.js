const fs = require('fs');
const path = require('path');

// Simple custom env loader to avoid external dependencies
function loadEnv() {
  const envPath = path.join(__dirname, '../../.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach(line => {
      const match = line.trim().match(/^([\w\-]+)\s*=\s*(.*)$/);
      if (match) {
        let val = match[2].trim();
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.slice(1, -1);
        }
        process.env[match[1]] = val;
      }
    });
  }
}
loadEnv();

const { createClient } = require('@supabase/supabase-js');

// Paths
const sourceJsonPath = path.join(__dirname, '../../../../parsed_handbook.json');
const fallbackDataPath = path.join(__dirname, '../data/wiki_seeded.json');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function run() {
  console.log('--- CAMP LAWTON STRUCTURED HANDBOOK IMPORTER ---');
  
  // 1. Read source JSON
  if (!fs.existsSync(sourceJsonPath)) {
    console.error(`Error: Source JSON file not found at ${sourceJsonPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(sourceJsonPath, 'utf8');
  let handbookData;
  try {
    handbookData = JSON.parse(rawData);
  } catch (err) {
    console.error('Error: Failed to parse source JSON file:', err.message);
    process.exit(1);
  }

  // 2. Validate top-level structure
  if (!handbookData || !Array.isArray(handbookData.sections)) {
    console.error('Error: Invalid JSON structure. Must contain a top-level "sections" array.');
    process.exit(1);
  }

  console.log(`Successfully loaded ${handbookData.sections.length} raw sections.`);

  const importedItems = [];
  const categorySet = new Set();
  let skippedCount = 0;

  // 3. Parse and structure raw sections
  for (let idx = 0; idx < handbookData.sections.length; idx++) {
    const sec = handbookData.sections[idx];
    
    // Skip empty or invalid records
    if (!sec.content || (!sec.h1 && !sec.h3)) {
      skippedCount++;
      continue;
    }

    // Convert keys into readable title
    const title = cleanText(sec.h3 || sec.h2 || sec.h1 || `Section ${idx + 1}`);
    const categoryName = inferCategory(sec.h1, title);
    categorySet.add(categoryName);

    // Create stable slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Infer content type and offline priority
    const offlinePriority = inferOfflinePriority(categoryName, title);

    importedItems.push({
      slug,
      title,
      content: cleanMarkdown(sec.content),
      category: categoryName,
      offline_priority: offlinePriority,
      source_index: idx
    });
  }

  console.log(`Parsed ${importedItems.length} valid content items (Skipped: ${skippedCount}).`);

  // Verify and ensure target directory exists for static seeding
  const dataDir = path.dirname(fallbackDataPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // 4. Save to static fallback JSON
  fs.writeFileSync(fallbackDataPath, JSON.stringify(importedItems, null, 2), 'utf8');
  console.log(`Saved static wiki seeding backup to: ${fallbackDataPath}`);

  // 5. Try uploading to Supabase if configured
  if (supabaseUrl && (supabaseServiceKey || supabaseAnonKey)) {
    const keyToUse = supabaseServiceKey || supabaseAnonKey;
    console.log(`Connecting to Supabase at: ${supabaseUrl}...`);
    const supabase = createClient(supabaseUrl, keyToUse);

    try {
      // Create a default season first
      const { data: seasonData, error: seasonErr } = await supabase
        .from('seasons')
        .upsert({ year: 2026, active: true, start_date: '2026-06-01', end_date: '2026-08-15' }, { onConflict: 'year' })
        .select()
        .single();

      if (seasonErr) throw seasonErr;
      console.log(`Validated season metadata: Year ${seasonData.year}`);

      // Insert categories
      for (const cat of Array.from(categorySet)) {
        await supabase
          .from('content_categories')
          .upsert({ name: cat, description: `${cat} handbook category.` }, { onConflict: 'name' });
      }

      // Fetch created categories to map IDs
      const { data: dbCats } = await supabase.from('content_categories').select('*');
      const catMap = {};
      dbCats.forEach(c => { catMap[c.name] = c.id; });

      // Upsert content items and versions
      let databaseSuccessCount = 0;
      for (const item of importedItems) {
        const categoryId = catMap[item.category] || null;
        
        const { data: contentItem, error: itemErr } = await supabase
          .from('content_items')
          .upsert({
            slug: item.slug,
            title: item.title,
            category_id: categoryId,
            is_published: true,
            offline_priority: item.offline_priority
          }, { onConflict: 'slug' })
          .select()
          .single();

        if (itemErr) {
          console.warn(`Warning: Failed to insert content item "${item.title}":`, itemErr.message);
          continue;
        }

        // Add version entry
        await supabase
          .from('content_versions')
          .insert({
            item_id: contentItem.id,
            content: item.content,
            version_no: 1
          });

        databaseSuccessCount++;
      }

      console.log(`--- DATABASE IMPORT REPORT ---`);
      console.log(`Successfully synchronized ${databaseSuccessCount} of ${importedItems.length} items directly to Supabase.`);
    } catch (dbErr) {
      console.warn('Supabase DB connection failed/bypassed. Static JSON caching will serve client requests.', dbErr.message);
    }
  } else {
    console.log('Supabase credentials not configured in environment. App will boot using the seeded JSON payload.');
  }
}

// Helpers
function cleanText(txt) {
  if (!txt) return '';
  return txt.replace(/\*\*/g, '').replace(/\\/g, '').trim();
}

function cleanMarkdown(md) {
  if (!md) return '';
  return md
    .replace(/\\!/g, '!')
    .replace(/\\\-/g, '-')
    .replace(/\\_/g, '_')
    .replace(/\\`/g, '`')
    .trim();
}

function inferCategory(h1, title) {
  const check = (h1 || title || '').toLowerCase();
  if (check.includes('training') || check.includes('safety') || check.includes('quiz')) {
    return 'Safety & Training';
  }
  if (check.includes('policy') || check.includes('procedure') || check.includes('conduct') || check.includes('standard')) {
    return 'Policies & Procedures';
  }
  if (check.includes('song') || check.includes('songbook') || check.includes('campfire') || check.includes('music')) {
    return 'Campfire & Songbook';
  }
  if (check.includes('onboarding') || check.includes('application') || check.includes('form')) {
    return 'Onboarding';
  }
  return 'Introduction & Culture';
}

function inferOfflinePriority(category, title) {
  const check = (category + ' ' + title).toLowerCase();
  // Essential emergency plans or evacuation routines get high priority
  if (check.includes('emergency') || check.includes('fire') || check.includes('lightning') || check.includes('evac') || check.includes('bear') || check.includes('lost')) {
    return 1;
  }
  return 0;
}

run();
