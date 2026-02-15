import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AnnouncementBanner } from '../communication/AnnouncementBanner';
import { cn } from '../../lib/utils';
import { useAppearanceStore } from '../../store/useAppearanceStore';

export function Layout() {
    const { theme, fontSize } = useAppearanceStore();

    const fontClass = fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-lg' : 'text-base';

    return (
        <div className={cn(
            "min-h-screen flex transition-colors duration-300",
            theme === 'dark' ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900",
            fontClass
        )}>
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden ml-64">
                <Header />
                <AnnouncementBanner />
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
