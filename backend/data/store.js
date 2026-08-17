const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const DB_FILE = path.join(__dirname, "db.json");

function seed() {
  return {
    users: [
      {
        id: 1,
        nombre: "Admin General",
        email: "admin@incidencias.com",
        // password: Admin123!
        passwordHash: bcrypt.hashSync("Admin123!", 10),
        rol: "admin"
      },
      {
        id: 2,
        nombre: "Usuario Demo",
        email: "usuario@incidencias.com",
        // password: Usuario123!
        passwordHash: bcrypt.hashSync("Usuario123!", 10),
        rol: "usuario"
      }
    ],
    incidents: [
      {
        id: 1,
        titulo: "No enciende monitor en sala 3",
        descripcion: "El monitor del equipo 5 no enciende desde esta manana.",
        estado: "abierta",
        prioridad: "media",
        creadoPor: 2,
        ubicacion: null,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
      }
    ],
    nextIncidentId: 2
  };
}

function load() {
  if (!fs.existsSync(DB_FILE)) {
    const initial = seed();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
  const raw = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(raw);
}

let db = load();

function save() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

module.exports = {
  getDb: () => db,
  save
};
