CREATE DATABASE IF NOT EXISTS airline_management;
USE airline_management;

CREATE TABLE IF NOT EXISTS flights (
    flight_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_number VARCHAR(20) NOT NULL UNIQUE,
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    aircraft VARCHAR(100) NOT NULL,
    total_seats INT NOT NULL,
    distance INT DEFAULT 1000,
    CONSTRAINT chk_total_seats CHECK (total_seats > 0),
    CONSTRAINT chk_distance CHECK (distance > 0)
);

CREATE TABLE IF NOT EXISTS bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_id INT NOT NULL,
    passenger_name VARCHAR(100) NOT NULL,
    passenger_age INT NOT NULL,
    passenger_gender VARCHAR(20) NOT NULL,
    id_proof_type VARCHAR(50) NOT NULL,
    id_proof_number VARCHAR(50) NOT NULL,
    contact_number VARCHAR(15) NOT NULL,
    seat_number INT NOT NULL,
    seat_class VARCHAR(20) NOT NULL,
    fare DOUBLE NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_passenger_age CHECK (passenger_age >= 0 AND passenger_age <= 120),
    CONSTRAINT chk_fare CHECK (fare >= 0),
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id) ON DELETE CASCADE,
    CONSTRAINT uk_flight_seat UNIQUE (flight_id, seat_number)
);

CREATE INDEX idx_id_proof ON bookings(id_proof_number);
CREATE INDEX idx_flight_id ON bookings(flight_id);

INSERT INTO flights (flight_number, source, destination, date, time, aircraft, total_seats, distance) VALUES
('AI-101', 'Delhi', 'Mumbai', '2024-08-15', '09:00:00', 'Boeing 737', 100, 1400),
('AI-102', 'Mumbai', 'Bangalore', '2024-08-15', '14:30:00', 'Airbus A320', 120, 1100),
('AI-103', 'Delhi', 'Chennai', '2024-08-16', '10:00:00', 'Boeing 737', 100, 2200),
('AI-104', 'Bangalore', 'Delhi', '2024-08-16', '16:00:00', 'Airbus A320', 120, 2200),
('AI-105', 'Mumbai', 'Kolkata', '2024-08-17', '08:00:00', 'Boeing 737', 100, 1750);

SELECT 'Database setup completed successfully!' AS Message;
SELECT COUNT(*) AS TotalFlights FROM flights;
