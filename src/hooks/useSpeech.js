import { useCallback } from 'react';

export const useSpeech = () => {
    const speak = useCallback((text, options = {}) => {
        if (!window.speechSynthesis) {
            console.error('Speech synthesis not supported');
            return;
        }

        console.log('TTS: Speaking text:', text);

        // Cancel any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Auto-detect language: if text contains Chinese characters, use zh-CN
        const hasChinese = /[\u4e00-\u9fa5]/.test(text);
        const hasKorean = /[\uac00-\ud7af\u1100-\u11ff\u3130-\u318f]/.test(text);

        if (hasChinese) {
            utterance.lang = 'zh-CN';
            console.log('TTS: Detected Chinese, using zh-CN');
        } else if (hasKorean) {
            utterance.lang = 'ko-KR';
            console.log('TTS: Detected Korean, using ko-KR');
        } else {
            utterance.lang = 'en-US';
            console.log('TTS: Using English en-US');
        }

        utterance.rate = options.rate || 1.0;

        // Try to find an appropriate voice
        const voices = window.speechSynthesis.getVoices();
        console.log('Available voices:', voices.length);

        if (voices.length > 0) {
            // Find voice matching the language
            const matchingVoice = voices.find(v => v.lang.startsWith(utterance.lang.split('-')[0]));
            if (matchingVoice) {
                utterance.voice = matchingVoice;
                console.log('TTS: Using voice:', matchingVoice.name, matchingVoice.lang);
            } else {
                console.warn('TTS: No matching voice found for', utterance.lang);
            }
        }

        if (options.voiceURI) {
            const selectedVoice = voices.find(v => v.voiceURI === options.voiceURI);
            if (selectedVoice) {
                utterance.voice = selectedVoice;
                console.log('TTS: Using custom voice:', selectedVoice.name);
            }
        }

        utterance.onstart = () => console.log('TTS: Started speaking');
        utterance.onend = () => console.log('TTS: Finished speaking');
        utterance.onerror = (e) => console.error('TTS Error:', e);

        window.speechSynthesis.speak(utterance);
    }, []);

    const getVoices = useCallback(() => {
        if (!window.speechSynthesis) return [];
        return window.speechSynthesis.getVoices().filter(voice =>
            voice.lang.includes('en') // Filter for English voices
        );
    }, []);

    return { speak, getVoices };
};
