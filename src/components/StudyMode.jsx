import React, { useState, useEffect, useCallback } from 'react';

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
    const [gotItCount, setGotItCount] = useState(0);
    const [showResumeDialog, setShowResumeDialog] = useState(false);
    const [savedSession, setSavedSession] = useState(null);

    // Session storage key based on word IDs (unique per group)
    const sessionKey = `study_session_${words.map(w => w.id).join('_').substring(0, 50)}`;

    // Load saved session on mount
    useEffect(() => {
        const saved = localStorage.getItem(sessionKey);
        if (saved) {
            try {
                const session = JSON.parse(saved);
                // Check if session is recent (within last 24 hours)
                const sessionAge = Date.now() - session.timestamp;
                if (sessionAge < 24 * 60 * 60 * 1000 && session.studyWords.length > 0) {
                    setSavedSession(session);
                    setShowResumeDialog(true);
                } else {
                    localStorage.removeItem(sessionKey);
                }
            } catch (e) {
                console.error('Failed to load session:', e);
            }
        }
    }, [sessionKey]);

    // Initialize studyWords once on mount or when filter changes
    useEffect(() => {
        const filtered = showUnmemorizedOnly
            ? words.filter(w => !w.memorized)
            : words;
        
        // Only set words if they are different to avoid unnecessary re-renders
        // or if we are just starting (currentIndex 0)
        setStudyWords(prev => {
            // If we are in the middle of a session ( currentIndex > 0 ), 
            // don't reset everything unless the filter itself changed
            if (currentIndex > 0 && !showUnmemorizedOnly) return prev;
            return filtered;
        });
    }, [showUnmemorizedOnly]); // Removed [words] dependency to stop resetting during session

    const currentWord = studyWords[currentIndex];
    // Progress is based on Got it count, not memorized count
    const totalWords = words.length;

    const handleNext = () => {
        console.log('handleNext called, current index:', currentIndex, 'total:', studyWords.length);
        setIsFlipped(false);
        // Use functional setState to avoid stale closure
        setCurrentIndex(prevIndex => {
            console.log('Updating index from', prevIndex, 'to', prevIndex + 1);
            if (prevIndex < studyWords.length - 1) {
                return prevIndex + 1;
            } else {
                setIsFinished(true);
                return prevIndex;
            }
        });
    };

    const handlePrev = () => {
        setCurrentIndex(prevIndex => {
            if (prevIndex > 0) {
                setIsFlipped(false);
                return prevIndex - 1;
            }
            return prevIndex;
        });
    };

    const handleShuffle = () => {
        const shuffled = [...studyWords].sort(() => Math.random() - 0.5);
        setStudyWords(shuffled);
        setCurrentIndex(0);
        setIsFlipped(false);
        setIsFinished(false);
    };

    const handleResult = (isCorrect) => {
        console.log('handleResult called, isCorrect:', isCorrect, 'currentWord:', currentWord);
        if (!currentWord) {
            console.error('No current word!');
            return;
        }

        // Update word progress
        if (updateWordProgress) {
            updateWordProgress(currentWord.id, isCorrect);
        } else {
            if (isCorrect) onToggleMemorized(currentWord.id);
        }

        // If Got it, remove from study list and increase progress
        if (isCorrect) {
            setGotItCount(prev => prev + 1);
            setStudyWords(prevWords => {
                const newWords = prevWords.filter(w => w.id !== currentWord.id);

                // If no more words, show completion
                if (newWords.length === 0) {
                    setIsFinished(true);
                    return prevWords;
                }

                // Adjust index if needed
                if (currentIndex >= newWords.length) {
                    setCurrentIndex(newWords.length - 1);
                }

                return newWords;
            });
            setIsFlipped(false);
        } else {
            // Forgot: just move to next
            handleNext();
        }
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setIsFlipped(false);
        setIsFinished(false);
    };

    // Save session to localStorage whenever state changes
    useEffect(() => {
        if (!showResumeDialog && studyWords.length > 0 && studyWords.length < words.length) {
            const session = {
                studyWords: studyWords.map(w => w.id), // Save only IDs to reduce size
                currentIndex,
                gotItCount,
                timestamp: Date.now()
            };
            localStorage.setItem(sessionKey, JSON.stringify(session));
        }
    }, [studyWords, currentIndex, gotItCount, sessionKey, showResumeDialog, words.length]);

    // Clear session when all done
    useEffect(() => {
        if (studyWords.length === 0 || isFinished) {
            localStorage.removeItem(sessionKey);
        }
    }, [studyWords.length, isFinished, sessionKey]);

    const handleResumeSession = () => {
        if (savedSession) {
            // Restore session state
            const savedWordIds = new Set(savedSession.studyWords);
            const restoredWords = words.filter(w => savedWordIds.has(w.id));
            setStudyWords(restoredWords);
            setCurrentIndex(Math.min(savedSession.currentIndex, restoredWords.length - 1));
            setGotItCount(savedSession.gotItCount);
            setShowResumeDialog(false);
        }
    };

    const handleStartOver = () => {
        localStorage.removeItem(sessionKey);
        setStudyWords(words);
        setCurrentIndex(0);
        setGotItCount(0);
        setShowResumeDialog(false);
    };

    // Keyboard shortcuts - TEMPORARILY DISABLED DUE TO REFERENCE ERROR
    // TODO: Fix and re-enable keyboard shortcuts
    /*
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            const key = e.key.toLowerCase();

            switch (key) {
                case ' ':
                    e.preventDefault();
                    setIsFlipped(prev => !prev);
                    break;
                case 'arrowright':
                    e.preventDefault();
                    handleNext();
                    break;
                case 'arrowleft':
                    e.preventDefault();
                    handlePrev();
                    break;
                case '1':
                case 'x':
                    e.preventDefault();
                    if (!isFinished && currentWord) handleResult(false);
                    break;
                case '2':
                case 'o':
                    e.preventDefault();
                    if (!isFinished && currentWord) handleResult(true);
                    break;
                case 's':
                    e.preventDefault();
                    handleShuffle();
                    break;
                case 'f':
                    e.preventDefault();
                    setShowUnmemorizedOnly(prev => !prev);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentIndex, studyWords, isFinished, currentWord, handleNext, handlePrev, handleResult, handleShuffle]);
    */

    // Show resume dialog if saved session exists
    if (showResumeDialog && savedSession) {
        const remainingWords = savedSession.studyWords.length;
        const totalProgress = savedSession.gotItCount;

        return (
            <div className="flex h-full items-center justify-center">
                <div className="max-w-md w-full space-y-6 rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">이전 학습 발견!</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            마지막으로 {remainingWords}개 단어가 남아있었어요
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                            ({totalProgress}개 단어 완료)
                        </p>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleResumeSession}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-[0.98] transition-all"
                        >
                            <RotateCcw className="h-5 w-5" />
                            이어하기
                        </button>
                        <button
                            onClick={handleStartOver}
                            className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white py-4 font-bold text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            <Home className="h-5 w-5" />
                            처음부터 시작
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                        You marked {gotItCount} word{gotItCount !== 1 ? 's' : ''} as "Got it"!
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {studyWords.length === 0 ? "All words learned! 🎉" : `${studyWords.length} word${studyWords.length !== 1 ? 's' : ''} remaining`}
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
                <ProgressBar total={totalWords} completed={gotItCount} />
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

            <div className="flex items-center justify-between gap-4">
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 px-6 font-medium text-gray-700 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300"
                >
                    <ArrowLeft className="h-5 w-5" />
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    disabled={currentIndex === studyWords.length - 1}
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 px-6 font-medium text-gray-700 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300"
                >
                    Next
                    <ArrowRight className="h-5 w-5" />
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

            {/* Keyboard shortcuts hint - DISABLED 
            <div className="hidden md:block text-center pb-4">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                    💡 <span className="font-medium">키보드 단축키:</span> Space-뒤집기 | ←→-이동 | 1-Forgot | 2-Got it | S-셔플 | F-필터
                </p>
            </div>
            */}
        </div>
    );
};
