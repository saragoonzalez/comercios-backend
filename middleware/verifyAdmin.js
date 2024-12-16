const jwt = require("jsonwebtoken");

// Middleware para verificar token y rol de admin
function verifyAdmin(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Acceso denegado, no hay token" });

  try {
    // Verifica el token
    const decoded = jwt.verify(token, "secretkey"); // Usa tu clave secreta

    // Verifica si el usuario tiene rol de admin
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Acceso denegado, solo el administrador puede realizar esta acción" });
    }

    req.user = decoded; // Añade el usuario al request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
}


const jwt = require("jsonwebtoken");

module.exports = function verifyAdmin(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Acceso no autorizado, token requerido." });
  }

  try {
    const decoded = jwt.verify(token, "secretkey"); // Reemplaza "secretkey" con tu clave JWT
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Acceso prohibido, solo administradores." });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido." });
  }
};



module.exports = verifyAdmin;
