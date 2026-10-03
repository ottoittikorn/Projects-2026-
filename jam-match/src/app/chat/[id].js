import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { text } from '../../components/ui';
import { PEOPLE } from '../../data/people';
import { sharedArtists } from '../../lib/matching';
import { useApp } from '../../state/AppContext';
import { colors, radius, space } from '../../theme';

// Three easy ways to start the conversation, based on their profile.
function icebreakers(person, me) {
  const instrument = person.instruments[0].name.toLowerCase();
  const artist = sharedArtists(me, person)[0];
  return [
    'Cool, you wanna jam?',
    `I see you play ${instrument}. How long have you been playing?`,
    artist
      ? `We both love ${artist}! What's a song of theirs you'd want to play?`
      : "What's a song you've been wanting to play?",
  ];
}

export default function Chat() {
  const { id } = useLocalSearchParams();
  const { me, messages, sendMessage } = useApp();
  const [draft, setDraft] = useState('');
  const person = PEOPLE.find((p) => p.id === id);
  const thread = messages[id] || [];

  if (!person) return null;

  const send = (message) => {
    const t = message.trim();
    if (!t) return;
    sendMessage(person.id, t);
    setDraft('');
  };

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <Stack.Screen options={{ title: person.name }} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <ScrollView contentContainerStyle={styles.thread} keyboardShouldPersistTaps="handled">
          {thread.length === 0 ? (
            <View style={styles.openers}>
              <Text style={text.small}>Break the ice · tap to send</Text>
              {icebreakers(person, me).map((line) => (
                <Pressable
                  key={line}
                  onPress={() => send(line)}
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.opener, pressed && styles.pressed]}
                >
                  <Text style={styles.openerText}>{line}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          {thread.map((m, i) => (
            <View
              key={i}
              style={[styles.bubble, m.from === 'me' ? styles.mine : styles.theirs]}
            >
              <Text style={[styles.bubbleText, m.from === 'me' && styles.mineText]}>{m.text}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            placeholderTextColor={colors.muted}
            placeholder={`Message ${person.name}…`}
            onSubmitEditing={() => send(draft)}
            returnKeyType="send"
          />
          <Pressable
            onPress={() => send(draft)}
            accessibilityRole="button"
            style={({ pressed }) => [styles.send, pressed && styles.pressed]}
          >
            <Text style={styles.sendText}>Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  thread: { padding: space.lg, gap: space.sm },
  openers: { gap: space.sm, marginBottom: space.md },
  opener: {
    padding: space.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.card,
  },
  openerText: { fontSize: 15, color: colors.ink },
  pressed: { opacity: 0.7 },
  bubble: { maxWidth: '80%', paddingVertical: 10, paddingHorizontal: 14, borderRadius: radius.lg },
  mine: { alignSelf: 'flex-end', backgroundColor: colors.accent, borderBottomRightRadius: 4 },
  theirs: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderBottomLeftRadius: 4,
  },
  bubbleText: { fontSize: 15, lineHeight: 21, color: colors.ink },
  mineText: { color: colors.white },
  inputRow: {
    flexDirection: 'row',
    gap: space.sm,
    padding: space.md,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    minHeight: 46,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    fontSize: 15,
  },
  send: {
    minHeight: 46,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    backgroundColor: colors.ink,
    justifyContent: 'center',
  },
  sendText: { color: colors.white, fontWeight: '700' },
});
