import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList, StyleSheet,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { expertoService } from '@/services/api/expertoService';
import { mapApiExpertoToCardData } from '@/lib/expertoMapper';
import ExpertoCard from '@/components/experto/ExpertoCard';
import { COLORS } from '@/constants';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function BuscarExpertosScreen() {
  const navigation = useNavigation<NavProp>();
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

  const { data: rawExpertos = [], isLoading } = useQuery({
    queryKey: ['expertos', query],
    queryFn: () => expertoService.search({ work: query || undefined }),
  });

  const expertos = rawExpertos.map(mapApiExpertoToCardData);

  const handleSearch = useCallback(() => setQuery(search), [search]);

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={styles.title}>Buscar Expertos</Text>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            placeholder="Plomero, electricista, pintor..."
            placeholderTextColor={COLORS.textSecondary}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <MaterialCommunityIcons name="magnify" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color={COLORS.primary} />
      ) : (
        <FlatList
          data={expertos}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ExpertoCard
              experto={item}
              onPress={() => navigation.navigate('PerfilPublicoExperto', { expertId: item.id })}
            />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {query ? 'No se encontraron expertos.' : 'Ingresa una búsqueda para encontrar expertos.'}
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerArea: { padding: 20, paddingTop: 56, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 14 },
  searchRow: { flexDirection: 'row', gap: 8 },
  searchInput: {
    flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10,
    padding: 12, fontSize: 15, color: COLORS.text, backgroundColor: COLORS.background,
  },
  searchBtn: { backgroundColor: COLORS.primary, borderRadius: 10, padding: 12, justifyContent: 'center' },
  list: { padding: 16 },
  loader: { flex: 1, marginTop: 40 },
  empty: { textAlign: 'center', color: COLORS.textSecondary, marginTop: 40, fontSize: 14 },
});
