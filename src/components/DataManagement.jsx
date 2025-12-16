import React, { useRef } from 'react';
import { Download, Upload, Printer, Package } from 'lucide-react';

export const DataManagement = ({ onImport, onExport, onLoadDefaults, onImportChinese }) => {
    const fileInputRef = useRef(null);

    const handlePrint = () => {
        window.print();
    };

    const handleExport = () => {
        const data = onExport();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `toeic-vocab-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const success = onImport(event.target.result);
            if (success) {
                alert('Data imported successfully!');
            } else {
                alert('Failed to import data. Invalid format.');
            }
            e.target.value = ''; // Reset input
        };
        reader.readAsText(file);
    };

    return (
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800 no-print">
            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Data Management</h3>
            <div className="flex gap-4">
                <button
                    onClick={handlePrint}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-purple-50 py-3 font-medium text-purple-600 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400"
                >
                    <Printer className="h-5 w-5" />
                    Print / PDF
                </button>
                <button
                    onClick={handleExport}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-50 py-3 font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
                >
                    <Download className="h-5 w-5" />
                    Export JSON
                </button>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-100 py-3 font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                >
                    <Upload className="h-5 w-5" />
                    Import
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImport}
                    accept=".json"
                    className="hidden"
                />
            </div>

            {onLoadDefaults && (
                <div className="mt-4 space-y-3">
                    <button
                        onClick={onLoadDefaults}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 py-3 font-medium text-white hover:from-green-600 hover:to-emerald-700 transition-all shadow-md"
                    >
                        <Package className="h-5 w-5" />
                        추천 TOEIC 세트 불러오기 (90개 단어)
                    </button>

                    {onImportChinese && (
                        <button
                            onClick={onImportChinese}
                            className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 py-3 font-medium text-white hover:from-red-600 hover:to-orange-600 transition-all shadow-md"
                        >
                            <Package className="h-5 w-5" />
                            🇨🇳 중국어 단어장 불러오기
                        </button>
                    )}
                </div>
            )}

            <p className="mt-3 text-center text-xs text-gray-400">
                Backup your words or transfer them to another device.
            </p>
        </div>
    );
};
