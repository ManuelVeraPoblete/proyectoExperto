const { Op } = require('sequelize');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const logger = require('./config/logger');
const { errorHandler } = require('./middleware/errorHandler');

// Modelos
const User = require('./models/User');
const ClienteProfile = require('./models/ClienteProfile');
const ExpertoProfile = require('./models/ExpertoProfile');
const Category = require('./models/Category');
const Subcategory = require('./models/Subcategory');
const Job = require('./models/Job');
const JobApplication = require('./models/JobApplication');
const JobPhoto = require('./models/JobPhoto');
const PortfolioItem = require('./models/PortfolioItem');
const PortfolioReaction = require('./models/PortfolioReaction');
const PortfolioReview = require('./models/PortfolioReview');
const Message = require('./models/Message');
const Report = require('./models/Report');

// Rutas
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const expertRoutes = require('./routes/expertRoutes');
const userRoutes = require('./routes/userRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const messageRoutes = require('./routes/messageRoutes');
const reportRoutes = require('./routes/reportRoutes');
const chatRoutes = require('./routes/chatRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

// --- CORS ---
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (ej: Postman, curl) y los origins configurados
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} no permitido`));
    }
  },
  credentials: true,
}));

// --- BODY PARSER ---
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// --- LOGGING HTTP ---
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http(`${req.method} ${req.url} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// --- ARCHIVOS ESTÁTICOS ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- SWAGGER ---
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- RELACIONES ---
User.hasOne(ClienteProfile, { foreignKey: 'userId', onDelete: 'CASCADE' });
ClienteProfile.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(ExpertoProfile, { foreignKey: 'userId', as: 'ExpertoProfile', onDelete: 'CASCADE' });
ExpertoProfile.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Job, { foreignKey: { name: 'clientId', type: 'CHAR(36)' }, as: 'JobsPublicados', onDelete: 'CASCADE' });
Job.belongsTo(User, { foreignKey: 'clientId', as: 'Cliente' });

Subcategory.hasMany(Job, { foreignKey: 'subcategoryId', as: 'Jobs' });
Job.belongsTo(Subcategory, { foreignKey: 'subcategoryId', as: 'Subcategory' });

Category.hasMany(Job, { foreignKey: 'categoryId', as: 'Jobs' });
Job.belongsTo(Category, { foreignKey: 'categoryId', as: 'Category' });

Job.hasMany(JobPhoto, { foreignKey: 'jobId', as: 'Fotos', onDelete: 'CASCADE' });
JobPhoto.belongsTo(Job, { foreignKey: 'jobId', as: 'Trabajo' });

Job.hasMany(JobApplication, { foreignKey: 'jobId', as: 'Postulaciones', onDelete: 'CASCADE' });
JobApplication.belongsTo(Job, { foreignKey: 'jobId', as: 'Trabajo' });

User.hasMany(JobApplication, { foreignKey: { name: 'expertId', type: 'CHAR(36)' }, as: 'PostulacionesRealizadas', onDelete: 'CASCADE' });
JobApplication.belongsTo(User, { foreignKey: 'expertId', as: 'Experto' });

ExpertoProfile.belongsToMany(Subcategory, {
  through: 'experto_subcategories',
  as: 'Subcategories',
  foreignKey: 'experto_id',
  otherKey: 'subcategory_id',
});
Subcategory.belongsToMany(ExpertoProfile, {
  through: 'experto_subcategories',
  as: 'Experts',
  foreignKey: 'subcategory_id',
  otherKey: 'experto_id',
});

Category.hasMany(Subcategory, { foreignKey: 'category_id', as: 'Subcategories' });
Subcategory.belongsTo(Category, { foreignKey: 'category_id', as: 'Category' });

// Job ↔ Experto ejecutor
User.hasMany(Job, { foreignKey: 'expertId', as: 'JobsEjecutados' });
Job.belongsTo(User, { foreignKey: 'expertId', as: 'Experto' });

// Portfolio
User.hasMany(PortfolioItem, { foreignKey: 'expertoId', as: 'Portfolio', onDelete: 'CASCADE' });
PortfolioItem.belongsTo(User, { foreignKey: 'expertoId', as: 'ExpertoUser' });
PortfolioItem.hasMany(PortfolioReaction, { foreignKey: 'portfolioItemId', as: 'Reactions', onDelete: 'CASCADE' });
PortfolioReaction.belongsTo(PortfolioItem, { foreignKey: 'portfolioItemId' });
PortfolioReaction.belongsTo(User, { foreignKey: 'userId', as: 'Reactor' });
PortfolioItem.hasMany(PortfolioReview, { foreignKey: 'portfolioItemId', as: 'Reviews', onDelete: 'CASCADE' });
PortfolioReview.belongsTo(PortfolioItem, { foreignKey: 'portfolioItemId' });
PortfolioReview.belongsTo(User, { foreignKey: 'userId', as: 'Reviewer' });

// Messages
User.hasMany(Message, { foreignKey: 'senderId', as: 'MensajesEnviados', onDelete: 'CASCADE' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'MensajesRecibidos', onDelete: 'CASCADE' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'Sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'Receiver' });

// Reports
Report.belongsTo(User, { foreignKey: 'reporterId', as: 'Reporter' });
Report.belongsTo(User, { foreignKey: 'reportedUserId', as: 'ReportedUser' });

// --- RUTAS ---
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/experts', expertRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/stats', statsRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// --- ERROR HANDLER (siempre último) ---
app.use(errorHandler);

module.exports = app;
