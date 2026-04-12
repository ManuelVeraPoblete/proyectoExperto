
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Image, X, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImagesChange, maxImages = 5 }) => {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Validar número máximo de imágenes
    if (images.length + files.length > maxImages) {
      toast({
        title: "Límite de imágenes excedido",
        description: `Solo puedes subir un máximo de ${maxImages} imágenes`,
        variant: "destructive"
      });
      return;
    }

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Formato no válido",
        description: "Solo se permiten archivos JPG, PNG y WebP",
        variant: "destructive"
      });
      return;
    }

    // Validar tamaño de archivo (5MB máximo)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      toast({
        title: "Archivo muy grande",
        description: "Cada imagen debe ser menor a 5MB",
        variant: "destructive"
      });
      return;
    }

    const validFiles = files.filter(file => 
      validTypes.includes(file.type) && file.size <= maxSize
    );

    // Crear previews
    const newPreviews: string[] = [];
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        if (newPreviews.length === validFiles.length) {
          const updatedImages = [...images, ...validFiles];
          const updatedPreviews = [...previews, ...newPreviews];
          
          setImages(updatedImages);
          setPreviews(updatedPreviews);
          onImagesChange(updatedImages);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    
    setImages(updatedImages);
    setPreviews(updatedPreviews);
    onImagesChange(updatedImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Área de subida */}
      <div 
        className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-2">
          <Upload className="w-8 h-8 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Haz clic para subir imágenes
            </p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG o WebP (máx. 5MB cada una)
            </p>
          </div>
          <Button type="button" variant="outline" size="sm">
            <Image className="w-4 h-4 mr-2" />
            Seleccionar imágenes
          </Button>
        </div>
      </div>

      {/* Preview de imágenes */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-border"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                {Math.round(images[index].size / 1024)}KB
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Información adicional */}
      <div className="text-xs text-muted-foreground">
        {images.length} de {maxImages} imágenes subidas
      </div>
    </div>
  );
};

export default ImageUpload;
