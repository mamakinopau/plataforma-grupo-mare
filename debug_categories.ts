
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function checkCategories() {
    console.log('--- Checking Categories ---');
    const { data: categories, error } = await supabase.from('categories').select('*');
    if (error) {
        console.error('Error fetching categories:', error);
    } else {
        console.log(`Found ${categories?.length} categories:`);
        categories?.forEach(c => console.log(`- [${c.id}] ${c.name}`));
    }
}

checkCategories();
