
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Flag, AlertTriangle } from 'lucide-react';
import { ReportFormData, REPORT_REASONS } from '@/types/report';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: 'review' | 'user' | 'post' | 'language';
  reportedUserId?: string;
  reportedUserName?: string;
  reportedContent?: string;
  onSubmit: (data: ReportFormData) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  reportType,
  reportedUserId,
  reportedUserName,
  reportedContent,
  onSubmit
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!selectedReason) {
      toast.error('Por favor selecciona una razón para el reporte');
      return;
    }

    if (!description.trim()) {
      toast.error('Por favor proporciona una descripción del problema');
      return;
    }

    const reportData: ReportFormData = {
      type: reportType,
      reason: selectedReason,
      description: description.trim(),
      reportedUserId,
      reportedUserName,
      reportedContent
    };

    onSubmit(reportData);
    
    // Reset form
    setSelectedReason('');
    setDescription('');
    onClose();
    
    toast.success('Reporte enviado correctamente. Será revisado por nuestro equipo.');
  };

  const getTitle = () => {
    switch (reportType) {
      case 'user': return 'Reportar Usuario';
      case 'review': return 'Reportar Reseña';
      case 'post': return 'Reportar Publicación';
      case 'language': return 'Reportar Lenguaje Inapropiado';
      default: return 'Enviar Reporte';
    }
  };

  const getDescription = () => {
    switch (reportType) {
      case 'user': return `Reportando al usuario: ${reportedUserName}`;
      case 'review': return 'Reportando una reseña inapropiada';
      case 'post': return 'Reportando una publicación ofensiva';
      case 'language': return 'Reportando lenguaje inapropiado';
      default: return 'Ayúdanos a mantener una comunidad segura';
    }
  };

  const reasons = REPORT_REASONS[reportType] || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Flag className="w-5 h-5 text-red-500" />
            <span>{getTitle()}</span>
          </DialogTitle>
          <DialogDescription>
            {getDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {reportedContent && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Contenido reportado:</p>
              <p className="text-sm">{reportedContent}</p>
            </div>
          )}

          <div className="space-y-3">
            <Label className="text-base font-medium">Razón del reporte</Label>
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
              {reasons.map((reason) => (
                <div key={reason} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason} id={reason} />
                  <Label htmlFor={reason} className="text-sm cursor-pointer">
                    {reason}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">
              Descripción adicional
            </Label>
            <Textarea
              id="description"
              placeholder="Proporciona más detalles sobre el problema..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="flex items-center space-x-2 p-3 bg-orange-50 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <p className="text-sm text-orange-800">
              Los reportes falsos pueden resultar en la suspensión de tu cuenta.
            </p>
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="flex-1 bg-red-600 hover:bg-red-700">
            Enviar Reporte
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;
