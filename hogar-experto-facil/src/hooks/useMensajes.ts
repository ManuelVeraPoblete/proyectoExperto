import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { mensajeService, ApiMessage, ApiConversation } from '@/services/api/mensajeService';

export interface NormalizedMessage {
  id: number;
  sender: 'me' | 'other';
  senderName: string;
  text: string;
  timestamp: string;
  is_read: boolean;
}

const normalizeMessages = (messages: ApiMessage[], myUserId: string): NormalizedMessage[] =>
  messages.map(m => {
    const isMe = m.senderId === myUserId;
    const senderName = m.Sender
      ? `${m.Sender.nombres} ${m.Sender.apellidos}`
      : isMe ? 'Yo' : 'Contacto';
    return {
      id: m.id,
      sender: isMe ? 'me' : 'other',
      senderName,
      text: m.content,
      timestamp: m.createdAt,
      is_read: m.is_read,
    };
  });

export const useMensajes = (otherUserId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Conversations list (refreshes every 15s)
  const { data: conversations = [], isLoading: isLoadingConversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => mensajeService.getConversations(),
    enabled: !!user?.id,
    refetchInterval: 15_000,
  });

  // Messages with specific contact (refreshes every 5s)
  const { data: rawMessages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messages', otherUserId],
    queryFn: () => mensajeService.getMessages(otherUserId!),
    enabled: !!user?.id && !!otherUserId,
    refetchInterval: 5_000,
  });

  const messages: NormalizedMessage[] = user
    ? normalizeMessages(rawMessages, user.id)
    : [];

  const sendMutation = useMutation({
    mutationFn: ({ receiverId, content }: { receiverId: string; content: string }) =>
      mensajeService.send(receiverId, content),
    onMutate: async ({ receiverId, content }) => {
      // Cancelar queries en vuelo para evitar sobreescritura
      await queryClient.cancelQueries({ queryKey: ['messages', receiverId] });

      // Agregar mensaje optimista al cache inmediatamente
      const tempMessage: ApiMessage = {
        id: -Date.now(), // ID temporal negativo
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
      // Reemplazar mensaje optimista con el real del servidor
      queryClient.setQueryData<ApiMessage[]>(['messages', variables.receiverId], (old = []) =>
        old.map(m => (m.id < 0 ? newMsg : m))
      );
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error: Error, _, context) => {
      // Revertir el mensaje optimista si hubo error
      if (context?.receiverId) {
        queryClient.setQueryData<ApiMessage[]>(['messages', context.receiverId], (old = []) =>
          old.filter(m => m.id >= 0)
        );
      }
      toast({
        variant: 'destructive',
        title: 'Error al enviar mensaje',
        description: error.message || 'No se pudo enviar el mensaje. Intenta nuevamente.',
      });
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
