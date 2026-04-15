import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getStatusColor, getStatusText, getStatusBg } from '@/utils/statusHelpers';

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: getStatusBg(status) }]}>
      <Text style={[styles.label, { color: getStatusColor(status) }]}>
        {getStatusText(status)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
