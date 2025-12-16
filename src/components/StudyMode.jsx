import React, { useState, useEffect } from 'react';

import { Flashcard } from './Flashcard';
import { ProgressBar } from './ProgressBar';
import { Check, X, Filter, Shuffle, Volume2, ArrowLeft, ArrowRight, RotateCcw, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeech } from '../hooks/useSpeech';

export const StudyMode = ({ words, onToggleMemorized, updateWordProgress, ttsSettings, onExit }) => {
    const { speak } = useSpeech();
    const [showUnmemorizedOnly, setShowUnmemorizedOnly] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [studyWords, setStudyWords] = useState(words);
    const [isFinished, setIsFinished] = useState(false);

    // Filter words based on mode
    useEffect(() => {
        const filtered = showUnmemorizedOnly
            ? words.filter(w => !w.memorized)
            : words;
        setStudyWords(filtered);
        setCurrentIndex(0);
        setIsFlipped(false);
        setIsFinished(false);
    }, [words, showUnmemorizedOnly]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            // Don't trigger if user is typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            // Prevent default for our shortcuts
            const key = e.key.toLowerCase();

            switch (key) {
                case ' ': // Space - flip card
                    e.preventDefault();
                    setIsFlipped(prev => !prev);
                    break;
                case 'arrowright': // Right arrow - next
                    e.preventDefault();
                    handleNext();
                    break;
                case 'arrowleft': // Left arrow - previous
                    e.preventDefault();
                    handlePrev();
                    break;
                case '1':
                case 'x': // 1 or X - Forgot
                    e.preventDefault();
                    if (!isFinished && studyWords[currentIndex]) handleResult(false);
                    break;
                case '2':
                case 'o': // 2 or O - Got it
                    e.preventDefault();
                    if (!isFinished && studyWords[currentIndex]) handleResult(true);
                    break;
                case 's': // S - Shuffle
                    e.preventDefault();
                    handleShuffle();
                    break;
                case 'f': // F - Filter toggle
                    e.preventDefault();
                    setShowUnmemorizedOnly(prev => !prev);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const currentWord = studyWords[currentIndex];
    const memorizedCount = words.filter(w => (w.level || 0) >= 5 || w.memorized).length;

    const handleShuffle = () => {
        const shuffled = [...studyWords].sort(() => Math.random() - 0.5);
        setStudyWords(shuffled);
        setCurrentIndex(0);
        setIsFlipped(false);
        setIsFinished(false);
    };

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            if (currentIndex < studyWords.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                setIsFinished(true);
            }
        }, 200);
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleResult = (isCorrect) => {
        if (currentWord) {
            // If updateWordProgress is available (SRS mode), use it
            if (updateWordProgress) {
                updateWordProgress(currentWord.id, isCorrect);
            } else {
                // Fallback for legacy behavior (only if correct)
                if (isCorrect) onToggleMemorized(currentWord.id);
            }
            handleNext();
        }
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setIsFlipped(false);
        setIsFinished(false);
    };

    if (studyWords.length === 0) {
        return (
            <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
                <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/30">
                    <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">All Caught Up!</h3>
                <p className="text-gray-600 dark:text-gray-400">
                    {showUnmemorizedOnly
                        ? "You've memorized all words! Great job!"
                        : "No words to study yet. Add some words first!"}
                </p>
                {showUnmemorizedOnly && (
                    <button
                        onClick={() => setShowUnmemorizedOnly(false)}
                        className="text-blue-500 hover:underline"
                    >
                        Show all words
                    </button>
                )}
            </div>
        );
    }

    if (isFinished) {
        return (
            <div className="flex h-full flex-col items-center justify-center space-y-6 text-center">
                <div className="rounded-full bg-blue-100 p-6 dark:bg-blue-900/30">
                    <Check className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Session Complete!</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        You've reviewed all {studyWords.length} words in this list.
                    </p>
                </div>

                <div className="flex w-full max-w-xs flex-col gap-3">
                    <button
                        onClick={handleRestart}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-[0.98]"
                    >
                        <RotateCcw className="h-5 w-5" />
                        Study Again
                    </button>
                    <button
                        onClick={onExit}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        <Home className="h-5 w-5" />
                        Back to Menu
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col space-y-6">
            <div className="flex items-center justify-between">
                <ProgressBar total={words.length} completed={memorizedCount} />
                <div className="relative ml-4 group">
                    <button
                        onClick={() => setShowUnmemorizedOnly(!showUnmemorizedOnly)}
                        className={`rounded-lg p-2 transition-all ${showUnmemorizedOnly
                            ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-500 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600'
                            }`}
                        aria-label="Toggle unmemorized filter"
                    >
                        <Filter className="h-5 w-5" />
                    </button>
                    {/* Tooltip */}
                    <div className="absolute right-0 top-full mt-2 hidden group-hover:block z-10">
                        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap dark:bg-gray-700">
                            {showUnmemorizedOnly
                                ? `암기 안 된 단어만 (${studyWords.length}개)`
                                : '전체 단어 보기 (F키)'}
                            <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentWord.id}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full"
                    >
                        <Flashcard
                            word={currentWord}
                            isFlipped={isFlipped}
                            onFlip={() => setIsFlipped(!isFlipped)}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <button
                        onClick={() => speak(currentWord.english, ttsSettings)}
                        className="rounded-full bg-blue-100 p-3 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                        <Volume2 className="h-6 w-6" />
                    </button>
                    <button
                        onClick={handleShuffle}
                        className="rounded-full bg-purple-100 p-3 text-purple-600 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400"
                        title="Shuffle Cards"
                    >
                        <Shuffle className="h-6 w-6" />
                    </button>
                </div>
                <button
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="rounded-xl bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                >
                    {isFlipped ? 'Show English' : 'Show Meaning'}
                </button>
            </div>

            <div className="flex items-center justify-start gap-4">
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 px-6 font-medium text-gray-700 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300"
                >
                    <ArrowLeft className="h-5 w-5" />
                    Previous
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-20 md:pb-4">
                <button
                    onClick={() => handleResult(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-orange-100 py-4 font-semibold text-orange-700 transition-transform active:scale-95 dark:bg-orange-900/30 dark:text-orange-400"
                    title="Keyboard: 1 or X"
                >
                    <X className="h-5 w-5" />
                    <span>Forgot <span className="text-xs opacity-60">(1)</span></span>
                </button>
                <button
                    onClick={() => handleResult(true)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-green-100 py-4 font-semibold text-green-700 transition-transform active:scale-95 dark:bg-green-900/30 dark:text-green-400"
                    title="Keyboard: 2 or O"
                >
                    <Check className="h-5 w-5" />
                    <span>Got it <span className="text-xs opacity-60">(2)</span></span>
                </button>
            </div>

            {/* Keyboard shortcuts hint */}
            <div className="hidden md:block text-center pb-4">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                    💡 <span className="font-medium">키보드 단축키:</span> Space-뒤집기 | ←→-이동 | 1-Forgot | 2-Got it | S-셔플 | F-필터
                </p>
            </div>
        </div>
    );
};
