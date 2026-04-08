import React, { useState, useMemo } from 'react';
import { Trash2, Volume2, Pencil, Check, X, Search, SortAsc, Clock, AlertTriangle, Copy, TrendingUp } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';
import { getNormalizedKey } from '../utils/wordUtils';

export const WordList = ({ words, groups, onDelete, onEdit, ttsSettings }) => {
    const { speak } = useSpeech();
    const [editingId, setEditingId] = useState(null);
    const [editEnglish, setEditEnglish] = useState('');
    const [editPronunciation, setEditPronunciation] = useState('');
    const [editKorean, setEditKorean] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('latest'); // 'latest' | 'alphabetical' | 'mastery'
    const [showDuplicatesOnly, setShowDuplicatesOnly] = useState(false);

    const startEdit = (word) => {
        setEditingId(word.id);
        setEditEnglish(word.english);
        setEditPronunciation(word.pronunciation || '');
        setEditKorean(word.korean);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditEnglish('');
        setEditPronunciation('');
        setEditKorean('');
    };

    const saveEdit = (id) => {
        if (editEnglish.trim() && editKorean.trim()) {
            onEdit(id, editEnglish, editKorean, editPronunciation);
            setEditingId(null);
        }
    };

    const filteredWords = words.filter(word => {
        const query = searchTerm.toLowerCase();
        const groupName = groups?.find(g => g.id === word.groupId)?.name || '';
        return (
            word.english.toLowerCase().includes(query) ||
            word.korean.includes(query) ||
            (word.pronunciation && word.pronunciation.toLowerCase().includes(query)) ||
            groupName.toLowerCase().includes(query)
        );
    });

    const sortedWords = useMemo(() => {
        let result = [...filteredWords];

        // Apply sorting
        if (showDuplicatesOnly) {
            result.sort((a, b) => a.english.localeCompare(b.english, undefined, { sensitivity: 'base' }));
        } else if (sortBy === 'alphabetical') {
            result.sort((a, b) => a.english.localeCompare(b.english, undefined, { sensitivity: 'base' }));
        } else if (sortBy === 'mastery') {
            result.sort((a, b) => (a.level || 0) - (b.level || 0));
        } else {
            result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        }

        // Dedicated duplicate detection if mode is active
        if (showDuplicatesOnly) {
            // Count occurrences of normalized keys
            const keyCounts = {};
            words.forEach(w => {
                const key = getNormalizedKey(w.english);
                if (key) {
                    keyCounts[key] = (keyCounts[key] || 0) + 1;
                }
            });

            // Filter to only show words that belong to a duplicate group
            result = result.filter(w => {
                const key = getNormalizedKey(w.english);
                return key && keyCounts[key] > 1;
            });

            // Sort by normalized key to group them together
            result.sort((a, b) => getNormalizedKey(a.english).localeCompare(getNormalizedKey(b.english)));
        }

        return result;
    }, [filteredWords, sortBy, showDuplicatesOnly, words]);

    // Check if a specific word is a duplicate (for highlighting)
    const isDuplicate = (word) => {
        if (!word.english) return false;
        const key = getNormalizedKey(word.english);
        if (!key) return false;
        return words.filter(w => getNormalizedKey(w.english) === key).length > 1;
    };

    if (words.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 dark:text-gray-400">
                <p className="text-lg">No words added yet.</p>
                <p className="text-sm">Add some words to start studying!</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Search and Sort Bar */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search words..."
                        className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-9 pr-4 text-sm outline-none focus:border-blue-500 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                </div>
                <div className="flex rounded-xl bg-gray-100 p-1 dark:bg-gray-700 self-end md:self-center">
                    <button
                        onClick={() => setSortBy('latest')}
                        className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold transition-all ${sortBy === 'latest'
                            ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        <Clock className="h-4 w-4" />
                        <span>최신순</span>
                    </button>
                    <button
                        onClick={() => setSortBy('alphabetical')}
                        className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold transition-all ${sortBy === 'alphabetical' && !showDuplicatesOnly
                            ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        <SortAsc className="h-4 w-4" />
                        <span>가나다순</span>
                    </button>
                    <button
                        onClick={() => {
                            setShowDuplicatesOnly(!showDuplicatesOnly);
                            if (!showDuplicatesOnly) setSortBy('alphabetical');
                        }}
                        className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold transition-all ${showDuplicatesOnly
                            ? 'bg-orange-100 text-orange-600 shadow-sm dark:bg-orange-900/40 dark:text-orange-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        <Copy className="h-4 w-4" />
                        <span>중복 찾기</span>
                    </button>
                    <button
                        onClick={() => setSortBy('mastery')}
                        className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold transition-all ${sortBy === 'mastery' && !showDuplicatesOnly
                            ? 'bg-white text-green-600 shadow-sm dark:bg-gray-600 dark:text-green-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        <TrendingUp className="h-4 w-4" />
                        <span>학습 필요순</span>
                    </button>
                </div>
            </div>

            {sortedWords.map((word) => {
                const group = groups?.find(g => g.id === word.groupId);
                const level = word.level || 0;
                
                return (
                    <div
                        key={word.id}
                        className={`flex flex-col rounded-xl p-4 shadow-sm transition-all dark:bg-gray-800 ${editingId === word.id ? 'bg-white ring-2 ring-blue-500' : 
                            showDuplicatesOnly ? 'bg-orange-50/50 border-l-4 border-orange-400' : 'bg-white'}`}
                    >
                        <div className="flex items-center justify-between">
                            {editingId === word.id ? (
                                <div className="flex w-full items-center gap-2">
                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="text"
                                            value={editEnglish}
                                            onChange={(e) => setEditEnglish(e.target.value)}
                                            className="w-full rounded-lg border border-gray-200 px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                            placeholder="English/Hanzi"
                                            autoFocus
                                        />
                                        <input
                                            type="text"
                                            value={editPronunciation}
                                            onChange={(e) => setEditPronunciation(e.target.value)}
                                            className="w-full rounded-lg border border-gray-200 px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                            placeholder="Pronunciation"
                                        />
                                        <input
                                            type="text"
                                            value={editKorean}
                                            onChange={(e) => setEditKorean(e.target.value)}
                                            className="w-full rounded-lg border border-gray-200 px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                            placeholder="Korean"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => saveEdit(word.id)}
                                            className="rounded-lg p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30"
                                        >
                                            <Check className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {word.english}
                                            </h3>
                                            {showDuplicatesOnly && (
                                                <AlertTriangle className="h-4 w-4 text-orange-500" title="중복 의심 단어" />
                                            )}
                                            <button
                                                onClick={() => speak(word.english, ttsSettings)}
                                                className="rounded-full p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                                aria-label="Listen to pronunciation"
                                            >
                                                <Volume2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        {word.pronunciation && (
                                            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-0.5">
                                                [{word.pronunciation}]
                                            </p>
                                        )}
                                        <p className="text-gray-600 dark:text-gray-300">{word.korean}</p>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        {group && (
                                            <span className="mr-2 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-500 dark:bg-blue-900/30 dark:text-blue-400">
                                                {group.name}
                                            </span>
                                        )}
                                        <button
                                            onClick={() => startEdit(word)}
                                            className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-blue-500 dark:hover:bg-gray-800"
                                            aria-label="Edit word"
                                        >
                                            <Pencil className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(word.id)}
                                            className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30"
                                            aria-label="Delete word"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Mastery Progress Gauge */}
                        {!editingId && (
                            <div className="mt-4 flex items-center gap-2 border-t border-gray-50 pt-3 dark:border-gray-700/50">
                                <div className="flex-1 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-1000 ${
                                            level >= 5 ? 'bg-green-500' : 
                                            level >= 3 ? 'bg-blue-500' : 
                                            level >= 1 ? 'bg-orange-500' : 'bg-gray-300'
                                        }`}
                                        style={{ width: `${(level / 5) * 100}%` }}
                                    />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                    level >= 5 ? 'text-green-500' : 'text-gray-400'
                                }`}>
                                    {level >= 5 ? 'Mastered' : `Level ${level}`}
                                </span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
