import { useEffect, useRef, useState, KeyboardEvent } from 'react';
import { Bot, Send, X, Trash2, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import useAiChat from '@/hooks/useAiChat';
import { UserRole } from '@/types';

interface ChatWidgetProps {
  userName: string;
  userRole: UserRole;
}

const GREETING: Record<UserRole, string> = {
  client:   '¡Hola! Puedo ayudarte a publicar trabajos, encontrar el experto ideal y gestionar tus solicitudes. ¿En qué te ayudo?',
  experto:  '¡Hola! Puedo ayudarte a encontrar trabajos, mejorar tu perfil y gestionar tus postulaciones. ¿En qué te ayudo?',
  admin:    '¡Hola! ¿En qué puedo ayudarte hoy?',
};

const ChatWidget = ({ userName, userRole }: ChatWidgetProps) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, isLoading, error, sendMessage, clearChat, cancelStream } = useAiChat(userName, userRole);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const greeting = GREETING[userRole] ?? GREETING.client;

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-transform hover:scale-105"
        aria-label="Abrir asistente IA"
      >
        <Bot className="h-6 w-6" />
      </button>

      {/* Panel de chat */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex w-[360px] flex-col rounded-2xl border bg-background shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <div>
                <p className="font-semibold text-sm leading-none">Asistente Hogar Experto</p>
                <p className="text-xs opacity-80 leading-none mt-0.5 capitalize">{userRole}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-primary-foreground hover:bg-white/20"
                onClick={clearChat}
                title="Limpiar conversación"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-primary-foreground hover:bg-white/20"
                onClick={() => setOpen(false)}
                title="Cerrar"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mensajes */}
          <ScrollArea className="h-80 px-4 py-3">
            {/* Saludo inicial */}
            {messages.length === 0 && (
              <div className="mr-auto max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-sm leading-relaxed">
                <span className="font-medium">Hola, {userName}. </span>
                {greeting}
              </div>
            )}
            <div className="flex flex-col gap-3 mt-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    'max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'ml-auto bg-primary text-primary-foreground rounded-br-sm'
                      : 'mr-auto bg-muted text-foreground rounded-bl-sm',
                  )}
                >
                  {msg.content || (
                    <span className="flex gap-1 items-center">
                      <span className="animate-bounce">·</span>
                      <span className="animate-bounce [animation-delay:150ms]">·</span>
                      <span className="animate-bounce [animation-delay:300ms]">·</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
            {error && (
              <p className="mt-2 text-center text-xs text-destructive">{error}</p>
            )}
            <div ref={bottomRef} />
          </ScrollArea>

          {/* Input */}
          <div className="flex items-end gap-2 border-t px-3 py-3">
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu consulta… (Enter para enviar)"
              className="max-h-28 min-h-[40px] resize-none text-sm"
              rows={1}
              disabled={isLoading}
            />
            {isLoading ? (
              <Button size="icon" variant="outline" onClick={cancelStream} title="Detener">
                <Square className="h-4 w-4" />
              </Button>
            ) : (
              <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
