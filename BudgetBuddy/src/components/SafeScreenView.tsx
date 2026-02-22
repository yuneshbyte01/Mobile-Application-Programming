import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';

type SafeScreenViewProps = {
  children: React.ReactNode;
  style?: object;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
};

/**
 * Wraps content with safe area insets. Use for tab screens that have no header.
 */
export default function SafeScreenView({
  children,
  style,
  edges = ['top'],
}: SafeScreenViewProps) {
  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: Colors.neutral.bg }, style]}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
}
