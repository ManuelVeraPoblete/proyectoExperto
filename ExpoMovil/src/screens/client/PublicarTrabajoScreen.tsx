import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { trabajoService } from '@/services/api/trabajoService';
import { categoriaService, CategoriaOption } from '@/services/api/categoriaService';
import { COLORS } from '@/constants';

export default function PublicarTrabajoScreen() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<CategoriaOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    region: '',
    provincia: '',
    comuna: '',
    presupuesto: '',
  });

  useEffect(() => {
    categoriaService.getAllFormatted().then(setCategories).catch(() => {});
  }, []);

  const update = (key: keyof typeof form, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    const { titulo, descripcion, categoria, region, provincia, comuna, presupuesto } = form;
    if (!titulo || !descripcion || !categoria || !region || !provincia || !comuna || !presupuesto) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }
    setIsLoading(true);
    try {
      await trabajoService.create({
        titulo,
        descripcion,
        categoria,
        region,
        provincia,
        comuna,
        presupuesto: parseInt(presupuesto, 10),
      });
      Alert.alert('Éxito', 'Trabajo publicado correctamente.');
      setForm({ titulo: '', descripcion: '', categoria: '', region: '', provincia: '', comuna: '', presupuesto: '' });
    } catch {
      Alert.alert('Error', 'No se pudo publicar el trabajo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Publicar Trabajo</Text>

        <Text style={styles.label}>Título</Text>
        <TextInput style={styles.input} value={form.titulo} onChangeText={v => update('titulo', v)} placeholder="Ej: Instalar llave de paso" placeholderTextColor={COLORS.textSecondary} />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={form.descripcion}
          onChangeText={v => update('descripcion', v)}
          placeholder="Describe el trabajo que necesitas..."
          placeholderTextColor={COLORS.textSecondary}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Categoría</Text>
        <View style={styles.chipsWrap}>
          {categories.map(cat => {
            const selected = form.categoria === String(cat.id);
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => update('categoria', String(cat.id))}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{cat.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Región</Text>
        <TextInput style={styles.input} value={form.region} onChangeText={v => update('region', v)} placeholder="Ej: Metropolitana" placeholderTextColor={COLORS.textSecondary} />

        <Text style={styles.label}>Provincia</Text>
        <TextInput style={styles.input} value={form.provincia} onChangeText={v => update('provincia', v)} placeholder="Ej: Santiago" placeholderTextColor={COLORS.textSecondary} />

        <Text style={styles.label}>Comuna</Text>
        <TextInput style={styles.input} value={form.comuna} onChangeText={v => update('comuna', v)} placeholder="Ej: Providencia" placeholderTextColor={COLORS.textSecondary} />

        <Text style={styles.label}>Presupuesto (CLP)</Text>
        <TextInput
          style={styles.input}
          value={form.presupuesto}
          onChangeText={v => update('presupuesto', v)}
          placeholder="Ej: 50000"
          keyboardType="numeric"
          placeholderTextColor={COLORS.textSecondary}
        />

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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingTop: 56 },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 10,
    padding: 12, fontSize: 15, color: COLORS.text,
    backgroundColor: COLORS.surface, marginBottom: 16,
  },
  textarea: { height: 100, textAlignVertical: 'top' },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface,
  },
  chipSelected: { borderColor: COLORS.primary, backgroundColor: '#FFF7ED' },
  chipText: { fontSize: 13, color: COLORS.textSecondary },
  chipTextSelected: { color: COLORS.primary, fontWeight: '600' },
  button: {
    backgroundColor: COLORS.primary, borderRadius: 10,
    padding: 15, alignItems: 'center', marginTop: 8, marginBottom: 32,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
