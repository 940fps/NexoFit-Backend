CREATE DATABASE IF NOT EXISTS mariadb;

USE mariadb;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    birth_date DATE,
    weight DECIMAL(5,2),        
    height DECIMAL(4,2),
    role ENUM('client', 'instructor', 'admin') DEFAULT 'client',
    image_url VARCHAR(255),      
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    slug VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS modalities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    category_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    modality_id INT NOT NULL,
    instructor_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    capacity INT NOT NULL DEFAULT 20,
    FOREIGN KEY (modality_id) REFERENCES modalities(id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    class_id INT NOT NULL,
    status ENUM('confirmed', 'cancelled') DEFAULT 'confirmed',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    UNIQUE(user_id, class_id)
);

-- Datos de ejemplo
INSERT INTO users (first_name, last_name, email, password, role, phone) VALUES 
('Admin', 'Principal', 'admin@nexofit.com', '123456', 'admin', '555-0001'),
('Laura', 'Entrenadora', 'laura@nexofit.com', '123456', 'instructor', '555-0002'),
('Carlos', 'González', 'carlos@nexofit.com', '123456', 'client', '555-0003'),
('Ana', 'Martínez', 'ana@nexofit.com', '123456', 'client', '555-0004');

INSERT INTO category (title, description, slug) VALUES 
('Fuerza', 'Entrenamiento de resistencia y musculación', 'fuerza'),
('Cardio', 'Ejercicios cardiovasculares y resistencia aeróbica', 'cardio'),
('Baile', 'Actividades de baile y ritmo', 'baile'),
('Relax', 'Actividades de relajación y bienestar', 'relax');

INSERT INTO modalities (title, description, category_id) VALUES 
('Zumba Beach', 'Baile latino intenso', 3),
('BodyPump', 'Pesas y resistencia', 1),
('Yoga Zen', 'Relajación y estiramiento', 4),
('Spinning', 'Entrenamiento cardiovascular', 2);

INSERT INTO classes (modality_id, instructor_id, start_time, end_time, capacity) VALUES 
(1, 2, '2026-02-15 10:00:00', '2026-02-15 11:00:00', 20),
(2, 2, '2026-02-15 18:00:00', '2026-02-15 19:00:00', 15),
(4, 2, '2026-02-16 09:00:00', '2026-02-16 10:00:00', 25),
(3, 2, '2026-02-16 17:00:00', '2026-02-16 18:00:00', 15);

INSERT INTO bookings (user_id, class_id) VALUES 
(3, 1),
(4, 1),
(3, 2);

-- Consulta de ejemplo: Ver reservas con detalles
SELECT 
    classes.start_time, 
    modalities.title AS activity_name,
    category.title AS category_name,
    CONCAT(users.first_name, ' ', users.last_name) AS client_name,
    CONCAT(instructor.first_name, ' ', instructor.last_name) AS instructor_name,
    bookings.status
FROM bookings
JOIN classes ON bookings.class_id = classes.id
JOIN modalities ON classes.modality_id = modalities.id
JOIN category ON modalities.category_id = category.id
JOIN users ON bookings.user_id = users.id
JOIN users AS instructor ON classes.instructor_id = instructor.id;