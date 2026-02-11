CREATE DATABASE IF NOT EXISTS gym_db;

USE gym_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('client', 'instructor', 'admin') DEFAULT 'client',
    image_url VARCHAR(255),
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category ENUM('Fuerza', 'Cardio', 'Baile', 'Relax') NOT NULL,
    image_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activity_id INT NOT NULL,
    instructor_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    capacity INT NOT NULL DEFAULT 20,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
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

INSERT INTO users (first_name, last_name, email, password, role) VALUES 
('Admin', 'Principal', 'admin@gym.com', '123456', 'admin'),
('Laura', 'Entrenadora', 'laura@gym.com', '123456', 'instructor'),
('Carlos', 'Cliente', 'carlos@gym.com', '123456', 'client'),
('Ana', 'Cliente', 'ana@gym.com', '123456', 'client');

INSERT INTO activities (name, description, category) VALUES 
('Zumba Beach', 'Baile latino intenso', 'Baile'),
('BodyPump', 'Pesas y resistencia', 'Fuerza'),
('Yoga Zen', 'Relajación y estiramiento', 'Relax'),
('Spinning', 'Entrenamiento cardiovascular', 'Cardio');

INSERT INTO classes (activity_id, instructor_id, start_time, end_time, capacity) VALUES 
(1, 2, '2024-12-10 10:00:00', '2024-12-10 11:00:00', 20),
(2, 2, '2024-12-10 18:00:00', '2024-12-10 19:00:00', 15),
(4, 2, '2024-12-11 09:00:00', '2024-12-11 10:00:00', 25);

INSERT INTO bookings (user_id, class_id) VALUES 
(3, 1),
(4, 1),
(3, 2);

SELECT 
    classes.start_time, 
    activities.name, 
    users.first_name, 
    bookings.status
FROM bookings
JOIN classes ON bookings.class_id = classes.id
JOIN activities ON classes.activity_id = activities.id
JOIN users ON bookings.user_id = users.id;