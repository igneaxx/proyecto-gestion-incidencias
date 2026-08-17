const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const incidentRoutes = require("./routes/incidents");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", servicio: "gestion-incidencias-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/incidents", incidentRoutes);

// 404 para rutas no definidas
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Manejo centralizado de errores no controlados
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`API de Gestion de Incidencias escuchando en http://localhost:${PORT}`);
});
