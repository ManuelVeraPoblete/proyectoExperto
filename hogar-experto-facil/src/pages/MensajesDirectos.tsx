
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { ChatDialog } from '@/components/ChatDialog';
import ReportButton from '@/components/common/ReportButton';
import { Message } from '@/types';
import { expertos } from '@/lib/mock-data';

interface ExpertoMessageInfo {
  id: string;
  nombres: string;
  apellidos: string;
  unreadCount: number;
  lastMessageSnippet: string;
}

const MensajesDirectos = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatParticipantName, setChatParticipantName] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [selectedExpertoId, setSelectedExpertoId] = useState<string | null>(null);

  // Simulación de mensajes no leídos y leídos
  const [allExpertosMessages, setAllExpertosMessages] = useState<{[key: string]: Message[]}>({});

  useEffect(() => {
    const mockMessages = {
      'experto1': [
        { id: 'm1_1', sender: "other" as const, text: 'Hola, ¿cómo estás? Tengo una pregunta sobre el trabajo.', timestamp: new Date(Date.now() - 3600000).toISOString(), read: false },
        { id: 'm1_2', sender: "me" as const, text: 'Estoy bien, dime.', timestamp: new Date(Date.now() - 1800000).toISOString(), read: true },
        { id: 'm1_3', sender: "other" as const, text: 'Necesito un presupuesto para la instalación de un termo.', timestamp: new Date(Date.now() - 60000).toISOString(), read: false },
      ],
      'experto2': [
        { id: 'm2_1', sender: "other" as const, text: 'Confirmado para el martes.', timestamp: new Date(Date.now() - 86400000).toISOString(), read: true },
        { id: 'm2_2', sender: "me" as const, text: 'Perfecto, nos vemos.', timestamp: new Date(Date.now() - 86300000).toISOString(), read: true },
      ],
      'experto3': [
        { id: 'm3_1', sender: "other" as const, text: '¿Podrías enviarme las fotos del trabajo terminado?', timestamp: new Date(Date.now() - 120000).toISOString(), read: false },
      ],
      'experto4': [
        { id: 'm4_1', sender: "me" as const, text: 'Gracias por tu ayuda.', timestamp: new Date(Date.now() - 259200000).toISOString(), read: true },
      ],
    };
    setAllExpertosMessages(mockMessages);
  }, []);

  const getExpertoMessageInfo = (): ExpertoMessageInfo[] => {
    return expertos.map(experto => {
      const messages = allExpertosMessages[experto.id] || [];
      const unreadMessages = messages.filter(msg => !msg.read && msg.sender === 'other');
      const lastMessage = messages[messages.length - 1];

      return {
        id: experto.id,
        nombres: experto.nombres,
        apellidos: experto.apellidos,
        unreadCount: unreadMessages.length,
        lastMessageSnippet: lastMessage ? lastMessage.text : 'No hay mensajes',
      };
    });
  };

  const handleOpenChat = (expertoId: string, expertoName: string) => {
    const messages = allExpertosMessages[expertoId] || [];
    setChatMessages(messages.map(msg => ({ ...msg, read: true })));
    setChatParticipantName(expertoName);
    setSelectedExpertoId(expertoId);
    setIsChatOpen(true);

    setAllExpertosMessages(prev => ({
      ...prev,
      [expertoId]: messages.map(msg => ({ ...msg, read: true }))
    }));
  };

  const handleSendMessage = (message: string) => {
    console.log(`Enviando mensaje a ${chatParticipantName}: ${message}`);
    if (selectedExpertoId) {
      setAllExpertosMessages(prev => {
        const newMessages = [
          ...(prev[selectedExpertoId] || []),
          {
            id: Date.now().toString(),
            sender: "me" as const,
            text: message,
            timestamp: new Date().toISOString(),
            read: true,
          },
        ];
        return { ...prev, [selectedExpertoId]: newMessages };
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

  const expertosInfo = getExpertoMessageInfo();
  const expertosWithUnread = expertosInfo.filter(m => m.unreadCount > 0);
  const expertosWithRead = expertosInfo.filter(m => m.unreadCount === 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">Mensajes Directos</h1>

      {expertosWithUnread.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center"><MessageSquare className="mr-2" /> Mensajes No Leídos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expertosWithUnread.map(experto => (
                <div key={experto.id} className="flex items-center justify-between p-3 border rounded-lg shadow-sm">
                  <div className="flex-1">
                    <p className="font-semibold">{experto.nombres} {experto.apellidos}</p>
                    <p className="text-sm text-muted-foreground">{experto.lastMessageSnippet}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ReportButton
                      reportType="user"
                      reportedUserId={experto.id}
                      reportedUserName={`${experto.nombres} ${experto.apellidos}`}
                      variant="ghost"
                      size="sm"
                    />
                    <Button onClick={() => handleOpenChat(experto.id, `${experto.nombres} ${experto.apellidos}`)}>
                      Ver ({experto.unreadCount})
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
            {expertosWithRead.length > 0 ? (
              expertosWithRead.map(experto => (
                <div key={experto.id} className="flex items-center justify-between p-3 border rounded-lg shadow-sm">
                  <div className="flex-1">
                    <p className="font-semibold">{experto.nombres} {experto.apellidos}</p>
                    <p className="text-sm text-muted-foreground">{experto.lastMessageSnippet}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ReportButton
                      reportType="user"
                      reportedUserId={experto.id}
                      reportedUserName={`${experto.nombres} ${experto.apellidos}`}
                      variant="ghost"
                      size="sm"
                    />
                    <Button variant="outline" onClick={() => handleOpenChat(experto.id, `${experto.nombres} ${experto.apellidos}`)}>
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
        participantId={selectedExpertoId || undefined}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default MensajesDirectos;
