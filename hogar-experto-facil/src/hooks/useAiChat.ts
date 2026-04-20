import { useState, useCallback, useRef } from 'react';
import { API_BASE_URL } from '@/lib/api-config';
import { storageService } from '@/services/storageService';
import { logger } from '@/lib/logger';
import { UserRole } from '@/types';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const useAiChat = (userName: string, userRole: UserRole) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: userText.trim() };
    const nextMessages = [...messages, userMessage];

    setMessages([...nextMessages, { role: 'assistant', content: '' }]);
    setIsLoading(true);
    setError(null);

    abortRef.current = new AbortController();

    try {
      const token = storageService.getUser()?.token;
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ messages: nextMessages, userName, userRole }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6);
          if (!json.trim()) continue;

          const data = JSON.parse(json) as { text?: string; done?: boolean; error?: string };

          if (data.error) throw new Error(data.error);
          if (data.done) break;
          if (data.text) {
            accumulated += data.text;
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: 'assistant', content: accumulated };
              return updated;
            });
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      const msg = err instanceof Error ? err.message : 'Error al conectar con el asistente';
      logger.error('[useAiChat]', msg);
      setError(msg);
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [messages, isLoading, userName, userRole]);

  const clearChat = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
  }, []);

  const cancelStream = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
  }, []);

  return { messages, isLoading, error, sendMessage, clearChat, cancelStream };
};

export default useAiChat;
