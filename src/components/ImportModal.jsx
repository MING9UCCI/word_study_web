import React, { useState } from 'react';
import { X, CheckCircle2, ChevronRight, Folder, FileJson, AlertCircle } from 'lucide-react';

export const ImportModal = ({ isOpen, onClose, data, onConfirm }) => {
    const [selectedGroupIds, setSelectedGroupIds] = useState([]);

    if (!isOpen || !data) return null;

    const groups = data.groups || [];
    const words = data.words || [];

    // Helper to get word count for a group
    const getWordCount = (groupId) => {
        return words.filter(w => w.groupId === groupId).length;
    };

    const toggleGroup = (groupId) => {
        setSelectedGroupIds(prev => 
            prev.includes(groupId) 
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        );
    };

    const toggleAll = () => {
        if (selectedGroupIds.length === groups.length) {
            setSelectedGroupIds([]);
        } else {
            setSelectedGroupIds(groups.map(g => g.id));
        }
    };

    const handleImport = () => {
        if (selectedGroupIds.length === 0) {
            alert('가져올 폴더를 선택해주세요.');
            return;
        }

        const selectedGroups = groups.filter(g => selectedGroupIds.includes(g.id));
        const selectedWords = words.filter(w => selectedGroupIds.includes(w.groupId));

        onConfirm({ groups: selectedGroups, words: selectedWords });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
                <div className="flex items-center justify-between border-b p-4 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <FileJson className="h-5 w-5 text-blue-500" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">가져오기 미리보기</h2>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6 rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <div className="text-sm text-blue-800 dark:text-blue-300">
                                <p className="font-semibold">파일 분석 완료</p>
                                <p>총 {groups.length}개의 폴더와 {words.length}개의 단어가 발견되었습니다. 가져올 폴더를 선택하세요.</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-2">
                            <span className="text-sm font-medium text-gray-500">폴더 목록 ({selectedGroupIds.length}/{groups.length} 선택)</span>
                            <button 
                                onClick={toggleAll}
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                            >
                                {selectedGroupIds.length === groups.length ? '전체 해제' : '전체 선택'}
                            </button>
                        </div>

                        <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 dark:divide-gray-700 dark:border-gray-700">
                            {groups.map((group) => {
                                const isSelected = selectedGroupIds.includes(group.id);
                                const count = getWordCount(group.id);
                                
                                return (
                                    <div 
                                        key={group.id}
                                        onClick={() => toggleGroup(group.id)}
                                        className={`flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${isSelected ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`rounded-lg p-2 ${isSelected ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700'}`}>
                                                <Folder className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white">{group.name}</p>
                                                <p className="text-xs text-gray-500">{count}개의 단어</p>
                                            </div>
                                        </div>
                                        <div className={`rounded-full transition-colors ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-300 dark:text-gray-600'}`}>
                                            <CheckCircle2 className="h-6 w-6 fill-current" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="border-t p-4 dark:border-gray-700">
                    <button
                        onClick={handleImport}
                        disabled={selectedGroupIds.length === 0}
                        className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none transition-all"
                    >
                        선택한 {selectedGroupIds.length}개 폴더 가져오기
                    </button>
                </div>
            </div>
        </div>
    );
};
