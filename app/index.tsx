import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LandingScreen() {
    const router = useRouter();
    const theme = useTheme();

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <LinearGradient
                colors={['#F8FAFC', '#FFFFFF']}
                style={styles.background}
            />

            {/* Blue Blur Effect */}
            <View style={styles.blueBlur} />

            <SafeAreaView style={styles.content}>

                {/* Image Section with Speech Bubble */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: "https://img.freepik.com/premium-photo/3d-render-young-man-with-athletic-body-wearing-fitness-clothes-shorts-standing-pose_1142-45230.jpg?w=800" }}
                        style={styles.heroImage}
                        resizeMode="contain"
                    />

                    {/* Speech Bubble */}
                    <View style={styles.speechBubble}>
                        <View style={styles.speechTail} />
                        <Text style={styles.speechText}>
                            "Your personal hotel gym pro. Let's design your perfect set."
                        </Text>
                    </View>
                </View>

                {/* Text & Action Section */}
                <View style={styles.footer}>
                    <Text style={styles.title}>AI Hotel Coach</Text>
                    <Text style={styles.subtitle}>Elite fitness, anywhere in the world.</Text>

                    <Button
                        mode="contained"
                        onPress={() => router.push('/onboarding')}
                        contentStyle={{ height: 80, flexDirection: 'row-reverse' }}
                        style={styles.button}
                        labelStyle={{ fontSize: 18, fontWeight: '600' }}
                        icon={({ size, color }) => <ChevronRight size={24} color={color} />}
                    >
                        Start My Journey
                    </Button>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    blueBlur: {
        position: 'absolute',
        top: '30%',
        left: '10%',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: '#DBEAFE', // blue-100
        opacity: 0.6,
        transform: [{ scale: 1.5 }],
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
        marginTop: 40,
    },
    heroImage: {
        width: 320,
        height: 400,
        zIndex: 10,
    },
    speechBubble: {
        position: 'absolute',
        bottom: 20,
        backgroundColor: 'white',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 32,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10, // Android shadow
        borderWidth: 1,
        borderColor: '#F1F5F9', // zinc-100
        maxWidth: 280,
        zIndex: 20,
    },
    speechTail: {
        position: 'absolute',
        top: -8,
        left: '50%',
        marginLeft: -8,
        width: 16,
        height: 16,
        backgroundColor: 'white',
        transform: [{ rotate: '45deg' }],
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderColor: '#F1F5F9',
    },
    speechText: {
        color: '#27272A', // zinc-800
        fontWeight: '700',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    footer: {
        width: '100%',
        paddingHorizontal: 32,
        paddingBottom: 40,
        alignItems: 'center',
        zIndex: 30,
    },
    title: {
        fontSize: 36,
        fontWeight: '900',
        color: '#18181B', // zinc-900
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 16,
        color: '#A1A1AA', // zinc-400
        fontWeight: '500',
        marginBottom: 48,
    },
    button: {
        width: '100%',
        borderRadius: 40,
        backgroundColor: '#2563EB', // blue-600
        shadowColor: '#BFDBFE', // blue-200
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 10,
    }
});
