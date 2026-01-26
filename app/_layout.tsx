import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, ThemeProvider } from '@react-navigation/native';
import { MD3DarkTheme, PaperProvider, adaptNavigationTheme } from 'react-native-paper';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import merge from 'deepmerge';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDarkTheme = merge(DarkTheme, {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#D4AF37', // Gold
    onPrimary: '#121212',
    secondary: '#D4AF37',
    background: '#121212',
    surface: '#1E1E1E',
    onSurface: '#E0E0E0',
    onBackground: '#FFFFFF',
    elevation: {
      level0: 'transparent',
      level1: '#1E1E1E',
      level2: '#2C2C2C',
      level3: '#333333',
      level4: '#3A3A3A',
      level5: '#424242',
    },
  },
});

export default function RootLayout() {
  return (
    <PaperProvider theme={CombinedDarkTheme}>
      <ThemeProvider value={CombinedDarkTheme}>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#121212' } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="intent" />
          <Stack.Screen name="home/index" />
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  );
}
