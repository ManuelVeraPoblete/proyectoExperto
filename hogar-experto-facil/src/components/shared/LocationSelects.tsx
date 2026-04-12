import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { chileData } from '@/lib/chile-data';

interface LocationSelectsProps {
  selectedRegion: string;
  onRegionChange: (value: string) => void;
  selectedProvincia: string;
  onProvinciaChange: (value: string) => void;
  selectedComuna: string;
  onComunaChange: (value: string) => void;
  disableRegion?: boolean;
  disableProvincia?: boolean;
}

const LocationSelects: React.FC<LocationSelectsProps> = ({
  selectedRegion,
  onRegionChange,
  selectedProvincia,
  onProvinciaChange,
  selectedComuna,
  onComunaChange,
  disableRegion = false,
  disableProvincia = false,
}) => {
  const provincias = selectedRegion ? chileData.find(r => r.region === selectedRegion)?.provincias : [];
  const comunas = selectedProvincia ? provincias?.find(p => p.nombre === selectedProvincia)?.comunas : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="region">Región</Label>
        <Select value={selectedRegion} onValueChange={onRegionChange} disabled={disableRegion}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona tu región" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-border shadow-lg">
            {chileData.map((region) => (
              <SelectItem key={region.region} value={region.region}>
                {region.region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="provincia">Provincia</Label>
        <Select value={selectedProvincia} onValueChange={onProvinciaChange} disabled={disableProvincia || !selectedRegion}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona tu provincia" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-border shadow-lg">
            {provincias?.map((provincia) => (
              <SelectItem key={provincia.nombre} value={provincia.nombre}>
                {provincia.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comuna">Comuna</Label>
        <Select value={selectedComuna} onValueChange={onComunaChange} disabled={!selectedProvincia}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona tu comuna" />
          </SelectTrigger>
          <SelectContent>
            {comunas?.map((comuna) => (
              <SelectItem key={comuna.codigo} value={comuna.nombre}>
                {comuna.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LocationSelects;
