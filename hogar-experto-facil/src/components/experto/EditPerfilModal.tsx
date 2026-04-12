import React, { useState, useEffect } from 'react';
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
import { X, Plus } from 'lucide-react';

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
  const [form, setForm] = useState<ExpertoPerfil>({ ...perfil });
  const [newEspecialidad, setNewEspecialidad] = useState('');

  useEffect(() => {
    if (isOpen) setForm({ ...perfil });
  }, [isOpen, perfil]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ep-nombres">Nombres</Label>
              <Input id="ep-nombres" value={form.nombres} onChange={(e) => set('nombres', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ep-apellidos">Apellidos</Label>
              <Input id="ep-apellidos" value={form.apellidos} onChange={(e) => set('apellidos', e.target.value)} />
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
              <Input id="ep-telefono" value={form.telefono} onChange={(e) => set('telefono', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ep-experience">Años de experiencia</Label>
              <Input id="ep-experience" value={form.experience} onChange={(e) => set('experience', e.target.value)} placeholder="Ej: 10 años" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ep-region">Región</Label>
              <Input id="ep-region" value={form.region} onChange={(e) => set('region', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ep-comuna">Comuna</Label>
              <Input id="ep-comuna" value={form.comuna} onChange={(e) => set('comuna', e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ep-direccion">Dirección</Label>
            <Input id="ep-direccion" value={form.direccion} onChange={(e) => set('direccion', e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ep-rate">Tarifa por hora (CLP)</Label>
            <Input
              id="ep-rate"
              type="number"
              value={form.hourlyRate ?? ''}
              onChange={(e) => set('hourlyRate', Number(e.target.value))}
              placeholder="Ej: 15000"
            />
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
