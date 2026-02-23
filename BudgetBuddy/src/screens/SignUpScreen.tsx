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
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { signUp } from '../services/authService';
import { createProfile } from '../services/profileService';
import { screenContainer, primaryButton } from '../styles/commonStyles';
import { Typography } from '../styles/tokens';
import { Colors } from '../constants/Colors';
import { Strings } from '../constants/Strings';
import { Space, Radius, Size } from '../styles/tokens';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

export default function SignUpScreen() {
  const navigation = useNavigation<Nav>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setError('');
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter a password (at least 6 characters).');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const user = await signUp(email.trim(), password, name.trim());
      await createProfile(user.uid, { name: name.trim(), email: email.trim() });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed. Please try again.');
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
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require('../../icons/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>{Strings.appName}</Text>
        <Text style={styles.title}>{Strings.auth.signUp}</Text>

        <View style={styles.inputWrap}>
          <Ionicons name="person-outline" size={20} color={Colors.neutral.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={Strings.auth.fullName}
            placeholderTextColor={Colors.neutral.textSecondary}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            editable={!loading}
          />
        </View>
        <View style={styles.inputWrap}>
          <Ionicons name="mail-outline" size={20} color={Colors.neutral.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={Strings.auth.emailAddress}
            placeholderTextColor={Colors.neutral.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
        </View>
        <View style={styles.inputWrap}>
          <Ionicons name="lock-closed-outline" size={20} color={Colors.neutral.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={Strings.auth.password}
            placeholderTextColor={Colors.neutral.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!loading}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={Colors.neutral.textSecondary}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.inputWrap}>
          <Ionicons name="lock-closed-outline" size={20} color={Colors.neutral.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={Strings.auth.confirmPassword}
            placeholderTextColor={Colors.neutral.textSecondary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            editable={!loading}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={Colors.neutral.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity
          style={[primaryButton, styles.button]}
          onPress={handleSignUp}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={Colors.neutral.surface} size="small" />
          ) : (
            <>
              <Text style={styles.buttonText}>{Strings.auth.createAccount}</Text>
              <Ionicons name="arrow-forward" size={20} color={Colors.neutral.surface} />
            </>
          )}
        </TouchableOpacity>
        <View style={styles.linkWrap}>
          <Text style={styles.linkPrompt}>{Strings.auth.hasAccount}</Text>
          <TouchableOpacity
            onPress={() => navigation.replace('LogIn')}
            disabled={loading}
          >
            <Text style={styles.linkText}>{Strings.auth.hasAccountLink}</Text>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 32,
  },
  logo: {
    width: 96,
    height: 96,
    alignSelf: 'center',
    marginBottom: 8,
  },
  appName: {
    ...Typography.h1,
    fontWeight: '700',
    color: Colors.neutral.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  title: {
    ...Typography.h2,
    fontWeight: '700',
    color: Colors.neutral.textPrimary,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Size.inputHeight,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    backgroundColor: Colors.neutral.surface,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.neutral.textPrimary,
    paddingVertical: 0,
  },
  eyeBtn: {
    padding: Space.xs,
  },
  error: {
    ...Typography.caption,
    color: Colors.status.error,
    marginBottom: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  buttonText: {
    ...Typography.button,
    color: Colors.neutral.surface,
  },
  linkWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  linkPrompt: {
    ...Typography.body,
    color: Colors.neutral.textSecondary,
  },
  linkText: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.brand.primary,
  },
});
