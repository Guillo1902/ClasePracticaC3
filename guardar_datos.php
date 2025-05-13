<?php
$datos = json_decode(file_get_contents("php://input"), true);

$conexion = new mysqli("localhost", "root", "", "crypto_signals");
if ($conexion->connect_error) {
    http_response_code(500);
    die("Conexión fallida: " . $conexion->connect_error);
}

$stmt = $conexion->prepare("INSERT INTO criptomonedas (nombre, precio_actual, max_1h, min_1h, precio_promedio, senal) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sdddds", $datos["nombre"], $datos["actual"], $datos["max"], $datos["min"], $datos["avg"], $datos["senal"]);
$stmt->execute();
$stmt->close();
$conexion->close();
?>