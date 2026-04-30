import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronDown, Camera, User as UserIcon } from 'lucide-react';
import LocationSelects from '@/components/shared/LocationSelects';
import { API_BASE_URL } from '@/lib/api-config';

const Register = () => {
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    telefono: '',
    direccion: '',
    region: '',
    provincia: '',
    comuna: '',
    userType: 'client',
    email: '',
    password: '',
    especialidades: [] as number[], // Usaremos IDs para las especialidades
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!formData.nombres.trim()) e.nombres = 'Los nombres son requeridos';
    else if (formData.nombres.trim().length < 2) e.nombres = 'Mínimo 2 caracteres';
    if (!formData.apellidos.trim()) e.apellidos = 'Los apellidos son requeridos';
    else if (formData.apellidos.trim().length < 2) e.apellidos = 'Mínimo 2 caracteres';
    if (!formData.telefono.trim()) e.telefono = 'El teléfono es requerido';
    else if (!/^\+?[\d\s\-()]{8,15}$/.test(formData.telefono)) e.telefono = 'Formato inválido. Ej: +56 9 12345678';
    if (!formData.direccion.trim()) e.direccion = 'La dirección es requerida';
    else if (formData.direccion.trim().length < 5) e.direccion = 'Mínimo 5 caracteres';
    if (!formData.region) e.ubicacion = 'Selecciona región, provincia y comuna';
    else if (!formData.provincia) e.ubicacion = 'Selecciona provincia y comuna';
    else if (!formData.comuna) e.ubicacion = 'Selecciona una comuna';
    if (!formData.email.trim()) e.email = 'El email es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Ingresa un email válido';
    if (!formData.password) e.password = 'La contraseña es requerida';
    else if (formData.password.length < 8) e.password = 'Mínimo 8 caracteres';
    if (!confirmPassword) e.confirmPassword = 'Confirma tu contraseña';
    else if (formData.password !== confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden';
    if (formData.userType === 'experto' && formData.especialidades.length === 0)
      e.especialidades = 'Selecciona al menos una especialidad';
    return e;
  };

  // Cargar categorías si el tipo de usuario es experto
  React.useEffect(() => {
    if (formData.userType === 'experto') {
      const fetchCategories = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/categories`);
          if (response.ok) {
            const data = await response.json();
            setCategories(data);
          } else {
            console.error("Error al cargar categorías");
          }
        } catch (error) {
          console.error("Error en la petición de categorías:", error);
        }
      };
      fetchCategories();
    }
  }, [formData.userType]);

  const toggleCategoryExpand = (categoryId: number) => {
    setExpandedCategoryId(prev => prev === categoryId ? null : categoryId);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: '' }));
  };

  const handleRegionChange = (value: string) => {
    setFormData(prev => ({ ...prev, region: value, provincia: '', comuna: '' }));
    setErrors(prev => ({ ...prev, ubicacion: '' }));
  };

  const handleProvinciaChange = (value: string) => {
    setFormData(prev => ({ ...prev, provincia: value, comuna: '' }));
    setErrors(prev => ({ ...prev, ubicacion: '' }));
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleUserTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, userType: value, especialidades: [] }));
    setExpandedCategoryId(null); // Limpiar expansión al cambiar tipo
  };

  const handleSpecialtyChange = (specialtyId: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      especialidades: checked
        ? [...prev.especialidades, specialtyId]
        : prev.especialidades.filter(id => id !== specialtyId),
    }));
  };

  const handleCategoryToggle = (category: any, checked: boolean) => {
    const subcategoryIds = category.Subcategories?.map((sub: any) => sub.id) || [];
    
    setFormData(prev => {
      let newEspecialidades = [...prev.especialidades];
      
      if (checked) {
        // Agregar todas las que no estén
        subcategoryIds.forEach((id: number) => {
          if (!newEspecialidades.includes(id)) {
            newEspecialidades.push(id);
          }
        });
      } else {
        // Quitar todas las de esta categoría
        newEspecialidades = newEspecialidades.filter(id => !subcategoryIds.includes(id));
      }
      
      return { ...prev, especialidades: newEspecialidades };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setIsLoading(true);

    try {
      const isExpert = formData.userType === 'experto';
      const endpointSuffix = isExpert ? 'register/expert' : 'register/client';
      const url = `${API_BASE_URL}/auth/${endpointSuffix}`;
      
      // Reestructuración para la API
      let payload: any = {
        nombre: formData.nombres, // En singular para la API
        apellido: formData.apellidos, // En singular para la API
        email: formData.email,
        password: formData.password,
        telefono: formData.telefono,
        direccion: formData.direccion,
        region: formData.region,
        provincia: formData.provincia,
        comuna: formData.comuna,
        userType: formData.userType
      };

      if (isExpert) {
        // Enviar datos adicionales para experto
        payload.experto_profile = {
          experience: "Nuevo experto registrado", // Valor por defecto
          hourlyRate: 0,
          description: "Sin descripción",
          direccion: formData.direccion,
          comuna: formData.comuna,
          region: formData.region
        };
        // Enviar los IDs de especialidades (subcategorías)
        payload.experto_specialties = formData.especialidades;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const msg = Array.isArray(data.message) ? data.message.join(', ') : (data.message || data.error || 'Error en el registro');
        throw new Error(msg);
      }

      // Subir avatar si el usuario seleccionó uno
      if (avatarFile && data.user?.id && data.token) {
        try {
          const avatarFormData = new FormData();
          avatarFormData.append('avatar', avatarFile);
          await fetch(`${API_BASE_URL}/users/${data.user.id}/avatar`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${data.token}` },
            body: avatarFormData,
          });
        } catch {
          // No bloquear el registro si falla el avatar
        }
      }

      login(data);

      toast({
        title: "Registro Exitoso",
        description: "Se ha creado tu cuenta correctamente. Te enviamos un correo de verificación válido por 12 horas — revisa tu bandeja de entrada.",
      });

      navigate('/');
    } catch (error: any) {
      console.error('❌ Error detallado al registrar:', error);
      toast({
        title: "Error en el registro",
        description: error.message || "No se pudo conectar con el servidor. Verifica que el servidor esté corriendo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-foreground mb-6">Crear Cuenta</h1>
        <p className="text-center text-muted-foreground mb-8">
          Completa el formulario para crear tu cuenta.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 border rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold">Datos Personales</h3>

            {/* Selector de avatar */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="relative w-24 h-24 rounded-full border-2 border-dashed border-muted-foreground/40 flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden bg-muted"
                onClick={() => avatarInputRef.current?.click()}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-10 h-10 text-muted-foreground" />
                )}
                <div className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-1">
                  <Camera className="w-3 h-3" />
                </div>
              </div>
              <span className="text-xs text-muted-foreground">Foto de perfil (opcional)</span>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarSelect}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombres">Nombres *</Label>
                <Input id="nombres" type="text" autoComplete="given-name" placeholder="Tus nombres" value={formData.nombres} onChange={handleChange} className={errors.nombres ? 'border-destructive' : ''} />
                {errors.nombres && <p className="text-xs text-destructive">{errors.nombres}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos *</Label>
                <Input id="apellidos" type="text" autoComplete="family-name" placeholder="Tus apellidos" value={formData.apellidos} onChange={handleChange} className={errors.apellidos ? 'border-destructive' : ''} />
                {errors.apellidos && <p className="text-xs text-destructive">{errors.apellidos}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input id="telefono" type="tel" autoComplete="tel" placeholder="+56 9 12345678" value={formData.telefono} onChange={handleChange} className={errors.telefono ? 'border-destructive' : ''} />
                {errors.telefono && <p className="text-xs text-destructive">{errors.telefono}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-4 border rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold">Dirección</h3>
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección *</Label>
              <Input id="direccion" type="text" placeholder="Tu dirección" value={formData.direccion} onChange={handleChange} className={errors.direccion ? 'border-destructive' : ''} />
              {errors.direccion && <p className="text-xs text-destructive">{errors.direccion}</p>}
            </div>
            <LocationSelects
              selectedRegion={formData.region}
              onRegionChange={handleRegionChange}
              selectedProvincia={formData.provincia}
              onProvinciaChange={handleProvinciaChange}
              selectedComuna={formData.comuna}
              onComunaChange={(value) => { setFormData(prev => ({ ...prev, comuna: value })); setErrors(prev => ({ ...prev, ubicacion: '' })); }}
            />
            {errors.ubicacion && <p className="text-xs text-destructive">{errors.ubicacion}</p>}
          </div>

          <div className="space-y-4 border rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold">Información de Cuenta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Cuenta</Label>
                <RadioGroup onValueChange={handleUserTypeChange} value={formData.userType} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="client" id="client" />
                    <Label htmlFor="client">Cliente</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="experto" id="experto" />
                    <Label htmlFor="experto">Experto</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.userType === 'experto' && (
                <div className="space-y-4 col-span-2">
                  <div className="flex flex-col mb-4">
                    <Label className="text-xl font-bold text-primary">Especialidades</Label>
                    <p className="text-sm text-muted-foreground">Selecciona todas las áreas en las que tienes experiencia.</p>
                  </div>
                  
                  {categories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categories.map((category: any) => {
                        const subIds = category.Subcategories?.map((s: any) => s.id) || [];
                        const selectedCount = subIds.filter((id: number) => formData.especialidades.includes(id)).length;
                        const isAllSelected = subIds.length > 0 && selectedCount === subIds.length;
                        const isSomeSelected = selectedCount > 0 && selectedCount < subIds.length;
                        const isExpanded = expandedCategoryId === category.id;

                        return (
                          <div key={category.id} className={`border rounded-xl bg-card shadow-sm transition-all duration-200 ${isExpanded ? 'ring-1 ring-primary/20' : ''}`}>
                            {/* Cabecera de Categoría */}
                            <div className="flex items-center justify-between p-4 group">
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  id={`cat-${category.id}`}
                                  checked={isAllSelected}
                                  ref={(el) => { if (el) el.indeterminate = isSomeSelected; }}
                                  onChange={(e) => handleCategoryToggle(category, e.target.checked)}
                                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                />
                                <div 
                                  className="flex flex-col cursor-pointer" 
                                  onClick={() => toggleCategoryExpand(category.id)}
                                >
                                  <Label className="font-bold text-foreground leading-tight cursor-pointer group-hover:text-primary transition-colors">
                                    {category.name}
                                  </Label>
                                  {selectedCount > 0 && (
                                    <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                                      {selectedCount} {selectedCount === 1 ? 'seleccionada' : 'seleccionadas'}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => toggleCategoryExpand(category.id)}
                                className={`p-1.5 rounded-full hover:bg-gray-100 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-primary' : 'text-gray-400'}`}
                              >
                                <ChevronDown className="w-5 h-5" />
                              </button>
                            </div>
                            
                            {/* Lista de Subcategorías (Colapsable) */}
                            {isExpanded && (
                              <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                <div className="space-y-2 pt-2 border-t max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                  {category.Subcategories && category.Subcategories.map((sub: any) => (
                                    <div key={sub.id} className="flex items-start space-x-2 group/sub">
                                      <input
                                        type="checkbox"
                                        id={`sub-${sub.id}`}
                                        value={sub.id}
                                        checked={formData.especialidades.includes(sub.id)}
                                        onChange={(e) => handleSpecialtyChange(sub.id, e.target.checked)}
                                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                      />
                                      <Label 
                                        htmlFor={`sub-${sub.id}`} 
                                        className="text-sm leading-tight cursor-pointer group-hover/sub:text-primary transition-colors py-0.5"
                                      >
                                        {sub.name}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 border border-dashed rounded-lg text-center bg-gray-50">
                      <div className="animate-pulse flex flex-col items-center">
                        <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
                        <p className="text-muted-foreground">Cargando catálogo de servicios...</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {errors.especialidades && (
                <p className="text-xs text-destructive col-span-2">{errors.especialidades}</p>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" autoComplete="email" placeholder="tu@email.com" value={formData.email} onChange={handleChange} className={errors.email ? 'border-destructive' : ''} />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña * <span className="text-muted-foreground font-normal">(mín. 8 caracteres)</span></Label>
                <Input id="password" type="password" autoComplete="new-password" placeholder="Tu contraseña" value={formData.password} onChange={handleChange} className={errors.password ? 'border-destructive' : ''} />
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                <Input id="confirmPassword" type="password" autoComplete="new-password" placeholder="Repite tu contraseña" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors(p => ({...p, confirmPassword: ''})); }} className={errors.confirmPassword ? 'border-destructive' : ''} />
                {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button type="submit" className="ml-auto" disabled={isLoading}>
              {isLoading ? 'Registrando...' : 'Crear Cuenta'}
            </Button>
          </div>
        </form>
      </div>
    );
};

export default Register;
