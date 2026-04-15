import React from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMensajes, ApiConversation } from '@/hooks/useMensajes';
import UserAvatar from '@/components/common/UserAvatar';
import { COLORS } from '@/constants';
import { RootStackParamList } from '@/navigation/types';
import { toAbsoluteUrl } from '@/lib/api-config';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function MensajesScreen() {
  const navigation = useNavigation<NavProp>();
  const { conversations, isLoadingConversations } = useMensajes();

  const renderConversation = ({ item }: { item: ApiConversation }) => {
    const contactName = `${item.contact.nombres} ${item.contact.apellidos}`;
    const lastText = item.lastMessage?.content ?? 'Sin mensajes aún';
    const avatarUri = toAbsoluteUrl(item.contact.avatar_url);

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          navigation.navigate('Chat', {
            contactId: item.contact.id,
            contactName,
            contactAvatar: avatarUri,
          })
        }
      >
        <View style={styles.avatarWrapper}>
          <UserAvatar uri={avatarUri} name={contactName} size={48} />
          {item.unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
        <View style={styles.info}>
          <View style={styles.infoTop}>
            <Text style={styles.contactName}>{contactName}</Text>
            {item.lastMessage && (
              <Text style={styles.timestamp}>
                {new Date(item.lastMessage.createdAt).toLocaleTimeString('es-CL', {
                  hour: '2-digit', minute: '2-digit',
                })}
              </Text>
            )}
          </View>
          <Text
            style={[styles.lastMessage, item.unreadCount > 0 && styles.lastMessageUnread]}
            numberOfLines={1}
          >
            {lastText}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={styles.title}>Mensajes</Text>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={item => item.contact.id}
        renderItem={renderConversation}
        refreshControl={
          <RefreshControl refreshing={isLoadingConversations} onRefresh={() => {}} />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="message-outline" size={48} color={COLORS.border} />
            <Text style={styles.emptyText}>No tienes conversaciones aún.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerArea: { padding: 20, paddingTop: 56, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  item: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: COLORS.surface, gap: 12 },
  avatarWrapper: { position: 'relative' },
  badge: {
    position: 'absolute', top: -2, right: -2,
    backgroundColor: COLORS.primary, borderRadius: 10,
    minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  info: { flex: 1 },
  infoTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  contactName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  timestamp: { fontSize: 11, color: COLORS.textSecondary },
  lastMessage: { fontSize: 13, color: COLORS.textSecondary },
  lastMessageUnread: { fontWeight: '700', color: COLORS.text },
  separator: { height: 1, backgroundColor: COLORS.border, marginLeft: 76 },
  emptyContainer: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: COLORS.textSecondary },
});
