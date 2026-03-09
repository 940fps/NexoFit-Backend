CREATE DATABASE IF NOT EXISTS mariadb;

USE mariadb;

-- -----------------------------------------------------
-- Creación de Tablas
-- -----------------------------------------------------

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

-- -----------------------------------------------------
-- Inserción de Datos (Nuevos Inserts)
-- -----------------------------------------------------

-- Usuarios
INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `phone`, `birth_date`, `weight`, `height`, `role`, `image_url`, `is_active`, `created_at`) VALUES 
(1, 'Admin', 'Principal', 'admin@nexofit.com', '$2b$10$oRSC.ECKS3pQVv4FQ0lTJewmKJJ0go1Yy/wThBeybqN2uW5.k.Pxy', '555-0001', NULL, NULL, NULL, 'admin', NULL, 1, '2026-02-27 16:00:17'),
(2, 'Paula', 'Entrenadora', 'paula@nexofit.com', '$2b$10$oRSC.ECKS3pQVv4FQ0lTJewmKJJ0go1Yy/wThBeybqN2uW5.k.Pxy', '555-0002', NULL, NULL, NULL, 'instructor', NULL, 1, '2026-02-27 16:00:17'),
(3, 'Carlos', 'González', 'carlos@nexofit.com', '$2b$10$oRSC.ECKS3pQVv4FQ0lTJewmKJJ0go1Yy/wThBeybqN2uW5.k.Pxy', '555-0003', NULL, NULL, NULL, 'client', NULL, 1, '2026-02-27 16:00:17'),
(4, 'Ana', 'Martínez', 'ana@nexofit.com', '$2b$10$oRSC.ECKS3pQVv4FQ0lTJewmKJJ0go1Yy/wThBeybqN2uW5.k.Pxy', '555-0004', NULL, NULL, NULL, 'client', NULL, 1, '2026-02-27 16:00:17'),
(5, 'Mario', 'Instructor', 'mario@nexofit.com', '$2b$10$oRSC.ECKS3pQVv4FQ0lTJewmKJJ0go1Yy/wThBeybqN2uW5.k.Pxy', '555-0005', NULL, NULL, NULL, 'instructor', NULL, 1, '2026-02-27 16:00:17'),
(8, 'Lorenzo', 'Lacarte', 'instructor@nexofit.com', '$2b$10$oRSC.ECKS3pQVv4FQ0lTJewmKJJ0go1Yy/wThBeybqN2uW5.k.Pxy', '123123123', NULL, NULL, NULL, 'instructor', 'https://media.licdn.com/dms/image/v2/D4D03AQGXfONd7RBaeg/profile-displayphoto-scale_200_200/B4DZu8418OIAAY-/0/1768400576851?e=1774483200&v=beta&t=Xph6x-oeJKHSISJt1aZh36TxTI5DStRSWwasPr4UgJk', 1, '2026-03-09 15:37:19'),
(9, 'Marcos', 'Mesa', 'cliente@nexofit.com', '$2b$10$gJECd4vaw1LBOimUjvJQI.uTaxJFkARGqGMsf9J3CdqwmHOW.x0dG', '123123123', NULL, NULL, NULL, 'client', 'https://i.imgur.com/14DZX0q.jpeg', 1, '2026-03-09 15:38:49');

-- Categorías
INSERT INTO `category` (`id`, `title`, `description`, `slug`) VALUES 
(1, 'Fuerza', 'Entrenamiento de resistencia y musculación', 'fuerza'),
(2, 'Cardio', 'Ejercicios cardiovasculares y resistencia aeróbica', 'cardio'),
(3, 'Baile', 'Actividades de baile y ritmo', 'baile'),
(4, 'Relax', 'Actividades de relajación y bienestar', 'relax');

