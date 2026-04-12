import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const useProtectedNavigation = () => {
  const { user, isAuthenticated, openAuthDialog } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleProtectedLink = (path: string) => {
    if (isAuthenticated && user?.userType === 'client') {
      navigate(path);
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

  return { handleProtectedLink };
};

export default useProtectedNavigation;
