import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar, Screen, Section, text } from '../../components/ui';
import { PEOPLE } from '../../data/people';
import { useApp } from '../../state/AppContext';
import { colors, radius, space } from '../../theme';

// Everyone you've matched with. Tap one to chat.
export default function Matches() {
  const { matches, messages } = useApp();
  const people = matches.map((id) => PEOPLE.find((p) => p.id === id));

  return (
    <Screen edges={['top']}>
      <Text style={text.title}>Matches</Text>

      {people.length === 0 ? (
        <Section title="No matches yet">
          <Text style={text.body}>
            When you and someone both tap “Let’s jam”, they show up here.
          </Text>
        </Section>
      ) : null}

      {people.map((p) => {
        const thread = messages[p.id] || [];
        const last = thread[thread.length - 1];
        return (
          <Pressable
            key={p.id}
            onPress={() => router.push(`/chat/${p.id}`)}
            accessibilityRole="button"
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            <Avatar name={p.name} size={52} />
            <View style={styles.flex}>
              <Text style={text.label}>{p.name}</Text>
              <Text style={text.small} numberOfLines={1}>
                {last ? `${last.from === 'me' ? 'You: ' : ''}${last.text}` : 'New match · say hi!'}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    padding: space.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
  },
  pressed: { opacity: 0.75 },
  flex: { flex: 1, gap: 2 },
});
