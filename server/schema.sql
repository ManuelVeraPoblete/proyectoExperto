-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS experthandsbd;
USE experthandsbd;

-- 1. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    region VARCHAR(100),
    provincia VARCHAR(100),
    comuna VARCHAR(100),
    avatar_url TEXT,
    user_type ENUM('client', 'expert', 'admin') NOT NULL,
    bio TEXT,
    calificacion_promedio DECIMAL(3, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Especialidades
CREATE TABLE IF NOT EXISTS specialties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 3. Relación Muchos a Muchos: Expertos y Especialidades
CREATE TABLE IF NOT EXISTS user_specialties (
    user_id VARCHAR(36),
    specialty_id INT,
    PRIMARY KEY (user_id, specialty_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (specialty_id) REFERENCES specialties(id) ON DELETE CASCADE
);

-- 4. Tabla de Trabajos
CREATE TABLE IF NOT EXISTS jobs (
    id VARCHAR(36) PRIMARY KEY,
    client_id VARCHAR(36) NOT NULL,
    expert_id VARCHAR(36),
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    categoria VARCHAR(100),
    region VARCHAR(100),
    provincia VARCHAR(100),
    comuna VARCHAR(100),
    presupuesto DECIMAL(10, 2),
    estado ENUM('activo', 'en_proceso', 'completado', 'cancelado') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id),
    FOREIGN KEY (expert_id) REFERENCES users(id)
);

-- 5. Tabla de Reseñas
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id VARCHAR(36) NOT NULL,
    author_id VARCHAR(36) NOT NULL,
    target_id VARCHAR(36) NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (author_id) REFERENCES users(id),
    FOREIGN KEY (target_id) REFERENCES users(id)
);

-- 6. Tabla de Mensajes
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id VARCHAR(36) NOT NULL,
    receiver_id VARCHAR(36) NOT NULL,
    job_id VARCHAR(36),
    text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);

-- 7. Tabla de Reportes
CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reporter_id VARCHAR(36) NOT NULL,
    reported_id VARCHAR(36) NOT NULL,
    type VARCHAR(50),
    reason TEXT NOT NULL,
    status ENUM('pendiente', 'en_revision', 'resuelto') DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users(id),
    FOREIGN KEY (reported_id) REFERENCES users(id)
);

-- Datos Mock iniciales
INSERT IGNORE INTO specialties (name) VALUES ('Plomería'), ('Electricidad'), ('Carpintería'), ('Pintura'), ('Albañilería');
