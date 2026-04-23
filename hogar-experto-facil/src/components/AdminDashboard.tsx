import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, AlertTriangle, BarChart3, Shield } from 'lucide-react';
import { toast } from "sonner";
import { UserDetailsModal } from '@/components/admin/UserDetailsModal';
import ReportManagement from '@/components/admin/ReportManagement';
import { useReports } from '@/hooks/useReports';
import { adminService, AdminExpertoItem, AdminStats } from '@/services/api/adminService';
import {
  EXPERTO_STATUS,
  EXPERTO_STATUS_CONFIG,
  ExpertoVerificationStatus,
} from '@/constants';

// ─── Tipo del listado de expertos ─────────────────────────────────────────────
interface PendingExpertoRow {
  id: string;
  name: string;
  type: 'experto';
  email: string;
  specialty: string | null;
  date: string;
  telefono?: string;
  verificationStatus: ExpertoVerificationStatus;
}

const toRow = (item: AdminExpertoItem): PendingExpertoRow => ({
  id: item.id,
  name: `${item.nombres} ${item.apellidos}`,
  type: 'experto',
  email: item.email,
  specialty: item.especialidades[0] ?? null,
  date: new Date(item.createdAt).toLocaleDateString('es-CL'),
  telefono: item.telefono,
  verificationStatus: item.verificationStatus,
});

const StatusBadge = ({ status }: { status: ExpertoVerificationStatus }) => {
  const cfg = EXPERTO_STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.colorClass}`}>
      {cfg.label}
    </span>
  );
};

// ─── Componente ───────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [expertos, setExpertos] = useState<PendingExpertoRow[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExperto, setSelectedExperto] = useState<PendingExpertoRow | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'reports'>('overview');

  const { getPendingReports } = useReports();
  const pendingReportsCount = getPendingReports().length;

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      adminService.getExpertos().then(items => setExpertos(items.map(toRow))),
      adminService.getStats().then(setStats),
    ]).finally(() => setIsLoading(false));
  }, []);

  const handleStatusChange = async (id: string, status: ExpertoVerificationStatus) => {
    await adminService.updateExpertoStatus(id, status);

    const cfg = EXPERTO_STATUS_CONFIG[status];
    const expert = expertos.find(e => e.id === id);

    setExpertos(prev =>
      prev.map(e => e.id === id ? { ...e, verificationStatus: status } : e)
    );

    if (status === EXPERTO_STATUS.ACTIVO) {
      toast.success(`${expert?.name} ha sido activado.`);
    } else if (status === EXPERTO_STATUS.ANULADO) {
      toast.error(`${expert?.name} ha sido anulado.`);
    } else {
      toast(`${expert?.name} marcado como ${cfg.label}.`);
    }

    // Refrescar stats tras cambio de estado
    adminService.getStats().then(setStats).catch(() => null);
  };

  const pendingCount = expertos.filter(
    e => e.verificationStatus === EXPERTO_STATUS.PENDIENTE
  ).length;

  if (activeTab === 'reports') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Gestión de Reportes</h1>
            <p className="text-muted-foreground">Modera reportes de usuarios y contenido inapropiado</p>
          </div>
          <Button variant="outline" onClick={() => setActiveTab('overview')}>
            Volver al Panel Principal
          </Button>
        </div>
        <ReportManagement />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Panel de Administración</h1>
          <p className="text-muted-foreground">Gestiona usuarios, moderación y estadísticas de la plataforma</p>
        </div>
        <Button onClick={() => setActiveTab('reports')}>
          Ver Reportes ({pendingReportsCount})
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Usuarios Totales</p>
                <p className="text-2xl font-bold text-foreground">
                  {isLoading ? '…' : (stats?.totalUsers.toLocaleString('es-CL') ?? '—')}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expertos Activos</p>
                <p className="text-2xl font-bold text-foreground">
                  {isLoading ? '…' : (stats?.activeExperts.toLocaleString('es-CL') ?? '—')}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reportes Pendientes</p>
                <p className="text-2xl font-bold text-foreground">{pendingReportsCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Trabajos del Mes</p>
                <p className="text-2xl font-bold text-foreground">
                  {isLoading ? '…' : (stats?.jobsThisMonth.toLocaleString('es-CL') ?? '—')}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          className="hover:shadow-md transition-shadow cursor-pointer border-secondary/20 hover:border-secondary/40"
          onClick={() => setActiveTab('reports')}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Moderación</h3>
                <p className="text-sm text-muted-foreground">Gestionar reportes y contenido</p>
                {pendingReportsCount > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                    {pendingReportsCount} pendientes
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer border-accent/20 hover:border-accent/40">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Estadísticas</h3>
                <p className="text-sm text-muted-foreground">Ver métricas detalladas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verificación de Expertos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Verificación de Expertos</CardTitle>
          <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {isLoading ? '…' : `${pendingCount} pendientes`}
          </span>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Cargando expertos…</p>
          ) : expertos.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No hay expertos registrados.</p>
          ) : (
            <div className="space-y-3">
              {expertos.map((experto) => (
                <div
                  key={experto.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-muted/20 transition-colors"
                >
                  <div className="flex-1 mb-2 sm:mb-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium text-foreground">{experto.name}</h4>
                      <StatusBadge status={experto.verificationStatus} />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mt-1">
                      <span className="text-sm text-muted-foreground">{experto.email}</span>
                      {experto.specialty && (
                        <span className="text-sm text-muted-foreground">{experto.specialty}</span>
                      )}
                      <span className="text-sm text-muted-foreground">{experto.date}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setSelectedExperto(experto); setIsModalOpen(true); }}
                    >
                      Ver detalles
                    </Button>
                    {experto.verificationStatus !== EXPERTO_STATUS.ACTIVO && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleStatusChange(experto.id, EXPERTO_STATUS.ACTIVO)}
                      >
                        Activar
                      </Button>
                    )}
                    {experto.verificationStatus !== EXPERTO_STATUS.ANULADO && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStatusChange(experto.id, EXPERTO_STATUS.ANULADO)}
                      >
                        Anular
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <UserDetailsModal
        user={selectedExperto}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default AdminDashboard;
