import React, { useState } from 'react';
import { Folder, Plus, Trash2, ChevronRight, Pencil, Check, X, Library } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';

export const GroupList = ({ groups, onSelectGroup, onAddGroup, onDeleteGroup, onEditGroup }) => {
    const [newGroupName, setNewGroupName] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newGroupName.trim()) return;
        onAddGroup(newGroupName);
        setNewGroupName('');
        setIsAdding(false);
    };

    const startEdit = (e, group) => {
        e.stopPropagation();
        setEditingId(group.id);
        setEditName(group.name);
    };

    const cancelEdit = (e) => {
        e?.stopPropagation();
        setEditingId(null);
        setEditName('');
    };

    const saveEdit = (e, id) => {
        e?.stopPropagation();
        if (editName.trim()) {
            onEditGroup(id, editName);
            setEditingId(null);
        }
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Special "All Words" Item */}
                <div
                    onClick={() => onSelectGroup('all')}
                    className="flex cursor-pointer items-center justify-between rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 shadow-md transition-all hover:shadow-lg text-white"
                >
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-white/20 p-2 text-white">
                            <Library className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold underline underline-offset-4 decoration-2">전체 단어 보기</h3>
                            <p className="text-xs text-blue-100 italic">모든 단어 관리 및 중복 제거</p>
                        </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-blue-100" />
                </div>

                {groups.map((group) => (
                    <div
                        key={group.id}
                        onClick={() => editingId !== group.id && onSelectGroup(group.id)}
                        className="flex cursor-pointer items-center justify-between rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
                    >
                        {editingId === group.id ? (
                            <div className="flex w-full items-center gap-2" onClick={e => e.stopPropagation()}>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="flex-1 rounded-lg border border-gray-200 px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                    autoFocus
                                />
                                <button
                                    onClick={(e) => saveEdit(e, group.id)}
                                    className="rounded-lg p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30"
                                >
                                    <Check className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={cancelEdit}
                                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <>
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

                                <div className="flex items-center gap-1">
                                    {group.id !== 'default' && (
                                        <>
                                            <button
                                                onClick={(e) => startEdit(e, group)}
                                                className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-blue-500 dark:hover:bg-gray-800"
                                            >
                                                <Pencil className="h-5 w-5" />
                                            </button>
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
                                        </>
                                    )}
                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
