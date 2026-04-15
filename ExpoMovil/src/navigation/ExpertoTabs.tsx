import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ExpertoTabParamList } from './types';
import { COLORS } from '@/constants';

import ExpertoDashboardScreen from '@/screens/experto/ExpertoDashboardScreen';
import BuscarTrabajosScreen from '@/screens/experto/BuscarTrabajosScreen';
import MisTrabajosExpertoScreen from '@/screens/experto/MisTrabajosExpertoScreen';
import MensajesExpertoScreen from '@/screens/mensajes/MensajesScreen';
import PerfilExpertoScreen from '@/screens/experto/PerfilExpertoScreen';

const Tab = createBottomTabNavigator<ExpertoTabParamList>();

export default function ExpertoTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.secondary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: { borderTopColor: COLORS.border, paddingBottom: 4 },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="ExpertoDashboard"
        component={ExpertoDashboardScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="BuscarTrabajos"
        component={BuscarTrabajosScreen}
        options={{
          title: 'Trabajos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MisTrabajosExperto"
        component={MisTrabajosExpertoScreen}
        options={{
          title: 'Mis Trabajos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="briefcase-check" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MensajesExperto"
        component={MensajesExpertoScreen}
        options={{
          title: 'Mensajes',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="message" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="PerfilExperto"
        component={PerfilExpertoScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
