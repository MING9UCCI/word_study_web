import React from 'react';
import { BarChart, Activity, BookOpen, CheckCircle, TrendingUp, Award, Trophy, Flame, Star } from 'lucide-react';

export const Dashboard = ({ words, groups }) => {
    // Calculate stats
    const totalWords = words.length;
    const masteredWords = words.filter(w => (w.level || 0) >= 5 || w.memorized).length;
    const learningWords = words.filter(w => (w.level || 0) > 0 && (w.level || 0) < 5).length;
    const newWords = totalWords - masteredWords - learningWords;

    // Calculate streak (mock implementation for now, real one would need daily tracking)
    // For now, we'll just show words added today as a "streak" of activity
    const today = new Date().setHours(0, 0, 0, 0);
    const wordsAddedToday = words.filter(w => w.createdAt >= today).length;

    // Define achievements
    const achievements = [
        {
            id: 'rookie',
            name: '초보자',
            description: '단어 10개 추가',
            icon: Star,
            unlocked: totalWords >= 10,
            progress: Math.min(totalWords, 10),
            max: 10,
            color: 'text-yellow-600',
            bg: 'bg-yellow-100 dark:bg-yellow-900/30'
        },
        {
            id: 'scholar',
            name: '학자',
            description: '단어 50개 마스터',
            icon: Trophy,
            unlocked: masteredWords >= 50,
            progress: Math.min(masteredWords, 50),
            max: 50,
            color: 'text-purple-600',
            bg: 'bg-purple-100 dark:bg-purple-900/30'
        },
        {
            id: 'consistent',
            name: '꾸준이',
            description: '3일 연속 학습',
            icon: Flame,
            unlocked: wordsAddedToday >= 3,
            progress: Math.min(wordsAddedToday, 3),
            max: 3,
            color: 'text-orange-600',
            bg: 'bg-orange-100 dark:bg-orange-900/30'
        },
        {
            id: 'dedicated',
            name: '헌신가',
            description: '단어 100개 추가',
            icon: Award,
            unlocked: totalWords >= 100,
            progress: Math.min(totalWords, 100),
            max: 100,
            color: 'text-blue-600',
            bg: 'bg-blue-100 dark:bg-blue-900/30'
        }
    ];

    const stats = [
        {
            label: 'Total Words',
            value: totalWords,
            icon: BookOpen,
            color: 'text-blue-600',
            bg: 'bg-blue-100 dark:bg-blue-900/30'
        },
        {
            label: 'Mastered',
            value: masteredWords,
            icon: CheckCircle,
            color: 'text-green-600',
            bg: 'bg-green-100 dark:bg-green-900/30'
        },
        {
            label: 'Learning',
            value: learningWords,
            icon: Activity,
            color: 'text-orange-600',
            bg: 'bg-orange-100 dark:bg-orange-900/30'
        },
        {
            label: 'New',
            value: newWords,
            icon: BarChart,
            color: 'text-purple-600',
            bg: 'bg-purple-100 dark:bg-purple-900/30'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
                <div className="flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                    <TrendingUp className="h-4 w-4" />
                    <span>Activity Today: {wordsAddedToday}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-gray-800">
                        <div className={`mb-3 inline-flex rounded-xl p-3 ${stat.bg}`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Achievements Section */}
            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">업적</h3>
                <div className="grid grid-cols-2 gap-4">
                    {achievements.map(achievement => (
                        <div
                            key={achievement.id}
                            className={`rounded-xl p-4 transition-all ${achievement.unlocked
                                    ? achievement.bg + ' border-2 border-current'
                                    : 'bg-gray-100 dark:bg-gray-700 opacity-60'
                                }`}
                        >
                            <div className="flex flex-col items-center text-center">
                                <achievement.icon
                                    className={`h-8 w-8 mb-2 ${achievement.unlocked ? achievement.color : 'text-gray-400'
                                        }`}
                                />
                                <p className={`text-sm font-bold ${achievement.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500'
                                    }`}>
                                    {achievement.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {achievement.description}
                                </p>
                                <div className="mt-2 w-full">
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                                        <div
                                            className={`h-full transition-all duration-500 ${achievement.unlocked ? 'bg-green-500' : 'bg-gray-400'
                                                }`}
                                            style={{ width: `${(achievement.progress / achievement.max) * 100}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {achievement.progress} / {achievement.max}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Collection Stats</h3>
                <div className="space-y-4">
                    {groups.map(group => {
                        const groupWords = words.filter(w => w.groupId === group.id);
                        const groupMastered = groupWords.filter(w => (w.level || 0) >= 5 || w.memorized).length;
                        const progress = groupWords.length > 0 ? (groupMastered / groupWords.length) * 100 : 0;

                        return (
                            <div key={group.id} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">{group.name}</span>
                                    <span className="text-gray-500">{groupMastered} / {groupWords.length}</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                                    <div
                                        className="h-full bg-blue-500 transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
