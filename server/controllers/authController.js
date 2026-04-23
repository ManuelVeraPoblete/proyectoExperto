const User = require('../models/User');
const ClienteProfile = require('../models/ClienteProfile');
const ExpertoProfile = require('../models/ExpertoProfile');
const Subcategory = require('../models/Subcategory');
const sequelize = require('../config/database');
const jwt = require('jsonwebtoken');
const { AppError } = require('../middleware/errorHandler');

const signToken = (user) =>
  jwt.sign(
    { id: user.id, userType: user.user_type },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );

/**
 * @swagger
 * /api/auth/register/client:
 *   post:
 *     tags: [Auth]
 */
exports.registerClient = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const {
      email, password, nombres, nombre, apellidos, apellido,
      telefono, direccion, region, provincia, comuna,
    } = req.body;

    const finalNombres = nombres || nombre;
    const finalApellidos = apellidos || apellido;

    const user = await User.create(
      { email, password, nombres: finalNombres, apellidos: finalApellidos, user_type: 'cliente' },
      { transaction: t }
    );

    await ClienteProfile.create(
      { userId: user.id, nombres: finalNombres, apellidos: finalApellidos, telefono, direccion, region, provincia, comuna },
      { transaction: t }
    );

    await t.commit();

    res.status(201).json({
      message: 'Cliente registrado con éxito',
      user: { id: user.id, email: user.email, userType: user.user_type, nombres: user.nombres, apellidos: user.apellidos },
      token: signToken(user),
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

/**
 * @swagger
 * /api/auth/register/expert:
 *   post:
 *     tags: [Auth]
 */
exports.registerExpert = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const {
      email, password, nombres, nombre, apellidos, apellido,
      telefono, direccion, region, provincia, comuna, bio,
      subcategoryIds, especialidades, experto_specialties,
    } = req.body;

    const finalNombres = nombres || nombre;
    const finalApellidos = apellidos || apellido;
    const ids = subcategoryIds || especialidades || experto_specialties;

    const user = await User.create(
      { email, password, nombres: finalNombres, apellidos: finalApellidos, user_type: 'experto' },
      { transaction: t }
    );

    const profile = await ExpertoProfile.create(
      { userId: user.id, nombres: finalNombres, apellidos: finalApellidos, telefono, direccion, region, provincia, comuna, bio },
      { transaction: t }
    );

    if (ids && Array.isArray(ids) && ids.length > 0) {
      const numericIds = ids.map(id => parseInt(id)).filter(id => !isNaN(id));
      if (numericIds.length > 0) {
        await profile.addSubcategories(numericIds, { transaction: t });
      }
    }

    await t.commit();

    res.status(201).json({
      message: 'Experto registrado con éxito',
      user: { id: user.id, email: user.email, userType: user.user_type, nombres: user.nombres, apellidos: user.apellidos },
      token: signToken(user),
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

exports.registerAdmin = async (req, res, next) => {
  try {
    const { email, password, nombres, nombre, apellidos, apellido } = req.body;
    const user = await User.create({
      email,
      password,
      nombres: nombres || nombre,
      apellidos: apellidos || apellido,
      user_type: 'admin',
    });
    res.status(201).json({
      message: 'Administrador registrado con éxito',
      user: { id: user.id, email: user.email, userType: user.user_type },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.validPassword(password))) {
      return next(new AppError('Email o contraseña incorrectos', 401));
    }

    let profile = null;
    if (user.user_type === 'cliente') {
      profile = await ClienteProfile.findOne({ where: { userId: user.id } });
    } else if (user.user_type === 'experto') {
      profile = await ExpertoProfile.findOne({
        where: { userId: user.id },
        include: { model: Subcategory, as: 'Subcategories' },
      });

      if (profile?.verificationStatus === 'pendiente') {
        return next(new AppError(
          'Tu cuenta está pendiente de aprobación. Un administrador revisará tu perfil y te notificará cuando esté habilitado.',
          403
        ));
      }
      if (profile?.verificationStatus === 'anulado') {
        return next(new AppError(
          'Tu cuenta ha sido deshabilitada. Contacta al soporte para más información.',
          403
        ));
      }
    }

    res.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        userType: user.user_type,
        nombres: user.nombres,
        apellidos: user.apellidos,
        profile,
      },
      token: signToken(user),
    });
  } catch (error) {
    next(error);
  }
};
