import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ReportButton from '@/components/common/ReportButton';
import { NormalizedMessage } from '@/hooks/useMensajes';

interface ConversacionChatProps {
  contactName: string;
  contactId: string;
  messages: NormalizedMessage[];
  isSending: boolean;
  onSend: (text: string) => void;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Hoy';
  if (d.toDateString() === yesterday.toDateString()) return 'Ayer';
  return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });
};

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

const initials = (name: string) =>
  name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

/** Agrupa mensajes consecutivos del mismo emisor */
const groupMessages = (messages: NormalizedMessage[]) => {
  const groups: { date: string; items: NormalizedMessage[] }[] = [];
  messages.forEach((msg) => {
    const label = formatDate(msg.timestamp);
    const last = groups[groups.length - 1];
    if (last && last.date === label) {
      last.items.push(msg);
    } else {
      groups.push({ date: label, items: [msg] });
    }
  });
  return groups;
};

const ConversacionChat: React.FC<ConversacionChatProps> = ({
  contactName,
  contactId,
  messages,
  isSending,
  onSend,
}) => {
  const [text, setText] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll al fondo dentro del contenedor — nunca mueve la página completa
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  const groups = groupMessages(messages);

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">

      {/* ── Cabecera ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-card shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm">
            {initials(contactName)}
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground leading-none">{contactName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">En línea</p>
          </div>
        </div>
        <ReportButton
          reportType="user"
          reportedUserId={contactId}
          reportedUserName={contactName}
          variant="ghost"
          size="sm"
        />
      </div>

      {/* ── Mensajes ─────────────────────────────────────────────── */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-3 bg-muted/20 min-h-0"
      >
        {messages.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
            No hay mensajes aún. ¡Envía el primero!
          </div>
        ) : (
          <div className="flex flex-col gap-0.5 pb-2">
            {groups.map(({ date, items }) => (
              <div key={date}>
                {/* Separador de fecha */}
                <div className="flex items-center gap-2 my-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground bg-muted/40 px-3 py-0.5 rounded-full">
                    {date}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {items.map((msg, idx) => {
                  const isMe = msg.sender === 'me';
                  const prevMsg = items[idx - 1];
                  const showName = !prevMsg || prevMsg.sender !== msg.sender;

                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 mb-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar — solo en el primero del grupo */}
                      <div className="w-7 h-7 shrink-0">
                        {showName && (
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold
                              ${isMe ? 'bg-green-500 text-white' : 'bg-primary/20 text-primary'}`}
                          >
                            {initials(msg.senderName)}
                          </div>
                        )}
                      </div>

                      <div className={`flex flex-col max-w-[68%] ${isMe ? 'items-end' : 'items-start'}`}>
                        {/* Nombre — solo al inicio del grupo */}
                        {showName && (
                          <span className={`text-[11px] font-semibold mb-1 px-1
                            ${isMe ? 'text-green-600' : 'text-primary'}`}>
                            {isMe ? 'Yo' : msg.senderName}
                          </span>
                        )}

                        {/* Burbuja */}
                        <div className="relative group">
                          <div
                            className={`px-3 py-2 rounded-2xl shadow-sm text-sm break-words leading-relaxed
                              ${isMe
                                ? 'bg-green-500 text-white rounded-br-sm'
                                : 'bg-card text-foreground rounded-bl-sm border border-border'
                              }`}
                          >
                            {msg.text}
                          </div>

                          {/* Hora + ticks */}
                          <div className={`flex items-center gap-1 mt-0.5 px-1
                            ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-[10px] text-muted-foreground">
                              {formatTime(msg.timestamp)}
                            </span>
                            {isMe && (
                              <span className={`text-[10px] ${msg.is_read ? 'text-blue-500' : 'text-muted-foreground'}`}>
                                {msg.is_read ? '✓✓' : '✓'}
                              </span>
                            )}
                          </div>

                          {/* Botón reportar mensaje ajeno */}
                          {!isMe && (
                            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <ReportButton
                                reportType="language"
                                reportedUserId={contactId}
                                reportedUserName={contactName}
                                reportedContent={msg.text}
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 bg-red-50 hover:bg-red-100"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Input ────────────────────────────────────────────────── */}
      <div className="px-4 py-3 border-t bg-card shrink-0">
        <div className="flex items-end gap-2">
          <Textarea
            placeholder="Escribe un mensaje... (Enter para enviar)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1 resize-none min-h-[40px] max-h-32 rounded-xl text-sm"
            rows={1}
            disabled={isSending}
          />
          <Button
            onClick={handleSend}
            disabled={!text.trim() || isSending}
            size="icon"
            className="rounded-full bg-green-500 hover:bg-green-600 text-white shrink-0 h-10 w-10"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1 pl-1">
          Shift+Enter para nueva línea
        </p>
      </div>

    </div>
  );
};

export default ConversacionChat;
