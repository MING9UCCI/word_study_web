import React from 'react';

export const PrintView = ({ words, groupName }) => {
    return (
        <div className="print-only hidden p-8">
            <div className="mb-6 flex items-center justify-between border-b-2 border-gray-900 pb-4">
                <h1 className="text-2xl font-bold">{groupName || 'Vocabulary List'}</h1>
                <span className="text-gray-500">{words.length} Words</span>
            </div>

            <table className="w-full border-collapse border border-gray-300 text-left text-sm">
                <thead>
                    <tr className="bg-gray-100 italic">
                        <th className="border border-gray-300 p-2 w-1/4">단어 (Word)</th>
                        <th className="border border-gray-300 p-2 w-1/4">발음 (Pronunciation)</th>
                        <th className="border border-gray-300 p-2 w-1/4">뜻 (Meaning)</th>
                        <th className="border border-gray-300 p-2 w-1/4">예문 (Example)</th>
                    </tr>
                </thead>
                <tbody>
                    {words.map((word, idx) => (
                        <tr key={word.id || idx}>
                            <td className="border border-gray-300 p-2 font-bold">{word.english}</td>
                            <td className="border border-gray-300 p-2 text-blue-600">{word.pronunciation || '-'}</td>
                            <td className="border border-gray-300 p-2">{word.korean}</td>
                            <td className="border border-gray-300 p-2 text-gray-600 italic">{word.example || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <footer className="mt-8 border-t pt-4 text-center text-xs text-gray-400">
                Created with MyVoca - {new Date().toLocaleDateString()}
            </footer>
        </div>
    );
};
