const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ProyectoExperto API',
      version: '1.0.0',
      description: 'API REST para el marketplace de servicios hogar-experto-facil',
    },
    servers: [
      { url: 'http://localhost:3001', description: 'Desarrollo' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        RegisterClient: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            nombres: { type: 'string' },
            apellidos: { type: 'string' },
            telefono: { type: 'string' },
            region: { type: 'string' },
            provincia: { type: 'string' },
            comuna: { type: 'string' },
          },
        },
        RegisterExpert: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            nombres: { type: 'string' },
            apellidos: { type: 'string' },
            bio: { type: 'string' },
            subcategoryIds: { type: 'array', items: { type: 'integer' } },
          },
        },
        Login: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js', './controllers/*.js'],
};

module.exports = swaggerJsdoc(options);
