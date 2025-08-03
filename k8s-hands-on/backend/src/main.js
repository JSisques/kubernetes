const express = require("express");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta principal que responde "Hola mundo"
app.get("/", (req, res) => {
  res.json({
    message: "Hola mundo",
    timestamp: new Date().toISOString(),
    service: "backend",
    hostname: os.hostname(),
  });
});

// Ruta de health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "backend",
    timestamp: new Date().toISOString(),
  });
});

// Middleware para manejar rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    path: req.originalUrl,
  });
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Error interno del servidor",
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  console.log(`Health check disponible en: http://localhost:${PORT}/health`);
});
