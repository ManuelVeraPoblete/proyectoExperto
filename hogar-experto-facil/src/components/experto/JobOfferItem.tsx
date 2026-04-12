
import React from 'react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/common/StatusBadge';
import { ExpertoJobOffer } from '@/types/job';

interface JobOfferItemProps {
  offer: ExpertoJobOffer;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  onApply: (id: number) => void;
}

const JobOfferItem: React.FC<JobOfferItemProps> = ({ 
  offer, 
  getStatusColor, 
  getStatusText, 
  onApply 
}) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1">
        <h4 className="font-medium text-foreground">{offer.title}</h4>
        <div className="flex items-center space-x-4 mt-1">
          <span className="text-sm text-muted-foreground">
            Cliente: {offer.client}
          </span>
          <span className="text-sm text-muted-foreground">{offer.location}</span>
          <span className="text-sm text-muted-foreground">{offer.date}</span>
        </div>
        <p className="text-sm font-medium text-primary mt-1">{offer.budget}</p>
      </div>
      
      <div className="flex items-center space-x-3">
        <StatusBadge 
          status={offer.status}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />
        
        <Button 
          size="sm" 
          onClick={() => onApply(offer.id)}
          disabled={offer.status === 'applied' || offer.status === 'accepted'}
        >
          {offer.status === 'new' ? 'Aplicar' : 'Aplicado'}
        </Button>
      </div>
    </div>
  );
};

export default JobOfferItem;
