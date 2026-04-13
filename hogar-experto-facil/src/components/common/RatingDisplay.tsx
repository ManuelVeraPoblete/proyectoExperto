
import React from 'react';
import { Star } from 'lucide-react';

interface RatingDisplayProps {
  rating: number;
  reviewCount?: number;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({ 
  rating, 
  reviewCount, 
  showCount = true,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="flex items-center space-x-1">
      <Star className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`} />
      <span className={`font-medium ${textSizes[size]}`}>
        {rating > 0 ? rating.toFixed(1) : '—'}
      </span>
      {showCount && reviewCount && (
        <span className={`${textSizes[size]} text-muted-foreground`}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
};

export default RatingDisplay;
