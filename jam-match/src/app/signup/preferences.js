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
  text,
} from '../../components/ui';
import { RangeSlider, Slider } from '../../components/Slider';
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

      <Section>
        <Slider
          label="Maximum distance"
          value={prefs.maxDistanceKm}
          min={1}
          max={100}
          format={(v) => `${v} km`}
          onChange={(v) => set({ maxDistanceKm: v })}
        />
      </Section>

      <Section>
        <RangeSlider
          label="Age range"
          low={prefs.ageMin}
          high={prefs.ageMax}
          min={18}
          max={80}
          formatRange={(lo, hi) => `${lo} – ${hi === 80 ? '80+' : hi}`}
          onChange={(lo, hi) => set({ ageMin: lo, ageMax: hi })}
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

      <Section>
        <RangeSlider
          label="Level range"
          low={prefs.levelMin}
          high={prefs.levelMax}
          min={0}
          max={LEVELS.length - 1}
          format={(v) => LEVELS[v]}
          onChange={(lo, hi) => set({ levelMin: lo, levelMax: hi })}
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
