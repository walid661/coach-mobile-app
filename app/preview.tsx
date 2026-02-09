import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Dumbbell, Quote } from 'lucide-react-native';
import { useUserStore } from '../store/useUserStore';
import { LinearGradient } from 'expo-linear-gradient';

export default function PreviewScreen() {
    const router = useRouter();
    const { currentSession } = useUserStore();

    if (!currentSession) {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeArea}>
                    <Text style={{ textAlign: 'center', marginTop: 100 }}>No Session Found.</Text>
                    <Button onPress={() => router.replace('/generating')}>Generate</Button>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#F8FAFC', '#FFFFFF']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ChevronLeft size={24} color="#18181B" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Session Summary</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 120 }}>
                    <View style={styles.hypeCard}>
                        <LinearGradient
                            colors={['#2563EB', '#3B82F6']}
                            style={StyleSheet.absoluteFill}
                        />
                        <Quote size={80} color="rgba(255,255,255,0.2)" style={styles.quoteIcon} />
                        <Text style={styles.hypeText}>
                            "{currentSession.hypeText}"
                        </Text>
                    </View>

                    <Text style={styles.sectionLabel}>The Exercises</Text>

                    <View style={styles.list}>
                        {currentSession.exercises && currentSession.exercises.map((ex, idx) => (
                            <View key={ex.id || idx} style={styles.exerciseCard}>
                                <View style={styles.iconBox}>
                                    <Dumbbell size={24} color="#2563EB" />
                                </View>
                                <View style={styles.exerciseInfo}>
                                    <Text style={styles.exerciseName} numberOfLines={1}>{ex.name}</Text>
                                    <View style={styles.metaRow}>
                                        <Text style={styles.metaText}>{ex.sets} Sets</Text>
                                        <View style={styles.dot} />
                                        <Text style={styles.metaText}>{ex.reps} Reps</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <Button
                        mode="contained"
                        onPress={() => router.push('/active')}
                        contentStyle={{ height: 80 }}
                        style={styles.startButton}
                        labelStyle={{ fontSize: 20, fontWeight: '900' }}
                    >
                        Begin Session
                    </Button>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#18181B',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    hypeCard: {
        borderRadius: 40,
        padding: 40,
        marginBottom: 32,
        position: 'relative',
        overflow: 'hidden',
        minHeight: 200,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#2563EB",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    quoteIcon: {
        position: 'absolute',
        top: -10,
        left: -10,
        transform: [{ rotate: '12deg' }],
    },
    hypeText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '900',
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 28,
    },
    sectionLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: '#A1A1AA',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 16,
        marginLeft: 4,
    },
    list: {
        gap: 16,
    },
    exerciseCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 8,
        elevation: 1,
        gap: 16,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    exerciseInfo: {
        flex: 1,
    },
    exerciseName: {
        fontSize: 18,
        fontWeight: '900',
        color: '#18181B',
        marginBottom: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    metaText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#A1A1AA',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#E4E4E7',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 32,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderTopWidth: 1,
        borderTopColor: '#F8FAFC',
    },
    startButton: {
        borderRadius: 40,
        backgroundColor: '#2563EB',
        shadowColor: '#BFDBFE',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 10,
        justifyContent: 'center',
    }
});
