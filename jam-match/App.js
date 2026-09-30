import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// Colours from the Jam Match design canvas.
const colors = {
  background: '#f6f1e9',
  ink: '#1c1a17',
  muted: '#4a443c',
  accent: '#b4400b',
  white: '#ffffff',
};

// Step 1: the welcome screen. It's the first screen you'll see on your phone.
// Try changing the text below and saving: the app on your phone updates instantly.
export default function App() {
  const [tapped, setTapped] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Find people to play with</Text>
        <Text style={styles.title}>Jam Match</Text>
        <Text style={styles.body}>
          Meet musicians near you who play at your level and love the same music.
        </Text>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => setTapped(true)}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Get started</Text>
        </Pressable>

        {tapped && <Text style={styles.note}>Sign up is coming in step 2!</Text>}
      </View>

      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 96,
    paddingBottom: 48,
    justifyContent: 'space-between',
  },
  hero: {
    gap: 12,
  },
  kicker: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.ink,
    fontSize: 48,
    fontWeight: '800',
  },
  body: {
    color: colors.muted,
    fontSize: 18,
    lineHeight: 26,
  },
  footer: {
    gap: 12,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  note: {
    color: colors.muted,
    textAlign: 'center',
  },
});
