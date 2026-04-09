-- Script SQL para actualizar keywords de subcategorías existentes
-- Este script busca por el NOMBRE de la subcategoría para asignar sus palabras clave.

-- ALBAÑILERÍA Y OBRA
UPDATE `subcategories` SET `keywords` = 'ladrillo, bloque, cemento, mezcla, construcción, muro, pared, radier, concreto, hormigón, cimiento, pilar, viga, estuco, nivelación' WHERE `name` = 'Albañilería';
UPDATE `subcategories` SET `keywords` = 'pared, muro, pandereta, bloque, ladrillo, tabique, vulcanita, albañil, estructural, contención' WHERE `name` = 'Construcción de muros';
UPDATE `subcategories` SET `keywords` = 'piso, concreto, cemento, hormigón, radier, nivelado, malla acma, carretilla, alisado, fundaciones' WHERE `name` = 'Radieres';
UPDATE `subcategories` SET `keywords` = 'segundo piso, pieza nueva, dormitorio, cocina ampliada, logia, cobertizo, remodelación, estructura' WHERE `name` = 'Ampliaciones';
UPDATE `subcategories` SET `keywords` = 'reforma, modernización, cambio, mejora, interiorismo, diseño, actualización, casa, departamento' WHERE `name` = 'Remodelaciones';
UPDATE `subcategories` SET `keywords` = 'derribar, botar muro, picar, escombros, mazo, retiro, despeje, desmantelar' WHERE `name` = 'Demoliciones menores';
UPDATE `subcategories` SET `keywords` = 'zanja, pozo, hoyo, tierra, picota, pala, excavar, piscina pequeña, drenaje' WHERE `name` = 'Excavaciones menores';
UPDATE `subcategories` SET `keywords` = 'concreto, fraguado, mezcla, trompo, enfierradura, moldaje, vibrado, losa' WHERE `name` = 'Hormigón y cemento';

-- ELECTRICIDAD
UPDATE `subcategories` SET `keywords` = 'luz, cables, corriente, circuitos, planos, instalación, empalme, normativa, técnico, electricista' WHERE `name` = 'Instalación eléctrica domiciliaria';
UPDATE `subcategories` SET `keywords` = 'corto circuito, falla, chispas, olor a quemado, no hay luz, revisión, mantención, emergencia' WHERE `name` = 'Reparaciones eléctricas';
UPDATE `subcategories` SET `keywords` = 'automático, diferencial, térmica, caja, breakers, fase, neutro, tierra, protección' WHERE `name` = 'Tableros eléctricos';
UPDATE `subcategories` SET `keywords` = 'toma de corriente, punto, apagador, interruptor, módulo, doble, triple, usb, empotrado' WHERE `name` = 'Enchufes e interruptores';
UPDATE `subcategories` SET `keywords` = 'lámpara, foco, led, dicroico, panel, colgante, apliqué, foco exterior, iluminación, plafón' WHERE `name` = 'Luminarias y focos';
UPDATE `subcategories` SET `keywords` = 'citófono, intercomunicador, timbre, campana, botón, inalámbrico, portero, audio' WHERE `name` = 'Citofonía y timbres';
UPDATE `subcategories` SET `keywords` = 'batería, respaldo, ups, generador, bencina, diesel, corte de luz, estabilizador, energía' WHERE `name` = 'Generadores y respaldo UPS';
UPDATE `subcategories` SET `keywords` = 'reloj, timer, sensor de movimiento, fotocelda, encendido automático, control, domótica básica' WHERE `name` = 'Automatización eléctrica';

