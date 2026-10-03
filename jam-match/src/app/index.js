import { router, useIsFocused } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Screen } from '../components/ui';
import { useApp } from '../state/AppContext';
import { APP_NAME, colors, fonts } from '../theme';

// Welcome screen: the first thing people see.
export default function Welcome() {
  const { loadDemoProfile, resetEverything } = useApp();
  const focused = useIsFocused();

  const start = () => {
    resetEverything();
    router.push('/signup/basics');
  };

  // Skips sign-up with a ready-made profile. Handy for showing friends.
  const demo = () => {
    resetEverything();
    loadDemoProfile();
    router.replace('/discover');
  };

  return (
    <Screen
      tone="blue"
      scroll={false}
      footer={
        <>
          <Button title="Get started" variant="inverse" onPress={start} />
          <Button title="Try the demo profile" variant="outlineLight" onPress={demo} />
        </>
      }
    >
      {/* White status bar text while this blue screen is showing. */}
      {focused ? <StatusBar style="light" /> : null}
      <View style={styles.hero}>
        <Text style={styles.kicker}>Find your next jam</Text>
        <Text style={styles.title}>{APP_NAME}</Text>
        {/* Bars of different lengths: a simple, sound-level-style graphic. */}
        <View style={styles.bars}>
          {[0.55, 0.85, 0.35, 0.7].map((w, i) => (
            <View key={i} style={[styles.bar, { width: `${w * 100}%`, opacity: 1 - i * 0.18 }]} />
          ))}
        </View>
        <Text style={styles.body}>
          Meet musicians near you who play at your level and love the same music.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { flex: 1, justifyContent: 'center', gap: 18 },
  kicker: {
    fontFamily: fonts.display,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: colors.white,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 64,
    lineHeight: 68,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: colors.white,
  },
  bars: { gap: 8, marginVertical: 4 },
  bar: { height: 10, backgroundColor: colors.white },
  body: { fontSize: 19, lineHeight: 27, color: colors.white, opacity: 0.9 },
});
