import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Card, Avatar, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '../../store/useUserStore';
import { User, Dumbbell, Target, Gauge } from 'lucide-react-native';

export default function HomeScreen() {
    const theme = useTheme();
    const store = useUserStore();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Avatar.Text size={64} label="ME" style={{ backgroundColor: theme.colors.primary }} color='black' />
                    <View>
                        <Text variant="headlineSmall" style={{ color: 'white', fontWeight: 'bold' }}>Welcome Back</Text>
                        <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>Ready for your session?</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text variant="titleLarge" style={styles.sectionTitle}>Your Profile</Text>

                    <Card style={styles.card}>
                        <Card.Content style={styles.row}>
                            <View style={styles.iconRow}>
                                <Gauge size={20} color={theme.colors.primary} />
                                <Text variant="bodyLarge" style={{ color: 'white' }}>Level</Text>
                            </View>
                            <Text variant="bodyLarge" style={{ color: theme.colors.primary, textTransform: 'capitalize' }}>
                                {store.niveau_sportif || 'Not set'}
                            </Text>
                        </Card.Content>
                    </Card>

                    <Card style={styles.card}>
                        <Card.Content style={styles.row}>
                            <View style={styles.iconRow}>
                                <Target size={20} color={theme.colors.primary} />
                                <Text variant="bodyLarge" style={{ color: 'white' }}>Goal</Text>
                            </View>
                            <Text variant="bodyLarge" style={{ color: theme.colors.primary, textTransform: 'capitalize' }}>
                                {store.objectif_principal || 'Not set'}
                            </Text>
                        </Card.Content>
                    </Card>

                    <Card style={styles.card}>
                        <Card.Content>
                            <View style={[styles.row, { marginBottom: 12 }]}>
                                <View style={styles.iconRow}>
                                    <Dumbbell size={20} color={theme.colors.primary} />
                                    <Text variant="bodyLarge" style={{ color: 'white' }}>Equipment</Text>
                                </View>
                            </View>
                            <View style={styles.chipRow}>
                                {store.equipment_disponible.length > 0 ? (
                                    store.equipment_disponible.map((eq) => (
                                        <View key={eq} style={[styles.chip, { borderColor: theme.colors.primary }]}>
                                            <Text style={{ color: 'white', fontSize: 12 }}>{eq}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={{ color: '#666' }}>No equipment selected</Text>
                                )}
                            </View>
                        </Card.Content>
                    </Card>
                </View>

                <Button mode="outlined" style={{ marginTop: 20, borderColor: '#333' }}>
                    Edit Profile
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    content: {
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 40,
    },
    section: {
        gap: 16,
    },
    sectionTitle: {
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    card: {
        backgroundColor: '#1E1E1E',
        borderColor: '#333',
        borderWidth: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
    }
});
