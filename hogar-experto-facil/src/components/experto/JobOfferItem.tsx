
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Send } from 'lucide-react';
import { ExpertoJobOffer } from '@/types/job';

interface JobOfferItemProps {
  offer: ExpertoJobOffer;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  onApply: (id: number | string) => void;
  isApplied?: boolean;
}

const JobOfferItem: React.FC<JobOfferItemProps> = ({
  offer,
  onApply,
  isApplied,
}) => {
  return (
    <div className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${isApplied ? 'border-green-200 bg-green-50/40' : 'hover:bg-muted/30'}`}>
      <div className="flex-1">
        <h4 className="font-medium text-foreground">{offer.title}</h4>
        <div className="flex items-center space-x-4 mt-1">
          <span className="text-sm text-muted-foreground">Cliente: {offer.client}</span>
          <span className="text-sm text-muted-foreground">{offer.location}</span>
          <span className="text-sm text-muted-foreground">{offer.date}</span>
        </div>
        <p className="text-sm font-medium text-primary mt-1">{offer.budget}</p>
      </div>

      <div className="flex items-center space-x-3">
        {isApplied ? (
          <Badge className="bg-green-100 text-green-800 border-green-200 border gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Postulado
          </Badge>
        ) : (
          <Button size="sm" onClick={() => onApply(offer.id)} className="gap-1.5">
            <Send className="w-3.5 h-3.5" /> Aplicar
          </Button>
        )}
      </div>
    </div>
  );
};

export default JobOfferItem;
