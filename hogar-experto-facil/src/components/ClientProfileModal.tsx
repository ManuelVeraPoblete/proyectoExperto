
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Star, Briefcase } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import ReportButton from '@/components/common/ReportButton';

interface ClientProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: {
    id: string;
    nombres: string;
    apellidos: string;
    email: string;
    telefono?: string;
    direccion?: string;
    region?: string;
    provincia?: string;
    comuna?: string;
    avatar?: string;
    jobCount: number;
    averageRating: number;
    reviewsGiven: {
      experto: string;
      rating: number;
      comment: string;
    }[];
  } | null;
}

const ClientProfileModal: React.FC<ClientProfileModalProps> = ({
  isOpen,
  onClose,
  client,
}) => {
  if (!isOpen || !client) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col">
        <DialogHeader className="text-center">
          <div className="flex flex-col items-center mb-4">
            <div className="flex justify-between items-start w-full mb-4">
              <div className="flex flex-col items-center flex-1">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={client.avatar} />
                  <AvatarFallback className="bg-primary text-white text-4xl">
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <ReportButton
                reportType="user"
                reportedUserId={client.id}
                reportedUserName={`${client.nombres} ${client.apellidos}`}
                variant="ghost"
                size="sm"
              />
            </div>
            <DialogTitle className="text-3xl font-bold">
              {`${client.nombres} ${client.apellidos}`}
            </DialogTitle>
            <DialogDescription className="text-lg text-muted-foreground">
              {`${client.comuna}, ${client.region}`}
            </DialogDescription>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <Briefcase className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold text-lg">{client.jobCount}</span>
                <span className="text-md text-muted-foreground">trabajos publicados</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-lg">{client.averageRating}</span>
                <span className="text-md text-muted-foreground">calificación promedio</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-grow pr-4 -mr-4">
          <div className="grid gap-6 py-4">
            {/* Información de Contacto */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Información de Contacto</h3>
              <p className="text-muted-foreground">
                <span className="font-medium">Email:</span> {client.email}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Teléfono:</span> {client.telefono}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-lg mb-2">Ubicación</h3>
              <p className="text-muted-foreground">
                <span className="font-medium">Dirección:</span> {client.direccion}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Comuna:</span> {client.comuna}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Provincia:</span> {client.provincia}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Región:</span> {client.region}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-lg mb-2">Reseñas Dadas ({client.reviewsGiven.length})</h3>
              {client.reviewsGiven.length > 0 ? (
                <div className="space-y-4">
                  {client.reviewsGiven.map((review, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50 relative">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="font-medium mr-2">A Experto {review.experto}</span>
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
                          reportedUserId={client.id}
                          reportedUserName={`${client.nombres} ${client.apellidos}`}
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
                <p className="text-muted-foreground text-sm">Este cliente aún no ha dado reseñas.</p>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ClientProfileModal;
