const express = require("express");
const router = express.Router();

// **Endpoint temporal de inicio de sesión para pruebas**
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Simulación de éxito para cualquier combinación de correo y contraseña
  if (email && password) {
    return res.json({
      message: "Inicio de sesión exitoso (modo prueba).",
      token: "fake-jwt-token", // Token simulado para pruebas
      user: {
        email: email,
        role: "admin", // Asigna rol admin por defecto
      },
    });
  }

  // Si falta algún campo
  return res.status(400).json({ message: "Email y contraseña son obligatorios." });
});

module.exports = router;
