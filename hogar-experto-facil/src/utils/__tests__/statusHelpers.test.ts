import { describe, it, expect } from 'vitest';
import { getStatusColor, getStatusText } from '../statusHelpers';
import { JOB_STATUS } from '@/constants';

describe('getStatusText', () => {
  it.each([
    [JOB_STATUS.NEW,         'Nuevo'],
    [JOB_STATUS.APPLIED,     'Aplicado'],
    [JOB_STATUS.ACCEPTED,    'Aceptado'],
    [JOB_STATUS.IN_PROGRESS, 'En Progreso'],
    [JOB_STATUS.COMPLETED,   'Completado'],
    [JOB_STATUS.PENDING,     'Pendiente'],
    [JOB_STATUS.CANCELLED,   'Cancelado'],
  ])('estado "%s" → label "%s"', (status, expected) => {
    expect(getStatusText(status)).toBe(expected);
  });

  it('retorna "Desconocido" para estado no reconocido', () => {
    expect(getStatusText('inexistente')).toBe('Desconocido');
  });
});

describe('getStatusColor', () => {
  it('retorna clases CSS para estados conocidos', () => {
    expect(getStatusColor(JOB_STATUS.PENDING)).toContain('yellow');
    expect(getStatusColor(JOB_STATUS.COMPLETED)).toContain('green');
    expect(getStatusColor(JOB_STATUS.CANCELLED)).toContain('red');
    expect(getStatusColor(JOB_STATUS.IN_PROGRESS)).toContain('purple');
  });

  it('retorna clases grises para estado desconocido', () => {
    expect(getStatusColor('fantasma')).toBe('text-gray-600 bg-gray-50');
  });
});
