import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { mensajeService, ApiMessage, ApiConversation } from '@/services/api/mensajeService';

export interface NormalizedMessage {
  id: number;
  sender: 'me' | 'other';
  text: string;
  timestamp: string;
  is_read: boolean;
}

const normalizeMessages = (messages: ApiMessage[], myUserId: string): NormalizedMessage[] =>
  messages.map(m => ({
    id: m.id,
    sender: m.senderId === myUserId ? 'me' : 'other',
    text: m.content,
    timestamp: m.createdAt,
    is_read: m.is_read,
  }));

export const useMensajes = (otherUserId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Conversations list (refreshes every 30s)
  const { data: conversations = [], isLoading: isLoadingConversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => mensajeService.getConversations(),
    enabled: !!user?.id,
    refetchInterval: 30_000,
  });

  // Messages with specific contact (refreshes every 10s)
  const { data: rawMessages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messages', otherUserId],
    queryFn: () => mensajeService.getMessages(otherUserId!),
    enabled: !!user?.id && !!otherUserId,
    refetchInterval: 10_000,
  });

  const messages: NormalizedMessage[] = user
    ? normalizeMessages(rawMessages, user.id)
    : [];

  const sendMutation = useMutation({
    mutationFn: ({ receiverId, content }: { receiverId: string; content: string }) =>
      mensajeService.send(receiverId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.receiverId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: (contactId: string) => mensajeService.markAsRead(contactId),
    onSuccess: (_, contactId) => {
      queryClient.invalidateQueries({ queryKey: ['messages', contactId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  const sendMessage = (receiverId: string, content: string) => {
    sendMutation.mutate({ receiverId, content });
  };

  const markAsRead = (contactId: string) => {
    markAsReadMutation.mutate(contactId);
  };

  return {
    conversations,
    isLoadingConversations,
    messages,
    isLoadingMessages,
    sendMessage,
    markAsRead,
    isSending: sendMutation.isPending,
  };
};
