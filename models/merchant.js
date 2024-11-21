const connection = require('../config/database')
const jwt = require('jsonwebtoken')
const handleError = require('../middleware/slackMiddleware')

const JWT_KEY = process.env.JWT_KEY

class Merchant {

    constructor() { }

    //Funcion para crear comercio
    static async create(req, res) {
        try {
            // Lista de parámetros requeridos
            const requiredParams = ['nombre', 'cif', 'direccion', 'email', 'contacto']

            // Parámetros faltantes
            const missingParams = requiredParams.filter(param => !req.body[param])

            // Verificar si faltan parámetros
            if (missingParams.length > 0) {
                return res.status(400).json({
                    error: "Faltan parámetros",
                    missingParams
                })
            }

            let { nombre, cif, direccion, email, contacto } = req.body

            //Funcion para validar que el email no este en uso
            let cifAvailable = await this.validateCIF(cif)

            if (!cifAvailable) {

                //Query para insertar el usuario
                let query = `INSERT INTO merchants VALUES(0, '${nombre}','${cif}','${direccion}','${email}','${contacto}', 1)`

                let data = await connection.executeQuery(query)

                // Generar JWT con el cif en el payload
                const token = jwt.sign({ cif }, JWT_KEY)

                res.status(200).json({ message: data.affectedRows > 0 ? "Comercio creado con éxito" : "Falló el registro", token: data.affectedRows > 0 ? token : "" });
            }
            else {
                res.status(200).json({ message: "El cif ya se encuentra en uso." });
            }
        } catch (error) {
            await handleError(error, `Error en create merchant`)
            res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }

    static async validateCIF(cif) {
        try {
            let query = `SELECT * FROM merchants WHERE cif = '${cif}'`
            let data = await connection.executeQuery(query)

            return data.length == 0 ? false : true
        } catch (error) {
            await handleError(error, `Error en validateCIF merchant`)
            return true
        }
    }

    //Funcion para modificar comercio
    static async update(req, res) {
        try {
            // Lista de parámetros requeridos
            const requiredParams = ['nombre', 'direccion', 'email', 'contacto', 'estado']

            // Parámetros faltantes
            const missingParams = requiredParams.filter(param => !req.body[param])
            
            // Verificar si faltan parámetros
            if (missingParams.length > 0) {
                return res.status(400).json({
                    error: "Faltan parámetros",
                    missingParams
                })
            }

            //ID = cif
            const { id } = req.params
            let { nombre, direccion, email, contacto, estado } = req.body

            //Query para insertar el usuario
            let query = `UPDATE merchants SET nombre = '${nombre}', direccion = '${direccion}', email = '${email}', contacto = '${contacto}', estado = ${parseInt(estado)} WHERE cif = '${id}'`

            let data = await connection.executeQuery(query)

            res.status(200).json({ message: data.affectedRows > 0 ? "Comercio modificado con éxito" : "Falló la modificación del registro" });
        } catch (error) {
            await handleError(error, `Error en update merchant`)
            res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }

    //Funcion para eliminar comercio, se le agrega la palabra Merchant porque delete es palabra reservada
    static async deleteMerchant(req, res) {
        try {
            const { id } = req.params

            //Query para insertar el usuario
            let query = `DELETE FROM merchants WHERE cif = '${id}'`

            let data = await connection.executeQuery(query)

            res.status(200).json({ message: data.affectedRows > 0 ? "Comercio eliminado con éxito" : "Falló la eliminación del registro" });
        } catch (error) {
            await handleError(error, `Error en delete merchant`)
            res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }
    //Funcion para buscar comercios por cif y activos
    static async read(req, res) {
        try {
            let query = `SELECT * FROM merchants WHERE estado = 1`

            let data = await connection.executeQuery(query)

            res.status(200).json({ data });
        } catch (error) {
            await handleError(error, `Error en read merchant`)
            res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }
    
    //Funcion para buscar comercios por cif y activos
    static async readById(req, res) {
        try {
            const { id } = req.params
            let query = `SELECT * FROM merchants WHERE estado = 1 and cif = '${id}'`

            let data = await connection.executeQuery(query)

            res.status(200).json({ data });
        } catch (error) {
            await handleError(error, `Error en readById merchant`)
            res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }
}

module.exports = Merchant