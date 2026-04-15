import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useMensajes } from '@/hooks/useMensajes';
import ListaConversaciones from '@/components/mensajes/ListaConversaciones';
import ConversacionChat from '@/components/mensajes/ConversacionChat';

const MensajesDirectos = () => {
  const [searchParams] = useSearchParams();
  const [selectedContactId, setSelectedContactId]   = useState<string | null>(
    searchParams.get('contactId')
  );
  const [selectedContactName, setSelectedContactName] = useState(
    searchParams.get('contactName') ? decodeURIComponent(searchParams.get('contactName')!) : ''
  );
  const [selectedContactAvatar, setSelectedContactAvatar] = useState<string | undefined>(undefined);

  const { conversations, isLoadingConversations, messages, isLoadingMessages, sendMessage, markAsRead, isSending } =
    useMensajes(selectedContactId ?? undefined);

  // Derivar teléfono y avatar desde la lista de conversaciones (siempre actualizado)
  const selectedConv = conversations.find(c => c.contact.id === selectedContactId);
  const selectedContactPhone = selectedConv?.contact.telefono ?? undefined;

  // Mark as read when arriving from a direct link
  useEffect(() => {
    const contactId = searchParams.get('contactId');
    if (contactId) markAsRead(contactId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (contactId: string, contactName: string, contactAvatar?: string) => {
    setSelectedContactId(contactId);
    setSelectedContactName(contactName);
    setSelectedContactAvatar(contactAvatar);
    markAsRead(contactId);
  };

  const handleSend = (text: string) => {
    if (!selectedContactId) return;
    sendMessage(selectedContactId, text);
  };

  if (isLoadingConversations) {
    return (
      <div className="container mx-auto px-4 py-8 text-muted-foreground">
        Cargando mensajes...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 px-4 py-4 max-w-5xl mx-auto w-full">
      {/* Título */}
      <div className="flex items-center gap-2 mb-3 shrink-0">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h1 className="text-xl font-bold text-foreground">Mensajes</h1>
      </div>

      {/* Layout split — ocupa todo el espacio restante */}
      <div className="flex-1 min-h-0 border border-border rounded-xl overflow-hidden bg-card shadow-sm flex">

        {/* Panel izquierdo — conversaciones */}
        <div className="w-72 shrink-0 border-r border-border flex flex-col">
          <div className="px-4 py-3 border-b border-border bg-muted/30 shrink-0">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Conversaciones
            </p>
          </div>
          <div className="flex-1 overflow-hidden">
            <ListaConversaciones
              conversations={conversations}
              selectedId={selectedContactId}
              onSelect={handleSelect}
            />

          </div>
        </div>

        {/* Panel derecho — chat */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedContactId ? (
            isLoadingMessages ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                Cargando conversación...
              </div>
            ) : (
              <ConversacionChat
                contactName={selectedContactName}
                contactId={selectedContactId}
                contactAvatar={selectedContactAvatar}
                contactPhone={selectedContactPhone}
                messages={messages}
                isSending={isSending}
                onSend={handleSend}
              />
            )
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <MessageSquare className="w-12 h-12 opacity-20" />
              <p className="text-sm">Selecciona una conversación para comenzar</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MensajesDirectos;
