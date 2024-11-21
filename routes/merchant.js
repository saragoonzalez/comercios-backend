const express = require('express')
const router = express.Router()
const controller = require('../controllers/merchant')
const { verifyToken, isAdmin } = require('../middleware/authMiddleware')

router.post('/', verifyToken, isAdmin, controller.create)
router.put('/:id', verifyToken, isAdmin, controller.update)
router.get('/', verifyToken, isAdmin, controller.read)
router.get('/:id', verifyToken, isAdmin, controller.readById)
router.delete('/:id', verifyToken, isAdmin, controller.deleteMerchant)

module.exports = router

/**
 * @swagger
 * /merchants:
 *   post:
 *     summary: Crear un nuevo comercio
 *     description: Ruta para crear un nuevo comercio.
 *     tags:
 *       - Merchants
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Merchant'
 *     responses:
 *       201:
 *         description: Comercio creado exitosamente.
 *       400:
 *         description: Error en los datos proporcionados.
 *       401:
 *         description: No autorizado.
 */

/**
 * @swagger
 * /merchants:
 *   get:
 *     summary: Obtener todos los comercios
 *     description: Ruta para obtener la lista de todos los comercios.
 *     tags:
 *       - Merchants
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de comercios obtenida exitosamente.
 *       401:
 *         description: No autorizado.
 */

/**
 * @swagger
 * /merchants/{id}:
 *   get:
 *     summary: Obtener un comercio por ID
 *     description: Ruta para obtener la información de un comercio específico por ID.
 *     tags:
 *       - Merchants
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comercio
 *     responses:
 *       200:
 *         description: Información del comercio obtenida exitosamente.
 *       404:
 *         description: Comercio no encontrado.
 *       401:
 *         description: No autorizado.
 */

/**
 * @swagger
 * /merchants/{id}:
 *   put:
 *     summary: Actualizar un comercio
 *     description: Ruta para actualizar la información de un comercio.
 *     tags:
 *       - Merchants
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comercio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Merchant'
 *     responses:
 *       200:
 *         description: Comercio actualizado exitosamente.
 *       400:
 *         description: Error en los datos proporcionados.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Comercio no encontrado.
 */

/**
 * @swagger
 * /merchants/{id}:
 *   delete:
 *     summary: Eliminar un comercio
 *     description: Ruta para eliminar un comercio por su ID.
 *     tags:
 *       - Merchants
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comercio
 *     responses:
 *       200:
 *         description: Comercio eliminado exitosamente.
 *       404:
 *         description: Comercio no encontrado.
 *       401:
 *         description: No autorizado.
 */
