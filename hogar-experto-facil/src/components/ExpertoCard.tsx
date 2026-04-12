
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import UserAvatar from '@/components/common/UserAvatar';
import RatingDisplay from '@/components/common/RatingDisplay';
import SpecialtyBadges from '@/components/common/SpecialtyBadges';
import { ExpertoCardData } from '@/types/experto';

interface ExpertoCardProps extends ExpertoCardData {
  onContactClick: (expertoId: string, expertoName: string) => void;
}

const ExpertoCard: React.FC<ExpertoCardProps> = ({
  id,
  nombres,
  apellidos,
  avatar,
  especialidades,
  calificacion,
  reviewCount,
  comuna,
  region,
  experience,
  hourlyRate,
  isVerified = false,
  onContactClick,
  unreadCount = 0,
}) => {
  const navigate = useNavigate();

  const handleContact = () => {
    onContactClick(id, `${nombres} ${apellidos}`);
  };

  return (
    <Card className="card-hover bg-white border-border">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <UserAvatar 
              src={avatar} 
              name={`${nombres} ${apellidos}`}
              size="md"
            />
            <div>
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                {`${nombres} ${apellidos}`}
                {isVerified && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                    Verificado
                  </Badge>
                )}
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </h3>
              <p className="text-sm text-muted-foreground">{`${comuna}, ${region}`}</p>
            </div>
          </div>
          
          <RatingDisplay 
            rating={calificacion} 
            reviewCount={reviewCount} 
            size="sm"
          />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Especialidades:</p>
            <SpecialtyBadges specialties={especialidades} maxVisible={3} />
          </div>

          <div className="flex space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/experto/${id}`)}
              className="flex-1"
            >
              Ver Perfil
            </Button>
            <Button 
              size="sm" 
              onClick={handleContact}
              className="flex-1 btn-primary"
            >
              Contactar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpertoCard;
