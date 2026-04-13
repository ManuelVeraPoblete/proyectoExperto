import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { trabajoService } from '@/services/api/trabajoService';
import { expertoService } from '@/services/api/expertoService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Star, TrendingUp, Calendar, MessageSquare, Loader2 } from 'lucide-react';
import StatCard from '@/components/shared/StatCard';
import ActionCard from '@/components/shared/ActionCard';
import JobOfferItem from '@/components/experto/JobOfferItem';
import MyJobItem from '@/components/experto/MyJobItem';
import { getStatusColor, getStatusText } from '@/utils/statusHelpers';
import { ExpertoJobOffer, ExpertoActiveJob } from '@/types/job';
import { Trabajo } from '@/types';
import { useToast } from '@/hooks/use-toast';

const ExpertoDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Trabajos recomendados según especialidades del experto
  const { data: rawJobOffers, isLoading: loadingOffers } = useQuery({
    queryKey: ['job-offers', user?.especialidades, user?.region],
    queryFn: () => trabajoService.search({
      categoryId: user?.especialidades,
      region: user?.region,
    }),
    enabled: !!user?.id,
  });

  // Trabajos activos del experto
  const { data: rawMyJobs } = useQuery({
    queryKey: ['my-active-jobs', user?.id],
    queryFn: () => trabajoService.getMisTrabajos({
      expertoId: user?.id,
      estado: 'en_proceso',
    }),
    enabled: !!user?.id,
  });

  // Stats reales
  const { data: stats } = useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: () => expertoService.getStats(user!.id),
    enabled: !!user?.id,
  });

  const applyMutation = useMutation({
    mutationFn: (jobId: string) =>
      trabajoService.applyToJob(jobId, { mensaje: 'Estoy interesado en este trabajo.' }),
    onSuccess: () => {
      toast({ title: 'Postulación enviada', description: 'El cliente recibirá tu solicitud.' });
      queryClient.invalidateQueries({ queryKey: ['job-offers'] });
    },
    onError: (err: any) => {
      const msg = err?.message?.includes('409') ? 'Ya te postulaste a este trabajo.' : 'No se pudo enviar la postulación.';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    },
  });

  const jobOffers: ExpertoJobOffer[] = React.useMemo(() => {
    if (!rawJobOffers) return [];
    return rawJobOffers.map((t: Trabajo) => ({
      id: t.id as any,
      title: t.titulo,
      client: t.cliente_nombres
        ? `${t.cliente_nombres} ${t.cliente_apellidos ?? ''}`.trim()
        : 'Cliente',
      location: `${t.comuna}, ${t.region}`,
      budget: new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(Number(t.presupuesto) || 0),
      date: new Date(t.createdAt ?? t.fechaCreacion).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'new',
    }));
  }, [rawJobOffers]);

  const myJobs: ExpertoActiveJob[] = React.useMemo(() => {
    if (!rawMyJobs) return [];
    return rawMyJobs.map((t: Trabajo) => ({
      id: t.id as any,
      title: t.titulo,
      client: t.cliente_nombres
        ? `${t.cliente_nombres} ${t.cliente_apellidos ?? ''}`.trim()
        : 'Cliente',
      status: 'in-progress',
      date: new Date(t.createdAt ?? t.fechaCreacion).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }),
      payment: new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(Number(t.presupuesto) || 0),
      clientId: t.clientId,
    }));
  }, [rawMyJobs]);

  const handleApplyToJob = (jobId: any) => {
    applyMutation.mutate(String(jobId));
  };

  const handleContactClient = (_client: string) => {
    navigate('/experto/mensajes');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Panel de Experto</h1>
        <p className="text-muted-foreground">
          {user ? `Hola ${user.nombres}, gestiona tus trabajos y encuentra nuevas oportunidades` : 'Gestiona tus trabajos y encuentra nuevas oportunidades'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Trabajos Activos"
          value={stats ? String(stats.activeJobs) : String(myJobs.length)}
          icon={Briefcase}
          iconColor="text-blue-500"
        />
        <StatCard
          title="Trabajos Completados"
          value={stats ? String(stats.completedJobs) : '—'}
          icon={Star}
          iconColor="text-green-500"
        />
        <StatCard
          title="Calificación"
          value={stats?.avgCalificacion != null ? String(stats.avgCalificacion) : (user?.calificacion?.toString() ?? '—')}
          icon={Star}
          iconColor="text-yellow-500"
        />
        <StatCard
          title="Total Trabajos"
          value={stats ? String(stats.totalJobs) : '—'}
          icon={TrendingUp}
          iconColor="text-purple-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ActionCard
          title="Buscar Trabajos"
          description="Explora nuevas oportunidades laborales"
          icon={Briefcase}
          iconBgColor="bg-primary/10"
          iconColor="text-primary"
          onClick={() => navigate('/experto/buscar-trabajos')}
        />
        <ActionCard
          title="Mis Trabajos"
          description="Gestiona tus proyectos activos y completados"
          icon={Calendar}
          iconBgColor="bg-secondary/10"
          iconColor="text-secondary"
          onClick={() => navigate('/experto/mis-trabajos')}
        />
        <ActionCard
          title="Mensajes Directos"
          description="Revisa tus conversaciones con clientes"
          icon={MessageSquare}
          iconBgColor="bg-blue-500/10"
          iconColor="text-blue-500"
          onClick={() => navigate('/experto/mensajes')}
        />
      </div>

      {/* Job Offers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ofertas de Trabajo Recomendadas</CardTitle>
          <Button size="sm" onClick={() => navigate('/experto/buscar-trabajos')}>Ver Todas</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loadingOffers ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p>Buscando trabajos que coincidan con tu perfil...</p>
              </div>
            ) : jobOffers.length > 0 ? (
              jobOffers.map((offer) => (
                <JobOfferItem
                  key={offer.id}
                  offer={offer}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                  onApply={handleApplyToJob}
                />
              ))
            ) : (
              <div className="text-center py-8 border rounded-lg border-dashed">
                <p className="text-muted-foreground">No hay ofertas nuevas para tus especialidades en este momento.</p>
                <Button variant="link" onClick={() => navigate('/experto/buscar-trabajos')}>
                  Explorar otros trabajos
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* My Active Jobs */}
      {myJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mis Trabajos Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myJobs.map((job) => (
                <MyJobItem
                  key={job.id}
                  job={job}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                  onContact={handleContactClient}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExpertoDashboard;
