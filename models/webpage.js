const connection = require('../config/database')
const jwt = require('jsonwebtoken')
const handleError = require('../middleware/slackMiddleware')

const JWT_KEY = process.env.JWT_KEY

class Webpage {

    constructor() { }

    static async create(req, res) {
        try {
            const authHeader = req.headers.authorization
            const token = authHeader?.split(' ')[1]
            const decoded = jwt.verify(token, JWT_KEY) // Verificar token

            // Lista de parámetros requeridos
            const requiredParams = ['ciudad', 'actividad', 'titulo', 'resumen']

            // Parámetros faltantes
            const missingParams = requiredParams.filter(param => !req.body[param])

            // Verificar si faltan parámetros
            if (missingParams.length > 0) {
                return res.status(400).json({
                    error: "Faltan parámetros",
                    missingParams
                })
            }

            let { ciudad, actividad, titulo, resumen } = req.body

            //Query para insertar el usuario
            let query = `INSERT INTO webpages VALUES(0, '${ciudad}','${actividad}','${titulo}','${resumen}', 1, (SELECT id FROM merchants WHERE cif = '${decoded.cif}'))`

            let data = await connection.executeQuery(query)

            if (data.affectedRows > 0) {
                let rows = await connection.executeQuery('SELECT LAST_INSERT_ID() as id')

                if (rows.length > 0) {
                    return res.status(200).json({ message: data.affectedRows > 0 ? "Comercio creado con éxito" : "Falló el registro", id: rows.length > 0 ? rows[0].id : "" })
                }
            }

            res.status(500).json({ message: "No se creo la Webpage" })
        } catch (error) {
            await handleError(error, `Error en create webpage`)
            res.status(500).json({ message: "Error interno del servidor", error: error.message })
        }
    }

    static async read(req, res) {
        try {
            const query = `SELECT id, ciudad, actividad, titulo, resumen, 
            (SELECT 
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'score', score,
                        'review', review
                    )
                ) AS reviews
            FROM scoring WHERE webpage_id = w.id) as reviews,
            (SELECT 
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'url', url
                    )
                ) AS photos
            FROM fotos WHERE webpage_id = w.id) as photos, 
            (SELECT 
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'url', url
                    )
                ) AS texts
            FROM textos WHERE webpage_id = w.id) as texts 
            FROM webpages w WHERE estado = 1`
            const data = await connection.executeQuery(query)

            return res.status(200).json(data)
        } catch (error) {
            await handleError(error, `Error en read webpage`)
            res.status(500).json({ message: "Error interno del servidor", error: error.message })
        }
    }

    static async readById(req, res) {
        try {
            const { id } = req.params
            const query = `SELECT id, ciudad, actividad, titulo, resumen, 
            (SELECT 
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'score', score,
                        'review', review
                    )
                ) AS reviews
            FROM scoring WHERE webpage_id = w.id) as reviews,
            (SELECT 
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'url', url
                    )
                ) AS photos
            FROM fotos WHERE webpage_id = w.id) as photos, 
            (SELECT 
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'url', url
                    )
                ) AS texts
            FROM textos WHERE webpage_id = w.id) as texts 
            FROM webpages w WHERE estado = 1 and w.id = ${id}`
            const data = await connection.executeQuery(query)

            return res.status(200).json(data)
        } catch (error) {
            await handleError(error, `Error en readById webpage`)
            res.status(500).json({ message: "Error interno del servidor", error: error.message })
        }
    }

