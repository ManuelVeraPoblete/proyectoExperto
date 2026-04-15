import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// ─── Stack raíz ──────────────────────────────────────────────────────────────
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ClientTabs: undefined;
  ExpertoTabs: undefined;
  PerfilPublicoExperto: { expertId: string };
  Chat: { contactId: string; contactName: string; contactAvatar?: string };
};

// ─── Tabs del cliente ─────────────────────────────────────────────────────────
export type ClientTabParamList = {
  ClientDashboard: undefined;
  BuscarExpertos: undefined;
  PublicarTrabajo: undefined;
  MisTrabajosCliente: undefined;
  MensajesCliente: undefined;
};

// ─── Tabs del experto ─────────────────────────────────────────────────────────
export type ExpertoTabParamList = {
  ExpertoDashboard: undefined;
  BuscarTrabajos: undefined;
  MisTrabajosExperto: undefined;
  MensajesExperto: undefined;
  PerfilExperto: undefined;
};

// ─── Props de navegación tipadas ─────────────────────────────────────────────
export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type ClientTabNavigationProp = BottomTabNavigationProp<ClientTabParamList>;
export type ExpertoTabNavigationProp = BottomTabNavigationProp<ExpertoTabParamList>;
