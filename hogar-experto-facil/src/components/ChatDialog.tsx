
import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReportButton from '@/components/common/ReportButton';
import { Message } from '@/types';

interface ChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  participantName: string;
  onSendMessage: (message: string) => void;
  messages: Message[];
  participantId?: string;
}

export function ChatDialog({ 
  isOpen, 
  onClose, 
  participantName, 
  onSendMessage, 
  messages,
  participantId 
}: ChatDialogProps) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] flex flex-col h-[80vh] max-h-[90dvh]">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">Chat con {participantName}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Envía mensajes a {participantName}.
              </DialogDescription>
            </div>
            {participantId && (
              <ReportButton
                reportType="user"
                reportedUserId={participantId}
                reportedUserName={participantName}
                variant="ghost"
                size="sm"
              />
            )}
          </div>
        </DialogHeader>
        <ScrollArea className="flex-1 p-4 bg-muted rounded-lg mb-4 overflow-y-auto">
          <div className="flex flex-col space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-lg relative shadow-sm group ${
                    msg.sender === 'me'
                      ? 'bg-green-500 text-white rounded-br-none'
                      : 'bg-card text-card-foreground rounded-bl-none'
                  }`}
                >
                  <p className="text-sm break-words pr-10">{msg.text}</p>
                  <span className="absolute bottom-1 right-2 text-xs opacity-75 text-gray-100 dark:text-gray-400">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.sender !== 'me' && (
                    <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ReportButton
                        reportType="language"
                        reportedUserId={participantId}
                        reportedUserName={participantName}
                        reportedContent={msg.text}
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 bg-red-50 hover:bg-red-100"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="flex items-center gap-2 p-2 border-t border-border">
          <Input
            placeholder="Escribe un mensaje..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            className="flex-1 rounded-full px-4 py-2 bg-muted border-none focus:ring-2 focus:ring-primary"
          />
          <Button 
            onClick={handleSendMessage}
            className="rounded-full p-2 bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-ring focus:ring-offset-2"
            size="icon"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M15 7l-6 6"/></svg>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
