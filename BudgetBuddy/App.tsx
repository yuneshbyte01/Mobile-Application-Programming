import React from 'react';
import { View, StyleSheet } from 'react-native';
import DashboardScreen from './src/screens/DashboardScreen';

export default function App() {
  return (
    <View style={styles.root}>
      <DashboardScreen/>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
