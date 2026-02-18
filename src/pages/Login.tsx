import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export function Login() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Safety net: If user is redirected to login with a recovery hash, send them to update-password
    useEffect(() => {
        if (window.location.hash && window.location.hash.includes('type=recovery')) {
            navigate('/update-password');
        }
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Falha no login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <img src="/logo.png" alt="Grupo Mare" className="h-24 w-auto object-contain" />
                    </div>
                    <CardTitle className="text-2xl text-primary-900">Entrar na Plataforma</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2"
                                placeholder="seu@email.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2"
                                placeholder="••••••••"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'A entrar...' : 'Entrar'}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm text-gray-500">
                        <p>Ainda não tem conta? Contacte o administrador.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
