import React from 'react';
import { BarChart, Activity, BookOpen, CheckCircle, TrendingUp, Award, Trophy, Flame, Star, Clock, Globe } from 'lucide-react';

export const Dashboard = ({ words, groups }) => {
    // Basic stats
    const totalWords = words.length;
    const masteredWords = words.filter(w => (w.level || 0) >= 5 || w.memorized).length;
    const learningWords = words.filter(w => {
        const level = w.level || 0;
        return level > 0 && level < 5 && !w.memorized;
    }).length;
    
    // Calculate Review Queue (Words due for SRS review)
    const now = Date.now();
    const reviewQueueCount = words.filter(w => 
        !w.memorized && (w.level || 0) > 0 && (w.nextReview || 0) <= now
    ).length;

    // Calculate Language Balance
    const chineseWordsCount = words.filter(w => /[\u4e00-\u9fa5]/.test(w.english)).length;
    const englishWordsCount = totalWords - chineseWordsCount;
    const zhPercentage = totalWords > 0 ? Math.round((chineseWordsCount / totalWords) * 100) : 0;
    const enPercentage = totalWords > 0 ? Math.round((englishWordsCount / totalWords) * 100) : 0;

    // Calculate Weekly Activity History (Last 7 days)
    const last7Days = [...Array(7)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
    }).reverse();

    const activityHistory = last7Days.map(dayTimestamp => {
        const dayEnd = dayTimestamp + 24 * 60 * 60 * 1000;
        const count = words.filter(w => w.createdAt >= dayTimestamp && w.createdAt < dayEnd).length;
        const mastered = words.filter(w => w.masteredAt >= dayTimestamp && w.masteredAt < dayEnd).length;
        return { 
            name: new Date(dayTimestamp).toLocaleDateString('ko-KR', { weekday: 'short' }),
            count,
            mastered
        };
    });

    const maxActivity = Math.max(...activityHistory.map(d => d.count), 5);

    // Get recently mastered words
    const recentlyMastered = words
        .filter(w => (w.level || 0) >= 5 || w.memorized)
        .sort((a, b) => (b.masteredAt || 0) - (a.masteredAt || 0))
        .slice(0, 3);

    const stats = [
        {
            label: '총 단어',
            value: totalWords,
            icon: BookOpen,
            color: 'text-blue-600',
            bg: 'bg-blue-100 dark:bg-blue-900/30'
        },
        {
            label: '마스터',
            value: masteredWords,
            icon: CheckCircle,
            color: 'text-green-600',
            bg: 'bg-green-100 dark:bg-green-900/30'
        },
        {
            label: '지금 복습 필요',
            value: reviewQueueCount,
            icon: Clock,
            color: 'text-red-500',
            bg: 'bg-red-100 dark:bg-red-900/30',
            urgent: reviewQueueCount > 0
        },
        {
            label: '학습 중',
            value: learningWords,
            icon: Activity,
            color: 'text-orange-600',
            bg: 'bg-orange-100 dark:bg-orange-900/30'
        }
    ];

    return (
        <div className="space-y-6 pb-10">
            {/* Header with Activity Alert */}
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Dashboard</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Keep up the great progress!</p>
                </div>
                {reviewQueueCount > 0 && (
                    <div className="flex animate-pulse items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-red-500/30">
                        <TrendingUp className="h-4 w-4" />
                        <span>지금 {reviewQueueCount}개의 단어 복습이 필요합니다!</span>
                    </div>
                )}
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className={`rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-gray-800 ${stat.urgent ? 'border-red-200 ring-2 ring-red-100' : 'border-transparent'}`}>
                        <div className={`mb-3 inline-flex rounded-2xl p-3 ${stat.bg}`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{stat.label}</p>
                        <p className={`text-3xl font-black ${stat.urgent ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Analysis Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Activity Graph */}
                <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">주간 학습 활동</h3>
                        <Activity className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex h-48 items-end justify-between gap-2 px-2">
                        {activityHistory.map((day, i) => (
                            <div key={i} className="flex flex-1 flex-col items-center gap-2">
                                <div className="relative flex w-full flex-1 items-end justify-center px-1">
                                    <div 
                                        className="w-full rounded-t-lg bg-blue-500 opacity-80 transition-all duration-500 hover:opacity-100"
                                        style={{ height: `${(day.count / maxActivity) * 100}%`, minHeight: day.count > 0 ? '4px' : '0' }}
                                    >
                                        {day.count > 0 && (
                                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                                                {day.count}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-gray-400">{day.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Language Balance */}
                <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">언어별 비중</h3>
                        <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex h-full flex-col justify-center space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                                    <span className="text-sm font-bold text-gray-600 dark:text-gray-300">English</span>
                                </div>
                                <span className="text-sm font-black text-gray-900 dark:text-white">{enPercentage}%</span>
                            </div>
                            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                                <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${enPercentage}%` }} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-red-500" />
                                    <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Chinese</span>
                                </div>
                                <span className="text-sm font-black text-gray-900 dark:text-white">{zhPercentage}%</span>
                            </div>
                            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                                <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${zhPercentage}%` }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recently Mastered */}
            {recentlyMastered.length > 0 && (
                <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white shadow-xl">
                    <div className="mb-4 flex items-center gap-2">
                        <Award className="h-6 w-6 text-yellow-300" />
                        <h3 className="text-xl font-bold">최근에 마스터한 단어</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {recentlyMastered.map(word => (
                            <div key={word.id} className="rounded-2xl bg-white/20 px-4 py-2 backdrop-blur-md">
                                <span className="block text-sm font-black">{word.english}</span>
                                <span className="text-xs text-indigo-100">{word.korean}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Collection Progress List (Compact) */}
            <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-800">
                <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">폴더별 진행도</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    {groups.map(group => {
                        const groupWords = words.filter(w => w.groupId === group.id);
                        const groupMastered = groupWords.filter(w => (w.level || 0) >= 5 || w.memorized).length;
                        const progress = groupWords.length > 0 ? (groupMastered / groupWords.length) * 100 : 0;

                        return (
                            <div key={group.id} className="group flex flex-col gap-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-bold text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors">{group.name}</span>
                                    <span className="font-medium text-gray-400">{groupMastered} / {groupWords.length}</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-1000 group-hover:from-blue-500 group-hover:to-blue-700"
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

