import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BicepsFlexed, HeartPulse, Activity, Moon } from 'lucide-react-native';

const INTENTS = [
    { id: 'Force', icon: BicepsFlexed, color: '#FFD700' },
    { id: 'Cardio', icon: HeartPulse, color: '#FF6B6B' },
    { id: 'Mobilité', icon: Activity, color: '#4ECDC4' },
    { id: 'Récupération', icon: Moon, color: '#A8A4CE' },
];

export default function IntentScreen() {
    const router = useRouter();
    const theme = useTheme();

    const handleSelect = (intent: string) => {
        // In a real app, we'd store this in a session store or pass it to the generator
        console.log('Selected intent:', intent);
        router.push('/home'); // Or to generation view
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text variant="headlineMedium" style={[styles.title, { color: '#18181B' }]}>
                    Today's Focus
                </Text>
                <Text variant="bodyLarge" style={styles.subtitle}>
                    What are we training today?
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.grid}>
                {INTENTS.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[styles.card, { borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }]}
                        onPress={() => handleSelect(item.id)}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
                            <item.icon size={32} color={item.color} />
                        </View>
                        <Text variant="titleMedium" style={styles.cardTitle}>{item.id}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        padding: 24,
    },
    title: {
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#64748B',
        marginTop: 8,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
        gap: 16,
        justifyContent: 'space-between',
    },
    card: {
        width: '47%',
        aspectRatio: 1,
        borderRadius: 24,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        marginBottom: 16,
        // Shadow for premium feel
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        color: '#18181B',
        fontWeight: '600',
    },
});
