const { Op } = require('sequelize');
const Job = require('../models/Job');
const JobPhoto = require('../models/JobPhoto');
const ClienteProfile = require('../models/ClienteProfile');
const Subcategory = require('../models/Subcategory');
const Category = require('../models/Category');
const User = require('../models/User');

exports.createJob = async (req, res) => {
// ... (código anterior sin cambios)
// ... (código anterior sin cambios)
  console.log('--- NUEVA PETICIÓN DE TRABAJO ---');
  console.log('BODY RECIBIDO:', JSON.stringify(req.body, null, 2));

  try {
    // 1. Identificar al usuario (Soporta múltiples nombres del front)
    const clientId = req.body.clientId || req.body.userId || req.body.client_id;
    const titulo = req.body.titulo || req.body.title;
    const descripcion = req.body.descripcion || req.body.description;
    
    // Ahora grabamos la categoría principal que viene del front
    const categoryId = req.body.category_id || req.body.categoryId;
    
    // Otros campos
    const { urgencia, urgency, preferred_date, fecha_preferida, presupuesto, budget, direccion, address } = req.body;
    let { region, provincia, comuna } = req.body;

    if (!clientId) {
      console.log('RECHAZADO: No hay clientId');
      return res.status(400).json({ error: 'No se detectó un ID de usuario logueado (clientId/userId)' });
    }

    // 2. Intentar completar la ubicación desde el perfil si no viene en el body
    if (!region || !provincia || !comuna) {
      console.log(`Buscando perfil para usuario: ${clientId}`);
      const profile = await ClienteProfile.findOne({ where: { userId: clientId } });
      
      if (profile) {
        region = region || profile.region;
        provincia = provincia || profile.provincia;
        comuna = comuna || profile.comuna;
        console.log(`Ubicación automática: ${comuna}, ${region}`);
      } else {
        console.log('ADVERTENCIA: No se encontró perfil de cliente para este ID');
      }
    }

    // 3. Validar mínimos requeridos para la BD
    const faltantes = [];
    if (!titulo) faltantes.push('título (title)');
    if (!descripcion) faltantes.push('descripción (description)');
    if (!region) faltantes.push('region');
    if (!provincia) faltantes.push('provincia');
    if (!comuna) faltantes.push('comuna');
    if (!categoryId) faltantes.push('categoría (category_id)');

    if (faltantes.length > 0) {
      return res.status(400).json({ 
        error: 'Faltan campos obligatorios', 
        campos_faltantes: faltantes 
      });
    }

    // 4. Crear el Trabajo
    const jobData = {
      titulo,
      descripcion,
      presupuesto: (presupuesto || budget) ? parseFloat(presupuesto || budget) : null,
      region,
      provincia,
      comuna,
      direccion: direccion || address || 'No especificada',
      clientId,
      categoryId: parseInt(categoryId), // Guardamos el ID de la categoría principal
      urgencia: urgencia || urgency || 'media',
      fecha_preferida: fecha_preferida || preferred_date || null
    };

    console.log('--- OBJETO FINAL A INSERTAR EN JOB: ---');
    console.log(JSON.stringify(jobData, null, 2));

    const job = await Job.create(jobData);

    // 5. Guardar Fotos (Multer las deja en req.files gracias a upload.any())
    if (req.files && req.files.length > 0) {
      const photoPromises = req.files.map(file => {
        return JobPhoto.create({
          jobId: job.id,
          photo_url: `/uploads/${file.filename}`
        });
      });
      await Promise.all(photoPromises);
    }

    // 6. Devolver el trabajo completo
    const result = await Job.findByPk(job.id, {
      include: [{ model: JobPhoto, as: 'Fotos' }]
    });

    console.log('--- TRABAJO CREADO EXITOSAMENTE ---');
    res.status(201).json(result);

  } catch (error) {
    console.error('ERROR EN CREATE_JOB:', error);
    // Enviamos el mensaje del error al front para que me lo digas y podamos arreglarlo
    res.status(500).json({ 
      error: 'Error interno en el servidor', 
      detalle: error.message,
      traza: error.name
    });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const { descripcion, categoryId, region, provincia, comuna } = req.query;
    console.log('Filtros recibidos en getJobs:', { descripcion, categoryId, region, provincia, comuna });
    
    let whereClause = {};

    if (descripcion && descripcion.trim() !== '') {
      whereClause.descripcion = { [Op.like]: `%${descripcion}%` };
    }

    if (categoryId && categoryId !== 'all' && categoryId !== '0') {
      whereClause.categoryId = parseInt(categoryId);
    }

    if (region && region !== 'Todas' && region !== '') {
      whereClause.region = region;
    }

    if (provincia && provincia !== 'Todas' && provincia !== '') {
      whereClause.provincia = provincia;
    }

    if (comuna && comuna !== 'Todas' && comuna !== '') {
      whereClause.comuna = comuna;
    }

    console.log('Where Clause generada:', JSON.stringify(whereClause, null, 2));

    const jobs = await Job.findAll({
      where: whereClause,
      include: [
        { model: JobPhoto, as: 'Fotos' },
        { model: Subcategory, as: 'Subcategory' },
        { model: Category, as: 'Category' },
        { 
          model: User, 
          as: 'Cliente', 
          attributes: ['id', 'nombres', 'apellidos'] 
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Aplanamos la respuesta para que nombres y apellidos estén en el nivel principal
    const flattenedJobs = jobs.map(job => {
      const jobJson = job.toJSON();
      const cliente = jobJson.Cliente || {};
      
      // Extraemos nombres y apellidos al nivel superior
      jobJson.cliente_nombres = cliente.nombres;
      jobJson.cliente_apellidos = cliente.apellidos;
      
      // Opcional: eliminar el objeto Cliente anidado para limpiar la respuesta
      delete jobJson.Cliente;
      
      return jobJson;
    });

    console.log(`Trabajos encontrados: ${flattenedJobs.length}`);
    res.json(flattenedJobs);
  } catch (error) {
    console.error('ERROR EN GET_JOBS:', error);
    res.status(500).json({ error: error.message });
  }
};
