import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Modal, ScrollView, Platform, ActivityIndicator,
} from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { trabajoService } from '@/services/api/trabajoService';
import { useAuth } from '@/contexts/AuthContext';
import { COLORS } from '@/constants';
import { Trabajo } from '@/types';

// ─── Frases rápidas ───────────────────────────────────────────────────────────
const QUICK_PHRASES = [
  'Tengo amplia experiencia en este tipo de trabajo.',
  'Puedo comenzar de inmediato.',
  'Ofrezco garantía en todos mis trabajos.',
  'Trabajo con materiales de primera calidad.',
];

interface Props {
  visible: boolean;
  job: Trabajo | null;
  onClose: () => void;
  onSuccess: () => void;
}

const formatCLP = (raw: string) => {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  return Number(digits).toLocaleString('es-CL');
};

export default function ApplyJobSheet({ visible, job, onClose, onSuccess }: Props) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [mensaje, setMensaje] = useState('');
  const [presupuesto, setPresupuesto] = useState('');
  const [errors, setErrors] = useState<{ mensaje?: string; presupuesto?: string }>({});

  const applyMutation = useMutation({
    mutationFn: () =>
      trabajoService.applyToJob(job!.id, {
        mensaje: mensaje.trim(),
        presupuesto_ofrecido: presupuesto
          ? parseFloat(presupuesto.replace(/\./g, '').replace(/,/g, ''))
          : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trabajos-busqueda'] });
      handleClose();
      onSuccess();
    },
    onError: (err: any) => {
      const is409 = err?.message?.includes('409') || err?.status === 409;
      setErrors({
        mensaje: is409
          ? 'Ya te postulaste a este trabajo.'
          : 'No se pudo enviar la postulación. Intenta de nuevo.',
      });
    },
  });

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (mensaje.trim().length < 10) e.mensaje = 'La propuesta debe tener al menos 10 caracteres.';
    if (mensaje.trim().length > 500) e.mensaje = 'Máximo 500 caracteres.';
    if (presupuesto) {
      const val = parseFloat(presupuesto.replace(/\./g, ''));
      if (isNaN(val) || val <= 0) e.presupuesto = 'Ingresa un valor válido mayor a 0.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    applyMutation.mutate();
  };

  const handleClose = () => {
    if (applyMutation.isPending) return;
    setMensaje('');
    setPresupuesto('');
    setErrors({});
    onClose();
  };

  const addQuickPhrase = (phrase: string) => {
    setMensaje(prev => {
      const base = prev.trim();
      return base ? `${base} ${phrase}` : phrase;
    });
    setErrors(prev => { const { mensaje: _, ...rest } = prev; return rest; });
  };

  if (!job) return null;

  const clientName = [job.cliente_nombres, job.cliente_apellidos].filter(Boolean).join(' ') || 'Cliente';
  const charCount = mensaje.length;
  const isOverLimit = charCount > 450;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* ── Header ── */}
          <View style={styles.header}>
            <View style={styles.handle} />
            <View style={styles.headerRow}>
              <MaterialCommunityIcons name="send" size={20} color={COLORS.primary} />
              <Text style={styles.headerTitle}>Enviar Propuesta</Text>
              <TouchableOpacity onPress={handleClose} disabled={applyMutation.isPending}>
                <MaterialCommunityIcons name="close" size={22} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {/* ── Resumen del trabajo ── */}
            <View style={styles.jobSummary}>
              <Text style={styles.jobSummaryTitle}>{job.titulo}</Text>
              <View style={styles.jobSummaryMeta}>
                {(job.comuna || job.region) && (
                  <View style={styles.metaRow}>
                    <MaterialCommunityIcons name="map-marker" size={13} color={COLORS.textSecondary} />
                    <Text style={styles.metaText}>{[job.comuna, job.region].filter(Boolean).join(', ')}</Text>
                  </View>
                )}
                {job.presupuesto > 0 && (
                  <View style={styles.metaRow}>
                    <MaterialCommunityIcons name="currency-usd" size={13} color={COLORS.textSecondary} />
                    <Text style={styles.metaText}>${Number(job.presupuesto).toLocaleString('es-CL')} estimado</Text>
                  </View>
                )}
              </View>
              <Text style={styles.jobSummaryClient}>Cliente: {clientName}</Text>
            </View>

            {/* ── Frases rápidas ── */}
            <Text style={styles.label}>Tu propuesta <Text style={styles.required}>*</Text></Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.phrasesScroll}>
              <View style={styles.phrasesRow}>
                {QUICK_PHRASES.map(phrase => (
                  <TouchableOpacity
                    key={phrase}
                    style={styles.phraseChip}
                    onPress={() => addQuickPhrase(phrase)}
                    disabled={applyMutation.isPending}
                  >
                    <MaterialCommunityIcons name="lightbulb-outline" size={12} color={COLORS.primary} />
                    <Text style={styles.phraseText}>
                      {phrase.split(' ').slice(0, 4).join(' ')}…
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* ── Textarea mensaje ── */}
            <TextInput
              style={[styles.textarea, errors.mensaje && styles.inputError]}
              value={mensaje}
              onChangeText={v => {
                setMensaje(v);
                setErrors(prev => { const { mensaje: _, ...r } = prev; return r; });
              }}
              placeholder="Describe tu experiencia, disponibilidad y por qué eres la mejor opción..."
              placeholderTextColor={COLORS.textSecondary}
              multiline
              numberOfLines={5}
              maxLength={500}
              editable={!applyMutation.isPending}
            />
            <View style={styles.textareaFooter}>
              {errors.mensaje
                ? <Text style={styles.errorText}>{errors.mensaje}</Text>
                : <View />}
              <Text style={[styles.charCount, isOverLimit && styles.charCountWarn]}>
                {charCount}/500
              </Text>
            </View>

            {/* ── Separador ── */}
            <View style={styles.separator} />

            {/* ── Presupuesto ── */}
            <Text style={styles.label}>
              Tu presupuesto{' '}
              <Text style={styles.optional}>(opcional)</Text>
            </Text>
            <View style={styles.currencyRow}>
              <View style={styles.currencyPrefix}>
                <Text style={styles.currencySymbol}>$</Text>
              </View>
              <TextInput
                style={[styles.currencyInput, errors.presupuesto && styles.inputError]}
                value={presupuesto}
                onChangeText={v => {
                  setPresupuesto(formatCLP(v));
                  setErrors(prev => { const { presupuesto: _, ...r } = prev; return r; });
                }}
                placeholder="150.000"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="numeric"
                editable={!applyMutation.isPending}
              />
            </View>
            {errors.presupuesto && <Text style={styles.errorText}>{errors.presupuesto}</Text>}
            <Text style={styles.hint}>Indica cuánto cobrarías en pesos chilenos.</Text>

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* ── Footer ── */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleClose}
              disabled={applyMutation.isPending}
            >
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitBtn, applyMutation.isPending && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={applyMutation.isPending}
            >
              {applyMutation.isPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <MaterialCommunityIcons name="send" size={16} color="#fff" />
                  <Text style={styles.submitBtnText}>Enviar Postulación</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2, backgroundColor: COLORS.border,
    alignSelf: 'center', marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: '700', color: COLORS.text },

  body: { paddingHorizontal: 20, paddingTop: 16 },

  // Resumen trabajo
  jobSummary: {
    backgroundColor: COLORS.background, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 20,
  },
  jobSummaryTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  jobSummaryMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: COLORS.textSecondary },
  jobSummaryClient: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },

  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  required: { color: COLORS.error },
  optional: { fontSize: 12, fontWeight: '400', color: COLORS.textSecondary },

  // Frases
  phrasesScroll: { marginBottom: 10 },
  phrasesRow: { flexDirection: 'row', gap: 6, paddingBottom: 2 },
  phraseChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
    borderWidth: 1, borderColor: `${COLORS.primary}40`,
    backgroundColor: `${COLORS.primary}08`,
  },
  phraseText: { fontSize: 11, color: COLORS.primary },

  // Textarea
  textarea: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 10,
    padding: 12, fontSize: 14, color: COLORS.text,
    backgroundColor: COLORS.background, textAlignVertical: 'top',
    minHeight: 110,
  },
  inputError: { borderColor: COLORS.error },
  textareaFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, marginBottom: 4 },
  errorText: { fontSize: 12, color: COLORS.error, marginBottom: 6, flex: 1 },
  charCount: { fontSize: 11, color: COLORS.textSecondary },
  charCountWarn: { color: COLORS.warning },

  separator: { height: 1, backgroundColor: COLORS.border, marginVertical: 16 },

  // Presupuesto
  currencyRow: { flexDirection: 'row', marginBottom: 4 },
  currencyPrefix: {
    borderWidth: 1, borderColor: COLORS.border, borderRightWidth: 0,
    borderTopLeftRadius: 10, borderBottomLeftRadius: 10,
    paddingHorizontal: 12, justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  currencySymbol: { fontSize: 15, color: COLORS.textSecondary, fontWeight: '600' },
  currencyInput: {
    flex: 1, borderWidth: 1, borderColor: COLORS.border,
    borderTopRightRadius: 10, borderBottomRightRadius: 10,
    padding: 12, fontSize: 15, color: COLORS.text,
    backgroundColor: COLORS.background,
  },
  hint: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },

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
  submitBtn: {
    flex: 2, backgroundColor: COLORS.secondary,
    borderRadius: 10, padding: 13, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { fontSize: 15, color: '#fff', fontWeight: '700' },
});
