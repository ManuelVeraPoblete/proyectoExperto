
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, CheckCircle2, XCircle, Send } from 'lucide-react';
import useMyJobs from '@/hooks/useMyJobs';
import { useMyApplications } from '@/hooks/useMyApplications';
import MyJobItem from '@/components/experto/MyJobItem';
import CompletedJobItem from '@/components/experto/CompletedJobItem';
import AddPortfolioModal from '@/components/experto/AddPortfolioModal';
import { portfolioService, CreatePortfolioData } from '@/services/api/portfolioService';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants';

const APPLICATION_STATUS = {
  pendiente: { label: 'En revisión', icon: Clock, className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  aceptado:  { label: 'Aceptado',    icon: CheckCircle2, className: 'bg-green-100 text-green-800 border-green-200' },
  rechazado: { label: 'No seleccionado', icon: XCircle, className: 'bg-red-100 text-red-800 border-red-200' },
} as const;

const MisTrabajosExperto = () => {
  const navigate   = useNavigate();
  const { user }   = useAuth();
  const queryClient = useQueryClient();
  const { toast }  = useToast();

  const { activeJobs, completedJobs, getStatusColor, getStatusText } = useMyJobs();
  const { applications, pendingCount } = useMyApplications();

  const [isAddPhotosOpen, setIsAddPhotosOpen]   = useState(false);
  const [portfolioJobData, setPortfolioJobData] = useState<{ title: string } | null>(null);

  const handleContactClient = (clientId: string) => {
    navigate(`${ROUTES.EXPERTO_MENSAJES}?contactId=${clientId}`);
  };

  const handleAddPhotos = (_jobId: string, jobTitle: string) => {
    setPortfolioJobData({ title: jobTitle });
    setIsAddPhotosOpen(true);
  };

  const handlePortfolioAdd = async (data: CreatePortfolioData) => {
    try {
      await portfolioService.create(data);
      queryClient.invalidateQueries({ queryKey: ['portfolio-publico', user?.id] });
      toast({
        title: 'Fotos agregadas al portafolio',
        description: 'Las fotos ya son visibles en tu perfil público.',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudieron subir las fotos.',
        variant: 'destructive',
      });
    }
    setIsAddPhotosOpen(false);
    setPortfolioJobData(null);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-4">Mis Trabajos</h1>

      {/* ── Mis Postulaciones ── */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center gap-3 pb-3">
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            Mis Postulaciones
          </CardTitle>
          {pendingCount > 0 && (
            <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">
              {pendingCount} en revisión
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-muted-foreground text-sm">Aún no te has postulado a ningún trabajo.</p>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => {
                const cfg = APPLICATION_STATUS[app.estado];
                const Icon = cfg.icon;
                return (
                  <div key={app.id} className="flex items-start gap-4 p-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors">
                    {/* Estado icono */}
                    <div className={`p-2 rounded-full border ${cfg.className} shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <p className="font-semibold text-foreground leading-tight">
                          {app.Trabajo?.titulo ?? 'Trabajo'}
                        </p>
                        <Badge className={`border text-xs shrink-0 ${cfg.className}`}>
                          {cfg.label}
                        </Badge>
                      </div>
                      {app.Trabajo && (
                        <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {app.Trabajo.comuna}, {app.Trabajo.region}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 italic">
                        "{app.mensaje}"
                      </p>
                      <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground">
                        {app.presupuesto_ofrecido && (
                          <span className="font-medium text-primary">
                            Ofrecí: ${Number(app.presupuesto_ofrecido).toLocaleString('es-CL')}
                          </span>
                        )}
                        <span>
                          {new Date(app.createdAt).toLocaleDateString('es-CL', {
                            day: '2-digit', month: 'short', year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trabajos Activos */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Trabajos Activos</CardTitle>
        </CardHeader>
        <CardContent>
          {activeJobs.length > 0 ? (
            <div className="space-y-4">
              {activeJobs.map((job) => (
                <MyJobItem
                  key={job.id}
                  job={job}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                  onContact={handleContactClient}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No tienes trabajos activos en este momento.</p>
          )}
        </CardContent>
      </Card>

      {/* Trabajos Completados */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Trabajos Completados</CardTitle>
        </CardHeader>
        <CardContent>
          {completedJobs.length > 0 ? (
            <div className="space-y-4">
              {completedJobs.map((job) => (
                <CompletedJobItem
                  key={job.id}
                  job={job}
                  onViewClientProfile={(clientId) =>
                    navigate(`${ROUTES.EXPERTO_MENSAJES}?contactId=${clientId}`)
                  }
                  onAddPhotos={handleAddPhotos}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Aún no hay trabajos completados.</p>
          )}
        </CardContent>
      </Card>

      {/* Modal para agregar fotos al portafolio */}
      {portfolioJobData && (
        <AddPortfolioModal
          isOpen={isAddPhotosOpen}
          onClose={() => { setIsAddPhotosOpen(false); setPortfolioJobData(null); }}
          onAdd={handlePortfolioAdd}
          initialTitle={portfolioJobData.title}
        />
      )}
    </main>
  );
};

export default MisTrabajosExperto;
