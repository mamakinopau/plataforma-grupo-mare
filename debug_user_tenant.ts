import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugData() {
    console.log('--- Debugging User-Tenant Link ---');

    // 1. Fetch Users (Profiles)
    const { data: users, error: userError } = await supabase
        .from('profiles')
        .select('id, name, email, role, tenant_id, avatar_url');

    if (userError) {
        console.error('Error fetching users:', userError);
        return;
    }

    console.log('\nUsers found:', users?.length);
    users?.forEach(u => {
        console.log(`\nUser: ${u.name}`);
        console.log(`Role: ${u.role}`);
        console.log(`TenantID: ${u.tenant_id}`);
        console.log(`Avatar URL: ${u.avatar_url}`);
        if (u.avatar_url) {
            console.log(`   -> Check: ${u.avatar_url.includes('public') ? 'Public URL' : 'Signed/Private URL?'}`);
        }
    });

    // 2. Fetch Tenants
    const { data: tenants, error: tenantError } = await supabase
        .from('tenants')
        .select('id, name, logo_url');

    if (tenantError) {
        console.error('Error fetching tenants:', tenantError);
        return;
    }

    console.log('\nTenants found:', tenants?.length);
    tenants?.forEach(t => {
        console.log(`- Tenant: ${t.name} | ID: ${t.id} | Logo: ${t.logo_url ? 'Present' : 'MISSING'}`);
    });

    // 3. Check for mismatches
    console.log('\n--- Analysis ---');
    users?.forEach(u => {
        if (u.tenant_id) {
            const tenant = tenants?.find(t => t.id === u.tenant_id);
            if (tenant) {
                console.log(`✅ User ${u.name} is linked to valid tenant: ${tenant.name}`);
            } else {
                console.log(`❌ User ${u.name} has TenantID ${u.tenant_id} which was NOT found in tenants table!`);
            }
        } else {
            console.log(`⚠️ User ${u.name} has NO tenant_id.`);
        }
    });
    // Write to JSON file for reliable reading
    fs.writeFileSync('debug_users.json', JSON.stringify(users, null, 2));
    console.log('Dumped users to debug_users.json');
}

debugData();
