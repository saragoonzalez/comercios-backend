const express = require('express')
const multer = require('multer')
const path = require('path');
const router = express.Router()
const controller = require('../controllers/webpage')
const { verifyToken } = require('../middleware/authMiddleware')

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads') // Carpeta donde se guardarán los archivos
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    },
  })
  
  const upload = multer({ storage })

router.post('/', verifyToken, controller.create)
router.put('/:id', verifyToken, controller.update)
router.get('/', controller.read)
router.get('/:id', controller.readById)
router.get('/search/:city', controller.readByCity)
router.get('/search/:city/:activity', controller.readByCityActivity)
router.delete('/:id', verifyToken, controller.deleteWebpage)
router.patch('/:id', verifyToken, controller.patch)

router.post('/photos/:id', verifyToken, upload.array('photos', 1), controller.uploadPhotos)
router.post('/texts/:id', verifyToken, upload.array('texts', 1), controller.uploadTexts)

module.exports = router

/**
 * @swagger
 * /webpages:
 *   post:
 *     summary: Crear una nueva página web
 *     description: Ruta para crear una nueva página web.
 *     tags:
 *       - Webpages
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Webpage'
 *     responses:
 *       201:
 *         description: Página web creada exitosamente.
 *       400:
 *         description: Error en los datos proporcionados.
 *       401:
 *         description: No autorizado.
 */

/**
 * @swagger
 * /webpages/{id}:
 *   put:
 *     summary: Actualizar una página web
 *     description: Ruta para actualizar la información de una página web existente.
 *     tags:
 *       - Webpages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la página web.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Webpage'
 *     responses:
 *       200:
 *         description: Página web actualizada exitosamente.
 *       400:
 *         description: Error en los datos proporcionados.
 *       404:
 *         description: Página web no encontrada.
 *       401:
 *         description: No autorizado.
 */

/**
 * @swagger
 * /webpages:
 *   get:
 *     summary: Obtener todas las páginas web
 *     description: Ruta para obtener la lista de todas las páginas web.
 *     tags:
 *       - Webpages
 *     responses:
 *       200:
 *         description: Lista de páginas web obtenida exitosamente.
 *       401:
 *         description: No autorizado.
 */

/**
 * @swagger
 * /webpages/{id}:
 *   get:
 *     summary: Obtener una página web por ID
 *     description: Ruta para obtener la información de una página web específica por ID.
 *     tags:
 *       - Webpages
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la página web
 *     responses:
 *       200:
 *         description: Página web obtenida exitosamente.
 *       404:
 *         description: Página web no encontrada.
 */

/**
 * @swagger
 * /webpages/search/{city}:
 *   get:
 *     summary: Buscar páginas web por ciudad
 *     description: Ruta para obtener páginas web filtradas por ciudad.
 *     tags:
 *       - Webpages
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: Ciudad para filtrar las páginas web.
 *     responses:
 *       200:
 *         description: Lista de páginas web filtrada por ciudad obtenida exitosamente.
 *       404:
 *         description: No se encontraron páginas web en la ciudad especificada.
 */

/**
 * @swagger
 * /webpages/search/{city}/{activity}:
 *   get:
 *     summary: Buscar páginas web por ciudad y actividad
 *     description: Ruta para obtener páginas web filtradas por ciudad y actividad.
 *     tags:
 *       - Webpages
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: Ciudad para filtrar las páginas web.
 *       - in: path
 *         name: activity
 *         required: true
 *         schema:
 *           type: string
 *         description: Actividad para filtrar las páginas web.
 *     responses:
 *       200:
 *         description: Lista de páginas web filtrada por ciudad y actividad obtenida exitosamente.
 *       404:
 *         description: No se encontraron páginas web con los filtros especificados.
 */

/**
 * @swagger
 * /webpages/{id}:
 *   delete:
 *     summary: Eliminar una página web
 *     description: Ruta para eliminar una página web por su ID.
 *     tags:
 *       - Webpages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la página web.
 *     responses:
 *       200:
 *         description: Página web eliminada exitosamente.
 *       404:
 *         description: Página web no encontrada.
 *       401:
 *         description: No autorizado.
 */

/**
 * @swagger
 * /webpages/{id}:
 *   patch:
 *     summary: Actualizar parcialmente una página web
 *     description: Ruta para actualizar parcialmente los datos de una página web.
 *     tags:
 *       - Webpages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la página web.
 *     responses:
 *       200:
 *         description: Página web actualizada parcialmente exitosamente.
 *       400:
 *         description: Error en los datos proporcionados.
 *       404:
 *         description: Página web no encontrada.
 *       401:
 *         description: No autorizado.
 */

/**
 * @swagger
 * /webpages/photos/{id}:
 *   post:
 *     summary: Subir fotos para una página web
 *     description: Ruta para subir fotos a una página web específica.
 *     tags:
 *       - Webpages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la página web.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Fotos subidas exitosamente.
 *       400:
 *         description: Error al subir las fotos.
 *       401:
 *         description: No autorizado.
 */

/**
 * @swagger
 * /webpages/texts/{id}:
 *   post:
 *     summary: Subir textos para una página web
 *     description: Ruta para subir textos a una página web específica.
 *     tags:
 *       - Webpages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la página web.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               texts:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Textos subidos exitosamente.
 *       400:
 *         description: Error al subir los textos.
 *       401:
 *         description: No autorizado.
 */
