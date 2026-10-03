import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { LEVELS } from '../data/options';
import { sharedArtists } from '../lib/matching';
import { colors, radius, space } from '../theme';
import { Avatar, Chip, ChipRow, text } from './ui';

// One musician's card on the Discover screen.
// Things you have in common are highlighted.
export default function PersonCard({ person, me }) {
  const common = sharedArtists(me, person);

  return (
    <View style={styles.card}>
      <View style={styles.photo}>
        <Avatar name={person.name} size={96} />
        <View style={styles.badges}>
          {person.newInTown ? <Text style={styles.badgeWarm}>New in town</Text> : null}
          {person.happyToTeach ? <Text style={styles.badge}>Happy to teach</Text> : null}
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>
            {person.name}, {person.age}
          </Text>
          <Text style={text.small}>
            {person.distanceKm} km · {person.lastActiveDays === 0 ? 'active today' : `active ${person.lastActiveDays}d ago`}
          </Text>
        </View>

        <Text style={text.body}>{person.bio}</Text>

        <View style={styles.block}>
          {person.instruments.map((i) => (
            <View key={i.name} style={styles.instrument}>
              <Text style={text.label}>{i.name}</Text>
              <Text style={styles.level}>{LEVELS[i.level]}</Text>
            </View>
          ))}
        </View>

        <View style={styles.block}>
          <Text style={text.small}>Genres · dark = you share it</Text>
          <ChipRow>
            {person.genres.map((g) => (
              <Chip key={g} label={g} selected={me.genres.includes(g)} />
            ))}
          </ChipRow>
        </View>

        <View style={styles.block}>
          <Text style={text.small}>
            Top 5 artists{common.length ? ` · ${common.length} in common` : ''}
          </Text>
          <ChipRow>
            {person.topArtists.map((a) => (
              <Chip key={a} label={a} highlight={common.includes(a)} />
            ))}
          </ChipRow>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg + 6,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  photo: {
    height: 160,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badges: { position: 'absolute', top: space.md, left: space.md, flexDirection: 'row', gap: space.sm },
  badge: {
    backgroundColor: colors.background,
    color: colors.accent,
    fontWeight: '700',
    fontSize: 13,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  badgeWarm: {
    backgroundColor: colors.warm,
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  scroll: { flex: 1 },
  info: { padding: space.lg, gap: space.md },
  nameRow: { gap: 2 },
  name: { fontSize: 26, fontWeight: '800', color: colors.ink },
  block: { gap: space.sm },
  instrument: { flexDirection: 'row', justifyContent: 'space-between' },
  level: { fontSize: 14, fontWeight: '700', color: colors.accent },
});
