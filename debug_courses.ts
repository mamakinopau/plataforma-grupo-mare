
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

    // 1. Fetching existing courses
    console.log('\n1. Fetching existing courses...');
    const { data: courses, error: readError } = await supabase
        .from('courses')
        .select('*')
        .limit(5);

    if (readError) {
        console.error('Error fetching courses:', readError);
    } else {
        console.log(`Found ${courses.length} courses.`);
    }

    // 2. Try to insert a dummy course (Write access) using snake_case
    console.log('\n2. Attempting to insert a dummy course (snake_case)...');

    // Using a known valid category ID 'food_safety' to test FK constraint
    const dummyCourse = {
        title: 'Debug Course ' + new Date().toISOString(),
        description: 'Created by debug script',
        category_id: 'food_safety',
        duration_minutes: 60,
        is_mandatory: false,
        target_roles: ['employee'],
        status: 'draft',
        sections: [],
        thumbnail_url: 'https://via.placeholder.com/150'
    };

    const { data: newCourse, error: insertError } = await supabase
        .from('courses')
        .insert(dummyCourse)
        .select()
        .single();

    const fs = await import('fs');

    if (insertError) {
        console.error('Insert failed:', insertError);
        fs.writeFileSync('debug_result.txt', 'Insert failed: ' + JSON.stringify(insertError, null, 2));
    } else {
        console.log('Insert success:', newCourse);
        fs.writeFileSync('debug_result.txt', 'Insert success: ' + JSON.stringify(newCourse, null, 2));

        // Cleanup
        console.log('Cleaning up...');
        await supabase.from('courses').delete().eq('id', newCourse.id);
    }
}

testCourses();
