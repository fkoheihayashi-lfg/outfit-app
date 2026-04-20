import { Item } from '../types';

// Maps common color aliases → the canonical name used by colorLogic.ts.
// Canonical neutrals: black · white · grey · navy · beige · cream · brown
// Canonical non-neutrals in compatible pairs: red · blue · olive
const COLOR_ALIASES: Record<string, string> = {
  // grey family — standardise on 'grey' (colorLogic accepts both, one canonical form)
  'gray':       'grey',
  'dark gray':  'grey',
  'light gray': 'grey',
  'dark grey':  'grey',
  'light grey': 'grey',
  'charcoal':   'grey',
  'silver':     'grey',

  // navy / blue family
  'dark blue':  'navy',
  'navy blue':  'navy',
  'dark navy':  'navy',
  'cobalt':     'blue',
  'royal blue': 'blue',
  'light blue': 'blue',
  'sky blue':   'blue',

  // white family
  'ivory':      'white',
  'off white':  'white',
  'off-white':  'white',

  // beige / tan family
  'tan':    'beige',
  'sand':   'beige',
  'camel':  'beige',

  // olive family
  'khaki':       'olive',
  'olive green': 'olive',

  // brown family
  'chocolate': 'brown',
  'cognac':    'brown',
  'caramel':   'brown',

  // black family
  'jet':       'black',
  'jet black': 'black',
  'onyx':      'black',
};

export const normalizeColor = (raw: string): string => {
  const key = raw.toLowerCase().trim();
  return COLOR_ALIASES[key] ?? key;
};

// Applies normalisation to all fields that could arrive inconsistently.
// Category, season, and formality are TypeScript-constrained enums set via
// chip UI, so they cannot be invalid — only color needs runtime normalisation.
export const normalizeItem = (item: Item): Item =>
  item.color === normalizeColor(item.color)
    ? item
    : { ...item, color: normalizeColor(item.color) };
