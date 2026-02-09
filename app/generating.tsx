import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useUserStore } from '../store/useUserStore';
import { generateWorkout } from '../services/aiService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertTriangle } from 'lucide-react-native';
import { Button } from 'react-native-paper';

const QUOTES = [
    "Coach Mike is optimizing your sets...",
    "Fine-tuning your hotel workout...",
    "Analyzing your goals for maximum gains...",
    "Almost ready, athlete. Stay focused."
];

export default function GeneratingScreen() {
    const theme = useTheme();
    const router = useRouter();
    const [quoteIdx, setQuoteIdx] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const userStore = useUserStore();

    useEffect(() => {
        const interval = setInterval(() => {
            setQuoteIdx(prev => (prev + 1) % QUOTES.length);
        }, 2500);

        // Trigger Generation
        const runGeneration = async () => {
            try {
                // We'll store the result in a global store or pass it via params. 
                // Since Param passing of large objects in Expo Router can be tricky, let's use the Store or a simple global state.
                // For this MVP, let's just add a 'currentSession' to the userStore or a new SessionStore.
                // Actually, let's pass it via params if it's small enough, or use a new store.
                // Let's add 'currentSession' to useUserStore for simplicity right now.

                console.log("GeneratingScreen: Starting generation...");
                const session = await generateWorkout(userStore);
                console.log("GeneratingScreen: Generation complete, session:", session ? "VALID" : "NULL");

                if (session.exercises.length === 0) {
                    setError("No exercises found. Please try different settings.");
                    return;
                }

                userStore.setCurrentSession(session);
                router.replace('/preview');
            } catch (e) {
                console.error("GeneratingScreen Error:", e);
                setError("Something went wrong. Please check your connection.");
            }
        };

        if (!error) runGeneration();


        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {error ? (
                    <View style={{ alignItems: 'center', padding: 20 }}>
                        <AlertTriangle size={64} color="#EF4444" style={{ marginBottom: 24 }} />
                        <Text style={[styles.title, { color: '#EF4444' }]}>Generation Failed</Text>
                        <Text style={[styles.quote, { marginBottom: 32 }]}>{error}</Text>
                        <Button mode="contained" onPress={() => router.replace('/home')} buttonColor="#FFFFFF" textColor="#09090B">
                            Go Home
                        </Button>
                    </View>
                ) : (
                    <>
                        <View style={styles.spinnerContainer}>
                            <View style={styles.spinnerRing} />
                            <ActivityIndicator size="large" color="#2563EB" style={styles.spinner} />
                        </View>

                        <Text style={styles.title}>Designing Journey</Text>

                        <Text style={styles.quote}>
                            {QUOTES[quoteIdx]}
                        </Text>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#09090B', // zinc-950
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        padding: 40,
    },
    spinnerContainer: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 48,
        position: 'relative',
    },
    spinnerRing: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: 'transparent',
        borderTopColor: '#2563EB', // blue-600
        // We would animate rotation here if we had Reanimated setup for it, 
        // but ActivityIndicator does the job for now.
    },
    spinner: {
        transform: [{ scale: 1.5 }]
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 16,
        letterSpacing: -0.5,
    },
    quote: {
        color: '#71717A', // zinc-500
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
    }
});
