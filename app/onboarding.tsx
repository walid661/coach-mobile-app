import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, useTheme, ProgressBar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Check } from 'lucide-react-native';
import { useUserStore, SportLevel, MainGoal, Equipment } from '../store/useUserStore';

const STEPS = [
    {
        id: 'level',
        title: 'Your Level',
        options: ["Débutant", "Intermédiaire", "Avancé"] as const
    },
    {
        id: 'goal',
        title: 'The Goal',
        options: ["Perte de poids", "Prise de masse", "Mobilité", "Cardio Blast", "HIIT"] as const
    },
    {
        id: 'duration',
        title: 'Duration',
        options: ["15 Minutes", "30 Minutes", "45 Minutes"] as const
    },
    {
        id: 'equipment',
        title: 'Equipment',
        options: ["Full Gym", "Haltères", "Poids du corps"] as const
    }
];

export default function OnboardingScreen() {
    const router = useRouter();
    const theme = useTheme();
    const [currentStep, setCurrentStep] = useState(0);
    const store = useUserStore();

    const stepInfo = STEPS[currentStep];

    const handleSelect = (option: string) => {
        // Map to store keys
        const keyMap: Record<string, keyof typeof store> = {
            'level': 'niveau_sportif',
            'goal': 'objectif_principal',
            'duration': 'limitations_physiques_actuelles', // HACK: reusing a field for duration for now or just storing it.
            // Actually, let's just create a new 'duration' field in the store later if needed.
            // For now, we will map usage:
            'equipment': 'equipment_disponible'
        };

        const storeKey = keyMap[stepInfo.id];

        if (stepInfo.id === 'equipment') {
            // For equipment, in the reference it seems to be single select "Full Gym" vs "Bodyweight" based on the options provided in the list ["Full Gym", "Dumbbells Only", "Bodyweight"]
            // But our store expects an array. Let's adapt.
            if (option === 'Full Gym') store.reset(); // clear old
            // Just set as single item array for now to simplify
            store.setField('equipment_disponible', [option as any]);
        } else if (storeKey) {
            store.setField(storeKey as any, option);
        }

        // Auto Advance
        if (currentStep < STEPS.length - 1) {
            setTimeout(() => setCurrentStep(c => c + 1), 300);
        } else {
            // Finish
            router.push('/generating');
        }
    };

    const isSelected = (option: string) => {
        if (stepInfo.id === 'level') return store.niveau_sportif === option;
        if (stepInfo.id === 'goal') return store.objectif_principal === option;
        if (stepInfo.id === 'equipment') return store.equipment_disponible.includes(option as any);
        return false; // duration
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header / Progress */}
            <View style={styles.header}>
                <View style={styles.topRow}>
                    <TouchableOpacity
                        onPress={() => currentStep > 0 ? setCurrentStep(c => c - 1) : router.back()}
                        style={[styles.backButton, { opacity: currentStep === 0 ? 0 : 1 }]}
                        disabled={currentStep === 0}
                    >
                        <ChevronLeft color="#94A3B8" size={24} />
                    </TouchableOpacity>
                    <Text style={styles.stepCounter}>STEP {currentStep + 1} OF {STEPS.length}</Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.progressBarBg}>
                    <View
                        style={[
                            styles.progressBarFill,
                            { width: `${((currentStep + 1) / STEPS.length) * 100}%` }
                        ]}
                    />
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.title}>{stepInfo.title}</Text>

                <ScrollView contentContainerStyle={styles.optionsList}>
                    {stepInfo.options.map((option) => {
                        const selected = isSelected(option);
                        return (
                            <TouchableOpacity
                                key={option}
                                onPress={() => handleSelect(option)}
                                style={[
                                    styles.optionCard,
                                    selected && styles.optionCardSelected
                                ]}
                            >
                                <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                                    {option}
                                </Text>
                                <View style={[styles.circle, selected && styles.circleSelected]}>
                                    {selected && <Check size={16} color="white" strokeWidth={4} />}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 32,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    backButton: {
        padding: 4,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        borderRadius: 20,
    },
    stepCounter: {
        fontSize: 10,
        fontWeight: '900',
        color: '#CBD5E1', // zinc-300
        letterSpacing: 2,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: '#F1F5F9',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#2563EB', // blue-600
        borderRadius: 3,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 36,
        fontWeight: '900',
        color: '#18181B',
        marginBottom: 48,
        letterSpacing: -1,
    },
    optionsList: {
        gap: 16,
        paddingBottom: 40,
    },
    optionCard: {
        width: '100%',
        padding: 24,
        borderRadius: 32, // Large rounded corners like reference
        borderWidth: 2,
        borderColor: '#F8FAFC', // zinc-50
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    optionCardSelected: {
        borderColor: '#2563EB', // blue-600
        backgroundColor: '#EFF6FF', // blue-50
    },
    optionText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#52525B', // zinc-600
    },
    optionTextSelected: {
        color: '#1D4ED8', // blue-700
    },
    circle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F1F5F9', // zinc-100
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleSelected: {
        backgroundColor: '#2563EB',
    }
});
