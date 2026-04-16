import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal,
  ScrollView, Image, Platform, Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants';
import { Trabajo } from '@/types';
import { toAbsoluteUrl } from '@/lib/api-config';
import ApplyJobSheet from './ApplyJobSheet';

interface Props {
  visible: boolean;
  job: Trabajo | null;
  alreadyApplied: boolean;
  onClose: () => void;
  onApplied: () => void;
}

const SCREEN_W = Dimensions.get('window').width;

const formatDate = (iso?: string) => {
  if (!iso) return 'N/A';
  return new Date(iso).toLocaleDateString('es-CL', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

const AvatarCircle = ({ name }: { name: string }) => {
  const initials = name
    .split(' ')
    .map(w => w[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <View style={avatar.circle}>
      <Text style={avatar.text}>{initials || 'C'}</Text>
    </View>
  );
};

export default function JobDetailSheet({ visible, job, alreadyApplied, onClose, onApplied }: Props) {
  const [showApply, setShowApply]           = useState(false);
  const [lightboxIndex, setLightboxIndex]   = useState<number | null>(null);

  if (!job) return null;

  const clientName = [job.cliente_nombres, job.cliente_apellidos].filter(Boolean).join(' ') || 'Cliente';
  const photos = (job.Fotos ?? []).map(f => toAbsoluteUrl(f.photo_url) ?? '').filter(Boolean);

  const prevPhoto = () =>
    setLightboxIndex(prev => (prev === null ? null : prev === 0 ? photos.length - 1 : prev - 1));
  const nextPhoto = () =>
    setLightboxIndex(prev => (prev === null ? null : prev === photos.length - 1 ? 0 : prev + 1));

  return (
    <>
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            {/* ── Handle + close ── */}
            <View style={styles.topBar}>
              <View style={styles.handle} />
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <MaterialCommunityIcons name="close" size={22} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
              {/* Título */}
              <Text style={styles.title}>{job.titulo}</Text>

              {/* Cliente */}
              <View style={styles.clientRow}>
                <AvatarCircle name={clientName} />
                <View>
                  <Text style={styles.clientName}>{clientName}</Text>
                  <View style={styles.verifiedRow}>
                    <View style={styles.verifiedDot} />
                    <Text style={styles.verifiedText}>Cliente Verificado</Text>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Descripción */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons name="briefcase-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.sectionTitle}>Descripción del Proyecto</Text>
                </View>
                <Text style={styles.description}>{job.descripcion}</Text>
              </View>

              {/* Galería de fotos */}
              {photos.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <MaterialCommunityIcons name="image-multiple-outline" size={16} color={COLORS.primary} />
                    <Text style={styles.sectionTitle}>Fotos del Trabajo ({photos.length})</Text>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
                    {photos.map((url, i) => (
                      <TouchableOpacity key={i} onPress={() => setLightboxIndex(i)}>
                        <Image source={{ uri: url }} style={styles.photoThumb} />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              <View style={styles.divider} />

              {/* Grid de detalles */}
              <View style={styles.detailGrid}>
                <View style={styles.detailCard}>
                  <View style={styles.detailCardHeader}>
                    <MaterialCommunityIcons name="tag-outline" size={14} color={COLORS.primary} />
                    <Text style={styles.detailCardLabel}>CATEGORÍA</Text>
                  </View>
                  <Text style={styles.detailCardValue} numberOfLines={2}>
                    {(job as any).Category?.name ?? job.categoria ?? '—'}
                  </Text>
                </View>

                <View style={styles.detailCard}>
                  <View style={styles.detailCardHeader}>
                    <MaterialCommunityIcons name="map-marker-outline" size={14} color={COLORS.primary} />
                    <Text style={styles.detailCardLabel}>UBICACIÓN</Text>
                  </View>
                  <Text style={styles.detailCardValue}>
                    {[job.comuna, job.region].filter(Boolean).join(', ') || '—'}
                  </Text>
                </View>

                <View style={styles.detailCard}>
                  <View style={styles.detailCardHeader}>
                    <MaterialCommunityIcons name="calendar-outline" size={14} color={COLORS.primary} />
                    <Text style={styles.detailCardLabel}>PUBLICADO</Text>
                  </View>
                  <Text style={styles.detailCardValue}>
                    {formatDate(job.createdAt ?? job.fechaCreacion)}
                  </Text>
                </View>

                <View style={styles.detailCard}>
                  <View style={styles.detailCardHeader}>
                    <MaterialCommunityIcons name="tag-outline" size={14} color={COLORS.primary} />
                    <Text style={styles.detailCardLabel}>ESTADO</Text>
                  </View>
                  <View style={styles.estadoBadge}>
                    <Text style={styles.estadoBadgeText}>
                      {job.estado ?? 'Activo'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Presupuesto */}
              <View style={styles.budgetCard}>
                <View style={styles.budgetLeft}>
                  <MaterialCommunityIcons name="cash" size={20} color={COLORS.primary} />
                  <Text style={styles.budgetLabel}>Presupuesto Estimado</Text>
                </View>
                <Text style={styles.budgetValue}>
                  {job.presupuesto > 0
                    ? `$${Number(job.presupuesto).toLocaleString('es-CL')}`
                    : 'A convenir'}
                </Text>
              </View>

              <View style={{ height: 8 }} />
            </ScrollView>

            {/* ── Footer ── */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.closeFooterBtn} onPress={onClose}>
                <Text style={styles.closeFooterBtnText}>Cerrar</Text>
              </TouchableOpacity>
              {alreadyApplied ? (
                <View style={styles.appliedBadge}>
                  <MaterialCommunityIcons name="check-circle" size={16} color={COLORS.success} />
                  <Text style={styles.appliedBadgeText}>Ya postulaste</Text>
                </View>
              ) : (
                <TouchableOpacity style={styles.applyBtn} onPress={() => setShowApply(true)}>
                  <MaterialCommunityIcons name="send" size={16} color="#fff" />
                  <Text style={styles.applyBtnText}>Enviar Propuesta</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal propuesta */}
      <ApplyJobSheet
        visible={showApply}
        job={job}
        onClose={() => setShowApply(false)}
        onSuccess={() => {
          setShowApply(false);
          onApplied();
          onClose();
        }}
      />

      {/* Lightbox fotos */}
      <Modal
        visible={lightboxIndex !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setLightboxIndex(null)}
      >
        <View style={lightbox.overlay}>
          {lightboxIndex !== null && (
            <>
              <Image
                source={{ uri: photos[lightboxIndex] }}
                style={lightbox.image}
                resizeMode="contain"
              />
              <TouchableOpacity style={lightbox.closeBtn} onPress={() => setLightboxIndex(null)}>
                <MaterialCommunityIcons name="close-circle" size={32} color="#fff" />
              </TouchableOpacity>
              {photos.length > 1 && (
                <>
                  <TouchableOpacity style={[lightbox.navBtn, lightbox.navLeft]} onPress={prevPhoto}>
                    <MaterialCommunityIcons name="chevron-left" size={32} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={[lightbox.navBtn, lightbox.navRight]} onPress={nextPhoto}>
                    <MaterialCommunityIcons name="chevron-right" size={32} color="#fff" />
                  </TouchableOpacity>
                </>
              )}
              <View style={lightbox.counter}>
                <Text style={lightbox.counterText}>{lightboxIndex + 1} / {photos.length}</Text>
              </View>
            </>
          )}
        </View>
      </Modal>
    </>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  overlay:  { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    maxHeight: '93%',
  },
  topBar: {
    paddingTop: 10, paddingHorizontal: 16, paddingBottom: 8,
    alignItems: 'center',
  },
  handle: {
    width: 36, height: 4, borderRadius: 2, backgroundColor: COLORS.border,
    marginBottom: 10,
  },
  closeBtn: { position: 'absolute', right: 16, top: 14 },
  body: { paddingHorizontal: 20, paddingBottom: 8 },

  title: { fontSize: 20, fontWeight: '800', color: COLORS.text, marginBottom: 16, lineHeight: 26 },

  clientRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  clientName: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  verifiedDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.success },
  verifiedText: { fontSize: 12, color: COLORS.textSecondary },

  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 16 },

  section: { marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  description: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 21 },

  photosScroll: { marginTop: 2 },
  photoThumb: {
    width: 110, height: 110, borderRadius: 12, marginRight: 10,
    backgroundColor: COLORS.border,
  },

  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  detailCard: {
    width: (SCREEN_W - 50) / 2,
    backgroundColor: '#F9FAFB', borderRadius: 12,
    padding: 12, borderWidth: 1, borderColor: COLORS.border,
  },
  detailCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 },
  detailCardLabel: { fontSize: 9, fontWeight: '700', color: COLORS.textSecondary, letterSpacing: 0.8 },
  detailCardValue: { fontSize: 13, fontWeight: '600', color: COLORS.text, paddingLeft: 19 },
  estadoBadge: {
    alignSelf: 'flex-start', marginLeft: 19,
    backgroundColor: '#DCFCE7', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2,
  },
  estadoBadgeText: { fontSize: 11, fontWeight: '700', color: COLORS.success, textTransform: 'capitalize' },

  budgetCard: {
    backgroundColor: `${COLORS.primary}10`, borderRadius: 12,
    borderWidth: 1, borderColor: `${COLORS.primary}30`,
    padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 4,
  },
  budgetLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  budgetLabel: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  budgetValue: { fontSize: 20, fontWeight: '900', color: COLORS.primary },

  footer: {
    flexDirection: 'row', gap: 10, padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    borderTopWidth: 1, borderTopColor: COLORS.border,
    alignItems: 'center',
  },
  closeFooterBtn: {
    flex: 1, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 10, padding: 13, alignItems: 'center',
  },
  closeFooterBtnText: { fontSize: 15, color: COLORS.text, fontWeight: '600' },
  applyBtn: {
    flex: 2, backgroundColor: COLORS.secondary,
    borderRadius: 10, padding: 13, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  applyBtnText: { fontSize: 15, color: '#fff', fontWeight: '700' },
  appliedBadge: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, borderRadius: 10, padding: 13,
    borderWidth: 1, borderColor: `${COLORS.success}40`,
    backgroundColor: `${COLORS.success}10`,
  },
  appliedBadgeText: { fontSize: 14, color: COLORS.success, fontWeight: '700' },
});

const avatar = StyleSheet.create({
  circle: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: `${COLORS.primary}20`,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: `${COLORS.primary}30`,
  },
  text: { fontSize: 17, fontWeight: '700', color: COLORS.primary },
});

const lightbox = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center', justifyContent: 'center',
  },
  image: { width: SCREEN_W, height: '80%' },
  closeBtn: { position: 'absolute', top: 50, right: 20 },
  navBtn: {
    position: 'absolute', top: '50%',
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 24,
    padding: 4,
  },
  navLeft:  { left: 12 },
  navRight: { right: 12 },
  counter: {
    position: 'absolute', bottom: 40,
    backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 5,
  },
  counterText: { color: '#fff', fontSize: 13, fontWeight: '600' },
});
