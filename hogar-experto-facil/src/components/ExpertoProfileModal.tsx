
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, User, ExternalLink } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import ReportButton from '@/components/common/ReportButton';

interface Review {
  user: string;
  rating: number;
  comment: string;
}

interface CompletedJob {
  title: string;
  description: string;
  image?: string;
}

interface ExpertoProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  experto: {
    id: string;
    nombres: string;
    apellidos: string;
    avatar?: string;
    especialidades: string[];
    calificacion: number;
    reviewCount: number;
    comuna: string;
    region: string;
    experience: string;
    hourlyRate?: number;
    isVerified?: boolean;
    reviews: Review[];
    completedJobs: CompletedJob[];
    telefono?: string;
    direccion?: string;
  } | null;
}

const ExpertoProfileModal: React.FC<ExpertoProfileModalProps> = ({
  isOpen,
  onClose,
  experto,
}) => {
  const navigate = useNavigate();

  if (!isOpen || !experto) return null;

  const handleVerPerfilCompleto = () => {
    onClose();
    navigate(`/experto/${experto.id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col">
        <DialogHeader className="text-center">
          <div className="flex flex-col items-center mb-4">
            <div className="flex justify-between items-start w-full mb-4">
              <div className="flex flex-col items-center flex-1">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={experto.avatar} />
                  <AvatarFallback className="bg-primary text-white text-4xl">
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <ReportButton
                reportType="user"
                reportedUserId={experto.id}
                reportedUserName={`${experto.nombres} ${experto.apellidos}`}
                variant="ghost"
                size="sm"
              />
            </div>
            <DialogTitle className="text-3xl font-bold flex items-center gap-2">
              {`${experto.nombres} ${experto.apellidos}`}
              {experto.isVerified && (
                <Badge variant="secondary" className="text-sm bg-green-100 text-green-800">
                  Verificado
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription className="text-lg text-muted-foreground">
              {`${experto.comuna}, ${experto.region}`}
            </DialogDescription>
            <div className="flex items-center space-x-1 mt-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-lg">{experto.calificacion}</span>
              <span className="text-md text-muted-foreground">({experto.reviewCount} reseñas)</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 gap-2"
              onClick={handleVerPerfilCompleto}
            >
              <ExternalLink className="w-4 h-4" />
              Ver perfil completo y portafolio
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-grow pr-4 -mr-4">
          <div className="grid gap-6 py-4">
            {/* Especialidades */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Especialidades</h3>
              <div className="flex flex-wrap gap-2">
                {experto.especialidades.map((specialty) => (
                  <Badge key={specialty} variant="outline" className="text-sm">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-lg mb-2">Información de Contacto y Ubicación</h3>
              {experto.telefono && (
                <p className="text-muted-foreground">
                  <span className="font-medium">Teléfono:</span> {experto.telefono}
                </p>
              )}
              {experto.direccion && (
                <p className="text-muted-foreground">
                  <span className="font-medium">Dirección:</span> {experto.direccion}
                </p>
              )}
              <p className="text-muted-foreground">
                <span className="font-medium">Comuna:</span> {experto.comuna}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Región:</span> {experto.region}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-lg mb-2">Información Adicional</h3>
              <p className="text-muted-foreground">
                <span className="font-medium">Experiencia:</span> {experto.experience}
              </p>
              {experto.hourlyRate && (
                <p className="text-muted-foreground">
                  <span className="font-medium">Tarifa por hora:</span> ${experto.hourlyRate.toLocaleString()}/hora
                </p>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-lg mb-2">Trabajos Realizados ({(experto.completedJobs?.length || 0)})</h3>
              {(experto.completedJobs?.length || 0) > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {experto.completedJobs.map((job, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50 relative">
                      <div className="absolute top-2 right-2">
                        <ReportButton
                          reportType="post"
                          reportedUserId={experto.id}
                          reportedUserName={`${experto.nombres} ${experto.apellidos}`}
                          reportedContent={`${job.title}: ${job.description}`}
                          variant="ghost"
                          size="sm"
                        />
                      </div>
                      {job.image && (
                        <img src={job.image} alt={job.title} className="w-full h-32 object-cover rounded-md mb-3" />
                      )}
                      <h4 className="font-medium mb-1">{job.title}</h4>
                      <p className="text-sm text-muted-foreground">{job.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Este experto aún no ha registrado trabajos completados.</p>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-lg mb-2">Reseñas ({(experto.reviews?.length || 0)})</h3>
              {(experto.reviews?.length || 0) > 0 ? (
                <div className="space-y-4">
                  {experto.reviews.map((review, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50 relative">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="font-medium mr-2">{review.user}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <ReportButton
                          reportType="review"
                          reportedUserId={experto.id}
                          reportedUserName={`${experto.nombres} ${experto.apellidos}`}
                          reportedContent={review.comment}
                          variant="ghost"
                          size="sm"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Aún no hay reseñas para este experto.</p>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ExpertoProfileModal;
