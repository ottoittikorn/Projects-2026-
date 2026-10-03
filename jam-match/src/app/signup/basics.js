import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import {
  Button,
  Chip,
  ChipRow,
  Screen,
  Section,
  StepHeader,
  text,
} from '../../components/ui';
import { Slider } from '../../components/Slider';
import { GENRES, INSTRUMENTS, LEVELS } from '../../data/options';
import { ageFromBirthDate } from '../../lib/matching';
import { useApp } from '../../state/AppContext';
import { colors, radius, space } from '../../theme';

// Sign-up step 1: who you are and what you play.
export default function Basics() {
  const { profile, updateProfile } = useApp();
  const { edit } = useLocalSearchParams();

  const [firstName, setFirstName] = useState(profile.firstName);
  const [surname, setSurname] = useState(profile.surname);
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [day, setDay] = useState(profile.birthDate ? String(profile.birthDate.day) : '');
  const [month, setMonth] = useState(profile.birthDate ? String(profile.birthDate.month) : '');
  const [year, setYear] = useState(profile.birthDate ? String(profile.birthDate.year) : '');
  const [city, setCity] = useState(profile.city);
  const [instruments, setInstruments] = useState(profile.instruments);
  const [genres, setGenres] = useState(profile.genres);

  const toggleInstrument = (name) => {
    const has = instruments.some((i) => i.name === name);
    setInstruments(
      has ? instruments.filter((i) => i.name !== name) : [...instruments, { name, level: 2 }],
    );
  };

  const setLevel = (name, level) =>
    setInstruments(instruments.map((i) => (i.name === name ? { ...i, level } : i)));

  const toggleGenre = (g) =>
    setGenres(genres.includes(g) ? genres.filter((x) => x !== g) : [...genres, g]);

  // Check the form and explain what's missing.
  const birthDate = { day: Number(day), month: Number(month), year: Number(year) };
  const dateValid =
    birthDate.day >= 1 &&
    birthDate.day <= 31 &&
    birthDate.month >= 1 &&
    birthDate.month <= 12 &&
    birthDate.year >= 1900;
  const age = dateValid ? ageFromBirthDate(birthDate) : null;

  let problem = null;
  if (!firstName.trim()) problem = 'Add your first name.';
  else if (!surname.trim()) problem = 'Add your surname.';
  else if (!dateValid) problem = 'Add your date of birth.';
  else if (age < 18) problem = 'Sorry, Jam Mate is for people aged 18 and over.';
  else if (!city.trim()) problem = 'Add your city.';
  else if (instruments.length === 0) problem = 'Pick at least one instrument.';
  else if (genres.length === 0) problem = 'Pick at least one genre.';

  const next = () => {
    updateProfile({
      firstName: firstName.trim(),
      surname: surname.trim(),
      // Shown to others. Falls back to the first name if left empty.
      displayName: displayName.trim() || firstName.trim(),
      birthDate, city: city.trim(), instruments, genres });
    if (edit) router.back();
    else router.push('/signup/preferences');
  };

  return (
    <Screen
      footer={
        <>
          {problem ? <Text style={[text.error, styles.center]}>{problem}</Text> : null}
          <Button
            title={edit ? 'Save' : 'Next'}
            onPress={next}
            disabled={!!problem}
          />
        </>
      }
    >
      <StepHeader step={1} total={3} title="Tell us how you play" />

      <View style={styles.row}>
        <View style={styles.half}>
          <Field label="First name">
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First name"
              placeholderTextColor={colors.muted}
              textContentType="givenName"
            />
          </Field>
        </View>
        <View style={styles.half}>
          <Field label="Surname">
            <TextInput
              style={styles.input}
              value={surname}
              onChangeText={setSurname}
              placeholder="Surname"
              placeholderTextColor={colors.muted}
              textContentType="familyName"
            />
          </Field>
        </View>
      </View>

      <Field label="Display name">
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder={firstName.trim() || 'The name people see'}
          placeholderTextColor={colors.muted}
          textContentType="nickname"
        />
        <Text style={text.small}>This is the name other musicians see. Your surname stays private.</Text>
      </Field>

      <Field label="Date of birth">
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.short]}
            value={day}
            onChangeText={setDay}
            placeholderTextColor={colors.muted}
            placeholder="DD"
            keyboardType="number-pad"
            maxLength={2}
            accessibilityLabel="Day"
          />
          <TextInput
            style={[styles.input, styles.short]}
            value={month}
            onChangeText={setMonth}
            placeholderTextColor={colors.muted}
            placeholder="MM"
            keyboardType="number-pad"
            maxLength={2}
            accessibilityLabel="Month"
          />
          <TextInput
            style={[styles.input, styles.long]}
            value={year}
            onChangeText={setYear}
            placeholderTextColor={colors.muted}
            placeholder="YYYY"
            keyboardType="number-pad"
            maxLength={4}
            accessibilityLabel="Year"
          />
        </View>
        <Text style={text.small}>18+ only. Only your age is shown, never your birthday.</Text>
      </Field>

      <Field label="City">
        <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="Your city" placeholderTextColor={colors.muted} />
      </Field>

      <Section title="Instruments" right={instruments.length ? `${instruments.length} picked` : null}>
        <ChipRow>
          {INSTRUMENTS.map((i) => (
            <Chip
              key={i}
              label={i}
              selected={instruments.some((x) => x.name === i)}
              onPress={() => toggleInstrument(i)}
            />
          ))}
        </ChipRow>
        {instruments.map((i) => (
          <View key={i.name} style={styles.level}>
            <Slider
              label={`Your level on ${i.name.toLowerCase()}`}
              value={i.level}
              min={0}
              max={LEVELS.length - 1}
              format={(v) => LEVELS[v]}
              onChange={(level) => setLevel(i.name, level)}
            />
          </View>
        ))}
      </Section>

      <Section title="Music you love to play">
        <ChipRow>
          {GENRES.map((g) => (
            <Chip key={g} label={g} selected={genres.includes(g)} onPress={() => toggleGenre(g)} />
          ))}
        </ChipRow>
      </Section>
    </Screen>
  );
}

function Field({ label, children }) {
  return (
    <View style={styles.field}>
      <Text style={text.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: space.xs + 2 },
  input: {
    minHeight: 48,
    paddingHorizontal: space.md,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    fontSize: 16,
    color: colors.ink,
  },
  row: { flexDirection: 'row', gap: space.sm },
  // flexBasis + minWidth let the three boxes shrink to fit side by side.
  half: { flex: 1, flexBasis: 0, minWidth: 0 },
  short: { flex: 1, flexBasis: 0, minWidth: 0 },
  long: { flex: 1.6, flexBasis: 0, minWidth: 0 },
  level: { paddingTop: space.xs },
  center: { textAlign: 'center' },
});
