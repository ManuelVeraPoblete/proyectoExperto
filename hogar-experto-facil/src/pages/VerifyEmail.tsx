import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/apiClient';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/lib/apiClient';

type Status = 'loading' | 'success' | 'error';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('El enlace de verificación no es válido.');
      return;
    }

    apiClient
      .post<{ message: string }>('/auth/verify-email', { token })
      .then(res => {
        setStatus('success');
        setMessage(res.message);
        if (user) updateUser({ emailVerified: true });
      })
      .catch(err => {
        setStatus('error');
        setMessage(err instanceof ApiError ? err.message : 'No se pudo verificar el correo.');
      });
  }, []);

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin" />
            <p className="text-muted-foreground">Verificando tu correo electrónico…</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
            <h1 className="text-2xl font-bold text-foreground">¡Correo verificado!</h1>
            <p className="text-muted-foreground">{message}</p>
            <Button onClick={() => navigate('/dashboard')}>Ir a mi dashboard</Button>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 mx-auto text-destructive" />
            <h1 className="text-2xl font-bold text-foreground">Error de verificación</h1>
            <p className="text-muted-foreground">{message}</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate('/')}>Volver al inicio</Button>
              <Button onClick={() => navigate('/dashboard')}>Ir a mi dashboard</Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default VerifyEmail;
