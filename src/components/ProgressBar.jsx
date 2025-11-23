import React from 'react';

export const ProgressBar = ({ total, completed }) => {
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return (
        <div className="w-full space-y-2">
            <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400">
                <span>Progress</span>
                <span>{completed}/{total} ({percentage}%)</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};