    static async readByCity(req, res) {
        try {
            const { city } = req.params
            const query = `SELECT id, ciudad, actividad, titulo, resumen, 
            (SELECT 
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'score', score,
                        'review', review
                    )
                ) AS reviews
            FROM scoring WHERE webpage_id = w.id) as reviews,
            (SELECT 
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'url', url
                    )
                ) AS photos
            FROM fotos WHERE webpage_id = w.id) as photos, 
            (SELECT 
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'url', url
                    )
                ) AS texts
            FROM textos WHERE webpage_id = w.id) as texts 
            FROM webpages w WHERE estado = 1 and ciudad = '${city}'`
            const data = await connection.executeQuery(query)

            return res.status(200).json(data)
        } catch (error) {
            await handleError(error, `Error en readByCity webpage`)
            res.status(500).json({ message: "Error interno del servidor", error: error.message })
        }
    }
    static async readByCityActivity(req, res) {
        try {
            const { city, activity } = req.params
            const query = `SELECT id, ciudad, actividad, titulo, resumen, 
            (SELECT 
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'score', score,
                        'review', review
                    )
                ) AS reviews
            FROM scoring WHERE webpage_id = w.id) as reviews,
            (SELECT 
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'url', url
                    )
                ) AS photos
            FROM fotos WHERE webpage_id = w.id) as photos, 
            (SELECT 
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'url', url
                    )
                ) AS texts
            FROM textos WHERE webpage_id = w.id) as texts 
            FROM webpages w WHERE estado = 1 and ciudad = '${city}' and actividad = '${activity}'`
            const data = await connection.executeQuery(query)

            return res.status(200).json(data)
        } catch (error) {
            await handleError(error, `Error en readByCityActivity webpage`)
            res.status(500).json({ message: "Error interno del servidor", error: error.message })
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params

            // Lista de parámetros requeridos
            const requiredParams = ['ciudad', 'actividad', 'titulo', 'resumen', 'estado']

            // Parámetros faltantes
            const missingParams = requiredParams.filter(param => !req.body[param])

            // Verificar si faltan parámetros
            if (missingParams.length > 0) {
                return res.status(400).json({
                    error: "Faltan parámetros",
                    missingParams
                })
            }
            const { ciudad, actividad, titulo, resumen, estado } = req.body

            const query = `UPDATE webpages 
                SET ciudad = '${ciudad}', actividad = '${actividad}', titulo = '${titulo}', resumen = '${resumen}', estado = ${parseInt(estado)} 
                WHERE id = ${id}`

            const data = await connection.executeQuery(query)

            if (data.affectedRows > 0) {
                return res.status(200).json({ message: "Webpage actualizada con éxito" })
            }

            res.status(404).json({ message: "Webpage no encontrada" })
        } catch (error) {
            await handleError(error, `Error en update webpage`)
            res.status(500).json({ message: "Error interno del servidor", error: error.message })
        }
    }

    static async deleteWebpage(req, res) {
        try {
            const { id } = req.params

            const query = `DELETE FROM webpages WHERE id = ${id}`

            const data = await connection.executeQuery(query)

            if (data.affectedRows > 0) {
                return res.status(200).json({ message: "Webpage eliminada con éxito" })
            }

            res.status(404).json({ message: "Webpage no encontrada" })
        } catch (error) {
            await handleError(error, `Error en delete webpage`)
            res.status(500).json({ message: "Error interno del servidor", error: error.message })
        }
    }

    static async patch(req, res) {
        try {
            const { id } = req.params

            // Lista de parámetros requeridos
            const requiredParams = ['score', 'review']

            // Parámetros faltantes
            const missingParams = requiredParams.filter(param => !req.body[param])

            // Verificar si faltan parámetros
            if (missingParams.length > 0) {
                return res.status(400).json({
                    error: "Faltan parámetros",
                    missingParams
                })
            }
            const { score, review } = req.body

            const query = `INSERT INTO scoring VALUES(0, ${score}, '${review}', ${id})`

            const data = await connection.executeQuery(query)

            if (data.affectedRows > 0) {
                return res.status(200).json({ message: "Reseña ingresada con éxito" })
            }

            res.status(404).json({ message: "Webpage no encontrada" })
        } catch (error) {
            await handleError(error, `Error en patch webpage`)
            res.status(500).json({ message: "Error interno del servidor", error: error.message })
        }
    }


    static async uploadPhotos(req, res) {
        try {

            // const authHeader = req.headers.authorization
            // const token = authHeader?.split(' ')[1]
            // const decoded = jwt.verify(token, JWT_KEY) // Verificar token

            const { id } = req.params

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: 'No se subió ningún archivo' })
            }

            const uploadedFiles = req.files.map((file) => ({
                originalName: file.originalname,
                filePath: file.path,
            }))

            const query = `INSERT INTO fotos VALUES(0, '${uploadedFiles[0].filePath}', ${id})`

            const data = await connection.executeQuery(query)

            if (data.affectedRows > 0) {
                return res.status(200).json({ message: "Foto subida con éxito", files: uploadedFiles })
            }

            res.status(200).json({ message: "No se subió ninguna foto, intente de nuevo." })
        } catch (error) {
            await handleError(error, `Error en uploadphotos webpage`)
            res.status(500).json({ message: 'Error al subir archivos' })
        }
    }
    
    static async uploadTexts(req, res) {
        try {

            const { id } = req.params

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: 'No se subió ningún archivo' })
            }

            const uploadedFiles = req.files.map((file) => ({
                originalName: file.originalname,
                filePath: file.path,
            }))

            const query = `INSERT INTO textos VALUES(0, '${uploadedFiles[0].filePath}', ${id})`

            const data = await connection.executeQuery(query)

            if (data.affectedRows > 0) {
                return res.status(200).json({ message: "Texto subida con éxito", files: uploadedFiles })
            }

            res.status(200).json({ message: "No se subió ningun texto, intente de nuevo." })
        } catch (error) {
            await handleError(error, `Error en uploadtexts webpage`)
            res.status(500).json({ message: 'Error al subir archivos' })
        }
    }
}

module.exports = Webpage