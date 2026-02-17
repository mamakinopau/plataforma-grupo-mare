
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function checkColumns() {
    console.log('Checking columns...');

    // Try to select 'updated_at' column from courses
    const { error: colError } = await supabase.from('courses').select('updated_at').limit(1);
    console.log("Has 'updated_at' column?", !colError ? "YES" : "NO (" + colError.message + ")");
}

checkColumns();
