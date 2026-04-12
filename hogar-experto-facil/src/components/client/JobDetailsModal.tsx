
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JobDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: number;
    title: string;
    experto: string;
    status: string;
    date: string;
    rating: number | null;
    description?: string;
    originalReview?: string;
  };
  onNewReview?: (jobId: number, review: string) => void;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  job, 
  onNewReview 
}) => {
  const [newReview, setNewReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewReviewForm, setShowNewReviewForm] = useState(false);
  const { toast } = useToast();

  const handleSubmitReview = async () => {
    if (newReview.trim().length < 10) {
      toast({
        title: "Reseña muy corta",
        description: "Por favor escribe una reseña de al menos 10 caracteres.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onNewReview) {
        onNewReview(job.id, newReview.trim());
      }
      
      toast({
        title: "Reseña enviada",
        description: "Tu nueva reseña ha sido guardada exitosamente.",
      });

      setNewReview('');
      setShowNewReviewForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar la reseña. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setNewReview('');
      setShowNewReviewForm(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles del Trabajo</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Job Info */}
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-foreground">{job.title}</h4>
              <p className="text-sm text-muted-foreground">Fecha: {job.date}</p>
            </div>
            
            {job.description && (
              <div>
                <h5 className="font-medium text-foreground mb-2">Descripción del trabajo</h5>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                  {job.description}
                </p>
              </div>
            )}
          </div>

          {/* Experto Info */}
          <div className="border-t pt-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h5 className="font-medium text-foreground">Experto</h5>
                <p className="text-sm text-muted-foreground">{job.experto}</p>
              </div>
            </div>
          </div>

          {/* Rating and Review */}
          {job.status === 'completed' && job.rating && (
            <div className="border-t pt-4">
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-foreground mb-2">Tu calificación</h5>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= job.rating!
                              ? 'text-yellow-500 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{job.rating} estrella{job.rating !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {job.originalReview && (
                  <div>
                    <h5 className="font-medium text-foreground mb-2">Tu reseña anterior</h5>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                      {job.originalReview}
                    </p>
                  </div>
                )}

                {/* New Review Form */}
                {!showNewReviewForm ? (
                  <Button
                    variant="outline"
                    onClick={() => setShowNewReviewForm(true)}
                    className="w-full"
                  >
                    {job.originalReview ? 'Agregar nueva reseña' : 'Escribir reseña'}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Nueva reseña
                      </label>
                      <Textarea
                        placeholder="Escribe tu nueva reseña sobre este trabajo..."
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        rows={4}
                        disabled={isSubmitting}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {newReview.length}/500 caracteres
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowNewReviewForm(false);
                          setNewReview('');
                        }}
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSubmitReview}
                        disabled={isSubmitting || newReview.trim().length < 10}
                        className="flex-1"
                      >
                        {isSubmitting ? 'Enviando...' : 'Enviar Reseña'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsModal;
