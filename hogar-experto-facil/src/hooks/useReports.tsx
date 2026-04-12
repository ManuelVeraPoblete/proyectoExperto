
import { useState } from 'react';
import { Report } from '@/types/report';

// Mock data para demostrar funcionalidad
const mockReports: Report[] = [
  {
    id: 1,
    type: 'language',
    content: 'Lenguaje ofensivo en mensaje',
    reporter: 'Juan Pérez',
    reporterId: 'user123',
    reportedUserId: 'user456',
    reportedUserName: 'Usuario Problemático',
    reportedContent: 'Este es un ejemplo de contenido reportado por lenguaje inapropiado.',
    date: '2024-01-15',
    status: 'pending',
    reason: 'Lenguaje ofensivo',
    description: 'El usuario utilizó palabras inapropiadas en el chat.'
  },
  {
    id: 2,
    type: 'user',
    content: 'Comportamiento inapropiado',
    reporter: 'María González',
    reporterId: 'user789',
    reportedUserId: 'user101',
    reportedUserName: 'Usuario Sospechoso',
    date: '2024-01-14',
    status: 'reviewed',
    reason: 'Comportamiento inapropiado',
    description: 'El usuario ha estado enviando mensajes acosadores.'
  },
  {
    id: 3,
    type: 'post',
    content: 'Publicación ofensiva',
    reporter: 'Carlos López',
    reporterId: 'user456',
    reportedContent: 'Contenido de la publicación que viola las normas de la comunidad.',
    date: '2024-01-13',
    status: 'resolved',
    reason: 'Contenido ofensivo',
    description: 'La publicación contiene material inapropiado.'
  }
];

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>(mockReports);

  const updateReportStatus = (reportId: number, status: Report['status']) => {
    setReports(prev => prev.map(report => 
      report.id === reportId ? { ...report, status } : report
    ));
  };

  const deleteReport = (reportId: number) => {
    setReports(prev => prev.filter(report => report.id !== reportId));
  };

  const addReport = (report: Omit<Report, 'id'>) => {
    const newReport: Report = {
      ...report,
      id: Math.max(...reports.map(r => r.id)) + 1
    };
    setReports(prev => [...prev, newReport]);
  };

  const getPendingReports = () => {
    return reports.filter(report => report.status === 'pending');
  };

  return {
    reports,
    updateReportStatus,
    deleteReport,
    addReport,
    getPendingReports
  };
};
