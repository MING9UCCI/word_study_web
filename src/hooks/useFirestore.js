import { db } from '../services/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const useFirestore = () => {
    /**
     * Sync local data to Firestore
     * @param {string} userId - User ID from auth
     * @param {Array} words - Words array
     * @param {Array} groups - Groups array
     * @param {Array} memos - Memos array
     */
    const syncToCloud = async (userId, words, groups, memos = []) => {
        if (!userId) {
            throw new Error('User not authenticated');
        }

        try {
            const userDocRef = doc(db, 'users', userId);
            await setDoc(userDocRef, {
                words,
                groups,
                memos,
                lastSynced: new Date().toISOString()
            });

            return true;
        } catch (error) {
            console.error('Sync to cloud error:', error);
            throw error;
        }
    };

    /**
     * Load data from Firestore
     * @param {string} userId - User ID from auth
     * @returns {Promise<{words: Array, groups: Array}>}
     */
    const syncFromCloud = async (userId) => {
        if (!userId) {
            throw new Error('User not authenticated');
        }

        try {
            const userDocRef = doc(db, 'users', userId);
            const docSnap = await getDoc(userDocRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                return {
                    words: data.words || [],
                    groups: data.groups || [],
                    memos: data.memos || [],
                    lastSynced: data.lastSynced
                };
            } else {
                // No cloud data exists yet
                return {
                    words: [],
                    groups: [],
                    lastSynced: null
                };
            }
        } catch (error) {
            console.error('Sync from cloud error:', error);
            throw error;
        }
    };

    /**
     * Merge local and cloud data
     * @param {Array} localWords - Local words
     * @param {Array} cloudWords - Cloud words
     * @param {Array} localGroups - Local groups
     * @param {Array} cloudGroups - Cloud groups
     * @returns {{words: Array, groups: Array}}
     */
    const mergeData = (localWords, cloudWords, localGroups, cloudGroups) => {
        // Create a map of existing IDs
        const wordMap = new Map();
        const groupMap = new Map();

        // Add cloud data first (older data)
        cloudWords.forEach(word => wordMap.set(word.id, word));
        cloudGroups.forEach(group => groupMap.set(group.id, group));

        // Override with local data (newer data takes precedence)
        localWords.forEach(word => wordMap.set(word.id, word));
        localGroups.forEach(group => groupMap.set(group.id, group));

        return {
            words: Array.from(wordMap.values()),
            groups: Array.from(groupMap.values())
        };
    };

    return {
        syncToCloud,
        syncFromCloud,
        mergeData
    };
};
