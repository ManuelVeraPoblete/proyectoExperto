import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ExpertoCardData } from '@/types/experto';
import { COLORS } from '@/constants';
import UserAvatar from '@/components/common/UserAvatar';

interface ExpertoCardProps {
  experto: ExpertoCardData;
  onPress: () => void;
}

export default function ExpertoCard({ experto, onPress }: ExpertoCardProps) {
  const fullName = `${experto.nombres} ${experto.apellidos}`;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <UserAvatar uri={experto.avatar} name={fullName} size={56} />
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{fullName}</Text>
            {experto.isVerified && (
              <MaterialCommunityIcons name="check-decagram" size={16} color={COLORS.primary} />
            )}
          </View>
          <View style={styles.ratingRow}>
            <MaterialCommunityIcons name="star" size={14} color="#FBBF24" />
            <Text style={styles.rating}>
              {experto.calificacion.toFixed(1)} ({experto.reviewCount} reseñas)
            </Text>
          </View>
          <Text style={styles.location}>
            <MaterialCommunityIcons name="map-marker" size={13} color={COLORS.textSecondary} />
            {' '}{experto.comuna}, {experto.region}
          </Text>
        </View>
      </View>

      {experto.especialidades.length > 0 && (
        <View style={styles.chips}>
          {experto.especialidades.slice(0, 3).map((esp, i) => (
            <View key={i} style={styles.chip}>
              <Text style={styles.chipText}>{esp}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.experience}>{experto.experience}</Text>
        {experto.hourlyRate && (
          <Text style={styles.rate}>
            ${experto.hourlyRate.toLocaleString('es-CL')}/hr
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  rating: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  location: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  chip: {
    backgroundColor: '#FFF7ED',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chipText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  experience: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  rate: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondary,
  },
});
