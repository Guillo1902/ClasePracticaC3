-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS crypto_signals;

-- Usar la base de datos
USE crypto_signals;

-- Crear la tabla para guardar las señales de criptomonedas
CREATE TABLE IF NOT EXISTS criptomonedas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    precio_actual DECIMAL(20,8) NOT NULL,
    max_1h DECIMAL(20,8) NOT NULL,
    min_1h DECIMAL(20,8) NOT NULL,
    precio_promedio DECIMAL(20,8) NOT NULL,
    senal VARCHAR(1) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP
);