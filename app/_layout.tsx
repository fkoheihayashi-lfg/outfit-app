import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Colors, Typography } from '@src/constants/theme';

const headerDark = {
  headerStyle:            { backgroundColor: Colors.bgBase },
  headerTintColor:        Colors.textPrimary,
  headerTitleStyle:       { color: Colors.textPrimary, fontWeight: Typography.semibold },
  headerShadowVisible:    false,
};

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <Stack screenOptions={headerDark}>
        <Stack.Screen name="(tabs)"        options={{ headerShown: false }} />
        <Stack.Screen name="select-item"   options={{ title: 'Select Item' }} />
        <Stack.Screen name="context-input" options={{ title: 'Set Context' }} />
        <Stack.Screen name="result"        options={{ title: 'Your Outfit' }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
