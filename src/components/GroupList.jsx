import React, { useState } from 'react';
import { Folder, Plus, Trash2, ChevronRight } from 'lucide-react';

export const GroupList = ({ groups, onSelectGroup, onAddGroup, onDeleteGroup }) => {
    const [newGroupName, setNewGroupName] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newGroupName.trim()) return;
        onAddGroup(newGroupName);
        setNewGroupName('');
        setIsAdding(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Collections</h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                >
                    <Plus className="h-5 w-5" />
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAdd} className="flex gap-2">
                    <input
                        type="text"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        placeholder="New Folder Name (e.g., Day 1)"
                        className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white"
                    >
                        Add
                    </button>
                </form>
            )}

            <div className="grid gap-3">
                {groups.map((group) => (
                    <div
                        key={group.id}
                        onClick={() => onSelectGroup(group.id)}
                        className="flex cursor-pointer items-center justify-between rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
                    >
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                <Folder className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{group.name}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(group.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {group.id !== 'default' && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm('Delete this folder and all its words?')) {
                                            onDeleteGroup(group.id);
                                        }
                                    }}
                                    className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            )}
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
