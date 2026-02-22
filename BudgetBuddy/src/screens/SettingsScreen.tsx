import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SafeScreenView from '../components/SafeScreenView';
import { logOut } from '../services/authService';
import { screenContainer, secondaryButton, cardStyle } from '../styles/commonStyles';
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
    <SafeScreenView>
      <View style={[styles.container, screenContainer]}>
        <Text style={styles.title}>Settings</Text>
        <View style={[styles.card, cardStyle]}>
        <TouchableOpacity
          style={[secondaryButton, styles.logOut]}
          onPress={handleLogOut}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.logOutText}>Log Out</Text>
        </TouchableOpacity>
        </View>
      </View>
    </SafeScreenView>
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
  card: {
    maxWidth: 200,
  },
  logOut: {
    alignSelf: 'stretch',
  },
  logOutText: {
    ...Typography.button,
    color: Colors.brand.primary,
  },
});
