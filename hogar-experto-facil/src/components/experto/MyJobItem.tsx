
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';
import ReportButton from '@/components/common/ReportButton';
import { ExpertoActiveJob } from '@/types/job';

interface MyJobItemProps {
  job: ExpertoActiveJob;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  onContact: (clientId: string) => void;
}

const MyJobItem: React.FC<MyJobItemProps> = ({ 
  job, 
  getStatusColor, 
  getStatusText, 
  onContact 
}) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1">
        <h4 className="font-medium text-foreground">{job.title}</h4>
        <div className="flex items-center space-x-4 mt-1">
          <span className="text-sm text-muted-foreground">
            Cliente: {job.client}
          </span>
          <span className="text-sm text-muted-foreground">{job.date}</span>
        </div>
        <p className="text-sm font-medium text-green-600 mt-1">{job.payment}</p>
      </div>
      
      <div className="flex items-center space-x-3">
        <StatusBadge 
          status={job.status}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />
        
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
          onClick={() => onContact(job.clientId)}
        >
          <MessageSquare className="w-4 h-4 mr-1" />
          Contactar
        </Button>
      </div>
    </div>
  );
};

export default MyJobItem;
