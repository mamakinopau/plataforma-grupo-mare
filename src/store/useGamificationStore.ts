import { create } from 'zustand';
import { User, Badge, Level } from '../types';
import { useAuthStore } from './useAuthStore';
import { useDataStore } from './useDataStore';

// Mock Badges
export const BADGES: Badge[] = [
    { id: 'b1', name: 'First Step', description: 'Complete your first course', icon: 'Footprints', category: 'learning', requirementType: 'courses_completed', requirementValue: 1 },
    { id: 'b2', name: 'Dedicated Learner', description: 'Complete 5 courses', icon: 'BookOpen', category: 'learning', requirementType: 'courses_completed', requirementValue: 5 },
    { id: 'b3', name: 'Knowledge Master', description: 'Complete 10 courses', icon: 'Brain', category: 'learning', requirementType: 'courses_completed', requirementValue: 10 },
    { id: 'b4', name: 'Week Streak', description: 'Learn for 7 days in a row', icon: 'Flame', category: 'achievement', requirementType: 'streak_days', requirementValue: 7 },
    { id: 'b5', name: 'Perfect Score', description: 'Get 100% on a quiz', icon: 'Target', category: 'achievement', requirementType: 'perfect_score', requirementValue: 1 },
];

// Levels Configuration
export const LEVELS: Level[] = [
    { level: 1, name: 'Novice', minPoints: 0 },
    { level: 2, name: 'Apprentice', minPoints: 100 },
    { level: 3, name: 'Professional', minPoints: 500 },
    { level: 4, name: 'Expert', minPoints: 1500 },
    { level: 5, name: 'Master', minPoints: 3000 },
    { level: 6, name: 'Legend', minPoints: 5000 },
];

interface GamificationState {
    badges: Badge[];
    levels: Level[];

    // Actions
    addPoints: (userId: string, amount: number) => void;
    checkAchievements: (userId: string) => void;
    updateStreak: (userId: string) => void;
    getLevelInfo: (points: number) => { currentLevel: Level, nextLevel: Level | null, progress: number };
}

export const useGamificationStore = create<GamificationState>((set, get) => ({
    badges: BADGES,
    levels: LEVELS,

    addPoints: (userId, amount) => {
        const { user, login } = useAuthStore.getState();
        if (user && user.id === userId) {
            const newPoints = (user.points || 0) + amount;

            // Check for level up
            const currentLevel = LEVELS.slice().reverse().find(l => newPoints >= l.minPoints) || LEVELS[0];

            // Update user in AuthStore (and DataStore in real app)
            login({ ...user, points: newPoints, level: currentLevel.level });

            // Check for new badges after point increase
            get().checkAchievements(userId);
        }
    },

    updateStreak: (userId) => {
        const { user, login } = useAuthStore.getState();
        if (user && user.id === userId) {
            const today = new Date().toISOString().split('T')[0];
            const lastDate = user.lastLearningDate ? user.lastLearningDate.split('T')[0] : null;

            let newStreak = user.streak || 0;

            if (lastDate === today) {
                // Already learned today, do nothing
                return;
            }

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (lastDate === yesterdayStr) {
                // Continued streak
                newStreak += 1;
            } else {
                // Broken streak or first day
                newStreak = 1;
            }

            login({ ...user, streak: newStreak, lastLearningDate: new Date().toISOString() });
            get().checkAchievements(userId);
        }
    },

    checkAchievements: (userId) => {
        const { user, login } = useAuthStore.getState();
        const { progress } = useDataStore.getState();

        if (!user) return;

        const userBadges = new Set(user.badges || []);
        const userProgress = progress.filter(p => p.userId === userId);
        const completedCourses = userProgress.filter(p => p.status === 'completed').length;
        const perfectScores = userProgress.filter(p => p.score === 100).length;

        let newBadgesFound = false;

        BADGES.forEach(badge => {
            if (userBadges.has(badge.id)) return;

            let earned = false;
            switch (badge.requirementType) {
                case 'courses_completed':
                    earned = completedCourses >= badge.requirementValue;
                    break;
                case 'streak_days':
                    earned = (user.streak || 0) >= badge.requirementValue;
                    break;
                case 'points_earned':
                    earned = (user.points || 0) >= badge.requirementValue;
                    break;
                case 'perfect_score':
                    earned = perfectScores >= badge.requirementValue;
                    break;
            }

            if (earned) {
                userBadges.add(badge.id);
                newBadgesFound = true;
                // Here we could trigger a notification toast
                console.log(`Badge Earned: ${badge.name}`);
            }
        });

        if (newBadgesFound) {
            login({ ...user, badges: Array.from(userBadges) });
        }
    },

    getLevelInfo: (points) => {
        const currentLevelIndex = LEVELS.findIndex(l => points < l.minPoints) - 1;
        // If points are higher than max level, use max level
        const index = currentLevelIndex === -2 ? LEVELS.length - 1 : (currentLevelIndex === -1 ? 0 : currentLevelIndex);

        const currentLevel = LEVELS[index];
        const nextLevel = index < LEVELS.length - 1 ? LEVELS[index + 1] : null;

        let progress = 100;
        if (nextLevel) {
            const range = nextLevel.minPoints - currentLevel.minPoints;
            const gained = points - currentLevel.minPoints;
            progress = Math.min(100, Math.max(0, (gained / range) * 100));
        }

        return { currentLevel, nextLevel, progress };
    }
}));
