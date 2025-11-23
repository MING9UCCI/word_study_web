import React from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';

export const Flashcard = ({ word, isFlipped, onFlip }) => {
    const { speak } = useSpeech();

    const handleSpeakerClick = (e) => {
        e.stopPropagation();
        speak(word.english);
    };

    return (
        <div
            className="relative h-64 w-full cursor-pointer perspective-1000"
            onClick={onFlip}
        >
            <motion.div
                className="relative h-full w-full preserve-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front (English) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-white p-8 shadow-lg backface-hidden dark:bg-gray-800">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white">{word.english}</h2>
                    <button
                        onClick={handleSpeakerClick}
                        className="mt-4 rounded-full p-3 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                    >
                        <Volume2 className="h-8 w-8" />
                    </button>
                    <p className="absolute bottom-6 text-sm text-gray-400">Tap to flip</p>
                </div>

                {/* Back (Korean) */}
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-blue-50 p-8 shadow-lg backface-hidden dark:bg-blue-900/20"
                    style={{ transform: 'rotateY(180deg)' }}
                >
                    <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400">{word.korean}</h2>
                    <p className="absolute bottom-6 text-sm text-blue-400/60">Tap to flip back</p>
                </div>
            </motion.div>
        </div>
    );
};
