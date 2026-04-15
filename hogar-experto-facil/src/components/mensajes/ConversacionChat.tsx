import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ReportButton from '@/components/common/ReportButton';
import { NormalizedMessage } from '@/hooks/useMensajes';

interface ConversacionChatProps {
  contactName: string;
  contactId: string;
  contactAvatar?: string;
  contactPhone?: string;
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

/** Convierte un teléfono chileno a formato E.164 para wa.me (solo dígitos) */
const toWhatsAppNumber = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('56')) return digits;
  if (digits.startsWith('9') && digits.length === 9) return `56${digits}`;
  if (digits.startsWith('0')) return `56${digits.slice(1)}`;
  return `56${digits}`;
};

const ConversacionChat: React.FC<ConversacionChatProps> = ({
  contactName,
  contactId,
  contactAvatar,
  contactPhone,
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
          <div className="w-9 h-9 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center shrink-0">
            {contactAvatar ? (
              <img src={contactAvatar} alt={contactName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-primary font-bold text-sm">{initials(contactName)}</span>
            )}
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground leading-none">{contactName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">En línea</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {contactPhone && (
            <a
              href={`https://wa.me/${toWhatsAppNumber(contactPhone)}?text=${encodeURIComponent(`Hola ${contactName}, te escribo desde HogarExperto`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#1ebe5d] text-white text-xs font-semibold transition-colors"
              title="Continuar en WhatsApp"
            >
              <WhatsAppIcon />
              WhatsApp
            </a>
          )}
          <ReportButton
            reportType="user"
            reportedUserId={contactId}
            reportedUserName={contactName}
            variant="ghost"
            size="sm"
          />
        </div>
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
                          <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
                            {msg.senderAvatar ? (
                              <img src={msg.senderAvatar} alt={msg.senderName} className="w-full h-full object-cover" />
                            ) : (
                              <div className={`w-full h-full rounded-full flex items-center justify-center text-[10px] font-bold
                                ${isMe ? 'bg-green-500 text-white' : 'bg-primary/20 text-primary'}`}>
                                {initials(msg.senderName)}
                              </div>
                            )}
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
