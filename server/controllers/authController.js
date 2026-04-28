const crypto = require('crypto');
const User = require('../models/User');
const ClienteProfile = require('../models/ClienteProfile');
const ExpertoProfile = require('../models/ExpertoProfile');
const Subcategory = require('../models/Subcategory');
const sequelize = require('../config/database');
const jwt = require('jsonwebtoken');
const { AppError } = require('../middleware/errorHandler');
const { sendVerificationEmail } = require('../services/emailService');

const signToken = (user) =>
  jwt.sign(
    { id: user.id, userType: user.user_type },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
  );

const generateVerificationToken = () => crypto.randomBytes(32).toString('hex');

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
      {
        email, password, nombres: finalNombres, apellidos: finalApellidos, user_type: 'cliente',
        emailVerified: true,
      },
      { transaction: t }
    );

    await ClienteProfile.create(
      { userId: user.id, nombres: finalNombres, apellidos: finalApellidos, telefono, direccion, region, provincia, comuna },
      { transaction: t }
    );

    await t.commit();

    res.status(201).json({
      message: 'Cliente registrado con éxito.',
      user: { id: user.id, email: user.email, userType: user.user_type, nombres: user.nombres, apellidos: user.apellidos, emailVerified: true },
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
      {
        email, password, nombres: finalNombres, apellidos: finalApellidos, user_type: 'experto',
        emailVerified: true,
      },
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
      message: 'Experto registrado con éxito.',
      user: { id: user.id, email: user.email, userType: user.user_type, nombres: user.nombres, apellidos: user.apellidos, emailVerified: true },
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
      emailVerified: true,
    });
    res.status(201).json({
      message: 'Administrador registrado con éxito',
      user: { id: user.id, email: user.email, userType: user.user_type },
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return next(new AppError('Token requerido', 400));

    const user = await User.findOne({
      where: {
        emailVerificationToken: token,
      },
    });

    if (!user) return next(new AppError('Token inválido o ya utilizado', 400));

    if (user.emailVerificationExpires < new Date()) {
      return next(new AppError('El token de verificación ha expirado. Solicita uno nuevo.', 400));
    }

    await user.update({
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    });

    res.json({ message: 'Correo verificado correctamente. Ya puedes usar todas las funciones.' });
  } catch (error) {
    next(error);
  }
};

exports.resendVerification = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return next(new AppError('Usuario no encontrado', 404));

    if (user.emailVerified) {
      return next(new AppError('Tu correo ya está verificado', 400));
    }

    const verificationToken = generateVerificationToken();
    await user.update({
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await sendVerificationEmail(user.email, verificationToken);

    res.json({ message: 'Correo de verificación reenviado. Revisa tu bandeja de entrada.' });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) return next(new AppError('Usuario no encontrado', 404));

    if (!(await user.validPassword(currentPassword))) {
      return next(new AppError('La contraseña actual es incorrecta', 401));
    }

    if (await user.validPassword(newPassword)) {
      return next(new AppError('La nueva contraseña debe ser diferente a la actual', 400));
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Contraseña actualizada correctamente' });
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
        emailVerified: user.emailVerified,
        profile,
      },
      token: signToken(user),
    });
  } catch (error) {
    next(error);
  }
};
