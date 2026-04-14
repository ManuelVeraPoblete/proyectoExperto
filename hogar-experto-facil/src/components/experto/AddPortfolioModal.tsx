import React, { useState, useRef } from 'react';
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
import { X, ImagePlus } from 'lucide-react';
import { CreatePortfolioData } from '@/services/api/portfolioService';

interface AddPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: CreatePortfolioData) => void;
  initialTitle?: string;
}

const CATEGORIES = [
  'Plomería', 'Electricidad', 'Pintura', 'Gasfitería', 'Carpintería',
  'Albañilería', 'Jardinería', 'Limpieza', 'Cerrajería', 'Otro',
];

const MAX_PHOTOS = 3;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 10;

const AddPortfolioModal: React.FC<AddPortfolioModalProps> = ({ isOpen, onClose, onAdd, initialTitle = '' }) => {
  const [form, setForm] = useState({
    title: initialTitle,
    description: '',
    category: CATEGORIES[0],
    date: new Date().toISOString().split('T')[0],
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'El título es obligatorio';
    if (!form.description.trim()) e.description = 'La descripción es obligatoria';
    return e;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    const available = MAX_PHOTOS - files.length;
    if (available <= 0) return;

    const valid: File[] = [];
    const newPreviews: string[] = [];
    const errs: string[] = [];

    for (const file of selected.slice(0, available)) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errs.push(`"${file.name}" no es JPG, PNG ni WEBP`);
        continue;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        errs.push(`"${file.name}" supera los ${MAX_SIZE_MB}MB`);
        continue;
      }
      valid.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    if (errs.length > 0) {
      setErrors((prev) => ({ ...prev, photos: errs.join('. ') }));
    } else {
      setErrors((prev) => { const { photos: _, ...rest } = prev; return rest; });
    }

    setFiles((prev) => [...prev, ...valid]);
    setPreviews((prev) => [...prev, ...newPreviews]);

    // Reset el input para permitir seleccionar el mismo archivo nuevamente
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onAdd({ ...form, files });
    handleClose();
  };

  const handleClose = () => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setForm({ title: initialTitle, description: '', category: CATEGORIES[0], date: new Date().toISOString().split('T')[0] });
    setFiles([]);
    setPreviews([]);
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

          {/* Uploader de fotos */}
          <div className="space-y-2">
            <Label>
              Fotos del trabajo{' '}
              <span className="text-muted-foreground font-normal text-xs">(hasta {MAX_PHOTOS}, JPG/PNG/WEBP, máx. {MAX_SIZE_MB}MB c/u)</span>
            </Label>

            {/* Miniaturas */}
            {previews.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {previews.map((src, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
                    <img src={src} alt={`foto ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5 transition-colors"
                      title="Quitar foto"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Botón agregar */}
            {files.length < MAX_PHOTOS && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-md border border-dashed border-input text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <ImagePlus className="w-4 h-4" />
                  {files.length === 0 ? 'Seleccionar fotos' : `Agregar más (${files.length}/${MAX_PHOTOS})`}
                </button>
              </>
            )}
            {errors.photos && <p className="text-xs text-red-500">{errors.photos}</p>}
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
