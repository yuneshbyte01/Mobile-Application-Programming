import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import SafeScreenView from '../components/SafeScreenView';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/types';
import { screenContainer, primaryButton } from '../styles/commonStyles';
import { Typography } from '../styles/tokens';
import { Colors } from '../constants/Colors';
import { Strings } from '../constants/Strings';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'GetStarted'>;

export default function GetStartedScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeScreenView edges={['top', 'left', 'right']}>
      <View style={[styles.container, screenContainer]}>
        <Image
          source={require('../../icons/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>{Strings.auth.getStartedTitle}</Text>
        <Text style={styles.subtitle}>{Strings.auth.getStartedSubtitle}</Text>
        <TouchableOpacity
          style={[primaryButton, styles.button]}
          onPress={() => navigation.navigate('SignUp')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>{Strings.auth.getStarted}</Text>
          <Ionicons name="arrow-forward" size={20} color={Colors.neutral.surface} />
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
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    ...Typography.h1,
    fontWeight: '700',
    color: Colors.neutral.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.neutral.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    ...Typography.button,
    color: Colors.neutral.surface,
  },
});
