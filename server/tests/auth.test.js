const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');

// Datos de prueba
const clientData = {
  email: `testclient_${Date.now()}@test.com`,
  password: 'Password123',
  nombres: 'Juan',
  apellidos: 'Pérez',
};

const expertData = {
  email: `testexpert_${Date.now()}@test.com`,
  password: 'Password123',
  nombres: 'María',
  apellidos: 'González',
  bio: 'Experta en plomería con 10 años de experiencia',
};

beforeAll(async () => {
  await sequelize.sync({ force: false });
});

afterAll(async () => {
  await sequelize.close();
});

describe('POST /api/auth/register/client', () => {
  it('registra un cliente con datos válidos', async () => {
    const res = await request(app)
      .post('/api/auth/register/client')
      .send(clientData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(clientData.email);
    expect(res.body.user.userType).toBe('cliente');
  });

  it('rechaza email duplicado', async () => {
    const res = await request(app)
      .post('/api/auth/register/client')
      .send(clientData);

    expect(res.status).toBe(409);
  });

  it('rechaza email inválido', async () => {
    const res = await request(app)
      .post('/api/auth/register/client')
      .send({ ...clientData, email: 'no-es-email' });

    expect(res.status).toBe(400);
  });

  it('rechaza contraseña corta', async () => {
    const res = await request(app)
      .post('/api/auth/register/client')
      .send({ ...clientData, email: 'otro@test.com', password: '123' });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/register/expert', () => {
  it('registra un experto con datos válidos', async () => {
    const res = await request(app)
      .post('/api/auth/register/expert')
      .send(expertData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.userType).toBe('experto');
  });
});

describe('POST /api/auth/login', () => {
  it('hace login con credenciales correctas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: clientData.email, password: clientData.password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(clientData.email);
  });

  it('rechaza contraseña incorrecta', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: clientData.email, password: 'wrongpass' });

    expect(res.status).toBe(401);
  });

  it('rechaza email inexistente', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'noexiste@test.com', password: 'Password123' });

    expect(res.status).toBe(401);
  });

  it('rechaza body vacío', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(res.status).toBe(400);
  });
});
