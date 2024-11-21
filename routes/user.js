const express = require('express')
const router = express.Router()
const controller = require('../controllers/user')
const { verifyToken } = require('../middleware/authMiddleware')

router.post('/register', controller.create)
router.post('/login', controller.login)
router.put('/', verifyToken, controller.update)
router.delete('/', verifyToken, controller.deleteUser)
router.get('/:city', verifyToken, controller.readByCity)

module.exports = router

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: Ruta para registrar un nuevo usuario en el sistema.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente.
 *       400:
 *         description: Error en los datos proporcionados.
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Ruta para iniciar sesión con un usuario registrado.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario.
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario.
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autorizado.
 */

/**
 * @swagger
 * /users:
 *   put:
 *     summary: Actualizar la información del usuario
 *     description: Ruta para actualizar la información del usuario autenticado.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Información del usuario actualizada exitosamente.
 *       400:
 *         description: Error en los datos proporcionados.
 *       401:
 *         description: No autorizado.
 */

/**
 * @swagger
 * /users:
 *   delete:
 *     summary: Eliminar el usuario
 *     description: Ruta para eliminar al usuario autenticado.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente.
 *       401:
 *         description: No autorizado.
 */

/**
 * @swagger
 * /users/{city}:
 *   get:
 *     summary: Obtener usuarios por ciudad
 *     description: Ruta para obtener los usuarios registrados en una ciudad específica.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: Ciudad para filtrar los usuarios.
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente.
 *       404:
 *         description: No se encontraron usuarios en la ciudad especificada.
 *       401:
 *         description: No autorizado.
 */
