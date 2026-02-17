
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function checkStorage() {
    console.log('--- Checking Storage ---');

    // List buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) {
        console.error('Error listing buckets:', listError);
    } else {
        console.log('Buckets found:', buckets.map(b => b.name));

        const bucketName = 'course-content';
        const bucketExists = buckets.some(b => b.name === bucketName);

        if (!bucketExists) {
            console.error(`Bucket '${bucketName}' NOT FOUND.`);
        } else {
            console.log(`Bucket '${bucketName}' exists.`);

            // Try to upload a dummy file
            const fileName = `test-${Date.now()}.txt`;
            const { data, error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(fileName, 'Test content', { upsert: true });

            if (uploadError) {
                console.error(`Upload test to '${bucketName}' FAILED:`, uploadError);
            } else {
                console.log(`Upload test to '${bucketName}' SUCCESS:`, data);

                // Cleanup
                await supabase.storage.from(bucketName).remove([fileName]);
            }
        }
    }
}

checkStorage();
