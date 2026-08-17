const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDb } = require("../data/store");
const { JWT_SECRET } = require("../middleware/auth");
const { validateLogin } = require("../middleware/validate");

const router = express.Router();

// POST /api/auth/login
router.post("/login", validateLogin, (req, res) => {
  const { email, password } = req.body;
  const db = getDb();

  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  const passwordOk = bcrypt.compareSync(password, user.passwordHash);
  if (!passwordOk) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  const token = jwt.sign(
    { id: user.id, nombre: user.nombre, rol: user.rol },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.status(200).json({
    token,
    usuario: { id: user.id, nombre: user.nombre, rol: user.rol, email: user.email }
  });
});

module.exports = router;
