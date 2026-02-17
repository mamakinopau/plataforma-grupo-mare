
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function checkColumns() {
    console.log('Checking columns...');

    // Try to select 'category_id' column from courses
    // We want to know the TYPE. We can infer it by trying to filter with a string.
    const { error: typeError } = await supabase.from('courses').select('id').eq('category_id', 'test-string').limit(1);
    console.log("Can compare category_id with string?", !typeError ? "YES" : "NO (" + typeError.message + ")");
}

checkColumns();
