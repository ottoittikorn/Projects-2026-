import { createContext, useContext, useMemo, useRef, useState } from 'react';

import { DEMO_TOP_ARTISTS } from '../data/options';
import { FAKE_REPLIES, PEOPLE } from '../data/people';
import { ageFromBirthDate } from '../lib/matching';

// Everything the prototype remembers while it's open: your profile,
// who you passed or liked, your matches and your chats.
// It resets when the app restarts; phase 3 saves it to a real database.

const emptyProfile = {
  name: '',
  birthDate: null, // { day, month, year }
  city: '',
  instruments: [], // [{ name: 'Guitar', level: 3 }]
  genres: [],
  topArtists: [],
  prefs: {
    maxDistanceKm: 15,
    ageMin: 21,
    ageMax: 38,
    levelMin: 2,
    levelMax: 4,
    learnFromOlder: false,
    genreMode: 'overlap',
    lookingFor: [],
  },
};

const demoProfile = {
  name: 'Otto',
  birthDate: { day: 14, month: 5, year: 1997 },
  city: 'Your city',
  instruments: [
    { name: 'Guitar', level: 3 },
    { name: 'Vocals', level: 1 },
  ],
  genres: ['Indie rock', 'Funk', 'Blues'],
  topArtists: DEMO_TOP_ARTISTS,
  prefs: { ...emptyProfile.prefs },
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [profile, setProfile] = useState(emptyProfile);
  const [decisions, setDecisions] = useState({}); // { maya: 'like', leo: 'pass' }
  const [matches, setMatches] = useState([]); // ['maya', ...]
  const [messages, setMessages] = useState({}); // { maya: [{ from: 'me', text }] }
  const replyCount = useRef(0);

  // `me` is your profile in the same shape as the made-up people, for matching.
  const me = useMemo(
    () => ({
      ...profile,
      age: profile.birthDate ? ageFromBirthDate(profile.birthDate) : 0,
    }),
    [profile],
  );

  const value = {
    profile,
    me,
    decisions,
    matches,
    messages,

    updateProfile(changes) {
      setProfile((p) => ({ ...p, ...changes }));
    },

    updatePrefs(changes) {
      setProfile((p) => ({ ...p, prefs: { ...p.prefs, ...changes } }));
    },

    // Returns true when this "Let's jam" creates a match.
    decide(personId, choice) {
      setDecisions((d) => ({ ...d, [personId]: choice }));
      const person = PEOPLE.find((p) => p.id === personId);
      const isMatch = choice === 'like' && person.likesYou;
      if (isMatch) setMatches((m) => (m.includes(personId) ? m : [...m, personId]));
      return isMatch;
    },

    sendMessage(personId, text) {
      const add = (from, t) =>
        setMessages((all) => ({ ...all, [personId]: [...(all[personId] || []), { from, text: t }] }));
      add('me', text);
      // Pretend the other person answers a moment later.
      const reply = FAKE_REPLIES[replyCount.current % FAKE_REPLIES.length];
      replyCount.current += 1;
      setTimeout(() => add('them', reply), 1500);
    },

    startOver() {
      setDecisions({});
    },

    loadDemoProfile() {
      setProfile(demoProfile);
    },

    resetEverything() {
      setProfile(emptyProfile);
      setDecisions({});
      setMatches([]);
      setMessages({});
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
