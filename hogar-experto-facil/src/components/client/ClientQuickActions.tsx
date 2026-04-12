
import React from 'react';
import { Search, Plus, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ActionCard from '@/components/shared/ActionCard';

const ClientQuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ActionCard
        title="Buscar Expertos"
        description="Encuentra expertos para tu proyecto"
        icon={Search}
        iconBgColor="bg-primary/10"
        iconColor="text-primary"
        onClick={() => navigate('/buscar')}
      />

      <ActionCard
        title="Publicar Trabajo"
        description="Describe tu proyecto y recibe ofertas"
        icon={Plus}
        iconBgColor="bg-secondary/10"
        iconColor="text-secondary"
        onClick={() => navigate('/publicar')}
      />

      <ActionCard
        title="Mensajes Directos"
        description="Revisa tus conversaciones con expertos"
        icon={MessageSquare}
        iconBgColor="bg-blue-500/10"
        iconColor="text-blue-500"
        onClick={() => navigate('/mensajes')}
      />
    </div>
  );
};

export default ClientQuickActions;
