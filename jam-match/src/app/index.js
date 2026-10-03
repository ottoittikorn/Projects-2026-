import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Screen, text } from '../components/ui';
import { useApp } from '../state/AppContext';
import { APP_NAME, colors } from '../theme';

// Welcome screen: the first thing people see.
export default function Welcome() {
  const { loadDemoProfile, resetEverything } = useApp();

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
      scroll={false}
      footer={
        <>
          <Button title="Get started" onPress={start} />
          <Button title="Try the demo profile" variant="secondary" onPress={demo} />
        </>
      }
    >
      <View style={styles.hero}>
        <Text style={text.kicker}>Find your next jam</Text>
        <Text style={styles.title}>{APP_NAME}</Text>
        <Text style={styles.body}>
          Meet musicians near you who play at your level and love the same music.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { flex: 1, justifyContent: 'center', gap: 12 },
  title: { fontSize: 52, fontWeight: '800', color: colors.ink },
  body: { fontSize: 19, lineHeight: 27, color: colors.body },
});
