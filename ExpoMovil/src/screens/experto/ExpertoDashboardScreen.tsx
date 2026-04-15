import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { expertoService } from '@/services/api/expertoService';
import { trabajoService } from '@/services/api/trabajoService';
import StatusBadge from '@/components/common/StatusBadge';
import UserAvatar from '@/components/common/UserAvatar';
import { COLORS } from '@/constants';
import { Trabajo } from '@/types';
import { ExpertoTabNavigationProp } from '@/navigation/types';

export default function ExpertoDashboardScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation<ExpertoTabNavigationProp>();

  const { data: stats, refetch: refetchStats, isLoading: loadingStats } = useQuery({
    queryKey: ['experto-stats', user?.id],
    queryFn: () => expertoService.getStats(user!.id),
    enabled: !!user?.id,
  });

  const { data: activeJobs = [], refetch: refetchJobs, isLoading: loadingJobs } = useQuery({
    queryKey: ['my-active-jobs', user?.id],
    queryFn: () => trabajoService.getMisTrabajos({ expertoId: user?.id, estado: 'en_proceso' }),
    enabled: !!user?.id,
  });

  const isLoading = loadingStats || loadingJobs;
  const onRefresh = () => { refetchStats(); refetchJobs(); };

  const statCards = [
    { label: 'Total',       value: stats?.totalJobs     ?? 0, color: COLORS.secondary,   icon: 'briefcase'         },
    { label: 'Activos',     value: stats?.activeJobs    ?? 0, color: COLORS.primary,     icon: 'progress-wrench'   },
    { label: 'Completados', value: stats?.completedJobs ?? 0, color: COLORS.success,     icon: 'check-circle'      },
    { label: 'Calif.',      value: stats?.avgCalificacion != null ? stats.avgCalificacion.toFixed(1) : '—', color: '#FBBF24', icon: 'star' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, {user?.nombres} 👷</Text>
          <Text style={styles.subGreeting}>Panel de experto</Text>
        </View>
        <UserAvatar uri={user?.avatar} name={`${user?.nombres} ${user?.apellidos}`} size={44} />
      </View>

      {/* Stats */}
      <View style={styles.statsGrid}>
        {statCards.map(s => (
          <View key={s.label} style={styles.statCard}>
            <MaterialCommunityIcons name={s.icon as never} size={22} color={s.color} />
            <Text style={[styles.statNumber, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Quick actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('BuscarTrabajos')}>
            <MaterialCommunityIcons name="magnify" size={26} color={COLORS.primary} />
            <Text style={styles.actionText}>Buscar{'\n'}Trabajos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('MisTrabajosExperto')}>
            <MaterialCommunityIcons name="briefcase-check" size={26} color={COLORS.secondary} />
            <Text style={styles.actionText}>Mis{'\n'}Trabajos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('MensajesExperto')}>
            <MaterialCommunityIcons name="message" size={26} color={COLORS.success} />
            <Text style={styles.actionText}>Mis{'\n'}Mensajes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('PerfilExperto')}>
            <MaterialCommunityIcons name="account-edit" size={26} color="#7C3AED" />
            <Text style={styles.actionText}>Mi{'\n'}Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Trabajos activos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trabajos en Progreso</Text>
        {activeJobs.length === 0 ? (
          <Text style={styles.emptyText}>No tienes trabajos en progreso.</Text>
        ) : (
          activeJobs.slice(0, 4).map((job: Trabajo) => (
            <View key={job.id} style={styles.jobCard}>
              <View style={styles.jobTop}>
                <Text style={styles.jobTitle} numberOfLines={1}>{job.titulo}</Text>
                <StatusBadge status={job.estado} />
              </View>
              <Text style={styles.jobMeta}>
                {job.cliente?.nombres} {job.cliente?.apellidos} · {job.comuna}
              </Text>
            </View>
          ))
        )}
      </View>

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
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  statCard: {
    width: '47%', backgroundColor: COLORS.surface, borderRadius: 12,
    padding: 14, alignItems: 'center', gap: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  statNumber: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, color: COLORS.textSecondary },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 12, padding: 12,
    alignItems: 'center', gap: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  actionText: { fontSize: 11, color: COLORS.text, textAlign: 'center', fontWeight: '600' },
  jobCard: {
    backgroundColor: COLORS.surface, borderRadius: 10, padding: 14, marginBottom: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 3, elevation: 1,
  },
  jobTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  jobTitle: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.text, marginRight: 8 },
  jobMeta: { fontSize: 12, color: COLORS.textSecondary },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', paddingVertical: 16 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  logoutText: { fontSize: 15, color: COLORS.error, fontWeight: '600' },
});
