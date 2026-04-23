const nodemailer = require('nodemailer');
const logger = require('../config/logger');

const isConfigured = () =>
  !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT || 587),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

exports.sendVerificationEmail = async (to, token) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const link = `${frontendUrl}/verify-email?token=${token}`;

  if (!isConfigured()) {
    logger.warn(`[Email] SMTP no configurado. Token de verificación para ${to}: ${token}`);
    logger.warn(`[Email] Link de verificación: ${link}`);
    return;
  }

  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  await createTransporter().sendMail({
    from: `"Expertos a Domicilio" <${from}>`,
    to,
    subject: 'Verifica tu correo electrónico',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a1a2e;">Bienvenido a Expertos a Domicilio</h2>
        <p>Gracias por registrarte. Haz clic en el botón de abajo para verificar tu correo electrónico.</p>
        <a href="${link}" style="
          display: inline-block;
          background-color: #0f3460;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin: 16px 0;
          font-weight: bold;
        ">Verificar correo</a>
        <p style="color: #666; font-size: 14px;">Este enlace expira en 24 horas.</p>
        <p style="color: #666; font-size: 14px;">Si no creaste esta cuenta, ignora este mensaje.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">Expertos a Domicilio</p>
      </div>
    `,
  });

  logger.info(`[Email] Verificación enviada a ${to}`);
};
