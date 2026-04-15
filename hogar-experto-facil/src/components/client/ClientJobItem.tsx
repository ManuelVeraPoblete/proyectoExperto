
import React from 'react';
import { Eye, CheckCircle, UserPlus } from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';
import ActionButton from '@/components/common/ActionButton';
import RatingDisplay from '@/components/common/RatingDisplay';
import { ClientJob } from '@/hooks/useClientJobs';

interface ClientJobItemProps {
  job: ClientJob;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  onViewDetails: (jobId: number | string) => void;
  onCloseJob?: (jobId: number | string) => void;
  onAssignMaestro?: (jobId: number | string) => void;
}

const ClientJobItem: React.FC<ClientJobItemProps> = ({ 
  job, 
  getStatusColor, 
  getStatusText, 
  onViewDetails,
  onCloseJob,
  onAssignMaestro
}) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1">
        <h4 className="font-medium text-foreground">{job.title}</h4>
        <div className="flex items-center space-x-4 mt-1">
          {job.experto && (
            <span className="text-sm text-muted-foreground">
              Experto: {job.experto}
            </span>
          )}
          <span className="text-sm text-muted-foreground">{job.date}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <StatusBadge 
          status={job.status}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />
        
        {job.rating && (
          <RatingDisplay rating={job.rating} showCount={false} size="sm" />
        )}
        
        <div className="flex space-x-2">
          <ActionButton
            icon={Eye}
            text="Ver"
            onClick={() => onViewDetails(job.id)}
            variant="outline"
          />
          
          {job.status === 'activo' && onAssignMaestro && (
            <div className="relative inline-flex">
              <ActionButton
                icon={UserPlus}
                text="Asignar"
                onClick={() => onAssignMaestro(job.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              />
              {(job.proposalCount ?? 0) > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                  {job.proposalCount}
                </span>
              )}
            </div>
          )}
          
          {job.status === 'en_proceso' && onCloseJob && (
            <ActionButton
              icon={CheckCircle}
              text="Cerrar"
              onClick={() => onCloseJob(job.id)}
              className="bg-green-600 hover:bg-green-700"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientJobItem;
