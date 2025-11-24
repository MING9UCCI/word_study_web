import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Key, Moon, Sun, Volume2, VolumeX, Save, X } from 'lucide-react';
import { aiService } from '../services/aiService';

export const Settings = ({ darkMode, onToggleDarkMode, ttsSettings, onTTSChange, onClose }) => {
    const [apiKey, setApiKey] = useState(localStorage.getItem('openai-api-key') || '');
    const [isValidating, setIsValidating] = useState(false);
    const [validationMessage, setValidationMessage] = useState('');

    const handleSaveApiKey = async () => {
        if (!apiKey.trim()) {
            setValidationMessage('API 키를 입력해주세요.');
            return;
        }

        setIsValidating(true);
        setValidationMessage('API 키 확인 중...');

        try {
            const isValid = await aiService.validateApiKey(apiKey);
            if (isValid) {
                localStorage.setItem('openai-api-key', apiKey);
                setValidationMessage('✓ API 키가 저장되었습니다!');
            } else {
                setValidationMessage('✗ 유효하지 않은 API 키입니다.');
            }
        } catch (error) {
            setValidationMessage('✗ API 키 확인 실패');
        } finally {
            setIsValidating(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <SettingsIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">설정</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* AI Settings */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Key className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI 자동 완성</h3>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm text-gray-600 dark:text-gray-400">
                                OpenAI API 키
                            </label>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="sk-..."
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white"
                            />
                            <button
                                onClick={handleSaveApiKey}
                                disabled={isValidating}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors"
                            >
                                <Save className="w-4 h-4" />
                                {isValidating ? '확인 중...' : 'API 키 저장'}
                            </button>
                            {validationMessage && (
                                <p className={`text-sm ${validationMessage.includes('✓') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {validationMessage}
                                </p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                API 키는 브라우저에만 저장되며 외부로 전송되지 않습니다.
                            </p>
                        </div>
                    </div>

                    {/* Appearance */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">외관</h3>
                        <button
                            onClick={onToggleDarkMode}
                            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                            <span className="text-gray-900 dark:text-white">다크 모드</span>
                            {darkMode ? (
                                <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            ) : (
                                <Sun className="w-5 h-5 text-yellow-600" />
                            )}
                        </button>
                    </div>

                    {/* TTS Settings */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">음성 설정</h3>

                        <button
                            onClick={() => onTTSChange({ ...ttsSettings, enabled: !ttsSettings.enabled })}
                            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                            <span className="text-gray-900 dark:text-white">자동 발음</span>
                            {ttsSettings.enabled ? (
                                <Volume2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                            ) : (
                                <VolumeX className="w-5 h-5 text-gray-400" />
                            )}
                        </button>

                        <div className="space-y-2">
                            <label className="block text-sm text-gray-600 dark:text-gray-400">
                                발음 속도
                            </label>
                            <input
                                type="range"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={ttsSettings.rate}
                                onChange={(e) => onTTSChange({ ...ttsSettings, rate: parseFloat(e.target.value) })}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>느림</span>
                                <span>{ttsSettings.rate}x</span>
                                <span>빠름</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};
