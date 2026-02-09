import { DefaultTheme as NavigationDefaultTheme, ThemeProvider } from '@react-navigation/native';
import { MD3LightTheme, PaperProvider, adaptNavigationTheme } from 'react-native-paper';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import merge from 'deepmerge';

const { LightTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
});

export default function RootLayout() {
  const paperTheme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: '#2563EB', // Blue-600
      onPrimary: '#FFFFFF',
      secondary: '#3B82F6', // Blue-500
      background: '#F8FAFC', // Slate-50
      surface: '#FFFFFF',
      onSurface: '#18181B', // Zinc-900
      onBackground: '#18181B', // Zinc-900
      elevation: {
        level0: 'transparent',
        level1: '#FFFFFF',
        level2: '#F1F5F9', // Slate-100
        level3: '#E2E8F0', // Slate-200
        level4: '#CBD5E1',
        level5: '#94A3B8',
      },
    },
  };

  const { LightTheme: NavLightTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    materialLight: paperTheme,
  });

  // Merge the adapted navigation theme with the paper theme
  const CombinedTheme = merge(NavLightTheme, paperTheme) as any;

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={CombinedTheme}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F8FAFC' } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="intent" />
          <Stack.Screen name="home/index" />
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  );
}
