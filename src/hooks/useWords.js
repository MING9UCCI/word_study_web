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

    const addGroup = (name, customId = null) => {
        const id = customId || Date.now().toString();
        const newGroup = {
            id,
            name,
            createdAt: Date.now(),
        };
        setGroups(prev => [...prev, newGroup]);
        return id;
    };

    const editGroup = (id, newName) => {
        setGroups(prev => prev.map(g =>
            g.id === id ? { ...g, name: newName } : g
        ));
    };

    const deleteGroup = (id) => {
        if (id === 'default') return; // Prevent deleting default group
        setGroups(prev => prev.filter(g => g.id !== id));
        setWords(prev => prev.filter(w => w.groupId !== id));
    };

    const addWord = (english, korean, groupId = 'default', example = '', pronunciation = '') => {
        const newWord = {
            id: Date.now().toString(),
            english,
            korean,
            example,
            pronunciation,
            memorized: false,
            groupId,
            createdAt: Date.now(),
            level: 0,
            nextReview: Date.now()
        };
        setWords(prev => [newWord, ...prev]);
    };

    const editWord = (id, newEnglish, newKorean, newPronunciation = '') => {
        setWords(prev => prev.map(word =>
            word.id === id ? { ...word, english: newEnglish, korean: newKorean, pronunciation: newPronunciation } : word
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

    const updateWordProgress = (id, isCorrect) => {
        setWords(prev => prev.map(w => {
            if (w.id !== id) return w;

            // SRS Intervals: 1d, 3d, 7d, 14d, 30d
            const intervals = [1, 3, 7, 14, 30];
            let newLevel = w.level || 0;

            if (isCorrect) {
                newLevel = Math.min(newLevel + 1, 5);
            } else {
                newLevel = 0; // Reset if forgotten
            }

            const nextReview = new Date();
            if (newLevel > 0) {
                nextReview.setDate(nextReview.getDate() + intervals[newLevel - 1]);
            }

            return {
                ...w,
                level: newLevel,
                nextReview: nextReview.getTime(),
                memorized: newLevel >= 5 // Mark as memorized if mastered
            };
        }));
    };

    const importData = (jsonData) => {
        try {
            const data = JSON.parse(jsonData);
            if (data.words && data.groups) {
                // Merge data safely instead of replacing everything
                setGroups(prev => {
                    // Only add groups that don't already exist by id
                    const newGroups = data.groups.filter(newG => !prev.some(g => g.id === newG.id));
                    return [...prev, ...newGroups];
                });
                
                setWords(prev => {
                    // Only add words that don't already exist by id
                    const newWords = data.words.filter(newW => !prev.some(w => w.id === newW.id));
                    return [...newWords, ...prev]; // Put new words at the top
                });
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

    const exportGroup = (groupId) => {
        const groupToExport = groups.find(g => g.id === groupId);
        if (!groupToExport) return null;

        const wordsToExport = words.filter(w => w.groupId === groupId);
        return JSON.stringify({ 
            groups: [groupToExport], 
            words: wordsToExport 
        }, null, 2);
    };

    // Migration helper
    useEffect(() => {
        setWords(prev => prev.map(w => w.groupId ? w : { ...w, groupId: 'default' }));
    }, []);

    const loadDefaultSets = (defaultSets) => {
        // Add default sets as new groups and words
        defaultSets.forEach(set => {
            const groupId = Date.now().toString() + Math.random();
            const newGroup = {
                id: groupId,
                name: set.name,
                createdAt: Date.now()
            };

            const newWords = set.words.map((word, index) => ({
                id: `${groupId}-${index}`,
                english: word.english,
                korean: word.korean,
                example: word.example || '',
                pronunciation: word.pronunciation || '',
                groupId: groupId,
                memorized: false,
                level: 0,
                nextReview: Date.now(),
                createdAt: Date.now()
            }));

            setGroups(prev => [...prev, newGroup]);
            setWords(prev => [...prev, ...newWords]);
        });
    };

    const setData = (newWords, newGroups) => {
        setWords(newWords);
        setGroups(newGroups);
    };

    return {
        words,
        groups,
        addWord,
        editWord,
        deleteWord,
        toggleMemorized,
        updateWordProgress,
        addGroup,
        editGroup,
        deleteGroup,
        importData,
        exportData,
        exportGroup,
        loadDefaultSets,
        setData
    };
};
