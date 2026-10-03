import { Tabs } from 'expo-router/js-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts } from '../../theme';

// The three tabs at the bottom once you're signed up.
// The bar is slim and sits low (just above the iPhone's home line) to leave room for photos.
export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom - 14, 6);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarStyle: {
          backgroundColor: colors.blue,
          borderTopColor: colors.blue,
          height: 34 + bottom,
          paddingTop: 0,
          paddingBottom: bottom,
        },
        tabBarIconStyle: { display: 'none' },
        tabBarLabelStyle: {
          fontFamily: fonts.display,
          fontSize: 14,
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: 1.5,
        },
        tabBarItemStyle: { justifyContent: 'center', paddingVertical: 0 },
      }}
    >
      <Tabs.Screen name="discover" options={{ title: 'Discover' }} />
      <Tabs.Screen name="matches" options={{ title: 'Matches' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
