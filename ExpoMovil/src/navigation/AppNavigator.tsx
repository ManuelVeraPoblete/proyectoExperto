import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@/contexts/AuthContext';
import { COLORS, ROLES } from '@/constants';
import { RootStackParamList } from './types';

import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import ClientTabs from './ClientTabs';
import ExpertoTabs from './ExpertoTabs';
import PerfilPublicoExpertoScreen from '@/screens/shared/PerfilPublicoExpertoScreen';
import ChatScreen from '@/screens/mensajes/ChatScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : user?.userType === ROLES.EXPERTO ? (
          <>
            <Stack.Screen name="ExpertoTabs" component={ExpertoTabs} />
            <Stack.Screen
              name="PerfilPublicoExperto"
              component={PerfilPublicoExpertoScreen}
              options={{ headerShown: true, title: 'Perfil del Experto' }}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{ headerShown: true }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="ClientTabs" component={ClientTabs} />
            <Stack.Screen
              name="PerfilPublicoExperto"
              component={PerfilPublicoExpertoScreen}
              options={{ headerShown: true, title: 'Perfil del Experto' }}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{ headerShown: true }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
