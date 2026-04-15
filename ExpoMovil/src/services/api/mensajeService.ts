import { apiClient } from '@/lib/apiClient';

export interface ApiMessageUser {
  id: string;
  nombres: string;
  apellidos: string;
  avatar_url?: string;
}

export interface ApiMessage {
  id: number;
  senderId: string;
  receiverId: string;
  content: string;
  is_read: boolean;
  createdAt: string;
  Sender?: ApiMessageUser;
  Receiver?: ApiMessageUser;
}

export interface ApiContact {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  avatar_url?: string;
  telefono?: string;
}

export interface ApiConversation {
  contact: ApiContact;
  lastMessage: ApiMessage | null;
  unreadCount: number;
}

export const mensajeService = {
  getConversations: (): Promise<ApiConversation[]> =>
    apiClient.get<ApiConversation[]>('/messages/conversations'),

  getMessages: (otherUserId: string): Promise<ApiMessage[]> =>
    apiClient.get<ApiMessage[]>(`/messages/${otherUserId}`),

  send: (receiverId: string, content: string): Promise<ApiMessage> =>
    apiClient.post<ApiMessage>('/messages', { receiverId, content }),

  markAsRead: (otherUserId: string): Promise<{ message: string }> =>
    apiClient.patch<{ message: string }>(`/messages/${otherUserId}/read`, {}),
};
