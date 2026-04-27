
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User, Settings, Home, LogOut, Menu, MessageCircle, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import HowItWorksModal from './HowItWorksModal';
import ProfileModal from './ProfileModal';
import ChangePasswordModal from './ChangePasswordModal';

const Header = () => {
  const { user, isAuthenticated, logout, openAuthDialog } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
    setIsSheetOpen(false); // Cerrar el Sheet al navegar
  };

  const handleProtectedLink = (path: string) => {
    if (isAuthenticated && user?.userType === 'client') {
      navigate(path);
      setIsSheetOpen(false); // Cerrar el Sheet al navegar
    } else if (isAuthenticated && user?.userType !== 'client') {
      toast({
        title: "Acción no permitida",
        description: "Esta acción es solo para clientes.",
        variant: "destructive"
      });
    } else {
      openAuthDialog('login');
    }
  };

  const handleExpertoLink = (path: string) => {
    if (isAuthenticated && user?.userType === 'experto') {
      navigate(path);
      setIsSheetOpen(false); // Cerrar el Sheet al navegar
    } else if (isAuthenticated && user?.userType !== 'experto') {
      toast({
        title: "Acción no permitida",
        description: "Esta acción es solo para expertos.",
        variant: "destructive"
      });
    } else {
      openAuthDialog('login');
    }
  };

  return (
    <>
      <header className="bg-foreground sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="Logo" className="w-14 h-14 object-contain" />
              <div>
                <h1 className="text-xl font-bold text-white">Expertos</h1>
                <p className="text-xs text-gray-300 -mt-1">a Domicilio</p>
              </div>
            </Link>

            {/* Navigation (Desktop) */}
            <nav className="hidden md:flex items-center space-x-6">
              {isAuthenticated && user?.userType === 'client' && (
                <>
                  <button onClick={() => handleProtectedLink('/buscar')} className="text-white hover:text-primary transition-colors">
                    Buscar Expertos
                  </button>
                  <button onClick={() => handleProtectedLink('/publicar')} className="text-white hover:text-primary transition-colors">
                    Publicar Trabajo
                  </button>
                </>
              )}
              {isAuthenticated && user?.userType === 'experto' && (
                <>
                  <button onClick={() => handleExpertoLink('/experto/buscar-trabajos')} className="text-white hover:text-primary transition-colors">
                    Buscar Trabajos
                  </button>
                  <button onClick={() => handleExpertoLink('/experto/perfil')} className="text-white hover:text-primary transition-colors">
                    Mi Perfil
                  </button>
                </>
              )}
              <button onClick={() => setIsModalOpen(true)} className="text-white hover:text-primary transition-colors">
                Cómo Funciona
              </button>
              {isAuthenticated && (
                <button 
                  onClick={handleDashboardClick}
                  className="text-white hover:text-primary transition-colors"
                >
                  Mi Dashboard
                </button>
              )}
            </nav>

            {/* User Section and Mobile Menu */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90">
                      {user.avatar ? (
                        <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-foreground/30" />
                      ) : (
                        <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                      <span className="hidden md:inline">{`${user.nombres} ${user.apellidos}`}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{`${user.nombres} ${user.apellidos}`}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-primary font-bold capitalize mt-1">
                          {user.userType === 'client' ? '👤 Cliente' : 
                           user.userType === 'experto' ? '🛠️ Experto' : '🔐 Administrador'}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDashboardClick}>
                      <Home className="w-4 h-4 mr-2" />
                      Mi Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/mensajes')}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Mensajes directos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsChangePasswordOpen(true)}>
                      <Lock className="w-4 h-4 mr-2" />
                      Cambiar contraseña
                    </DropdownMenuItem>
                    {user.userType === 'admin' && (
                      <DropdownMenuItem>
                        <Settings className="w-4 h-4 mr-2" />
                        Panel Admin
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => openAuthDialog('login')}
                    className="text-white hover:text-primary"
                  >
                    Iniciar Sesión
                  </Button>
                  <Button 
                    size="sm" 
                    className="btn-primary"
                    onClick={() => navigate('/register')}
                  >
                    Registrarse
                  </Button>
                </div>
              )}

              {/* Mobile Menu Trigger */}
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[250px] sm:w-[300px] bg-foreground">
                  <nav className="flex flex-col gap-6 pt-8">
                    {isAuthenticated && user?.userType === 'client' && (
                      <>
                        <button 
                          onClick={() => handleProtectedLink('/buscar')} 
                          className="text-lg font-medium text-white hover:text-primary transition-colors text-left"
                        >
                          Buscar Expertos
                        </button>
                        <button 
                          onClick={() => handleProtectedLink('/publicar')} 
                          className="text-lg font-medium text-white hover:text-primary transition-colors text-left"
                        >
                          Publicar Trabajo
                        </button>
                      </>
                    )}
                    {isAuthenticated && user?.userType === 'experto' && (
                      <>
                        <button
                          onClick={() => handleExpertoLink('/experto/buscar-trabajos')}
                          className="text-lg font-medium text-white hover:text-primary transition-colors text-left"
                        >
                          Buscar Trabajos
                        </button>
                        <button
                          onClick={() => handleExpertoLink('/experto/perfil')}
                          className="text-lg font-medium text-white hover:text-primary transition-colors text-left"
                        >
                          Mi Perfil
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => { setIsModalOpen(true); setIsSheetOpen(false); }} 
                      className="text-lg font-medium text-white hover:text-primary transition-colors text-left"
                    >
                      Cómo Funciona
                    </button>
                    {isAuthenticated && (
                      <button 
                        onClick={handleDashboardClick}
                        className="text-lg font-medium text-white hover:text-primary transition-colors text-left"
                      >
                        Mi Dashboard
                      </button>
                    )}
                    {!isAuthenticated && (
                      <>
                        <Button 
                          variant="ghost" 
                          className="justify-start text-lg font-medium text-white hover:text-primary"
                          onClick={() => { openAuthDialog('login'); setIsSheetOpen(false); }}
                        >
                          Iniciar Sesión
                        </Button>
                        <Button 
                          className="btn-primary justify-start text-lg font-medium"
                          onClick={() => { navigate('/register'); setIsSheetOpen(false); }}
                        >
                          Registrarse
                        </Button>
                      </>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
      <HowItWorksModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      <ChangePasswordModal isOpen={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} />
    </>
  );
};

export default Header;
