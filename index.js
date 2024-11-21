require('dotenv').config()
const express = require('express')

const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json())

const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

// Configuración de Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0', // Versión de OpenAPI
        info: {
            title: 'API de Comercio',
            version: '1.0.0',
            description: 'Documentación de la API para gestionar comercios y websites',
        },
        servers: [
            {
                url: `http://localhost:${PORT}/api`, // Cambia esto según tu configuración
            },
        ],
    },
    apis: ['./routes/*.js'], // Ruta a tus archivos de rutas
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const merchantRouter = require('./routes/merchant')
const userRouter = require('./routes/user')
const webpageRouter = require('./routes/webpage')

app.use('/api/merchants', merchantRouter)
app.use('/api/users', userRouter)
app.use('/api/webpages', webpageRouter)

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})