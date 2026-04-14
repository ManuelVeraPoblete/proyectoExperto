import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Loader2, CheckCircle, XCircle, UserSearch } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { applicationService, ApiApplication } from '@/services/api/applicationService';
import RatingDisplay from '@/components/common/RatingDisplay';
import UserAvatar from '@/components/common/UserAvatar';
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
  const [rejectedIds, setRejectedIds] = useState<Set<number>>(new Set());
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

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
      setRejectedIds(new Set());
      onClose();
    },
    onError: () => {
      toast({ title: 'Error', description: 'No se pudo asignar el experto.', variant: 'destructive' });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (applicationId: number) => applicationService.reject(applicationId),
    onSuccess: (_, applicationId) => {
      setRejectedIds(prev => new Set(prev).add(applicationId));
      if (selectedApplicationId === applicationId) setSelectedApplicationId(null);
      toast({ title: 'Postulante rechazado', description: 'Se notificó al experto.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'No se pudo rechazar al postulante.', variant: 'destructive' });
    },
  });

  const handleAssign = () => {
    if (selectedApplicationId != null) {
      acceptMutation.mutate(selectedApplicationId);
    }
  };

  const handleReject = (e: React.MouseEvent, applicationId: number) => {
    e.stopPropagation();
    rejectMutation.mutate(applicationId);
  };

  const visibleApps = applications.filter(a => !rejectedIds.has(a.id));
  const isBusy = acceptMutation.isPending || rejectMutation.isPending;

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
          ) : visibleApps.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {applications.length === 0
                ? 'No hay postulantes para este trabajo aún.'
                : 'Todos los postulantes han sido rechazados.'}
            </p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Selecciona un experto de los {visibleApps.length} postulante{visibleApps.length !== 1 ? 's' : ''}:
              </p>

              {visibleApps.map((app: ApiApplication) => {
                const experto = app.Experto;
                const profile = experto?.ExpertoProfile;
                const nombre = experto ? `${experto.nombres} ${experto.apellidos}` : 'Experto';
                const rating = profile?.avg_calificacion ?? 0;
                const isSelected = selectedApplicationId === app.id;

                return (
                  <Card
                    key={app.id}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-accent/50'
                    }`}
                    onClick={() => setSelectedApplicationId(app.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <UserAvatar
                          src={profile?.avatar_url}
                          name={nombre}
                          size="md"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="font-semibold text-foreground">{nombre}</h3>
                            <div className="flex items-center gap-2 shrink-0">
                              {profile?.comuna && (
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <MapPin className="w-3 h-3" />
                                  {profile.comuna}
                                </span>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/experto/${app.expertId}`, {
                                    state: { returnAssignJobId: jobId },
                                  });
                                }}
                              >
                                <UserSearch className="w-4 h-4 mr-1" />
                                Ver Perfil
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                disabled={isBusy}
                                onClick={(e) => handleReject(e, app.id)}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Rechazar
                              </Button>
                            </div>
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
                            <p className="text-sm font-medium text-primary mt-1">
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

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isBusy}>
            Cancelar
          </Button>
          <Button
            onClick={handleAssign}
            disabled={selectedApplicationId == null || isBusy}
          >
            {acceptMutation.isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" />Asignando...</>
            ) : (
              <><CheckCircle className="w-4 h-4 mr-2" />Asignar Experto</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignMaestroModal;
