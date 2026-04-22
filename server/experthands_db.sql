-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: experthands_db
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `experthands_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `experthands_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `experthands_db`;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Construcción y Obras','construccion-y-obras','Servicios de construcción, remodelación y obras estructurales',1,'2026-04-02 15:48:47','2026-04-02 15:48:47'),(2,'Electricidad','electricidad','Instalaciones, reparaciones y mantenimiento eléctrico',1,'2026-04-02 15:48:47','2026-04-02 15:48:47'),(3,'Gasfitería','gasfiteria','Servicios de plomería, agua, desagüe y gas',1,'2026-04-02 15:48:47','2026-04-02 15:48:47'),(4,'Climatización','climatizacion','Aire acondicionado, calefacción, ventilación y refrigeración',1,'2026-04-02 15:48:47','2026-04-02 15:48:47'),(5,'Carpintería y Muebles','carpinteria-y-muebles','Fabricación, reparación e instalación de muebles y madera',1,'2026-04-02 15:48:47','2026-04-02 15:48:47'),(6,'Pintura y Terminaciones','pintura-y-terminaciones','Pintura interior, exterior y acabados',1,'2026-04-02 15:48:47','2026-04-02 15:48:47'),(7,'Obras Menores y Reparaciones','obras-menores-y-reparaciones','Reparaciones domésticas y trabajos menores',1,'2026-04-02 15:48:47','2026-04-02 15:48:47'),(8,'Jardinería y Exteriores','jardineria-y-exteriores','Mantención de jardines y espacios exteriores',1,'2026-04-02 15:48:47','2026-04-02 15:48:47'),(9,'Limpieza','limpieza','Limpieza general, profunda y especializada',1,'2026-04-02 15:48:47','2026-04-02 15:48:47'),(10,'Seguridad','seguridad','Sistemas de seguridad y control de acceso',1,'2026-04-02 15:48:47','2026-04-02 15:48:47'),(11,'Electrodomésticos','electrodomesticos','Reparación e instalación de electrodomésticos',1,'2026-04-02 15:48:47','2026-04-02 15:48:47'),(12,'Mudanzas y Transporte','mudanzas-y-transporte','Mudanzas, fletes y transporte domiciliario',1,'2026-04-02 15:48:47','2026-04-02 15:48:47'),(13,'Computación y Tecnología','computacion-y-tecnologia','Soporte técnico, computadores, redes y software',1,'2026-04-02 15:48:47','2026-04-02 15:48:47'),(14,'Redes y Telecomunicaciones','redes-y-telecomunicaciones','Cableado, internet, redes y comunicaciones',1,'2026-04-02 15:48:47','2026-04-02 15:48:47'),(15,'Energía Renovable','energia-renovable','Instalación y mantención de sistemas solares y energías limpias',1,'2026-04-02 15:48:47','2026-04-02 15:48:47'),(16,'Domótica','domotica','Automatización y tecnología para hogares inteligentes',1,'2026-04-02 15:48:47','2026-04-02 15:48:47'),(17,'Cerrajería','cerrajeria','Aperturas, cerraduras y sistemas de acceso',1,'2026-04-02 15:48:47','2026-04-02 15:48:47'),(18,'Vidriería y Aluminio','vidrieria-y-aluminio','Vidrios, ventanales, espejos y estructuras de aluminio',1,'2026-04-02 15:48:47','2026-04-02 15:48:47'),(19,'Pisos y Revestimientos','pisos-y-revestimientos','Instalación y reparación de pisos y revestimientos',1,'2026-04-02 15:48:47','2026-04-02 15:48:47'),(20,'Techos y Cubiertas','techos-y-cubiertas','Reparación, instalación y mantención de techumbres',1,'2026-04-02 15:48:47','2026-04-02 15:48:47'),(21,'Control de Plagas','control-de-plagas','Fumigación, sanitización y control de plagas',1,'2026-04-02 15:48:47','2026-04-02 15:48:47'),(22,'Servicios Técnicos del Hogar','servicios-tecnicos-del-hogar','Servicios diversos de instalación y soporte en el hogar',1,'2026-04-02 15:48:47','2026-04-02 15:48:47');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cliente_profile`
--

DROP TABLE IF EXISTS `cliente_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente_profile`
--

