const { Op } = require('sequelize');
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');

// Modelos
const User = require('./models/User');
const ClienteProfile = require('./models/ClienteProfile');
const ExpertoProfile = require('./models/ExpertoProfile');
const Category = require('./models/Category');
const Subcategory = require('./models/Subcategory');
const Job = require('./models/Job');
const JobApplication = require('./models/JobApplication');
const JobPhoto = require('./models/JobPhoto');

// Rutas y Controladores
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const userController = require('./controllers/userController');
const upload = require('./middleware/upload');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// --- MIDDLEWARE DE LOGGING ---
app.use((req, res, next) => {
  const start = Date.now();
  const originalJson = res.json;
  res.json = function (data) {
    const duration = Date.now() - start;
    console.log(`\n[${new Date().toLocaleString()}] ${req.method} ${req.url} (${duration}ms)`);
    console.log('QUERY:', JSON.stringify(req.query, null, 2));
    console.log('ENTRADA (BODY):', JSON.stringify(req.body, null, 2));
    if (req.files) console.log('ARCHIVOS RECIBIDOS:', req.files.length);
    console.log('SALIDA:', JSON.stringify(data, null, 2));
    console.log('--------------------------------------------------');
    return originalJson.call(this, data);
  };
  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- RELACIONES ---

// Perfiles de Usuario
User.hasOne(ClienteProfile, { foreignKey: 'userId', onDelete: 'CASCADE' });
ClienteProfile.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(ExpertoProfile, { foreignKey: 'userId', onDelete: 'CASCADE' });
ExpertoProfile.belongsTo(User, { foreignKey: 'userId' });

// Relaciones de Trabajos (Jobs)
User.hasMany(Job, { 
  foreignKey: { name: 'clientId', type: 'CHAR(36)' }, 
  as: 'JobsPublicados', 
  onDelete: 'CASCADE' 
});
Job.belongsTo(User, { foreignKey: 'clientId', as: 'Cliente' });

Subcategory.hasMany(Job, { foreignKey: 'subcategoryId', as: 'Jobs' });
Job.belongsTo(Subcategory, { foreignKey: 'subcategoryId', as: 'Subcategory' });

Category.hasMany(Job, { foreignKey: 'categoryId', as: 'Jobs' });
Job.belongsTo(Category, { foreignKey: 'categoryId', as: 'Category' });

// Fotos de Trabajos (Máximo 5)
Job.hasMany(JobPhoto, { foreignKey: 'jobId', as: 'Fotos', onDelete: 'CASCADE' });
JobPhoto.belongsTo(Job, { foreignKey: 'jobId', as: 'Trabajo' });

// Postulaciones (JobApplications)
Job.hasMany(JobApplication, { foreignKey: 'jobId', as: 'Postulaciones', onDelete: 'CASCADE' });
JobApplication.belongsTo(Job, { foreignKey: 'jobId', as: 'Trabajo' });

User.hasMany(JobApplication, { 
  foreignKey: { name: 'expertId', type: 'CHAR(36)' }, 
  as: 'PostulacionesRealizadas', 
  onDelete: 'CASCADE' 
});
JobApplication.belongsTo(User, { foreignKey: 'expertId', as: 'Experto' });

// Los expertos tienen subcategorías (Junction table implicita)
ExpertoProfile.belongsToMany(Subcategory, { 
  through: 'experto_subcategories', 
  as: 'Subcategories',
  foreignKey: 'experto_id',
  otherKey: 'subcategory_id'
});
Subcategory.belongsToMany(ExpertoProfile, { 
  through: 'experto_subcategories', 
  as: 'Experts',
  foreignKey: 'subcategory_id',
  otherKey: 'experto_id'
});

// Relación entre Categoría y Subcategoría
Category.hasMany(Subcategory, { foreignKey: 'category_id', as: 'Subcategories' });
Subcategory.belongsTo(Category, { foreignKey: 'category_id', as: 'Category' });

// --- RUTAS ---
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.post('/api/users/:userId/avatar', upload.single('avatar'), userController.uploadAvatar);

// --- ENDPOINT DE CATEGORIAS ---
app.get('/api/categories', async (req, res) => {
  try {
    const list = await Category.findAll({ 
      include: { model: Subcategory, as: 'Subcategories' } 
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ENDPOINT DE BÚSQUEDA DE EXPERTOS ---
app.get('/api/experts', async (req, res) => {
  try {
    const { work, category_id, subcategory_id, region, provincia, comuna } = req.query;
    
    let searchTerms = [];
    if (work && work.trim() !== '') {
      searchTerms = work.toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 2 && !['para', 'con', 'por', 'del', 'las', 'los', 'una', 'uno', 'unos', 'unas', 'que'].includes(word));
    }

    const filterByCategory = category_id && category_id !== 'all' && category_id !== '0';
    const filterBySubcategory = subcategory_id && subcategory_id !== 'all' && subcategory_id !== '0';

    let mainWhere = {};
    let andConditions = [];

    if (region && region !== 'Todas') andConditions.push({ region });
    if (provincia && provincia !== 'Todas') andConditions.push({ provincia });
    if (comuna && comuna !== 'Todas') andConditions.push({ comuna });

    if (filterBySubcategory) {
      andConditions.push({ '$Subcategories.id$': subcategory_id });
    } else if (filterByCategory) {
      andConditions.push({ '$Subcategories.category_id$': category_id });
    }

    if (searchTerms.length > 0) {
      const orConditions = [];
      searchTerms.forEach(term => {
        orConditions.push({ nombres: { [Op.like]: `%${term}%` } });
        orConditions.push({ apellidos: { [Op.like]: `%${term}%` } });
        orConditions.push({ bio: { [Op.like]: `%${term}%` } });
        orConditions.push({ '$Subcategories.name$': { [Op.like]: `%${term}%` } });
        orConditions.push({ '$Subcategories.keywords$': { [Op.like]: `%${term}%` } });
      });
      andConditions.push({ [Op.or]: orConditions });
    }

    if (andConditions.length > 0) {
      mainWhere[Op.and] = andConditions;
    }

    const experts = await ExpertoProfile.findAll({
      where: mainWhere,
      include: [
        {
          model: Subcategory,
          as: 'Subcategories',
          required: true,
          include: { model: Category, as: 'Category' }
        },
        { model: User, attributes: ['id', 'email'] }
      ],
      subQuery: false,
      distinct: true
    });

    res.json(experts);
  } catch (err) {
    console.error('Error en /api/experts:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;

sequelize.sync({ alter: true })
  .then(async () => {
    console.log('Base de datos sincronizada');
    const count = await Category.count();
    if (count === 0) {
      const cat = await Category.create({ 
        name: 'Hogar', 
        slug: 'hogar', 
        description: 'Servicios generales para el hogar' 
      });
      await Subcategory.bulkCreate([
        { 
          category_id: cat.id, 
          name: 'Plomería', 
          slug: 'plomeria', 
          keywords: 'grifo, llave, lavamanos, baño, tubería, filtración, goteo, calefont' 
        },
        { 
          category_id: cat.id, 
          name: 'Electricidad', 
          slug: 'electricidad', 
          keywords: 'enchufe, interruptor, tablero, corto, cables, luz, lámpara' 
        },
        { 
          category_id: cat.id, 
          name: 'Carpintería', 
          slug: 'carpinteria', 
          keywords: 'mueble, repisa, puerta, madera, closet, cajón' 
        }
      ]);
      console.log('Datos iniciales de categorías y subcategorías creados con palabras clave');
    }
    app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`));
  })
  .catch(err => console.error('Error sincronización:', err));
