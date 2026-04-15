import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMensajes, NormalizedMessage } from '@/hooks/useMensajes';
import UserAvatar from '@/components/common/UserAvatar';
import { COLORS } from '@/constants';
import { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

export default function ChatScreen({ route, navigation }: Props) {
  const { contactId, contactName, contactAvatar } = route.params;
  const { messages, isLoadingMessages, sendMessage, markAsRead, isSending } = useMensajes(contactId);
  const [text, setText] = useState('');
  const listRef = useRef<FlatList>(null);

  // Configurar título del header
  useEffect(() => {
    navigation.setOptions({
      title: contactName,
      headerRight: () => (
        <UserAvatar uri={contactAvatar} name={contactName} size={32} />
      ),
    });
  }, [navigation, contactName, contactAvatar]);

  // Marcar como leídos y hacer scroll al abrir
  useEffect(() => {
    markAsRead(contactId);
  }, [contactId]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    sendMessage(contactId, trimmed);
    setText('');
  };

  const renderMessage = ({ item, index }: { item: NormalizedMessage; index: number }) => {
    const isMe = item.sender === 'me';
    const prevItem = index > 0 ? messages[index - 1] : null;
    const showAvatar = !isMe && prevItem?.sender !== 'other';

    return (
      <View style={[styles.messageRow, isMe ? styles.messageRowMe : styles.messageRowOther]}>
        {!isMe && (
          <View style={styles.avatarSlot}>
            {showAvatar ? (
              <UserAvatar uri={item.senderAvatar} name={item.senderName} size={28} />
            ) : (
              <View style={{ width: 28 }} />
            )}
          </View>
        )}
        <View
          style={[
            styles.bubble,
            isMe ? styles.bubbleMe : styles.bubbleOther,
          ]}
        >
          <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>{item.text}</Text>
          <Text style={[styles.bubbleTime, isMe && styles.bubbleTimeMe]}>
            {new Date(item.timestamp).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
            {isMe && (
              <Text> {item.is_read ? '✓✓' : '✓'}</Text>
            )}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoadingMessages) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={COLORS.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={item => String(item.id)}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Sé el primero en enviar un mensaje.</Text>
        }
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Escribe un mensaje..."
          placeholderTextColor={COLORS.textSecondary}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!text.trim() || isSending) && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!text.trim() || isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <MaterialCommunityIcons name="send" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  messagesList: { padding: 12, paddingBottom: 8 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 4 },
  messageRowMe: { justifyContent: 'flex-end' },
  messageRowOther: { justifyContent: 'flex-start' },
  avatarSlot: { marginRight: 6 },
  bubble: {
    maxWidth: '75%', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8,
  },
  bubbleMe: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  bubbleOther: { backgroundColor: COLORS.surface, borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 15, color: COLORS.text },
  bubbleTextMe: { color: '#fff' },
  bubbleTime: { fontSize: 10, color: COLORS.textSecondary, marginTop: 3, textAlign: 'right' },
  bubbleTimeMe: { color: 'rgba(255,255,255,0.7)' },
  emptyText: { textAlign: 'center', color: COLORS.textSecondary, marginTop: 40, fontSize: 14 },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    padding: 10, backgroundColor: COLORS.surface,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  input: {
    flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 10, fontSize: 15,
    color: COLORS.text, backgroundColor: COLORS.background,
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: COLORS.primary, borderRadius: 20,
    width: 42, height: 42, justifyContent: 'center', alignItems: 'center',
  },
  sendBtnDisabled: { opacity: 0.5 },
});
