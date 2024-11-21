const connection = require('../config/database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const handleError = require('../middleware/slackMiddleware')

const JWT_KEY = process.env.JWT_KEY

class User {

    constructor() { }

    static async login(req, res) {
        try {
            // Lista de parámetros requeridos
            const requiredParams = ['email', 'password']

            // Parámetros faltantes
            const missingParams = requiredParams.filter(param => !req.body[param])

            // Verificar si faltan parámetros
            if (missingParams.length > 0) {
                return res.status(400).json({
                    error: "Faltan parámetros",
                    missingParams
                })
            }

            let { email, password } = req.body

            //Consulta para verificar si existe el usuario
            let query = `SELECT * FROM users WHERE email = '${email}'`
            let data = await connection.executeQuery(query)

            if (data.length > 0) {
                //Confirmar contraseña hasheada
                const isPasswordValid = await bcrypt.compare(password, data[0].password)
                if (!isPasswordValid) return res.status(400).json({ error: 'Credenciales inválidas' })

                // Genera el JWT
                const token = jwt.sign({ id: data[0].id, role: data[0].role }, JWT_KEY)

                res.json({ message: "Usuario encontrado", token })
            }
            else {
                return res.status(400).json({ error: 'Credenciales inválidas' })
            }
        } catch (error) {
            await handleError(error, `Error en login User`)
            res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }

    //Funcion para crear usuario
    static async create(req, res) {
        try {
            // Lista de parámetros requeridos
            const requiredParams = ['nombre', 'email', 'password', 'edad', 'ciudad', 'intereses']

            // Parámetros faltantes
            const missingParams = requiredParams.filter(param => !req.body[param])

            // Verificar si faltan parámetros
            if (missingParams.length > 0) {
                return res.status(400).json({
                    error: "Faltan parámetros",
                    missingParams
                })
            }

            let { nombre, email, password, edad, ciudad, intereses, permiteRecibirOfertas } = req.body

            //Funcion para validar que el email no este en uso
            let emailAvailable = await this.validateEmail(email)

            if (!emailAvailable) {
                //Se hashea la contraseña
                const hashedPassword = await bcrypt.hash(password, 10)

                //Query para insertar el usuario
                let query = `INSERT INTO users VALUES(0, '${nombre}','${email}','${hashedPassword}',${edad},'${ciudad}','${JSON.stringify(intereses)}', ${permiteRecibirOfertas ? 1 : 0}, 'USER')`

                let data = await connection.executeQuery(query)

                res.status(200).json({ message: data.affectedRows > 0 ? "Usuario creado con éxito" : "Falló el registro" });
            }
            else {
                res.status(200).json({ message: "El email ya se encuentra en uso." });
            }
        } catch (error) {
            await handleError(error, `Error en create User`)
            res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }

    static async validateEmail(email) {
        try {
            let query = `SELECT * FROM users WHERE email = '${email}'`
            let data = await connection.executeQuery(query)

            return data.length == 0 ? false : true
        } catch (error) {
            await handleError(error, `Error en validateEmail User`)
            return true
        }
    }

    //Funcion para modificar usuario
    static async update(req, res) {
        try {

            // Lista de parámetros requeridos
            const requiredParams = ['ciudad', 'intereses']

            // Parámetros faltantes
            const missingParams = requiredParams.filter(param => !req.body[param])

            // Verificar si faltan parámetros
            if (missingParams.length > 0) {
                return res.status(400).json({
                    error: "Faltan parámetros",
                    missingParams
                })
            }


            const userId = req.user.id // Asume que tienes un middleware que verifica el token y añade `req.user`
            const { ciudad, intereses, permiteRecibirOfertas } = req.body

            //Query para modificar el usuario
            let query = `UPDATE users SET ciudad = '${ciudad}', intereses = '${JSON.stringify(intereses)}', permite_recibir_ofertas = ${permiteRecibirOfertas ? 1 : 0} WHERE id = ${userId}`

            let data = await connection.executeQuery(query)

            res.status(200).json({ message: data.affectedRows > 0 ? "Usuario modificado con éxito" : "Falló la modificación del usuario. El usuario no existe." });
        } catch (error) {
            await handleError(error, `Error en update User`)
            res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message })
        }
    }

    //Funcion para eliminar usuario, se le agrega la palabra User porque delete es palabra reservada
    static async deleteUser(req, res) {
        try {

            const userId = req.user.id // Asume que tienes un middleware que verifica el token y añade `req.user`

            //Query para eliminar el usuario
            let query = `DELETE FROM users WHERE id = ${userId}`

            let data = await connection.executeQuery(query)

            res.status(200).json({ message: data.affectedRows > 0 ? "Usuario eliminado con éxito" : "Falló la eliminación del usuario. El usuario no existe." });
        } catch (error) {
            await handleError(error, `Error en deleteUser`)
            res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message })
        }
    }

    static async readByCity(req, res){
        try {
            const { city } = req.params 
            
            let query = `SELECT * FROM users WHERE ciudad = '${city}'`

            let data = await connection.executeQuery(query)

            res.status(200).json({ data });
        } catch (error) {
            await handleError(error, `Error en readByCity User`)
            res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message })
        }
    }
}

module.exports = User