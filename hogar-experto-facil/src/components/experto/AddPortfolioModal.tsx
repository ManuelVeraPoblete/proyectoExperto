import React, { useState } from 'react';
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
import { PortfolioEntry } from '@/types/experto';

interface AddPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: Omit<PortfolioEntry, 'id' | 'reactions' | 'reviews'>) => void;
}

const CATEGORIES = [
  'Plomería', 'Electricidad', 'Pintura', 'Gasfitería', 'Carpintería',
  'Albañilería', 'Jardinería', 'Limpieza', 'Cerrajería', 'Otro',
];

const AddPortfolioModal: React.FC<AddPortfolioModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: CATEGORIES[0],
    date: new Date().toISOString().split('T')[0],
    image: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'El título es obligatorio';
    if (!form.description.trim()) e.description = 'La descripción es obligatoria';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onAdd({ ...form, image: form.image || undefined });
    handleClose();
  };

  const handleClose = () => {
    setForm({ title: '', description: '', category: CATEGORIES[0], date: new Date().toISOString().split('T')[0], image: '' });
    setErrors({});
    onClose();
  };

  const set = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const { [field]: _, ...rest } = e; return rest; });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Agregar trabajo al portafolio</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="pt-title">Título *</Label>
            <Input
              id="pt-title"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Ej: Renovación de baño completo"
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pt-description">Descripción *</Label>
            <Textarea
              id="pt-description"
              rows={3}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Describe el trabajo realizado..."
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="pt-category">Categoría</Label>
              <select
                id="pt-category"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pt-date">Fecha</Label>
              <Input
                id="pt-date"
                type="date"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pt-image">URL de imagen (opcional)</Label>
            <Input
              id="pt-image"
              value={form.image}
              onChange={(e) => set('image', e.target.value)}
              placeholder="https://..."
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit">Agregar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPortfolioModal;
