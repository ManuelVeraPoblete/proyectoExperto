import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal,
  FlatList, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { applicationService, ApiApplication } from '@/services/api/applicationService';
import { toAbsoluteUrl } from '@/lib/api-config';
import UserAvatar from '@/components/common/UserAvatar';
import { COLORS } from '@/constants';
import { RootStackParamList } from '@/navigation/types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

// ─── Estrellas de calificación ────────────────────────────────────────────────
const Stars = ({ rating }: { rating: number }) => (
  <View style={stars.row}>
    {[1, 2, 3, 4, 5].map(i => (
      <MaterialCommunityIcons
        key={i}
        name={i <= Math.round(rating) ? 'star' : 'star-outline'}
        size={13}
        color={i <= Math.round(rating) ? '#FBBF24' : COLORS.border}
      />
    ))}
    <Text style={stars.label}>{rating.toFixed(1)}</Text>
  </View>
);

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  visible: boolean;
  jobId: string;
  jobTitle: string;
  onClose: () => void;
  onAssigned: () => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────
export default function PostulantesSheet({ visible, jobId, jobTitle, onClose, onAssigned }: Props) {
  const navigation = useNavigation<NavProp>();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [rejectedIds, setRejectedIds] = useState<Set<number>>(new Set());

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['applications', jobId],
    queryFn: () => applicationService.getForJob(jobId),
    enabled: visible && !!jobId,
  });

  const acceptMutation = useMutation({
    mutationFn: (appId: number) => applicationService.accept(appId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-jobs'] });
      Alert.alert('¡Experto asignado!', 'El trabajo pasó a estado "En Proceso".');
      setSelectedId(null);
      setRejectedIds(new Set());
      onAssigned();
      onClose();
    },
    onError: () => Alert.alert('Error', 'No se pudo asignar el experto. Intenta de nuevo.'),
  });

  const rejectMutation = useMutation({
    mutationFn: (appId: number) => applicationService.reject(appId),
    onSuccess: (_, appId) => {
      setRejectedIds(prev => new Set(prev).add(appId));
      if (selectedId === appId) setSelectedId(null);
    },
    onError: () => Alert.alert('Error', 'No se pudo rechazar al postulante.'),
  });

  const handleClose = () => {
    if (acceptMutation.isPending || rejectMutation.isPending) return;
    setSelectedId(null);
    setRejectedIds(new Set());
    onClose();
  };

  const handleVerPerfil = (app: ApiApplication) => {
    handleClose();
    navigation.navigate('PerfilPublicoExperto', { expertId: app.expertId });
  };

  const visibleApps = applications.filter(a => !rejectedIds.has(a.id));
  const isBusy = acceptMutation.isPending || rejectMutation.isPending;

  const renderApp = ({ item }: { item: ApiApplication }) => {
    const profile  = item.Experto?.ExpertoProfile;
    const nombre   = item.Experto
      ? `${item.Experto.nombres} ${item.Experto.apellidos}`
      : 'Experto';
    const rating   = profile?.avg_calificacion ?? 0;
    const isSelected = selectedId === item.id;

    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => setSelectedId(isSelected ? null : item.id)}
        activeOpacity={0.85}
      >
        {/* Indicador de selección */}
        {isSelected && (
          <View style={styles.selectedBadge}>
            <MaterialCommunityIcons name="check-circle" size={16} color={COLORS.secondary} />
            <Text style={styles.selectedBadgeText}>Seleccionado</Text>
          </View>
        )}

        {/* Fila superior: avatar + info + acciones */}
        <View style={styles.cardTop}>
          <UserAvatar
            uri={toAbsoluteUrl(profile?.avatar_url)}
            name={nombre}
            size={44}
          />

          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>{nombre}</Text>
            {rating > 0 && <Stars rating={rating} />}
            {profile?.comuna && (
              <View style={styles.locationRow}>
                <MaterialCommunityIcons name="map-marker" size={12} color={COLORS.textSecondary} />
                <Text style={styles.locationText}>{profile.comuna}</Text>
              </View>
            )}
          </View>

          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.profileBtn}
              onPress={() => handleVerPerfil(item)}
              disabled={isBusy}
            >
              <MaterialCommunityIcons name="account-search" size={14} color={COLORS.secondary} />
              <Text style={styles.profileBtnText}>Ver Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rejectBtn}
              onPress={() => rejectMutation.mutate(item.id)}
              disabled={isBusy}
            >
              {rejectMutation.isPending && rejectMutation.variables === item.id ? (
                <ActivityIndicator size="small" color={COLORS.error} />
              ) : (
                <>
                  <MaterialCommunityIcons name="close-circle-outline" size={14} color={COLORS.error} />
                  <Text style={styles.rejectBtnText}>Rechazar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Mensaje de propuesta */}
        {item.mensaje ? (
          <View style={styles.mensajeBox}>
            <Text style={styles.mensajeText} numberOfLines={2}>
              "{item.mensaje}"
            </Text>
          </View>
        ) : null}

        {/* Presupuesto ofrecido */}
        {item.presupuesto_ofrecido && item.presupuesto_ofrecido > 0 ? (
          <Text style={styles.budgetText}>
            Presupuesto: ${Number(item.presupuesto_ofrecido).toLocaleString('es-CL')}
          </Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* ── Header ── */}
          <View style={styles.header}>
            <View style={styles.handle} />
            <View style={styles.headerRow}>
              <MaterialCommunityIcons name="account-multiple" size={20} color={COLORS.secondary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.headerTitle}>Postulantes</Text>
                <Text style={styles.headerSub} numberOfLines={1}>{jobTitle}</Text>
              </View>
              <TouchableOpacity onPress={handleClose} disabled={isBusy}>
                <MaterialCommunityIcons name="close" size={22} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Cuerpo ── */}
          {isLoading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={COLORS.secondary} />
              <Text style={styles.loadingText}>Cargando postulantes...</Text>
            </View>
          ) : visibleApps.length === 0 ? (
            <View style={styles.center}>
              <MaterialCommunityIcons name="account-off-outline" size={48} color={COLORS.border} />
              <Text style={styles.emptyText}>
                {applications.length === 0
                  ? 'Aún no hay postulantes para este trabajo.'
                  : 'Todos los postulantes han sido rechazados.'}
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.countText}>
                {visibleApps.length} postulante{visibleApps.length !== 1 ? 's' : ''} — selecciona uno para asignar
              </Text>
              <FlatList
                data={visibleApps}
                keyExtractor={item => String(item.id)}
                renderItem={renderApp}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
              />
            </>
          )}

          {/* ── Footer ── */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleClose} disabled={isBusy}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.assignBtn,
                (selectedId == null || isBusy) && styles.assignBtnDisabled,
              ]}
              onPress={() => selectedId != null && acceptMutation.mutate(selectedId)}
              disabled={selectedId == null || isBusy}
            >
              {acceptMutation.isPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <MaterialCommunityIcons name="check-circle" size={16} color="#fff" />
                  <Text style={styles.assignBtnText}>Asignar Experto</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const stars = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 2 },
  label: { fontSize: 11, color: COLORS.textSecondary, marginLeft: 3 },
});

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    maxHeight: '92%',
  },

  // Header
  header: {
    paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2, backgroundColor: COLORS.border,
    alignSelf: 'center', marginBottom: 14,
  },
  headerRow:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  headerSub:   { fontSize: 12, color: COLORS.textSecondary, marginTop: 1 },

  countText: {
    fontSize: 13, color: COLORS.textSecondary,
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4,
  },
  list: { paddingHorizontal: 16, paddingBottom: 8 },

  // Estados vacíos/carga
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, minHeight: 200 },
  loadingText: { marginTop: 12, fontSize: 14, color: COLORS.textSecondary },
  emptyText:   { marginTop: 12, fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },

  // Tarjeta de postulante
  card: {
    backgroundColor: COLORS.background, borderRadius: 12,
    padding: 14, marginBottom: 10,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  cardSelected: {
    borderColor: COLORS.secondary,
    backgroundColor: `${COLORS.secondary}08`,
  },
  selectedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    alignSelf: 'flex-start', marginBottom: 8,
    backgroundColor: `${COLORS.secondary}15`, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  selectedBadgeText: { fontSize: 11, color: COLORS.secondary, fontWeight: '700' },

  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  cardInfo: { flex: 1, gap: 2 },
  cardName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  locationText: { fontSize: 12, color: COLORS.textSecondary },

  cardActions: { gap: 6 },
  profileBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: `${COLORS.secondary}40`,
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5,
    backgroundColor: `${COLORS.secondary}08`,
  },
  profileBtnText: { fontSize: 11, color: COLORS.secondary, fontWeight: '600' },
  rejectBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: `${COLORS.error}40`,
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5,
    backgroundColor: `${COLORS.error}08`,
  },
  rejectBtnText: { fontSize: 11, color: COLORS.error, fontWeight: '600' },

  mensajeBox: {
    marginTop: 10, backgroundColor: COLORS.surface,
    borderRadius: 8, padding: 10,
    borderLeftWidth: 3, borderLeftColor: COLORS.border,
  },
  mensajeText: { fontSize: 13, color: COLORS.textSecondary, fontStyle: 'italic', lineHeight: 18 },

  budgetText: {
    marginTop: 8, fontSize: 13, fontWeight: '700', color: COLORS.primary,
  },

  // Footer
  footer: {
    flexDirection: 'row', gap: 10, padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  cancelBtn: {
    flex: 1, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 10, padding: 13, alignItems: 'center',
  },
  cancelBtnText: { fontSize: 15, color: COLORS.text, fontWeight: '600' },
  assignBtn: {
    flex: 2, backgroundColor: COLORS.secondary,
    borderRadius: 10, padding: 13, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  assignBtnDisabled: { opacity: 0.45 },
  assignBtnText: { fontSize: 15, color: '#fff', fontWeight: '700' },
});
