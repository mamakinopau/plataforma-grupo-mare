import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';

export function AccessDenied() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-4">
            <div className="bg-red-50 p-4 rounded-full mb-4">
                <ShieldAlert className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('common.accessDenied')}</h1>
            <p className="text-gray-500 max-w-md mb-6">
                {t('common.accessDeniedMessage') || "You don't have permission to access this page. Please contact your administrator if you believe this is an error."}
            </p>
            <Button onClick={() => navigate('/')}>
                {t('common.backToDashboard')}
            </Button>
        </div>
    );
}
