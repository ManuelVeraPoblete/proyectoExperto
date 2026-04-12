
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flag, Clock, Eye, CheckCircle, AlertTriangle, Trash2 } from 'lucide-react';
import { Report } from '@/types/report';
import { toast } from 'sonner';

interface ReportDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: Report;
  onReview?: (reportId: number) => void;
  onDelete?: (reportId: number) => void;
}

export const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
  isOpen,
  onClose,
  report,
  onReview,
  onDelete
}) => {
  const handleReview = () => {
    if (onReview) {
      onReview(report.id);
      toast.success('Reporte marcado como revisado');
      onClose();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(report.id);
      toast.success('Reporte eliminado');
      onClose();
    }
  };

  const getStatusBadgeColor = (status: Report['status']) => {
    switch (status) {
      case 'pending': return 'destructive';
      case 'reviewed': return 'secondary';
      case 'resolved': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'reviewed': return <Eye className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Flag className="w-5 h-5 text-red-500" />
            <span>Detalles del Reporte</span>
          </DialogTitle>
          <DialogDescription>
            Información completa del reporte enviado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Estado:</span>
            <Badge variant={getStatusBadgeColor(report.status)} className="flex items-center space-x-1">
              {getStatusIcon(report.status)}
              <span className="capitalize">{report.status}</span>
            </Badge>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium">Tipo de reporte:</span>
              <p className="text-sm text-muted-foreground capitalize">{report.type}</p>
            </div>

            <div>
              <span className="text-sm font-medium">Razón:</span>
              <p className="text-sm text-muted-foreground">{report.reason}</p>
            </div>

            <div>
              <span className="text-sm font-medium">Descripción:</span>
              <p className="text-sm text-muted-foreground">{report.description}</p>
            </div>

            <div>
              <span className="text-sm font-medium">Reportado por:</span>
              <p className="text-sm text-muted-foreground">{report.reporter}</p>
            </div>

            {report.reportedUserName && (
              <div>
                <span className="text-sm font-medium">Usuario reportado:</span>
                <p className="text-sm text-muted-foreground">{report.reportedUserName}</p>
              </div>
            )}

            {report.reportedContent && (
              <div>
                <span className="text-sm font-medium">Contenido reportado:</span>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">{report.reportedContent}</p>
                </div>
              </div>
            )}

            <div>
              <span className="text-sm font-medium">Fecha:</span>
              <p className="text-sm text-muted-foreground">{report.date}</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cerrar
          </Button>
          {report.status === 'pending' && onReview && (
            <Button onClick={handleReview} className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              Marcar como Revisado
            </Button>
          )}
          {onDelete && (
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
