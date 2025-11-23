import React, { useState, useEffect } from 'react';
import { Check, X, Trophy, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const QuizMode = ({ words }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [shuffledWords, setShuffledWords] = useState([]);

    useEffect(() => {
        startQuiz();
    }, [words]);

    const startQuiz = () => {
        // Shuffle words for the quiz
        const shuffled = [...words].sort(() => Math.random() - 0.5);
        setShuffledWords(shuffled);
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowResult(false);
        setSelectedAnswer(null);
        setIsCorrect(null);
    };

    const currentWord = shuffledWords[currentQuestionIndex];

    // Generate options
    const generateOptions = () => {
        if (!currentWord) return [];

        const correctOption = currentWord.korean;
        const otherOptions = words
            .filter(w => w.id !== currentWord.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(w => w.korean);

        // If not enough words, fill with placeholders or duplicates (edge case)
        while (otherOptions.length < 3 && words.length > 1) {
            otherOptions.push(words[Math.floor(Math.random() * words.length)].korean);
        }

        return [...otherOptions, correctOption].sort(() => Math.random() - 0.5);
    };

    const [options, setOptions] = useState([]);

    useEffect(() => {
        setOptions(generateOptions());
    }, [currentQuestionIndex, shuffledWords]);

    const handleAnswer = (option) => {
        if (selectedAnswer) return; // Prevent multiple clicks

        setSelectedAnswer(option);
        const correct = option === currentWord.korean;
        setIsCorrect(correct);

        if (correct) {
            setScore(prev => prev + 1);
        }

        setTimeout(() => {
            if (currentQuestionIndex < shuffledWords.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedAnswer(null);
                setIsCorrect(null);
            } else {
                setShowResult(true);
            }
        }, 1500);
    };

    if (words.length < 4) {
        return (
            <div className="flex h-full flex-col items-center justify-center text-center">
                <p className="text-gray-500">Add at least 4 words to start a quiz!</p>
            </div>
        );
    }

    if (showResult) {
        return (
            <div className="flex h-full flex-col items-center justify-center space-y-6 text-center">
                <div className="rounded-full bg-yellow-100 p-6 dark:bg-yellow-900/30">
                    <Trophy className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz Complete!</h2>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                        You scored {score} out of {shuffledWords.length}
                    </p>
                </div>
                <button
                    onClick={startQuiz}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-transform active:scale-95"
                >
                    <RefreshCw className="h-5 w-5" />
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col space-y-8 py-4">
            <div className="flex justify-between text-sm font-medium text-gray-500">
                <span>Question {currentQuestionIndex + 1}/{shuffledWords.length}</span>
                <span>Score: {score}</span>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                    {currentWord?.english}
                </h2>

                <div className="grid w-full gap-3">
                    {options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(option)}
                            disabled={selectedAnswer !== null}
                            className={`w-full rounded-xl p-4 text-left text-lg font-medium transition-all ${selectedAnswer === option
                                    ? isCorrect
                                        ? 'bg-green-100 text-green-700 ring-2 ring-green-500 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-red-100 text-red-700 ring-2 ring-red-500 dark:bg-red-900/30 dark:text-red-400'
                                    : selectedAnswer !== null && option === currentWord.korean
                                        ? 'bg-green-100 text-green-700 ring-2 ring-green-500 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
