const request = require('supertest')
const Merchant = require('../models/merchant')
const connection = require('../config/database')
const jwt = require('jsonwebtoken')
const handleError = require('../middleware/slackMiddleware')

jest.mock('../config/database')
jest.mock('../middleware/slackMiddleware')
jest.mock('jsonwebtoken')

describe('Merchant API', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('POST /create', () => {
        it('debería devolver error si faltan parámetros', async () => {
            const req = { body: {} }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }

            await Merchant.create(req, res)

            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                error: "Faltan parámetros",
                missingParams: ['nombre', 'cif', 'direccion', 'email', 'contacto'],
            })
        })

        it('debería crear un comercio si los datos son válidos', async () => {
            const req = {
                body: {
                    nombre: 'Comercio 1',
                    cif: '12345678',
                    direccion: 'Calle Falsa 123',
                    email: 'test@example.com',
                    contacto: '123456789',
                },
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }

            connection.executeQuery.mockResolvedValueOnce({ affectedRows: 1 })
            jwt.sign.mockReturnValueOnce('mockedToken')

            await Merchant.create(req, res)

            expect(connection.executeQuery).toHaveBeenCalledWith(
                expect.stringMatching(/INSERT INTO merchants/)
            )
            expect(jwt.sign).toHaveBeenCalledWith({ cif: '12345678' }, process.env.JWT_KEY)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                message: "Comercio creado con éxito",
                token: "mockedToken",
            })
        })

        it('debería manejar un error interno del servidor', async () => {
            const req = { body: { nombre: 'Error', cif: '9999', direccion: '...', email: '...', contacto: '...' } }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }

            connection.executeQuery.mockRejectedValueOnce(new Error('Database error'))
            handleError.mockResolvedValueOnce()

            await Merchant.create(req, res)

            expect(handleError).toHaveBeenCalledWith(expect.any(Error), 'Error en create merchant')
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                message: "Error interno del servidor",
                error: "Database error",
            })
        })
    })

    describe('GET /read', () => {
        it('debería devolver la lista de comercios activos', async () => {
            const req = {}
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }

            const mockData = [{ cif: '123', nombre: 'Comercio' }]
            connection.executeQuery.mockResolvedValueOnce(mockData)

            await Merchant.read(req, res)

            expect(connection.executeQuery).toHaveBeenCalledWith(
                expect.stringMatching(/SELECT \* FROM merchants WHERE estado = 1/)
            )
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ data: mockData })
        })
    })
})
