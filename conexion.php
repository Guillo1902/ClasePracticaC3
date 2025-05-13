<?php
$host = "localhost";
$usuario = "root";
$contrasena = ""; // En XAMPP por defecto no hay contraseña
$base_datos = "crypto_signals";

// Crear conexión
$conexion = new mysqli($host, $usuario, $contrasena, $base_datos);

// Verificar conexión
if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}
?>