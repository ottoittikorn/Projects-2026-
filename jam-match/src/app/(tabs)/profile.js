import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Avatar, Button, Chip, ChipRow, Screen, Section, text } from '../../components/ui';
import { GENRE_MODES, LEVELS } from '../../data/options';
import { useApp } from '../../state/AppContext';
import { space } from '../../theme';

// Your own profile, with links back to each sign-up step to edit it.
export default function Profile() {
  const { profile, me, resetEverything } = useApp();
  const p = profile.prefs;
  const genreMode = GENRE_MODES.find((m) => m.id === p.genreMode)?.label;

  return (
    <Screen edges={['top']}>
      <View style={styles.header}>
        <Avatar name={profile.name || '?'} size={72} />
        <View style={styles.flex}>
          <Text style={text.title}>
            {profile.name}
            {me.age ? `, ${me.age}` : ''}
          </Text>
          <Text style={text.small}>{profile.city}</Text>
        </View>
      </View>

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
});
