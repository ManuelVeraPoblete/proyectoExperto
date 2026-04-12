import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  iconBgColor: string;
  iconColor: string;
  onClick: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon: Icon, iconBgColor, iconColor, onClick }) => {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer border-primary/20 hover:border-primary/40" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-lg ${iconBgColor}`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionCard;
