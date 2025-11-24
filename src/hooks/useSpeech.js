import { useCallback } from 'react';

export const useSpeech = () => {
    const speak = useCallback((text, options = {}) => {
        if (!window.speechSynthesis) return;

        // Cancel any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
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