-- Modalidades
INSERT INTO `modalities` (`id`, `title`, `description`, `image_url`, `category_id`) VALUES 
(1, 'Zumba Beach', 'Baile latino intens2', 'https://www.lazenia.com/wp-content/uploads/2023/10/webpromo.jpg', 3),
(2, 'BodyPump', 'Pesas y resistencia', 'https://www.lesmillsargentina.com.ar/wp-content/uploads/2025/05/bodypump2.jpg', 1),
(3, 'Yoga Zen', 'Relajación y estiramiento', 'https://static.wixstatic.com/media/5ca053_27a142009d014f3b9d05d3427000c184~mv2_d_2048_1367_s_2.jpg/v1/fill/w_640,h_426,al_l,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/5ca053_27a142009d014f3b9d05d3427000c184~mv2_d_2048_1367_s_2.jpg', 4),
(4, 'Spinning', 'Entrenamiento cardiovascular', 'https://i.blogs.es/f7460a/1/1366_2000.jpg', 2),
(5, 'CrossFit', 'Entrenamiento funcional de alta intensidad', 'https://www.infisport.com/media/amasty/blog/Como_entrenar_la_fuerza_en_crossfit_1.jpg', 1),
(6, 'TRX', 'Entrenamiento en suspensión con peso corporal', 'https://trxspain.es/wp-content/uploads/2022/11/GROUP-1-1000x563-1.jpg', 1),
(7, 'HIIT', 'Entrenamiento por intervalos de alta intensidad', 'https://www.dir.cat/blog/wp-content/uploads/2021/05/Hiit_blog-600x338.jpg', 2),
(8, 'Running Club', 'Entrenamiento de carrera guiado', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm6s58i0lzzuyHBAR4a_I28x1T0AuwguldAw&s', 2),
(9, 'Salsa Fit', 'Pasos de salsa combinados con fitness aeróbico', 'https://i0.wp.com/loco-valencia-salsa.es/wp-content/uploads/2024/07/learn-from-the-best-salsa-classes-london-1024x681-1.jpg?fit=1600%2C1064&ssl=1', 3),
(10, 'Hip Hop Dance', 'Coreografías de danza urbana', 'https://ononestudios.com/wp-content/uploads/2022/08/hiphop.jpg', 3),
(11, 'Pilates', 'Control postural, core y respiración', 'https://medac.es/sites/default/files/blog/destacadas/pilates-con-maquinas.jpg', 4),
(12, 'Stretching', 'Estiramientos profundos y mejora de la movilidad', 'https://www.opaortho.com/wp-content/uploads/2024/08/stretching-exercises-for-flexibility.png', 4);

-- Clases
INSERT INTO `classes` (`id`, `modality_id`, `instructor_id`, `start_time`, `end_time`, `capacity`) VALUES 
(1, 1, 5, '2026-03-15 00:00:00', '2026-03-15 01:00:00', 31),
(2, 2, 2, '2026-03-15 18:00:00', '2026-03-15 19:00:00', 15),
(3, 4, 2, '2026-03-16 09:00:00', '2026-03-16 10:00:00', 25),
(4, 3, 2, '2026-03-16 17:00:00', '2026-03-16 18:00:00', 15),
(5, 1, 2, '2026-03-16 09:00:00', '2026-03-16 10:00:00', 20),
(6, 2, 2, '2026-03-16 10:30:00', '2026-03-16 11:30:00', 15),
(7, 3, 2, '2026-03-16 12:00:00', '2026-03-16 13:00:00', 20),
(8, 4, 2, '2026-03-16 17:00:00', '2026-03-16 18:00:00', 25),
(9, 5, 2, '2026-03-16 18:30:00', '2026-03-16 19:30:00', 15),
(10, 6, 2, '2026-03-16 20:00:00', '2026-03-16 21:00:00', 20),
(11, 7, 2, '2026-03-17 09:00:00', '2026-03-17 10:00:00', 20),
(12, 8, 2, '2026-03-17 10:30:00', '2026-03-17 11:30:00', 20),
(13, 9, 2, '2026-03-17 12:00:00', '2026-03-17 13:00:00', 25),
(14, 10, 2, '2026-03-17 17:00:00', '2026-03-17 18:00:00', 25),
(15, 11, 2, '2026-03-17 18:30:00', '2026-03-17 19:30:00', 15),
(16, 12, 2, '2026-03-17 20:00:00', '2026-03-17 21:00:00', 15),
(17, 1, 2, '2026-03-18 09:00:00', '2026-03-18 10:00:00', 20),
(18, 3, 2, '2026-03-18 10:30:00', '2026-03-18 11:30:00', 20),
(19, 5, 2, '2026-03-18 12:00:00', '2026-03-18 13:00:00', 15),
(20, 7, 2, '2026-03-18 17:00:00', '2026-03-18 18:00:00', 20),
(21, 9, 2, '2026-03-18 18:30:00', '2026-03-18 19:30:00', 25),
(22, 11, 2, '2026-03-18 20:00:00', '2026-03-18 21:00:00', 15),
(23, 2, 2, '2026-03-19 09:00:00', '2026-03-19 10:00:00', 15),
(24, 4, 2, '2026-03-19 10:30:00', '2026-03-19 11:30:00', 25),
(25, 6, 2, '2026-03-19 12:00:00', '2026-03-19 13:00:00', 20),
(26, 8, 2, '2026-03-19 17:00:00', '2026-03-19 18:00:00', 20),
(27, 10, 2, '2026-03-19 18:30:00', '2026-03-19 19:30:00', 25),
(28, 12, 2, '2026-03-19 20:00:00', '2026-03-19 21:00:00', 15),
(29, 1, 2, '2026-03-20 09:00:00', '2026-03-20 10:00:00', 20),
(30, 4, 2, '2026-03-20 10:30:00', '2026-03-20 11:30:00', 25),
(31, 7, 2, '2026-03-20 12:00:00', '2026-03-20 13:00:00', 20),
(32, 10, 2, '2026-03-20 17:00:00', '2026-03-20 18:00:00', 25),
(33, 2, 2, '2026-03-20 18:30:00', '2026-03-20 19:30:00', 15),
(34, 5, 2, '2026-03-20 20:00:00', '2026-03-20 21:00:00', 15),
(35, 1, 5, '2026-03-08 23:47:00', '2026-03-09 01:47:00', 23);

-- Reservas
INSERT INTO `bookings` (`id`, `user_id`, `class_id`, `status`, `booking_date`) VALUES 
(1, 3, 1, 'confirmed', '2026-02-27 16:00:17'),
(2, 4, 1, 'confirmed', '2026-02-27 16:00:17'),
(3, 3, 2, 'confirmed', '2026-02-27 16:00:17'),
(11, 5, 1, 'confirmed', '2026-03-08 22:11:33'),
(14, 5, 3, 'confirmed', '2026-03-08 23:30:38'),
(16, 5, 4, 'confirmed', '2026-03-08 23:32:52'),
(17, 5, 19, 'confirmed', '2026-03-08 23:51:44'),
(18, 5, 2, 'confirmed', '2026-03-09 00:51:33');

-- -----------------------------------------------------
-- Consulta de Ejemplo
-- -----------------------------------------------------

-- Ver reservas con detalles
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