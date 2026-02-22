import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <View style={styles.root}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
