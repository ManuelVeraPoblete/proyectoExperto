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
import { Mail, Phone, Briefcase, CalendarDays, ShieldCheck } from "lucide-react";
import {
  EXPERTO_STATUS,
  EXPERTO_STATUS_CONFIG,
  ExpertoVerificationStatus,
} from "@/constants";

interface PendingUser {
  id: string;
  name: string;
  type: string;
  email: string;
  specialty: string | null;
  date: string;
  telefono?: string;
  verificationStatus?: ExpertoVerificationStatus;
}

interface UserDetailsModalProps {
  user: PendingUser | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: ExpertoVerificationStatus) => void;
}

const StatusBadge = ({ status }: { status: ExpertoVerificationStatus }) => {
  const cfg = EXPERTO_STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.colorClass}`}>
      {cfg.label}
    </span>
  );
};

export function UserDetailsModal({
  user,
  isOpen,
  onClose,
  onStatusChange,
}: UserDetailsModalProps) {
  if (!user) return null;

  const isExperto = user.type === "experto";
  const currentStatus = user.verificationStatus ?? EXPERTO_STATUS.PENDIENTE;

  const handleStatus = (status: ExpertoVerificationStatus) => {
    onStatusChange(user.id, status);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {user.name}
          </DialogTitle>
          <DialogDescription>
            {isExperto ? "Experto" : "Cliente"} — solicitud del {user.date}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </div>

          {user.telefono && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground">{user.telefono}</span>
            </div>
          )}

          {isExperto && user.specialty && (
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground">{user.specialty}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground">{user.date}</span>
          </div>

          {isExperto && (
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm font-medium">Estado:</span>
              <StatusBadge status={currentStatus} />
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm" onClick={onClose} className="sm:mr-auto">
            Cerrar
          </Button>

          {isExperto ? (
            <>
              {currentStatus !== EXPERTO_STATUS.ANULADO && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleStatus(EXPERTO_STATUS.ANULADO)}
                >
                  Anular
                </Button>
              )}
              {currentStatus !== EXPERTO_STATUS.PENDIENTE && currentStatus === EXPERTO_STATUS.ANULADO && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleStatus(EXPERTO_STATUS.PENDIENTE)}
                >
                  Restablecer
                </Button>
              )}
              {currentStatus !== EXPERTO_STATUS.ACTIVO && (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleStatus(EXPERTO_STATUS.ACTIVO)}
                >
                  Activar
                </Button>
              )}
            </>
          ) : (
            <Button size="sm" onClick={onClose}>
              Cerrar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
