import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log("=== DB Diagnostics ===");
  
  // Check wiki categories
  const { data: cats, error: errCat } = await supabase.from('content_categories').select('id, name');
  if (errCat) console.error("Error fetching categories:", errCat.message);
  else console.log(`Wiki Categories: ${cats?.length || 0} found`);

  // Check wiki items
  const { data: items, error: errItems } = await supabase.from('content_items').select('id, title, is_published');
  if (errItems) console.error("Error fetching items:", errItems.message);
  else {
    console.log(`Wiki Items: ${items?.length || 0} found`);
    if (items && items.length > 0) {
      console.log(`Sample item: ${items[0].title} (Published: ${items[0].is_published})`);
    }
  }

  // Check users (Auth)
  const { data: users, error: errUsers } = await supabase.auth.admin.listUsers();
  if (errUsers) console.error("Error fetching users:", errUsers.message);
  else console.log(`Registered Users: ${users?.users.length || 0} found`);

  console.log("======================");
}

checkDatabase();
