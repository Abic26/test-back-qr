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

// guardar las imagenes en imageKit
app.use('/api/upload', uploadRoutes);

// guardar las cadenas en la base de datos
app.use('/api/strings', stringRoutes);

// app para decodificar qr
app.use('/api/qr', qrRoutes);


sequelize.sync().then(() => {
  console.log('✅ Base de datos sincronizada.');
  console.log('Versión de Node:', process.version);
}).catch(err => {
  console.error('❌ Error al conectar base de datos:', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));