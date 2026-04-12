
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Flag, Eye, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { ReportDetailsModal } from '@/components/admin/ReportDetailsModal';
import { useReports } from '@/hooks/useReports';
import { Report } from '@/types/report';

const ReportManagement = () => {
  const { reports, updateReportStatus, deleteReport } = useReports();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setIsDetailsOpen(true);
  };

  const handleReview = (reportId: number) => {
    updateReportStatus(reportId, 'reviewed');
  };

  const handleDelete = (reportId: number) => {
    deleteReport(reportId);
  };

  const getStatusBadgeColor = (status: Report['status']) => {
    switch (status) {
      case 'pending': return 'destructive';
      case 'reviewed': return 'secondary';
      case 'resolved': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'reviewed': return <Eye className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const pendingReports = reports.filter(r => r.status === 'pending');
  const reviewedReports = reports.filter(r => r.status === 'reviewed');
  const resolvedReports = reports.filter(r => r.status === 'resolved');

  const ReportCard = ({ report }: { report: Report }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center space-x-2">
            <Flag className="w-4 h-4 text-red-500" />
            <span className="font-medium">{report.content}</span>
          </div>
          <Badge variant={getStatusBadgeColor(report.status)} className="flex items-center space-x-1">
            {getStatusIcon(report.status)}
            <span className="capitalize">{report.status}</span>
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground mb-2">
          <p>Reportado por: {report.reporter}</p>
          <p>Razón: {report.reason}</p>
          <p>Fecha: {report.date}</p>
        </div>
        {report.reportedUserName && (
          <p className="text-sm text-muted-foreground mb-2">
            Usuario reportado: {report.reportedUserName}
          </p>
        )}
        <Button onClick={() => handleViewReport(report)} size="sm">
          Ver Detalles
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <Flag className="w-6 h-6 text-red-500" />
        <h2 className="text-2xl font-bold">Gestión de Reportes</h2>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Pendientes ({pendingReports.length})</span>
          </TabsTrigger>
          <TabsTrigger value="reviewed" className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Revisados ({reviewedReports.length})</span>
          </TabsTrigger>
          <TabsTrigger value="resolved" className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Resueltos ({resolvedReports.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pendingReports.length > 0 ? (
            pendingReports.map(report => (
              <ReportCard key={report.id} report={report} />
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No hay reportes pendientes</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reviewed" className="mt-6">
          {reviewedReports.length > 0 ? (
            reviewedReports.map(report => (
              <ReportCard key={report.id} report={report} />
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No hay reportes revisados</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="resolved" className="mt-6">
          {resolvedReports.length > 0 ? (
            resolvedReports.map(report => (
              <ReportCard key={report.id} report={report} />
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No hay reportes resueltos</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {selectedReport && (
        <ReportDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          report={selectedReport}
          onReview={handleReview}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ReportManagement;
