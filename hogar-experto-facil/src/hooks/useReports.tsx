import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reporteService, ApiReport } from '@/services/api/reporteService';
import { Report } from '@/types/report';

const mapApiReportToReport = (r: ApiReport): Report => ({
  id: r.id,
  type: r.type,
  content: r.reason,
  reporter: r.Reporter ? `${r.Reporter.nombres} ${r.Reporter.apellidos}` : 'Anónimo',
  reporterId: r.reporterId ?? '',
  reportedUserId: r.reportedUserId,
  reportedUserName: r.ReportedUser ? `${r.ReportedUser.nombres} ${r.ReportedUser.apellidos}` : undefined,
  reportedContent: r.reportedContent,
  date: r.createdAt.split('T')[0],
  status: r.status,
  reason: r.reason,
  description: r.description,
});

export const useReports = () => {
  const queryClient = useQueryClient();

  const { data: rawReports = [], isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: () => reporteService.getAll(),
  });

  const reports: Report[] = rawReports.map(mapApiReportToReport);

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: ApiReport['status'] }) =>
      reporteService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });

  const updateReportStatus = (reportId: number, status: Report['status']) => {
    updateStatusMutation.mutate({ id: reportId, status });
  };

  // No delete endpoint — mark as resolved instead
  const deleteReport = (reportId: number) => {
    updateStatusMutation.mutate({ id: reportId, status: 'resolved' });
  };

  const getPendingReports = () => reports.filter(r => r.status === 'pending');

  return {
    reports,
    isLoading,
    updateReportStatus,
    deleteReport,
    getPendingReports,
  };
};
