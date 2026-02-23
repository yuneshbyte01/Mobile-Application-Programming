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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogIn = async () => {
    setError('');
    if (!email.trim()) {
      setError('Please enter your email address.');
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
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require('../../icons/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>{Strings.appName}</Text>
        <Text style={styles.title}>{Strings.auth.logIn}</Text>

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

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.forgotLink}
          disabled={loading}
        >
          <Text style={styles.forgotText}>{Strings.auth.forgotPassword}</Text>
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
            <>
              <Text style={styles.buttonText}>{Strings.auth.logIn}</Text>
              <Ionicons name="arrow-forward" size={20} color={Colors.neutral.surface} />
            </>
          )}
        </TouchableOpacity>
        <View style={styles.linkWrap}>
          <Text style={styles.linkPrompt}>{Strings.auth.noAccount}</Text>
          <TouchableOpacity
            onPress={() => navigation.replace('SignUp')}
            disabled={loading}
          >
            <Text style={styles.linkText}>{Strings.auth.noAccountLink}</Text>
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
  forgotLink: {
    alignSelf: 'flex-end',
    paddingVertical: Space.xs,
    marginBottom: 8,
  },
  forgotText: {
    ...Typography.caption,
    color: Colors.brand.primary,
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
