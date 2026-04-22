import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, AlertTriangle, BarChart3, Shield, Eye } from 'lucide-react';
import { toast } from "sonner";
import { UserDetailsModal } from '@/components/admin/UserDetailsModal';
import ReportManagement from '@/components/admin/ReportManagement';
import { useReports } from '@/hooks/useReports';

// Mock data inicial
const initialPendingApprovals = [
  {
    id: 1,
    name: 'Pedro Martínez',
    type: 'experto',
    email: 'pedro@email.com',
    specialty: 'Electricidad',
    date: '24 Jun 2024',
    telefono: '+56912345678'
  },
  {
    id: 2,
    name: 'Sofia Morales',
    type: 'client',
    email: 'sofia@email.com',
    specialty: null,
    date: '23 Jun 2024',
    telefono: '+56987654321'
  },
  {
    id: 3,
    name: 'Luis García',
    type: 'experto',
    email: 'luis@email.com',
    specialty: 'Construcción',
    date: '22 Jun 2024',
    telefono: '+56911223344'
  }
];

const AdminDashboard = () => {
  const [pendingApprovals, setPendingApprovals] = useState(initialPendingApprovals);
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof initialPendingApprovals[0] | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'reports'>('overview');
  
  const { getPendingReports } = useReports();
  const pendingReportsCount = getPendingReports().length;

  const handleApprove = (id: number, name: string) => {
    setPendingApprovals(prev => prev.filter(approval => approval.id !== id));
    toast.success(`Usuario "${name}" ha sido aprobado.`);
  };

  const handleReject = (id: number, name: string) => {
    setPendingApprovals(prev => prev.filter(approval => approval.id !== id));
    toast.error(`Usuario "${name}" ha sido rechazado.`);
  };

  const handleView = (approval: typeof initialPendingApprovals[0]) => {
    setSelectedUser(approval);
    setIsUserDetailsModalOpen(true);
  };

  const getUserTypeText = (type: string) => {
    switch (type) {
      case 'experto': return 'Experto';
      case 'client': return 'Cliente';
      default: return 'Usuario';
    }
  };

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
                <p className="text-2xl font-bold text-foreground">1,247</p>
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
                <p className="text-2xl font-bold text-foreground">324</p>
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
                <p className="text-2xl font-bold text-foreground">189</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer border-primary/20 hover:border-primary/40">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <UserCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Aprobar Usuarios</h3>
                <p className="text-sm text-muted-foreground">Revisar solicitudes pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>

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

      {/* Pending Approvals */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Solicitudes Pendientes de Aprobación</CardTitle>
          <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {pendingApprovals.length} pendientes
          </span>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                <div className="flex-1 mb-2 sm:mb-0">
                  <div className="flex items-center space-x-3 flex-wrap">
                    <h4 className="font-medium text-foreground">{approval.name}</h4>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded mt-1 sm:mt-0">
                      {getUserTypeText(approval.type)}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1">
                    <span className="text-sm text-muted-foreground">{approval.email}</span>
                    {approval.specialty && (
                      <span className="text-sm text-muted-foreground">Especialidad: {approval.specialty}</span>
                    )}
                    <span className="text-sm text-muted-foreground">{approval.date}</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                  <Button size="sm" variant="outline" onClick={() => handleView(approval)} className="w-full sm:w-auto">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto" onClick={() => handleApprove(approval.id, approval.name)}>
                    Aprobar
                  </Button>
                  <Button size="sm" variant="destructive" className="w-full sm:w-auto" onClick={() => handleReject(approval.id, approval.name)}>
                    Rechazar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <UserDetailsModal
        user={selectedUser}
        isOpen={isUserDetailsModalOpen}
        onClose={() => setIsUserDetailsModalOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default AdminDashboard;