-- GASFITERÍA / PLOMERÍA
UPDATE `subcategories` SET `keywords` = 'gotera, fuga, humedad, cañería rota, filtración, sello, llave pasa, pérdida agua, detector' WHERE `name` = 'Reparación de fugas';
UPDATE `subcategories` SET `keywords` = 'tubo, ppr, cobre, pvc, cpvc, red, agua, alimentación, soldadura, unión' WHERE `name` = 'Instalación de cañerías';
UPDATE `subcategories` SET `keywords` = 'tapado, obstrucción, desagüe, baño, alcantarillado, cámara, sonda, máquina, sopaipilla, químico' WHERE `name` = 'Destape de desagües';
UPDATE `subcategories` SET `keywords` = 'grifo, llave, monomando, ducha, mezclador, lavamanos, lavaplatos, bidet, flexible' WHERE `name` = 'Instalación de grifería';
UPDATE `subcategories` SET `keywords` = 'baño, inodoro, taza, descarga, estanque, fitting, gomas, sello, pernos, filtración wc' WHERE `name` = 'Instalación de WC';
UPDATE `subcategories` SET `keywords` = 'lavaplatos, lavamanos, vanitorio, sifón, desagüe, instalación, cocina, baño' WHERE `name` = 'Instalación de lavaplatos y lavamanos';
UPDATE `subcategories` SET `keywords` = 'calefont, termo, caldera, agua caliente, no calienta, piloto, membrana, chispero, serpentín' WHERE `name` = 'Calefont y termos';
UPDATE `subcategories` SET `keywords` = 'gas, cobre, cañería, cocina, estufa, calefont, sello verde, fuga gas, regulador, cilindro' WHERE `name` = 'Redes de gas';

-- CLIMATIZACIÓN
UPDATE `subcategories` SET `keywords` = 'aire, frío, calor, split, unidad, instalación, soporte, conexión, climatización' WHERE `name` = 'Instalación de aire acondicionado';
UPDATE `subcategories` SET `keywords` = 'limpieza, filtro, gas, r410, r22, recarga, revisión, preventivo, hongo, olor' WHERE `name` = 'Mantención de aire acondicionado';
UPDATE `subcategories` SET `keywords` = 'no enfría, no prende, ruido, gotea, falla eléctrica, motor, compresor, placa' WHERE `name` = 'Reparación de aire acondicionado';
UPDATE `subcategories` SET `keywords` = 'estufa, radiador, caldera, piso radiante, calefacción, central, pellet, leña, gas' WHERE `name` = 'Calefacción domiciliaria';
UPDATE `subcategories` SET `keywords` = 'extractor, baño, cocina, ventilación, ducto, aire, purificador, campana' WHERE `name` = 'Ventilación y extractores';
UPDATE `subcategories` SET `keywords` = 'frío, cámara, vitrina, industrial, compresor, gas, mantenimiento, comercial' WHERE `name` = 'Refrigeración';

-- CARPINTERÍA
UPDATE `subcategories` SET `keywords` = 'madera, mueble, diseño, melamina, medida, carpintero, fabricación, plano' WHERE `name` = 'Muebles a medida';
UPDATE `subcategories` SET `keywords` = 'roto, suelto, restauración, barnizado, encolado, cajón, bisagra, silla, mesa' WHERE `name` = 'Reparación de muebles';
UPDATE `subcategories` SET `keywords` = 'closet, ropero, vestidor, despensa, empotrado, melamina, cajonera, colgador' WHERE `name` = 'Closets y muebles empotrados';
UPDATE `subcategories` SET `keywords` = 'puerta, marco, bisagra, cepillado, chapa, ajuste, madera, acceso, dormitorio' WHERE `name` = 'Instalación de puertas de madera';
UPDATE `subcategories` SET `keywords` = 'deck, terraza, madera, pino, impregnado, piso exterior, pérgola, barniz' WHERE `name` = 'Deck y terrazas de madera';
UPDATE `subcategories` SET `keywords` = 'repostería, despensa, encimera, mueble cocina, cajones, bisagras, tiradores' WHERE `name` = 'Cocinas y muebles de cocina';

-- PINTURA Y TERMINACIONES
UPDATE `subcategories` SET `keywords` = 'pared, muro, techo, látex, óleo, rodillo, pintura, departamento, casa, color' WHERE `name` = 'Pintura interior';
UPDATE `subcategories` SET `keywords` = 'fachada, muro exterior, reja, esmalte, intemperie, andamio, impermeabilización' WHERE `name` = 'Pintura exterior';
UPDATE `subcategories` SET `keywords` = 'barniz, laca, brillo, sello, madera, protección, terminación, tinte' WHERE `name` = 'Barniz y lacado';
UPDATE `subcategories` SET `keywords` = 'papel, mural, pegamento, diseño, decoración, empapelado, pared, revestimiento' WHERE `name` = 'Papel mural';
UPDATE `subcategories` SET `keywords` = 'empaste, pasta muro, lijado, yeso, fisura, grieta, alisado, preparación' WHERE `name` = 'Reparación y alisado de muros';
UPDATE `subcategories` SET `keywords` = 'sello, humedad, agua, filtración, pintura asfáltica, membrana, techo, muro' WHERE `name` = 'Impermeabilización de superficies';

