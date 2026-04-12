
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare, User } from 'lucide-react';
import { clients } from '@/lib/mock-data';
import useMyJobs from '@/hooks/useMyJobs';
import MyJobItem from '@/components/experto/MyJobItem';
import CompletedJobItem from '@/components/experto/CompletedJobItem';
import ClientProfileModal from '@/components/ClientProfileModal';
import { ChatDialog } from '@/components/ChatDialog';
import { Message } from '@/types';

const MisTrabajosExperto = () => {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const { activeJobs, completedJobs, getStatusColor, getStatusText } = useMyJobs();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatParticipantName, setChatParticipantName] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [selectedChatClientId, setSelectedChatClientId] = useState<string | null>(null);

  const handleContactClient = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setSelectedClient(client);
      setIsClientModalOpen(true);
    }
  };

  const handleSendMessage = (message: string) => {
    console.log(`Enviando mensaje a ${chatParticipantName}: ${message}`);
    setChatMessages((prevMessages) => [
      ...prevMessages,
      {
        id: Date.now().toString(),
        sender: "me" as const,
        text: message,
        timestamp: new Date().toISOString(),
        read: true,
      },
    ]);
    // Aquí se enviaría el mensaje a la API
  };

  const handleViewClientProfile = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setSelectedClient(client);
      setIsClientModalOpen(true);
    }
  };

  const handleCloseClientModal = () => {
    setIsClientModalOpen(false);
    setSelectedClient(null);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-4">Mis Trabajos</h1>
      

      {/* Trabajos Activos */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Trabajos Activos</CardTitle>
        </CardHeader>
        <CardContent>
          {activeJobs.length > 0 ? (
            <div className="space-y-4">
              {activeJobs.map((job) => (
                <MyJobItem 
                  key={job.id} 
                  job={job} 
                  getStatusColor={getStatusColor} 
                  getStatusText={getStatusText} 
                  onContact={handleContactClient}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No tienes trabajos activos en este momento.</p>
          )}
        </CardContent>
      </Card>

      {/* Trabajos Completados */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Trabajos Completados</CardTitle>
        </CardHeader>
        <CardContent>
          {completedJobs.length > 0 ? (
            <div className="space-y-4">
              {completedJobs.map((job) => (
                <CompletedJobItem 
                  key={job.id} 
                  job={job} 
                  onViewClientProfile={handleViewClientProfile}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Aún no hay trabajos completados.</p>
          )}
        </CardContent>
      </Card>

      <ClientProfileModal
        isOpen={isClientModalOpen}
        onClose={handleCloseClientModal}
        client={selectedClient}
      />

      <ChatDialog
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        participantName={chatParticipantName}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
      />
    </main>
  );
};

export default MisTrabajosExperto;
