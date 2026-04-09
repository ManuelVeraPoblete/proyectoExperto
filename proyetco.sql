ALTER TABLE experthands_db.experto_profile ADD nombres varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL;

ALTER TABLE experthands_db.`user` ADD password varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL;

ALTER TABLE experthands_db.job_applications ADD jobId char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL;

ALTER TABLE experthands_db.experto_profile ADD direccion text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;

CREATE TABLE `subcategories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int unsigned NOT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(180) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `keywords` text COMMENT 'Palabras clave separadas por coma para búsqueda inteligente',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_subcategories_category_name` (`category_id`,`name`),
  UNIQUE KEY `uq_subcategories_category_slug` (`category_id`,`slug`),
  UNIQUE KEY `subcategories_category_id_name` (`category_id`,`name`),
  UNIQUE KEY `subcategories_category_id_slug` (`category_id`,`slug`),
  KEY `idx_subcategories_category_id` (`category_id`),
  KEY `idx_subcategories_name` (`name`),
  CONSTRAINT `subcategories_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=268 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE experthands_db.jobs ADD fecha_expiracion datetime NULL;

ALTER TABLE experthands_db.subcategories ADD updated_at datetime NOT NULL;

ALTER TABLE experthands_db.cliente_profile ADD userId char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;

ALTER TABLE experthands_db.categories ADD created_at datetime NOT NULL;

ALTER TABLE experthands_db.jobs ADD direccion varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;

ALTER TABLE experthands_db.experto_subcategories ADD updatedAt datetime NOT NULL;

ALTER TABLE experthands_db.experto_profile ADD bio text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;

ALTER TABLE experthands_db.job_applications ADD estado enum('pendiente','aceptado','rechazado') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'pendiente' NULL;

ALTER TABLE experthands_db.jobs ADD categoryId int unsigned NULL;

ALTER TABLE experthands_db.job_photos ADD photo_url varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL;

ALTER TABLE experthands_db.jobs ADD titulo varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL;

ALTER TABLE experthands_db.cliente_profile ADD updatedAt datetime NOT NULL;

CREATE TABLE `jobs` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `presupuesto` decimal(10,2) DEFAULT NULL,
  `region` varchar(255) NOT NULL,
  `provincia` varchar(255) NOT NULL,
  `comuna` varchar(255) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `estado` enum('activo','en_proceso','completado','cancelado') DEFAULT 'activo',
  `fecha_expiracion` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `clientId` char(36) DEFAULT NULL,
  `subcategoryId` int unsigned DEFAULT NULL,
  `urgencia` varchar(255) DEFAULT NULL,
  `fecha_preferida` datetime DEFAULT NULL,
  `categoryId` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `clientId` (`clientId`),
  KEY `subcategoryId` (`subcategoryId`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `jobs_ibfk_34` FOREIGN KEY (`clientId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `jobs_ibfk_35` FOREIGN KEY (`subcategoryId`) REFERENCES `subcategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `jobs_ibfk_36` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE experthands_db.jobs ADD presupuesto decimal(10,2) NULL;

ALTER TABLE experthands_db.cliente_profile ADD id int auto_increment NOT NULL;

ALTER TABLE experthands_db.cliente_profile ADD region varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;

ALTER TABLE experthands_db.jobs ADD updatedAt datetime NOT NULL;

ALTER TABLE experthands_db.`user` ADD nombres varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;

ALTER TABLE experthands_db.subcategories ADD category_id int unsigned NOT NULL;

ALTER TABLE experthands_db.experto_profile ADD provincia varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;

ALTER TABLE experthands_db.job_photos ADD id int auto_increment NOT NULL;

ALTER TABLE experthands_db.subcategories ADD name varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL;

ALTER TABLE experthands_db.jobs ADD createdAt datetime NOT NULL;

ALTER TABLE experthands_db.jobs ADD estado enum('activo','en_proceso','completado','cancelado') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'activo' NULL;

ALTER TABLE experthands_db.job_applications ADD presupuesto_ofrecido decimal(10,2) NULL;

ALTER TABLE experthands_db.categories ADD description varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;

ALTER TABLE experthands_db.cliente_profile ADD provincia varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;

ALTER TABLE experthands_db.experto_profile ADD updatedAt datetime NOT NULL;

CREATE TABLE `job_photos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `photo_url` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `jobId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `jobId` (`jobId`),
  CONSTRAINT `job_photos_ibfk_1` FOREIGN KEY (`jobId`) REFERENCES `jobs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE experthands_db.`user` ADD id char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL;

ALTER TABLE experthands_db.categories ADD is_active tinyint(1) DEFAULT 1 NULL;

