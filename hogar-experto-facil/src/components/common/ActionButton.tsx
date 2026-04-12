
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  text: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  text,
  onClick,
  variant = 'default',
  size = 'sm',
  className = ''
}) => {
  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={onClick}
      className={className}
    >
      <Icon className="w-4 h-4 mr-1" />
      {text}
    </Button>
  );
};

export default ActionButton;
