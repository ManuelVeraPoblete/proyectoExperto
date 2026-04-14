import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { applicationService, ApiApplication } from '@/services/api/applicationService';

export const useMyApplications = () => {
  const { user } = useAuth();

  const { data = [], isLoading } = useQuery({
    queryKey: ['my-applications', user?.id],
    queryFn: () => applicationService.getMyApplications(),
    enabled: !!user?.id && user.userType === 'experto',
  });

  const appliedJobIds = useMemo(
    () => new Set((data as ApiApplication[]).map((a) => a.jobId)),
    [data],
  );

  const pendingCount = useMemo(
    () => (data as ApiApplication[]).filter((a) => a.estado === 'pendiente').length,
    [data],
  );

  const getApplicationForJob = (jobId: string): ApiApplication | undefined =>
    (data as ApiApplication[]).find((a) => a.jobId === jobId);

  return {
    applications: data as ApiApplication[],
    appliedJobIds,
    pendingCount,
    isLoading,
    getApplicationForJob,
  };
};
