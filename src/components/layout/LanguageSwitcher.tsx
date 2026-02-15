import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'pt' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900"
        >
            <Globe className="w-4 h-4" />
            <span className="uppercase font-medium">{i18n.language === 'pt' ? 'PT' : 'EN'}</span>
        </Button>
    );
}
