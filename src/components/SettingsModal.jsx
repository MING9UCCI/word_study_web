import React, { useEffect, useState } from 'react';
import { X, Volume2, Key } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';

export const SettingsModal = ({ isOpen, onClose, settings, onSave }) => {
    const { getVoices, speak } = useSpeech();
    const [availableVoices, setAvailableVoices] = useState([]);
    const [localSettings, setLocalSettings] = useState(settings);
    const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('gemini-api-key') || import.meta.env.VITE_GEMINI_API_KEY || '');

    useEffect(() => {
        if (isOpen) {
            // Voices might load asynchronously
            const loadVoices = () => {
                const voices = getVoices();
                setAvailableVoices(voices);
            };

            loadVoices();
            window.speechSynthesis.onvoiceschanged = loadVoices;
            
            // Reload API key when opening modal
            setGeminiApiKey(localStorage.getItem('gemini-api-key') || import.meta.env.VITE_GEMINI_API_KEY || '');

            return () => {
                window.speechSynthesis.onvoiceschanged = null;
            };
        }
    }, [isOpen, getVoices]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(localSettings);
        localStorage.setItem('gemini-api-key', geminiApiKey);
        onClose();
    };

    const handleTest = () => {
        speak("Hello, this is a test.", localSettings);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
                    <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* API Key Setting */}
                    <div className="space-y-2 border-b border-gray-100 dark:border-gray-700 pb-6">
                        <div className="flex items-center gap-2 mb-1">
                            <Key className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Gemini API Key</h3>
                        </div>
                        <input
                            type="password"
                            value={geminiApiKey}
                            onChange={(e) => setGeminiApiKey(e.target.value)}
                            placeholder="AI Studio API Key"
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        />
                        <p className="text-xs text-gray-400">
                            Required for AI Word autocomplete & Photo import features.
                        </p>
                    </div>

                    {/* Speed Setting */}
                    <div className="space-y-2">
                        <label className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                            <span>Pronunciation Speed</span>
                            <span className="text-blue-600 dark:text-blue-400">{localSettings.rate}x</span>
                        </label>
                        <input
                            type="range"
                            min="0.5"
                            max="2.0"
                            step="0.1"
                            value={localSettings.rate}
                            onChange={(e) => setLocalSettings({ ...localSettings, rate: parseFloat(e.target.value) })}
                            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600 dark:bg-gray-700"
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>Slow</span>
                            <span>Normal</span>
                            <span>Fast</span>
                        </div>
                    </div>

                    {/* Voice Setting */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Voice / Accent</label>
                        <select
                            value={localSettings.voiceURI || ''}
                            onChange={(e) => setLocalSettings({ ...localSettings, voiceURI: e.target.value })}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        >
                            <option value="">Default Voice</option>
                            {availableVoices.map(voice => (
                                <option key={voice.voiceURI} value={voice.voiceURI}>
                                    {voice.name} ({voice.lang})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Test Button */}
                    <button
                        onClick={handleTest}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        <Volume2 className="h-4 w-4" />
                        Test Pronunciation
                    </button>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-[0.98]"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};
