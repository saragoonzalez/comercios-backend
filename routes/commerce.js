const express = require("express");
const router = express.Router();
const multer = require("multer");
const verifyAdmin = require("../middleware/verifyAdmin"); // Importar middleware para verificar admin

// Configuración de multer (subida de archivos)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nombre único para la imagen
  },
});
const upload = multer({ storage });

// Datos simulados de comercios
const commerces = [
    { id: 1, name: "Café Madrid", city: "Madrid", activity: "Cafetería", reviews: [], image: "/uploads/cafe-madrid-1.jpg" },
    { id: 2, name: "Restaurante El Retiro", city: "Madrid", activity: "Restaurante", reviews: [], image: "/uploads/florida_park_6.jpg" },
    { id: 3, name: "Librería Central", city: "Madrid", activity: "Librería", reviews: [], image: "/uploads/creacion_2261316_3965...x576.jpg" },
    { id: 4, name: "Bar La Plaza", city: "Madrid", activity: "Bar", reviews: [], image: "/uploads/download.jpg" },
    { id: 5, name: "Gym Madrid Activo", city: "Madrid", activity: "Gimnasio", reviews: [], image: "/uploads/download-2.jpg" },
    { id: 6, name: "Supermercado AhorroMax", city: "Madrid", activity: "Supermercado", reviews: [], image: "/uploads/download-1.jpg" },
    { id: 7, name: "Panadería La Artesana", city: "Madrid", activity: "Panadería", reviews: [], image: "/uploads/download-3.jpg" },
    { id: 8, name: "Museo del Prado", city: "Madrid", activity: "Cultura", reviews: [], image: "/uploads/download-4.jpg" },
    { id: 9, name: "Zapatería Fashion Shoes", city: "Madrid", activity: "Zapatería", reviews: [], image: "/uploads/download-5.jpg" },
    { id: 10, name: "Farmacia Central", city: "Madrid", activity: "Farmacia", reviews: [], image: "/uploads/download-6.jpg" },
  ];

// **1. Endpoint para obtener comercios con filtrado por ciudad y actividad**
router.get("/", (req, res) => {
  const { city, activity } = req.query;

  const filteredCommerces = commerces.filter((item) => {
    return (
      (!city || item.city.toLowerCase().includes(city.toLowerCase())) &&
      (!activity || item.activity.toLowerCase().includes(activity.toLowerCase()))
    );
  });

  res.json(filteredCommerces);
});

// **2. Endpoint para obtener reseñas de un comercio por ID**
router.get("/:id/reviews", (req, res) => {
  const { id } = req.params;
  const commerce = commerces.find((item) => item.id === parseInt(id));

  if (commerce) {
    res.json(commerce.reviews);
  } else {
    res.status(404).json({ message: "Comercio no encontrado" });
  }
});

// **3. Endpoint para agregar una reseña a un comercio**
router.post("/:id/reviews", (req, res) => {
  const { id } = req.params;
  const { user, comment, rating } = req.body;

  const commerce = commerces.find((item) => item.id === parseInt(id));

  if (commerce) {
    const newReview = { user, comment, rating, date: new Date() };
    commerce.reviews.push(newReview);
    res.status(201).json(newReview);
  } else {
    res.status(404).json({ message: "Comercio no encontrado" });
  }
});

// **4. Endpoint para subir imágenes a un comercio**
router.post("/:id/upload", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const commerce = commerces.find((item) => item.id === parseInt(id));

  if (!commerce) {
    return res.status(404).json({ message: "Comercio no encontrado" });
  }

  if (req.file) {
    commerce.image = `/uploads/${req.file.filename}`; // Guardar la ruta de la imagen
    res.status(200).json({ message: "Imagen subida correctamente", image: commerce.image });
  } else {
    res.status(400).json({ message: "No se subió ninguna imagen" });
  }
});

// **5. Endpoint para obtener detalles de un comercio por ID**
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const commerce = commerces.find((item) => item.id === parseInt(id));

  if (commerce) {
    res.json(commerce);
  } else {
    res.status(404).json({ message: "Comercio no encontrado" });
  }
});

// **6. Endpoint para eliminar un comercio (SOLO ADMIN)**
router.delete("/:id", verifyAdmin, (req, res) => {
  const { id } = req.params;
  const index = commerces.findIndex((item) => item.id === parseInt(id));

  if (index !== -1) {
    commerces.splice(index, 1); // Elimina el comercio del array
    return res.json({ message: "Comercio eliminado exitosamente" });
  } else {
    return res.status(404).json({ message: "Comercio no encontrado" });
  }
});

// Importa el middleware para validar si el usuario es admin
const verifyAdmin = require("../middleware/verifyAdmin");

// **6. Endpoint para agregar un comercio (solo admin)**
router.post("/", verifyAdmin, (req, res) => {
  const { name, city, activity } = req.body;

  // Validación de campos
  if (!name || !city || !activity) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  // Crear nuevo comercio
  const newCommerce = {
    id: commerces.length + 1,
    name,
    city,
    activity,
    reviews: [],
    image: null,
  };

  commerces.push(newCommerce); // Agregar al array simulado
  res.status(201).json({ message: "Comercio agregado exitosamente", newCommerce });
});





module.exports = router; // Exportar las rutas

