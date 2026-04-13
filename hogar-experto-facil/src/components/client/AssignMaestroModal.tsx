import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, User, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService, ApiApplication } from '@/services/api/applicationService';
import RatingDisplay from '@/components/common/RatingDisplay';
import SpecialtyBadges from '@/components/common/SpecialtyBadges';
import { useToast } from '@/hooks/use-toast';

interface AssignMaestroModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  onAssign: (maestroId: string) => void;
}

const AssignMaestroModal: React.FC<AssignMaestroModalProps> = ({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  onAssign,
}) => {
  const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['applications', jobId],
    queryFn: () => applicationService.getForJob(jobId),
    enabled: isOpen && !!jobId,
  });

  const acceptMutation = useMutation({
    mutationFn: (applicationId: number) => applicationService.accept(applicationId),
    onSuccess: (_, applicationId) => {
      const app = applications.find(a => a.id === applicationId);
      if (app) onAssign(app.expertId);
      queryClient.invalidateQueries({ queryKey: ['client-jobs'] });
      toast({ title: 'Experto asignado', description: 'El trabajo pasó a estado "En Proceso".' });
      setSelectedApplicationId(null);
      onClose();
    },
    onError: () => {
      toast({ title: 'Error', description: 'No se pudo asignar el experto.', variant: 'destructive' });
    },
  });

  const handleAssign = () => {
    if (selectedApplicationId != null) {
      acceptMutation.mutate(selectedApplicationId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Asignar Experto</DialogTitle>
          <p className="text-sm text-muted-foreground">Trabajo: {jobTitle}</p>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Cargando postulantes...
            </div>
          ) : applications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No hay postulantes para este trabajo aún.
            </p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Selecciona un experto de los {applications.length} postulante{applications.length !== 1 ? 's' : ''}:
              </p>
              {applications.map((app: ApiApplication) => {
                const experto = app.Experto;
                const profile = experto?.ExpertoProfile;
                const nombre = experto ? `${experto.nombres} ${experto.apellidos}` : 'Experto';
                const rating = profile?.avg_calificacion ?? 0;

                return (
                  <Card
                    key={app.id}
                    className={`cursor-pointer transition-colors ${
                      selectedApplicationId === app.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-accent/50'
                    }`}
                    onClick={() => setSelectedApplicationId(app.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                          <User className="w-6 h-6 text-gray-600" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="font-semibold text-foreground">{nombre}</h3>
                            {profile?.comuna && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                {profile.comuna}
                              </div>
                            )}
                          </div>

                          {rating > 0 && (
                            <RatingDisplay rating={rating} showCount={false} size="sm" />
                          )}

                          {app.mensaje && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              "{app.mensaje}"
                            </p>
                          )}

                          {app.presupuesto_ofrecido && (
                            <p className="text-sm font-medium text-foreground mt-1">
                              Presupuesto: ${Number(app.presupuesto_ofrecido).toLocaleString('es-CL')}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={acceptMutation.isPending}>
            Cancelar
          </Button>
          <Button
            onClick={handleAssign}
            disabled={selectedApplicationId == null || acceptMutation.isPending}
          >
            {acceptMutation.isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" />Asignando...</>
            ) : (
              'Asignar Experto'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignMaestroModal;
