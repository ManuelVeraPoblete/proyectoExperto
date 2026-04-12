import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { ChatDialog } from '@/components/ChatDialog';
import ReportButton from '@/components/common/ReportButton';
import { Message } from '@/types';
import { clients } from '@/lib/mock-data';

interface ClientMessageInfo {
  id: string;
  nombres: string;
  apellidos: string;
  unreadCount: number;
  lastMessageSnippet: string;
}

const MisMensajesExperto = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatParticipantName, setChatParticipantName] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Simulación de mensajes no leídos y leídos
  const [allClientsMessages, setAllClientsMessages] = useState<{[key: string]: Message[]}>({});

  useEffect(() => {
    const mockMessages = {
      'client1': [
        { id: 'c1_1', sender: "other" as const, text: 'Hola, ¿estás disponible para un trabajo de electricidad?', timestamp: new Date(Date.now() - 3600000).toISOString(), read: false },
        { id: 'c1_2', sender: "me" as const, text: 'Sí, ¿cuál es el problema?', timestamp: new Date(Date.now() - 1800000).toISOString(), read: true },
        { id: 'c1_3', sender: "other" as const, text: 'Necesito instalar unas luces en mi jardín.', timestamp: new Date(Date.now() - 60000).toISOString(), read: false },
      ],
      'client2': [
        { id: 'c2_1', sender: "other" as const, text: 'Gracias por el trabajo de plomería.', timestamp: new Date(Date.now() - 86400000).toISOString(), read: true },
        { id: 'c2_2', sender: "me" as const, text: 'De nada, cualquier cosa me avisas.', timestamp: new Date(Date.now() - 86300000).toISOString(), read: true },
      ],
      'client3': [
        { id: 'c3_1', sender: "other" as const, text: '¿Podrías darme un presupuesto para pintar mi casa?', timestamp: new Date(Date.now() - 120000).toISOString(), read: false },
      ],
      'client4': [
        { id: 'c4_1', sender: "me" as const, text: 'Ok, te envío el presupuesto.', timestamp: new Date(Date.now() - 259200000).toISOString(), read: true },
      ],
    };
    setAllClientsMessages(mockMessages);
  }, []);

  const getClientMessageInfo = (): ClientMessageInfo[] => {
    return clients.map(client => {
      const messages = allClientsMessages[client.id] || [];
      const unreadMessages = messages.filter(msg => !msg.read && msg.sender === 'other');
      const lastMessage = messages[messages.length - 1];

      return {
        id: client.id,
        nombres: client.nombres,
        apellidos: client.apellidos,
        unreadCount: unreadMessages.length,
        lastMessageSnippet: lastMessage ? lastMessage.text : 'No hay mensajes',
      };
    });
  };

  const handleOpenChat = (clientId: string, clientName: string) => {
    const messages = allClientsMessages[clientId] || [];
    setChatMessages(messages.map(msg => ({ ...msg, read: true })));
    setChatParticipantName(clientName);
    setSelectedClientId(clientId);
    setIsChatOpen(true);

    setAllClientsMessages(prev => ({
      ...prev,
      [clientId]: messages.map(msg => ({ ...msg, read: true }))
    }));
  };

  const handleSendMessage = (message: string) => {
    console.log(`Enviando mensaje a ${chatParticipantName}: ${message}`);
    if (selectedClientId) {
      setAllClientsMessages(prev => {
        const newMessages = [
          ...(prev[selectedClientId] || []),
          {
            id: Date.now().toString(),
            sender: "me" as const,
            text: message,
            timestamp: new Date().toISOString(),
            read: true,
          },
        ];
        return { ...prev, [selectedClientId]: newMessages };
      });
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "me" as const,
          text: message,
          timestamp: new Date().toISOString(),
          read: true,
        },
      ]);
    }
  };

  const clientsInfo = getClientMessageInfo();
  const clientsWithUnread = clientsInfo.filter(c => c.unreadCount > 0);
  const clientsWithRead = clientsInfo.filter(c => c.unreadCount === 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">Mis Mensajes</h1>

      {clientsWithUnread.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center"><MessageSquare className="mr-2" /> Mensajes No Leídos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clientsWithUnread.map(client => (
                <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg shadow-sm">
                  <div className="flex-1">
                    <p className="font-semibold">{client.nombres} {client.apellidos}</p>
                    <p className="text-sm text-muted-foreground">{client.lastMessageSnippet}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ReportButton
                      reportType="user"
                      reportedUserId={client.id}
                      reportedUserName={`${client.nombres} ${client.apellidos}`}
                      variant="ghost"
                      size="sm"
                    />
                    <Button onClick={() => handleOpenChat(client.id, `${client.nombres} ${client.apellidos}`)}>
                      Ver ({client.unreadCount})
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
            {clientsWithRead.length > 0 ? (
              clientsWithRead.map(client => (
                <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg shadow-sm">
                  <div className="flex-1">
                    <p className="font-semibold">{client.nombres} {client.apellidos}</p>
                    <p className="text-sm text-muted-foreground">{client.lastMessageSnippet}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ReportButton
                      reportType="user"
                      reportedUserId={client.id}
                      reportedUserName={`${client.nombres} ${client.apellidos}`}
                      variant="ghost"
                      size="sm"
                    />
                    <Button variant="outline" onClick={() => handleOpenChat(client.id, `${client.nombres} ${client.apellidos}`)}>
                      Abrir Chat
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No hay conversaciones antiguas.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <ChatDialog
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        participantName={chatParticipantName}
        participantId={selectedClientId || undefined}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default MisMensajesExperto;
