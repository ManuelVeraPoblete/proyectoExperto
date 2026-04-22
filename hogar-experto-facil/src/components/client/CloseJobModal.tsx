import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, CheckCircle2, Briefcase, User, ImagePlus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CloseJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: string;
    title: string;
    experto: string | null;
    description?: string;
  };
  onJobClosed: (jobId: string, rating: number, review: string, files: File[]) => Promise<void>;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Muy malo',
  2: 'Regular',
  3: 'Bueno',
  4: 'Muy bueno',
  5: 'Excelente',
};

const MAX_PHOTOS   = 3;
const MAX_SIZE_MB  = 10;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const CloseJobModal: React.FC<CloseJobModalProps> = ({ isOpen, onClose, job, onJobClosed }) => {
  const [rating, setRating]               = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview]               = useState('');
  const [files, setFiles]                 = useState<File[]>([]);
  const [previews, setPreviews]           = useState<string[]>([]);
  const [errors, setErrors]               = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const fileInputRef                      = useRef<HTMLInputElement>(null);
  const { toast }                         = useToast();

  const validate = () => {
    const e: Record<string, string> = {};
    if (rating === 0)               e.rating = 'Selecciona una calificación para el experto.';
    if (review.trim().length < 10)  e.review = 'La reseña debe tener al menos 10 caracteres.';
    if (review.trim().length > 500) e.review = 'La reseña no puede superar los 500 caracteres.';
    return e;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected  = Array.from(e.target.files ?? []);
    const available = MAX_PHOTOS - files.length;
    if (available <= 0) return;

    const valid: File[]       = [];
    const newPreviews: string[] = [];
    const errs: string[]      = [];

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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setIsSubmitting(true);
    try {
      await onJobClosed(job.id, rating, review.trim(), files);
      toast({
        title: 'Trabajo cerrado',
        description: `Calificaste a ${job.experto ?? 'el experto'} con ${rating} estrella${rating !== 1 ? 's' : ''}. La reseña aparecerá en su historial.`,
      });
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    previews.forEach((url) => URL.revokeObjectURL(url));
    setRating(0);
    setHoveredRating(0);
    setReview('');
    setFiles([]);
    setPreviews([]);
    setErrors({});
    onClose();
  };

  const activeRating = hoveredRating || rating;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Cerrar y calificar trabajo
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">

          {/* Info del trabajo */}
          <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="font-medium text-foreground">{job.title}</span>
            </div>
            {job.experto && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4 shrink-0" />
                <span>Experto: {job.experto}</span>
              </div>
            )}
          </div>

          {/* Calificación con estrellas */}
          <div className="space-y-2">
            <Label>Calificación del experto *</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => { setRating(star); setErrors((p) => { const { rating: _, ...r } = p; return r; }); }}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 hover:scale-110 transition-transform disabled:opacity-50"
                >
                  <Star
                    className={`w-9 h-9 transition-colors ${
                      star <= activeRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {activeRating > 0 && (
                <span className="ml-2 text-sm font-medium text-foreground">
                  {RATING_LABELS[activeRating]}
                </span>
              )}
            </div>
            {errors.rating && <p className="text-xs text-destructive">{errors.rating}</p>}
          </div>

          {/* Reseña */}
          <div className="space-y-1.5">
            <Label htmlFor="cj-review">
              Reseña del trabajo *
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                (aparecerá en el historial del experto)
              </span>
            </Label>
            <Textarea
              id="cj-review"
              rows={4}
              disabled={isSubmitting}
              value={review}
              onChange={(e) => {
                setReview(e.target.value);
                setErrors((p) => { const { review: _, ...r } = p; return r; });
              }}
              placeholder="Describe la calidad del trabajo, puntualidad, trato y resultado final..."
              className="resize-none"
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              {errors.review
                ? <p className="text-xs text-destructive">{errors.review}</p>
                : <span />}
              <p className={`text-xs ml-auto ${review.length > 450 ? 'text-orange-500' : 'text-muted-foreground'}`}>
                {review.length}/500
              </p>
            </div>
          </div>

          {/* Fotos del trabajo */}
          <div className="space-y-2">
            <Label>
              Fotos del trabajo
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                (hasta {MAX_PHOTOS}, JPG/PNG/WEBP, máx. {MAX_SIZE_MB}MB c/u)
              </span>
            </Label>

            {previews.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {previews.map((src, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
                    <img src={src} alt={`foto ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

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
            {errors.photos && <p className="text-xs text-destructive">{errors.photos}</p>}
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white">
              {isSubmitting ? 'Cerrando...' : 'Cerrar y publicar reseña'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CloseJobModal;
