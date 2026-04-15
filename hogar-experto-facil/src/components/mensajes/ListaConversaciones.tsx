import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ApiConversation } from '@/services/api/mensajeService';
import { toAbsoluteUrl } from '@/lib/api-config';

interface ListaConversacionesProps {
  conversations: ApiConversation[];
  selectedId: string | null;
  onSelect: (contactId: string, contactName: string, contactAvatar?: string) => void;
}

const formatRelative = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffH = Math.floor(diffMin / 60);
  const diffD = Math.floor(diffH / 24);

  if (diffMin < 1) return 'ahora';
  if (diffMin < 60) return `hace ${diffMin} min`;
  if (diffH < 24) return `hace ${diffH} h`;
  if (diffD === 1) return 'ayer';
  return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
};

const ListaConversaciones: React.FC<ListaConversacionesProps> = ({
  conversations,
  selectedId,
  onSelect,
}) => {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground p-6">
        <MessageSquare className="w-10 h-10 opacity-30" />
        <p className="text-sm text-center">Aún no tienes conversaciones.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="divide-y divide-border">
        {conversations.map((conv) => {
          const name = `${conv.contact.nombres} ${conv.contact.apellidos}`;
          const isSelected = selectedId === conv.contact.id;
          const hasUnread = conv.unreadCount > 0;
          const avatarUrl = toAbsoluteUrl(conv.contact.avatar_url);

          return (
            <button
              key={conv.contact.id}
              onClick={() => onSelect(conv.contact.id, name, avatarUrl)}
              className={`w-full text-left px-4 py-3 transition-colors flex items-start gap-3 ${
                isSelected
                  ? 'bg-primary/10 border-l-2 border-primary'
                  : 'hover:bg-muted/50'
              }`}
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden bg-primary/20 flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-primary font-semibold text-sm">
                    {conv.contact.nombres.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className={`text-sm truncate ${hasUnread ? 'font-bold' : 'font-medium'}`}>
                    {name}
                  </p>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {conv.lastMessage ? formatRelative(conv.lastMessage.createdAt) : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-1 mt-0.5">
                  <p className={`text-xs truncate ${hasUnread ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {conv.lastMessage?.content ?? 'Sin mensajes'}
                  </p>
                  {hasUnread && (
                    <Badge className="bg-green-500 text-white text-[10px] h-4 min-w-[16px] px-1 shrink-0">
                      {conv.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default ListaConversaciones;