-- MANTENCIÓN GENERAL / SERVICIOS VARIOS
UPDATE `subcategories` SET `keywords` = 'repisa, soporte, cuadro, taladro, perforación, anclaje, tarugo, estante' WHERE `name` = 'Instalación de repisas y soportes';
UPDATE `subcategories` SET `keywords` = 'cortina, riel, barra, roller, persiana, visillo, soporte, ventana' WHERE `name` = 'Instalación de cortinas y rieles';
UPDATE `subcategories` SET `keywords` = 'armado, kit, mueble, retail, escritorio, cama, closet, armado manual' WHERE `name` = 'Armado de muebles';
UPDATE `subcategories` SET `keywords` = 'silicona, sello, tina, baño, cocina, junta, dilatación, hermético' WHERE `name` = 'Sellados y siliconas';
UPDATE `subcategories` SET `keywords` = 'handyman, maestrochasquilla, arreglo, mantenimiento, hogar, varios, reparaciones' WHERE `name` = 'Reparaciones generales del hogar';

-- JARDINERÍA
UPDATE `subcategories` SET `keywords` = 'jardín, patio, plantas, mantención, riego, tierra, abono, desmalezado' WHERE `name` = 'Mantención de jardines';
UPDATE `subcategories` SET `keywords` = 'poda, rama, corte, árbol, cerco vivo, arbusto, altura, despeje' WHERE `name` = 'Poda de árboles y arbustos';
UPDATE `subcategories` SET `keywords` = 'pasto, césped, cortar, orillado, cortacésped, desmalezado' WHERE `name` = 'Corte de césped';
UPDATE `subcategories` SET `keywords` = 'riego, aspersor, programador, electroválvula, goteo, tubería, jardín' WHERE `name` = 'Riego automático';
UPDATE `subcategories` SET `keywords` = 'diseño, jardín, plantas, decoración, piedras, proyecto, exterior' WHERE `name` = 'Paisajismo';
UPDATE `subcategories` SET `keywords` = 'reja, madera, malla, cerco, cierre, portón, muro, delimitación' WHERE `name` = 'Cercos y cierres exteriores';

-- LIMPIEZA
UPDATE `subcategories` SET `keywords` = 'aseo, casa, departamento, limpieza, piezas, cocina, baño' WHERE `name` = 'Limpieza domiciliaria';
UPDATE `subcategories` SET `keywords` = 'profundo, detallado, cocina, baño, desinfección, suciedad acumulada' WHERE `name` = 'Limpieza profunda';
UPDATE `subcategories` SET `keywords` = 'obra, construcción, polvo, fin de obra, restos, pintura, limpieza final' WHERE `name` = 'Limpieza post construcción';
UPDATE `subcategories` SET `keywords` = 'virus, bacterias, covid, amonio, desinfección, sanitizado, nebulización' WHERE `name` = 'Sanitización';
UPDATE `subcategories` SET `keywords` = 'alfombra, sillón, sofá, tapiz, lavado, aspirado, vapor, mancha' WHERE `name` = 'Limpieza de alfombras y tapices';
UPDATE `subcategories` SET `keywords` = 'vidrio, ventana, cristal, altura, limpieza, mancha, ventanal' WHERE `name` = 'Limpieza de vidrios';

