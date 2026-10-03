// The choices people can pick from during sign-up.

export const INSTRUMENTS = [
  'Guitar',
  'Bass',
  'Drums',
  'Keys',
  'Vocals',
  'Saxophone',
  'Trumpet',
  'Violin',
];

// Index 0 = Beginner … 4 = Pro. Matching compares these numbers.
export const LEVELS = ['Beginner', 'Casual', 'Intermediate', 'Advanced', 'Pro'];
export const LEVELS_SHORT = ['Beginner', 'Casual', 'Intermed.', 'Advanced', 'Pro'];

export const GENRES = [
  'Indie rock',
  'Funk',
  'Blues',
  'Jazz',
  'Metal',
  'Pop',
  'R&B',
  'Folk',
  'Hip hop',
  'Punk',
];

export const GENRE_MODES = [
  { id: 'only', label: 'Only mine' },
  { id: 'overlap', label: 'Some overlap' },
  { id: 'any', label: 'Anything' },
];

// Pretend "Connect Apple Music" result, until the real connection is built.
export const DEMO_TOP_ARTISTS = [
  'Vulfpeck',
  'Tame Impala',
  'John Mayer',
  'Arctic Monkeys',
  'Khruangbin',
];
