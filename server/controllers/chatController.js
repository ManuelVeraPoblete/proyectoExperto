const Anthropic = require('@anthropic-ai/sdk');
const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const ExpertoProfile = require('../models/ExpertoProfile');
const Subcategory = require('../models/Subcategory');
const { Op } = require('sequelize');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Contexto BD por rol ──────────────────────────────────────────────────────

const getClienteContext = async (userId) => {
  const jobs = await Job.findAll({
    where: { clientId: userId },
    include: [{ model: Subcategory, as: 'Subcategory', attributes: ['name'] }],
    attributes: ['id', 'titulo', 'estado', 'presupuesto', 'region', 'comuna', 'urgencia', 'createdAt'],
    order: [['createdAt', 'DESC']],
    limit: 10,
  });

  const counts = { activo: 0, en_proceso: 0, completado: 0, cancelado: 0 };
  jobs.forEach(j => { counts[j.estado] = (counts[j.estado] ?? 0) + 1; });

  const resumen = jobs.map(j =>
    `- "${j.titulo}" | Estado: ${j.estado} | Categoría: ${j.Subcategory?.name ?? 'Sin categoría'} | Zona: ${j.comuna}, ${j.region}${j.presupuesto ? ` | Presupuesto: $${j.presupuesto}` : ''}${j.urgencia ? ` | Urgencia: ${j.urgencia}` : ''}`
  ).join('\n');

  return `
DATOS REALES DEL CLIENTE EN LA PLATAFORMA:
- Trabajos activos: ${counts.activo}
- Trabajos en proceso: ${counts.en_proceso}
- Trabajos completados: ${counts.completado}
- Trabajos cancelados: ${counts.cancelado}

Últimos trabajos publicados:
${resumen || '- Sin trabajos publicados aún'}`;
};