-- SEGURIDAD
UPDATE `subcategories` SET `keywords` = 'cámara, seguridad, cctv, dvr, nvr, ip, vigilancia, monitoreo, grabación' WHERE `name` = 'Instalación de cámaras CCTV';
UPDATE `subcategories` SET `keywords` = 'alarma, sensor, sirena, pánico, seguridad, intrusión, central, inalámbrica' WHERE `name` = 'Alarmas domiciliarias';
UPDATE `subcategories` SET `keywords` = 'cámara, portero, pantalla, timbre, video, acceso, seguridad' WHERE `name` = 'Video porteros';
UPDATE `subcategories` SET `keywords` = 'tarjeta, huella, teclado, clave, acceso, cerradura eléctrica, magnética' WHERE `name` = 'Control de acceso';
UPDATE `subcategories` SET `keywords` = 'cerco, corriente, seguridad, perímetro, choque, electrificado, protección' WHERE `name` = 'Cercos eléctricos';

-- LÍNEA BLANCA / ELECTRODOMÉSTICOS
UPDATE `subcategories` SET `keywords` = 'lavadora, secadora, carga frontal, motor, tambor, no bota agua, ruido, bomba' WHERE `name` = 'Reparación de lavadoras';
UPDATE `subcategories` SET `keywords` = 'refrigerador, nevera, no enfría, gas, motor, compresor, hongo, filtro, placa' WHERE `name` = 'Reparación de refrigeradores';
UPDATE `subcategories` SET `keywords` = 'horno, cocina, encimera, gas, quemador, chispero, resistencia, eléctrico' WHERE `name` = 'Reparación de hornos y cocinas';
UPDATE `subcategories` SET `keywords` = 'microondas, plato, magnetrón, no calienta, cortocircuito, reparación' WHERE `name` = 'Reparación de microondas';
UPDATE `subcategories` SET `keywords` = 'lavadora, lavavajillas, cocina, horno, empotrado, instalación, conexión' WHERE `name` = 'Instalación de electrodomésticos';

-- MUDANZAS Y FLETES
UPDATE `subcategories` SET `keywords` = 'mudanza, camión, casa, flete, transporte, local, traslado' WHERE `name` = 'Mudanzas locales';
UPDATE `subcategories` SET `keywords` = 'mudanza, carretera, largo, país, transporte, interurbano, camión' WHERE `name` = 'Mudanzas interurbanas';
UPDATE `subcategories` SET `keywords` = 'flete, camioneta, carga, transporte, bultos, retiro, despacho' WHERE `name` = 'Fletes';
UPDATE `subcategories` SET `keywords` = 'caja, cartón, burbuja, film, embalado, protección, frágil' WHERE `name` = 'Embalaje';
UPDATE `subcategories` SET `keywords` = 'peoneta, carga, bajar, subir, escombros, muebles, fuerza' WHERE `name` = 'Carga y descarga';

-- INFORMÁTICA / SOPORTE
UPDATE `subcategories` SET `keywords` = 'computador, pc, notebook, laptop, mac, reparación, hardware, teclado' WHERE `name` = 'Reparación de computadores';
UPDATE `subcategories` SET `keywords` = 'formatear, windows, office, sistema, drivers, macos, instalación, linux' WHERE `name` = 'Formateo e instalación de sistema operativo';
UPDATE `subcategories` SET `keywords` = 'virus, malware, troyano, lentitud, antivirus, limpieza, publicidad' WHERE `name` = 'Eliminación de virus';
UPDATE `subcategories` SET `keywords` = 'lento, rápido, optimizar, inicio, ram, ssd, disco, mantenimiento' WHERE `name` = 'Optimización de PC';
UPDATE `subcategories` SET `keywords` = 'armado, pc, piezas, gamer, componentes, montaje, placa madre, cpu' WHERE `name` = 'Armado de PC';
UPDATE `subcategories` SET `keywords` = 'programas, adobe, autocad, office, instalación, licencias, activación' WHERE `name` = 'Instalación de software';
UPDATE `subcategories` SET `keywords` = 'disco duro, perdido, borrado, rescatar, archivos, fotos, datos, usb' WHERE `name` = 'Recuperación de datos';
UPDATE `subcategories` SET `keywords` = 'impresora, wifi, red, scanner, driver, tóner, tinta, configuración' WHERE `name` = 'Instalación de impresoras';
UPDATE `subcategories` SET `keywords` = 'remoto, teamviewer, anydesk, ayuda, pantalla, asistencia, distancia' WHERE `name` = 'Soporte remoto';
UPDATE `subcategories` SET `keywords` = 'backup, copia, nube, drive, respaldo, seguridad, automático' WHERE `name` = 'Respaldo y copias de seguridad';
UPDATE `subcategories` SET `keywords` = 'hacker, contraseña, seguridad, protección, privacidad, estafa, phishing' WHERE `name` = 'Ciberseguridad básica';
UPDATE `subcategories` SET `keywords` = 'wifi, internet, router, señal, clave, lento, mala señal, repetidor' WHERE `name` = 'Configuración de router y WiFi';
UPDATE `subcategories` SET `keywords` = 'red, cable, rj45, canaleta, switch, rack, lan, estructurado' WHERE `name` = 'Cableado estructurado';
UPDATE `subcategories` SET `keywords` = 'punto, red, internet, ethernet, pared, conexión, cable' WHERE `name` = 'Instalación de puntos de red';
UPDATE `subcategories` SET `keywords` = 'repetidor, mesh, malla, ampliar, wifi, señal, patio, segundo piso' WHERE `name` = 'Extensión de señal WiFi';
UPDATE `subcategories` SET `keywords` = 'switch, ap, access point, ubiquiti, cisco, configuración, administración' WHERE `name` = 'Configuración de switches y access points';
UPDATE `subcategories` SET `keywords` = 'fibra óptica, internet, ont, módem, alta velocidad, conexión' WHERE `name` = 'Instalación de fibra y conectividad';

