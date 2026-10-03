import { Tabs } from 'expo-router/js-tabs';

import { colors, fonts } from '../../theme';

// The three tabs at the bottom once you're signed up.
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarStyle: { backgroundColor: colors.blue, borderTopColor: colors.blue },
        tabBarIconStyle: { display: 'none' },
        tabBarLabelStyle: {
          fontFamily: fonts.display,
          fontSize: 14,
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: 1.5,
        },
        tabBarItemStyle: { justifyContent: 'center' },
      }}
    >
      <Tabs.Screen name="discover" options={{ title: 'Discover' }} />
      <Tabs.Screen name="matches" options={{ title: 'Matches' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
