import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, AlertTriangle, BarChart3, Shield, ClipboardList } from 'lucide-react';
import { toast } from "sonner";
import { UserDetailsModal } from '@/components/admin/UserDetailsModal';
import ReportManagement from '@/components/admin/ReportManagement';
import { useReports } from '@/hooks/useReports';
import { adminService, AdminExpertoItem, AdminStats, AuditLogItem } from '@/services/api/adminService';
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
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'audit'>('overview');
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [auditTotal, setAuditTotal] = useState(0);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);

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

  const loadAuditLogs = () => {
    setIsLoadingAudit(true);
    adminService.getAuditLogs(50, 0)
      .then(res => { setAuditLogs(res.logs); setAuditTotal(res.total); })
      .catch(() => toast.error('Error al cargar el registro de auditoría'))
      .finally(() => setIsLoadingAudit(false));
  };

  const ACTION_LABELS: Record<string, string> = {
    UPDATE_EXPERTO_STATUS: 'Cambio de estado de experto',
  };

  const formatDetails = (log: AuditLogItem): string => {
    if (log.action === 'UPDATE_EXPERTO_STATUS' && log.details) {
      const d = log.details as { from?: string; to?: string; expertNombres?: string; expertApellidos?: string };
      return `${d.expertNombres ?? ''} ${d.expertApellidos ?? ''}: ${d.from} → ${d.to}`;
    }
    return JSON.stringify(log.details ?? {});
  };

  if (activeTab === 'audit') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Registro de Auditoría</h1>
            <p className="text-muted-foreground">Historial de acciones realizadas por administradores</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadAuditLogs} disabled={isLoadingAudit}>
              {isLoadingAudit ? 'Cargando…' : 'Actualizar'}
            </Button>
            <Button variant="outline" onClick={() => setActiveTab('overview')}>
              Volver al Panel Principal
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoadingAudit ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Cargando registros…</p>
            ) : auditLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No hay registros de auditoría todavía.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Admin</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Acción</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Detalle</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">IP</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map(log => (
                      <tr key={log.id} className="border-b hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 font-medium">{log.adminName}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {ACTION_LABELS[log.action] ?? log.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                          {formatDetails(log)}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{log.ip ?? '—'}</td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-muted-foreground px-4 py-3">
                  Mostrando {auditLogs.length} de {auditTotal} registros
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

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
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setActiveTab('audit'); loadAuditLogs(); }}>
            <ClipboardList className="w-4 h-4 mr-1" />
            Auditoría
          </Button>
          <Button onClick={() => setActiveTab('reports')}>
            Ver Reportes ({pendingReportsCount})
          </Button>
        </div>
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
