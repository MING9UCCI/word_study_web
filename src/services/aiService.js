// Gemini API Service for AI auto-completion and Vision
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export const aiService = {
    /**
     * Generate definition and example for a word using Gemini API
     * @param {string} word - English word to define
     * @param {string} apiKey - Gemini API key
     * @returns {Promise<{meaning: string, example: string}>}
     */
    async generateWordData(word, apiKey) {
        if (!apiKey) {
            throw new Error('Gemini API 키가 설정되지 않았습니다. 설정에서 추가해주세요.');
        }

        try {
            const prompt = `Please provide for the English word "${word}":
1. Korean meaning (brief, 1-2 words). If it has only one meaning, just write "[Part of Speech] Meaning" without any slashes. If multiple, separate with " / ". Example: [명] 구입(품) / [동] ~을 구입하다
2. Example sentence in English (TOEIC context)

Format your response strictly as JSON:
{
  "meaning": "Korean meaning here",
  "example": "Example sentence here"
}`;

            const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        responseMimeType: "application/json"
                    }
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'API 요청 실패');
            }

            const data = await response.json();
            const contentText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
            const parsed = JSON.parse(contentText);
            
            return {
                meaning: parsed.meaning || '',
                example: parsed.example || ''
            };
        } catch (error) {
            console.error('AI Service Error:', error);
            throw new Error('AI 분석 중 오류가 발생했습니다: ' + error.message);
        }
    },

    /**
     * Extract vocabulary words from a base64 image using Gemini Vision API
     * @param {string} imageBase64 - Base64 encoded image string (with or without data URL prefix)
     * @param {string} apiKey - Gemini API key
     * @returns {Promise<Array<{english: string, korean: string, example: string}>>}
     */
    async recognizeVocabularyFromImage(imageBase64, apiKey) {
        if (!apiKey) {
            throw new Error('Gemini API 키가 설정되지 않았습니다. 설정에서 추가해주세요.');
        }

        try {
            // Strip data:image/...;base64, prefix if present
            const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
            
            // Extract the actual mime type if it was present, otherwise default to jpeg
            let mimeType = 'image/jpeg';
            const match = imageBase64.match(/^data:(image\/(png|jpeg|jpg|webp));base64,/);
            if (match) {
                mimeType = match[1];
            }

            const prompt = `This is a picture of a vocabulary book (English or Chinese). 
Please extract all entries (words, phrases, or conversational sentences).
For each entry, provide:
1. "english": The front of the card. 
   - For English books: the English word/phrase.
   - For Chinese books: the Chinese characters (Hanzi).
2. "pronunciation": 
   - For Chinese books: provide the Pinyin with tone marks (e.g., "wǒ zài xiūxi ne").
   - For English books: optional IPA or empty string.
3. "korean": The Korean meaning.
   - Include part of speech like [명], [동] if applicable.
   - Separate multiple meanings with " / ".
4. "example": An example sentence or usage.

INTELLIGENT PROCESSING (Especially for Chinese patterns):
- If the image contains repeating pattern exercises (e.g., "我在...呢" with multiple variations like "我在休息呢", "我在睡觉呢"), please split them into individual useful entries.
- For conversational sentences, keep the logical flow but extract meaningful chunks if they are presented as vocabulary items.
- Detect the language from the image automatically and format accordingly.

Format your response STRICTLY as a JSON array of objects:
[
  {
    "english": "word or sentence",
    "pronunciation": "pinyin or empty",
    "korean": "[품사] 뜻",
    "example": "usage example"
  }
]`;

            const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: prompt },
                            {
                                inlineData: {
                                    mimeType: mimeType,
                                    data: base64Data
                                }
                            }
                        ]
                    }],
                    generationConfig: {
                        temperature: 0.2, // Low temperature for extraction accuracy
                        responseMimeType: "application/json"
                    }
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'API 요청 실패');
            }

            const data = await response.json();
            const contentText = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
            
            let parsedWords = [];
            try {
                parsedWords = JSON.parse(contentText);
            } catch (e) {
                console.error("Failed to parse JSON response:", contentText);
                throw new Error("AI가 반환한 데이터를 파싱할 수 없습니다.");
            }

            if (!Array.isArray(parsedWords)) {
                if (parsedWords.words && Array.isArray(parsedWords.words)) {
                    parsedWords = parsedWords.words;
                } else if (parsedWords.vocabulary && Array.isArray(parsedWords.vocabulary)) {
                    parsedWords = parsedWords.vocabulary;
                } else {
                    throw new Error("AI가 예상치 못한 구조의 데이터를 반환했습니다.");
                }
            }

            return parsedWords;
        } catch (error) {
            console.error('AI Vision Error:', error);
            throw new Error('사진 인식 중 오류가 발생했습니다: ' + error.message);
        }
    },

    /**
     * Validate API key by making a minimal test request
     */
    async validateApiKey(apiKey) {
        try {
            const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: 'test' }] }],
                    generationConfig: { maxOutputTokens: 5 }
                })
            });
            return response.ok;
        } catch {
            return false;
        }
    }
};
