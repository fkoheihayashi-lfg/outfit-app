const NEUTRAL_COLORS = ['black', 'white', 'grey', 'gray', 'navy', 'beige', 'cream', 'brown'];

const COMPATIBLE_PAIRS: [string, string][] = [
  ['navy', 'white'],
  ['navy', 'beige'],
  ['black', 'white'],
  ['black', 'red'],
  ['grey', 'blue'],
  ['grey', 'white'],
  ['beige', 'brown'],
  ['beige', 'olive'],
  ['white', 'blue'],
  ['olive', 'brown'],
  ['olive', 'navy'],
];

const normalize = (color: string): string => color.toLowerCase().trim();

export const isNeutral = (color: string): boolean =>
  NEUTRAL_COLORS.includes(normalize(color));

export const areColorsCompatible = (colorA: string, colorB: string): boolean => {
  const a = normalize(colorA);
  const b = normalize(colorB);

  if (a === b) return true;
  if (isNeutral(a) || isNeutral(b)) return true;

  return COMPATIBLE_PAIRS.some(
    ([x, y]) => (x === a && y === b) || (x === b && y === a)
  );
};
