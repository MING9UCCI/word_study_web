import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit2, Save, X, StickyNote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Memo = ({ memos, onAddMemo, onDeleteMemo, onEditMemo }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newMemoContent, setNewMemoContent] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddMemo = () => {
        if (newMemoContent.trim()) {
            onAddMemo(newMemoContent.trim());
            setNewMemoContent('');
            setIsAdding(false);
        }
    };

    const handleStartEdit = (memo) => {
        setEditingId(memo.id);
        setEditContent(memo.content);
    };

    const handleSaveEdit = () => {
        if (editContent.trim() && editingId) {
            onEditMemo(editingId, editContent.trim());
            setEditingId(null);
            setEditContent('');
        }
    };

    const filteredMemos = memos.filter(memo =>
        memo.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return '방금 전';
        if (diffMins < 60) return `${diffMins}분 전`;
        if (diffHours < 24) return `${diffHours}시간 전`;
        if (diffDays < 7) return `${diffDays}일 전`;

        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">📝 메모</h2>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
                >
                    <Plus className="h-5 w-5" />
                    새 메모
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="메모 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
            </div>

            {/* Add Memo Card */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 p-6 shadow-lg dark:from-blue-900/20 dark:to-purple-900/20"
                    >
                        <textarea
                            value={newMemoContent}
                            onChange={(e) => setNewMemoContent(e.target.value)}
                            placeholder="무엇을 메모하시겠어요?"
                            className="mb-4 w-full resize-none rounded-xl border border-gray-200 bg-white p-4 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            rows={4}
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleAddMemo}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 font-medium text-white transition-colors hover:bg-blue-700"
                            >
                                <Save className="h-4 w-4" />
                                저장
                            </button>
                            <button
                                onClick={() => {
                                    setIsAdding(false);
                                    setNewMemoContent('');
                                }}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <X className="h-4 w-4" />
                                취소
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Memos List */}
            <div className="grid gap-4">
                <AnimatePresence>
                    {filteredMemos.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center dark:border-gray-700"
                        >
                            <div className="mx-auto mb-4 inline-flex rounded-full bg-gray-100 p-4 dark:bg-gray-800">
                                <StickyNote className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                                {searchTerm ? '검색 결과가 없습니다' : '아직 메모가 없어요'}
                            </p>
                            <p className="mt-2 text-sm text-gray-400">
                                {searchTerm ? '다른 검색어를 시도해보세요' : '첫 메모를 추가해보세요!'}
                            </p>
                        </motion.div>
                    ) : (
                        filteredMemos.map((memo) => (
                            <motion.div
                                key={memo.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                            >
                                {editingId === memo.id ? (
                                    <div className="space-y-3">
                                        <textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                            rows={4}
                                            autoFocus
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleSaveEdit}
                                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                            >
                                                <Save className="h-4 w-4" />
                                                저장
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingId(null);
                                                    setEditContent('');
                                                }}
                                                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                            >
                                                <X className="h-4 w-4" />
                                                취소
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-3 flex items-start justify-between gap-3">
                                            <p className="flex-1 whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                                                {memo.content}
                                            </p>
                                            <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                <button
                                                    onClick={() => handleStartEdit(memo)}
                                                    className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
                                                    title="수정"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => onDeleteMemo(memo.id)}
                                                    className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                                                    title="삭제"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-gray-400">
                                            <span>{formatDate(memo.createdAt)}</span>
                                            {memo.updatedAt !== memo.createdAt && (
                                                <span className="italic">수정됨</span>
                                            )}
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
