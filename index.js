require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Importación de rutas
const commerceRouter = require('./routes/commerce');
const merchantRouter = require('./routes/merchant');
const userRouter = require('./routes/user');
const webpageRouter = require('./routes/webpage');
const authRouter = require('./routes/auth');

const PORT = process.env.PORT || 8081; // Puerto ajustado al backend

const app = express();

// Middleware: CORS y JSON
app.use(cors({
    origin: 'http://localhost:3000', // URL del frontend
    methods: 'GET,POST,DELETE',      // Asegúrate de incluir DELETE
    allowedHeaders: 'Content-Type, Authorization' // Authorization para JWT
}));
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Servir imágenes estáticas desde la carpeta uploads

// Configuración de Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Comercio',
            version: '1.0.0',
            description: 'Documentación de la API para gestionar comercios y websites',
        },
        servers: [
            { url: `http://localhost:${PORT}/api` }
        ],
    },
    apis: ['./routes/*.js'], // Rutas de Swagger
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas de la API
app.use('/api/commerces', commerceRouter); // Rutas de comercio
app.use('/api/merchants', merchantRouter);
app.use('/api/users', userRouter);
app.use('/api/webpages', webpageRouter);
app.use('/api/auth', authRouter);

// Endpoint raíz
app.get('/', (req, res) => {
    res.send('La aplicación está corriendo en el puerto: ' + PORT);
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
