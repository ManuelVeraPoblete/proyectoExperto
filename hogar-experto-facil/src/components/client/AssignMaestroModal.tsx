
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin, User } from 'lucide-react';
import { Maestro } from '@/types/maestro';
import RatingDisplay from '@/components/common/RatingDisplay';
import SpecialtyBadges from '@/components/common/SpecialtyBadges';

interface AssignMaestroModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  onAssign: (maestroId: string) => void;
}

const AssignMaestroModal: React.FC<AssignMaestroModalProps> = ({
  isOpen,
  onClose,
  jobTitle,
  onAssign
}) => {
  const [selectedMaestro, setSelectedMaestro] = useState<string | null>(null);

  // Mock maestros data - in a real app this would come from an API
  const availableMaestros: Maestro[] = [
    {
      id: 'm1',
      name: 'Carlos Rodríguez',
      specialties: ['Plomería', 'Instalaciones'],
      rating: 4.8,
      reviewCount: 24,
      location: 'Las Condes',
      experience: '5 años',
      priceRange: '$25.000 - $80.000',
      avatar: '/placeholder.svg'
    },
    {
      id: 'm2',
      name: 'María González',
      specialties: ['Electricidad', 'Instalaciones'],
      rating: 4.9,
      reviewCount: 31,
      location: 'Providencia',
      experience: '8 años',
      priceRange: '$30.000 - $90.000',
      avatar: '/placeholder.svg'
    },
    {
      id: 'm3',
      name: 'Roberto Silva',
      specialties: ['Carpintería', 'Reparaciones'],
      rating: 4.7,
      reviewCount: 18,
      location: 'Ñuñoa',
      experience: '6 años',
      priceRange: '$20.000 - $70.000',
      avatar: '/placeholder.svg'
    }
  ];

  const handleAssign = () => {
    if (selectedMaestro) {
      onAssign(selectedMaestro);
      setSelectedMaestro(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Asignar Maestro</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Trabajo: {jobTitle}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Selecciona un maestro para asignar a este trabajo:
          </p>

          {availableMaestros.map((maestro) => (
            <Card 
              key={maestro.id} 
              className={`cursor-pointer transition-colors ${
                selectedMaestro === maestro.id 
                  ? 'border-primary bg-primary/5' 
                  : 'hover:bg-accent/50'
              }`}
              onClick={() => setSelectedMaestro(maestro.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{maestro.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <RatingDisplay 
                            rating={maestro.rating} 
                            showCount={true} 
                            reviewCount={maestro.reviewCount}
                            size="sm" 
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {maestro.location}
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <SpecialtyBadges specialties={maestro.specialties} />
                    </div>
                    
                    <div className="mt-2 flex justify-between items-center text-sm text-muted-foreground">
                      <span>{maestro.experience} de experiencia</span>
                      <span className="font-medium text-foreground">{maestro.priceRange}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleAssign}
            disabled={!selectedMaestro}
          >
            Asignar Maestro
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignMaestroModal;
