const User = require('../models/user')
const connection = require('../config/database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const handleError = require('../middleware/slackMiddleware')

jest.mock('../config/database', () => ({
  executeQuery: jest.fn(),
}))

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}))

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}))

jest.mock('../middleware/slackMiddleware', () => jest.fn())

describe('User Model', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('login', () => {
    it('should return a token for valid credentials', async () => {
      const req = {
        body: { email: 'test@example.com', password: 'password123' },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      connection.executeQuery.mockResolvedValue([
        { id: 1, email: 'test@example.com', password: 'hashedPassword', role: 'USER' },
      ])
      bcrypt.compare.mockResolvedValue(true)
      jwt.sign.mockReturnValue('mockToken')

      await User.login(req, res)

      expect(res.json).toHaveBeenCalledWith({
        message: 'Usuario encontrado',
        token: 'mockToken',
      })
    })

    it('should return 400 for invalid credentials', async () => {
      const req = {
        body: { email: 'test@example.com', password: 'wrongPassword' },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      connection.executeQuery.mockResolvedValue([
        { id: 1, email: 'test@example.com', password: 'hashedPassword', role: 'USER' },
      ])
      bcrypt.compare.mockResolvedValue(false)

      await User.login(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'Credenciales inválidas' })
    })
  })

  describe('create', () => {
    it('should create a user successfully', async () => {
      const req = {
        body: {
          nombre: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          edad: 30,
          ciudad: 'Test City',
          intereses: ['coding', 'reading'],
          permiteRecibirOfertas: true,
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      connection.executeQuery.mockResolvedValue([])
      bcrypt.hash.mockResolvedValue('hashedPassword')
      connection.executeQuery.mockResolvedValue({ affectedRows: 1 })

      await User.create(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Usuario creado con éxito',
      })
    })

    it('should return 200 if email is already in use', async () => {
      const req = {
        body: {
          nombre: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          edad: 30,
          ciudad: 'Test City',
          intereses: ['coding', 'reading'],
          permiteRecibirOfertas: true,
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      connection.executeQuery.mockResolvedValue([{ email: 'test@example.com' }])

      await User.create(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'El email ya se encuentra en uso.',
      })
    })
  })

  describe('update', () => {
    it('should update user data successfully', async () => {
      const req = {
        user: { id: 1 },
        body: {
          ciudad: 'Updated City',
          intereses: ['music', 'art'],
          permiteRecibirOfertas: true,
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      connection.executeQuery.mockResolvedValue({ affectedRows: 1 })

      await User.update(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Usuario modificado con éxito',
      })
    })
  })

  describe('deleteUser', () => {
    it('should delete the user successfully', async () => {
      const req = {
        user: { id: 1 },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      connection.executeQuery.mockResolvedValue({ affectedRows: 1 })

      await User.deleteUser(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Usuario eliminado con éxito',
      })
    })
  })

  describe('readByCity', () => {
    it('should return users from a specific city', async () => {
      const req = { params: { city: 'Test City' } }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      connection.executeQuery.mockResolvedValue([{ id: 1, ciudad: 'Test City' }])

      await User.readByCity(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        data: [{ id: 1, ciudad: 'Test City' }],
      })
    })
  })
})
