/**
 * Design tokens: colors from visualstyle.json
 * Light theme is default. Dark tokens for dark mode.
 */
export const Colors = {
  brand: {
    primary: '#6C63FF',
    secondary: '#2EC4B6',
    accent: '#4D96FF',
  },
  neutral: {
    bg: '#F5F7FA',
    surface: '#FFFFFF',
    textPrimary: '#333333',
    textSecondary: '#777777',
    border: '#E0E0E0',
    muted: '#9AA0A6',
  },
  status: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#4D96FF',
  },
  dark: {
    bg: '#121212',
    surface: '#1E1E1E',
    textPrimary: '#FFFFFF',
    textSecondary: '#BBBBBB',
    border: '#2A2A2A',
  },
} as const;

export type ColorToken = typeof Colors;
