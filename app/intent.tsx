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
                <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
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
                        style={[styles.card, { borderColor: '#333' }]}
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
        backgroundColor: '#121212',
    },
    header: {
        padding: 24,
    },
    title: {
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#888',
        marginTop: 8,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
        gap: 16,
    },
    card: {
        width: '47%',
        aspectRatio: 1,
        backgroundColor: '#1E1E1E',
        borderRadius: 24,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
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
        color: 'white',
        fontWeight: 'bold',
    },
});
