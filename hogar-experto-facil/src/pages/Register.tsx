import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { ChevronDown } from 'lucide-react';
import LocationSelects from '@/components/shared/LocationSelects';
import { API_BASE_URL } from '@/lib/api-config';

const Register = () => {
  const { toast } = useToast();
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
  };

  const handleRegionChange = (value: string) => {
    setFormData(prev => ({ ...prev, region: value, provincia: '', comuna: '' }));
  };

  const handleProvinciaChange = (value: string) => {
    setFormData(prev => ({ ...prev, provincia: value, comuna: '' }));
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
    
    if (formData.password !== confirmPassword) {
      toast({
        title: "Error de Contraseña",
        description: "Las contraseñas no coinciden. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.region || !formData.provincia || !formData.comuna) {
      toast({
        title: "Falta información de ubicación",
        description: "Por favor selecciona tu región, provincia y comuna.",
        variant: "destructive",
      });
      return;
    }

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
        throw new Error(data.message || 'Error en el registro');
      }

      toast({
        title: "Registro Exitoso",
        description: "Se ha creado tu cuenta correctamente. Ahora puedes iniciar sesión.",
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombres">Nombres</Label>
                <Input id="nombres" type="text" autoComplete="given-name" placeholder="Tus nombres" value={formData.nombres} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos</Label>
                <Input id="apellidos" type="text" autoComplete="family-name" placeholder="Tus apellidos" value={formData.apellidos} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input id="telefono" type="tel" autoComplete="tel" placeholder="+56 9 12345678" value={formData.telefono} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="space-y-4 border rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold">Dirección</h3>
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input id="direccion" type="text" placeholder="Tu dirección" value={formData.direccion} onChange={handleChange} required />
            </div>
            <LocationSelects
              selectedRegion={formData.region}
              onRegionChange={handleRegionChange}
              selectedProvincia={formData.provincia}
              onProvinciaChange={handleProvinciaChange}
              selectedComuna={formData.comuna}
              onComunaChange={(value) => setFormData(prev => ({ ...prev, comuna: value }))}
            />
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
                          <div key={category.id} className={`border rounded-xl bg-white shadow-sm transition-all duration-200 ${isExpanded ? 'ring-1 ring-primary/20' : ''}`}>
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

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="email" placeholder="tu@email.com" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" autoComplete="new-password" placeholder="Tu contraseña" value={formData.password} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input id="confirmPassword" type="password" autoComplete="new-password" placeholder="Repite tu contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
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
