import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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
import JobRatingItem from '@/components/experto/JobRatingItem';
import { getStatusColor, getStatusText } from '@/utils/statusHelpers';
import { ExpertoJobOffer, ExpertoActiveJob, JobRating } from '@/types/job';
import { Trabajo } from '@/types';

const ExpertoDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // 1. Cargar trabajos recomendados según especialidades del experto
  const { data: rawJobOffers, isLoading: loadingOffers } = useQuery({
    queryKey: ['job-offers', user?.especialidades, user?.region],
    queryFn: () => trabajoService.search({
      categoryId: user?.especialidades,
      region: user?.region
    }),
    enabled: !!user?.especialidades,
  });

  // 2. Cargar mis trabajos activos
  const { data: rawMyJobs, isLoading: loadingMyJobs } = useQuery({
    queryKey: ['my-active-jobs', user?.id],
    queryFn: () => trabajoService.getMisTrabajos({ 
      expertoId: user?.id || '',
      status: 'in-progress' 
    }),
    enabled: !!user?.id,
  });

  // 3. Cargar mis calificaciones
  const { data: rawReviews, isLoading: loadingReviews } = useQuery({
    queryKey: ['my-reviews', user?.id],
    queryFn: () => expertoService.getReviews(user?.id || ''),
    enabled: !!user?.id,
  });

  // Mapper de Trabajo (BD) a ExpertoJobOffer (UI)
  const jobOffers: ExpertoJobOffer[] = React.useMemo(() => {
    if (!rawJobOffers) return [];
    return rawJobOffers.map((t: Trabajo) => ({
      id: Number(t.id) || 0,
      title: t.titulo,
      client: `${t.cliente?.nombres} ${t.cliente?.apellidos}`.trim() || 'Cliente Anónimo',
      location: `${t.comuna}, ${t.region}`,
      budget: new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(t.presupuesto),
      date: new Date(t.fechaCreacion).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'new'
    }));
  }, [rawJobOffers]);

  // Mapper para Trabajos Activos
  const myJobs: ExpertoActiveJob[] = React.useMemo(() => {
    if (!rawMyJobs) return [];
    return rawMyJobs.map((t: Trabajo) => ({
      id: Number(t.id) || 0,
      title: t.titulo,
      client: `${t.cliente?.nombres} ${t.cliente?.apellidos}`.trim() || 'Cliente Anónimo',
      status: 'in-progress',
      date: new Date(t.fechaCreacion).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }),
      payment: new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(t.presupuesto),
      clientId: t.clientId
    }));
  }, [rawMyJobs]);

  // Mapper para Calificaciones
  const jobRatings: JobRating[] = React.useMemo(() => {
    if (!rawReviews) return [];
    return rawReviews.map((r: any) => ({
      id: r.id,
      jobTitle: r.jobTitle || 'Trabajo Finalizado',
      client: r.clientName || 'Usuario',
      rating: r.rating,
      comment: r.comment,
      date: new Date(r.createdAt).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
    }));
  }, [rawReviews]);

  const handleApplyToJob = (jobId: number) => {
    console.log(`Aplicar a trabajo ${jobId}`);
    // Aquí iría la lógica de postulación
  };

  const handleContactClient = (client: string) => {
    console.log(`Contactar cliente ${client}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
          value={myJobs.filter(j => j.status === 'in-progress').length.toString()}
          icon={Briefcase}
          iconColor="text-blue-500"
        />
        <StatCard 
          title="Trabajos Completados"
          value="47"
          icon={Star}
          iconColor="text-green-500"
        />
        <StatCard 
          title="Calificación"
          value={user?.calificacion?.toString() || "4.9"}
          icon={Star}
          iconColor="text-yellow-500"
        />
        <StatCard 
          title="Ingresos del Mes"
          value="$180K"
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

      {/* Job Ratings */}
      <Card>
        <CardHeader>
          <CardTitle>Calificaciones de Trabajos Realizados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobRatings.length > 0 ? (
              jobRatings.map((rating) => (
                <JobRatingItem key={rating.id} rating={rating} />
              ))
            ) : (
              <p className="text-muted-foreground text-sm">Aún no hay calificaciones de trabajos.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpertoDashboard;
