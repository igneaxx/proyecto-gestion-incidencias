function validateIncident(req, res, next) {
  const { titulo, descripcion } = req.body;

  if (!titulo || typeof titulo !== "string" || titulo.trim().length < 5) {
    return res.status(400).json({ error: "El titulo es obligatorio y debe tener al menos 5 caracteres" });
  }
  if (!descripcion || typeof descripcion !== "string" || descripcion.trim().length < 10) {
    return res.status(400).json({ error: "La descripcion es obligatoria y debe tener al menos 10 caracteres" });
  }

  req.body.titulo = titulo.trim().slice(0, 150);
  req.body.descripcion = descripcion.trim().slice(0, 2000);
  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: "Correo electronico invalido" });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: "La contrasena debe tener al menos 6 caracteres" });
  }
  next();
}

module.exports = { validateIncident, validateLogin };
