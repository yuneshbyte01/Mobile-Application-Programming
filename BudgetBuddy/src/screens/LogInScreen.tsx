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
import { logIn } from '../services/authService';
import { screenContainer, primaryButton } from '../styles/commonStyles';
import { Typography } from '../styles/tokens';
import { Colors } from '../constants/Colors';
import { Strings } from '../constants/Strings';
import { Space, Radius, Size } from '../styles/tokens';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'LogIn'>;

export default function LogInScreen() {
  const navigation = useNavigation<Nav>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogIn = async () => {
    setError('');
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    setLoading(true);
    try {
      await logIn(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Log in failed. Please try again.');
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
        <Text style={styles.title}>{Strings.auth.logIn}</Text>
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
        <TextInput
          style={styles.input}
          placeholder={Strings.auth.password}
          placeholderTextColor={Colors.neutral.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.forgotLink}
          disabled={loading}
        >
          <Text style={styles.linkText}>{Strings.auth.forgotPassword}</Text>
        </TouchableOpacity>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity
          style={[primaryButton, styles.button]}
          onPress={handleLogIn}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={Colors.neutral.surface} size="small" />
          ) : (
            <Text style={styles.buttonText}>{Strings.auth.logIn}</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.replace('SignUp')}
          style={styles.link}
          disabled={loading}
        >
          <Text style={styles.linkText}>{Strings.auth.noAccount}</Text>
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
  forgotLink: {
    alignSelf: 'flex-end',
    paddingVertical: Space.xs,
    marginBottom: 8,
  },
  linkText: {
    ...Typography.body,
    color: Colors.brand.primary,
  },
  error: {
    ...Typography.caption,
    color: Colors.status.error,
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
});
