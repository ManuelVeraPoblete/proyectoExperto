import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { ChatDialog } from '@/components/ChatDialog';
import ReportButton from '@/components/common/ReportButton';
import { useMensajes } from '@/hooks/useMensajes';
import { Message } from '@/types';

const MisMensajesExperto = () => {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatParticipantName, setChatParticipantName] = useState('');

  const { conversations, isLoadingConversations, messages, sendMessage, markAsRead } =
    useMensajes(selectedContactId ?? undefined);

  const handleOpenChat = (contactId: string, contactName: string) => {
    setSelectedContactId(contactId);
    setChatParticipantName(contactName);
    setIsChatOpen(true);
    markAsRead(contactId);
  };

  const handleSendMessage = (text: string) => {
    if (!selectedContactId) return;
    sendMessage(selectedContactId, text);
  };

  const chatMessages: Message[] = messages.map(m => ({
    id: String(m.id),
    sender: m.sender,
    text: m.text,
    timestamp: m.timestamp,
    read: m.is_read,
  }));

  const unread = conversations.filter(c => c.unreadCount > 0);
  const read = conversations.filter(c => c.unreadCount === 0);

  if (isLoadingConversations) {
    return <div className="container mx-auto px-4 py-8 text-muted-foreground">Cargando mensajes...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">Mis Mensajes</h1>

      {unread.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center"><MessageSquare className="mr-2" /> Mensajes No Leídos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {unread.map(conv => (
                <div key={conv.contact.id} className="flex items-center justify-between p-3 border rounded-lg shadow-sm">
                  <div className="flex-1">
                    <p className="font-semibold">{conv.contact.nombres} {conv.contact.apellidos}</p>
                    <p className="text-sm text-muted-foreground">{conv.lastMessage?.content ?? 'No hay mensajes'}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ReportButton reportType="user" reportedUserId={conv.contact.id} reportedUserName={`${conv.contact.nombres} ${conv.contact.apellidos}`} variant="ghost" size="sm" />
                    <Button onClick={() => handleOpenChat(conv.contact.id, `${conv.contact.nombres} ${conv.contact.apellidos}`)}>
                      Ver ({conv.unreadCount})
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><MessageSquare className="mr-2" /> Todas las Conversaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {read.length > 0 ? (
              read.map(conv => (
                <div key={conv.contact.id} className="flex items-center justify-between p-3 border rounded-lg shadow-sm">
                  <div className="flex-1">
                    <p className="font-semibold">{conv.contact.nombres} {conv.contact.apellidos}</p>
                    <p className="text-sm text-muted-foreground">{conv.lastMessage?.content ?? 'No hay mensajes'}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ReportButton reportType="user" reportedUserId={conv.contact.id} reportedUserName={`${conv.contact.nombres} ${conv.contact.apellidos}`} variant="ghost" size="sm" />
                    <Button variant="outline" onClick={() => handleOpenChat(conv.contact.id, `${conv.contact.nombres} ${conv.contact.apellidos}`)}>
                      Abrir Chat
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No hay conversaciones.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <ChatDialog
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        participantName={chatParticipantName}
        participantId={selectedContactId ?? undefined}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default MisMensajesExperto;
