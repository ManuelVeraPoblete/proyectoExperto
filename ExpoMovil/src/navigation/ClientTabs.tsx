import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ClientTabParamList } from './types';
import { COLORS } from '@/constants';

import ClientDashboardScreen from '@/screens/client/ClientDashboardScreen';
import BuscarExpertosScreen from '@/screens/client/BuscarExpertosScreen';
import PublicarTrabajoScreen from '@/screens/client/PublicarTrabajoScreen';
import MisTrabajosClienteScreen from '@/screens/client/MisTrabajosClienteScreen';
import MensajesClienteScreen from '@/screens/mensajes/MensajesScreen';

const Tab = createBottomTabNavigator<ClientTabParamList>();

export default function ClientTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: { borderTopColor: COLORS.border, paddingBottom: 4 },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="ClientDashboard"
        component={ClientDashboardScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="BuscarExpertos"
        component={BuscarExpertosScreen}
        options={{
          title: 'Buscar',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="PublicarTrabajo"
        component={PublicarTrabajoScreen}
        options={{
          title: 'Publicar',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus-circle" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MisTrabajosCliente"
        component={MisTrabajosClienteScreen}
        options={{
          title: 'Mis Trabajos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="briefcase" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MensajesCliente"
        component={MensajesClienteScreen}
        options={{
          title: 'Mensajes',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="message" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
