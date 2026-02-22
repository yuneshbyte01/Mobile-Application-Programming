import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SafeScreenView from '../components/SafeScreenView';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/types';
import { screenContainer, primaryButton, secondaryButton } from '../styles/commonStyles';
import { Typography } from '../styles/tokens';
import { Colors } from '../constants/Colors';
import { Strings } from '../constants/Strings';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'GetStarted'>;

export default function GetStartedScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeScreenView edges={['top', 'left', 'right']}>
      <View style={[styles.container, screenContainer]}>
      <Text style={styles.title}>{Strings.auth.getStartedTitle}</Text>
      <Text style={styles.subtitle}>{Strings.auth.getStartedSubtitle}</Text>
      <TouchableOpacity
        style={[primaryButton, styles.button]}
        onPress={() => navigation.navigate('SignUp')}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>{Strings.auth.signUp}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[secondaryButton, styles.button]}
        onPress={() => navigation.navigate('LogIn')}
        activeOpacity={0.8}
      >
        <Text style={styles.secondaryButtonText}>{Strings.auth.logIn}</Text>
      </TouchableOpacity>
      </View>
    </SafeScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    ...Typography.h1,
    color: Colors.neutral.textPrimary,
    marginBottom: 12,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.neutral.textSecondary,
    marginBottom: 32,
    lineHeight: 22,
  },
  button: {
    marginBottom: 12,
  },
  primaryButtonText: {
    ...Typography.button,
    color: Colors.neutral.surface,
  },
  secondaryButtonText: {
    ...Typography.button,
    color: Colors.brand.primary,
  },
});