LOCK TABLES `cliente_profile` WRITE;
/*!40000 ALTER TABLE `cliente_profile` DISABLE KEYS */;
INSERT INTO `cliente_profile` VALUES (1,'Scarleth','Vera','+56957755313','PUCON 293 POBLACION RENE SCHNEIDER','Biobío','Concepción','Hualpén',NULL,'2026-04-15 14:39:50','2026-04-15 14:39:50','ac5f86dd-b027-4e38-bd1b-95b834702d1b');
/*!40000 ALTER TABLE `cliente_profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `experto_profile`
--

DROP TABLE IF EXISTS `experto_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experto_profile`
--

LOCK TABLES `experto_profile` WRITE;
/*!40000 ALTER TABLE `experto_profile` DISABLE KEYS */;
INSERT INTO `experto_profile` VALUES (1,'Reinaldo','Vera','+56957755313','PUCON 293 POBLACION RENE SCHNEIDER','Biobío','Concepción','Hualpén',NULL,'/uploads/file-1776270165151-677206317.jpg','2026-04-15 14:45:18','2026-04-15 16:22:45','2c34dc62-dcc7-4f32-8c11-53349943a242');
/*!40000 ALTER TABLE `experto_profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `experto_subcategories`
--

DROP TABLE IF EXISTS `experto_subcategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experto_subcategories`
--

LOCK TABLES `experto_subcategories` WRITE;
/*!40000 ALTER TABLE `experto_subcategories` DISABLE KEYS */;
INSERT INTO `experto_subcategories` VALUES ('2026-04-15 14:45:18','2026-04-15 14:45:18',1,9),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,10),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,11),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,12),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,13),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,14),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,15),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,16),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,17),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,18),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,19),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,20),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,21),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,22),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,23),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,24),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,31),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,32),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,33),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,34),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,35),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,36),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,37),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,38),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,39),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,40),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,41),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,42),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,43),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,44),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,45),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,46),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,47),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,48),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,49),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,50),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,51),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,52),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,53),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,54),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,55),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,56),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,57),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,58),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,59),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,65),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,66),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,67),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,68),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,69),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,70),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,71),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,72),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,73),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,74),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,101),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,102),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,103),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,104),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,105),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,106),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,107),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,108),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,114),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,115),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,116),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,117),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,254),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,255),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,256),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,257),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,258),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,259),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,260),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,261),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,262),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,263),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,264),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,265),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,266),('2026-04-15 14:45:18','2026-04-15 14:45:18',1,267);
/*!40000 ALTER TABLE `experto_subcategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_applications`
--

DROP TABLE IF EXISTS `job_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  CONSTRAINT `job_applications_ibfk_49` FOREIGN KEY (`jobId`) REFERENCES `jobs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `job_applications_ibfk_50` FOREIGN KEY (`expertId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_applications`
--

LOCK TABLES `job_applications` WRITE;
/*!40000 ALTER TABLE `job_applications` DISABLE KEYS */;
INSERT INTO `job_applications` VALUES (1,'Tengo amplia experiencia en este tipo de trabajo. Puedo comenzar de inmediato. Ofrezco garantía en todos mis trabajos. Trabajo con materiales de primera calidad.',NULL,'pendiente','2026-04-15 15:11:50','2026-04-15 15:11:50','b89da7a1-4238-474a-a1e3-548aebbb87dd','2c34dc62-dcc7-4f32-8c11-53349943a242'),(2,'Estoy interesado en este trabajo.',NULL,'pendiente','2026-04-16 15:10:35','2026-04-16 15:10:35','d0bb4171-c2c8-4103-a0c5-cf0c6dc1d627','2c34dc62-dcc7-4f32-8c11-53349943a242'),(3,'Tengo amplia experiencia en este tipo de trabajo. Puedo comenzar de inmediato. Ofrezco garantía en todos mis trabajos. Trabajo con materiales de primera calidad.',NULL,'pendiente','2026-04-16 15:25:58','2026-04-16 15:25:58','85e52eee-a65b-4d3d-98b9-f124644341fa','2c34dc62-dcc7-4f32-8c11-53349943a242'),(4,'Tengo amplia experiencia en este tipo de trabajo. Puedo comenzar de inmediato. Trabajo con materiales de primera calidad. Ofrezco garantía en todos mis trabajos.',NULL,'aceptado','2026-04-19 00:27:46','2026-04-19 00:29:16','7e01a525-ab0e-4ed4-a282-9c9ac129d7ba','2c34dc62-dcc7-4f32-8c11-53349943a242');
/*!40000 ALTER TABLE `job_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_photos`
--

DROP TABLE IF EXISTS `job_photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_photos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `photo_url` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `jobId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `jobId` (`jobId`),
  CONSTRAINT `job_photos_ibfk_1` FOREIGN KEY (`jobId`) REFERENCES `jobs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_photos`
--

LOCK TABLES `job_photos` WRITE;
/*!40000 ALTER TABLE `job_photos` DISABLE KEYS */;
INSERT INTO `job_photos` VALUES (1,'/uploads/file-1776265830477-524663236.jpg','2026-04-15 15:10:30','2026-04-15 15:10:30','b89da7a1-4238-474a-a1e3-548aebbb87dd'),(2,'/uploads/file-1776265830478-136893300.jpg','2026-04-15 15:10:30','2026-04-15 15:10:30','b89da7a1-4238-474a-a1e3-548aebbb87dd'),(3,'/uploads/file-1776352744297-314128965.jpg','2026-04-16 15:19:04','2026-04-16 15:19:04','85e52eee-a65b-4d3d-98b9-f124644341fa'),(4,'/uploads/file-1776558391432-762595303.jpg','2026-04-19 00:26:31','2026-04-19 00:26:31','7e01a525-ab0e-4ed4-a282-9c9ac129d7ba'),(5,'/uploads/file-1776558391433-897384507.jpg','2026-04-19 00:26:31','2026-04-19 00:26:31','7e01a525-ab0e-4ed4-a282-9c9ac129d7ba'),(6,'/uploads/file-1776558391434-699769924.jpg','2026-04-19 00:26:31','2026-04-19 00:26:31','7e01a525-ab0e-4ed4-a282-9c9ac129d7ba');
/*!40000 ALTER TABLE `job_photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  `subcategoryId` int unsigned DEFAULT NULL,
  `urgencia` varchar(255) DEFAULT NULL,
  `fecha_preferida` datetime DEFAULT NULL,
  `categoryId` int unsigned DEFAULT NULL,
  `expertId` char(36) DEFAULT NULL,
  `calificacion` decimal(2,1) DEFAULT NULL,
  `resena` text,
  `clientId` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `expertId` (`expertId`),
  KEY `jobs_clientId_foreign_idx` (`clientId`),
  KEY `jobs_ibfk_69` (`categoryId`),
  KEY `jobs_ibfk_68` (`subcategoryId`),
  CONSTRAINT `jobs_clientId_foreign_idx` FOREIGN KEY (`clientId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `jobs_ibfk_67` FOREIGN KEY (`expertId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `jobs_ibfk_68` FOREIGN KEY (`subcategoryId`) REFERENCES `subcategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `jobs_ibfk_69` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES ('7e01a525-ab0e-4ed4-a282-9c9ac129d7ba','reparar filtraciones','se mepasa la casa',NULL,'Biobío','Concepción','Hualpén','No especificada','completado',NULL,'2026-04-19 00:26:31','2026-04-19 00:29:48',NULL,'emergency','2026-04-21 04:00:00',1,'2c34dc62-dcc7-4f32-8c11-53349943a242',5.0,'extraordinario','ac5f86dd-b027-4e38-bd1b-95b834702d1b'),('85e52eee-a65b-4d3d-98b9-f124644341fa','Ventanas Termopanel','necesito cambiar las ventanas de mi casa, todoas en total son 5',NULL,'Biobío','Concepción','Hualpén','No especificada','activo',NULL,'2026-04-16 15:19:04','2026-04-16 15:19:04',NULL,'medium','2026-04-16 04:00:00',18,NULL,NULL,NULL,'ac5f86dd-b027-4e38-bd1b-95b834702d1b'),('b89da7a1-4238-474a-a1e3-548aebbb87dd','Reparacion Techumbe ','necesito reparar el techo de mi casa por que gotea mucho , si es necesario cambiar el techo',NULL,'Biobío','Concepción','Hualpén','No especificada','activo',NULL,'2026-04-15 15:10:30','2026-04-15 15:10:30',NULL,'high','2026-04-16 04:00:00',7,NULL,NULL,NULL,'ac5f86dd-b027-4e38-bd1b-95b834702d1b'),('d0bb4171-c2c8-4103-a0c5-cf0c6dc1d627','pavimentar patio','necesito pavimentar mi patio es de tierra',NULL,'Biobío','Concepción','Hualpén','No especificada','activo',NULL,'2026-04-16 15:09:46','2026-04-16 15:09:46',NULL,'high','2026-04-17 15:07:55',1,NULL,NULL,NULL,'ac5f86dd-b027-4e38-bd1b-95b834702d1b');
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `senderId` char(36) NOT NULL,
  `receiverId` char(36) NOT NULL,
  `content` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `senderId` (`senderId`),
  KEY `receiverId` (`receiverId`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`senderId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiverId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,'ac5f86dd-b027-4e38-bd1b-95b834702d1b','2c34dc62-dcc7-4f32-8c11-53349943a242','hola  reinaldo',1,'2026-04-15 16:42:06','2026-04-15 16:42:15'),(2,'2c34dc62-dcc7-4f32-8c11-53349943a242','ac5f86dd-b027-4e38-bd1b-95b834702d1b','hola scarleth, quiero pustular al trabjo que publicaste',1,'2026-04-15 16:42:32','2026-04-15 16:48:32'),(3,'ac5f86dd-b027-4e38-bd1b-95b834702d1b','2c34dc62-dcc7-4f32-8c11-53349943a242','cuando puedes venir a verlo',1,'2026-04-15 16:42:50','2026-04-15 16:49:52');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portfolio_items`
--

DROP TABLE IF EXISTS `portfolio_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portfolio_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `expertoId` char(36) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text,
  `category` varchar(100) DEFAULT NULL,
  `image_url` text,
  `date` date DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `expertoId` (`expertoId`),
  CONSTRAINT `portfolio_items_ibfk_1` FOREIGN KEY (`expertoId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portfolio_items`
--

LOCK TABLES `portfolio_items` WRITE;
/*!40000 ALTER TABLE `portfolio_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `portfolio_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portfolio_reactions`
--

DROP TABLE IF EXISTS `portfolio_reactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portfolio_reactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `portfolioItemId` int NOT NULL,
  `userId` char(36) NOT NULL,
  `reaction` enum('heart','like','clap','dislike') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `portfolioItemId` (`portfolioItemId`),
  KEY `portfolio_reactions_ibfk_2` (`userId`),
  CONSTRAINT `portfolio_reactions_ibfk_1` FOREIGN KEY (`portfolioItemId`) REFERENCES `portfolio_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `portfolio_reactions_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portfolio_reactions`
--

LOCK TABLES `portfolio_reactions` WRITE;
/*!40000 ALTER TABLE `portfolio_reactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `portfolio_reactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portfolio_reviews`
--

DROP TABLE IF EXISTS `portfolio_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portfolio_reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `portfolioItemId` int NOT NULL,
  `userId` char(36) NOT NULL,
  `comment` text NOT NULL,
  `rating` decimal(2,1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `portfolioItemId` (`portfolioItemId`),
  KEY `portfolio_reviews_ibfk_2` (`userId`),
  CONSTRAINT `portfolio_reviews_ibfk_1` FOREIGN KEY (`portfolioItemId`) REFERENCES `portfolio_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `portfolio_reviews_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portfolio_reviews`
--

LOCK TABLES `portfolio_reviews` WRITE;
/*!40000 ALTER TABLE `portfolio_reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `portfolio_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('review','user','post','language') NOT NULL,
  `reason` varchar(200) NOT NULL,
  `description` text,
  `reporterId` char(36) DEFAULT NULL,
  `reportedUserId` char(36) DEFAULT NULL,
  `reportedContent` text,
  `status` enum('pending','reviewed','resolved') NOT NULL DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `reporterId` (`reporterId`),
  KEY `reportedUserId` (`reportedUserId`),
  CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`reporterId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`reportedUserId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subcategories`
--

DROP TABLE IF EXISTS `subcategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  KEY `idx_subcategories_name` (`name`),
  CONSTRAINT `subcategories_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=268 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcategories`
--

LOCK TABLES `subcategories` WRITE;
/*!40000 ALTER TABLE `subcategories` DISABLE KEYS */;
INSERT INTO `subcategories` VALUES (9,2,'Instalación eléctrica domiciliaria','instalacion-electrica-domiciliaria','Instalación eléctrica para viviendas','luz, cables, corriente, circuitos, planos, instalación, empalme, normativa, técnico, electricista',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(10,2,'Reparaciones eléctricas','reparaciones-electricas','Diagnóstico y reparación de fallas eléctricas','corto circuito, falla, chispas, olor a quemado, no hay luz, revisión, mantención, emergencia',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(11,2,'Tableros eléctricos','tableros-electricos','Instalación y mantención de tableros','automático, diferencial, térmica, caja, breakers, fase, neutro, tierra, protección',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(12,2,'Enchufes e interruptores','enchufes-e-interruptores','Instalación y cambio de enchufes e interruptores','toma de corriente, punto, apagador, interruptor, módulo, doble, triple, usb, empotrado',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(13,2,'Luminarias y focos','luminarias-y-focos','Instalación de lámparas, focos y luminarias','lámpara, foco, led, dicroico, panel, colgante, apliqué, foco exterior, iluminación, plafón',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(14,2,'Citofonía y timbres','citofonia-y-timbres','Instalación y reparación de timbres y citófonos','citófono, intercomunicador, timbre, campana, botón, inalámbrico, portero, audio',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(15,2,'Generadores y respaldo UPS','generadores-y-respaldo-ups','Sistemas eléctricos de respaldo','batería, respaldo, ups, generador, bencina, diesel, corte de luz, estabilizador, energía',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(16,2,'Automatización eléctrica','automatizacion-electrica','Automatización básica de circuitos y dispositivos','reloj, timer, sensor de movimiento, fotocelda, encendido automático, control, domótica básica',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(17,3,'Reparación de fugas','reparacion-de-fugas','Detección y reparación de fugas de agua','gotera, fuga, humedad, cañería rota, filtración, sello, llave pasa, pérdida agua, detector',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(18,3,'Instalación de cañerías','instalacion-de-canerias','Instalación y reemplazo de cañerías','tubo, ppr, cobre, pvc, cpvc, red, agua, alimentación, soldadura, unión',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(19,3,'Destape de desagües','destape-de-desagues','Destape de lavaplatos, lavamanos y desagües','tapado, obstrucción, desagüe, baño, alcantarillado, cámara, sonda, máquina, sopaipilla, químico',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(20,3,'Instalación de grifería','instalacion-de-griferia','Instalación y cambio de llaves y grifería','grifo, llave, monomando, ducha, mezclador, lavamanos, lavaplatos, bidet, flexible',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(21,3,'Instalación de WC','instalacion-de-wc','Montaje y reparación de inodoros','baño, inodoro, taza, descarga, estanque, fitting, gomas, sello, pernos, filtración wc',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(22,3,'Instalación de lavaplatos y lavamanos','instalacion-de-lavaplatos-y-lavamanos','Montaje y conexión de artefactos sanitarios','lavaplatos, lavamanos, vanitorio, sifón, desagüe, instalación, cocina, baño',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(23,3,'Calefont y termos','calefont-y-termos','Instalación y mantención de calefont y termos','calefont, termo, caldera, agua caliente, no calienta, piloto, membrana, chispero, serpentín',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(24,3,'Redes de gas','redes-de-gas','Instalaciones y mantención de redes de gas','gas, cobre, cañería, cocina, estufa, calefont, sello verde, fuga gas, regulador, cilindro',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(25,4,'Instalación de aire acondicionado','instalacion-de-aire-acondicionado','Montaje de equipos de climatización','aire, frío, calor, split, unidad, instalación, soporte, conexión, climatización',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(26,4,'Mantención de aire acondicionado','mantencion-de-aire-acondicionado','Limpieza y mantención preventiva','limpieza, filtro, gas, r410, r22, recarga, revisión, preventivo, hongo, olor',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(27,4,'Reparación de aire acondicionado','reparacion-de-aire-acondicionado','Diagnóstico y reparación de equipos','no enfría, no prende, ruido, gotea, falla eléctrica, motor, compresor, placa',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(28,4,'Calefacción domiciliaria','calefaccion-domiciliaria','Sistemas de calefacción para el hogar','estufa, radiador, caldera, piso radiante, calefacción, central, pellet, leña, gas',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(29,4,'Ventilación y extractores','ventilacion-y-extractores','Instalación de extractores y ventilación','extractor, baño, cocina, ventilación, ducto, aire, purificador, campana',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(30,4,'Refrigeración','refrigeracion','Sistemas de refrigeración residencial','frío, cámara, vitrina, industrial, compresor, gas, mantenimiento, comercial',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(31,5,'Muebles a medida','muebles-a-medida','Fabricación de muebles personalizados','madera, mueble, diseño, melamina, medida, carpintero, fabricación, plano',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(32,5,'Reparación de muebles','reparacion-de-muebles','Reparación estructural y estética de muebles','roto, suelto, restauración, barnizado, encolado, cajón, bisagra, silla, mesa',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(33,5,'Closets y muebles empotrados','closets-y-muebles-empotrados','Diseño e instalación de muebles empotrados','closet, ropero, vestidor, despensa, empotrado, melamina, cajonera, colgador',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(34,5,'Instalación de puertas de madera','instalacion-de-puertas-de-madera','Puertas, marcos y ajustes','puerta, marco, bisagra, cepillado, chapa, ajuste, madera, acceso, dormitorio',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(35,5,'Deck y terrazas de madera','deck-y-terrazas-de-madera','Construcción de deck y superficies de madera','deck, terraza, madera, pino, impregnado, piso exterior, pérgola, barniz',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(36,5,'Cocinas y muebles de cocina','cocinas-y-muebles-de-cocina','Fabricación e instalación de cocinas','repostería, despensa, encimera, mueble cocina, cajones, bisagras, tiradores',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(37,6,'Pintura interior','pintura-interior','Pintura para muros y cielos interiores','pared, muro, techo, látex, óleo, rodillo, pintura, departamento, casa, color',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(38,6,'Pintura exterior','pintura-exterior','Pintura de fachadas y exteriores','fachada, muro exterior, reja, esmalte, intemperie, andamio, impermeabilización',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(39,6,'Barniz y lacado','barniz-y-lacado','Protección y terminación en madera','barniz, laca, brillo, sello, madera, protección, terminación, tinte',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(40,6,'Papel mural','papel-mural','Instalación y retiro de papel mural','papel, mural, pegamento, diseño, decoración, empapelado, pared, revestimiento',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(41,6,'Reparación y alisado de muros','reparacion-y-alisado-de-muros','Preparación de superficies antes de pintar','empaste, pasta muro, lijado, yeso, fisura, grieta, alisado, preparación',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(42,6,'Impermeabilización de superficies','impermeabilizacion-de-superficies','Tratamientos impermeables para muros y techos','sello, humedad, agua, filtración, pintura asfáltica, membrana, techo, muro',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(43,7,'Instalación de repisas y soportes','instalacion-de-repisas-y-soportes','Montaje de repisas, soportes y accesorios','repisa, soporte, cuadro, taladro, perforación, anclaje, tarugo, estante',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(44,7,'Instalación de cortinas y rieles','instalacion-de-cortinas-y-rieles','Montaje de rieles y cortinaje','cortina, riel, barra, roller, persiana, visillo, soporte, ventana',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(45,7,'Armado de muebles','armado-de-muebles','Armado e instalación de muebles prefabricados','armado, kit, mueble, retail, escritorio, cama, closet, armado manual',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(46,7,'Sellados y siliconas','sellados-y-siliconas','Sellado de uniones, baños, cocinas y ventanas','silicona, sello, tina, baño, cocina, junta, dilatación, hermético',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(47,7,'Reparaciones generales del hogar','reparaciones-generales-del-hogar','Servicio técnico general para el hogar','handyman, maestrochasquilla, arreglo, mantenimiento, hogar, varios, reparaciones',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(48,8,'Mantención de jardines','mantencion-de-jardines','Cuidado periódico de jardines','jardín, patio, plantas, mantención, riego, tierra, abono, desmalezado',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(49,8,'Poda de árboles y arbustos','poda-de-arboles-y-arbustos','Poda ornamental y correctiva','poda, rama, corte, árbol, cerco vivo, arbusto, altura, despeje',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(50,8,'Corte de césped','corte-de-cesped','Corte y mantención de pasto','pasto, césped, cortar, orillado, cortacésped, desmalezado',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(51,8,'Riego automático','riego-automatico','Instalación y mantención de sistemas de riego','riego, aspersor, programador, electroválvula, goteo, tubería, jardín',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(52,8,'Paisajismo','paisajismo','Diseño y mejora de espacios exteriores','diseño, jardín, plantas, decoración, piedras, proyecto, exterior',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(53,8,'Cercos y cierres exteriores','cercos-y-cierres-exteriores','Instalación de rejas, cercos y cierres','reja, madera, malla, cerco, cierre, portón, muro, delimitación',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(54,9,'Limpieza domiciliaria','limpieza-domiciliaria','Limpieza general del hogar','aseo, casa, departamento, limpieza, piezas, cocina, baño',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(55,9,'Limpieza profunda','limpieza-profunda','Limpieza intensiva de espacios','profundo, detallado, cocina, baño, desinfección, suciedad acumulada',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(56,9,'Limpieza post construcción','limpieza-post-construccion','Limpieza especializada tras obras','obra, construcción, polvo, fin de obra, restos, pintura, limpieza final',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(57,9,'Sanitización','sanitizacion','Sanitización de espacios y superficies','virus, bacterias, covid, amonio, desinfección, sanitizado, nebulización',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(58,9,'Limpieza de alfombras y tapices','limpieza-de-alfombras-y-tapices','Lavado y limpieza de textiles','alfombra, sillón, sofá, tapiz, lavado, aspirado, vapor, mancha',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(59,9,'Limpieza de vidrios','limpieza-de-vidrios','Limpieza de ventanas, vitrinas y mamparas','vidrio, ventana, cristal, altura, limpieza, mancha, ventanal',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(60,10,'Instalación de cámaras CCTV','instalacion-de-camaras-cctv','Montaje de cámaras de vigilancia','cámara, seguridad, cctv, dvr, nvr, ip, vigilancia, monitoreo, grabación',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(61,10,'Alarmas domiciliarias','alarmas-domiciliarias','Instalación y configuración de alarmas','alarma, sensor, sirena, pánico, seguridad, intrusión, central, inalámbrica',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(62,10,'Video porteros','video-porteros','Instalación de porteros y video porteros','cámara, portero, pantalla, timbre, video, acceso, seguridad',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(63,10,'Control de acceso','control-de-acceso','Sistemas de acceso con clave, tarjeta o biometría','tarjeta, huella, teclado, clave, acceso, cerradura eléctrica, magnética',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(64,10,'Cercos eléctricos','cercos-electricos','Instalación y mantención de cercos eléctricos','cerco, corriente, seguridad, perímetro, choque, electrificado, protección',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(65,11,'Reparación de lavadoras','reparacion-de-lavadoras','Diagnóstico y reparación de lavadoras','lavadora, secadora, carga frontal, motor, tambor, no bota agua, ruido, bomba',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(66,11,'Reparación de refrigeradores','reparacion-de-refrigeradores','Servicio técnico de refrigeradores','refrigerador, nevera, no enfría, gas, motor, compresor, hongo, filtro, placa',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(67,11,'Reparación de hornos y cocinas','reparacion-de-hornos-y-cocinas','Servicio técnico de cocina y horno','horno, cocina, encimera, gas, quemador, chispero, resistencia, eléctrico',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(68,11,'Reparación de microondas','reparacion-de-microondas','Diagnóstico y reparación de microondas','microondas, plato, magnetrón, no calienta, cortocircuito, reparación',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(69,11,'Instalación de electrodomésticos','instalacion-de-electrodomesticos','Montaje y conexión de artefactos','lavadora, lavavajillas, cocina, horno, empotrado, instalación, conexión',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(70,12,'Mudanzas locales','mudanzas-locales','Traslado dentro de la misma ciudad','mudanza, camión, casa, flete, transporte, local, traslado',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(71,12,'Mudanzas interurbanas','mudanzas-interurbanas','Traslado entre ciudades','mudanza, carretera, largo, país, transporte, interurbano, camión',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(72,12,'Fletes','fletes','Transporte de carga y artículos','flete, camioneta, carga, transporte, bultos, retiro, despacho',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(73,12,'Embalaje','embalaje','Servicio de embalaje para mudanzas','caja, cartón, burbuja, film, embalado, protección, frágil',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(74,12,'Carga y descarga','carga-y-descarga','Apoyo en manipulación de carga','peoneta, carga, bajar, subir, escombros, muebles, fuerza',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(75,13,'Reparación de computadores','reparacion-de-computadores','Diagnóstico y reparación de PC y notebooks','computador, pc, notebook, laptop, mac, reparación, hardware, teclado',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(76,13,'Formateo e instalación de sistema operativo','formateo-e-instalacion-de-sistema-operativo','Instalación limpia de Windows, Linux u otros','formatear, windows, office, sistema, drivers, macos, instalación, linux',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(77,13,'Eliminación de virus','eliminacion-de-virus','Limpieza de malware, spyware y software malicioso','virus, malware, troyano, lentitud, antivirus, limpieza, publicidad',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(78,13,'Optimización de PC','optimizacion-de-pc','Mejora de rendimiento y configuración','lento, rápido, optimizar, inicio, ram, ssd, disco, mantenimiento',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(79,13,'Armado de PC','armado-de-pc','Ensamblaje de computadores a medida','armado, pc, piezas, gamer, componentes, montaje, placa madre, cpu',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(80,13,'Instalación de software','instalacion-de-software','Instalación y configuración de programas','programas, adobe, autocad, office, instalación, licencias, activación',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(81,13,'Recuperación de datos','recuperacion-de-datos','Rescate de archivos desde discos o equipos dañados','disco duro, perdido, borrado, rescatar, archivos, fotos, datos, usb',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(82,13,'Instalación de impresoras','instalacion-de-impresoras','Conexión y configuración de impresoras','impresora, wifi, red, scanner, driver, tóner, tinta, configuración',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(83,13,'Soporte remoto','soporte-remoto','Asistencia técnica a distancia','remoto, teamviewer, anydesk, ayuda, pantalla, asistencia, distancia',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(84,13,'Respaldo y copias de seguridad','respaldo-y-copias-de-seguridad','Configuración de backups y recuperación','backup, copia, nube, drive, respaldo, seguridad, automático',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(85,13,'Ciberseguridad básica','ciberseguridad-basica','Protección básica de equipos y cuentas','hacker, contraseña, seguridad, protección, privacidad, estafa, phishing',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(86,14,'Configuración de router y WiFi','configuracion-de-router-y-wifi','Configuración de redes inalámbricas','wifi, internet, router, señal, clave, lento, mala señal, repetidor',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(87,14,'Cableado estructurado','cableado-estructurado','Tendido e instalación de cableado de red','red, cable, rj45, canaleta, switch, rack, lan, estructurado',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(88,14,'Instalación de puntos de red','instalacion-de-puntos-de-red','Conexión de puertos de red en hogar u oficina','punto, red, internet, ethernet, pared, conexión, cable',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(89,14,'Extensión de señal WiFi','extension-de-senal-wifi','Mejora de cobertura inalámbrica','repetidor, mesh, malla, ampliar, wifi, señal, patio, segundo piso',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(90,14,'Configuración de switches y access points','configuracion-de-switches-y-access-points','Configuración de equipamiento de red','switch, ap, access point, ubiquiti, cisco, configuración, administración',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(91,14,'Instalación de fibra y conectividad','instalacion-de-fibra-y-conectividad','Soporte e instalación de conectividad doméstica','fibra óptica, internet, ont, módem, alta velocidad, conexión',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(92,15,'Instalación de paneles solares','instalacion-de-paneles-solares','Montaje de paneles fotovoltaicos','solar, panel, placa, sol, energía, renovable, fotovoltaico, ahorro',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(93,15,'Mantención de sistemas solares','mantencion-de-sistemas-solares','Limpieza y mantención de sistemas solares','limpieza, revisión, mantención, paneles, voltaje, baterías, sol',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(94,15,'Inversores y controladores','inversores-y-controladores','Instalación y revisión de inversores','inversor, controlador, carga, regulador, voltaje, sistema solar',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(95,15,'Baterías y almacenamiento','baterias-y-almacenamiento','Sistemas de respaldo energético','batería, litio, gel, almacenamiento, respaldo, descarga, ciclo profundo',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(96,16,'Automatización de iluminación','automatizacion-de-iluminacion','Control inteligente de luces','luz, inteligente, smart, ampolleta, wifi, bluetooth, dimer, color',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(97,16,'Automatización de persianas y cortinas','automatizacion-de-persianas-y-cortinas','Motores y sistemas automáticos','cortina, persiana, motor, inteligente, remoto, aplicación, subir, bajar',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(98,16,'Sensores inteligentes','sensores-inteligentes','Sensores de movimiento, humo y apertura','sensor, puerta, movimiento, agua, humo, inteligente, smart, alarma',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(99,16,'Integración Alexa y Google Home','integracion-alexa-y-google-home','Configuración de asistentes inteligentes','alexa, google, voz, bocina, parlante, inteligente, configuración, rutina',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(100,16,'Cerraduras inteligentes','cerraduras-inteligentes','Instalación de cerraduras y accesos inteligentes','chapa, cerradura, inteligente, huella, código, wifi, digital, electrónica',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(101,17,'Apertura de puertas','apertura-de-puertas','Apertura de puertas bloqueadas o cerradas','abrir, puerta, emergencia, llave adentro, pérdida, trabado, cerrajero',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(102,17,'Cambio de cerraduras','cambio-de-cerraduras','Reemplazo de cerraduras y cilindros','cambiar, chapa, cerradura, cilindro, pomo, seguridad, llave nueva',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(103,17,'Copia e instalación de llaves','copia-e-instalacion-de-llaves','Duplicado y ajuste de llaves','copia, llave, duplicado, instalación, cerrajería, taller',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(104,17,'Cerraduras de seguridad','cerraduras-de-seguridad','Instalación de sistemas reforzados','seguridad, blindada, multipunto, cerrojo, protección, reforzada, chapa',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(105,18,'Instalación de vidrios','instalacion-de-vidrios','Montaje y reemplazo de vidrios','vidrio, roto, ventana, cristal, termo panel, templado, laminado',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(106,18,'Espejos a medida','espejos-a-medida','Instalación de espejos personalizados','espejo, baño, muro, decoración, medida, marco, pulido',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(107,18,'Ventanas de aluminio','ventanas-de-aluminio','Fabricación e instalación de ventanas','ventana, aluminio, marco, corredera, manilla, cierre, riel',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(108,18,'Mamparas y shower door','mamparas-y-shower-door','Instalación de mamparas para baño','baño, ducha, shower door, mampara, vidrio, oficina, separación',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(109,19,'Cerámicos y porcelanatos','ceramicos-y-porcelanatos','Instalación de revestimientos cerámicos','piso, cerámica, porcelanato, fragüe, muro, baldosa, instalación',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(110,19,'Piso flotante','piso-flotante','Instalación y reparación de piso flotante','piso, flotante, laminado, junquillo, guardapolvo, espuma, instalación',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(111,19,'Piso vinílico','piso-vinilico','Instalación de revestimiento vinílico','vinílico, spc, pvc, adhesivo, clic, piso, resistente, agua',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(112,19,'Alfombras y cubrepisos','alfombras-y-cubrepisos','Instalación de alfombras y cubrepisos','alfombra, muro a muro, cubrepiso, pegamento, instalación, fleje',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(113,19,'Reparación de revestimientos','reparacion-de-revestimientos','Corrección y restauración de superficies','suelto, roto, picado, cerámica, piso, reparación, fragüe',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(114,20,'Reparación de techumbres','reparacion-de-techumbres','Corrección de filtraciones y daños en techos','techo, teja, zinc, techumbre, filtración, gotera, cumbrera, estructura',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(115,20,'Instalación de cubiertas','instalacion-de-cubiertas','Montaje de cubiertas y planchas','techo, zinc, pizarreño, teja asfáltica, cubierta, policarbonato, instalación',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(116,20,'Canaletas y bajadas de agua','canaletas-y-bajadas-de-agua','Instalación y limpieza de drenajes de techumbre','canaleta, bajada, agua, lluvia, limpieza, instalación, pvc, zinc',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(117,20,'Impermeabilización de techos','impermeabilizacion-de-techos','Sellado y tratamiento de cubiertas','sello, membrana, pintura asfáltica, techo, filtración, impermeable',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(118,21,'Fumigación','fumigacion','Eliminación de plagas en interiores y exteriores','insectos, bichos, moscas, arañas, fumigado, líquido, químico',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(119,21,'Control de roedores','control-de-roedores','Tratamiento y control de ratones y ratas','ratón, laucha, rata, veneno, trampa, desratización, control',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(120,21,'Control de insectos','control-de-insectos','Tratamiento contra hormigas, cucarachas y otros','baratas, hormigas, termitas, chinches, pulgas, garrapatas, control',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(121,21,'Sanitización ambiental','sanitizacion-ambiental','Tratamientos sanitarios complementarios','sanitizado, ambiente, olores, bacterias, virus, limpieza',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(122,22,'Instalación de televisores','instalacion-de-televisores','Montaje de TV en muro o soporte','televisor, tv, soporte, muro, anclaje, led, smart tv, colgar',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(123,22,'Instalación de soportes y anclajes','instalacion-de-soportes-y-anclajes','Montaje de soportes en muro','soporte, anclaje, perno, muro, taladro, seguridad, fijación',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(124,22,'Instalación de accesorios de baño','instalacion-de-accesorios-de-bano','Montaje de barras, espejos y accesorios','baño, toallero, jabonera, barra, espejo, accesorio, perforación',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(125,22,'Instalación de campanas y extractores','instalacion-de-campanas-y-extractores','Montaje de campanas de cocina y extractores','campana, extractor, cocina, ventilación, ducto, grasa, montaje',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(126,22,'Mantenimiento general del hogar','mantenimiento-general-del-hogar','Servicios preventivos y correctivos para el hogar','maestro, mantenimiento, preventivo, revisión, casa, arreglo, general',1,'2026-04-02 15:55:32','2026-04-02 15:55:32'),(254,1,'Albañilería','albanileria','Trabajos generales de construcción','ladrillo, bloque, cemento, mezcla, construcción, muro, pared, radier, concreto, hormigón, cimiento, pilar, viga, estuco, nivelación',1,'2026-04-04 13:22:18','2026-04-04 13:22:18'),(255,1,'Construcción de muros','construccion-muros','Levantamiento de paredes y cierres','pared, muro, pandereta, bloque, ladrillo, tabique, vulcanita, albañil, estructural, contención',1,'2026-04-04 13:22:18','2026-04-04 13:22:18'),(256,1,'Radieres','radieres','Pisos de concreto y nivelación','piso, concreto, cemento, hormigón, radier, nivelado, malla acma, carretilla, alisado, fundaciones, mezcla',1,'2026-04-04 13:22:18','2026-04-04 13:22:18'),(257,1,'Ampliaciones','ampliaciones','Extensión de espacios habitables','segundo piso, pieza nueva, dormitorio, cocina ampliada, logia, cobertizo, remodelación, estructura',1,'2026-04-04 13:22:18','2026-04-04 13:22:18'),(258,1,'Remodelaciones','remodelaciones','Renovación de espacios existentes','reforma, modernización, cambio, mejora, interiorismo, diseño, actualización, casa, departamento',1,'2026-04-04 13:22:18','2026-04-04 13:22:18'),(259,1,'Demoliciones menores','demoliciones-menores','Retiro de estructuras pequeñas','derribar, botar muro, picar, escombros, mazo, retiro, despeje, desmantelar',1,'2026-04-04 13:22:18','2026-04-04 13:22:18'),(260,1,'Excavaciones menores','excavaciones-menores','Zanjas y pozos manuales','zanja, pozo, hoyo, tierra, picota, pala, excavar, piscina pequeña, drenaje',1,'2026-04-04 13:22:18','2026-04-04 13:22:18'),(261,1,'Hormigón y cemento','hormigon-cemento','Trabajos técnicos en concreto','concreto, fraguado, mezcla, trompo, enfierradura, moldaje, vibrado, losa',1,'2026-04-04 13:22:18','2026-04-04 13:22:18'),(262,1,'Reparación de techumbres','reparacion-techumbres','Solución de goteras y daños en techos','techo, teja, zinc, techumbre, filtración, gotera, cumbrera, estructura',1,'2026-04-04 13:22:18','2026-04-04 13:22:18'),(263,1,'Instalación de cubiertas','instalacion-cubiertas','Montaje de techos nuevos','techo, zinc, pizarreño, teja asfáltica, cubierta, policarbonato, instalación',1,'2026-04-04 13:22:18','2026-04-04 13:22:18'),(264,1,'Cerámicos y porcelanatos','ceramicos-porcelanatos','Instalación de palmetas de piso y muro','piso, cerámica, porcelanato, fragüe, muro, baldosa, instalación',1,'2026-04-04 13:22:18','2026-04-04 13:22:18'),(265,1,'Instalación de vidrios','instalacion-vidrios','Reposición y montaje de cristales','vidrio, roto, ventana, cristal, termo panel, templado, laminado',1,'2026-04-04 13:22:18','2026-04-04 13:22:18'),(266,1,'Ventanas de aluminio','ventanas-aluminio','Fabricación y reparación de marcos metálicos','ventana, aluminio, marco, corredera, manilla, cierre, riel',1,'2026-04-04 13:22:18','2026-04-04 13:22:18'),(267,1,'Reparación de revestimientos','reparacion-revestimientos','Arreglo de piezas de piso o muro dañadas','suelto, roto, picado, cerámica, piso, reparación, fragüe',1,'2026-04-04 13:22:18','2026-04-04 13:22:18');
/*!40000 ALTER TABLE `subcategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('2c34dc62-dcc7-4f32-8c11-53349943a242','reinaldo@gmail.com','$2b$10$AZM0GqYah1.MCezzFyoKK.SDo3D/ZoZZj7ymwK/5RaBw.x8Y9OlZi','experto','2026-04-15 14:45:18','2026-04-15 16:22:49','Reinaldo','Vera'),('9f843d82-e9f1-4b8b-ab3c-85bebf380a92','manuel.vera.poblete@gmail.com','$2b$10$FHz1gqrndqFIg5SxU6w6FOnZE68BQ4DYcqwVjtuJQvuhTBFS1qPSS','admin','2026-04-02 22:01:42','2026-04-02 22:01:42','Manuel','Vera'),('ac5f86dd-b027-4e38-bd1b-95b834702d1b','scarleth@gmail.com','$2b$10$nO6INAkjhZtsXn78909u2uitPuozveiEs5t1Nu5BV0i98e0cHXXQO','cliente','2026-04-15 14:39:50','2026-04-15 14:39:50','Scarleth','Vera');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;


