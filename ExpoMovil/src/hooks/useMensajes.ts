import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { mensajeService, ApiMessage, ApiConversation } from '@/services/api/mensajeService';
import { toAbsoluteUrl } from '@/lib/api-config';

export interface NormalizedMessage {
  id: number;
  sender: 'me' | 'other';
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  is_read: boolean;
}

export { ApiConversation };

const normalizeMessages = (
  messages: ApiMessage[],
  myUserId: string,
  myAvatar?: string,
): NormalizedMessage[] =>
  messages.map(m => {
    const isMe = m.senderId === myUserId;
    const senderUser = isMe ? null : m.Sender;
    const senderName = senderUser
      ? `${senderUser.nombres} ${senderUser.apellidos}`
      : isMe ? 'Yo' : 'Contacto';
    const senderAvatar = isMe ? myAvatar : toAbsoluteUrl(m.Sender?.avatar_url);
    return {
      id: m.id,
      sender: isMe ? 'me' : 'other',
      senderName,
      senderAvatar,
      text: m.content,
      timestamp: m.createdAt,
      is_read: m.is_read,
    };
  });

export const useMensajes = (otherUserId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: conversations = [], isLoading: isLoadingConversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => mensajeService.getConversations(),
    enabled: !!user?.id,
    refetchInterval: 15_000,
  });

  const { data: rawMessages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messages', otherUserId],
    queryFn: () => mensajeService.getMessages(otherUserId!),
    enabled: !!user?.id && !!otherUserId,
    refetchInterval: 5_000,
  });

  const messages: NormalizedMessage[] = user
    ? normalizeMessages(rawMessages, user.id, user.avatar)
    : [];

  const sendMutation = useMutation({
    mutationFn: ({ receiverId, content }: { receiverId: string; content: string }) =>
      mensajeService.send(receiverId, content),
    onMutate: async ({ receiverId, content }) => {
      await queryClient.cancelQueries({ queryKey: ['messages', receiverId] });

      const tempMessage: ApiMessage = {
        id: -Date.now(),
        senderId: user!.id,
        receiverId,
        content,
        is_read: false,
        createdAt: new Date().toISOString(),
        Sender: { id: user!.id, nombres: user!.nombres, apellidos: user!.apellidos },
      };

      queryClient.setQueryData<ApiMessage[]>(['messages', receiverId], (old = []) => [
        ...old,
        tempMessage,
      ]);

      return { receiverId };
    },
    onSuccess: (newMsg, variables) => {
      queryClient.setQueryData<ApiMessage[]>(['messages', variables.receiverId], (old = []) =>
        old.map(m => (m.id < 0 ? newMsg : m))
      );
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (_error: Error, _, context) => {
      if (context?.receiverId) {
        queryClient.setQueryData<ApiMessage[]>(['messages', context.receiverId], (old = []) =>
          old.filter(m => m.id >= 0)
        );
      }
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: (contactId: string) => mensajeService.markAsRead(contactId),
    onSuccess: (_, contactId) => {
      queryClient.invalidateQueries({ queryKey: ['messages', contactId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  return {
    conversations,
    isLoadingConversations,
    messages,
    isLoadingMessages,
    sendMessage: (receiverId: string, content: string) =>
      sendMutation.mutate({ receiverId, content }),
    markAsRead: (contactId: string) => markAsReadMutation.mutate(contactId),
    isSending: sendMutation.isPending,
  };
};
