/**
 * Design tokens: typography, space, radius, size, shadow
 * Maps visualstyle.json tokens for reuse across the app.
 */
import { Platform } from 'react-native';

// 8pt grid spacing
export const Space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

// Touch targets must be >= 44px per accessibility
export const Size = {
  touchMin: 44,
  inputHeight: 48,
  headerHeight: 56,
  fab: 56,
  tabIcon: 24,
} as const;

// Typography scale (size, weight, lineHeight)
export const Typography = {
  h1: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  h2: { fontSize: 18, fontWeight: '600' as const, lineHeight: 26 },
  h3: { fontSize: 16, fontWeight: '600' as const, lineHeight: 22 },
  body: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  button: { fontSize: 16, fontWeight: '600' as const, lineHeight: 20 },
} as const;

// Shadow: iOS uses shadow*, Android uses elevation
export const Shadow = {
  card: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    android: { elevation: 2 },
    default: {},
  }),
  fab: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.16,
      shadowRadius: 12,
    },
    android: { elevation: 6 },
    default: {},
  }),
} as const;