-- ENERGÍAS RENOVABLES / DOMÓTICA
UPDATE `subcategories` SET `keywords` = 'solar, panel, placa, sol, energía, renovable, fotovoltaico, ahorro' WHERE `name` = 'Instalación de paneles solares';
UPDATE `subcategories` SET `keywords` = 'limpieza, revisión, mantención, paneles, voltaje, baterías, sol' WHERE `name` = 'Mantención de sistemas solares';
UPDATE `subcategories` SET `keywords` = 'inversor, controlador, carga, regulador, voltaje, sistema solar' WHERE `name` = 'Inversores y controladores';
UPDATE `subcategories` SET `keywords` = 'batería, litio, gel, almacenamiento, respaldo, descarga, ciclo profundo' WHERE `name` = 'Baterías y almacenamiento';
UPDATE `subcategories` SET `keywords` = 'luz, inteligente, smart, ampolleta, wifi, bluetooth, dimer, color' WHERE `name` = 'Automatización de iluminación';
UPDATE `subcategories` SET `keywords` = 'cortina, persiana, motor, inteligente, remoto, aplicación, subir, bajar' WHERE `name` = 'Automatización de persianas y cortinas';
UPDATE `subcategories` SET `keywords` = 'sensor, puerta, movimiento, agua, humo, inteligente, smart, alarma' WHERE `name` = 'Sensores inteligentes';
UPDATE `subcategories` SET `keywords` = 'alexa, google, voz, bocina, parlante, inteligente, configuración, rutina' WHERE `name` = 'Integración Alexa y Google Home';
UPDATE `subcategories` SET `keywords` = 'chapa, cerradura, inteligente, huella, código, wifi, digital, electrónica' WHERE `name` = 'Cerraduras inteligentes';

-- CERRAJERÍA
UPDATE `subcategories` SET `keywords` = 'abrir, puerta, emergencia, llave adentro, pérdida, trabado, cerrajero' WHERE `name` = 'Apertura de puertas';
UPDATE `subcategories` SET `keywords` = 'cambiar, chapa, cerradura, cilindro, pomo, seguridad, llave nueva' WHERE `name` = 'Cambio de cerraduras';
UPDATE `subcategories` SET `keywords` = 'copia, llave, duplicado, instalación, cerrajería, taller' WHERE `name` = 'Copia e instalación de llaves';
UPDATE `subcategories` SET `keywords` = 'seguridad, blindada, multipunto, cerrojo, protección, reforzada, chapa' WHERE `name` = 'Cerraduras de seguridad';

