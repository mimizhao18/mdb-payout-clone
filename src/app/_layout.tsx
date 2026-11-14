import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { SessionGate, SessionProvider } from '@/lib/session';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  // The Figma design is light-only, so the navigation theme is pinned to light.
  // SessionProvider/SessionGate make sure every user has an account before any
  // screen tries to read or write their data.
  return (
    <ThemeProvider value={DefaultTheme}>
      <SessionProvider>
        <SessionGate>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
            <Stack.Screen name="paywall" options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
            <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
            <Stack.Screen name="settlement/[id]" />
          </Stack>
        </SessionGate>
      </SessionProvider>
    </ThemeProvider>
  );
}
