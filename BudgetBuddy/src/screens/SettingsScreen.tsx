import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { logOut } from '../services/authService';
import { screenContainer, secondaryButton } from '../styles/commonStyles';
import { Typography } from '../styles/tokens';
import { Colors } from '../constants/Colors';
import { Space } from '../styles/tokens';

export default function SettingsScreen() {
  const [loading, setLoading] = useState(false);

  const handleLogOut = async () => {
    setLoading(true);
    try {
      await logOut();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Log out failed.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, screenContainer]}>
      <Text style={styles.title}>Settings</Text>
      <TouchableOpacity
        style={[secondaryButton, styles.logOut]}
        onPress={handleLogOut}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={styles.logOutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    ...Typography.h1,
    color: Colors.neutral.textPrimary,
    marginBottom: Space.xl,
  },
  logOut: {
    alignSelf: 'flex-start',
  },
  logOutText: {
    ...Typography.button,
    color: Colors.brand.primary,
  },
});
