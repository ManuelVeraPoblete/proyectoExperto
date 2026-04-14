
import React from 'react';
import CloseJobModal from './CloseJobModal';
import JobDetailsModal from './JobDetailsModal';
import AssignMaestroModal from './AssignMaestroModal';
import { ClientJob } from '@/hooks/useClientJobs';

interface ClientModalsProps {
  selectedJob: ClientJob | null;
  isCloseJobModalOpen: boolean;
  isJobDetailsModalOpen: boolean;
  isAssignMaestroModalOpen: boolean;
  onCloseAllModals: () => void;
  onJobClosed: (jobId: string, rating: number, review: string, files: File[]) => Promise<void>;
  onNewReview: (jobId: string, review: string) => void;
  onMaestroAssigned: (maestroId: string) => void;
}

const ClientModals: React.FC<ClientModalsProps> = ({
  selectedJob,
  isCloseJobModalOpen,
  isJobDetailsModalOpen,
  isAssignMaestroModalOpen,
  onCloseAllModals,
  onJobClosed,
  onNewReview,
  onMaestroAssigned
}) => {
  if (!selectedJob) return null;

  return (
    <>
      <CloseJobModal
        isOpen={isCloseJobModalOpen}
        onClose={onCloseAllModals}
        job={selectedJob}
        onJobClosed={onJobClosed}
      />

      <JobDetailsModal
        isOpen={isJobDetailsModalOpen}
        onClose={onCloseAllModals}
        job={selectedJob}
        onNewReview={onNewReview}
      />

      <AssignMaestroModal
        isOpen={isAssignMaestroModalOpen}
        onClose={onCloseAllModals}
        jobId={String(selectedJob.id)}
        jobTitle={selectedJob.title}
        onAssign={onMaestroAssigned}
      />
    </>
  );
};

export default ClientModals;
