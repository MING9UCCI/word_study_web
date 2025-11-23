import React from 'react';
import { Moon, Sun } from 'lucide-react';

export const Header = ({ darkMode, toggleDarkMode }) => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md pt-[env(safe-area-inset-top)] dark:border-gray-800 dark:bg-gray-900/80">
            <div className="mx-auto flex h-16 max-w-md items-center justify-between px-4">
                <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    TOEIC Vocab
                </h1>
                <button
                    onClick={toggleDarkMode}
                    className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                    aria-label="Toggle dark mode"
                >
                    {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
            </div>
        </header>
    );
};
