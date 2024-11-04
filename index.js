import express, { json } from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(json());

let lastLocation = null;

app.post("/update-location", (req, res) => {
  try {
    const { latitude, longitude, timestamp } = req.body;

    // Validación de datos
    if (latitude === undefined || longitude === undefined) {
      console.error("Datos de ubicación incompletos:", req.body);
      return res
        .status(400)
        .json({ error: "Se requieren latitude y longitude" });
    }

    console.log("Nueva ubicación recibida:", {
      latitude,
      longitude,
      timestamp,
      receivedAt: new Date().toISOString(),
    });

    lastLocation = {
      latitude,
      longitude,
      timestamp,
      receivedAt: new Date().toISOString(),
    };

    res.status(200).json({
      message: "Ubicación actualizada correctamente",
      location: lastLocation,
    });
  } catch (error) {
    console.error("Error al actualizar ubicación:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  try {
    if (!lastLocation) {
      console.log("No hay ubicación disponible, enviando posición por defecto");
      return res.json({
        latitude: 4.60971,
        longitude: -74.08175,
        timestamp: new Date().toISOString(),
        receivedAt: new Date().toISOString(),
      });
    }

    console.log("Enviando última ubicación:", lastLocation);
    res.json(lastLocation);
  } catch (error) {
    console.error("Error al obtener ubicación:", error);
    res.status(500).json({ error: error.message });
  }
});

// Middleware para logging de todas las peticiones
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use((err, req, res, next) => {
  console.error("Error en el servidor:", err.stack);
  res.status(500).json({ error: "Algo salió mal!" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log("Tiempo de inicio:", new Date().toISOString());
});
