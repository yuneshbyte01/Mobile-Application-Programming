import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/SettingsContext';

type SafeScreenViewProps = {
  children: React.ReactNode;
  style?: object;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
};

/**
 * Wraps content with safe area insets. Use for tab screens that have no header.
 * Uses theme colors for background.
 */
export default function SafeScreenView({
  children,
  style,
  edges = ['top'],
}: SafeScreenViewProps) {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: colors.neutral.bg }, style]}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
}
