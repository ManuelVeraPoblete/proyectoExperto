
import React from 'react';
import RatingDisplay from '@/components/common/RatingDisplay';
import { JobRating } from '@/types/job';

interface JobRatingItemProps {
  rating: JobRating;
}

const JobRatingItem: React.FC<JobRatingItemProps> = ({ rating }) => {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-medium text-foreground">{rating.jobTitle}</h4>
          <p className="text-sm text-muted-foreground">Cliente: {rating.client}</p>
        </div>
        <div className="flex flex-col items-end">
          <RatingDisplay rating={rating.rating} showCount={false} />
          <span className="text-xs text-muted-foreground mt-1">{rating.date}</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground italic">"{rating.comment}"</p>
    </div>
  );
};

export default JobRatingItem;
