import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl,
} from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { trabajoService } from '@/services/api/trabajoService';
import StatusBadge from '@/components/common/StatusBadge';
import { COLORS } from '@/constants';
import { Trabajo } from '@/types';

type FilterKey = 'todos' | 'activo' | 'en_proceso' | 'completado';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'todos',      label: 'Todos'      },
  { key: 'activo',     label: 'Activos'    },
  { key: 'en_proceso', label: 'En Progreso'},
  { key: 'completado', label: 'Completados'},
];

export default function MisTrabajosExpertoScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<FilterKey>('todos');

  const { data: trabajos = [], isLoading } = useQuery({
    queryKey: ['my-jobs', user?.id],
    queryFn: () => trabajoService.getMisTrabajos({ expertoId: user?.id }),
    enabled: !!user?.id,
  });

  const filtered = filter === 'todos'
    ? trabajos
    : trabajos.filter((t: Trabajo) => t.estado === filter);

  const renderJob = ({ item }: { item: Trabajo }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.titulo}</Text>
        <StatusBadge status={item.estado} />
      </View>
      <Text style={styles.cardClient}>
        <MaterialCommunityIcons name="account" size={13} color={COLORS.textSecondary} />
        {' '}{item.cliente?.nombres} {item.cliente?.apellidos}
      </Text>
      <View style={styles.cardMeta}>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons name="map-marker" size={13} color={COLORS.textSecondary} />
          <Text style={styles.metaText}>{item.comuna}</Text>
        </View>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons name="currency-usd" size={13} color={COLORS.textSecondary} />
          <Text style={styles.metaText}>${item.presupuesto?.toLocaleString('es-CL')}</Text>
        </View>
        {item.calificacion != null && (
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="star" size={13} color="#FBBF24" />
            <Text style={styles.metaText}>{item.calificacion}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={styles.title}>Mis Trabajos</Text>
        <View style={styles.filtersRow}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterBtn, filter === f.key && styles.filterBtnActive]}
              onPress={() => setFilter(f.key)}
            >
              <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderJob}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => queryClient.invalidateQueries({ queryKey: ['my-jobs'] })}
          />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No hay trabajos en esta categoría.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerArea: { padding: 20, paddingTop: 56, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 14 },
  filtersRow: { flexDirection: 'row', gap: 8 },
  filterBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface },
  filterBtnActive: { borderColor: COLORS.secondary, backgroundColor: COLORS.secondary },
  filterText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500' },
  filterTextActive: { color: '#fff', fontWeight: '700' },
  list: { padding: 16 },
  card: {
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  cardTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: COLORS.text },
  cardClient: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 8 },
  cardMeta: { flexDirection: 'row', gap: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 12, color: COLORS.textSecondary },
  empty: { textAlign: 'center', color: COLORS.textSecondary, marginTop: 40, fontSize: 14 },
});
