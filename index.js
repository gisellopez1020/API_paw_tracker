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
    console.log("Ubicación recibida:", req.body);
    lastLocation = req.body;
    res.status(200).json({ message: "Ubicación actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar ubicación:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  try {
    res.json(lastLocation);
  } catch (error) {
    console.error("Error al obtener ubicación:", error);
    res.status(500).json({ error: error.message });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Algo salió mal!" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://192.168.1.3:${PORT}`);
});
