
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCourses() {
    console.log('--- Testing Courses ---');

    const email = 'pedron252@gmail.com'; // Use a known admin email if possible, or just check public access

    // 1. Try to fetch courses (Read access)
    console.log('\n1. Fetching existing courses...');
    const { data: courses, error: readError } = await supabase
        .from('courses')
        .select('*')
        .limit(5);

    if (readError) {
        console.error('Error fetching courses:', readError);
    } else {
        console.log(`Found ${courses.length} courses.`);
        if (courses.length > 0) {
            console.log('Sample course keys:', Object.keys(courses[0]));
        }
    }

    /*
    // 2. Try to insert a dummy course (Write access) using snake_case
    console.log('\n2. Attempting to insert a dummy course (snake_case)...');
    const dummyCourse = {
        title: 'Debug Course ' + new Date().toISOString(),
        description: 'Created by debug script',
        category: 'general', // valid category?
        duration_minutes: 60,
        is_mandatory: false,
        target_roles: ['employee'],
        status: 'draft',
        sections: [],
        thumbnail_url: 'https://via.placeholder.com/150'
    };

    // We need to be signed in as admin to likely succeed. 
    // This script runs as ANON which might fail if RLS is strict.
    // Ideally we should use SERVICE_ROLE key for setup, but we want to test USER access.
    // For now, let's see if we get RLS error or Schema error.

    const { data: newCourse, error: insertError } = await supabase
        .from('courses')
        .insert(dummyCourse)
        .select()
        .single();

    if (insertError) {
        console.error('Insert failed:', insertError);
    } else {
        console.log('Insert success:', newCourse);

        // Cleanup
        console.log('Cleaning up...');
        await supabase.from('courses').delete().eq('id', newCourse.id);
    }
    */
}

testCourses();