ALTER TABLE experthands_db.cliente_profile ADD direccion text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;

ALTER TABLE experthands_db.jobs ADD id char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL;

CREATE TABLE `user` (
  `id` char(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user_type` enum('cliente','experto','admin') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `nombres` varchar(255) DEFAULT NULL,
  `apellidos` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `email_22` (`email`),
  UNIQUE KEY `email_23` (`email`),
  UNIQUE KEY `email_24` (`email`),
  UNIQUE KEY `email_25` (`email`),
  UNIQUE KEY `email_26` (`email`),
  UNIQUE KEY `email_27` (`email`),
  UNIQUE KEY `email_28` (`email`),
  UNIQUE KEY `email_29` (`email`),
  UNIQUE KEY `email_30` (`email`),
  UNIQUE KEY `email_31` (`email`),
  UNIQUE KEY `email_32` (`email`),
  UNIQUE KEY `email_33` (`email`),
  UNIQUE KEY `email_34` (`email`),
  UNIQUE KEY `email_35` (`email`),
  UNIQUE KEY `email_36` (`email`),
  UNIQUE KEY `email_37` (`email`),
  UNIQUE KEY `email_38` (`email`),
  UNIQUE KEY `email_39` (`email`),
  UNIQUE KEY `email_40` (`email`),
  UNIQUE KEY `email_41` (`email`),
  UNIQUE KEY `email_42` (`email`),
  UNIQUE KEY `email_43` (`email`),
  UNIQUE KEY `email_44` (`email`),
  UNIQUE KEY `email_45` (`email`),
  UNIQUE KEY `email_46` (`email`),
  UNIQUE KEY `email_47` (`email`),
  UNIQUE KEY `email_48` (`email`),
  UNIQUE KEY `email_49` (`email`),
  UNIQUE KEY `email_50` (`email`),
  UNIQUE KEY `email_51` (`email`),
  UNIQUE KEY `email_52` (`email`),
  UNIQUE KEY `email_53` (`email`),
  UNIQUE KEY `email_54` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE experthands_db.jobs ADD comuna varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL;

ALTER TABLE experthands_db.job_photos ADD updatedAt datetime NOT NULL;

ALTER TABLE experthands_db.subcategories ADD created_at datetime NOT NULL;

ALTER TABLE experthands_db.categories ADD slug varchar(140) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL;

ALTER TABLE experthands_db.experto_profile ADD avatar_url varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;

ALTER TABLE experthands_db.job_applications ADD id int auto_increment NOT NULL;

ALTER TABLE experthands_db.job_photos ADD createdAt datetime NOT NULL;

CREATE TABLE `categories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `slug` varchar(140) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `name_2` (`name`),
  UNIQUE KEY `slug_2` (`slug`),
  UNIQUE KEY `name_3` (`name`),
  UNIQUE KEY `slug_3` (`slug`),
  UNIQUE KEY `name_4` (`name`),
  UNIQUE KEY `slug_4` (`slug`),
  UNIQUE KEY `name_5` (`name`),
  UNIQUE KEY `slug_5` (`slug`),
  UNIQUE KEY `name_6` (`name`),
  UNIQUE KEY `slug_6` (`slug`),
  UNIQUE KEY `name_7` (`name`),
  UNIQUE KEY `slug_7` (`slug`),
  UNIQUE KEY `name_8` (`name`),
  UNIQUE KEY `slug_8` (`slug`),
  UNIQUE KEY `name_9` (`name`),
  UNIQUE KEY `slug_9` (`slug`),
  UNIQUE KEY `name_10` (`name`),
  UNIQUE KEY `slug_10` (`slug`),
  UNIQUE KEY `name_11` (`name`),
  UNIQUE KEY `slug_11` (`slug`),
  UNIQUE KEY `name_12` (`name`),
  UNIQUE KEY `slug_12` (`slug`),
  UNIQUE KEY `name_13` (`name`),
  UNIQUE KEY `slug_13` (`slug`),
  UNIQUE KEY `name_14` (`name`),
  UNIQUE KEY `slug_14` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE experthands_db.`user` ADD email varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL;

ALTER TABLE experthands_db.jobs ADD region varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL;

ALTER TABLE experthands_db.subcategories ADD slug varchar(180) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL;

ALTER TABLE experthands_db.subcategories ADD is_active tinyint(1) DEFAULT 1 NULL;

ALTER TABLE experthands_db.cliente_profile ADD avatar_url varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;

ALTER TABLE experthands_db.experto_profile ADD userId char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;

ALTER TABLE experthands_db.experto_subcategories ADD createdAt datetime NOT NULL;

ALTER TABLE experthands_db.subcategories ADD id int unsigned auto_increment NOT NULL;

ALTER TABLE experthands_db.experto_subcategories ADD subcategory_id int unsigned NOT NULL;

ALTER TABLE experthands_db.categories ADD id int unsigned auto_increment NOT NULL;

ALTER TABLE experthands_db.experto_profile ADD apellidos varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL;

ALTER TABLE experthands_db.cliente_profile ADD createdAt datetime NOT NULL;

ALTER TABLE experthands_db.job_applications ADD mensaje text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL;

ALTER TABLE experthands_db.jobs ADD descripcion text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL;

ALTER TABLE experthands_db.subcategories ADD keywords text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT 'Palabras clave separadas por coma para búsqueda inteligente';

ALTER TABLE experthands_db.jobs ADD clientId char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;

ALTER TABLE experthands_db.experto_profile ADD region varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;

ALTER TABLE experthands_db.experto_profile ADD comuna varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;

ALTER TABLE experthands_db.`user` ADD user_type enum('cliente','experto','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL;

ALTER TABLE experthands_db.`user` ADD createdAt datetime NOT NULL;

ALTER TABLE experthands_db.job_applications ADD updatedAt datetime NOT NULL;

ALTER TABLE experthands_db.jobs ADD urgencia varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;

ALTER TABLE experthands_db.experto_profile ADD id int auto_increment NOT NULL;

CREATE TABLE `experto_subcategories` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `experto_id` int NOT NULL,
  `subcategory_id` int unsigned NOT NULL,
  PRIMARY KEY (`experto_id`,`subcategory_id`),
  KEY `subcategory_id` (`subcategory_id`),
  CONSTRAINT `experto_subcategories_ibfk_1` FOREIGN KEY (`experto_id`) REFERENCES `experto_profile` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `experto_subcategories_ibfk_2` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE experthands_db.categories ADD name varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL;

ALTER TABLE experthands_db.cliente_profile ADD nombres varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL;

ALTER TABLE experthands_db.job_applications ADD createdAt datetime NOT NULL;

ALTER TABLE experthands_db.job_photos ADD jobId char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL;

ALTER TABLE experthands_db.jobs ADD fecha_preferida datetime NULL;

ALTER TABLE experthands_db.experto_subcategories ADD experto_id int NOT NULL;

CREATE TABLE `experto_profile` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombres` varchar(255) NOT NULL,
  `apellidos` varchar(255) NOT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `direccion` text,
  `region` varchar(255) DEFAULT NULL,
  `provincia` varchar(255) DEFAULT NULL,
  `comuna` varchar(255) DEFAULT NULL,
  `bio` text,
  `avatar_url` varchar(255) DEFAULT NULL,
  `userId` char(36) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `experto_profile_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cliente_profile` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombres` varchar(255) NOT NULL,
  `apellidos` varchar(255) NOT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `direccion` text,
  `region` varchar(255) DEFAULT NULL,
  `provincia` varchar(255) DEFAULT NULL,
  `comuna` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `userId` char(36) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `cliente_profile_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE experthands_db.subcategories ADD description varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;

ALTER TABLE experthands_db.`user` ADD apellidos varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;

ALTER TABLE experthands_db.`user` ADD updatedAt datetime NOT NULL;

ALTER TABLE experthands_db.experto_profile ADD createdAt datetime NOT NULL;

ALTER TABLE experthands_db.job_applications ADD expertId char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;

ALTER TABLE experthands_db.categories ADD updated_at datetime NOT NULL;

ALTER TABLE experthands_db.cliente_profile ADD telefono varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;

ALTER TABLE experthands_db.jobs ADD provincia varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL;

ALTER TABLE experthands_db.experto_profile ADD telefono varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;

ALTER TABLE experthands_db.cliente_profile ADD apellidos varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL;

ALTER TABLE experthands_db.cliente_profile ADD comuna varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;

ALTER TABLE experthands_db.jobs ADD subcategoryId int unsigned NULL;

CREATE TABLE `job_applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mensaje` text NOT NULL,
  `presupuesto_ofrecido` decimal(10,2) DEFAULT NULL,
  `estado` enum('pendiente','aceptado','rechazado') DEFAULT 'pendiente',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `jobId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `expertId` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `jobId` (`jobId`),
  KEY `expertId` (`expertId`),
  CONSTRAINT `job_applications_ibfk_29` FOREIGN KEY (`jobId`) REFERENCES `jobs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `job_applications_ibfk_30` FOREIGN KEY (`expertId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;