import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Briefcase, CalendarDays } from "lucide-react";

interface UserDetailsModalProps {
  user: {
    id: number;
    name: string;
    type: string;
    email: string;
    specialty: string | null;
    date: string;
    telefono?: string; // Añadir la propiedad de teléfono
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: number, name: string) => void;
  onReject: (id: number, name: string) => void;
}

export function UserDetailsModal({
  user,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: UserDetailsModalProps) {
  if (!user) {
    return null;
  }

  const getUserTypeText = (type: string) => {
    switch (type) {
      case "experto":
        return "Experto";
      case "client":
        return "Cliente";
      default:
        return "Usuario";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Detalles de {user.name}
          </DialogTitle>
          <DialogDescription>
            Información completa de la solicitud de {getUserTypeText(user.type)}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold">Email:</span>
            <span className="text-muted-foreground">{user.email}</span>
          </div>
          {user.telefono && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold">Teléfono:</span>
              <span className="text-muted-foreground">{user.telefono}</span>
            </div>
          )}
          {user.type === "experto" && user.specialty && (
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold">Especialidad:</span>
              <span className="text-muted-foreground">{user.specialty}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold">Tipo de Usuario:</span>
            <Badge>{getUserTypeText(user.type)}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold">Fecha de Solicitud:</span>
            <span className="text-muted-foreground">{user.date}</span>
          </div>
        </div>
        <DialogFooter className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => {
              onReject(user.id, user.name);
              onClose();
            }}
          >
            Rechazar
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cerrar
            </Button>
            <Button
              onClick={() => {
                onApprove(user.id, user.name);
                onClose();
              }}
            >
              Aprobar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
