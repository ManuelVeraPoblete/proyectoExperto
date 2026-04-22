
import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User as UserIcon, Briefcase, Star, Clock, DollarSign, ShieldCheck, MapPin, Phone, Mail, Key, Camera } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { toAbsoluteUrl } from '@/lib/api-config';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!formData.nombres.trim()) e.nombres = 'Los nombres son requeridos';
    if (!formData.apellidos.trim()) e.apellidos = 'Los apellidos son requeridos';
    if (!formData.email.trim()) e.email = 'El email es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Ingresa un email válido';
    if (formData.telefono && !/^\+?[\d\s\-()]{8,15}$/.test(formData.telefono))
      e.telefono = 'Formato inválido. Ej: +56 9 12345678';
    if (user?.userType === 'experto' && formData.hourlyRate < 0)
      e.hourlyRate = 'La tarifa no puede ser negativa';
    return e;
  };
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    direccion: '',
    region: '',
    provincia: '',
    comuna: '',
    especialidades: [] as string[],
    experience: '',
    hourlyRate: 0,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombres: user.nombres || '',
        apellidos: user.apellidos || '',
        email: user.email || '',
        telefono: user.telefono || '',
        direccion: user.direccion || '',
        region: user.region || '',
        provincia: user.provincia || '',
        comuna: user.comuna || '',
        especialidades: user.especialidades || [],
        experience: user.experience || '',
        hourlyRate: user.hourlyRate || 0,
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: '' }));
  };

  const handleUpdate = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    if (user) {
      updateUser({ ...user, ...formData });
      setIsEditing(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const result = await apiClient.postForm<{ avatarUrl: string }>(`/users/${user.id}/avatar`, formData);
      const absoluteUrl = toAbsoluteUrl(result.avatarUrl)!;
      updateUser({ avatar: absoluteUrl });
      toast({ title: 'Avatar actualizado', description: 'Tu foto de perfil se actualizó correctamente.' });
    } catch {
      toast({ title: 'Error', description: 'No se pudo actualizar el avatar.', variant: 'destructive' });
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = '';
    }
  };

  if (!user) return null;

  // Determinar el texto del rol de forma segura y dinámica
  const displayRole = user.userType === 'client' ? 'Cliente' : 
                      user.userType === 'experto' ? 'Experto' : 
                      user.userType === 'admin' ? 'Administrador' : 'Usuario';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] h-[90vh] flex flex-col">
        <DialogHeader className="text-center border-b pb-4">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <Avatar className="w-24 h-24 ring-2 ring-primary/10">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-primary text-white text-4xl">
                  <UserIcon className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 hover:bg-primary/90 transition-colors disabled:opacity-50"
                title="Cambiar foto"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <DialogTitle className="text-3xl font-bold text-foreground">
              {`${user.nombres} ${user.apellidos}`}
            </DialogTitle>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline" className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                user.userType === 'client' ? 'text-blue-700 bg-blue-50 border-blue-200' : 
                user.userType === 'experto' ? 'text-indigo-700 bg-indigo-50 border-indigo-200' : 
                'text-amber-700 bg-amber-50 border-amber-200'
              }`}>
                {displayRole}
              </Badge>
              {user.userType === 'experto' && user.isVerified && (
                <Badge variant="outline" className="text-xs font-bold uppercase px-3 py-1 rounded-full text-green-700 bg-green-50 border-green-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verificado
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-grow pr-4 -mr-4">
          <div className="grid gap-6 py-4">
            {/* Estadísticas de Perfil */}
            {user.userType !== 'admin' && (
              <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                {user.userType === 'client' ? (
                  <>
                    <div className="flex flex-col items-center justify-center p-2 bg-background rounded-md shadow-sm border border-border/50">
                      <Briefcase className="w-5 h-5 text-blue-500 mb-1" />
                      <span className="text-xl font-bold">{user.jobCount || 0}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">Trabajos</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 bg-background rounded-md shadow-sm border border-border/50">
                      <Star className="w-5 h-5 text-yellow-500 mb-1 fill-yellow-500" />
                      <span className="text-xl font-bold">{user.averageRating || 'N/A'}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">Calificación</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center justify-center p-2 bg-background rounded-md shadow-sm border border-border/50">
                      <Star className="w-5 h-5 text-yellow-500 mb-1 fill-yellow-500" />
                      <span className="text-xl font-bold">{user.calificacion || 0}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">Calificación</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 bg-background rounded-md shadow-sm border border-border/50">
                      <Briefcase className="w-5 h-5 text-indigo-500 mb-1" />
                      <span className="text-xl font-bold">{user.reviewCount || 0}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">Reseñas</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Información Personal */}
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-primary" /> Información Personal
              </h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="nombres" className="text-right pt-2">Nombres *</Label>
                  {isEditing ? (
                    <div className="col-span-3">
                      <Input id="nombres" value={formData.nombres} onChange={handleInputChange} className={errors.nombres ? 'border-destructive' : ''} />
                      {errors.nombres && <p className="text-xs text-destructive mt-1">{errors.nombres}</p>}
                    </div>
                  ) : (
                    <p className="col-span-3 text-muted-foreground pt-2">{user.nombres}</p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="apellidos" className="text-right pt-2">Apellidos *</Label>
                  {isEditing ? (
                    <div className="col-span-3">
                      <Input id="apellidos" value={formData.apellidos} onChange={handleInputChange} className={errors.apellidos ? 'border-destructive' : ''} />
                      {errors.apellidos && <p className="text-xs text-destructive mt-1">{errors.apellidos}</p>}
                    </div>
                  ) : (
                    <p className="col-span-3 text-muted-foreground pt-2">{user.apellidos}</p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Información de Contacto */}
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" /> Contacto
              </h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="email" className="text-right flex items-center gap-1 justify-end pt-2">
                    <Mail className="w-4 h-4" /> Email *
                  </Label>
                  {isEditing ? (
                    <div className="col-span-3">
                      <Input id="email" type="email" value={formData.email} onChange={handleInputChange} className={errors.email ? 'border-destructive' : ''} />
                      {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                    </div>
                  ) : (
                    <p className="col-span-3 text-muted-foreground pt-2">{user.email}</p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="telefono" className="text-right flex items-center gap-1 justify-end pt-2">
                    <Phone className="w-4 h-4" /> Teléfono
                  </Label>
                  {isEditing ? (
                    <div className="col-span-3">
                      <Input id="telefono" value={formData.telefono} onChange={handleInputChange} className={errors.telefono ? 'border-destructive' : ''} />
                      {errors.telefono && <p className="text-xs text-destructive mt-1">{errors.telefono}</p>}
                    </div>
                  ) : (
                    <p className="col-span-3 text-muted-foreground pt-2">{user.telefono || 'No especificado'}</p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Ubicación */}
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" /> Ubicación
              </h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="direccion" className="text-right">Dirección</Label>
                  {isEditing ? (
                    <Input id="direccion" value={formData.direccion} onChange={handleInputChange} className="col-span-3" />
                  ) : (
                    <p className="col-span-3 text-muted-foreground">{user.direccion || 'No especificada'}</p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="region" className="text-right">Región</Label>
                  {isEditing ? (
                    <Input id="region" value={formData.region} onChange={handleInputChange} className="col-span-3" />
                  ) : (
                    <p className="col-span-3 text-muted-foreground">{user.region || 'No especificada'}</p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="provincia" className="text-right">Provincia</Label>
                  {isEditing ? (
                    <Input id="provincia" value={formData.provincia} onChange={handleInputChange} className="col-span-3" />
                  ) : (
                    <p className="col-span-3 text-muted-foreground">{user.provincia || 'No especificada'}</p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="comuna" className="text-right">Comuna</Label>
                  {isEditing ? (
                    <Input id="comuna" value={formData.comuna} onChange={handleInputChange} className="col-span-3" />
                  ) : (
                    <p className="col-span-3 text-muted-foreground">{user.comuna || 'No especificada'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Información de Experto */}
            {user.userType === 'experto' && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" /> Perfil Profesional
                  </h3>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="especialidades" className="text-right">Especialidades</Label>
                      <div className="col-span-3">
                        {isEditing ? (
                          <Input
                            id="especialidades"
                            value={formData.especialidades.join(', ')}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                especialidades: e.target.value.split(',').map((s) => s.trim()),
                              }))
                            }
                            placeholder="Plomería, Electricidad, ..."
                          />
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {user.especialidades?.map((spec, index) => (
                              <Badge key={index} variant="secondary">{spec}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="experience" className="text-right flex items-center gap-1 justify-end">
                        <Clock className="w-4 h-4" /> Experiencia
                      </Label>
                      {isEditing ? (
                        <Input id="experience" value={formData.experience} onChange={handleInputChange} className="col-span-3" placeholder="Ej: 10 años" />
                      ) : (
                        <p className="col-span-3 text-muted-foreground">{user.experience || 'No especificada'}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="hourlyRate" className="text-right flex items-center gap-1 justify-end">
                        <DollarSign className="w-4 h-4" /> Tarifa/h
                      </Label>
                      {isEditing ? (
                        <Input id="hourlyRate" type="number" value={formData.hourlyRate} onChange={handleInputChange} className="col-span-3" />
                      ) : (
                        <p className="col-span-3 text-muted-foreground">
                          {user.hourlyRate ? `$${user.hourlyRate.toLocaleString()}/hora` : 'No especificada'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Información de Admin */}
            {user.userType === 'admin' && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" /> Acceso Administrativo
                  </h3>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Nivel</Label>
                      <p className="col-span-3 text-muted-foreground">{user.adminLevel || 'Administrador General'}</p>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Último Acceso</Label>
                      <p className="col-span-3 text-muted-foreground">{user.lastAccess || 'Hoy'}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="pt-4 border-t">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
              <Button onClick={handleUpdate}>Guardar Cambios</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
