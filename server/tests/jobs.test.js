const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');

let clientToken;
let expertToken;
let categoryId;

beforeAll(async () => {
  await sequelize.sync({ force: false });

  // Asegurar categoría disponible
  let cat = await Category.findOne({ where: { slug: 'hogar' } });
  if (!cat) {
    cat = await Category.create({ name: 'Hogar', slug: 'hogar', description: 'Test' });
  }
  categoryId = cat.id;

  // Registrar cliente
  const clientRes = await request(app)
    .post('/api/auth/register/client')
    .send({
      email: `jobclient_${Date.now()}@test.com`,
      password: 'Password123',
      nombres: 'Ana',
      apellidos: 'López',
    });
  clientToken = clientRes.body.token;

  // Registrar experto
  const expertRes = await request(app)
    .post('/api/auth/register/expert')
    .send({
      email: `jobexpert_${Date.now()}@test.com`,
      password: 'Password123',
      nombres: 'Pedro',
      apellidos: 'Soto',
      bio: 'Técnico electricista',
    });
  expertToken = expertRes.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe('GET /api/jobs', () => {
  it('lista trabajos sin autenticación', async () => {
    const res = await request(app).get('/api/jobs');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('POST /api/jobs', () => {
  it('rechaza creación sin token', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .send({ titulo: 'Test', descripcion: 'Test descripcion', category_id: categoryId });
    expect(res.status).toBe(401);
  });

  it('rechaza creación con token de experto', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${expertToken}`)
      .send({ titulo: 'Test', descripcion: 'Test descripcion', category_id: categoryId });
    expect(res.status).toBe(403);
  });

  it('crea un trabajo con token de cliente', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${clientToken}`)
      .field('titulo', 'Arreglo de grifo')
      .field('descripcion', 'Se necesita arreglar el grifo del baño principal')
      .field('category_id', String(categoryId))
      .field('region', 'Metropolitana')
      .field('provincia', 'Santiago')
      .field('comuna', 'Las Condes');

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.titulo).toBe('Arreglo de grifo');
  });
});

describe('GET /api/categories', () => {
  it('retorna categorías con subcategorías', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /api/experts', () => {
  it('retorna lista de expertos', async () => {
    const res = await request(app).get('/api/experts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /health', () => {
  it('responde ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
