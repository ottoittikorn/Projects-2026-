import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import {
  Button,
  Chip,
  ChipRow,
  Screen,
  Section,
  Segmented,
  StepHeader,
  Stepper,
  text,
} from '../../components/ui';
import { GENRE_MODES, INSTRUMENTS, LEVELS } from '../../data/options';
import { useApp } from '../../state/AppContext';
import { colors, space } from '../../theme';

// Sign-up step 2: who you want to play with.
export default function Preferences() {
  const { profile, updatePrefs } = useApp();
  const { edit } = useLocalSearchParams();
  const [prefs, setPrefs] = useState(profile.prefs);
  const set = (changes) => setPrefs((p) => ({ ...p, ...changes }));

  const toggleLookingFor = (name) =>
    set({
      lookingFor: prefs.lookingFor.includes(name)
        ? prefs.lookingFor.filter((x) => x !== name)
        : [...prefs.lookingFor, name],
    });

  const next = () => {
    updatePrefs(prefs);
    if (edit) router.back();
    else router.push('/signup/artists');
  };

  return (
    <Screen
      footer={<Button title={edit ? 'Save' : 'Next: favourite musicians'} onPress={next} />}
    >
      <StepHeader step={2} total={3} title="Who do you want to play with?" />

      <Section title="Distance">
        <Stepper
          label="Up to"
          value={prefs.maxDistanceKm}
          min={5}
          max={100}
          step={5}
          format={(v) => `${v} km`}
          onChange={(v) => set({ maxDistanceKm: v })}
        />
      </Section>

      <Section title="Age range" right={`${prefs.ageMin} – ${prefs.ageMax}`}>
        <Stepper
          label="From"
          value={prefs.ageMin}
          min={18}
          max={prefs.ageMax}
          onChange={(v) => set({ ageMin: v })}
        />
        <Stepper
          label="To"
          value={prefs.ageMax}
          min={prefs.ageMin}
          max={80}
          onChange={(v) => set({ ageMax: v })}
        />
        <View style={styles.switchRow}>
          <View style={styles.switchText}>
            <Text style={text.label}>Learn from older, experienced players</Text>
            <Text style={text.small}>
              Also show players above your range who are happy to jam with learners.
            </Text>
          </View>
          <Switch
            value={prefs.learnFromOlder}
            onValueChange={(v) => set({ learnFromOlder: v })}
            trackColor={{ true: colors.accent }}
            accessibilityLabel="Learn from older, experienced players"
          />
        </View>
      </Section>

      <Section title="Level range" right={`${LEVELS[prefs.levelMin]} – ${LEVELS[prefs.levelMax]}`}>
        <Stepper
          label="From"
          value={prefs.levelMin}
          min={0}
          max={prefs.levelMax}
          format={(v) => LEVELS[v]}
          onChange={(v) => set({ levelMin: v })}
        />
        <Stepper
          label="To"
          value={prefs.levelMax}
          min={prefs.levelMin}
          max={4}
          format={(v) => LEVELS[v]}
          onChange={(v) => set({ levelMax: v })}
        />
      </Section>

      <Section title="Genres">
        <Segmented
          options={GENRE_MODES}
          value={prefs.genreMode}
          onChange={(v) => set({ genreMode: v })}
        />
        <Text style={text.small}>
          {prefs.genreMode === 'only' && 'Only people whose main genre is one of yours.'}
          {prefs.genreMode === 'overlap' && 'People who share at least one of your genres.'}
          {prefs.genreMode === 'any' && 'Genre doesn’t matter, just play!'}
        </Text>
      </Section>

      <Section title="Looking for" right={prefs.lookingFor.length ? null : 'Any instrument'}>
        <ChipRow>
          {INSTRUMENTS.map((i) => (
            <Chip
              key={i}
              label={i}
              selected={prefs.lookingFor.includes(i)}
              onPress={() => toggleLookingFor(i)}
            />
          ))}
        </ChipRow>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingTop: space.md,
    borderTopWidth: 1,
    borderTopColor: colors.soft,
  },
  switchText: { flex: 1, gap: 2 },
});
