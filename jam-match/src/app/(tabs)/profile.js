import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Modal, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PersonCard from '../../components/PersonCard';

import { Avatar, Button, Chip, ChipRow, Screen, Section, text } from '../../components/ui';
import { GENRE_MODES, LEVELS } from '../../data/options';
import { useApp } from '../../state/AppContext';
import { colors, radius, space } from '../../theme';

// Your own profile, with links back to each sign-up step to edit it.
export default function Profile() {
  const { profile, me, resetEverything } = useApp();
  const p = profile.prefs;
  const genreMode = GENRE_MODES.find((m) => m.id === p.genreMode)?.label;
  const [previewing, setPreviewing] = useState(false);

  return (
    <Screen edges={['top']}>
      <View style={styles.header}>
        <Avatar name={me.name || '?'} size={72} uri={profile.photos[0]} />
        <View style={styles.flex}>
          <Text style={text.title}>
            {me.name}
            {me.age ? `, ${me.age}` : ''}
          </Text>
          {profile.occupation ? <Text style={text.small}>{profile.occupation}</Text> : null}
          <Text style={text.small}>{profile.city}</Text>
          <Text style={text.small}>
            Full name (only you see this): {profile.firstName} {profile.surname}
          </Text>
        </View>
      </View>

      <Section title="My photos" right={`${profile.photos.length}/5`}>
        {profile.photos.length ? (
          <View style={styles.photoRow}>
            {profile.photos.map((uri) => (
              <Image key={uri} source={{ uri }} style={styles.thumb} />
            ))}
          </View>
        ) : (
          <Text style={text.small}>No photos yet. Profiles with photos get more matches.</Text>
        )}
        <Button title="Preview my card" onPress={() => setPreviewing(true)} />
        <Button
          title="Edit photos & details"
          variant="secondary"
          onPress={() => router.push('/signup/basics?edit=1')}
        />
      </Section>

      <Section title="I play">
        {profile.instruments.map((i) => (
          <View key={i.name} style={styles.line}>
            <Text style={text.label}>{i.name}</Text>
            <Text style={text.small}>{LEVELS[i.level]}</Text>
          </View>
        ))}
        <ChipRow>
          {profile.genres.map((g) => (
            <Chip key={g} label={g} selected />
          ))}
        </ChipRow>
        <Button
          title="Edit instruments & genres"
          variant="secondary"
          onPress={() => router.push('/signup/basics?edit=1')}
        />
      </Section>

      <Section title="Who I want to play with">
        <Text style={text.body}>
          Up to {p.maxDistanceKm} km · ages {p.ageMin}–{p.ageMax}
          {p.learnFromOlder ? ' (+ experienced older players)' : ''}
          {'\n'}
          {LEVELS[p.levelMin]} to {LEVELS[p.levelMax]} · genres: {genreMode}
          {'\n'}
          Looking for: {p.lookingFor.length ? p.lookingFor.join(', ') : 'any instrument'}
        </Text>
        <Button
          title="Edit preferences"
          variant="secondary"
          onPress={() => router.push('/signup/preferences?edit=1')}
        />
      </Section>

      <Section title="Top 5 artists">
        <ChipRow>
          {profile.topArtists.map((a) => (
            <Chip key={a} label={a} />
          ))}
        </ChipRow>
        <Button
          title="Edit top artists"
          variant="secondary"
          onPress={() => router.push('/signup/artists?edit=1')}
        />
      </Section>

      <Modal visible={previewing} animationType="slide" onRequestClose={() => setPreviewing(false)}>
        <SafeAreaView style={styles.preview}>
          <Text style={text.kicker}>This is how others see you</Text>
          <View style={styles.flex}>
            <PersonCard person={{ ...me, topArtists: profile.topArtists }} me={me} />
          </View>
          <Button title="Close" onPress={() => setPreviewing(false)} />
        </SafeAreaView>
      </Modal>

      <Button
        title="Start over (prototype)"
        variant="secondary"
        onPress={() => {
          resetEverything();
          router.replace('/');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: space.lg },
  flex: { flex: 1 },
  line: { flexDirection: 'row', justifyContent: 'space-between' },
  photoRow: { flexDirection: 'row', gap: space.sm },
  thumb: { flex: 1, aspectRatio: 3 / 4, maxWidth: 64, borderRadius: radius.sm },
  preview: { flex: 1, padding: space.lg, gap: space.md, backgroundColor: colors.background },
});
