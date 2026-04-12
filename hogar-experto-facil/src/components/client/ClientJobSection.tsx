
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import ClientJobItem from './ClientJobItem';
import { ClientJob } from '@/hooks/useClientJobs';

interface ClientJobSectionProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  jobs: ClientJob[];
  emptyMessage: string;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  onViewDetails: (jobId: number) => void;
  onCloseJob?: (jobId: number) => void;
  onAssignMaestro?: (jobId: number) => void;
}

const ClientJobSection: React.FC<ClientJobSectionProps> = ({
  title,
  icon: Icon,
  iconColor,
  jobs,
  emptyMessage,
  getStatusColor,
  getStatusText,
  onViewDetails,
  onCloseJob,
  onAssignMaestro
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${iconColor}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <ClientJobItem 
                key={job.id} 
                job={job} 
                getStatusColor={getStatusColor} 
                getStatusText={getStatusText} 
                onViewDetails={onViewDetails}
                onCloseJob={onCloseJob}
                onAssignMaestro={onAssignMaestro}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">{emptyMessage}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientJobSection;
