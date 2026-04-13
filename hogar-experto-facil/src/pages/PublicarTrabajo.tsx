import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Send, Save, Info, Clock, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ImageUpload from '@/components/ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/lib/api-config';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const PublicarTrabajo = () => {
  const { user } = useAuth(); // token no viene de useAuth, usualmente está dentro de user
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    urgency: ''
  });
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [date, setDate] = useState<Date>();
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Obtener el token de donde esté guardado (usualmente user.token o localStorage)
  const token = user?.token || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).token : null);

  // Fetch categories from API
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            const formatted = data.map((cat: any) => ({
              id: String(cat.id),
              name: cat.nombre || cat.name
            }));
            setCategories(formatted);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const urgencyOptions = [
    { value: 'low', label: 'No es urgente (1-2 semanas)' },
    { value: 'medium', label: 'Moderado (3-7 días)' },
    { value: 'high', label: 'Urgente (1-2 días)' },
    { value: 'emergency', label: 'Emergencia (hoy)' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImagesChange = (newImages: File[]) => {
    setImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios (*)",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Sesión requerida",
        description: "Debes iniciar sesión para publicar un trabajo",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category_id', formData.category);
      data.append('urgency', formData.urgency);
      
      // Datos extraídos automáticamente del usuario logueado
      // El backend parece esperar clientId o userId según tu indicación
      const clientId = user.id || user.userId || (user as any).clientId;
      if (clientId) data.append('clientId', String(clientId));
      
      if (user.region) data.append('region', user.region);
      if (user.provincia) data.append('provincia', user.provincia);
      if (user.comuna) data.append('comuna', user.comuna);

      if (date) {
        data.append('preferred_date', date.toISOString());
      }
      
      // Adjuntar imágenes
      images.forEach((image) => {
        data.append('images', image);
      });

      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data,
      });

      if (response.ok) {
        toast({
          title: "¡Trabajo publicado!",
          description: "Tu solicitud ha sido enviada a los expertos",
        });
        navigate('/dashboard'); 
      } else {
        const errorData = await response.json();
        // Intentar obtener el mensaje de error de 'error' o 'message'
        const errorMessage = errorData.error || errorData.message || 'Error desconocido en el servidor';
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error("❌ ERROR DETALLADO:", error);
      toast({
        title: "Error al Publicar",
        description: error.message || "No se pudo procesar tu solicitud. Por favor, revisa los datos e intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Publicar un Trabajo</h1>
        <p className="text-muted-foreground">
          Completa los detalles de tu proyecto para recibir ofertas de expertos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Sección: Información Principal */}
        <div className="space-y-4 border rounded-lg p-6 shadow-lg bg-white">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            Información del Proyecto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 col-span-1 md:col-span-2">
              <Label htmlFor="title">Título del Trabajo *</Label>
              <Input
                id="title"
                placeholder="Ej: Reparar filtración en baño principal"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2 col-span-1 md:col-span-2">
              <Label>Especialidad requerida *</Label>
              <Select value={formData.category} onValueChange={(val) => handleInputChange('category', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una especialidad" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-border shadow-lg">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-1 md:col-span-2">
              <Label htmlFor="description">Descripción Detallada *</Label>
              <Textarea
                id="description"
                placeholder="Describe qué necesitas, materiales, dimensiones, etc."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={6}
                required
              />
            </div>
          </div>
        </div>

        {/* Sección: Planificación */}
        <div className="space-y-4 border rounded-lg p-6 shadow-lg bg-white">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Planificación
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Nivel de Urgencia</Label>
              <Select value={formData.urgency} onValueChange={(val) => handleInputChange('urgency', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="¿Para cuándo lo necesitas?" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-border shadow-lg">
                  {urgencyOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fecha Preferida</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-input"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                    {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border border-border shadow-lg" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Sección: Archivos Multimedia */}
        <div className="space-y-4 border rounded-lg p-6 shadow-lg bg-white">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Fotos del Problema (Opcional)
          </h3>
          <ImageUpload onImagesChange={handleImagesChange} maxImages={5} />
          <p className="text-sm text-muted-foreground italic">
            Las imágenes ayudan a los expertos a dar presupuestos más precisos.
          </p>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
          <Button type="button" variant="outline" className="sm:w-40 h-11">
            <Save className="w-4 h-4 mr-2" />
            Guardar Borrador
          </Button>
          <Button type="submit" className="sm:w-48 h-11 btn-primary text-base font-semibold" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Publicando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Publicar Trabajo
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PublicarTrabajo;
