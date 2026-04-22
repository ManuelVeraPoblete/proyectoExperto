import React, { useState, useEffect, useRef } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Camera, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/apiClient';
import { toAbsoluteUrl } from '@/lib/api-config';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ExpertoPerfil {
  nombres: string;
  apellidos: string;
  telefono: string;
  direccion: string;
  region: string;
  comuna: string;
  descripcion: string;
  especialidades: string[];
  experience: string;
  hourlyRate?: number;
}

interface EditPerfilModalProps {
  isOpen: boolean;
  onClose: () => void;
  perfil: ExpertoPerfil;
  onSave: (changes: Partial<ExpertoPerfil>) => void;
}

const EditPerfilModal: React.FC<EditPerfilModalProps> = ({ isOpen, onClose, perfil, onSave }) => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState<ExpertoPerfil>({ ...perfil });
  const [newEspecialidad, setNewEspecialidad] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!form.nombres.trim()) e.nombres = 'Los nombres son requeridos';
    if (!form.apellidos.trim()) e.apellidos = 'Los apellidos son requeridos';
    if (!form.region.trim()) e.region = 'La región es requerida';
    if (!form.comuna.trim()) e.comuna = 'La comuna es requerida';
    if (!form.direccion.trim()) e.direccion = 'La dirección es requerida';
    if (form.telefono && !/^\+?[\d\s\-()]{8,15}$/.test(form.telefono))
      e.telefono = 'Formato inválido. Ej: +56 9 12345678';
    if (form.hourlyRate !== undefined && form.hourlyRate < 0)
      e.hourlyRate = 'La tarifa no puede ser negativa';
    return e;
  };

  useEffect(() => {
    if (isOpen) { setForm({ ...perfil }); setErrors({}); }
  }, [isOpen, perfil]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    onSave(form);
    onClose();
  };

  const set = (field: keyof ExpertoPerfil, value: string | number | string[]) =>
    setForm((f) => ({ ...f, [field]: value }));

  const addEspecialidad = () => {
    const trimmed = newEspecialidad.trim();
    if (!trimmed || form.especialidades.includes(trimmed)) return;
    set('especialidades', [...form.especialidades, trimmed]);
    setNewEspecialidad('');
  };

  const removeEspecialidad = (esp: string) =>
    set('especialidades', form.especialidades.filter((e) => e !== esp));

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const result = await apiClient.postForm<{ avatarUrl: string }>(`/users/${user.id}/avatar`, formData);
      const absoluteUrl = toAbsoluteUrl(result.avatarUrl)!;
      updateUser({ avatar: absoluteUrl });
      toast({ title: 'Avatar actualizado', description: 'Tu foto de perfil se actualizó correctamente.' });
    } catch {
      toast({ title: 'Error', description: 'No se pudo actualizar el avatar.', variant: 'destructive' });
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="w-20 h-20 ring-2 ring-primary/10">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-primary text-white text-2xl">
                  <UserIcon className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 hover:bg-primary/90 transition-colors disabled:opacity-50"
                title="Cambiar foto"
              >
                <Camera className="w-3 h-3" />
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ep-nombres">Nombres *</Label>
              <Input id="ep-nombres" value={form.nombres} onChange={(e) => { set('nombres', e.target.value); if (errors.nombres) setErrors(p => ({...p, nombres: ''})); }} className={errors.nombres ? 'border-destructive' : ''} />
              {errors.nombres && <p className="text-xs text-destructive">{errors.nombres}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ep-apellidos">Apellidos *</Label>
              <Input id="ep-apellidos" value={form.apellidos} onChange={(e) => { set('apellidos', e.target.value); if (errors.apellidos) setErrors(p => ({...p, apellidos: ''})); }} className={errors.apellidos ? 'border-destructive' : ''} />
              {errors.apellidos && <p className="text-xs text-destructive">{errors.apellidos}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ep-descripcion">Descripción / Presentación</Label>
            <Textarea
              id="ep-descripcion"
              rows={3}
              value={form.descripcion}
              onChange={(e) => set('descripcion', e.target.value)}
              placeholder="Cuéntanos sobre tu experiencia..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ep-telefono">Teléfono</Label>
              <Input id="ep-telefono" value={form.telefono} onChange={(e) => { set('telefono', e.target.value); if (errors.telefono) setErrors(p => ({...p, telefono: ''})); }} className={errors.telefono ? 'border-destructive' : ''} />
              {errors.telefono && <p className="text-xs text-destructive">{errors.telefono}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ep-experience">Años de experiencia</Label>
              <Input id="ep-experience" value={form.experience} onChange={(e) => set('experience', e.target.value)} placeholder="Ej: 10 años" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ep-region">Región *</Label>
              <Input id="ep-region" value={form.region} onChange={(e) => { set('region', e.target.value); if (errors.region) setErrors(p => ({...p, region: ''})); }} className={errors.region ? 'border-destructive' : ''} />
              {errors.region && <p className="text-xs text-destructive">{errors.region}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ep-comuna">Comuna *</Label>
              <Input id="ep-comuna" value={form.comuna} onChange={(e) => { set('comuna', e.target.value); if (errors.comuna) setErrors(p => ({...p, comuna: ''})); }} className={errors.comuna ? 'border-destructive' : ''} />
              {errors.comuna && <p className="text-xs text-destructive">{errors.comuna}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ep-direccion">Dirección *</Label>
            <Input id="ep-direccion" value={form.direccion} onChange={(e) => { set('direccion', e.target.value); if (errors.direccion) setErrors(p => ({...p, direccion: ''})); }} className={errors.direccion ? 'border-destructive' : ''} />
            {errors.direccion && <p className="text-xs text-destructive">{errors.direccion}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ep-rate">Tarifa por hora (CLP)</Label>
            <Input
              id="ep-rate"
              type="number"
              value={form.hourlyRate ?? ''}
              onChange={(e) => { set('hourlyRate', Number(e.target.value)); if (errors.hourlyRate) setErrors(p => ({...p, hourlyRate: ''})); }}
              placeholder="Ej: 15000"
              className={errors.hourlyRate ? 'border-destructive' : ''}
            />
            {errors.hourlyRate && <p className="text-xs text-destructive">{errors.hourlyRate}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Especialidades</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.especialidades.map((esp) => (
                <Badge key={esp} variant="secondary" className="flex items-center gap-1 pr-1">
                  {esp}
                  <button type="button" onClick={() => removeEspecialidad(esp)} className="hover:text-red-500 ml-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newEspecialidad}
                onChange={(e) => setNewEspecialidad(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addEspecialidad(); } }}
                placeholder="Nueva especialidad..."
                className="flex-1"
              />
              <Button type="button" variant="outline" size="icon" onClick={addEspecialidad}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Guardar cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPerfilModal;
