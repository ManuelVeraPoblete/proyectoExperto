
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Flag } from 'lucide-react';
import ReportModal from './ReportModal';
import { ReportFormData } from '@/types/report';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user, isAuthenticated } = useAuth();

  const handleReport = (data: ReportFormData) => {
    // Aquí normalmente enviarías los datos al backend
    console.log('Reporte enviado:', {
      ...data,
      reporterId: user?.id,
      reporter: `${user?.nombres} ${user?.apellidos}`,
      timestamp: new Date().toISOString()
    });
    
    // Simular envío al sistema de administración
    // En una implementación real, esto se enviaría a una API
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
