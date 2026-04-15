import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/apiClient';
import { categoriaService, CategoriaOption } from '@/services/api/categoriaService';
import { COLORS } from '@/constants';
import { RootStackParamList } from '@/navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

export default function RegisterScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CategoriaOption[]>([]);

  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    region: '',
    comuna: '',
    userType: 'client' as 'client' | 'experto',
    especialidades: [] as number[],
  });

  useEffect(() => {
    if (form.userType === 'experto') {
      categoriaService.getAllFormatted().then(setCategories).catch(() => {});
    }
  }, [form.userType]);

  const update = (key: keyof typeof form, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const toggleEspecialidad = (id: number) => {
    setForm(prev => ({
      ...prev,
      especialidades: prev.especialidades.includes(id)
        ? prev.especialidades.filter(e => e !== id)
        : [...prev.especialidades, id],
    }));
  };

  const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }
    if (form.userType === 'experto' && form.especialidades.length === 0) {
      Alert.alert('Error', 'Selecciona al menos una especialidad.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/register', {
        nombres: form.nombres,
        apellidos: form.apellidos,
        email: form.email,
        password: form.password,
        telefono: form.telefono,
        region: form.region,
        comuna: form.comuna,
        userType: form.userType,
        especialidades: form.userType === 'experto' ? form.especialidades : undefined,
      });
      await login(response);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No se pudo crear la cuenta.';
      Alert.alert('Error', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Crear Cuenta</Text>

        {/* Tipo de usuario */}
        <Text style={styles.label}>Tipo de cuenta</Text>
        <View style={styles.typeRow}>
          {(['client', 'experto'] as const).map(type => (
            <TouchableOpacity
              key={type}
              style={[styles.typeBtn, form.userType === type && styles.typeBtnActive]}
              onPress={() => update('userType', type)}
            >
              <Text style={[styles.typeBtnText, form.userType === type && styles.typeBtnTextActive]}>
                {type === 'client' ? 'Cliente' : 'Experto'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Nombres</Text>
        <TextInput style={styles.input} value={form.nombres} onChangeText={v => update('nombres', v)} placeholder="Tu nombre" placeholderTextColor={COLORS.textSecondary} />

        <Text style={styles.label}>Apellidos</Text>
        <TextInput style={styles.input} value={form.apellidos} onChangeText={v => update('apellidos', v)} placeholder="Tus apellidos" placeholderTextColor={COLORS.textSecondary} />

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput style={styles.input} value={form.email} onChangeText={v => update('email', v)} placeholder="correo@ejemplo.com" keyboardType="email-address" autoCapitalize="none" placeholderTextColor={COLORS.textSecondary} />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput style={styles.input} value={form.telefono} onChangeText={v => update('telefono', v)} placeholder="+56 9 1234 5678" keyboardType="phone-pad" placeholderTextColor={COLORS.textSecondary} />

        <Text style={styles.label}>Región</Text>
        <TextInput style={styles.input} value={form.region} onChangeText={v => update('region', v)} placeholder="Ej: Metropolitana" placeholderTextColor={COLORS.textSecondary} />

        <Text style={styles.label}>Comuna</Text>
        <TextInput style={styles.input} value={form.comuna} onChangeText={v => update('comuna', v)} placeholder="Ej: Santiago" placeholderTextColor={COLORS.textSecondary} />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput style={styles.input} value={form.password} onChangeText={v => update('password', v)} placeholder="Mínimo 6 caracteres" secureTextEntry placeholderTextColor={COLORS.textSecondary} />

        <Text style={styles.label}>Confirmar contraseña</Text>
        <TextInput style={styles.input} value={form.confirmPassword} onChangeText={v => update('confirmPassword', v)} placeholder="Repite tu contraseña" secureTextEntry placeholderTextColor={COLORS.textSecondary} />

        {/* Especialidades (solo si es experto) */}
        {form.userType === 'experto' && categories.length > 0 && (
          <View style={styles.especialidades}>
            <Text style={styles.label}>Especialidades</Text>
            <View style={styles.chipsWrap}>
              {categories.map(cat => {
                const selected = form.especialidades.includes(Number(cat.id));
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() => toggleEspecialidad(Number(cat.id))}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>
            ¿Ya tienes cuenta? <Text style={styles.linkAccent}>Inicia sesión</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  inner: { flexGrow: 1, padding: 24, paddingTop: 48 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.text, marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 10,
    padding: 12, fontSize: 15, color: COLORS.text,
    backgroundColor: COLORS.surface, marginBottom: 16,
  },
  typeRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  typeBtn: {
    flex: 1, padding: 12, borderRadius: 10,
    borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center',
  },
  typeBtnActive: { borderColor: COLORS.primary, backgroundColor: '#FFF7ED' },
  typeBtnText: { fontSize: 15, fontWeight: '600', color: COLORS.textSecondary },
  typeBtnTextActive: { color: COLORS.primary },
  especialidades: { marginBottom: 16 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  chipSelected: { borderColor: COLORS.primary, backgroundColor: '#FFF7ED' },
  chipText: { fontSize: 13, color: COLORS.textSecondary },
  chipTextSelected: { color: COLORS.primary, fontWeight: '600' },
  button: {
    backgroundColor: COLORS.primary, borderRadius: 10,
    padding: 15, alignItems: 'center', marginTop: 8,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  linkButton: { marginTop: 16, alignItems: 'center', marginBottom: 32 },
  linkText: { fontSize: 14, color: COLORS.textSecondary },
  linkAccent: { color: COLORS.primary, fontWeight: '600' },
});
