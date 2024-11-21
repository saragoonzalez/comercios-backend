const Webpage = require('../models/webpage')
const connection = require('../config/database')
const jwt = require('jsonwebtoken')
const handleError = require('../middleware/slackMiddleware')

jest.mock('../config/database', () => ({
    executeQuery: jest.fn(),
}))
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
}))
jest.mock('../middleware/slackMiddleware', () => jest.fn())

describe('Webpage Model - create', () => {
    let req, res

    beforeEach(() => {
        req = {
            headers: {
                authorization: 'Bearer valid.token',
            },
            body: {
                ciudad: 'San José',
                actividad: 'Comercio',
                titulo: 'Tienda de Pruebas',
                resumen: 'Resumen de Prueba',
            },
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }

        jwt.verify.mockReset()
        connection.executeQuery.mockReset()
        handleError.mockReset()
    })

    it('debería crear un comercio exitosamente', async () => {
        jwt.verify.mockReturnValue({ cif: '12345' })
        connection.executeQuery
            .mockResolvedValueOnce({ affectedRows: 1 }) // Inserción exitosa
            .mockResolvedValueOnce([{ id: 1 }]) // Recupera el último ID insertado

        await Webpage.create(req, res)

        expect(jwt.verify).toHaveBeenCalledWith('valid.token', process.env.JWT_KEY)
        expect(connection.executeQuery).toHaveBeenCalledTimes(2)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Comercio creado con éxito',
            id: 1,
        })
    })

    it('debería retornar un error si faltan parámetros', async () => {
        req.body = {
            ciudad: 'San José',
            actividad: 'Comercio',
        } // Faltan titulo y resumen

        await Webpage.create(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            error: 'Faltan parámetros',
            missingParams: ['titulo', 'resumen'],
        })
    })

    it('debería manejar errores internos correctamente', async () => {
        jwt.verify.mockImplementation(() => {
            throw new Error('Token inválido')
        })

        await Webpage.create(req, res)

        expect(handleError).toHaveBeenCalledWith(expect.any(Error), 'Error en create webpage')
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Error interno del servidor',
            error: 'Token inválido',
        })
    })
})
