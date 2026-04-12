
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  getStatusColor, 
  getStatusText 
}) => {
  return (
    <Badge className={`text-xs font-medium ${getStatusColor(status)}`}>
      {getStatusText(status)}
    </Badge>
  );
};

export default StatusBadge;
