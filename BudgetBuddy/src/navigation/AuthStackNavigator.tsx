import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Strings } from '../constants/Strings';
import type { AuthStackParamList } from './types';

import GetStartedScreen from '../screens/GetStartedScreen';
import SignUpScreen from '../screens/SignUpScreen';
import LogInScreen from '../screens/LogInScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
      initialRouteName={Strings.routes.GetStarted}
    >
      <Stack.Screen
        name={Strings.routes.GetStarted}
        component={GetStartedScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={Strings.routes.SignUp}
        component={SignUpScreen}
        options={{ title: 'Sign Up' }}
      />
      <Stack.Screen
        name={Strings.routes.LogIn}
        component={LogInScreen}
        options={{ title: 'Log In' }}
      />
      <Stack.Screen
        name={Strings.routes.ForgotPassword}
        component={ForgotPasswordScreen}
        options={{ title: 'Reset Password' }}
      />
    </Stack.Navigator>
  );
}
