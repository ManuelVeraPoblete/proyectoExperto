
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Flag } from 'lucide-react';
import ReportModal from './ReportModal';
import { ReportFormData } from '@/types/report';
import { useAuth } from '@/contexts/AuthContext';
import { reporteService } from '@/services/api/reporteService';
import { useToast } from '@/hooks/use-toast';

interface ReportButtonProps {
  reportType: 'review' | 'user' | 'post' | 'language';
  reportedUserId?: string;
  reportedUserName?: string;
  reportedContent?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showText?: boolean;
}

const ReportButton: React.FC<ReportButtonProps> = ({
  reportType,
  reportedUserId,
  reportedUserName,
  reportedContent,
  variant = 'ghost',
  size = 'sm',
  className = '',
  showText = false
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const reportMutation = useMutation({
    mutationFn: (data: ReportFormData) =>
      reporteService.create({
        type: data.type,
        reason: data.reason,
        description: data.description,
        reportedUserId: data.reportedUserId,
        reportedContent: data.reportedContent,
      }),
    onSuccess: () => {
      toast({ title: 'Reporte enviado', description: 'Tu reporte fue recibido y será revisado.' });
      setIsModalOpen(false);
    },
    onError: () => {
      toast({ title: 'Error', description: 'No se pudo enviar el reporte.', variant: 'destructive' });
    },
  });

  const handleReport = (data: ReportFormData) => {
    reportMutation.mutate(data);
  };

  if (!isAuthenticated) {
    return null; // Solo usuarios autenticados pueden reportar
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsModalOpen(true)}
        className={`text-red-600 hover:text-red-700 hover:bg-red-50 ${className}`}
      >
        <Flag className="w-4 h-4" />
        {showText && <span className="ml-1">Reportar</span>}
      </Button>

      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reportType={reportType}
        reportedUserId={reportedUserId}
        reportedUserName={reportedUserName}
        reportedContent={reportedContent}
        onSubmit={handleReport}
      />
    </>
  );
};

export default ReportButton;
