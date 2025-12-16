import React from 'react';
import { BookOpen, List, BarChart, StickyNote } from 'lucide-react';

export const BottomNav = ({ currentMode, onModeChange }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-6 py-3 dark:border-gray-800 dark:bg-gray-900 md:hidden">
            <div className="mx-auto flex max-w-md justify-around">
                <button
                    onClick={() => onModeChange('manage')}
                    className={`flex flex-col items-center gap-1 ${currentMode === 'manage'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                        }`}
                >
                    <List className="h-6 w-6" />
                    <span className="text-xs font-medium">Manage</span>
                </button>
                <button
                    onClick={() => onModeChange('study')}
                    className={`flex flex-col items-center gap-1 ${currentMode === 'study'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                        }`}
                >
                    <BookOpen className="h-6 w-6" />
                    <span className="text-xs font-medium">Study</span>
                </button>
                <button
                    onClick={() => onModeChange('memo')}
                    className={`flex flex-col items-center gap-1 ${currentMode === 'memo'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                        }`}
                >
                    <StickyNote className="h-6 w-6" />
                    <span className="text-xs font-medium">Memo</span>
                </button>
                <button
                    onClick={() => onModeChange('dashboard')}
                    className={`flex flex-col items-center gap-1 ${currentMode === 'dashboard'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                        }`}
                >
                    <BarChart className="h-6 w-6" />
                    <span className="text-xs font-medium">Stats</span>
                </button>
            </div>
        </nav>
    );
};
