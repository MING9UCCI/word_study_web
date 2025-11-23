import React, { useState, useEffect } from 'react';
import { Flashcard } from './Flashcard';
import { ProgressBar } from './ProgressBar';
import { Check, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const StudyMode = ({ words, onToggleMemorized }) => {
    const [showUnmemorizedOnly, setShowUnmemorizedOnly] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    // Filter words based on mode
    const studyWords = showUnmemorizedOnly
        ? words.filter(w => !w.memorized)
        : words;

    const currentWord = studyWords[currentIndex];
    const memorizedCount = words.filter(w => w.memorized).length;

    // Reset index when filter changes or words change
    useEffect(() => {
        if (currentIndex >= studyWords.length) {
            setCurrentIndex(Math.max(0, studyWords.length - 1));
        }
    }, [studyWords.length, currentIndex]);

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            if (currentIndex < studyWords.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                // Loop back to start or show finished state
                setCurrentIndex(0);
            }
        }, 200);
    };

    const handleMemorized = () => {
        if (currentWord) {
            onToggleMemorized(currentWord.id);
            handleNext();
        }
    };

    const handleKeepStudying = () => {
        handleNext();
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

    return (
        <div className="flex h-full flex-col space-y-6">
            <div className="flex items-center justify-between">
                <ProgressBar total={words.length} completed={memorizedCount} />
                <button
                    onClick={() => setShowUnmemorizedOnly(!showUnmemorizedOnly)}
                    className={`ml-4 rounded-lg p-2 transition-colors ${showUnmemorizedOnly
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                        }`}
                    aria-label="Toggle unmemorized filter"
                >
                    <Filter className="h-5 w-5" />
                </button>
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

            <div className="grid grid-cols-2 gap-4 pb-4">
                <button
                    onClick={handleKeepStudying}
                    className="flex items-center justify-center gap-2 rounded-xl bg-orange-100 py-4 font-semibold text-orange-700 transition-transform active:scale-95 dark:bg-orange-900/30 dark:text-orange-400"
                >
                    <X className="h-5 w-5" />
                    Not Yet
                </button>
                <button
                    onClick={handleMemorized}
                    className="flex items-center justify-center gap-2 rounded-xl bg-green-100 py-4 font-semibold text-green-700 transition-transform active:scale-95 dark:bg-green-900/30 dark:text-green-400"
                >
                    <Check className="h-5 w-5" />
                    Memorized
                </button>
            </div>
        </div>
    );
};
