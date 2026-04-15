import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Alert, Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/apiClient';
import { toAbsoluteUrl } from '@/lib/api-config';
import UserAvatar from '@/components/common/UserAvatar';
import { COLORS } from '@/constants';

export default function PerfilExpertoScreen() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    nombres:       user?.nombres       ?? '',
    apellidos:     user?.apellidos     ?? '',
    telefono:      user?.telefono      ?? '',
    direccion:     user?.direccion     ?? '',
    region:        user?.region        ?? '',
    comuna:        user?.comuna        ?? '',
    experience:    user?.experience    ?? '',
    hourlyRate:    user?.hourlyRate ? String(user.hourlyRate) : '',
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handlePickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    const formData = new FormData();
    formData.append('avatar', {
      uri: asset.uri,
      name: 'avatar.jpg',
      type: 'image/jpeg',
    } as unknown as Blob);

    try {
      const res = await apiClient.postForm<{ avatarUrl: string }>(`/users/${user!.id}/avatar`, formData);
      await updateUser({ avatar: toAbsoluteUrl(res.avatarUrl) });
      Alert.alert('Éxito', 'Foto de perfil actualizada.');
    } catch {
      Alert.alert('Error', 'No se pudo actualizar la foto.');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiClient.patch('/experts/profile', {
        ...form,
        hourlyRate: form.hourlyRate ? parseInt(form.hourlyRate, 10) : undefined,
      });
      await updateUser({
        nombres:    form.nombres,
        apellidos:  form.apellidos,
        telefono:   form.telefono,
        direccion:  form.direccion,
        region:     form.region,
        comuna:     form.comuna,
        experience: form.experience,
        hourlyRate: form.hourlyRate ? parseInt(form.hourlyRate, 10) : undefined,
      });
      setIsEditing(false);
      Alert.alert('Éxito', 'Perfil actualizado correctamente.');
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  const fullName = `${user?.nombres} ${user?.apellidos}`;

  const fields: { label: string; key: keyof typeof form; keyboard?: 'numeric' }[] = [
    { label: 'Nombres',    key: 'nombres' },
    { label: 'Apellidos',  key: 'apellidos' },
    { label: 'Teléfono',   key: 'telefono' },
    { label: 'Dirección',  key: 'direccion' },
    { label: 'Región',     key: 'region' },
    { label: 'Comuna',     key: 'comuna' },
    { label: 'Experiencia', key: 'experience' },
    { label: 'Tarifa/hr (CLP)', key: 'hourlyRate', keyboard: 'numeric' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <TouchableOpacity onPress={handlePickAvatar} style={styles.avatarWrapper}>
          <UserAvatar uri={user?.avatar} name={fullName} size={96} />
          <View style={styles.cameraIcon}>
            <MaterialCommunityIcons name="camera" size={16} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.nameText}>{fullName}</Text>
        <Text style={styles.emailText}>{user?.email}</Text>
        {user?.calificacion != null && (
          <View style={styles.ratingRow}>
            <MaterialCommunityIcons name="star" size={16} color="#FBBF24" />
            <Text style={styles.ratingText}>{Number(user.calificacion).toFixed(1)}</Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        {!isEditing ? (
          <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
            <MaterialCommunityIcons name="pencil" size={18} color="#fff" />
            <Text style={styles.editBtnText}>Editar Perfil</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.saveCancelRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsEditing(false)}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Text style={styles.saveBtnText}>{isSaving ? 'Guardando...' : 'Guardar'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Fields */}
      {fields.map(({ label, key, keyboard }) => (
        <View key={key} style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>{label}</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={form[key]}
              onChangeText={v => update(key, v)}
              keyboardType={keyboard ?? 'default'}
              placeholderTextColor={COLORS.textSecondary}
            />
          ) : (
            <Text style={styles.fieldValue}>
              {form[key] || <Text style={styles.fieldEmpty}>Sin información</Text>}
            </Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingTop: 56, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatarWrapper: { position: 'relative', marginBottom: 12 },
  cameraIcon: {
    position: 'absolute', bottom: 2, right: 2,
    backgroundColor: COLORS.primary, borderRadius: 12,
    width: 28, height: 28, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#fff',
  },
  nameText: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  emailText: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  ratingText: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  actionsRow: { marginBottom: 24 },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: COLORS.secondary, borderRadius: 10, padding: 12,
  },
  editBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  saveCancelRow: { flexDirection: 'row', gap: 12 },
  cancelBtn: {
    flex: 1, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 10, padding: 12, alignItems: 'center',
  },
  cancelBtnText: { color: COLORS.textSecondary, fontWeight: '600' },
  saveBtn: {
    flex: 1, backgroundColor: COLORS.secondary,
    borderRadius: 10, padding: 12, alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.7 },
  saveBtnText: { color: '#fff', fontWeight: '700' },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 4 },
  fieldValue: { fontSize: 15, color: COLORS.text },
  fieldEmpty: { color: COLORS.textSecondary, fontStyle: 'italic' },
  input: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 10,
    padding: 12, fontSize: 15, color: COLORS.text, backgroundColor: COLORS.surface,
  },
});
