/**
 * Utility functions for word data processing
 */

/**
 * Normalizes a word for fuzzy comparison (deduplication)
 * Rules:
 * 1. If Contains Chinese characters: extracted Hanzi only
 * 2. If English/Other: alphanumeric only, lowercased
 * @param {string} text - The word text to normalize
 * @returns {string} - The normalized key
 */
export const getNormalizedKey = (text) => {
    if (!text) return '';
    
    const lower = text.toLowerCase().trim();
    
    // Check for Chinese characters (Hanzi range)
    const hanziRegex = /[\u4e00-\u9fa5]+/g;
    const hanziMatches = lower.match(hanziRegex);
    
    if (hanziMatches && hanziMatches.length > 0) {
        // Return only the Hanzi characters joined together
        return hanziMatches.join('');
    }
    
    // For English/others, keep only alphanumeric
    return lower.replace(/[^a-z0-9]/g, '');
};
