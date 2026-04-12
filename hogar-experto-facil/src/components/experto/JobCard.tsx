
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, User, DollarSign } from 'lucide-react';
import ReportButton from '@/components/common/ReportButton';

interface JobCardProps {
  job: {
    id: string;
    titulo: string;
    descripcion: string;
    cliente: {
      id: string;
      nombres: string;
      apellidos: string;
      averageRating?: number;
      jobCount?: number;
    };
    region: string;
    provincia: string;
    comuna: string;
    presupuesto: number;
    fechaCreacion: string;
    categoria: string;
    estado?: string;
  };
  onContact?: (clientId: string) => void;
  onContactClient?: (clientId: string) => void;
  onOpenJobDetails?: (job: any) => void;
  unreadMessagesCount?: number;
}

const JobCard: React.FC<JobCardProps> = ({ job, onContact, onContactClient, onOpenJobDetails, unreadMessagesCount }) => {
  const handleContact = onContactClient || onContact;
  
  // Extraer los datos del cliente de la estructura aplanada de la API
  const clientName = (job as any).cliente_nombres || job.cliente?.nombres || job.cliente?.nombre || 'Cliente';
  const clientLastName = (job as any).cliente_apellidos || job.cliente?.apellidos || job.cliente?.apellido || '';
  const clientId = job.clientId || job.cliente?.id;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground mb-2">{job.titulo}</h3>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{job.descripcion}</p>
          </div>
          <ReportButton
            reportType="user"
            reportedUserId={clientId || ''}
            reportedUserName={`${clientName} ${clientLastName}`}
            variant="ghost"
            size="sm"
          />
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="w-4 h-4 mr-2" />
            <span>{clientName} {clientLastName}</span>
            {(job as any).cliente_rating && (
              <span className="ml-2">
                ⭐ {(job as any).cliente_rating}
              </span>
            )}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{job.region}, {job.provincia}, {job.comuna}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <DollarSign className="w-4 h-4 mr-2" />
            <span className="font-medium text-green-600">
              {job.presupuesto && job.presupuesto > 0 
                ? `$${Number(job.presupuesto).toLocaleString("es-CL", { maximumFractionDigits: 0 })}` 
                : 'A convenir'}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-2" />
            <span>{job.fechaCreacion ? new Date(job.fechaCreacion).toLocaleDateString() : 'Fecha no disponible'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="secondary">{job.categoria}</Badge>
            <Badge variant="outline">{job.estado || 'activo'}</Badge>
          </div>
          
          <div className="flex gap-2">
            {handleContact && job.cliente?.id && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleContact(job.cliente!.id)}
              >
                Contactar {unreadMessagesCount ? `(${unreadMessagesCount})` : ''}
              </Button>
            )}
            {onOpenJobDetails && (
              <Button
                size="sm"
                onClick={() => onOpenJobDetails(job)}
              >
                Ver Detalles
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
