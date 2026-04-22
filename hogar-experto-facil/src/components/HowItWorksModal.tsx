
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      title: 'Describe tu proyecto',
      description: 'Cuéntanos qué necesitas y te conectaremos con expertos especializados en tu área.',
    },
    {
      title: 'Compara y elige',
      description: 'Revisa perfiles, calificaciones y presupuestos. Contacta directamente con quien prefieras.',
    },
    {
      title: 'Trabajo terminado',
      description: 'El experto realiza el trabajo y tú calificas la experiencia para ayudar a otros usuarios.',
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">¿Cómo Funciona?</DialogTitle>
          <DialogDescription className="text-center">
            Encuentra al experto ideal para tu proyecto en 3 simples pasos.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="font-bold text-primary">{index + 1}</span>
              </div>
              <div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Entendido</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HowItWorksModal;
