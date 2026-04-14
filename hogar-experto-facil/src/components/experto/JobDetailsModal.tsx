import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  MapPin,
  Tag,
  Briefcase,
  CircleDollarSign,
  Send,
  CheckCircle2,
  Image as ImageIcon,
  Search,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api-config";
import ApplyJobModal from "./ApplyJobModal";
import { ApiApplication } from "@/services/api/applicationService";

interface JobDetailsModalProps {
  trabajo: any | null;
  isOpen: boolean;
  onClose: () => void;
  onContact?: (clientId: string) => void;
  existingApplication?: ApiApplication | null;
}

export function JobDetailsModal({
  trabajo,
  isOpen,
  onClose,
  existingApplication,
}: JobDetailsModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  if (!trabajo) {
    return null;
  }

  const clientData = trabajo.cliente || trabajo.User || trabajo.Client;
  const clientName = trabajo.cliente_nombres || clientData?.nombres || clientData?.nombre || 'Cliente';
  const clientLastName = trabajo.cliente_apellidos || clientData?.apellidos || clientData?.apellido || '';
  const clientId = trabajo.clientId || clientData?.id;
  const serverUrl = API_BASE_URL.replace('/api', '');

  // Preparar URLs de fotos
  const photos = trabajo.Fotos?.map((foto: any) => 
    foto.photo_url.startsWith('http') ? foto.photo_url : `${serverUrl}${foto.photo_url}`
  ) || [];

  const isAlreadyApplied = !!existingApplication;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev! === 0 ? photos.length - 1 : prev! - 1));
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev! === photos.length - 1 ? 0 : prev! + 1));
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="p-6">
            <DialogTitle className="text-2xl font-bold text-foreground">
              {trabajo.titulo}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Detalles del trabajo publicado por el cliente
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 pb-6 flex flex-col gap-6">
            {/* Client Info */}
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-primary/10">
                <AvatarImage
                  src={clientData?.fotoPerfil || clientData?.avatar || trabajo.cliente_avatar}
                  alt={clientName}
                />
                <AvatarFallback className="bg-primary/5 text-primary font-bold">
                  {(clientName.charAt(0) || "C")}
                  {(clientLastName.charAt(0) || "")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground text-lg leading-tight">
                  {clientName} {clientLastName}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Cliente Verificado
                </p>
              </div>
            </div>

            <Separator />

            {/* Job Description */}
            <div>
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                Descripción del Proyecto
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {trabajo.descripcion || trabajo.description}
              </p>
            </div>

            {/* Galería de Fotos */}
            {photos.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  Fotos del Trabajo ({photos.length})
                </h4>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {photos.map((url: string, index: number) => (
                    <div 
                      key={index} 
                      className="group relative flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden border-2 border-transparent hover:border-primary transition-all duration-300 shadow-sm cursor-zoom-in"
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img 
                        src={url} 
                        alt={`Foto ${index + 1}`} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Search className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Job Details Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50/50 p-3 rounded-xl border border-border/50">
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-xs uppercase tracking-wider text-gray-500">Categoría</span>
                </div>
                <span className="text-foreground font-medium pl-6 block truncate">
                  {trabajo.Category?.name || trabajo.categoria}
                </span>
              </div>

              <div className="bg-gray-50/50 p-3 rounded-xl border border-border/50">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-xs uppercase tracking-wider text-gray-500">Ubicación</span>
                </div>
                <span className="text-foreground font-medium pl-6 block">
                  {trabajo.comuna}, {trabajo.region}
                </span>
              </div>

              <div className="bg-gray-50/50 p-3 rounded-xl border border-border/50">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarDays className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-xs uppercase tracking-wider text-gray-500">Publicado</span>
                </div>
                <span className="text-foreground font-medium pl-6 block">
                  {trabajo.createdAt ? new Date(trabajo.createdAt).toLocaleDateString("es-CL", { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                </span>
              </div>

              <div className="bg-gray-50/50 p-3 rounded-xl border border-border/50">
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-xs uppercase tracking-wider text-gray-500">Estado</span>
                </div>
                <div className="pl-6 pt-1">
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-none capitalize text-[10px] font-bold">
                    {trabajo.estado || 'Activo'}
                  </Badge>
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 col-span-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CircleDollarSign className="w-5 h-5 text-primary" />
                    <span className="font-bold text-foreground">Presupuesto Estimado</span>
                  </div>
                  <span className="font-black text-primary text-xl">
                    {trabajo.presupuesto && trabajo.presupuesto > 0 
                      ? `$${Number(trabajo.presupuesto).toLocaleString("es-CL", { maximumFractionDigits: 0 })}` 
                      : 'A convenir'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="bg-gray-50 p-4 flex justify-end gap-2 rounded-b-lg border-t">
            <Button variant="ghost" onClick={onClose}>Cerrar</Button>
            {isAlreadyApplied ? (
              <Button
                variant="outline"
                onClick={() => setIsApplyOpen(true)}
                className="gap-2 border-green-300 text-green-700 bg-green-50 hover:bg-green-100"
              >
                <CheckCircle2 className="w-4 h-4" />
                Ver mi postulación
              </Button>
            ) : (
              <Button onClick={() => setIsApplyOpen(true)} className="btn-primary px-8 gap-2">
                <Send className="w-4 h-4" />
                Enviar Propuesta
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ApplyJobModal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        job={trabajo}
        existingApplication={existingApplication}
      />

      {/* Visor de Imagen Pro con Navegación y Tamaño Contenido */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={() => setSelectedImageIndex(null)}>
        <DialogContent className="max-w-[60vw] p-0 bg-transparent border-none shadow-none flex items-center justify-center overflow-visible">
          <DialogDescription className="sr-only">Vista ampliada de la foto</DialogDescription>
          <div className="relative group flex flex-col items-center">
            {/* Imagen Ampliada (Máximo 50-60% del ancho) */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-black/10 backdrop-blur-sm border border-white/20">
              <img 
                src={selectedImageIndex !== null ? photos[selectedImageIndex] : ''} 
                alt="Vista ampliada" 
                className="max-h-[70vh] w-auto object-contain animate-in zoom-in-95 duration-300"
              />
              
              {/* Contador de Fotos */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-white text-xs font-medium">
                {selectedImageIndex! + 1} / {photos.length}
              </div>
            </div>

            {/* Controles de Navegación Lateral */}
            {photos.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-[-60px] top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/30 text-white border-none backdrop-blur-lg hidden md:flex transition-all"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-[-60px] top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/30 text-white border-none backdrop-blur-lg hidden md:flex transition-all"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}

            {/* Botón de Cerrar Flotante */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-[-20px] right-[-20px] rounded-full bg-red-500/80 hover:bg-red-500 text-white border-none shadow-lg z-50"
              onClick={() => setSelectedImageIndex(null)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
