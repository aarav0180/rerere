import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ProgressProvider } from '../contexts/ProgressContext';
import { CommunityProvider } from '../contexts/CommunityContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ProgressProvider>
      <CommunityProvider>
        <>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </>
      </CommunityProvider>
    </ProgressProvider>
  );
}
