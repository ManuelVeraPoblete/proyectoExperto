import { describe, it, expect } from 'vitest';
import { normalizeUser } from '../userNormalizer';
import { ROLES } from '@/constants';

describe('normalizeUser', () => {
  it('retorna null si recibe null', () => {
    expect(normalizeUser(null)).toBeNull();
  });

  it('retorna null si recibe dato sin id', () => {
    expect(normalizeUser({ email: 'x@x.com' })).toBeNull();
  });

  it('normaliza usuario plano correctamente', () => {
    const raw = {
      id: '42',
      nombres: 'Juan',
      apellidos: 'Pérez',
      email: 'juan@mail.com',
      userType: 'client',
    };

    const result = normalizeUser(raw);
    expect(result).not.toBeNull();
    expect(result?.id).toBe('42');
    expect(result?.nombres).toBe('Juan');
    expect(result?.apellidos).toBe('Pérez');
    expect(result?.userType).toBe(ROLES.CLIENT);
  });

  it('extrae datos de estructura anidada data.user', () => {
    const raw = {
      data: {
        user: {
          id: '10',
          nombres: 'Ana',
          apellidos: 'García',
          email: 'ana@mail.com',
          userType: 'experto',
        },
      },
    };

    const result = normalizeUser(raw);
    expect(result?.id).toBe('10');
    expect(result?.userType).toBe(ROLES.EXPERTO);
  });

  it('mapea role_id numérico a UserRole', () => {
    const admin = normalizeUser({ id: '1', email: 'a@b.com', role_id: 1 });
    expect(admin?.userType).toBe(ROLES.ADMIN);

    const experto = normalizeUser({ id: '2', email: 'a@b.com', role_id: 2 });
    expect(experto?.userType).toBe(ROLES.EXPERTO);

    const client = normalizeUser({ id: '3', email: 'a@b.com', role_id: 3 });
    expect(client?.userType).toBe(ROLES.CLIENT);
  });

  it('aplana campos del profile cuando existen', () => {
    const raw = {
      id: '5',
      email: 'x@y.com',
      userType: 'client',
      profile: {
        nombres: 'Carlos',
        apellidos: 'López',
        region: 'Metropolitana',
        comuna: 'Santiago',
      },
    };

    const result = normalizeUser(raw);
    expect(result?.nombres).toBe('Carlos');
    expect(result?.region).toBe('Metropolitana');
    expect(result?.comuna).toBe('Santiago');
  });

  it('usa campos alternativos de nombre (nombre, first_name, name)', () => {
    const cases = [
      { id: '1', email: 'a@b.com', nombre: 'Luis', apellido: 'Ríos' },
      { id: '2', email: 'b@c.com', first_name: 'Pedro', last_name: 'Soto' },
      { id: '3', email: 'c@d.com', name: 'María' },
    ];

    expect(normalizeUser(cases[0])?.nombres).toBe('Luis');
    expect(normalizeUser(cases[1])?.nombres).toBe('Pedro');
    expect(normalizeUser(cases[2])?.nombres).toBe('María');
  });

  it('asigna CLIENT por defecto cuando no se reconoce el rol', () => {
    const result = normalizeUser({ id: '99', email: 'x@y.com', role: 'desconocido' });
    expect(result?.userType).toBe(ROLES.CLIENT);
  });
});
