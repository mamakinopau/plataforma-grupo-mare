import { useGamificationStore } from '../../store/useGamificationStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge as BadgeUI } from '../ui/Badge';
import { Trophy, Flame, Star, Lock, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Badge as BadgeType } from '../../types';
import { useTranslation } from 'react-i18next';

export function LevelProgress({ points }: { points: number }) {
    const { getLevelInfo } = useGamificationStore();
    const { currentLevel, nextLevel, progress } = getLevelInfo(points);
    const { t } = useTranslation();

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">{t('gamification.currentLevel')}</span>
                    <div className="flex items-center text-primary-900">
                        <Zap className="w-5 h-5 mr-1 text-yellow-500 fill-yellow-500" />
                        <span className="text-xl font-bold">{currentLevel.name}</span>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-xs text-gray-500">{Math.round(progress)}{t('gamification.toNextLevel')}</span>
                    <p className="text-sm font-medium text-gray-700">{points} / {nextLevel?.minPoints || 'Max'} XP</p>
                </div>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                <div
                    className="h-full bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-1000 ease-out relative"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                </div>
            </div>
        </div>
    );
}

export function StreakCounter({ streak }: { streak: number }) {
    const { t } = useTranslation();
    return (
        <div className="flex items-center space-x-2 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full border border-orange-100">
            <Flame className={cn("w-5 h-5", streak > 0 ? "text-orange-500 fill-orange-500" : "text-gray-300")} />
            <span className="font-bold">{streak} {t('gamification.dayStreak')}</span>
        </div>
    );
}

export function BadgeCard({ badge, earned }: { badge: BadgeType, earned: boolean }) {
    // Dynamic icon mapping could be improved
    const Icon = Star;
    const { t } = useTranslation();

    return (
        <div className={cn(
            "relative flex flex-col items-center p-4 rounded-xl border transition-all text-center group",
            earned
                ? "bg-white border-primary-100 shadow-sm hover:shadow-md hover:border-primary-300"
                : "bg-gray-50 border-gray-100 opacity-60 grayscale"
        )}>
            <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110",
                earned ? "bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-600" : "bg-gray-200 text-gray-400"
            )}>
                {earned ? <Icon className="w-8 h-8" /> : <Lock className="w-6 h-6" />}
            </div>
            <h4 className="font-bold text-gray-900 text-sm mb-1">{badge.name}</h4>
            <p className="text-xs text-gray-500 line-clamp-2">{badge.description}</p>
            {earned && (
                <div className="absolute top-2 right-2">
                    <BadgeUI variant="success" className="text-[10px] px-1.5 py-0 h-5">{t('gamification.earned')}</BadgeUI>
                </div>
            )}
        </div>
    );
}

export function LeaderboardWidget() {
    // Mock leaderboard data
    const leaders = [
        { id: '1', name: 'Maria Silva', points: 3450, avatar: 'https://i.pravatar.cc/150?u=1' },
        { id: '2', name: 'João Santos', points: 3200, avatar: 'https://i.pravatar.cc/150?u=2' },
        { id: '3', name: 'Ana Costa', points: 2900, avatar: 'https://i.pravatar.cc/150?u=3' },
    ];
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center">
                        <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                        {t('leaderboard.topLearners')}
                    </CardTitle>
                    <span className="text-xs text-primary-600 font-medium cursor-pointer hover:underline">{t('leaderboard.viewAll')}</span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {leaders.map((leader, index) => (
                        <div key={leader.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                                    index === 0 ? "bg-yellow-100 text-yellow-700" :
                                        index === 1 ? "bg-gray-100 text-gray-700" :
                                            "bg-orange-50 text-orange-700"
                                )}>
                                    {index + 1}
                                </div>
                                <img src={leader.avatar} alt={leader.name} className="w-8 h-8 rounded-full" />
                                <span className="text-sm font-medium text-gray-900">{leader.name}</span>
                            </div>
                            <span className="text-sm font-bold text-primary-600">{leader.points} XP</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
