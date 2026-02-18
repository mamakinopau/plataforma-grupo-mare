import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with Service Role Key for admin privileges
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// @ts-ignore
export default async function handler(req: any, res: any) {
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
        console.error('Configuration Error:', {
            hasUrl: !!supabaseUrl,
            hasKey: !!supabaseServiceKey
        });
        return res.status(500).json({
            error: 'Missing Supabase configuration',
            details: `URL: ${!!supabaseUrl}, Key: ${!!supabaseServiceKey}`
        });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    try {
        const { email, password, name, role, tenantId, position, userData, options } = req.body;

        if (!email || !password || !tenantId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (options?.sendWelcomeEmail) {
            // Trigger Supabase Reset Password email
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'https://plataforma-grupo-mare.vercel.app/update-password',
            });

            if (resetError) {
                console.warn(`[CreateUser] Failed to send reset password email: ${resetError.message}`);
            } else {
                console.log(`[CreateUser] Reset password email sent to ${email}`);
            }
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
                // Explicitly map known fields only
                onboarding_completed: userData?.onboarding_completed || false,
                // joined_at is not in the schema, we rely on created_at
            });

        if (profileError) {
            // If profile creation fails, we might want to delete the auth user to maintain consistency
            // await supabase.auth.admin.deleteUser(authUser.user.id);
            throw profileError;
        }

        return res.status(200).json({ user: authUser.user, message: 'User created successfully' });

    } catch (error: any) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: error.message || 'An unknown error occurred' });
    }
}
