import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList, StyleSheet,
  TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { trabajoService } from '@/services/api/trabajoService';
import StatusBadge from '@/components/common/StatusBadge';
import JobDetailSheet from '@/components/experto/JobDetailSheet';
import { COLORS } from '@/constants';
import { Trabajo } from '@/types';

export default function BuscarTrabajosScreen() {
  const [search, setSearch]                 = useState('');
  const [query, setQuery]                   = useState('');
  const [selectedJob, setSelectedJob]       = useState<Trabajo | null>(null);
  const [appliedIds, setAppliedIds]         = useState<Set<string>>(new Set());

  const { data: trabajos = [], isLoading } = useQuery({
    queryKey: ['trabajos-busqueda', query],
    queryFn: () => trabajoService.search({ descripcion: query || undefined }),
  });

  const handleSearch = useCallback(() => setQuery(search), [search]);

  const handleApplied = () => {
    if (selectedJob) {
      setAppliedIds(prev => new Set(prev).add(selectedJob.id));
    }
  };

  const renderJob = ({ item }: { item: Trabajo }) => {
    const applied = appliedIds.has(item.id);
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => setSelectedJob(item)}
      >
        <View style={styles.cardTop}>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.titulo}</Text>
          <StatusBadge status={item.estado} />
        </View>

        <Text style={styles.cardDesc} numberOfLines={2}>{item.descripcion}</Text>

        <View style={styles.cardMeta}>
          {(item.comuna || item.region) && (
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="map-marker" size={13} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>
                {[item.comuna, item.region].filter(Boolean).join(', ')}
              </Text>
            </View>
          )}
          {item.presupuesto > 0 && (
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="currency-usd" size={13} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>
                ${Number(item.presupuesto).toLocaleString('es-CL')}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.cardFooter}>
          <TouchableOpacity
            style={styles.detailBtn}
            onPress={() => setSelectedJob(item)}
          >
            <Text style={styles.detailBtnText}>Ver detalle</Text>
            <MaterialCommunityIcons name="chevron-right" size={16} color={COLORS.secondary} />
          </TouchableOpacity>

          {applied ? (
            <View style={styles.appliedTag}>
              <MaterialCommunityIcons name="check-circle" size={13} color={COLORS.success} />
              <Text style={styles.appliedTagText}>Postulado</Text>
            </View>
          ) : (
            item.estado === 'activo' && (
              <TouchableOpacity
                style={styles.quickApplyBtn}
                onPress={() => setSelectedJob(item)}
              >
                <Text style={styles.quickApplyBtnText}>Postular</Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.headerArea}>
        <Text style={styles.title}>Buscar Trabajos</Text>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            placeholder="Buscar por descripción..."
            placeholderTextColor={COLORS.textSecondary}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <MaterialCommunityIcons name="magnify" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Lista ── */}
      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color={COLORS.secondary} />
      ) : (
        <FlatList
          data={trabajos}
          keyExtractor={item => item.id}
          renderItem={renderJob}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {query ? 'No se encontraron trabajos.' : 'Busca trabajos disponibles en tu área.'}
            </Text>
          }
        />
      )}

      {/* ── Detalle + propuesta ── */}
      <JobDetailSheet
        visible={selectedJob !== null}
        job={selectedJob}
        alreadyApplied={selectedJob ? appliedIds.has(selectedJob.id) : false}
        onClose={() => setSelectedJob(null)}
        onApplied={handleApplied}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerArea: {
    padding: 20, paddingTop: 56,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 14 },
  searchRow: { flexDirection: 'row', gap: 8 },
  searchInput: {
    flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10,
    padding: 12, fontSize: 15, color: COLORS.text, backgroundColor: COLORS.background,
  },
  searchBtn: {
    backgroundColor: COLORS.secondary, borderRadius: 10,
    padding: 12, justifyContent: 'center',
  },
  list:   { padding: 16 },
  loader: { flex: 1, marginTop: 40 },
  empty:  { textAlign: 'center', color: COLORS.textSecondary, marginTop: 40, fontSize: 14 },

  card: {
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
  },
  cardTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', gap: 8, marginBottom: 8,
  },
  cardTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: COLORS.text },
  cardDesc:  { fontSize: 13, color: COLORS.textSecondary, marginBottom: 10, lineHeight: 18 },
  cardMeta:  { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12 },
  metaItem:  { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText:  { fontSize: 12, color: COLORS.textSecondary },

  cardFooter: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10,
  },
  detailBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  detailBtnText: { fontSize: 13, color: COLORS.secondary, fontWeight: '600' },

  quickApplyBtn: {
    backgroundColor: COLORS.secondary, borderRadius: 8,
    paddingHorizontal: 16, paddingVertical: 7,
  },
  quickApplyBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  appliedTag: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6,
    backgroundColor: `${COLORS.success}10`,
    borderWidth: 1, borderColor: `${COLORS.success}30`,
  },
  appliedTagText: { fontSize: 12, color: COLORS.success, fontWeight: '700' },
});
