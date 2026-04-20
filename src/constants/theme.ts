export const Colors = {
  bgBase:        '#0a0a0a',
  bgSurface:     '#141414',
  bgElevated:    '#1e1e1e',
  bgSubtle:      '#2a2a2a',
  bgMuted:       '#222222',

  textPrimary:   '#ffffff',
  textSecondary: '#999999',
  textDisabled:  '#555555',

  chipSelected:  '#ffffff',
  chipDefault:   '#222222',
  chipTextSel:   '#000000',
  chipTextDef:   '#999999',

  cardSelected:  '#ffffff',
  cardDefault:   '#2a2a2a',

  navBg:         '#0a0a0a',
  navIconActive: '#ffffff',
  navIconIdle:   '#333333',
  navFab:        '#ffffff',

  border:        '#2a2a2a',
  divider:       '#1e1e1e',
  overlay:       'rgba(0,0,0,0.6)',
};

export const Radius = {
  xs:   6,
  sm:   8,
  md:   14,
  lg:   20,
  pill: 999,
};

export const Spacing = {
  xs:      4,
  sm:      8,
  md:      16,
  lg:      20,
  xl:      24,
  xxl:     32,
  screenH: 20,
  screenV: 24,
  cardGap: 8,
};

export const Typography = {
  h1:       22,
  h2:       18,
  h3:       15,
  body:     14,
  caption:  12,
  label:    11,

  regular:  '400' as const,
  medium:   '500' as const,
  semibold: '600' as const,
  bold:     '700' as const,
};

export const NavBar = {
  height:    60,
  fabRadius: 22,
};
