import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';
import { ApiError } from '@/lib/apiClient';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const INITIAL_FORM: FormState = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setShowPasswords({ current: false, new: false, confirm: false });
    onClose();
  };

  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    if (!form.currentPassword) e.currentPassword = 'La contraseña actual es requerida';
    if (!form.newPassword) {
      e.newPassword = 'La nueva contraseña es requerida';
    } else if (form.newPassword.length < 8) {
      e.newPassword = 'Debe tener al menos 8 caracteres';
    }
    if (!form.confirmPassword) {
      e.confirmPassword = 'Confirma la nueva contraseña';
    } else if (form.newPassword !== form.confirmPassword) {
      e.confirmPassword = 'Las contraseñas no coinciden';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await apiClient.post<{ message: string }>('/api/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });

      toast({
        title: 'Contraseña actualizada',
        description: 'Tu contraseña ha sido cambiada correctamente.',
      });
      handleClose();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Error al cambiar la contraseña';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShow = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const fields: { key: keyof FormState; label: string; showKey: keyof typeof showPasswords }[] = [
    { key: 'currentPassword', label: 'Contraseña actual', showKey: 'current' },
    { key: 'newPassword',     label: 'Nueva contraseña',  showKey: 'new' },
    { key: 'confirmPassword', label: 'Confirmar nueva contraseña', showKey: 'confirm' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Cambiar contraseña
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {fields.map(({ key, label, showKey }) => (
            <div key={key} className="space-y-1">
              <Label htmlFor={key}>{label}</Label>
              <div className="relative">
                <Input
                  id={key}
                  type={showPasswords[showKey] ? 'text' : 'password'}
                  value={form[key]}
                  onChange={e => {
                    setForm(prev => ({ ...prev, [key]: e.target.value }));
                    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
                  }}
                  className={errors[key] ? 'border-destructive pr-10' : 'pr-10'}
                  autoComplete={key === 'currentPassword' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => toggleShow(showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPasswords[showKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors[key] && (
                <p className="text-xs text-destructive">{errors[key]}</p>
              )}
            </div>
          ))}

          <p className="text-xs text-muted-foreground">
            La nueva contraseña debe tener al menos 8 caracteres.
          </p>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Cambiar contraseña'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
