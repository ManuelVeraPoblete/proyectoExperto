import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import useClientJobs from '@/hooks/useClientJobs';
import StatusBadge from '@/components/common/StatusBadge';
import UserAvatar from '@/components/common/UserAvatar';
import { COLORS } from '@/constants';
import { ClientTabNavigationProp } from '@/navigation/types';

export default function ClientDashboardScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation<ClientTabNavigationProp>();
  const { recentJobs, isLoading, pendingJobs, inProgressJobs, completedJobs, refreshJobs } = useClientJobs();

  const stats = [
    { label: 'Activos', value: pendingJobs.length, color: COLORS.primary, icon: 'briefcase-outline' },
    { label: 'En Progreso', value: inProgressJobs.length, color: '#7C3AED', icon: 'progress-wrench' },
    { label: 'Completados', value: completedJobs.length, color: COLORS.success, icon: 'check-circle-outline' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshJobs} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, {user?.nombres} 👋</Text>
          <Text style={styles.subGreeting}>¿En qué trabajaremos hoy?</Text>
        </View>
        <UserAvatar uri={user?.avatar} name={`${user?.nombres} ${user?.apellidos}`} size={44} />
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {stats.map(s => (
          <View key={s.label} style={styles.statCard}>
            <MaterialCommunityIcons name={s.icon as never} size={24} color={s.color} />
            <Text style={[styles.statNumber, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Quick actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('PublicarTrabajo')}
          >
            <MaterialCommunityIcons name="plus-circle" size={28} color={COLORS.primary} />
            <Text style={styles.actionText}>Publicar{'\n'}Trabajo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('BuscarExpertos')}
          >
            <MaterialCommunityIcons name="magnify" size={28} color={COLORS.secondary} />
            <Text style={styles.actionText}>Buscar{'\n'}Expertos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('MisTrabajosCliente')}
          >
            <MaterialCommunityIcons name="briefcase" size={28} color="#7C3AED" />
            <Text style={styles.actionText}>Mis{'\n'}Trabajos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('MensajesCliente')}
          >
            <MaterialCommunityIcons name="message" size={28} color={COLORS.success} />
            <Text style={styles.actionText}>Mis{'\n'}Mensajes</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent jobs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trabajos Recientes</Text>
        {recentJobs.slice(0, 5).length === 0 ? (
          <Text style={styles.emptyText}>No tienes trabajos publicados aún.</Text>
        ) : (
          recentJobs.slice(0, 5).map(job => (
            <View key={job.id} style={styles.jobCard}>
              <View style={styles.jobTop}>
                <Text style={styles.jobTitle} numberOfLines={1}>{job.title}</Text>
                <StatusBadge status={job.status} />
              </View>
              <Text style={styles.jobMeta}>
                {job.experto ?? 'Sin experto asignado'} · {job.date}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <MaterialCommunityIcons name="logout" size={18} color={COLORS.error} />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingTop: 56 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  subGreeting: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 12,
    padding: 14, alignItems: 'center', gap: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  statNumber: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, color: COLORS.textSecondary, textAlign: 'center' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 12,
    padding: 14, alignItems: 'center', gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  actionText: { fontSize: 12, color: COLORS.text, textAlign: 'center', fontWeight: '600' },
  jobCard: {
    backgroundColor: COLORS.surface, borderRadius: 10, padding: 14, marginBottom: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 3, elevation: 1,
  },
  jobTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  jobTitle: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.text, marginRight: 8 },
  jobMeta: { fontSize: 12, color: COLORS.textSecondary },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', paddingVertical: 20 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  logoutText: { fontSize: 15, color: COLORS.error, fontWeight: '600' },
});
