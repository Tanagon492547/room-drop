// app/_layout.tsx
import { SessionProvider } from '@/hooks/useAuth';
import { Stack } from 'expo-router';
import * as React from 'react';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#314071',
  },
};

export default function Root() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <SessionProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </SessionProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
