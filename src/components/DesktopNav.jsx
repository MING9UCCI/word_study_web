import React from 'react';
import { BookOpen, List, BarChart, StickyNote } from 'lucide-react';

export const DesktopNav = ({ currentMode, onModeChange }) => {
    const navItems = [
        { id: 'manage', icon: List, label: 'Manage' },
        { id: 'study', icon: BookOpen, label: 'Study' },
        { id: 'memo', icon: StickyNote, label: 'Memo' },
        { id: 'dashboard', icon: BarChart, label: 'Stats' }
    ];

    return (
        <nav className="hidden md:block fixed left-0 top-16 bottom-0 w-64 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-4">
            <div className="space-y-2">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => onModeChange(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentMode === item.id
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                            }`}
                    >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};
