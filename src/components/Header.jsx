import React from 'react';
import { Moon, Sun, Settings } from 'lucide-react';

export const Header = ({ darkMode, toggleDarkMode, onOpenSettings }) => {
    return (
        <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 px-6 py-4 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
            <div className="mx-auto flex max-w-md items-center justify-between">
                <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-black tracking-tight text-transparent dark:from-blue-400 dark:to-purple-400">
                    TOEIC Vocab
                </h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onOpenSettings}
                        className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                    >
                        <Settings className="h-5 w-5" />
                    </button>
                    <button
                        onClick={toggleDarkMode}
                        className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                    >
                        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>
                </div>
            </div>
        </header>
    );
};
