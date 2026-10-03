import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Avatar, Button, Screen, Section, StepHeader, text } from '../../components/ui';
import { DEMO_TOP_ARTISTS } from '../../data/options';
import { useApp } from '../../state/AppContext';
import { colors, radius, space } from '../../theme';

const MAX = 5;

// Sign-up step 3: your top 5 artists, shown on your profile like Tinder's.
export default function Artists() {
  const { profile, updateProfile } = useApp();
  const { edit } = useLocalSearchParams();
  const [artists, setArtists] = useState(profile.topArtists);
  const [typed, setTyped] = useState('');
  const [source, setSource] = useState(null);

  // Prototype only: pretends to read your most-played artists.
  const connectAppleMusic = () => {
    setArtists(DEMO_TOP_ARTISTS);
    setSource('Apple Music (demo data)');
  };

  const add = () => {
    const name = typed.trim();
    if (!name || artists.length >= MAX || artists.includes(name)) return;
    setArtists([...artists, name]);
    setTyped('');
  };

  const remove = (name) => setArtists(artists.filter((a) => a !== name));

  const finish = () => {
    updateProfile({ topArtists: artists });
    if (edit) router.back();
    else router.replace('/discover');
  };

  return (
    <Screen
      footer={
        <Button
          title={edit ? 'Save' : artists.length ? 'Finish & start matching' : 'Skip for now'}
          onPress={finish}
        />
      }
    >
      <StepHeader
        step={3}
        total={3}
        title="Your top 5 artists"
        subtitle="Shown on your profile. We match you with people who share your taste."
      />

      <View style={styles.connectRow}>
        <View style={styles.flex}>
          <Button title="Connect Apple Music" onPress={connectAppleMusic} />
        </View>
        <View style={styles.flex}>
          <Button title="Spotify: later" variant="secondary" disabled />
        </View>
      </View>

      <Section title={`Your top ${MAX}`} right={source ? `from ${source}` : `${artists.length}/${MAX}`}>
        {artists.length === 0 ? (
          <Text style={text.small}>Connect a music app or add artists below.</Text>
        ) : null}
        {artists.map((a, i) => (
          <View key={a} style={styles.artist}>
            <Text style={styles.rank}>{i + 1}</Text>
            <Avatar name={a} size={36} />
            <Text style={[text.label, styles.flex]}>{a}</Text>
            <Pressable
              onPress={() => remove(a)}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${a}`}
              hitSlop={8}
            >
              <Text style={styles.remove}>Remove</Text>
            </Pressable>
          </View>
        ))}
      </Section>

      {artists.length < MAX ? (
        <View style={styles.addRow}>
          <TextInput
            style={styles.input}
            value={typed}
            onChangeText={setTyped}
            placeholderTextColor={colors.muted}
            placeholder="Add an artist or band"
            onSubmitEditing={add}
            returnKeyType="done"
          />
          <Pressable onPress={add} accessibilityRole="button" style={styles.addButton}>
            <Text style={styles.addText}>Add</Text>
          </Pressable>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  connectRow: { flexDirection: 'row', gap: space.sm },
  flex: { flex: 1 },
  artist: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  rank: { width: 18, fontSize: 16, fontWeight: '800', color: colors.warm },
  remove: { fontSize: 13, color: colors.muted },
  addRow: { flexDirection: 'row', gap: space.sm },
  input: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: space.lg,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    fontSize: 16,
  },
  addButton: {
    minHeight: 48,
    paddingHorizontal: space.xl - 4,
    borderRadius: radius.pill,
    backgroundColor: colors.ink,
    justifyContent: 'center',
  },
  addText: { color: colors.white, fontWeight: '700', fontSize: 15 },
});
