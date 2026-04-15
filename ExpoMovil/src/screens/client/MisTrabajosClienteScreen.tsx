import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  RefreshControl, Alert, Modal, TextInput, ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useClientJobs, { ClientJob } from '@/hooks/useClientJobs';
import StatusBadge from '@/components/common/StatusBadge';
import { COLORS } from '@/constants';

export default function MisTrabajosClienteScreen() {
  const { recentJobs, isLoading, refreshJobs, handleJobClosed, isClosingJob } = useClientJobs();
  const [closeModal, setCloseModal] = useState<ClientJob | null>(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  const onClose = async () => {
    if (!closeModal) return;
    try {
      await handleJobClosed(closeModal.id, rating, review);
      setCloseModal(null);
      setRating(5);
      setReview('');
      Alert.alert('Éxito', 'Trabajo cerrado y calificado.');
    } catch {
      Alert.alert('Error', 'No se pudo cerrar el trabajo.');
    }
  };

  const renderJob = ({ item }: { item: ClientJob }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <StatusBadge status={item.status} />
      </View>
      <Text style={styles.cardMeta}>
        {item.experto ?? 'Sin experto asignado'} · {item.date}
      </Text>
      {item.proposalCount != null && item.proposalCount > 0 && (
        <Text style={styles.proposals}>
          <MaterialCommunityIcons name="account-multiple" size={13} color={COLORS.primary} />
          {' '}{item.proposalCount} propuesta{item.proposalCount !== 1 ? 's' : ''}
        </Text>
      )}
      {item.status === 'en_proceso' && (
        <TouchableOpacity style={styles.closeBtn} onPress={() => setCloseModal(item)}>
          <Text style={styles.closeBtnText}>Cerrar y Calificar</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={styles.title}>Mis Trabajos</Text>
      </View>

      <FlatList
        data={recentJobs}
        keyExtractor={item => item.id}
        renderItem={renderJob}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshJobs} />}
        ListEmptyComponent={
          <Text style={styles.empty}>No tienes trabajos publicados.</Text>
        }
      />

      {/* Modal cerrar trabajo */}
      <Modal visible={!!closeModal} transparent animationType="slide" onRequestClose={() => setCloseModal(null)}>
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalSheet} keyboardShouldPersistTaps="handled">
            <Text style={styles.modalTitle}>Cerrar Trabajo</Text>
            <Text style={styles.modalSubtitle}>{closeModal?.title}</Text>

            <Text style={styles.label}>Calificación</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <MaterialCommunityIcons
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={36}
                    color={star <= rating ? '#FBBF24' : COLORS.border}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Reseña (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={review}
              onChangeText={setReview}
              placeholder="Comenta tu experiencia..."
              placeholderTextColor={COLORS.textSecondary}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity
              style={[styles.button, isClosingJob && styles.buttonDisabled]}
              onPress={onClose}
              disabled={isClosingJob}
            >
              <Text style={styles.buttonText}>{isClosingJob ? 'Cerrando...' : 'Confirmar Cierre'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setCloseModal(null)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerArea: { padding: 20, paddingTop: 56, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  list: { padding: 16 },
  card: {
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  cardTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: COLORS.text },
  cardMeta: { fontSize: 13, color: COLORS.textSecondary },
  proposals: { fontSize: 13, color: COLORS.primary, marginTop: 4 },
  closeBtn: { marginTop: 10, backgroundColor: COLORS.primary, borderRadius: 8, padding: 10, alignItems: 'center' },
  closeBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  empty: { textAlign: 'center', color: COLORS.textSecondary, marginTop: 40, fontSize: 14 },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: COLORS.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, maxHeight: '80%' },
  modalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  modalSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  starsRow: { flexDirection: 'row', gap: 6, marginBottom: 20 },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 15, color: COLORS.text, backgroundColor: COLORS.background, marginBottom: 16 },
  textarea: { height: 90, textAlignVertical: 'top' },
  button: { backgroundColor: COLORS.primary, borderRadius: 10, padding: 14, alignItems: 'center' },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cancelBtn: { padding: 14, alignItems: 'center', marginBottom: 20 },
  cancelText: { color: COLORS.textSecondary, fontSize: 15 },
});
