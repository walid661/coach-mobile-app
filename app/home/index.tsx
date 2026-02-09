import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, useTheme, Card, Button, Checkbox, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '../../store/useUserStore';
import { generateWorkout } from '../../services/aiService';
import { saveProgram } from '../../services/supabaseService';
import { Calendar, Clock, RotateCcw, Save } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
    const theme = useTheme();
    const router = useRouter();
    const store = useUserStore();

    // If we have a session, we could show a summary card here
    // But for the main flow, "Regenerate" should go back to generating.

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text variant="headlineSmall" style={{ color: '#18181B', fontWeight: 'bold' }}>Dashboard</Text>
                    <Text variant="bodyMedium" style={{ color: '#52525B' }}>Welcome back, Athlete.</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Card style={styles.card} onPress={() => router.push('/generating')}>
                    <Card.Content style={{ alignItems: 'center', padding: 24 }}>
                        <RotateCcw size={32} color={theme.colors.primary} style={{ marginBottom: 16 }} />
                        <Text variant="titleLarge" style={{ fontWeight: 'bold', marginBottom: 8 }}>Generate New Workout</Text>
                        <Text variant="bodyMedium" style={{ textAlign: 'center', color: '#52525B' }}>
                            Based on your current profile.
                        </Text>
                    </Card.Content>
                </Card>

                <Button
                    mode="outlined"
                    onPress={() => router.push('/onboarding')}
                    style={{ marginTop: 24 }}
                >
                    Update Profile
                </Button>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 8,
    },
    content: {
        padding: 24,
        paddingTop: 8,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
        borderRadius: 16,
        padding: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    h1: {
        fontWeight: 'bold',
        marginBottom: 16,
        marginTop: 8,
    },
    h2: {
        fontWeight: '600',
        marginTop: 24,
        marginBottom: 12,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        backgroundColor: '#F8FAFC',
        padding: 8,
        borderRadius: 8,
    },
    finishButton: {
        marginTop: 32,
        borderRadius: 16,
    }
});
