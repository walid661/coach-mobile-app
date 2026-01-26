import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, TextInput, Button, useTheme, ProgressBar, Chip, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, ChevronLeft, Check, AlertCircle } from 'lucide-react-native';
import { useUserStore, SportLevel, MainGoal, Equipment, Pathology } from '../store/useUserStore';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

const STEPS = [
    { id: 'physical', title: 'Stats' },
    { id: 'level_goal', title: 'Level & Goal' },
    { id: 'equipment', title: 'Equipment' },
    { id: 'injuries', title: 'Injuries' },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const theme = useTheme();
    const [currentStep, setCurrentStep] = useState(0);
    const store = useUserStore();

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(curr => curr + 1);
        } else {
            router.push('/intent');
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(curr => curr - 1);
        } else {
            router.back();
        }
    };

    const renderPhysicalStep = () => (
        <View style={styles.stepContainer}>
            <Text variant="headlineMedium" style={[styles.stepTitle, { color: theme.colors.primary }]}>
                Tell us about you
            </Text>
            <View style={styles.inputGap}>
                <TextInput
                    label="Age"
                    value={store.age}
                    onChangeText={(t) => store.setField('age', t)}
                    keyboardType="numeric"
                    mode="outlined"
                    style={styles.input}
                />
                <TextInput
                    label="Height (cm)"
                    value={store.height}
                    onChangeText={(t) => store.setField('height', t)}
                    keyboardType="numeric"
                    mode="outlined"
                    style={styles.input}
                />
                <TextInput
                    label="Weight (kg)"
                    value={store.weight}
                    onChangeText={(t) => store.setField('weight', t)}
                    keyboardType="numeric"
                    mode="outlined"
                    style={styles.input}
                />
            </View>
        </View>
    );

    const renderLevelGoalStep = () => (
        <View style={styles.stepContainer}>
            <Text variant="headlineMedium" style={[styles.stepTitle, { color: theme.colors.primary }]}>
                Fitness Level
            </Text>
            <View style={styles.chipContainer}>
                {(['débutant', 'intermédiaire', 'avancé'] as SportLevel[]).map((level) => (
                    <Card
                        key={level}
                        mode="outlined"
                        style={[
                            styles.cardSelect,
                            store.niveau_sportif === level && { borderColor: theme.colors.primary, backgroundColor: 'rgba(212,175,55,0.1)' }
                        ]}
                        onPress={() => store.setField('niveau_sportif', level)}
                    >
                        <Card.Content style={styles.cardContent}>
                            <Text variant="titleMedium" style={{ textTransform: 'capitalize', color: store.niveau_sportif === level ? theme.colors.primary : 'white' }}>
                                {level}
                            </Text>
                            {store.niveau_sportif === level && <Check size={20} color={theme.colors.primary} />}
                        </Card.Content>
                    </Card>
                ))}
            </View>

            <Text variant="headlineMedium" style={[styles.stepTitle, { color: theme.colors.primary, marginTop: 32 }]}>
                Main Goal
            </Text>
            <View style={styles.chipContainer}>
                {(['perte de poids', 'prise de masse', 'mobilité'] as MainGoal[]).map((goal) => (
                    <Card
                        key={goal}
                        mode="outlined"
                        style={[
                            styles.cardSelect,
                            store.objectif_principal === goal && { borderColor: theme.colors.primary, backgroundColor: 'rgba(212,175,55,0.1)' }
                        ]}
                        onPress={() => store.setField('objectif_principal', goal)}
                    >
                        <Card.Content style={styles.cardContent}>
                            <Text variant="titleMedium" style={{ textTransform: 'capitalize', color: store.objectif_principal === goal ? theme.colors.primary : 'white' }}>
                                {goal}
                            </Text>
                            {store.objectif_principal === goal && <Check size={20} color={theme.colors.primary} />}
                        </Card.Content>
                    </Card>
                ))}
            </View>
        </View>
    );

    const renderEquipmentStep = () => (
        <View style={styles.stepContainer}>
            <Text variant="headlineMedium" style={[styles.stepTitle, { color: theme.colors.primary }]}>
                Available Equipment
            </Text>
            <Text variant="bodyMedium" style={{ color: '#888', marginBottom: 20 }}>
                Select all that apply
            </Text>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {(['Poids du corps', 'Haltères', 'Kettlebell', 'Élastique', 'Barre', 'Banc'] as Equipment[]).map((eq) => (
                    <TouchableOpacity
                        key={eq}
                        onPress={() => store.toggleArrayItem('equipment_disponible', eq)}
                        style={[
                            styles.listItem,
                            store.equipment_disponible.includes(eq) && { borderColor: theme.colors.primary, backgroundColor: 'rgba(212,175,55,0.1)' }
                        ]}
                    >
                        <Text variant="titleMedium" style={{ color: store.equipment_disponible.includes(eq) ? theme.colors.primary : 'white' }}>
                            {eq}
                        </Text>
                        {store.equipment_disponible.includes(eq) && <Check size={20} color={theme.colors.primary} />}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    const renderInjuriesStep = () => (
        <View style={styles.stepContainer}>
            <Text variant="headlineMedium" style={[styles.stepTitle, { color: theme.colors.primary }]}>
                Health & Injuries
            </Text>
            <View style={styles.chipContainer}>
                {(['cardio-vasculaires', 'articulaires', 'hormonales'] as Pathology[]).map((pathology) => (
                    <Chip
                        key={pathology}
                        selected={store.pathologies_connues.includes(pathology)}
                        onPress={() => store.toggleArrayItem('pathologies_connues', pathology)}
                        showSelectedOverlay
                        style={styles.chip}
                        textStyle={{ color: 'white' }}
                    >
                        {pathology}
                    </Chip>
                ))}
            </View>

            <Text variant="titleMedium" style={{ marginTop: 24, marginBottom: 12, color: 'white' }}>Other Limitations</Text>
            <View style={[styles.cardSelect, { borderColor: '#333', padding: 16 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <AlertCircle color="#666" size={24} />
                    <Text style={{ color: '#999' }}>No specific limitations reported</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <ChevronLeft color="white" size={28} />
                </TouchableOpacity>
                <ProgressBar progress={(currentStep + 1) / STEPS.length} color={theme.colors.primary} style={styles.progress} />
                <Text variant="labelSmall" style={styles.stepIndicator}>
                    {currentStep + 1} / {STEPS.length}
                </Text>
            </View>

            <View style={styles.content}>
                {currentStep === 0 && renderPhysicalStep()}
                {currentStep === 1 && renderLevelGoalStep()}
                {currentStep === 2 && renderEquipmentStep()}
                {currentStep === 3 && renderInjuriesStep()}
            </View>

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={handleNext}
                    contentStyle={{ height: 56 }}
                    style={styles.button}
                >
                    {currentStep === STEPS.length - 1 ? 'Complete Profile' : 'Continue'}
                </Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 16,
    },
    backButton: {
        padding: 8,
    },
    progress: {
        flex: 1,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#333',
    },
    stepIndicator: {
        color: '#666',
        width: 40,
        textAlign: 'center',
    },
    content: {
        flex: 1,
        padding: 24,
    },
    stepContainer: {
        flex: 1,
    },
    stepTitle: {
        fontWeight: 'bold',
        marginBottom: 24,
    },
    inputGap: {
        gap: 16,
    },
    input: {
        backgroundColor: '#1E1E1E',
    },
    footer: {
        padding: 24,
    },
    button: {
        borderRadius: 50,
    },
    cardSelect: {
        backgroundColor: '#1E1E1E',
        marginBottom: 12,
        borderColor: '#333',
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        backgroundColor: '#1E1E1E',
    },
    scrollContent: {
        paddingBottom: 20
    },
    listItem: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        backgroundColor: '#1E1E1E'
    }
});
