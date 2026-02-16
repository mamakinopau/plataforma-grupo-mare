
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function checkColumns() {
    console.log('Checking columns...');

    // Try to select 'category'
    const { error: catError } = await supabase.from('courses').select('category').limit(1);
    console.log("Has 'category'?", !catError ? "YES" : "NO (" + catError.message + ")");

    // Try to select 'category_id'
    const { error: catIdError } = await supabase.from('courses').select('category_id').limit(1);
    console.log("Has 'category_id'?", !catIdError ? "YES" : "NO (" + catIdError.message + ")");
}

checkColumns();
