// OpenAI API Service for AI auto-completion
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const aiService = {
    /**
     * Generate definition and example for a word using OpenAI API
     * @param {string} word - English word to define
     * @param {string} apiKey - OpenAI API key
     * @returns {Promise<{meaning: string, example: string}>}
     */
    async generateWordData(word, apiKey) {
        if (!apiKey) {
            throw new Error('OpenAI API 키가 설정되지 않았습니다.');
        }

        try {
            const response = await fetch(OPENAI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a TOEIC vocabulary assistant. Provide Korean meanings and example sentences for English words.'
                        },
                        {
                            role: 'user',
                            content: `Please provide for the word "${word}":
1. Korean meaning (brief, 1-2 words)
2. Example sentence in English (TOEIC context)

Format your response as JSON:
{
  "meaning": "Korean meaning here",
  "example": "Example sentence here"
}`
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 200
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'API 요청 실패');
            }

            const data = await response.json();
            const content = data.choices[0].message.content;

            // Try to parse JSON response
            try {
                const parsed = JSON.parse(content);
                return {
                    meaning: parsed.meaning || '',
                    example: parsed.example || ''
                };
            } catch {
                // Fallback: extract from text
                const meaningMatch = content.match(/meaning["\s:]+([^"\n]+)/i);
                const exampleMatch = content.match(/example["\s:]+([^"\n]+)/i);

                return {
                    meaning: meaningMatch ? meaningMatch[1].trim() : '',
                    example: exampleMatch ? exampleMatch[1].trim() : ''
                };
            }
        } catch (error) {
            console.error('AI Service Error:', error);
            throw error;
        }
    },

    /**
     * Validate API key by making a test request
     * @param {string} apiKey - OpenAI API key to validate
     * @returns {Promise<boolean>}
     */
    async validateApiKey(apiKey) {
        try {
            const response = await fetch(OPENAI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [{ role: 'user', content: 'test' }],
                    max_tokens: 5
                })
            });

            return response.ok;
        } catch {
            return false;
        }
    }
};
