import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Keyboard, ActivityIndicator, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { Mic, Send, Volume2, X, Play, Loader2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { generateSpeech, playAudio } from '../services/voiceService';
import { askCoach } from '../services/aiConsultant';
import { WorkoutExercise } from '../types';

interface PersistentAssistantProps {
    exercise: WorkoutExercise | null;
    context?: string;
    onPausedChange?: (paused: boolean) => void;
}

export default function PersistentAssistant({ exercise, context = '', onPausedChange }: PersistentAssistantProps) {
    const insets = useSafeAreaInsets();
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [response, setResponse] = useState<string | null>(null);
    const [audioLoading, setAudioLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false); // Visual state for now

    const handleSubmit = async () => {
        if (!input.trim()) return;
        const query = input;
        setInput('');
        Keyboard.dismiss();

        setIsThinking(true);
        onPausedChange?.(true);

        const answer = await askCoach(query, exercise, context);

        setResponse(answer);
        setIsThinking(false);

        // Auto-play TTS? Maybe optional.
    };

    const handlePlayTTS = async () => {
        if (!response || audioLoading) return;
        setAudioLoading(true);
        const audioUri = await generateSpeech(response);
        if (audioUri) {
            await playAudio(audioUri);
        }
        setAudioLoading(false);
    };

    const handleResume = () => {
        setResponse(null);
        onPausedChange?.(false);
    };

    return (
        <View style={[styles.container, { bottom: insets.bottom + 20 }]} pointerEvents="box-none">

            {/* Thinking Bubble */}
            {isThinking && (
                <View style={styles.thinkingBubble}>
                    <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
                        <ActivityIndicator color="#3B82F6" size="small" />
                        <Text style={styles.thinkingText}>COACH IS DRAFTING...</Text>
                    </BlurView>
                </View>
            )}

            {/* Response Card */}
            {response && (
                <View style={styles.responseContainer}>
                    <BlurView intensity={40} tint="dark" style={styles.responseCard}>
                        <TouchableOpacity style={styles.closeButton} onPress={handleResume}>
                            <X size={16} color="#A1A1AA" />
                        </TouchableOpacity>

                        <Text style={styles.responseText}>{response}</Text>

                        <View style={styles.responseActions}>
                            <TouchableOpacity
                                style={styles.actionButtonSecondary}
                                onPress={handlePlayTTS}
                                disabled={audioLoading}
                            >
                                {audioLoading ? <ActivityIndicator size="small" color="#FFF" /> : <Volume2 size={16} color="#FFF" />}
                                <Text style={styles.actionText}>{audioLoading ? 'LOADING' : 'LISTEN'}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButtonPrimary} onPress={handleResume}>
                                <Play size={16} color="#FFF" fill="#FFF" />
                                <Text style={styles.actionText}>RESUME</Text>
                            </TouchableOpacity>
                        </View>
                    </BlurView>
                </View>
            )}

            {/* Input Bar */}
            <BlurView intensity={80} tint="light" style={styles.inputBar}>
                <TouchableOpacity
                    style={[styles.micButton, isRecording && styles.micActive]}
                    onPress={() => {
                        // In a real native app, we'd start Expo AV recording here.
                        // For MVP, we'll just toggle visual state or focus input for dictation.
                        setIsRecording(!isRecording);
                    }}
                >
                    <Mic size={20} color={isRecording ? '#FFF' : '#18181B'} />
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder={isThinking ? "Thinking..." : "Consult with Mike..."}
                    placeholderTextColor="#A1A1AA"
                    returnKeyType="send"
                    onSubmitEditing={handleSubmit}
                />

                <TouchableOpacity
                    style={[styles.sendButton, (!input.trim() || isThinking) && styles.sendDisabled]}
                    onPress={handleSubmit}
                    disabled={!input.trim() || isThinking}
                >
                    <Send size={18} color="#FFF" />
                </TouchableOpacity>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 20,
        right: 20,
        zIndex: 1000,
        alignItems: 'center',
    },
    thinkingBubble: {
        marginBottom: 12,
        borderRadius: 20,
        overflow: 'hidden',
    },
    blurContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8, // px-4 py-2
        backgroundColor: 'rgba(24, 24, 27, 0.8)', // zinc-900/80
        gap: 8,
    },
    thinkingText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    responseContainer: {
        width: '100%',
        marginBottom: 16,
        borderRadius: 32, // [2.5rem]
        overflow: 'hidden',
        // Shadows are hard on BlurView, wrapper needed
    },
    responseCard: {
        padding: 24,
        backgroundColor: 'rgba(24, 24, 27, 0.95)', // zinc-900/95
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    responseText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
        lineHeight: 24,
        marginBottom: 20,
        paddingRight: 24,
    },
    responseActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    actionButtonSecondary: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 100,
        gap: 8,
    },
    actionButtonPrimary: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2563EB',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 100,
        gap: 8,
    },
    actionText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderRadius: 40,
        width: '100%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    micButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F4F4F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    micActive: {
        backgroundColor: '#EF4444', // red-500
    },
    input: {
        flex: 1,
        height: 48,
        fontSize: 14, // text-sm
        fontWeight: '600',
        color: '#18181B',
    },
    sendButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    sendDisabled: {
        backgroundColor: '#E4E4E7', // zinc-200
    }
});
