
import React, { useState } from 'react';
import { AlertCircle, Timer, CheckCircle, Loader2 } from 'lucide-react';
import SearchExpertos from './SearchExpertos';
import ClientQuickActions from './client/ClientQuickActions';
import ClientStats from './client/ClientStats';
import ClientJobSection from './client/ClientJobSection';
import ClientModals from './client/ClientModals';
import useClientJobs from '@/hooks/useClientJobs';

const ClientDashboard = () => {
  const [isCloseJobModalOpen, setIsCloseJobModalOpen] = useState(false);
  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false);
  const [isAssignMaestroModalOpen, setIsAssignMaestroModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const {
    recentJobs,
    pendingJobs,
    inProgressJobs,
    completedJobs,
    isLoading,
    getStatusColor,
    getStatusText,
    handleMaestroAssigned,
    handleJobClosed,
    handleNewReview
  } = useClientJobs();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Cargando tus solicitudes y trabajos...</p>
      </div>
    );
  }

  const handleViewDetails = (jobId: number) => {
    const job = recentJobs.find(j => j.id === jobId);
    if (job) {
      setSelectedJob(job);
      setIsJobDetailsModalOpen(true);
    }
  };

  const handleCloseJob = (jobId: number) => {
    const job = recentJobs.find(j => j.id === jobId);
    if (job) {
      setSelectedJob(job);
      setIsCloseJobModalOpen(true);
    }
  };

  const handleAssignMaestro = (jobId: number) => {
    const job = recentJobs.find(j => j.id === jobId);
    if (job) {
      setSelectedJob(job);
      setIsAssignMaestroModalOpen(true);
    }
  };

  const handleMaestroAssignedWrapper = (maestroId: string) => {
    if (selectedJob) {
      handleMaestroAssigned(selectedJob.id, maestroId);
    }
  };

  const handleCloseAllModals = () => {
    setIsCloseJobModalOpen(false);
    setIsJobDetailsModalOpen(false);
    setIsAssignMaestroModalOpen(false);
    setSelectedJob(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Panel de Cliente</h1>
        <p className="text-muted-foreground">Gestiona tus solicitudes y encuentra expertos</p>
      </div>

      {/* Search Section */}
      <SearchExpertos />

      {/* Quick Actions */}
      <ClientQuickActions />

      {/* Stats Cards */}
      <ClientStats />

      {/* Trabajos Pendientes */}
      <ClientJobSection
        title="Trabajos Pendientes"
        icon={AlertCircle}
        iconColor="text-orange-500"
        jobs={pendingJobs}
        emptyMessage="No tienes trabajos pendientes."
        getStatusColor={getStatusColor}
        getStatusText={getStatusText}
        onViewDetails={handleViewDetails}
        onAssignMaestro={handleAssignMaestro}
      />

      {/* Trabajos En Progreso */}
      <ClientJobSection
        title="Trabajos En Progreso"
        icon={Timer}
        iconColor="text-blue-500"
        jobs={inProgressJobs}
        emptyMessage="No tienes trabajos en progreso."
        getStatusColor={getStatusColor}
        getStatusText={getStatusText}
        onViewDetails={handleViewDetails}
        onCloseJob={handleCloseJob}
      />

      {/* Trabajos Completados */}
      <ClientJobSection
        title="Trabajos Completados"
        icon={CheckCircle}
        iconColor="text-green-500"
        jobs={completedJobs}
        emptyMessage="No tienes trabajos completados."
        getStatusColor={getStatusColor}
        getStatusText={getStatusText}
        onViewDetails={handleViewDetails}
      />

      {/* Modals */}
      <ClientModals
        selectedJob={selectedJob}
        isCloseJobModalOpen={isCloseJobModalOpen}
        isJobDetailsModalOpen={isJobDetailsModalOpen}
        isAssignMaestroModalOpen={isAssignMaestroModalOpen}
        onCloseAllModals={handleCloseAllModals}
        onJobClosed={handleJobClosed}
        onNewReview={handleNewReview}
        onMaestroAssigned={handleMaestroAssignedWrapper}
      />
    </div>
  );
};

export default ClientDashboard;
