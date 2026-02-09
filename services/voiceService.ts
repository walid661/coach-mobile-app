import { Audio } from 'expo-av';

const OPENAI_API_KEY = (process.env.EXPO_PUBLIC_OPENAI_API_KEY || '').trim();

// We'll use OpenAI for high-quality TTS to match the "Puck" vibe from reference
export async function generateSpeech(text: string): Promise<string | null> {
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'mock-key') {
        console.warn("No OpenAI Key for TTS");
        return null;
    }

    try {
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "tts-1",
                input: text,
                voice: "onyx", // Deep, coach-like voice
                response_format: "mp3",
            }),
        });

        if (!response.ok) {
            console.error("TTS Error", await response.text());
            return null;
        }

        const blob = await response.blob();

        // In React Native/Expo, handling Blobs for playback is tricky without saving to FS.
        // However, expo-av can play from a URI. 
        // We need to convert blob to base64 to save or play.
        const reader = new FileReader();
        return new Promise((resolve) => {
            reader.onloadend = () => {
                const base64 = reader.result as string;
                resolve(base64); // Data URI
            };
            reader.readAsDataURL(blob);
        });

    } catch (error) {
        console.error("TTS Failed:", error);
        return null;
    }
}

export async function playAudio(base64Uri: string): Promise<void> {
    try {
        const { sound } = await Audio.Sound.createAsync(
            { uri: base64Uri },
            { shouldPlay: true }
        );
        // We could handle unloading here if needed
        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
                sound.unloadAsync();
            }
        });
    } catch (e) {
        console.error("Playback failed", e);
    }
}
