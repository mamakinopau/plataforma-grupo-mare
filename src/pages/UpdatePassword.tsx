import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

export function UpdatePassword() {
    // const { t } = useTranslation(); // Not used yet
    const navigate = useNavigate();
    const location = useLocation();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Check for hash errors (e.g. link expired)
    useEffect(() => {
        const hash = location.hash;
        if (hash && hash.includes('error_code=otp_expired')) {
            setError('O link de recuperação expirou ou é inválido. Por favor peça um novo.');
        }
        // If we have type=recovery in hash, we are in the right place, 
        // Supabase client might consume it automatically, or we rely on the session being set.
    }, [location]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('As passwords não coincidem.');
            return;
        }

        if (password.length < 6) {
            setError('A password deve ter pelo menos 6 caracteres.');
            return;
        }

        setIsLoading(true);
        console.log('[UpdatePassword] Starting update process...');

        try {
            const { data: { user } } = await supabase.auth.getUser();
            console.log('[UpdatePassword] Current user before update:', user?.id);

            const { data, error } = await supabase.auth.updateUser({
                password: password
            });
            console.log('[UpdatePassword] UpdateUser result:', { data, error });

            if (error) throw error;

            console.log('[UpdatePassword] Success! Redirecting in 3s...');
            setSuccess(true);
            setTimeout(() => {
                console.log('[UpdatePassword] Redirecting now...');
                navigate('/');
            }, 3000);
        } catch (err: any) {
            console.error('[UpdatePassword] Error caught:', err);
            setError(err.message || 'Erro ao atualizar a password.');
        } finally {
            console.log('[UpdatePassword] Finally block reached.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-center mb-6">
                    <div className="bg-primary-100 p-3 rounded-full">
                        <KeyRound className="w-8 h-8 text-primary-600" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                    Definir Nova Password
                </h2>
                <p className="text-center text-gray-500 mb-8">
                    Escolha uma nova password para a sua conta.
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-3 mb-6">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {success ? (
                    <div className="bg-green-50 text-green-600 p-4 rounded-lg flex items-center gap-3 mb-6 text-center flex-col">
                        <CheckCircle2 className="w-8 h-8" />
                        <div>
                            <p className="font-medium">Password atualizada com sucesso!</p>
                            <p className="text-sm mt-1">A redirecionar para a plataforma...</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Nova Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Mínimo 6 caracteres"
                        />
                        <Input
                            label="Confirmar Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Repita a password"
                        />

                        <Button type="submit" className="w-full mt-4" disabled={isLoading || !!error}>
                            {isLoading ? 'A atualizar...' : 'Atualizar Password'}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
