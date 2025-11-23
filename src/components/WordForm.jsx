import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export const WordForm = ({ onAdd }) => {
    const [english, setEnglish] = useState('');
    const [korean, setKorean] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!english.trim() || !korean.trim()) return;

        onAdd(english, korean);
        setEnglish('');
        setKorean('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="space-y-2">
                <label htmlFor="english" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    English Word
                </label>
                <input
                    id="english"
                    type="text"
                    value={english}
                    onChange={(e) => setEnglish(e.target.value)}
                    placeholder="e.g., Apple"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="korean" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Meaning (Korean)
                </label>
                <input
                    id="korean"
                    type="text"
                    value={korean}
                    onChange={(e) => setKorean(e.target.value)}
                    placeholder="e.g., 사과"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
            </div>

            <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition-transform active:scale-95"
            >
                <Plus className="h-5 w-5" />
                Add Word
            </button>
        </form>
    );
};
