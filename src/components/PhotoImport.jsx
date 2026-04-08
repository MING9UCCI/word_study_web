import React, { useState, useRef } from 'react';
import { Upload, X, Camera, Trash2, Check, Plus, Folder, Loader2 } from 'lucide-react';
import { aiService } from '../services/aiService';

export const PhotoImport = ({ isOpen, onClose, groups, onSave, onAddGroup }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [results, setResults] = useState([]); // Array of word objects
    const [step, setStep] = useState(1); // 1: Select files, 2: Review & Save
    
    // Group selection state
    const [selectedGroupId, setSelectedGroupId] = useState('');
    const [isCreatingNewGroup, setIsCreatingNewGroup] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    
    // Edit state
    const [editingIdx, setEditingIdx] = useState(null);
    const [editForm, setEditForm] = useState({ english: '', pronunciation: '', korean: '', example: '' });

    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    if (!isOpen) return null;

    const resetState = () => {
        setSelectedFiles([]);
        setResults([]);
        setStep(1);
        setSelectedGroupId('');
        setIsCreatingNewGroup(false);
        setNewGroupName('');
        setEditingIdx(null);
    };

    const handleClose = () => {
        resetState();
        onClose();
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        
        let newFiles = [...selectedFiles, ...files];
        if (newFiles.length > 10) {
            alert('최대 10장까지만 업로드할 수 있습니다.');
            newFiles = newFiles.slice(0, 10);
        }
        setSelectedFiles(newFiles);
        // Reset inputs
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (cameraInputRef.current) cameraInputRef.current.value = '';
    };

    const removeFile = (index) => {
        const newFiles = [...selectedFiles];
        newFiles.splice(index, 1);
        setSelectedFiles(newFiles);
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const processImages = async () => {
        const apiKey = localStorage.getItem('gemini-api-key') || import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            alert('설정에서 Gemini API 키를 먼저 입력해주세요.');
            return;
        }

        setIsProcessing(true);
        setStep(2); // Move to processing/review step
        setProgress({ current: 0, total: selectedFiles.length });
        
        let allWords = [];
        
        try {
            for (let i = 0; i < selectedFiles.length; i++) {
                setProgress({ current: i + 1, total: selectedFiles.length });
                const base64 = await fileToBase64(selectedFiles[i]);
                const words = await aiService.recognizeVocabularyFromImage(base64, apiKey);
                allWords = [...allWords, ...words];
                setResults(prev => [...prev, ...words]); // Incrementally show results
            }
        } catch (error) {
            alert(error.message);
            // Even if it fails mid-way, allow them to review what was already captured
        } finally {
            setIsProcessing(false);
        }
    };

    const startEdit = (index, word) => {
        setEditingIdx(index);
        setEditForm({ 
            english: word.english || '', 
            pronunciation: word.pronunciation || '',
            korean: word.korean || '', 
            example: word.example || '' 
        });
    };

    const cancelEdit = () => {
        setEditingIdx(null);
    };

    const saveEdit = (index) => {
        const newResults = [...results];
        newResults[index] = { ...newResults[index], ...editForm };
        setResults(newResults);
        setEditingIdx(null);
    };

    const deleteWord = (index) => {
        const newResults = [...results];
        newResults.splice(index, 1);
        setResults(newResults);
    };

    const handleSaveAll = () => {
        let finalGroupId = selectedGroupId;
        
        if (isCreatingNewGroup) {
            if (!newGroupName.trim()) {
                alert('새 단어장 이름을 입력해주세요.');
                return;
            }
            // Generate temporary ID to use for immediate saving, the parent will use it or regenerate
            finalGroupId = Date.now().toString() + Math.random().toString().substring(2, 6);
            onAddGroup(finalGroupId, newGroupName);
        } else if (!finalGroupId) {
            alert('저장할 단어장을 선택하거나 새로 만들어주세요.');
            return;
        }

        if (results.length === 0) {
            alert('저장할 단어가 없습니다.');
            return;
        }

        onSave(results, finalGroupId);
        alert(`${results.length}개의 단어가 성공적으로 저장되었습니다.`);
        handleClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="flex h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-xl dark:bg-gray-800">
                <div className="flex items-center justify-between border-b p-4 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">📷 사진으로 단어 추가</h2>
                    <button onClick={handleClose} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    {step === 1 && (
                        <div className="space-y-6">
                            {/* Upload Area */}
                            <div className="flex flex-col gap-4 md:flex-row">
                                <button
                                    onClick={() => cameraInputRef.current?.click()}
                                    className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 py-12 transition-colors hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/20 dark:hover:bg-blue-900/40"
                                >
                                    <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-800">
                                        <Camera className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold text-blue-700 dark:text-blue-300">카메라로 촬영하기</p>
                                    </div>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        capture="environment" 
                                        className="hidden" 
                                        ref={cameraInputRef} 
                                        onChange={handleFileSelect}
                                        multiple 
                                    />
                                </button>
                                
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800/50 dark:hover:bg-gray-700/50"
                                >
                                    <div className="rounded-full bg-gray-200 p-4 dark:bg-gray-700">
                                        <Upload className="h-8 w-8 text-gray-600 dark:text-gray-300" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold text-gray-700 dark:text-gray-300">갤러리에서 선택하기</p>
                                        <p className="text-sm text-gray-500">최대 10장</p>
                                    </div>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        ref={fileInputRef} 
                                        onChange={handleFileSelect} 
                                        multiple 
                                    />
                                </button>
                            </div>

                            {/* Selected Files Preview */}
                            {selectedFiles.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="font-medium text-gray-700 dark:text-gray-300">
                                        선택된 사진 ({selectedFiles.length}/10)
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                                        {selectedFiles.map((file, idx) => (
                                            <div key={idx} className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                                                <img 
                                                    src={URL.createObjectURL(file)} 
                                                    alt={`Upload ${idx}`} 
                                                    className="h-full w-full object-cover"
                                                />
                                                <button
                                                    onClick={() => removeFile(idx)}
                                                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1.5 text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100 hover:bg-red-500"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex h-full flex-col">
                            {/* Progress & Status */}
                            {isProcessing && (
                                <div className="mb-6 rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
                                    <div className="flex items-center gap-3">
                                        <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
                                        <p className="font-medium text-blue-700 dark:text-blue-300">
                                            사진 분석 중... ({progress.current}/{progress.total})
                                        </p>
                                    </div>
                                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-blue-200 dark:bg-blue-800">
                                        <div 
                                            className="h-full bg-blue-600 transition-all duration-300 dark:bg-blue-500" 
                                            style={{ width: `${(progress.current / progress.total) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Results Table */}
                            <div className="flex-1 overflow-auto rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                                <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                                    <thead className="sticky top-0 bg-gray-50 font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                        <tr>
                                            <th className="px-4 py-3">Front (Character/Word)</th>
                                            {results.some(r => r.pronunciation) && <th className="px-4 py-3">Pronunciation</th>}
                                            <th className="px-4 py-3">Meaning</th>
                                            <th className="px-4 py-3">Example</th>
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {results.map((word, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                {editingIdx === idx ? (
                                                    // Edit Mode
                                                    <>
                                                        <td className="px-4 py-2">
                                                            <input 
                                                                type="text" 
                                                                value={editForm.english} 
                                                                onChange={e => setEditForm({...editForm, english: e.target.value})}
                                                                className="w-full rounded border px-2 py-1 dark:border-gray-600 dark:bg-gray-700" 
                                                                placeholder="Front"
                                                            />
                                                        </td>
                                                        {results.some(r => r.pronunciation) && (
                                                            <td className="px-4 py-2">
                                                                <input 
                                                                    type="text" 
                                                                    value={editForm.pronunciation} 
                                                                    onChange={e => setEditForm({...editForm, pronunciation: e.target.value})}
                                                                    className="w-full rounded border px-2 py-1 dark:border-gray-600 dark:bg-gray-700" 
                                                                    placeholder="Pinyin/Pronunciation"
                                                                />
                                                            </td>
                                                        )}
                                                        <td className="px-4 py-2">
                                                            <input 
                                                                type="text" 
                                                                value={editForm.korean} 
                                                                onChange={e => setEditForm({...editForm, korean: e.target.value})}
                                                                className="w-full rounded border px-2 py-1 dark:border-gray-600 dark:bg-gray-700" 
                                                                placeholder="Meaning"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <input 
                                                                type="text" 
                                                                value={editForm.example} 
                                                                onChange={e => setEditForm({...editForm, example: e.target.value})}
                                                                className="w-full rounded border px-2 py-1 dark:border-gray-600 dark:bg-gray-700" 
                                                                placeholder="Example"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-2 text-right">
                                                            <div className="flex justify-end gap-1">
                                                                <button onClick={() => saveEdit(idx)} className="rounded p-1 text-green-600 hover:bg-green-50 dark:text-green-400">
                                                                    <Check className="h-4 w-4" />
                                                                </button>
                                                                <button onClick={cancelEdit} className="rounded p-1 text-gray-400 hover:bg-gray-100">
                                                                    <X className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </>
                                                ) : (
                                                    // View Mode
                                                    <>
                                                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white" onClick={() => startEdit(idx, word)}>{word.english}</td>
                                                        {results.some(r => r.pronunciation) && (
                                                            <td className="px-4 py-3 text-blue-600 dark:text-blue-400 font-medium" onClick={() => startEdit(idx, word)}>{word.pronunciation}</td>
                                                        )}
                                                        <td className="px-4 py-3" onClick={() => startEdit(idx, word)}>{word.korean}</td>
                                                        <td className="px-4 py-3 text-gray-500 italic" onClick={() => startEdit(idx, word)}>{word.example}</td>
                                                        <td className="px-4 py-3 text-right">
                                                            <button onClick={() => deleteWord(idx)} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500">
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                        {results.length === 0 && !isProcessing && (
                                            <tr>
                                                <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                                                    인식된 단어가 없습니다.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                <div className="border-t p-4 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 rounded-b-2xl">
                    {step === 1 ? (
                        <div className="flex justify-end">
                            <button
                                onClick={processImages}
                                disabled={selectedFiles.length === 0}
                                className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-md transition-transform hover:bg-blue-700 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                            >
                                인식 시작 ({selectedFiles.length}장)
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            {/* Group Selection */}
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">저장할 단어장 폴더</label>
                                {isCreatingNewGroup ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={newGroupName}
                                            onChange={(e) => setNewGroupName(e.target.value)}
                                            placeholder="새 폴더 이름"
                                            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => setIsCreatingNewGroup(false)}
                                            className="rounded-xl border border-gray-200 p-3 text-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={selectedGroupId}
                                            onChange={(e) => setSelectedGroupId(e.target.value)}
                                            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                                        >
                                            <option value="" disabled>확인할 폴더를 선택하세요</option>
                                            {groups.map(g => (
                                                <option key={g.id} value={g.id}>{g.name}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => setIsCreatingNewGroup(true)}
                                            className="flex shrink-0 items-center gap-1 rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                        >
                                            <Plus className="h-4 w-4" />
                                            새 폴더
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 shrink-0">
                                <button
                                    onClick={() => setStep(1)}
                                    disabled={isProcessing}
                                    className="rounded-xl px-6 py-3 font-medium text-gray-600 hover:bg-gray-200 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    다시 찍기
                                </button>
                                <button
                                    onClick={handleSaveAll}
                                    disabled={isProcessing || results.length === 0}
                                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-bold text-white shadow-md transition-transform hover:from-blue-700 hover:to-purple-700 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                                >
                                    <Check className="h-5 w-5" />
                                    전체 저장
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
