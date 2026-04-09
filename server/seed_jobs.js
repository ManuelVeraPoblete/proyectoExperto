const Job = require('./models/Job');
const User = require('./models/User');
const { v4: uuidv4 } = require('uuid');

async function createManyJobs() {
  const clientId = '523c1ebe-4497-4a01-82bb-9d7cca5d385e'; // ID del cliente del log
  
  const jobs = [
    { titulo: "Reparación de Techo", desc: "Se filtró agua por el temporal, necesito sellar techumbre.", cat: 20 },
    { titulo: "Instalación de Enchufes", desc: "Necesito agregar 3 enchufes en la cocina.", cat: 2 },
    { titulo: "Pintado de Fachada", desc: "Pintar exterior de casa de dos pisos.", cat: 6 },
    { titulo: "Arreglo de Lavamanos", desc: "El lavamanos gotea constantemente por el desagüe.", cat: 3 },
    { titulo: "Corte de Pasto y Poda", desc: "Mantención de jardín delantero y trasero.", cat: 8 },
    { titulo: "Cambio de Cerradura", desc: "Perdí las llaves y quiero cambiar el cilindro de la puerta principal.", cat: 17 },
    { titulo: "Limpieza de Alfombras", desc: "Limpieza profunda de 2 alfombras grandes de living.", cat: 9 },
    { titulo: "Reparación de Notebook", desc: "Mi computador no prende después de un corte de luz.", cat: 13 },
    { titulo: "Instalación de Aire Acondicionado", desc: "Instalar equipo de 12000 BTU en dormitorio.", cat: 4 },
    { titulo: "Barnizado de Puertas", desc: "Barnizar 5 puertas interiores de madera.", cat: 5 },
    { titulo: "Flete de Muebles", desc: "Trasladar un sillón y una mesa desde Hualpén a Concepción.", cat: 12 },
    { titulo: "Instalación de Cámaras", desc: "Poner 4 cámaras de seguridad con DVR.", cat: 10 },
    { titulo: "Reparación de Refrigerador", desc: "El refrigerador no enfría la parte de abajo.", cat: 11 },
    { titulo: "Poner Cerámica en Baño", desc: "Cambiar piso de baño pequeño por cerámica nueva.", cat: 19 },
    { titulo: "Instalación de Termo Eléctrico", desc: "Cambiar calefont antiguo por termo eléctrico.", cat: 3 },
    { titulo: "Arreglo de Persiana", desc: "La persiana de aluminio se trabó y no sube.", cat: 18 },
    { titulo: "Limpieza de Canaletas", desc: "Sacar hojas y basura de las canaletas del techo.", cat: 20 },
    { titulo: "Instalación de Lámparas", desc: "Instalar 3 lámparas de techo en el living.", cat: 2 },
    { titulo: "Pintar Dormitorio", desc: "Pintar paredes y techo de una habitación de 3x3.", cat: 6 },
    { titulo: "Arreglo de Sifón", desc: "El sifón de la cocina está quebrado y pierde agua.", cat: 3 },
    { titulo: "Fumigación de Casa", desc: "Control de arañas y hormigas en toda la casa.", cat: 21 },
    { titulo: "Instalación de Citófono", desc: "Poner citófono con apertura de chapa eléctrica.", cat: 10 },
    { titulo: "Reparación de Lavadora", desc: "La lavadora no centrífuga.", cat: 11 },
    { titulo: "Cerrar Terraza con Vidrio", desc: "Cotizar cierre de terraza pequeña con ventanas de aluminio.", cat: 18 },
    { titulo: "Instalar Paneles Solares", desc: "Instalar kit básico de iluminación solar.", cat: 15 },
    { titulo: "Reparación de Closet", desc: "Arreglar rieles de puertas correderas de closet.", cat: 5 },
    { titulo: "Instalar Piso Flotante", desc: "Poner piso flotante en dormitorio matrimonial.", cat: 19 },
    { titulo: "Configuración de Router", desc: "Tengo problemas con el WiFi en el segundo piso.", cat: 14 },
    { titulo: "Reparación de Cerco", desc: "Soldar partes sueltas de reja exterior.", cat: 1 },
    { titulo: "Mantenimiento de Calefont", desc: "Limpieza y cambio de membrana a calefont Junkers.", cat: 3 }
  ];

  try {
    for (let i = 0; i < jobs.length; i++) {
      await Job.create({
        id: uuidv4(),
        titulo: jobs[i].titulo,
        descripcion: jobs[i].desc,
        presupuesto: Math.floor(Math.random() * (200000 - 20000 + 1)) + 20000,
        region: "Biobío",
        provincia: "Concepción",
        comuna: "Hualpén",
        direccion: "Dirección de prueba " + (i + 1),
        clientId: clientId,
        categoryId: jobs[i].cat,
        estado: 'activo',
        urgencia: 'media',
        fecha_preferida: new Date(Date.now() + 86400000 * (i + 1))
      });
    }
    console.log("30 trabajos creados exitosamente en Hualpén.");
  } catch (error) {
    console.error("Error al crear trabajos:", error);
  } finally {
    process.exit();
  }
}

createManyJobs();