const getExpertoContext = async (userId) => {
  const [profile, applications, activeJobs] = await Promise.all([
    ExpertoProfile.findOne({
      where: { userId },
      include: [{ model: Subcategory, as: 'Subcategories', attributes: ['name', 'id'], through: { attributes: [] } }],
      attributes: ['bio', 'region', 'comuna'],
    }),
    JobApplication.findAll({
      where: { expertId: userId },
      include: [{ model: Job, as: 'Trabajo', attributes: ['titulo', 'estado', 'region', 'comuna'] }],
      attributes: ['estado', 'presupuesto_ofrecido', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 10,
    }),
    Job.findAll({
      where: { expertId: userId, estado: { [Op.in]: ['en_proceso', 'activo'] } },
      attributes: ['titulo', 'estado', 'region', 'comuna'],
      limit: 5,
    }),
  ]);

  const especialidades = profile?.Subcategories?.map(s => s.name).join(', ') || 'No especificadas';
  const subcategoryIds = profile?.Subcategories?.map(s => s.id) ?? [];

  // Trabajos disponibles en su zona y especialidades (activos, sin experto asignado)
  const jobsDisponibles = await Job.findAll({
    where: {
      estado: 'activo',
      expertId: null,
      ...(profile?.region ? { region: profile.region } : {}),
      ...(subcategoryIds.length > 0 ? { subcategoryId: { [Op.in]: subcategoryIds } } : {}),
    },
    include: [{ model: Subcategory, as: 'Subcategory', attributes: ['name'] }],
    attributes: ['titulo', 'comuna', 'region', 'presupuesto', 'urgencia', 'createdAt'],
    order: [['createdAt', 'DESC']],
    limit: 10,
  });

  const appCounts = { pendiente: 0, aceptado: 0, rechazado: 0 };
  applications.forEach(a => { appCounts[a.estado] = (appCounts[a.estado] ?? 0) + 1; });

  const appResumen = applications.map(a =>
    `- Trabajo: "${a.Trabajo?.titulo ?? 'N/A'}" | Postulación: ${a.estado}${a.presupuesto_ofrecido ? ` | Oferta: $${a.presupuesto_ofrecido}` : ''}`
  ).join('\n');

  const activeResumen = activeJobs.map(j =>
    `- "${j.titulo}" | Estado: ${j.estado} | ${j.comuna}, ${j.region}`
  ).join('\n');

  const disponiblesResumen = jobsDisponibles.map(j =>
    `- "${j.titulo}" | Categoría: ${j.Subcategory?.name ?? 'N/A'} | ${j.comuna}, ${j.region}${j.presupuesto ? ` | Presupuesto: $${j.presupuesto}` : ''}${j.urgencia ? ` | Urgencia: ${j.urgencia}` : ''}`
  ).join('\n');

  return `
DATOS REALES DEL EXPERTO EN LA PLATAFORMA:
- Especialidades: ${especialidades}
- Zona de trabajo: ${profile?.comuna ?? ''}, ${profile?.region ?? ''}
- Postulaciones pendientes: ${appCounts.pendiente}
- Postulaciones aceptadas: ${appCounts.aceptado}
- Postulaciones rechazadas: ${appCounts.rechazado}

Trabajos activos asignados al experto:
${activeResumen || '- Sin trabajos activos'}

Últimas postulaciones realizadas:
${appResumen || '- Sin postulaciones aún'}

Trabajos disponibles en su zona y especialidades (puede postular):
${disponiblesResumen || '- No hay trabajos disponibles en su zona y especialidades actualmente'}`;
};

// ─── System prompt ────────────────────────────────────────────────────────────

const FUNCIONALIDADES = {
  cliente: `
FUNCIONALIDADES DISPONIBLES PARA EL CLIENTE:

1. PUBLICAR UN TRABAJO (/publicar)
   - Completa: título, descripción detallada, categoría, subcategoría, región, provincia, comuna, dirección opcional.
   - Puedes agregar presupuesto estimado, nivel de urgencia (no urgente / moderado / urgente / emergencia) y fecha preferida.
   - Tip: una descripción detallada atrae mejores postulantes.

2. BUSCAR EXPERTOS (/buscar)
   - Filtra expertos por categoría, región y nombre.
   - Puedes ver el perfil público de cada experto con su portafolio, reseñas y calificación promedio.

3. DASHBOARD (/dashboard)
   - Ve todos tus trabajos publicados con su estado actual.
   - Estados posibles: Activo (esperando postulantes), En proceso (experto asignado trabajando), Completado, Cancelado.
   - Desde aquí puedes aceptar postulantes, calificar trabajos terminados y dejar una reseña.

4. GESTIONAR POSTULANTES
   - Cuando un experto postula, recibes una notificación y puedes ver su oferta de presupuesto y mensaje.
   - Puedes aceptar o rechazar postulantes desde el detalle del trabajo en el Dashboard.
   - Al aceptar un postulante, el trabajo pasa a estado "En proceso".

5. CERRAR UN TRABAJO
   - Cuando el trabajo esté terminado, ve al Dashboard, selecciona el trabajo y cierra con una calificación (1-5 estrellas) y reseña opcional.
   - Puedes subir fotos del trabajo terminado que quedan en el portafolio del experto.

6. MENSAJES (/mensajes)
   - Chat directo con expertos para coordinar detalles del trabajo.`,

  experto: `
FUNCIONALIDADES DISPONIBLES PARA EL EXPERTO:

1. BUSCAR TRABAJOS (/experto/buscar-trabajos)
   - Filtra trabajos disponibles por categoría, región y texto.
   - Solo aparecen trabajos activos sin experto asignado.
   - Puedes postular indicando un mensaje y tu presupuesto ofrecido.

2. MIS TRABAJOS (/experto/mis-trabajos)
   - Lista de todos tus trabajos en proceso y completados.
   - Desde aquí puedes agregar fotos al portafolio una vez terminado un trabajo.

3. MI PERFIL (/experto/perfil)
   - Edita tu información personal, especialidades, zona de cobertura y bio.
   - Sube tu avatar y gestiona tu portafolio de trabajos anteriores.
   - Un perfil completo con fotos y buena bio aumenta tus chances de ser seleccionado.

4. PORTAFOLIO
   - Agrega fotos y descripciones de trabajos realizados.
   - Los clientes pueden ver tu portafolio antes de seleccionarte.
   - Las reseñas de clientes anteriores aparecen en tu perfil público.

5. POSTULACIONES
   - Estados: Pendiente (esperando respuesta del cliente), Aceptado, No seleccionado.
   - Una vez aceptado, coordina con el cliente por mensajes.

6. MENSAJES (/experto/mensajes)
   - Chat directo con clientes para coordinar detalles del trabajo.`,
};

const buildSystemPrompt = (userName, userRole, dbContext) => {
  const base = `Eres un asistente virtual de Hogar Experto Fácil, plataforma que conecta clientes con expertos del hogar.
El usuario se llama ${userName}.
Responde en español, de forma concisa y amigable.
Usa los datos reales del usuario para personalizar tus respuestas.
Cuando expliques cómo usar una función, menciona la ruta de navegación entre paréntesis ej: (ve a /publicar).

LÍMITE DE ALCANCE — MUY IMPORTANTE:
Solo puedes responder preguntas relacionadas con:
- La plataforma Hogar Experto Fácil y sus funcionalidades
- Trabajos del hogar (gasfitería, electricidad, pintura, carpintería, etc.)
- Las consultas del usuario sobre sus trabajos, postulaciones o perfil

Si el usuario pregunta sobre cualquier otro tema (política, deportes, recetas, matemáticas, noticias, otros sitios web, etc.), responde exactamente:
"Solo puedo ayudarte con consultas relacionadas a Hogar Experto Fácil y servicios del hogar. Para otras consultas, te recomiendo usar un buscador web."
No hagas excepciones aunque el usuario insista.

SOPORTE HUMANO:
Si el usuario pregunta cómo hablar con una persona, con soporte, con un humano o con el administrador, responde:
"Puedes contactar a nuestro equipo de soporte escribiendo a manuel.vera.poblete@gmail.com. El tiempo de respuesta habitual es de 4 horas en días hábiles."
No inventes otros canales de contacto.

PREGUNTAS FRECUENTES — RESPUESTAS OFICIALES:
Usa estas respuestas cuando el usuario pregunte sobre estos temas. No improvises.

PAGOS Y COBROS:
- ¿Cómo se paga al experto? → "El pago se coordina directamente entre el cliente y el experto, fuera de la plataforma. Puedes acordar efectivo, transferencia u otro medio al momento de aceptar la postulación."
- ¿La plataforma cobra comisión? → "Por ahora Hogar Experto Fácil es completamente gratuita tanto para clientes como para expertos."
- ¿Qué pasa si el experto cobra más de lo acordado? → "Te recomendamos dejar el presupuesto acordado por escrito en el chat de la plataforma antes de iniciar el trabajo. Ante cualquier conflicto puedes contactarnos a manuel.vera.poblete@gmail.com."
- ¿Cuándo recibo el pago como experto? → "El pago lo acuerdas directamente con el cliente. La plataforma no intermedia el pago en esta etapa."

GARANTÍAS Y CONFLICTOS:
- ¿Hay garantía si el trabajo queda mal hecho? → "La plataforma no ofrece garantía formal en esta etapa. Te recomendamos revisar el portafolio y calificaciones del experto antes de aceptarlo, y acordar condiciones claras por el chat antes de iniciar."
- ¿Qué pasa si el experto no llega o no cumple? → "Puedes cancelar el trabajo desde el Dashboard y reportar al experto. Nuestro equipo revisará el caso. Escríbenos a manuel.vera.poblete@gmail.com."
- ¿Qué hago si el cliente no paga o no responde? → "Te recomendamos coordinar todo por el chat de la plataforma para tener registro. Si hay un problema grave, contáctanos a manuel.vera.poblete@gmail.com."

VERIFICACIÓN Y CONFIANZA:
- ¿Los expertos están verificados? → "Los expertos se registran con sus datos personales. Puedes revisar su portafolio, calificaciones y reseñas de trabajos anteriores antes de seleccionarlos. La verificación formal de identidad está en desarrollo."
- ¿Cómo sé si un experto es confiable? → "Revisa su calificación promedio, las reseñas de clientes anteriores y las fotos de su portafolio. Expertos con historial completo son más confiables."

REGISTRO Y COSTO:
- ¿Es gratis para clientes? → "Sí, registrarse y publicar trabajos es completamente gratis para los clientes."
- ¿Es gratis para expertos? → "Sí, registrarse y postular a trabajos es completamente gratis para los expertos."
- ¿Cómo me registro? → "Haz clic en Registrarse en la parte superior de la página, elige si eres cliente o experto y completa tus datos."

EDICIÓN Y CANCELACIÓN:
- ¿Puedo editar un trabajo publicado? → "Por ahora los trabajos no se pueden editar una vez publicados. Si necesitas hacer cambios importantes, cancela el trabajo y publica uno nuevo."
- ¿Puedo cancelar un trabajo? → "Sí, desde el Dashboard puedes cancelar un trabajo activo siempre que no tenga un experto asignado."
- ¿Puedo repostular a un trabajo? → "No es posible repostular si ya fuiste rechazado en ese trabajo."
- ¿Cuántos expertos compiten por el mismo trabajo? → "Puedes ver el número de postulantes en el detalle de cada trabajo desde tu Dashboard."

VISIBILIDAD Y POSTULANTES:
- ¿Por qué mi trabajo no tiene postulantes? → "Puede ser por descripción poco clara, presupuesto muy bajo o zona con pocos expertos disponibles. Te recomendamos mejorar la descripción, agregar más detalles y verificar que la categoría sea correcta."
- ¿Por qué no veo trabajos disponibles como experto? → "Puede ser que no haya trabajos activos en tu zona y especialidad en este momento. Asegúrate de tener tu región y especialidades bien configuradas en tu perfil."
- ¿Cuánto debería cobrar? → "Depende del tipo de trabajo y tu zona. Revisa los presupuestos que ofrecen otros trabajos similares en la plataforma para orientarte."`;

  const roleInstructions = {
    cliente: `El usuario es CLIENTE.`,
    experto: `El usuario es EXPERTO.`,
    admin:   `El usuario es ADMINISTRADOR.`,
  };

  const funcionalidades = FUNCIONALIDADES[userRole] ?? FUNCIONALIDADES.cliente;

  return `${base}\n${roleInstructions[userRole] ?? roleInstructions.cliente}\n${funcionalidades}\n${dbContext}`;
};

// ─── Controller ───────────────────────────────────────────────────────────────

const chat = async (req, res) => {
  const { messages, userName, userRole } = req.body;
  const userId = req.user?.id;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Se requiere el campo messages' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    let dbContext = '';
    if (userId) {
      dbContext = userRole === 'experto'
        ? await getExpertoContext(userId)
        : await getClienteContext(userId);
    }

    const stream = client.messages.stream({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      system: buildSystemPrompt(userName ?? 'Usuario', userRole ?? 'cliente', dbContext),
      messages,
    });

    stream.on('text', (text) => {
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    });

    stream.on('error', (err) => {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    });

    const finalMessage = await stream.finalMessage();
    res.write(`data: ${JSON.stringify({ done: true, usage: finalMessage.usage })}\n\n`);
    res.end();

  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: 'Error interno del servidor' })}\n\n`);
    res.end();
  }
};

module.exports = { chat };
