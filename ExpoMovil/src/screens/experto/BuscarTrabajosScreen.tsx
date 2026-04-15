import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList, StyleSheet,
  TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { trabajoService } from '@/services/api/trabajoService';
import StatusBadge from '@/components/common/StatusBadge';
import { COLORS } from '@/constants';
import { Trabajo } from '@/types';

export default function BuscarTrabajosScreen() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

  const { data: trabajos = [], isLoading } = useQuery({
    queryKey: ['trabajos-busqueda', query],
    queryFn: () => trabajoService.search({ descripcion: query || undefined }),
  });

  const applyMutation = useMutation({
    mutationFn: ({ jobId, mensaje }: { jobId: string; mensaje: string }) =>
      trabajoService.applyToJob(jobId, { mensaje }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trabajos-busqueda'] });
      Alert.alert('Éxito', 'Postulación enviada.');
    },
    onError: () => Alert.alert('Error', 'No se pudo enviar la postulación.'),
  });

  const handleApply = (job: Trabajo) => {
    Alert.prompt
      ? Alert.prompt(
          'Postular',
          `Escribe un mensaje para "${job.titulo}"`,
          mensaje => { if (mensaje) applyMutation.mutate({ jobId: job.id, mensaje }); },
        )
      : applyMutation.mutate({ jobId: job.id, mensaje: 'Estoy interesado en este trabajo.' });
  };

  const handleSearch = useCallback(() => setQuery(search), [search]);

  const renderJob = ({ item }: { item: Trabajo }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.titulo}</Text>
        <StatusBadge status={item.estado} />
      </View>
      <Text style={styles.cardDesc} numberOfLines={2}>{item.descripcion}</Text>
      <View style={styles.cardMeta}>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons name="map-marker" size={13} color={COLORS.textSecondary} />
          <Text style={styles.metaText}>{item.comuna}, {item.region}</Text>
        </View>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons name="currency-usd" size={13} color={COLORS.textSecondary} />
          <Text style={styles.metaText}>${item.presupuesto?.toLocaleString('es-CL')}</Text>
        </View>
      </View>
      {item.estado === 'activo' && (
        <TouchableOpacity
          style={[styles.applyBtn, applyMutation.isPending && styles.applyBtnDisabled]}
          onPress={() => handleApply(item)}
          disabled={applyMutation.isPending}
        >
          <Text style={styles.applyBtnText}>Postular</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerArea: { padding: 20, paddingTop: 56, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 14 },
  searchRow: { flexDirection: 'row', gap: 8 },
  searchInput: {
    flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10,
    padding: 12, fontSize: 15, color: COLORS.text, backgroundColor: COLORS.background,
  },
  searchBtn: { backgroundColor: COLORS.secondary, borderRadius: 10, padding: 12, justifyContent: 'center' },
  list: { padding: 16 },
  loader: { flex: 1, marginTop: 40 },
  empty: { textAlign: 'center', color: COLORS.textSecondary, marginTop: 40, fontSize: 14 },
  card: {
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  cardTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: COLORS.text },
  cardDesc: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 10 },
  cardMeta: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 12, color: COLORS.textSecondary },
  applyBtn: { backgroundColor: COLORS.secondary, borderRadius: 8, padding: 10, alignItems: 'center' },
  applyBtnDisabled: { opacity: 0.6 },
  applyBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
