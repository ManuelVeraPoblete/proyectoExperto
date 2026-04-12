import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/lib/api-config';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
}

// Usuarios de prueba para desarrollo local rápido
const testUsers = {
  client: {
    id: '1',
    nombres: 'Ana',
    apellidos: 'García',
    email: 'cliente@test.com',
    telefono: '+56 9 1234 5678',
    userType: 'client' as const,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    direccion: 'Calle Falsa 123',
    region: 'Metropolitana de Santiago',
    provincia: 'Santiago',
    comuna: 'Las Condes',
    jobCount: 12,
    averageRating: 4.8,
  },
  experto: {
    id: '2',
    nombres: 'Carlos',
    apellidos: 'Rodríguez',
    email: 'experto@test.com',
    telefono: '+56 9 8765 4321',
    userType: 'experto' as const,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    direccion: 'Av. Principal 456',
    region: 'Metropolitana de Santiago',
    provincia: 'Santiago',
    comuna: 'Providencia',
    calificacion: 4.9,
    reviewCount: 45,
    especialidades: ['Plomería', 'Electricidad'],
    experience: '15 años de experiencia',
    hourlyRate: 25000,
    isVerified: true,
  },
  admin: {
    id: '3',
    nombres: 'María',
    apellidos: 'Administradora',
    email: 'admin@test.com',
    telefono: '+56 9 1111 1111',
    userType: 'admin' as const,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    direccion: 'Oficina Central 789',
    region: 'Metropolitana de Santiago',
    provincia: 'Santiago',
    comuna: 'Santiago',
    adminLevel: 'Super Administrador',
    lastAccess: 'Hoy a las 10:30 AM',
  },
};

const AuthDialog = ({ isOpen, onClose, mode, onModeChange }: AuthDialogProps) => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    
    try {
      // Conexión real a tu API local en localhost:3000/api/auth/login
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Credenciales incorrectas');
      }

      // Asegurarnos de que el usuario tenga un userType válido (mapeando user_type de la BD)
      const rawData = data.user || data;
      const userData = {
        ...rawData,
        userType: rawData.userType || rawData.user_type || 'client' // Fallback seguro a client
      };
      
      console.log("👤 Datos crudos de API:", rawData);
      console.log("🎯 userType normalizado:", userData.userType);
      
      handleSuccessfulLogin(userData);
      
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      toast({
        title: "Error al iniciar sesión",
        description: error.message || "No se pudo conectar con el servidor.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestLogin = (userType: 'client' | 'experto' | 'admin') => {
    const user = testUsers[userType];
    handleSuccessfulLogin(user);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
    });
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Tu contraseña"
                  className="pl-10"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  disabled={isLoading}
                />
              </div>
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
