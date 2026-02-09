import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Trophy, Play, Pause, ChevronRight, RotateCcw, Coffee, BookOpen } from 'lucide-react-native';
import { useUserStore } from '../store/useUserStore';
import { LinearGradient } from 'expo-linear-gradient';
import PersistentAssistant from '../components/PersistentAssistant';

const REST_TIME = 60; // 60s Rest
// Avatars from constants (mocked here based on reference)
const AVATAR_URLS = {
    squatting: 'https://img.freepik.com/premium-photo/3d-render-young-man-with-athletic-body-wearing-fitness-clothes-shorts-standing-pose_1142-45230.jpg?w=800',
    rest: 'https://img.freepik.com/free-photo/young-fitness-man-studio_7502-5008.jpg?w=800' // Placeholder for rest
};

type InternalState = 'EXERCISE' | 'REST' | 'COMPLETE';

export default function ActiveScreen() {
    const router = useRouter();
    const { currentSession } = useUserStore();

    // State
    const [exerciseIdx, setExerciseIdx] = useState(0);
    const [internalState, setInternalState] = useState<InternalState>('EXERCISE');
    const [timeLeft, setTimeLeft] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [totalTime, setTotalTime] = useState(0);

    // Initial Setup
    useEffect(() => {
        if (currentSession && currentSession.exercises.length > 0) {
            setTimeLeft(currentSession.exercises[0].time || 45);
        }
    }, [currentSession]);

    // Cleanup on unmount or finish
    useEffect(() => {
        // Global Timer
        const interval = setInterval(() => {
            if (!isPaused && internalState !== 'COMPLETE') {
                setTotalTime(t => t + 1);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [isPaused, internalState]);

    // Active Timer
    useEffect(() => {
        if (isPaused || internalState === 'COMPLETE') return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handlePhaseTransition();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isPaused, internalState, exerciseIdx]); // Re-bind when state/index changes

    if (!currentSession || !currentSession.exercises || currentSession.exercises.length === 0) {
        // Fallback or Loading state could go here, but for now just return null or redirect
        // Ideally we should have been redirected already if generation failed.
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>No exercises found.</Text>
                <Button onPress={() => router.replace('/home')}>Go Home</Button>
            </View>
        );
    }

    const currentExercise = currentSession.exercises[exerciseIdx];
    const isLast = exerciseIdx >= currentSession.exercises.length - 1;

    const handlePhaseTransition = () => {
        if (internalState === 'EXERCISE') {
            if (isLast) {
                setInternalState('COMPLETE');
            } else {
                setInternalState('REST');
                setTimeLeft(REST_TIME);
            }
        } else if (internalState === 'REST') {
            setInternalState('EXERCISE');
            setExerciseIdx(prev => prev + 1);
            // Next exercise time
            const nextEx = currentSession.exercises[exerciseIdx + 1];
            setTimeLeft(nextEx?.time || 45);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (internalState === 'COMPLETE') {
        return (
            <View style={styles.completeContainer}>
                <LinearGradient colors={['#F8FAFC', '#FFFFFF']} style={StyleSheet.absoluteFill} />
                <View style={styles.trophyBox}>
                    <Trophy size={48} color="#FFFFFF" />
                </View>
                <Text style={styles.completeTitle}>Session Complete</Text>
                <Text style={styles.completeSubtitle}>Professional standard achieved.</Text>
                <Button
                    mode="contained"
                    onPress={() => router.replace('/home')}
                    style={styles.exitButton}
                    contentStyle={{ height: 60 }}
                >
                    Exit
                </Button>
            </View>
        );
    }

    const maxTime = internalState === 'EXERCISE' ? (currentExercise?.time || 45) : REST_TIME;
    const progress = Math.max(0, Math.min(100, ((maxTime - timeLeft) / maxTime) * 100));

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                {/* Background Image Layer */}
                <View style={styles.imageLayer}>
                    <Image
                        source={{ uri: internalState === 'REST' ? AVATAR_URLS.rest : AVATAR_URLS.squatting }}
                        style={[
                            styles.bgImage,
                            { opacity: isPaused ? 0.6 : 1, transform: [{ scale: isPaused ? 1.05 : 1 }] }
                        ]}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['rgba(239,246,255,0.4)', 'rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
                        style={StyleSheet.absoluteFill}
                    />

                    {internalState === 'REST' && (
                        <View style={styles.restOverlay}>
                            <Coffee size={64} color="#EA580C" style={{ marginBottom: 16 }} />
                            <Text style={styles.restText}>RECOVERY</Text>
                        </View>
                    )}
                </View>

                <SafeAreaView style={styles.safeArea}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.replace('/home')} style={styles.blurButton}>
                            <X size={20} color="#18181B" />
                        </TouchableOpacity>
                        <View style={styles.timerBox}>
                            <Text style={styles.timerLabel}>WORKOUT TIME</Text>
                            <Text style={styles.timerValue}>{formatTime(totalTime)}</Text>
                        </View>
                        <View style={{ width: 40 }} />
                    </View>

                    {/* Floating Tag */}
                    <View style={styles.tagContainer}>
                        <View style={[styles.tag, internalState === 'REST' && styles.tagRest]}>
                            <Text style={[styles.tagText, internalState === 'REST' && styles.tagTextRest]}>
                                {internalState === 'REST' ? 'RECOVERY' : `Set 01/${currentExercise?.sets}`}
                            </Text>
                        </View>
                    </View>

                    <View style={{ flex: 1 }} />

                    {/* Bottom Card */}
                    <View style={styles.bottomCard}>
                        <View style={styles.cardHeader}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.exerciseTitle} numberOfLines={1}>
                                    {internalState === 'REST' ? 'Recovery' : currentExercise.name}
                                </Text>
                                <View style={styles.chips}>
                                    {(currentExercise.targets || []).slice(0, 2).map((t, i) => (
                                        <View key={i} style={styles.chip}>
                                            <Text style={styles.chipText}>{t}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                            <Text style={[styles.bigTimer, internalState === 'REST' && { color: '#EA580C' }]}>
                                {formatTime(timeLeft)}
                            </Text>
                        </View>

                        {/* Instruction */}
                        {internalState === 'EXERCISE' && (
                            <View style={styles.instructionBox}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                    <BookOpen size={12} color="#A1A1AA" />
                                    <Text style={styles.instructionLabel}>INSTRUCTION</Text>
                                </View>
                                <Text style={styles.instructionText}>{currentExercise.description}</Text>
                            </View>
                        )}

                        {/* Progress Bar */}
                        <View style={styles.progressTrack}>
                            <View
                                style={[
                                    styles.progressFill,
                                    { width: `${progress}%`, backgroundColor: internalState === 'REST' ? '#EA580C' : '#2563EB' }
                                ]}
                            />
                        </View>

                        {/* Controls */}
                        <View style={styles.controls}>
                            <TouchableOpacity style={styles.controlSmall} onPress={() => setTimeLeft(internalState === 'EXERCISE' ? (currentExercise?.time || 45) : REST_TIME)}>
                                <RotateCcw size={24} color="#A1A1AA" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.playButton, isPaused && styles.playButtonPaused]}
                                onPress={() => setIsPaused(!isPaused)}
                            >
                                {isPaused ? <Play size={40} color="#FFFFFF" fill="#FFFFFF" /> : <Pause size={40} color="#FFFFFF" fill="#FFFFFF" />}
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.controlSmall} onPress={handlePhaseTransition}>
                                <ChevronRight size={24} color="#A1A1AA" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>

                {/* Persistent Assistant */}
                <PersistentAssistant
                    exercise={internalState === 'EXERCISE' ? currentExercise : null}
                    context={currentSession.hypeText}
                    onPausedChange={setIsPaused} // Pause timer when chatting
                />
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    imageLayer: {
        ...StyleSheet.absoluteFillObject,
        bottom: 200, // Leave space for card
    },
    bgImage: {
        width: '100%',
        height: '100%',
    },
    restOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,237,213, 0.4)', // orange-100/40
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(5px)' // Note: Standard RN doesn't support this easily without Expo BlurView
    },
    restText: {
        fontSize: 24,
        fontWeight: '900',
        color: '#EA580C', // orange-600
        letterSpacing: 4,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    blurButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timerBox: {
        alignItems: 'center',
    },
    timerLabel: {
        fontSize: 9,
        fontWeight: '900',
        color: '#A1A1AA',
        letterSpacing: 2,
    },
    timerValue: {
        fontSize: 18,
        fontWeight: '900',
        color: '#18181B',
    },
    tagContainer: {
        marginTop: 24,
        paddingHorizontal: 32,
    },
    tag: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    tagRest: {
        borderColor: '#FED7AA',
    },
    tagText: {
        fontSize: 12,
        fontWeight: '900',
        color: '#18181B',
        letterSpacing: 1,
    },
    tagTextRest: {
        color: '#EA580C',
    },
    bottomCard: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 48,
        borderTopRightRadius: 48,
        padding: 32,
        paddingBottom: 40,
        marginBottom: 80, // Leave space for Persistent Assistant
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    exerciseTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#18181B',
        marginBottom: 8,
    },
    chips: {
        flexDirection: 'row',
        gap: 8,
    },
    chip: {
        backgroundColor: '#F4F4F5',
        paddingHorizontal: 8, // px-2
        paddingVertical: 2,   // py-0.5
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#E4E4E7',
    },
    chipText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#71717A',
        textTransform: 'uppercase',
    },
    bigTimer: {
        fontSize: 32,
        fontWeight: '900',
        color: '#2563EB',
        fontVariant: ['tabular-nums'],
    },
    instructionBox: {
        backgroundColor: '#FAFAFA',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F4F4F5',
        marginBottom: 24,
    },
    instructionLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: '#A1A1AA',
        letterSpacing: 1,
        marginLeft: 8,
    },
    instructionText: {
        fontSize: 12,
        color: '#71717A',
        lineHeight: 18,
    },
    progressTrack: {
        height: 12, // h-3
        backgroundColor: '#F4F4F5',
        borderRadius: 6,
        marginBottom: 32,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 6,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    controlSmall: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FAFAFA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButton: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: '#18181B',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    playButtonPaused: {
        backgroundColor: '#2563EB',
        shadowColor: "#2563EB",
    },
    completeContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    trophyBox: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#18181B',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    completeTitle: {
        fontSize: 30,
        fontWeight: '900',
        color: '#18181B',
        marginBottom: 8,
    },
    completeSubtitle: {
        fontSize: 16,
        color: '#71717A',
        marginBottom: 40,
    },
    exitButton: {
        width: '100%',
        borderRadius: 30,
        backgroundColor: '#18181B',
    }
});
