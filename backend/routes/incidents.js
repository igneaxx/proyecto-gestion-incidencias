const express = require("express");
const { getDb, save } = require("../data/store");
const { requireAuth, requireRole } = require("../middleware/auth");
const { validateIncident } = require("../middleware/validate");

const router = express.Router();

// GET /api/incidents - lista incidencias (usuario ve las propias, admin ve todas)
router.get("/", requireAuth, (req, res) => {
  const db = getDb();
  const incidencias =
    req.user.rol === "admin"
      ? db.incidents
      : db.incidents.filter((i) => i.creadoPor === req.user.id);

  res.status(200).json({ total: incidencias.length, incidencias });
});

// GET /api/incidents/:id - detalle de una incidencia
router.get("/:id", requireAuth, (req, res) => {
  const db = getDb();
  const incidencia = db.incidents.find((i) => i.id === Number(req.params.id));

  if (!incidencia) {
    return res.status(404).json({ error: "Incidencia no encontrada" });
  }
  if (req.user.rol !== "admin" && incidencia.creadoPor !== req.user.id) {
    return res.status(403).json({ error: "No tienes acceso a esta incidencia" });
  }

  res.status(200).json(incidencia);
});

// POST /api/incidents - crear incidencia
router.post("/", requireAuth, validateIncident, async (req, res) => {
  const db = getDb();
  const { titulo, descripcion, prioridad } = req.body;

  let ubicacion = null;
  try {
    const geoResp = await fetch("https://ipwho.is/");
    if (geoResp.ok) {
      const geo = await geoResp.json();
      if (geo.success) {
        ubicacion = `${geo.city || "N/D"}, ${geo.country || "N/D"}`;
      }
    }
  } catch (err) {
    ubicacion = null; // si la API externa falla, la incidencia se crea igual
  }

  const nueva = {
    id: db.nextIncidentId++,
    titulo,
    descripcion,
    estado: "abierta",
    prioridad: ["baja", "media", "alta"].includes(prioridad) ? prioridad : "media",
    creadoPor: req.user.id,
    ubicacion,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString()
  };

  db.incidents.push(nueva);
  save();

  res.status(201).json(nueva);
});

// PUT /api/incidents/:id - actualizar estado (solo admin)
router.put("/:id", requireAuth, requireRole("admin"), (req, res) => {
  const db = getDb();
  const incidencia = db.incidents.find((i) => i.id === Number(req.params.id));

  if (!incidencia) {
    return res.status(404).json({ error: "Incidencia no encontrada" });
  }

  const estadosValidos = ["abierta", "en_proceso", "cerrada"];
  const { estado, prioridad } = req.body;

  if (estado && !estadosValidos.includes(estado)) {
    return res.status(400).json({ error: "Estado invalido" });
  }

  if (estado) incidencia.estado = estado;
  if (prioridad) incidencia.prioridad = prioridad;
  incidencia.fechaActualizacion = new Date().toISOString();
  save();

  res.status(200).json(incidencia);
});

// DELETE /api/incidents/:id - cerrar/eliminar incidencia (solo admin)
router.delete("/:id", requireAuth, requireRole("admin"), (req, res) => {
  const db = getDb();
  const index = db.incidents.findIndex((i) => i.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: "Incidencia no encontrada" });
  }

  db.incidents.splice(index, 1);
  save();

  res.status(200).json({ mensaje: "Incidencia eliminada correctamente" });
});

module.exports = router;
