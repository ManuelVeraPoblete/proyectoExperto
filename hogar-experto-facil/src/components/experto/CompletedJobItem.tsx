
import React from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import RatingDisplay from '@/components/common/RatingDisplay';
import ReportButton from '@/components/common/ReportButton';
import { CompletedJob } from '@/types/job';

interface CompletedJobItemProps {
  job: CompletedJob;
  onViewClientProfile: (clientId: string) => void;
}

const CompletedJobItem: React.FC<CompletedJobItemProps> = ({ 
  job, 
  onViewClientProfile 
}) => {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-foreground">{job.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">Cliente: {job.client}</p>
          <p className="text-sm text-muted-foreground">{job.date}</p>
          <p className="text-sm font-medium text-green-600 mt-1">{job.payment}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <ReportButton
            reportType="user"
            reportedUserId={job.clientId}
            reportedUserName={job.client}
            variant="ghost"
            size="sm"
          />
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onViewClientProfile(job.clientId)}
          >
            <User className="w-4 h-4 mr-1" />
            Ver Perfil
          </Button>
        </div>
      </div>
      
      {job.clientRating && (
        <div className="mt-3">
          <p className="text-sm text-muted-foreground mb-1">Calificación del cliente:</p>
          <RatingDisplay rating={job.clientRating} showCount={false} />
          {job.clientComment && (
            <p className="text-sm text-muted-foreground italic mt-1">"{job.clientComment}"</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CompletedJobItem;
