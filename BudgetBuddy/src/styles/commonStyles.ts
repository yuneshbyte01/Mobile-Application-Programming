/**
 * Reusable style utilities from design tokens
 * Use 8pt grid (8, 12, 16, 24, 32). Touch targets >= 44px.
 */
import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { Space, Radius, Size, Typography, Shadow } from './tokens';

// Screen container
export const screenContainer = {
  flex: 1,
  padding: Space.lg,
  backgroundColor: Colors.neutral.bg,
};

// Card: surface, rounded, border, shadow
export const cardStyle = {
  padding: Space.lg,
  borderRadius: Radius.lg,
  backgroundColor: Colors.neutral.surface,
  borderWidth: 1,
  borderColor: Colors.neutral.border,
  ...Shadow.card,
};

// Button base: min height 48px, touch target friendly
export const buttonBase = {
  minHeight: Size.inputHeight,
  minWidth: Size.touchMin,
  borderRadius: Radius.md,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};

// Primary button
export const primaryButton = {
  ...buttonBase,
  backgroundColor: Colors.brand.primary,
};

// Secondary button (outlined)
export const secondaryButton = {
  ...buttonBase,
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderColor: Colors.brand.primary,
};

// Danger button
export const dangerButton = {
  ...buttonBase,
  backgroundColor: Colors.status.error,
};

// Helper to build StyleSheet from token-based objects
export const createStyles = <T extends StyleSheet.NamedStyles<T>>(
  styles: T | ((tokens: { Space: any; Radius: any; Size: any; Typography: any; Colors: typeof Colors }) => T)
): T =>
  typeof styles === 'function'
    ? StyleSheet.create(styles({ Space, Radius, Size, Typography, Colors }))
    : StyleSheet.create(styles);
