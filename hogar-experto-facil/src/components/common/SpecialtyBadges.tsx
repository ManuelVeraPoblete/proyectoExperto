
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface SpecialtyBadgesProps {
  specialties: string[];
  maxVisible?: number;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

const SpecialtyBadges: React.FC<SpecialtyBadgesProps> = ({ 
  specialties = [], 
  maxVisible = 3,
  variant = 'outline'
}) => {
  const safeSpecialties = Array.isArray(specialties) ? specialties : [];
  const visibleSpecialties = safeSpecialties.slice(0, maxVisible);
  const remainingCount = Math.max(0, safeSpecialties.length - maxVisible);

  return (
    <div className="flex flex-wrap gap-2">
      {visibleSpecialties.map((specialty, index) => (
        <Badge key={`${specialty}-${index}`} variant={variant} className="text-xs">
          {specialty}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge variant={variant} className="text-xs">
          +{remainingCount} más
        </Badge>
      )}
    </div>
  );
};

export default SpecialtyBadges;
