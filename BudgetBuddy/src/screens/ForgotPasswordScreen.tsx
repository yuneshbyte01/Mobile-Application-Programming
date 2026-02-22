import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/types';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { resetPassword } from '../services/authService';
import { screenContainer, primaryButton } from '../styles/commonStyles';
import { Typography } from '../styles/tokens';
import { Colors } from '../constants/Colors';
import { Strings } from '../constants/Strings';
import { Space, Radius, Size } from '../styles/tokens';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<Nav>();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendReset = async () => {
    setError('');
    setSuccess(false);
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, screenContainer]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{Strings.auth.resetPasswordTitle}</Text>
        <Text style={styles.subtitle}>{Strings.auth.resetPasswordSubtitle}</Text>
        <TextInput
          style={styles.input}
          placeholder={Strings.auth.email}
          placeholderTextColor={Colors.neutral.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? (
          <Text style={styles.success}>Check your email for the reset link.</Text>
        ) : null}
        <TouchableOpacity
          style={[primaryButton, styles.button]}
          onPress={handleSendReset}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={Colors.neutral.surface} size="small" />
          ) : (
            <Text style={styles.buttonText}>{Strings.auth.sendResetLink}</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('LogIn')}
          style={styles.link}
          disabled={loading}
        >
          <Text style={styles.linkText}>{Strings.auth.backToLogIn}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    ...Typography.h1,
    color: Colors.neutral.textPrimary,
    marginBottom: 12,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.neutral.textSecondary,
    marginBottom: 24,
  },
  input: {
    height: Size.inputHeight,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    backgroundColor: Colors.neutral.surface,
    paddingHorizontal: 12,
    marginBottom: 12,
    ...Typography.body,
    color: Colors.neutral.textPrimary,
  },
  error: {
    ...Typography.caption,
    color: Colors.status.error,
    marginBottom: 12,
  },
  success: {
    ...Typography.body,
    color: Colors.status.success,
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
    marginBottom: 16,
  },
  buttonText: {
    ...Typography.button,
    color: Colors.neutral.surface,
  },
  link: {
    alignSelf: 'center',
    padding: Space.sm,
  },
  linkText: {
    ...Typography.body,
    color: Colors.brand.primary,
  },
});
