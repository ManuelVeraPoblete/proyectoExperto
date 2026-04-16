import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
  Modal, FlatList, Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/contexts/AuthContext';
import { trabajoService } from '@/services/api/trabajoService';
import { categoriaService, CategoriaOption } from '@/services/api/categoriaService';
import { COLORS } from '@/constants';

// ─── Opciones de urgencia ────────────────────────────────────────────────────
const URGENCY_OPTIONS = [
  { value: 'low',       label: 'No es urgente', sublabel: '1–2 semanas' },
  { value: 'medium',    label: 'Moderado',      sublabel: '3–7 días'    },
  { value: 'high',      label: 'Urgente',       sublabel: '1–2 días'    },
  { value: 'emergency', label: 'Emergencia',    sublabel: 'Hoy'         },
];

const MAX_IMAGES = 3;

// ─── Genera los próximos 30 días ─────────────────────────────────────────────
const NEXT_DATES: Date[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return d;
});

const DAYS   = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const formatDate = (d: Date) =>
  `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface SelectedImage { uri: string; name: string; type: string }

interface FormState {
  titulo: string;
  descripcion: string;
  categoria: string;
  urgencia: string;
  presupuesto: string;
}

// ─── Componente ───────────────────────────────────────────────────────────────
export default function PublicarTrabajoScreen() {
  const { user } = useAuth();
  const [categories, setCategories]       = useState<CategoriaOption[]>([]);
  const [isLoading, setIsLoading]         = useState(false);
  const [showUrgency, setShowUrgency]     = useState(false);
  const [showDate, setShowDate]           = useState(false);
  const [selectedDate, setSelectedDate]   = useState<Date | null>(null);
  const [images, setImages]               = useState<SelectedImage[]>([]);
  const [form, setForm] = useState<FormState>({
    titulo: '', descripcion: '', categoria: '', urgencia: '', presupuesto: '',
  });

  useEffect(() => {
    categoriaService.getAllFormatted().then(setCategories).catch(() => {});
  }, []);

  const update = (key: keyof FormState, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  // ─── Selector de imágenes ──────────────────────────────────────────────────
  const handlePickImage = async () => {
    if (images.length >= MAX_IMAGES) {
      Alert.alert('Límite alcanzado', `Máximo ${MAX_IMAGES} fotos por publicación.`);
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitas permitir el acceso a tu galería de fotos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: MAX_IMAGES - images.length,
      quality: 0.7,
    });
    if (!result.canceled) {
      const picked = result.assets.map(asset => ({
        uri:  asset.uri,
        name: asset.fileName ?? `foto_${Date.now()}.jpg`,
        type: asset.mimeType ?? 'image/jpeg',
      }));
      setImages(prev => [...prev, ...picked].slice(0, MAX_IMAGES));
    }
  };

  const removeImage = (index: number) =>
    setImages(prev => prev.filter((_, i) => i !== index));

  // ─── Envío ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.titulo || !form.descripcion || !form.categoria) {
      Alert.alert('Campos obligatorios', 'Completa el título, la descripción y la categoría.');
      return;
    }
    if (!user) {
      Alert.alert('Sesión inválida', 'Por favor vuelve a iniciar sesión.');
      return;
    }
    setIsLoading(true);
    try {
      await trabajoService.createJob({
        titulo:        form.titulo,
        descripcion:   form.descripcion,
        categoria:     form.categoria,
        urgencia:      form.urgencia   || undefined,
        fechaPreferida: selectedDate   ? selectedDate.toISOString() : undefined,
        region:        user.region,
        provincia:     user.provincia,
        comuna:        user.comuna,
        presupuesto:   form.presupuesto ? parseInt(form.presupuesto, 10) : undefined,
        images,
      });
      Alert.alert('¡Publicado!', 'Tu trabajo ha sido enviado a los expertos.');
      setForm({ titulo: '', descripcion: '', categoria: '', urgencia: '', presupuesto: '' });
      setSelectedDate(null);
      setImages([]);
    } catch {
      Alert.alert('Error', 'No se pudo publicar el trabajo. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedUrgency = URGENCY_OPTIONS.find(o => o.value === form.urgencia);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Publicar Trabajo</Text>

        {/* ── Título ── */}
        <Text style={styles.label}>Título <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={form.titulo}
          onChangeText={v => update('titulo', v)}
          placeholder="Ej: Reparar filtración en baño"
          placeholderTextColor={COLORS.textSecondary}
        />

        {/* ── Descripción ── */}
        <Text style={styles.label}>Descripción <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={form.descripcion}
          onChangeText={v => update('descripcion', v)}
          placeholder="Describe qué necesitas, dimensiones, materiales, etc."
          placeholderTextColor={COLORS.textSecondary}
          multiline
          numberOfLines={4}
        />

        {/* ── Categoría ── */}
        <Text style={styles.label}>Especialidad requerida <Text style={styles.required}>*</Text></Text>
        <View style={styles.chipsWrap}>
          {categories.map(cat => {
            const selected = form.categoria === String(cat.id);
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => update('categoria', String(cat.id))}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Urgencia ── */}
        <Text style={styles.label}>Nivel de Urgencia</Text>
        <TouchableOpacity style={styles.selectBtn} onPress={() => setShowUrgency(true)}>
          <Text style={selectedUrgency ? styles.selectBtnText : styles.selectBtnPlaceholder}>
            {selectedUrgency
              ? `${selectedUrgency.label} – ${selectedUrgency.sublabel}`
              : '¿Para cuándo lo necesitas?'}
          </Text>
          <Text style={styles.chevron}>▾</Text>
        </TouchableOpacity>

        {/* ── Fecha preferida ── */}
        <Text style={styles.label}>Fecha Preferida</Text>
        <TouchableOpacity style={styles.selectBtn} onPress={() => setShowDate(true)}>
          <Text style={selectedDate ? styles.selectBtnText : styles.selectBtnPlaceholder}>
            {selectedDate ? formatDate(selectedDate) : 'Seleccionar fecha'}
          </Text>
          <Text style={styles.chevron}>📅</Text>
        </TouchableOpacity>

        {/* ── Presupuesto ── */}
        <Text style={styles.label}>Presupuesto (CLP)</Text>
        <TextInput
          style={styles.input}
          value={form.presupuesto}
          onChangeText={v => update('presupuesto', v)}
          placeholder="Ej: 50000 (opcional)"
          keyboardType="numeric"
          placeholderTextColor={COLORS.textSecondary}
        />

        {/* ── Fotos ── */}
        <Text style={styles.label}>Fotos del trabajo ({images.length}/{MAX_IMAGES})</Text>
        <View style={styles.imagesRow}>
          {images.map((img, i) => (
            <View key={i} style={styles.thumbWrap}>
              <Image source={{ uri: img.uri }} style={styles.thumb} />
              <TouchableOpacity style={styles.removeBtn} onPress={() => removeImage(i)}>
                <Text style={styles.removeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
          {images.length < MAX_IMAGES && (
            <TouchableOpacity style={styles.addImageBtn} onPress={handlePickImage}>
              <Text style={styles.addImageIcon}>＋</Text>
              <Text style={styles.addImageLabel}>Foto</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.hint}>Las fotos ayudan a los expertos a dar presupuestos más precisos.</Text>

        {/* ── Botón publicar ── */}
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Publicando...' : 'Publicar Trabajo'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Modal urgencia ── */}
      <Modal visible={showUrgency} transparent animationType="slide" onRequestClose={() => setShowUrgency(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowUrgency(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Nivel de Urgencia</Text>
            {URGENCY_OPTIONS.map(opt => {
              const active = form.urgencia === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.sheetOption, active && styles.sheetOptionActive]}
                  onPress={() => { update('urgencia', opt.value); setShowUrgency(false); }}
                >
                  <Text style={[styles.sheetOptionLabel, active && styles.sheetOptionLabelActive]}>
                    {opt.label}
                  </Text>
                  <Text style={styles.sheetOptionSub}>{opt.sublabel}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── Modal fecha ── */}
      <Modal visible={showDate} transparent animationType="slide" onRequestClose={() => setShowDate(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowDate(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Fecha Preferida</Text>
            <FlatList
              data={NEXT_DATES}
              keyExtractor={(_, i) => String(i)}
              style={styles.dateList}
              renderItem={({ item }) => {
                const active = selectedDate?.toDateString() === item.toDateString();
                return (
                  <TouchableOpacity
                    style={[styles.dateOption, active && styles.dateOptionActive]}
                    onPress={() => { setSelectedDate(item); setShowDate(false); }}
                  >
                    <Text style={[styles.dateOptionText, active && styles.dateOptionTextActive]}>
                      {formatDate(item)}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: COLORS.background },
  content:     { padding: 20, paddingTop: 56, paddingBottom: 32 },
  title:       { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 24 },
  label:       { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  required:    { color: COLORS.error },
  input: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 10,
    padding: 12, fontSize: 15, color: COLORS.text,
    backgroundColor: COLORS.surface, marginBottom: 16,
  },
  textarea:    { height: 100, textAlignVertical: 'top' },
  chipsWrap:   { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface,
  },
  chipSelected:     { borderColor: COLORS.primary, backgroundColor: '#FFF7ED' },
  chipText:         { fontSize: 13, color: COLORS.textSecondary },
  chipTextSelected: { color: COLORS.primary, fontWeight: '600' },

  // Select buttons
  selectBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 10,
    padding: 12, backgroundColor: COLORS.surface, marginBottom: 16,
  },
  selectBtnText:        { fontSize: 15, color: COLORS.text, flex: 1 },
  selectBtnPlaceholder: { fontSize: 15, color: COLORS.textSecondary, flex: 1 },
  chevron:              { fontSize: 14, color: COLORS.textSecondary },

  // Imágenes
  imagesRow:   { flexDirection: 'row', gap: 10, marginBottom: 8 },
  thumbWrap:   { width: 80, height: 80, borderRadius: 8, overflow: 'visible' },
  thumb:       { width: 80, height: 80, borderRadius: 8 },
  removeBtn: {
    position: 'absolute', top: -6, right: -6,
    backgroundColor: COLORS.error, borderRadius: 10,
    width: 20, height: 20, alignItems: 'center', justifyContent: 'center',
  },
  removeBtnText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  addImageBtn: {
    width: 80, height: 80, borderRadius: 8,
    borderWidth: 1.5, borderColor: COLORS.border, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.surface,
  },
  addImageIcon:  { fontSize: 24, color: COLORS.primary, lineHeight: 28 },
  addImageLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  hint:          { fontSize: 12, color: COLORS.textSecondary, marginBottom: 20, fontStyle: 'italic' },

  // Botón principal
  button: {
    backgroundColor: COLORS.primary, borderRadius: 10,
    padding: 15, alignItems: 'center', marginTop: 8,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText:     { color: '#fff', fontSize: 16, fontWeight: '700' },

  // Modal bottom sheet
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: COLORS.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, paddingBottom: Platform.OS === 'ios' ? 36 : 20,
  },
  sheetTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text, marginBottom: 16 },
  sheetOption: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, paddingHorizontal: 12, borderRadius: 10, marginBottom: 6,
    backgroundColor: COLORS.background,
  },
  sheetOptionActive:      { backgroundColor: '#FFF7ED', borderWidth: 1, borderColor: COLORS.primary },
  sheetOptionLabel:       { fontSize: 15, color: COLORS.text, fontWeight: '500' },
  sheetOptionLabelActive: { color: COLORS.primary, fontWeight: '700' },
  sheetOptionSub:         { fontSize: 13, color: COLORS.textSecondary },

  // Modal fecha
  dateList:           { maxHeight: 300 },
  dateOption: {
    paddingVertical: 12, paddingHorizontal: 12, borderRadius: 8, marginBottom: 4,
    backgroundColor: COLORS.background,
  },
  dateOptionActive:    { backgroundColor: '#FFF7ED', borderWidth: 1, borderColor: COLORS.primary },
  dateOptionText:      { fontSize: 15, color: COLORS.text },
  dateOptionTextActive: { color: COLORS.primary, fontWeight: '700' },
});
