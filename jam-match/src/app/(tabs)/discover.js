import { router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import PersonCard from '../../components/PersonCard';
import SwipeCard from '../../components/SwipeCard';
import { Avatar, Button, Screen, Section, Segmented, text } from '../../components/ui';
import { PEOPLE } from '../../data/people';
import { rankPeople } from '../../lib/matching';
import { useApp } from '../../state/AppContext';
import { colors, radius, space } from '../../theme';

const MODES = [
  { id: 'duo', label: 'Duo' },
  { id: 'band', label: 'Band' },
];

// Tinder-style discovery: swipe right to jam, left to pass. Best fit first.
export default function Discover() {
  const { me, decisions, decide, startOver } = useApp();
  const [mode, setMode] = useState('duo');
  const [matchedWith, setMatchedWith] = useState(null);
  const card = useRef(null);

  // Everyone who passes both sides' filters, minus people you've already seen.
  const ranked = useMemo(() => rankPeople(me, PEOPLE), [me]);
  const queue = ranked.filter((p) => !decisions[p.id]);
  const person = queue[0];
  const nextPerson = queue[1];

  const onSwipe = (direction) => {
    const isMatch = decide(person.id, direction === 'right' ? 'like' : 'pass');
    if (isMatch) setMatchedWith(person);
  };

  return (
    <Screen
      edges={['top']}
      scroll={false}
      footer={
        mode === 'duo' && person ? (
          <View style={styles.actions}>
            <View style={styles.flex}>
              <Button title="Nah" variant="secondary" onPress={() => card.current?.swipe('left')} />
            </View>
            <View style={styles.flex2}>
              <Button title="Let’s jam" onPress={() => card.current?.swipe('right')} />
            </View>
          </View>
        ) : null
      }
    >
      <Segmented options={MODES} value={mode} onChange={setMode} />

      {mode === 'band' ? (
        <Section title="Band mode is coming in version 2">
          <Text style={text.body}>
            Groups of 3–10 built from people who are active right now. First we make sure duos
            work.
          </Text>
        </Section>
      ) : person ? (
        <>
          <Text style={text.small}>
            {queue.length} musician{queue.length === 1 ? '' : 's'} fit your preferences · swipe
            right to jam, left to pass
          </Text>
          <View style={styles.deck}>
            {nextPerson ? (
              <View style={styles.behind} pointerEvents="none">
                <PersonCard person={nextPerson} me={me} />
              </View>
            ) : null}
            <SwipeCard key={person.id} ref={card} onSwipe={onSwipe}>
              <PersonCard person={person} me={me} />
            </SwipeCard>
          </View>
        </>
      ) : (
        <Section title="You’ve seen everyone nearby">
          <Text style={text.body}>
            {ranked.length === 0
              ? 'Nobody fits your preferences yet. Try a bigger distance or a wider level range.'
              : 'Check back later, or look again at the people you passed.'}
          </Text>
          <Button title="See everyone again" onPress={startOver} />
          <Button
            title="Change my preferences"
            variant="secondary"
            onPress={() => router.push('/signup/preferences?edit=1')}
          />
        </Section>
      )}

      <Modal visible={!!matchedWith} transparent animationType="fade">
        {matchedWith ? (
          <View style={styles.overlay}>
            <View style={styles.matchBox}>
              <Text style={[text.kicker, styles.matchKicker]}>It’s a match</Text>
              <View style={styles.avatars}>
                <Avatar name={me.name || 'You'} size={72} />
                <Avatar name={matchedWith.name} size={72} />
              </View>
              <Text style={styles.matchTitle}>You and {matchedWith.name} both want to jam</Text>
              <Button
                title={`Say hi to ${matchedWith.name}`}
                onPress={() => {
                  const id = matchedWith.id;
                  setMatchedWith(null);
                  router.push(`/chat/${id}`);
                }}
              />
              <Button title="Keep looking" variant="secondary" onPress={() => setMatchedWith(null)} />
            </View>
          </View>
        ) : null}
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: space.md },
  deck: { flex: 1 },
  behind: { ...StyleSheet.absoluteFillObject, transform: [{ scale: 0.95 }], opacity: 0.6 },
  flex: { flex: 1 },
  flex2: { flex: 2 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 26, 23, 0.7)',
    justifyContent: 'center',
    padding: space.xl,
  },
  matchBox: {
    backgroundColor: colors.background,
    borderRadius: radius.lg + 6,
    padding: space.xl,
    gap: space.md,
  },
  matchKicker: { color: colors.warm, textAlign: 'center' },
  avatars: { flexDirection: 'row', justifyContent: 'center', gap: space.md },
  matchTitle: { fontSize: 24, fontWeight: '800', color: colors.ink, textAlign: 'center' },
});
