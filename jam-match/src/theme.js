// One place for the app's name, colours, fonts and spacing.
// Change a value here and every screen updates.
//
// Look: inspired by classic jazz record sleeves — deep blue, crisp white,
// black, and bold geometric type. (Our own design, not anyone's logo.)

import { Platform } from 'react-native';

export const APP_NAME = 'Jam Mate';

export const colors = {
  // Main brand colour.
  blue: '#0a2c7a',
  blueDark: '#071f57',
  blueSoft: '#e7ecf7',

  background: '#ffffff',
  card: '#ffffff',
  ink: '#0b0b0f', // near-black for text and selected chips
  body: '#2c2f36',
  muted: '#5c6370',
  line: '#d9dde6',
  soft: '#eef1f7',
  white: '#ffffff',
  error: '#b3261e',

  // Roles used by the screens. Point these at brand colours above.
  accent: '#0a2c7a', // buttons, sliders, links
  accentSoft: '#e7ecf7',
  highlight: '#0a2c7a', // things you have in common
};

// Bold geometric display type for titles, labels and buttons.
// Futura ships with iPhones; other platforms fall back to a similar system font.
export const fonts = {
  display: Platform.select({
    ios: 'Futura',
    android: 'sans-serif-medium',
    default: 'Futura, "Century Gothic", "Avenir Next", system-ui, sans-serif',
  }),
};

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
};
