const imagekit = require('../services/imagekit');
const Jimp = require('jimp');
const jsQR = require('jsqr');

/**
 * Controlador para subir y decodificar imágenes QR sin guardarlas en disco
 */
exports.uploadImage = async (req, res) => {
  console.log('🟡 Petición recibida para subir imagen.');

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No se envió ninguna imagen'
      });
    }

    console.log(`🟢 Archivo recibido: ${req.file.originalname}`);

    // ✅ Leer el buffer directamente desde memoria
    const buffer = req.file.buffer;

    // Opcional: si quieres subir a ImageKit
    const customFileName = `${req.body.user || 'Anonimo'}_${req.file.originalname}`;
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: customFileName,
    });

    console.log('✅ Imagen subida a ImageKit:', uploadResponse.url);

    // ✅ Si además quieres decodificar QR
    const image = await Jimp.read(buffer);
    const { data, width, height } = image.bitmap;
    const code = jsQR(new Uint8ClampedArray(data), width, height);

    return res.json({
      success: true,
      link: uploadResponse.url,
      qrData: code ? code.data : null,
    });
  } catch (err) {
    console.error('❌ Error al subir imagen:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Error interno del servidor'
    });
  }
};
