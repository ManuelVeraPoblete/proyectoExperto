import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { expertoService } from '@/services/api/expertoService';
import { mapApiExpertoToCardData } from '@/lib/expertoMapper';
import { useAuth } from '@/contexts/AuthContext';
import UserAvatar from '@/components/common/UserAvatar';
import { COLORS, ROLES } from '@/constants';
import { RootStackParamList } from '@/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'PerfilPublicoExperto'>;
type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function PerfilPublicoExpertoScreen({ route }: Props) {
  const { expertId } = route.params;
  const { user } = useAuth();
  const navigation = useNavigation<NavProp>();

  const { data: raw, isLoading } = useQuery({
    queryKey: ['experto-detail', expertId],
    queryFn: () => expertoService.getById(expertId),
    enabled: !!expertId,
  });

  const experto = raw ? mapApiExpertoToCardData(raw) : null;

  const handleMessage = () => {
    if (!user) {
      Alert.alert('Inicia sesión', 'Debes iniciar sesión para enviar mensajes.');
      return;
    }
    if (!experto) return;
    navigation.navigate('Chat', {
      contactId: expertId,
      contactName: `${experto.nombres} ${experto.apellidos}`,
      contactAvatar: experto.avatar,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!experto) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorText}>No se encontró el experto.</Text>
      </View>
    );
  }

  const fullName = `${experto.nombres} ${experto.apellidos}`;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header del perfil */}
      <View style={styles.profileHeader}>
        <UserAvatar uri={experto.avatar} name={fullName} size={88} />
        <View style={styles.profileHeaderInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{fullName}</Text>
            {experto.isVerified && (
              <MaterialCommunityIcons name="check-decagram" size={20} color={COLORS.primary} />
            )}
          </View>
          <View style={styles.ratingRow}>
            <MaterialCommunityIcons name="star" size={16} color="#FBBF24" />
            <Text style={styles.rating}>
              {experto.calificacion.toFixed(1)} · {experto.reviewCount} reseñas
            </Text>
          </View>
          <Text style={styles.location}>
            <MaterialCommunityIcons name="map-marker" size={14} color={COLORS.textSecondary} />
            {' '}{experto.comuna}, {experto.region}
          </Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <MaterialCommunityIcons name="clock-outline" size={18} color={COLORS.secondary} />
          <Text style={styles.infoLabel}>Experiencia</Text>
          <Text style={styles.infoValue}>{experto.experience}</Text>
        </View>
        {experto.hourlyRate && (
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="currency-usd" size={18} color={COLORS.secondary} />
            <Text style={styles.infoLabel}>Tarifa/hr</Text>
            <Text style={styles.infoValue}>${experto.hourlyRate.toLocaleString('es-CL')}</Text>
          </View>
        )}
        {experto.telefono && (
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="phone" size={18} color={COLORS.secondary} />
            <Text style={styles.infoLabel}>Teléfono</Text>
            <Text style={styles.infoValue}>{experto.telefono}</Text>
          </View>
        )}
      </View>

      {/* Especialidades */}
      {experto.especialidades.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Especialidades</Text>
          <View style={styles.chips}>
            {experto.especialidades.map((esp, i) => (
              <View key={i} style={styles.chip}>
                <Text style={styles.chipText}>{esp}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Reseñas */}
      {experto.reviews.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reseñas</Text>
          {experto.reviews.slice(0, 5).map((review, i) => (
            <View key={i} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewUser}>{review.user}</Text>
                <View style={styles.reviewRating}>
                  <MaterialCommunityIcons name="star" size={13} color="#FBBF24" />
                  <Text style={styles.reviewRatingText}>{review.rating}</Text>
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Botón contactar */}
      {user?.userType === ROLES.CLIENT && (
        <TouchableOpacity style={styles.contactBtn} onPress={handleMessage}>
          <MaterialCommunityIcons name="message" size={20} color="#fff" />
          <Text style={styles.contactBtnText}>Enviar Mensaje</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingBottom: 40 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: COLORS.textSecondary },
  profileHeader: { flexDirection: 'row', gap: 16, marginBottom: 24, alignItems: 'flex-start' },
  profileHeaderInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  name: { fontSize: 20, fontWeight: '800', color: COLORS.text, flexShrink: 1 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  rating: { fontSize: 14, color: COLORS.textSecondary },
  location: { fontSize: 13, color: COLORS.textSecondary },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  infoItem: {
    backgroundColor: COLORS.surface, borderRadius: 10, padding: 12,
    alignItems: 'center', minWidth: '30%', flex: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 3, elevation: 1,
  },
  infoLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 4 },
  infoValue: { fontSize: 13, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: '#FFF7ED', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  chipText: { fontSize: 13, color: COLORS.primary, fontWeight: '500' },
  reviewCard: {
    backgroundColor: COLORS.surface, borderRadius: 10, padding: 14, marginBottom: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 3, elevation: 1,
  },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  reviewUser: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  reviewRating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  reviewRatingText: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  reviewComment: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
  contactBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: COLORS.primary, borderRadius: 12, padding: 15, marginTop: 8,
  },
  contactBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
