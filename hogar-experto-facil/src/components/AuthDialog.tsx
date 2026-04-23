import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { API_BASE_URL } from '@/lib/api-config';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
}

const AuthDialog = ({ isOpen, onClose, mode: _mode, onModeChange: _onModeChange }: AuthDialogProps) => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [blockMessage, setBlockMessage] = useState<string | null>(null);

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!formData.email.trim()) e.email = 'El email es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Ingresa un email válido';
    if (!formData.password) e.password = 'La contraseña es requerida';
    else if (formData.password.length < 6) e.password = 'Mínimo 6 caracteres';
    return e;
  };

  const handleSuccessfulLogin = (user: any) => {
    login(user);
    
    // Mapeo inteligente para el mensaje de bienvenida
    const rawRole = user.userType || user.user_type || user.role || user.role_id;
    let roleText = 'Cliente'; // Default seguro

    if (rawRole === 'admin' || rawRole === 1 || rawRole === '1') {
      roleText = 'Administrador';
    } else if (rawRole === 'experto' || rawRole === 'expert' || rawRole === 2 || rawRole === '2') {
      roleText = 'Experto';
    } else if (rawRole === 'client' || rawRole === 'cliente' || rawRole === 'customer' || rawRole === 3 || rawRole === '3') {
      roleText = 'Cliente';
    }

    toast({
      title: "¡Bienvenido!",
      description: `Has iniciado sesión como ${roleText}`,
    });
    onClose();
    resetForm();
    navigate('/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setIsLoading(true);
    setBlockMessage(null);
    let response: Response | null = null;

    try {
      // Conexión real a tu API local en localhost:3000/api/auth/login
      response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const msg = Array.isArray(data.message) ? data.message.join(', ') : (data.message || data.error || 'Credenciales incorrectas');
        throw new Error(msg);
      }

      // Pass full response so normalizeUser can extract both user fields and the JWT token
      const rawData = data.user || data;
      const userData = {
        ...rawData,
        userType: rawData.userType || rawData.user_type || 'client',
        token: data.token,
      };

      logger.debug('Login exitoso, userType:', userData.userType);

      handleSuccessfulLogin(userData);
      
    } catch (error: any) {
      logger.error('Error al iniciar sesión:', error);
      const msg: string = error.message || "No se pudo conectar con el servidor.";
      // HTTP 403 = cuenta bloqueada/pendiente → mostrar en el diálogo, no como toast
      if (response && response.status === 403) {
        setBlockMessage(msg);
      } else {
        toast({
          title: "Error al iniciar sesión",
          description: msg,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: '', password: '' });
    setErrors({});
    setBlockMessage(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Iniciar Sesión
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Ingresa a tu cuenta para continuar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {blockMessage && (
            <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{blockMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className={`pl-10${errors.email ? ' border-destructive' : ''}`}
                  value={formData.email}
                  onChange={(e) => { setFormData({...formData, email: e.target.value}); if (errors.email) setErrors(p => ({...p, email: ''})); }}
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Tu contraseña"
                  className={`pl-10${errors.password ? ' border-destructive' : ''}`}
                  value={formData.password}
                  onChange={(e) => { setFormData({...formData, password: e.target.value}); if (errors.password) setErrors(p => ({...p, password: ''})); }}
                  disabled={isLoading}
                />
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full h-12 text-base btn-primary" disabled={isLoading}>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span>
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => { onClose(); navigate('/register'); }}
                className="text-primary hover:underline font-medium"
              >
                Regístrate aquí
              </button>
            </span>
          </div>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
      
          </div>

          
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
