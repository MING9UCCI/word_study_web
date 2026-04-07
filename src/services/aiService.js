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

            const prompt = `This is a picture of a vocabulary book (like a TOEIC vocab book).
Please extract all the vocabulary entries you can read from the image.
For each entry, provide:
1. "english": the English word.
2. "korean": the Korean meaning.
   - Include the part of speech in brackets like [명], [동], [형], etc.
   - If there is ONLY ONE meaning, just write it normally (e.g. "[명] 구입(품)"). DO NOT use the slash (/) character.
   - If there are MULTIPLE meanings, separate them with " / " (e.g. "[명] 구입(품) / [동] ~을 구입하다").
3. "example": the English example sentence.

Format your response STRICTLY as a JSON array of objects without any markdown blocks outside the array:
[
  {
    "english": "purchase",
    "korean": "[명] 구입(품) / [동] ~을 구입하다",
    "example": "the receipt for your recent purchase"
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
