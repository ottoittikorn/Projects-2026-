import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { LEVELS } from '../data/options';
import { sharedArtists } from '../lib/matching';
import { colors, fonts, radius, space } from '../theme';
import { Avatar, Chip, ChipRow, text } from './ui';

// One musician's card on the Discover screen: a big photo area on top
// (tap the right or left side to see their next or previous photo, like Tinder)
// and their details below. Things you have in common are highlighted.
export default function PersonCard({ person, me }) {
  const common = sharedArtists(me, person);
  const photos = person.photos || [];
  const [index, setIndex] = useState(0);
  const showPhoto = (delta) =>
    setIndex((i) => Math.min(photos.length - 1, Math.max(0, i + delta)));

  const active =
    person.lastActiveDays === 0 ? 'active today' : `active ${person.lastActiveDays}d ago`;

  return (
    <View style={styles.card}>
      <View style={styles.photo}>
        {photos.length ? (
          <Image source={{ uri: photos[index] }} style={styles.image} />
        ) : (
          <Avatar name={person.name} size={110} inverse />
        )}

        {photos.length > 1 ? (
          <>
            {/* One bar per photo; the current one is solid. */}
            <View style={styles.bars}>
              {photos.map((_, i) => (
                <View key={i} style={[styles.bar, i === index && styles.barOn]} />
              ))}
            </View>
            <Pressable
              style={[styles.tapZone, styles.left]}
              onPress={() => showPhoto(-1)}
              accessibilityRole="button"
              accessibilityLabel="Previous photo"
            />
            <Pressable
              style={[styles.tapZone, styles.right]}
              onPress={() => showPhoto(1)}
              accessibilityRole="button"
              accessibilityLabel="Next photo"
            />
          </>
        ) : null}

        {/* Name over the bottom of the photo. */}
        <View style={styles.overlay} pointerEvents="none">
          <View style={styles.badges}>
            {person.newInTown ? <Text style={styles.badgeLight}>New in town</Text> : null}
            {person.happyToTeach ? <Text style={styles.badgeDark}>Happy to teach</Text> : null}
          </View>
          <Text style={styles.name}>
            {person.name}, {person.age}
          </Text>
          {person.occupation ? <Text style={styles.overlayText}>{person.occupation}</Text> : null}
          {person.distanceKm !== undefined ? (
            <Text style={styles.overlayText}>
              {person.distanceKm} km · {active}
            </Text>
          ) : null}
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.info}>
        {person.bio ? <Text style={text.body}>{person.bio}</Text> : null}

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

        {person.topArtists.length ? (
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
        ) : null}
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
  // The photo takes about 60% of the card.
  photo: {
    flex: 3,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  bars: {
    position: 'absolute',
    top: space.sm,
    left: space.sm,
    right: space.sm,
    flexDirection: 'row',
    gap: 4,
  },
  bar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.4)' },
  barOn: { backgroundColor: colors.white },
  tapZone: { position: 'absolute', top: 0, bottom: 0, width: '50%' },
  left: { left: 0 },
  right: { right: 0 },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: space.lg,
    paddingTop: space.md,
    gap: 2,
    backgroundColor: 'rgba(11, 11, 15, 0.45)',
  },
  badges: { flexDirection: 'row', gap: space.sm, marginBottom: space.xs },
  badgeLight: {
    backgroundColor: colors.white,
    color: colors.blue,
    fontWeight: '700',
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  badgeDark: {
    backgroundColor: colors.ink,
    color: colors.white,
    fontWeight: '700',
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  name: {
    fontFamily: fonts.display,
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
  },
  overlayText: { fontSize: 14, color: colors.white },
  scroll: { flex: 2 },
  info: { padding: space.lg, gap: space.md },
  block: { gap: space.sm },
  instrument: { flexDirection: 'row', justifyContent: 'space-between' },
  level: { fontSize: 14, fontWeight: '700', color: colors.accent },
});
