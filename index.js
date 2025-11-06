const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/uploadRoutes');
const stringRoutes = require('./routes/stringRoutes');
const qrRoutes = require('./routes/qrRoutes');
const sequelize = require('./config/sequelize');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/upload', uploadRoutes);
app.use('/api/strings', stringRoutes);
app.use('/api/qr', qrRoutes);

// Sincronizar la base de datos
sequelize.sync()
  .then(() => {
    console.log('✅ Base de datos sincronizada.');
    console.log('Versión de Node:', process.version);
  })
  .catch(err => {
    console.error('❌ Error al conectar base de datos:', err);
  });

// Ruta base para verificar
app.get('/', (req, res) => {
  res.send('🚀 Backend Express funcionando correctamente en Vercel');
});

// 👇 Exportar la app para Vercel (no usar app.listen)
module.exports = app;
