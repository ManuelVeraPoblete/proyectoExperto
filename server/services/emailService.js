const { Resend } = require('resend');
const logger = require('../config/logger');

const getClient = () => new Resend(process.env.RESEND_API_KEY);

const isConfigured = () => !!process.env.RESEND_API_KEY;

exports.sendVerificationEmail = async (to, token) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const link = `${frontendUrl}/verify-email?token=${token}`;

  if (!isConfigured()) {
    logger.warn(`[Email] Resend no configurado. Token de verificación para ${to}: ${token}`);
    logger.warn(`[Email] Link de verificación: ${link}`);
    return;
  }

  const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';

  await getClient().emails.send({
    from: `Expertos a Domicilio <${from}>`,
    to,
    subject: 'Verifica tu correo electrónico',
    html: `
     <div style="margin:0; padding:0; background:#f4f7fb;">
    <div style="font-family:Arial,sans-serif; max-width:560px; margin:0 auto; padding:32px 20px;">
      
      <div style="
        background:#ffffff;
        border-radius:14px;
        padding:32px;
        border:1px solid #e5e7eb;
        box-shadow:0 2px 8px rgba(0,0,0,0.05);
      ">

        <h1 style="
          margin:0 0 16px 0;
          color:#0f3460;
          font-size:28px;
          font-weight:bold;
        ">
          ExpertHand
        </h1>

        <h2 style="
          margin:0 0 16px 0;
          color:#111827;
          font-size:22px;
        ">
          Verifica tu correo electrónico
        </h2>

        <p style="
          color:#374151;
          font-size:16px;
          line-height:1.6;
        ">
          Gracias por registrarte en <strong>ExpertHand</strong>.
          Para activar tu cuenta, haz clic en el siguiente botón:
        </p>

        <div style="margin:30px 0;">
          <a
            href="${link}"
            target="_blank"
            rel="noopener noreferrer"
            style="
              display:inline-block;
              background:#0f3460;
              color:#ffffff;
              padding:14px 28px;
              text-decoration:none;
              border-radius:8px;
              font-weight:bold;
              font-size:15px;
            "
          >
            Verificar cuenta
          </a>
        </div>

        <hr style="
          border:none;
          border-top:1px solid #e5e7eb;
          margin:28px 0;
        ">

        <p style="
          color:#6b7280;
          font-size:13px;
        ">
          Este enlace expira en 24 horas. Si no solicitaste esta cuenta, puedes ignorar este mensaje.
        </p>

        <p style="
          color:#9ca3af;
          font-size:12px;
          margin-top:20px;
        ">
          © ExpertHand
        </p>

      </div>
    </div>
  </div>
    `,
  });

  logger.info(`[Email] Verificación enviada a ${to}`);
};

exports.sendJobNotificationEmail = async (to, expertoNombre, job) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const loginLink = `${frontendUrl}/login?redirect=/buscar-trabajos`;

  if (!isConfigured()) {
    logger.warn(`[Email] Resend no configurado. Notificación de trabajo para ${to}: ${job.titulo}`);
    return;
  }

  const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';
  const descripcionCorta = job.descripcion.length > 200
    ? job.descripcion.substring(0, 200) + '...'
    : job.descripcion;

  const urgenciaLabel = { alta: '🔴 Alta', media: '🟡 Media', baja: '🟢 Baja' }[job.urgencia] || job.urgencia;
  const presupuestoHtml = job.presupuesto
    ? `<p style="margin: 6px 0; color: #333;"><strong>Presupuesto:</strong> $${Number(job.presupuesto).toLocaleString('es-CL')}</p>`
    : '';

  await getClient().emails.send({
    from: `Expertos a Domicilio <${from}>`,
    to,
    subject: `Nueva oferta disponible: ${job.titulo}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a1a2e;">¡Hola, ${expertoNombre}!</h2>
        <p style="color: #444;">Hay una nueva oferta de trabajo que coincide con tu perfil:</p>

        <div style="background: #f4f7fb; border-left: 4px solid #0f3460; padding: 16px; border-radius: 4px; margin: 20px 0;">
          <h3 style="color: #0f3460; margin: 0 0 10px 0;">${job.titulo}</h3>
          <p style="margin: 6px 0; color: #555;">${descripcionCorta}</p>
          <p style="margin: 6px 0; color: #333;"><strong>Ubicación:</strong> ${job.comuna}, ${job.region}</p>
          <p style="margin: 6px 0; color: #333;"><strong>Urgencia:</strong> ${urgenciaLabel}</p>
          ${presupuestoHtml}
        </div>

        <p style="color: #444;">Inicia sesión para ver todos los detalles y postularte:</p>

        <a href="${loginLink}" style="
          display: inline-block;
          background-color: #0f3460;
          color: white;
          padding: 12px 28px;
          text-decoration: none;
          border-radius: 6px;
          margin: 16px 0;
          font-weight: bold;
          font-size: 15px;
        ">Ver trabajos disponibles</a>

        <p style="color: #888; font-size: 13px; margin-top: 24px;">
          Recibes este correo porque eres un experto registrado en Expertos a Domicilio.<br/>
          Si no deseas recibir estas notificaciones, puedes ajustarlo en tu perfil.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">Expertos a Domicilio</p>
      </div>
    `,
  });

  logger.info(`[Email] Notificación de trabajo "${job.titulo}" enviada a ${to}`);
};
