import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with Service Role Key for admin privileges
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
    // CORS policies
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!supabaseUrl || !supabaseServiceKey) {
        return res.status(500).json({ error: 'Missing Supabase configuration' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    try {
        const { email, password, name, role, tenantId, position, userData } = req.body;

        if (!email || !password || !tenantId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // 1. Create user in Supabase Auth
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm email
            user_metadata: { name, role, tenantId }
        });

        if (authError) throw authError;

        // 2. Create profile in public.profiles
        // Note: The trigger might handle this automatically if configured, 
        // but explicit insertion ensures data consistency with the specific fields we want.
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: authUser.user.id,
                email,
                name,
                role,
                tenant_id: tenantId,
                position: position || '',
                is_active: true,
                // Add other fields from userData if present
                ...userData
            });

        if (profileError) {
            // If profile creation fails, we might want to delete the auth user to maintain consistency
            // await supabase.auth.admin.deleteUser(authUser.user.id);
            throw profileError;
        }

        return res.status(200).json({ user: authUser.user, message: 'User created successfully' });

    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: error.message });
    }
}
