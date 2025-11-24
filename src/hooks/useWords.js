import { useState, useEffect } from 'react';

const STORAGE_KEY_WORDS = 'toeic-words';
const STORAGE_KEY_GROUPS = 'toeic-groups';

export const useWords = () => {
    const [words, setWords] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY_WORDS);
        return saved ? JSON.parse(saved) : [];
    });

    const [groups, setGroups] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY_GROUPS);
        return saved ? JSON.parse(saved) : [
            { id: 'default', name: 'Default List', createdAt: Date.now() }
        ];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_WORDS, JSON.stringify(words));
    }, [words]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(groups));
    }, [groups]);

    const addGroup = (name) => {
        const newGroup = {
            id: Date.now().toString(),
            name,
            createdAt: Date.now(),
        };
        setGroups(prev => [...prev, newGroup]);
    };

    const editGroup = (id, newName) => {
        setGroups(prev => prev.map(g =>
            g.id === id ? { ...g, name: newName } : g
        ));
    };

    const deleteGroup = (id) => {
        if (id === 'default') return; // Prevent deleting default group
        setGroups(prev => prev.filter(g => g.id !== id));
        // Move words from deleted group to default or delete them? 
        // Let's delete them for now to keep it simple, or we could move them.
        // User didn't specify, but deleting folder usually implies deleting contents.
        setWords(prev => prev.filter(w => w.groupId !== id));
    };

    const addWord = (english, korean, groupId = 'default') => {
        const newWord = {
            id: Date.now().toString(),
            english,
            korean,
            memorized: false,
            groupId, // Associate word with a group
            createdAt: Date.now(),
        };
        setWords(prev => [newWord, ...prev]);
    };

    const editWord = (id, newEnglish, newKorean) => {
        setWords(prev => prev.map(word =>
            word.id === id ? { ...word, english: newEnglish, korean: newKorean } : word
        ));
    };

    const deleteWord = (id) => {
        setWords(prev => prev.filter(word => word.id !== id));
    };

    const toggleMemorized = (id) => {
        setWords(prev => prev.map(word =>
            word.id === id ? { ...word, memorized: !word.memorized } : word
        ));
    };

    const importData = (jsonData) => {
        try {
            const data = JSON.parse(jsonData);
            if (data.words && data.groups) {
                setWords(data.words);
                setGroups(data.groups);
                return true;
            }
            return false;
        } catch (e) {
            console.error("Import failed", e);
            return false;
        }
    };

    const exportData = () => {
        return JSON.stringify({ words, groups }, null, 2);
    };

    // Migration helper: Assign existing words without groupId to 'default'
    useEffect(() => {
        setWords(prev => prev.map(w => w.groupId ? w : { ...w, groupId: 'default' }));
    }, []);

    return {
        words,
        groups,
        addWord,
        editWord,
        deleteWord,
        toggleMemorized,
        addGroup,
        editGroup,
        deleteGroup,
        importData,
        exportData
    };
};