-- VIDRIOS Y VENTANAS
UPDATE `subcategories` SET `keywords` = 'vidrio, roto, ventana, cristal, termo panel, templado, laminado' WHERE `name` = 'Instalación de vidrios';
UPDATE `subcategories` SET `keywords` = 'espejo, baño, muro, decoración, medida, marco, pulido' WHERE `name` = 'Espejos a medida';
UPDATE `subcategories` SET `keywords` = 'ventana, aluminio, marco, corredera, manilla, cierre, riel' WHERE `name` = 'Ventanas de aluminio';
UPDATE `subcategories` SET `keywords` = 'baño, ducha, shower door, mampara, vidrio, oficina, separación' WHERE `name` = 'Mamparas y shower door';

-- PISOS Y REVESTIMIENTOS
UPDATE `subcategories` SET `keywords` = 'piso, cerámica, porcelanato, fragüe, muro, baldosa, instalación' WHERE `name` = 'Cerámicos y porcelanatos';
UPDATE `subcategories` SET `keywords` = 'piso, flotante, laminado, junquillo, guardapolvo, espuma, instalación' WHERE `name` = 'Piso flotante';
UPDATE `subcategories` SET `keywords` = 'vinílico, spc, pvc, adhesivo, clic, piso, resistente, agua' WHERE `name` = 'Piso vinílico';
UPDATE `subcategories` SET `keywords` = 'alfombra, muro a muro, cubrepiso, pegamento, instalación, fleje' WHERE `name` = 'Alfombras y cubrepisos';
UPDATE `subcategories` SET `keywords` = 'suelto, roto, picado, cerámica, piso, reparación, fragüe' WHERE `name` = 'Reparación de revestimientos';

-- TECHOS Y CANALETAS
UPDATE `subcategories` SET `keywords` = 'techo, teja, zinc, techumbre, filtración, gotera, cumbrera, estructura' WHERE `name` = 'Reparación de techumbres';
UPDATE `subcategories` SET `keywords` = 'techo, zinc, pizarreño, teja asfáltica, cubierta, policarbonato, instalación' WHERE `name` = 'Instalación de cubiertas';
UPDATE `subcategories` SET `keywords` = 'canaleta, bajada, agua, lluvia, limpieza, instalación, pvc, zinc' WHERE `name` = 'Canaletas y bajadas de agua';
UPDATE `subcategories` SET `keywords` = 'sello, membrana, pintura asfáltica, techo, filtración, impermeable' WHERE `name` = 'Impermeabilización de techos';

-- CONTROL DE PLAGAS
UPDATE `subcategories` SET `keywords` = 'insectos, bichos, moscas, arañas, fumigado, líquido, químico' WHERE `name` = 'Fumigación';
UPDATE `subcategories` SET `keywords` = 'ratón, laucha, rata, veneno, trampa, desratización, control' WHERE `name` = 'Control de roedores';
UPDATE `subcategories` SET `keywords` = 'baratas, hormigas, termitas, chinches, pulgas, garrapatas, control' WHERE `name` = 'Control de insectos';
UPDATE `subcategories` SET `keywords` = 'sanitizado, ambiente, olores, bacterias, virus, limpieza' WHERE `name` = 'Sanitización ambiental';

-- INSTALACIONES MENORES
UPDATE `subcategories` SET `keywords` = 'televisor, tv, soporte, muro, anclaje, led, smart tv, colgar' WHERE `name` = 'Instalación de televisores';
UPDATE `subcategories` SET `keywords` = 'soporte, anclaje, perno, muro, taladro, seguridad, fijación' WHERE `name` = 'Instalación de soportes y anclajes';
UPDATE `subcategories` SET `keywords` = 'baño, toallero, jabonera, barra, espejo, accesorio, perforación' WHERE `name` = 'Instalación de accesorios de baño';
UPDATE `subcategories` SET `keywords` = 'campana, extractor, cocina, ventilación, ducto, grasa, montaje' WHERE `name` = 'Instalación de campanas y extractores';
UPDATE `subcategories` SET `keywords` = 'maestro, mantenimiento, preventivo, revisión, casa, arreglo, general' WHERE `name` = 'Mantenimiento general del hogar';
