import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  MapPin, CircleDollarSign, CheckCircle2, Clock, XCircle, Send, Lightbulb,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { trabajoService } from '@/services/api/trabajoService';
import { ApiApplication } from '@/services/api/applicationService';
import { useAuth } from '@/contexts/AuthContext';

interface JobSummary {
  id: string;
  titulo: string;
  presupuesto?: number;
  comuna?: string;
  region?: string;
  cliente_nombres?: string;
  cliente_apellidos?: string;
}

interface ApplyJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobSummary | null;
  existingApplication?: ApiApplication | null;
}

const ESTADO_CONFIG = {
  pendiente: {
    label: 'En revisión',
    icon: Clock,
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  aceptado: {
    label: 'Aceptado',
    icon: CheckCircle2,
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  rechazado: {
    label: 'No seleccionado',
    icon: XCircle,
    className: 'bg-red-100 text-red-800 border-red-200',
  },
} as const;

const QUICK_PHRASES = [
  'Tengo amplia experiencia en este tipo de trabajo.',
  'Puedo comenzar de inmediato.',
  'Ofrezco garantía en todos mis trabajos.',
  'Trabajo con materiales de primera calidad.',
];

const ApplyJobModal: React.FC<ApplyJobModalProps> = ({
  isOpen, onClose, job, existingApplication,
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [mensaje, setMensaje] = useState('');
  const [presupuesto, setPresupuesto] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const applyMutation = useMutation({
    mutationFn: () =>
      trabajoService.applyToJob(job!.id, {
        mensaje: mensaje.trim(),
        presupuesto_ofrecido: presupuesto ? parseFloat(presupuesto.replace(/\./g, '')) : undefined,
      }),
    onSuccess: () => {
      toast({ title: 'Postulación enviada', description: 'El cliente recibirá tu propuesta en breve.' });
      queryClient.invalidateQueries({ queryKey: ['my-applications', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['job-offers'] });
      handleClose();
    },
    onError: (err: any) => {
      const isConflict = err?.message?.includes('409') || err?.status === 409;
      toast({
        title: 'Error',
        description: isConflict ? 'Ya te postulaste a este trabajo.' : 'No se pudo enviar la postulación.',
        variant: 'destructive',
      });
    },
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (mensaje.trim().length < 10) e.mensaje = 'La propuesta debe tener al menos 10 caracteres.';
    if (mensaje.trim().length > 500) e.mensaje = 'La propuesta no puede superar los 500 caracteres.';
    if (presupuesto) {
      const val = parseFloat(presupuesto.replace(/\./g, ''));
      if (isNaN(val) || val <= 0) e.presupuesto = 'Ingresa un valor válido mayor a 0.';
    }
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    applyMutation.mutate();
  };

  const handleClose = () => {
    if (applyMutation.isPending) return;
    setMensaje('');
    setPresupuesto('');
    setErrors({});
    onClose();
  };

  const addQuickPhrase = (phrase: string) => {
    setMensaje((prev) => {
      const base = prev.trim();
      return base ? `${base} ${phrase}` : phrase;
    });
    setErrors((p) => { const { mensaje: _, ...r } = p; return r; });
  };

  const formatBudget = (val: string) => {
    const digits = val.replace(/\D/g, '');
    if (!digits) return '';
    return Number(digits).toLocaleString('es-CL');
  };

  if (!job) return null;

  const clientName = job.cliente_nombres
    ? `${job.cliente_nombres} ${job.cliente_apellidos ?? ''}`.trim()
    : 'Cliente';

  const estadoCfg = existingApplication
    ? ESTADO_CONFIG[existingApplication.estado]
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Send className="w-5 h-5 text-primary" />
            {existingApplication ? 'Tu Postulación' : 'Enviar Propuesta'}
          </DialogTitle>
        </DialogHeader>

        {/* Resumen del trabajo */}
        <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
          <h3 className="font-semibold text-foreground">{job.titulo}</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {(job.comuna || job.region) && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {[job.comuna, job.region].filter(Boolean).join(', ')}
              </span>
            )}
            {job.presupuesto && job.presupuesto > 0 && (
              <span className="flex items-center gap-1">
                <CircleDollarSign className="w-3.5 h-3.5" />
                ${Number(job.presupuesto).toLocaleString('es-CL')} estimado
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Cliente: {clientName}</p>
        </div>

        {/* ── Ya postulado: vista de solo lectura ── */}
        {existingApplication && estadoCfg ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Estado:</span>
              <Badge className={`flex items-center gap-1 border ${estadoCfg.className}`}>
                <estadoCfg.icon className="w-3.5 h-3.5" />
                {estadoCfg.label}
              </Badge>
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-medium">Tu propuesta enviada</Label>
              <div className="rounded-lg border border-border bg-muted/20 p-3 text-sm text-muted-foreground leading-relaxed">
                {existingApplication.mensaje}
              </div>
            </div>

            {existingApplication.presupuesto_ofrecido && (
              <div className="space-y-1">
                <Label className="text-sm font-medium">Presupuesto ofrecido</Label>
                <p className="text-sm font-semibold text-primary">
                  ${Number(existingApplication.presupuesto_ofrecido).toLocaleString('es-CL')}
                </p>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Postulado el {new Date(existingApplication.createdAt).toLocaleDateString('es-CL', {
                day: '2-digit', month: 'long', year: 'numeric',
              })}
            </p>
          </div>
        ) : (
          /* ── Formulario de postulación ── */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Mensaje */}
            <div className="space-y-2">
              <Label htmlFor="apply-mensaje">
                Tu propuesta <span className="text-destructive">*</span>
              </Label>

              {/* Sugerencias rápidas */}
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PHRASES.map((phrase) => (
                  <button
                    key={phrase}
                    type="button"
                    onClick={() => addQuickPhrase(phrase)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
                  >
                    <Lightbulb className="w-3 h-3" />
                    {phrase.split(' ').slice(0, 4).join(' ')}…
                  </button>
                ))}
              </div>

              <Textarea
                id="apply-mensaje"
                rows={4}
                disabled={applyMutation.isPending}
                value={mensaje}
                onChange={(e) => {
                  setMensaje(e.target.value);
                  setErrors((p) => { const { mensaje: _, ...r } = p; return r; });
                }}
                placeholder="Describe tu experiencia, disponibilidad y por qué eres la mejor opción para este trabajo..."
                className="resize-none"
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                {errors.mensaje
                  ? <p className="text-xs text-destructive">{errors.mensaje}</p>
                  : <span />}
                <p className={`text-xs ml-auto ${mensaje.length > 450 ? 'text-orange-500' : 'text-muted-foreground'}`}>
                  {mensaje.length}/500
                </p>
              </div>
            </div>

            <Separator />

            {/* Presupuesto */}
            <div className="space-y-1.5">
              <Label htmlFor="apply-presupuesto">
                Tu presupuesto <span className="text-xs font-normal text-muted-foreground">(opcional)</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">$</span>
                <Input
                  id="apply-presupuesto"
                  className="pl-7"
                  placeholder="150.000"
                  disabled={applyMutation.isPending}
                  value={presupuesto}
                  onChange={(e) => {
                    setPresupuesto(formatBudget(e.target.value));
                    setErrors((p) => { const { presupuesto: _, ...r } = p; return r; });
                  }}
                />
              </div>
              {errors.presupuesto && <p className="text-xs text-destructive">{errors.presupuesto}</p>}
              <p className="text-xs text-muted-foreground">
                Indica cuánto cobrarías por este trabajo en pesos chilenos.
              </p>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={handleClose} disabled={applyMutation.isPending}>
                Cancelar
              </Button>
              <Button type="submit" disabled={applyMutation.isPending} className="gap-2">
                {applyMutation.isPending ? (
                  <>Enviando...</>
                ) : (
                  <><Send className="w-4 h-4" /> Enviar Postulación</>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}

        {existingApplication && (
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>Cerrar</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApplyJobModal;
