import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AppProvider } from '../state/AppContext';
import { colors } from '../theme';

// The root of the app. Every file in src/app is a screen;
// this layout stacks them and shares the app's memory (AppProvider) with all of them.
export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="chat/[id]"
          options={{
            headerShown: true,
            headerBackTitle: 'Back',
            headerTintColor: colors.accent,
            headerStyle: { backgroundColor: colors.background },
            headerShadowVisible: false,
          }}
        />
      </Stack>
    </AppProvider>
  );
}
