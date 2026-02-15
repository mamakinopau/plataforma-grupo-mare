import { create } from 'zustand';

type Theme = 'light' | 'dark';
type FontSize = 'small' | 'medium' | 'large';

interface AppearanceState {
    theme: Theme;
    fontSize: FontSize;
    setTheme: (theme: Theme) => void;
    setFontSize: (fontSize: FontSize) => void;
}

export const useAppearanceStore = create<AppearanceState>((set) => ({
    theme: 'light',
    fontSize: 'medium',
    setTheme: (theme) => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        set({ theme });
    },
    setFontSize: (fontSize) => {
        const root = document.documentElement;
        root.classList.remove('text-sm', 'text-base', 'text-lg');
        if (fontSize === 'small') root.classList.add('text-sm');
        if (fontSize === 'medium') root.classList.add('text-base');
        if (fontSize === 'large') root.classList.add('text-lg');
        set({ fontSize });
    },
}));
