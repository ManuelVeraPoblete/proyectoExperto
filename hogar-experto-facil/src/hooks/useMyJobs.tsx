
import { useState } from 'react';
import { clients } from '@/lib/mock-data';

const useMyJobs = () => {
  const activeJobs = [
    {
      id: 1,
      title: 'Reparación grifo cocina',
      client: 'María González',
      status: 'in-progress',
      date: '20 Jun 2024',
      payment: '$45.000',
      clientId: 'c1'
    },
    {
      id: 2,
      title: 'Instalación calefont',
      client: 'Carlos Ramírez',
      status: 'in-progress',
      date: '18 Jun 2024',
      payment: '$120.000',
      clientId: 'c2'
    }
  ];

  const completedJobs = [
    {
      id: 3,
      title: 'Cambio de enchufe',
      client: 'Laura Fernández',
      status: 'completed',
      date: '15 Jun 2024',
      payment: '$25.000',
      rating: 5,
      comment: 'Muy profesional y rápido. Excelente trabajo.',
      clientId: 'c1'
    },
    {
      id: 4,
      title: 'Pintura de habitación',
      client: 'Pedro Soto',
      status: 'completed',
      date: '10 Jun 2024',
      payment: '$90.000',
      rating: 4,
      comment: 'Buen trabajo, aunque tardó un poco más de lo esperado.',
      clientId: 'c2'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'text-purple-600 bg-purple-50';
      case 'completed': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in-progress': return 'En Progreso';
      case 'completed': return 'Completado';
      default: return 'Desconocido';
    }
  };

  return {
    activeJobs,
    completedJobs,
    getStatusColor,
    getStatusText,
  };
};

export default useMyJobs;
