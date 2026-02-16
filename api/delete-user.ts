import { createClient } from '@supabase/supabase-js';

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

    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!supabaseUrl || !supabaseServiceKey) {
        return res.status(500).json({ error: 'Missing Supabase configuration' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }

        // Delete user from Supabase Auth
        const { error: authError } = await supabase.auth.admin.deleteUser(userId);

        if (authError) throw authError;

        // Profiles should cascade delete, but we can return success
        return res.status(200).json({ message: 'User deleted successfully' });

    } catch (error: any) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ error: error.message || 'An unknown error occurred' });
    }
}
