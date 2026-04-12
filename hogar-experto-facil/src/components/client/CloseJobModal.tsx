
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CloseJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: number;
    title: string;
    experto: string;
  };
  onJobClosed: (jobId: number, rating: number, review: string) => void;
}

const CloseJobModal: React.FC<CloseJobModalProps> = ({ isOpen, onClose, job, onJobClosed }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Calificación requerida",
        description: "Por favor selecciona una calificación para el experto.",
        variant: "destructive"
      });
      return;
    }

    if (review.trim().length < 10) {
      toast({
        title: "Reseña requerida",
        description: "Por favor escribe una reseña de al menos 10 caracteres.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onJobClosed(job.id, rating, review.trim());
      
      toast({
        title: "Trabajo cerrado exitosamente",
        description: `Has calificado a ${job.experto} con ${rating} estrella${rating !== 1 ? 's' : ''}.`,
      });

      // Reset form
      setRating(0);
      setHoveredRating(0);
      setReview('');
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cerrar el trabajo. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRating(0);
      setHoveredRating(0);
      setReview('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cerrar Trabajo</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-foreground mb-2">{job.title}</h4>
            <p className="text-sm text-muted-foreground">Experto: {job.experto}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Califica al experto
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 hover:scale-110 transition-transform"
                  disabled={isSubmitting}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {rating} estrella{rating !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Reseña del trabajo
            </label>
            <Textarea
              placeholder="Describe tu experiencia con el experto y el trabajo realizado..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              disabled={isSubmitting}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {review.length}/500 caracteres
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
          >
            {isSubmitting ? 'Cerrando...' : 'Cerrar Trabajo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CloseJobModal;
