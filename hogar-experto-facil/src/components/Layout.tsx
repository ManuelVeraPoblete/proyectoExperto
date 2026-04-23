import { useState } from 'react';
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';
import { MailWarning, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

const EmailVerificationBanner = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dismissed, setDismissed] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!user || user.emailVerified !== false || dismissed) return null;

  const handleResend = async () => {
    setIsSending(true);
    try {
      await apiClient.post<{ message: string }>('/auth/resend-verification', {});
      toast({ title: 'Correo enviado', description: 'Revisa tu bandeja de entrada.' });
    } catch {
      toast({ title: 'Error', description: 'No se pudo enviar el correo. Intenta más tarde.', variant: 'destructive' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-amber-800 text-sm">
          <MailWarning className="w-4 h-4 shrink-0" />
          <span>Tu correo electrónico aún no está verificado. Revisa tu bandeja de entrada.</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs border-amber-400 text-amber-800 hover:bg-amber-100"
            onClick={handleResend}
            disabled={isSending}
          >
            {isSending ? 'Enviando…' : 'Reenviar correo'}
          </Button>
          <button
            onClick={() => setDismissed(true)}
            className="text-amber-600 hover:text-amber-900"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen overflow-hidden bg-background flex flex-col">
      <Header />
      <EmailVerificationBanner />
      <main className="flex-1 min-h-0 flex flex-col overflow-y-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
