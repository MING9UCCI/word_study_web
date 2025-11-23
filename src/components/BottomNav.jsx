import React from 'react';
import { BookOpen, List } from 'lucide-react';

export const BottomNav = ({ currentMode, onModeChange }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto flex max-w-md justify-around px-4">
                <button
                    onClick={() => onModeChange('manage')}
                    className={`flex flex-col items-center gap-1 rounded-lg p-2 transition-colors ${currentMode === 'manage'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                        }`}
                >
                    <List className="h-6 w-6" />
                    <span className="text-xs font-medium">Manage</span>
                </button>
                <button
                    onClick={() => onModeChange('study')}
                    className={`flex flex-col items-center gap-1 rounded-lg p-2 transition-colors ${currentMode === 'study'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                        }`}
                >
                    <BookOpen className="h-6 w-6" />
                    <span className="text-xs font-medium">Study</span>
                </button>
            </div>
        </nav>
    );
};
