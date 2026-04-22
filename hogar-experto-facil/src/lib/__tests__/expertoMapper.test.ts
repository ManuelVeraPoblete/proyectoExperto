import { describe, it, expect } from 'vitest';
import { mapApiExpertoToCardData, ApiExperto } from '../expertoMapper';

const baseExperto: ApiExperto = {
  id: '1',
  nombres: 'Pedro',
  apellidos: 'Soto',
  rating: '4.8',
  reviewCount: 12,
  comuna: 'Providencia',
  region: 'Metropolitana',
};

describe('mapApiExpertoToCardData', () => {
  it('mapea campos básicos correctamente', () => {
    const result = mapApiExpertoToCardData(baseExperto);
    expect(result.id).toBe('1');
    expect(result.nombres).toBe('Pedro');
    expect(result.apellidos).toBe('Soto');
    expect(result.calificacion).toBe(4.8);
    expect(result.reviewCount).toBe(12);
    expect(result.comuna).toBe('Providencia');
  });

  it('usa alias nombre/apellido si no existen nombres/apellidos', () => {
    const exp: ApiExperto = { id: '2', nombre: 'Ana', apellido: 'Ruiz' };
    const result = mapApiExpertoToCardData(exp);
    expect(result.nombres).toBe('Ana');
    expect(result.apellidos).toBe('Ruiz');
  });

  it('extrae categorías de Categories (array de objetos)', () => {
    const exp: ApiExperto = {
      id: '3',
      Categories: [{ nombre: 'Plomería' }, { name: 'Electricidad' }],
    };
    const result = mapApiExpertoToCardData(exp);
    expect(result.especialidades).toContain('Plomería');
    expect(result.especialidades).toContain('Electricidad');
  });

  it('extrae categorías de especialidades (array de strings)', () => {
    const exp: ApiExperto = {
      id: '4',
      especialidades: ['Pintura', 'Jardinería'],
    };
    const result = mapApiExpertoToCardData(exp);
    expect(result.especialidades).toEqual(['Pintura', 'Jardinería']);
  });

  it('usa fallback categoria cuando no hay arrays de categorías', () => {
    const exp: ApiExperto = { id: '5', categoria: 'Construcción' };
    const result = mapApiExpertoToCardData(exp);
    expect(result.especialidades).toContain('Construcción');
  });

  it('elimina categorías duplicadas', () => {
    const exp: ApiExperto = {
      id: '6',
      Categories: [{ nombre: 'Plomería' }],
      especialidades: ['Plomería'],
    };
    const result = mapApiExpertoToCardData(exp);
    const count = result.especialidades.filter(e => e === 'Plomería').length;
    expect(count).toBe(1);
  });

  it('aplica valores por defecto cuando faltan campos', () => {
    const exp: ApiExperto = { id: '7' };
    const result = mapApiExpertoToCardData(exp);
    expect(result.nombres).toBe('');
    expect(result.calificacion).toBe(0);
    expect(result.isVerified).toBe(true);
    expect(result.reviews).toEqual([]);
    expect(result.completedJobs).toEqual([]);
  });
});
