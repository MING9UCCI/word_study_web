import { useCallback } from 'react';

export const useSpeech = () => {
    const speak = useCallback((text, options = {}) => {
        if (!window.speechSynthesis) return;

        // Cancel any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Auto-detect language: if text contains Chinese characters, use zh-CN
        const hasChinese = /[\u4e00-\u9fa5]/.test(text);
        const hasKorean = /[\uac00-\ud7af\u1100-\u11ff\u3130-\u318f]/.test(text);

        if (hasChinese) {
            utterance.lang = 'zh-CN';
        } else if (hasKorean) {
            utterance.lang = 'ko-KR';
        } else {
            utterance.lang = 'en-US';
        }

        utterance.rate = options.rate || 1.0;

        if (options.voiceURI) {
            const voices = window.speechSynthesis.getVoices();
            const selectedVoice = voices.find(v => v.voiceURI === options.voiceURI);
            if (selectedVoice) utterance.voice = selectedVoice;
        }

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
