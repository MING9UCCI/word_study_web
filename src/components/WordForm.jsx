import React, { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { aiService } from '../services/aiService';

export const WordForm = ({ onAdd }) => {
    const [english, setEnglish] = useState('');
    const [pronunciation, setPronunciation] = useState('');
    const [korean, setKorean] = useState('');
    const [example, setExample] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!english.trim() || !korean.trim()) return;

        onAdd(english, korean, example, pronunciation);
        setEnglish('');
        setPronunciation('');
        setKorean('');
        setExample('');
    };

    const handleAiComplete = async () => {
        alert('AI 자동 완성 기능은 추후 추가 예정입니다.');
        return;

        // Disabled for now
        /*
        if (!english.trim()) {
            alert('영어 단어를 먼저 입력해주세요.');
            return;
        }

        const apiKey = localStorage.getItem('openai-api-key');
        if (!apiKey) {
            alert('설정에서 OpenAI API 키를 먼저 입력해주세요.');
            return;
        }

        setIsAiLoading(true);
        try {
            const result = await aiService.generateWordData(english, apiKey);
            setKorean(result.meaning);
            setExample(result.example);
        } catch (error) {
            alert('AI 자동 완성 실패: ' + error.message);
        } finally {
            setIsAiLoading(false);
        }
        */
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="space-y-2">
                <label htmlFor="english" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    English Word
                </label>
                <div className="flex gap-2">
                    <input
                        id="english"
                        type="text"
                        value={english}
                        onChange={(e) => setEnglish(e.target.value)}
                        placeholder="e.g., accommodate"
                        className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                    <button
                        type="button"
                        onClick={handleAiComplete}
                        disabled={isAiLoading || !english.trim()}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 font-medium text-white hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Sparkles className="h-5 w-5" />
                        {isAiLoading ? 'AI...' : 'AI'}
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="pronunciation" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Pronunciation / Pinyin (Optional)
                </label>
                <input
                    id="pronunciation"
                    type="text"
                    value={pronunciation}
                    onChange={(e) => setPronunciation(e.target.value)}
                    placeholder="e.g., nǐ hǎo"
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
                    placeholder="e.g., 수용하다"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="example" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Example Sentence (Optional)
                </label>
                <textarea
                    id="example"
                    value={example}
                    onChange={(e) => setExample(e.target.value)}
                    placeholder="e.g., The hotel can accommodate up to 200 guests."
                    rows="2"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white resize-none"
                />
            </div>

            <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition-transform active:scale-95 hover:bg-blue-700"
            >
                <Plus className="h-5 w-5" />
                Add Word
            </button>
        </form>
    );
};
