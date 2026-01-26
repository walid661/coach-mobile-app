import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { Button, Text, Surface, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient'; // Need to install if not present, or use View with alpha
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dumbbell } from 'lucide-react-native';

export default function LandingScreen() {
    const router = useRouter();
    const theme = useTheme();

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Abstract Background Effect */}
            <View style={[styles.backgroundCircle, { backgroundColor: theme.colors.primary, opacity: 0.1 }]} />

            <SafeAreaView style={styles.content}>
                <View style={styles.header}>
                    <View style={[styles.iconContainer, { borderColor: theme.colors.primary }]}>
                        <Dumbbell size={32} color={theme.colors.primary} />
                    </View>
                    <Text variant="displayMedium" style={[styles.title, { color: theme.colors.primary }]}>
                        Mike
                    </Text>
                    <Text variant="headlineSmall" style={styles.subtitle}>
                        AI Hotel Coach
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text variant="bodyLarge" style={styles.description}>
                        Your personalized fitness concierge. Tailored workouts based on your equipment and schedule.
                    </Text>

                    <Button
                        mode="contained"
                        onPress={() => router.push('/onboarding')}
                        contentStyle={{ height: 56 }}
                        style={styles.button}
                        labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
                    >
                        Start Your Journey
                    </Button>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundCircle: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 400,
        height: 400,
        borderRadius: 200,
    },
    content: {
        flex: 1,
        width: '100%',
        padding: 24,
        justifyContent: 'space-between',
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
    },
    title: {
        fontWeight: '900',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    subtitle: {
        color: '#ffffff',
        opacity: 0.7,
        marginTop: 8,
        fontWeight: '300',
        letterSpacing: 1,
    },
    footer: {
        width: '100%',
        gap: 32,
        paddingBottom: 40,
    },
    description: {
        color: '#ffffff',
        opacity: 0.6,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    button: {
        borderRadius: 50,
    }
});
