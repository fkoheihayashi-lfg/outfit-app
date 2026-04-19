import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="select-item" options={{ title: 'Select Item' }} />
        <Stack.Screen name="context-input" options={{ title: 'Set Context' }} />
        <Stack.Screen name="result" options={{ title: 'Your Outfit' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
