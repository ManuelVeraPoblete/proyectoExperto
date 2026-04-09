const User = require('../models/User');
const ClienteProfile = require('../models/ClienteProfile');
const ExpertoProfile = require('../models/ExpertoProfile');
const Subcategory = require('../models/Subcategory');
const sequelize = require('../config/database');
const jwt = require('jsonwebtoken');

// --- REGISTRO DE CLIENTES ---
exports.registerClient = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { 
      email, password, nombres, nombre, apellidos, apellido, 
      telefono, direccion, region, provincia, comuna 
    } = req.body;

    const finalNombres = nombres || nombre;
    const finalApellidos = apellidos || apellido;

    // 1. Graba en la tabla 'user'
    const user = await User.create({ 
      email, 
      password, 
      nombres: finalNombres,
      apellidos: finalApellidos,
      user_type: 'cliente' // Sincronizado: cliente
    }, { transaction: t });

    // 2. Graba en la tabla 'cliente_profile'
    await ClienteProfile.create({ 
      userId: user.id, 
      nombres: finalNombres, 
      apellidos: finalApellidos, 
      telefono, 
      direccion,
      region, 
      provincia,
      comuna 
    }, { transaction: t });

    await t.commit();

    const token = jwt.sign({ id: user.id, userType: user.user_type }, process.env.JWT_SECRET || 'mi_clave_secreta', { expiresIn: '8h' });
    res.status(201).json({ 
      message: 'Cliente registrado con éxito', 
      user: { id: user.id, email: user.email, userType: user.user_type, nombres: user.nombres, apellidos: user.apellidos }, 
      token 
    });
  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
};

// --- REGISTRO DE EXPERTOS ---
exports.registerExpert = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { 
      email, password, nombres, nombre, apellidos, apellido, 
      telefono, direccion, region, provincia, comuna, bio, 
      subcategoryIds, especialidades, experto_specialties 
    } = req.body;

    const finalNombres = nombres || nombre;
    const finalApellidos = apellidos || apellido;
    const ids = subcategoryIds || especialidades || experto_specialties;

    const user = await User.create({ 
      email, 
      password, 
      nombres: finalNombres,
      apellidos: finalApellidos,
      user_type: 'experto' 
    }, { transaction: t });

    const profile = await ExpertoProfile.create({ 
      userId: user.id, 
      nombres: finalNombres, 
      apellidos: finalApellidos, 
      telefono, 
      direccion,
      region, 
      provincia,
      comuna, 
      bio 
    }, { transaction: t });

    if (ids && Array.isArray(ids) && ids.length > 0) {
      const numericIds = ids.map(id => parseInt(id)).filter(id => !isNaN(id));
      if (numericIds.length > 0) {
        await profile.addSubcategories(numericIds, { transaction: t });
      }
    }

    await t.commit();

    const token = jwt.sign({ id: user.id, userType: user.user_type }, process.env.JWT_SECRET || 'mi_clave_secreta', { expiresIn: '8h' });
    res.status(201).json({ 
      message: 'Experto registrado con éxito', 
      user: { id: user.id, email: user.email, userType: user.user_type, nombres: user.nombres, apellidos: user.apellidos }, 
      token 
    });
  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
};

// --- REGISTRO DE ADMINISTRADORES ---
exports.registerAdmin = async (req, res) => {
  try {
    const { email, password, nombres, nombre, apellidos, apellido } = req.body;
    const finalNombres = nombres || nombre;
    const finalApellidos = apellidos || apellido;

    const user = await User.create({ 
      email, 
      password, 
      nombres: finalNombres,
      apellidos: finalApellidos,
      user_type: 'admin' 
    });

    res.status(201).json({ 
      message: 'Administrador registrado con éxito', 
      user: { id: user.id, email: user.email, userType: user.user_type, nombres: user.nombres, apellidos: user.apellidos } 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// --- LOGIN ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user || !(await user.validPassword(password))) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    let profile = null;
    if (user.user_type === 'cliente') {
      profile = await ClienteProfile.findOne({ where: { userId: user.id } });
    } else if (user.user_type === 'experto') {
      profile = await ExpertoProfile.findOne({ 
        where: { userId: user.id },
        include: { model: Subcategory, as: 'Subcategories' } 
      });
    }

    const token = jwt.sign({ id: user.id, userType: user.user_type }, process.env.JWT_SECRET || 'mi_clave_secreta', { expiresIn: '8h' });
    res.json({ 
      message: 'Login exitoso', 
      user: { 
        id: user.id, 
        email: user.email, 
        userType: user.user_type, // Se envía como userType para el Frontend
        nombres: user.nombres, 
        apellidos: user.apellidos, 
        profile 
      }, 
      token 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
