const imagekit = require('../services/imagekit');
const { decodeQrFromBuffer } = require('../services/qrService');

exports.uploadImage = async (req, res) => {
  console.log('🟡 [Upload] Petición recibida para subir imagen.');

  try {
    if (!req.file) {
      console.log('🔴 [Upload] No se envió ningún archivo.');
      return res.status(400).json({
        success: false,
        error: 'No se envió ninguna imagen'
      });
    }

    const { originalname, buffer } = req.file;
    const user = req.body.user || 'Anonimo';

    console.log(`🟢 [Upload] Archivo recibido: ${originalname}`);
    const customFileName = `${user}_${originalname}`;

    console.log('🚀 [Upload] Subiendo imagen a ImageKit...');
    const uploaded = await imagekit.upload({
      file: buffer, // <- no leemos del disco
      fileName: customFileName
    });

    console.log('✅ [Upload] Imagen subida correctamente:', uploaded.url);

    // Intentar decodificar QR desde el buffer
    let qrData = null;
    try {
      qrData = await decodeQrFromBuffer(buffer);
      console.log('🔍 [Upload] Código QR decodificado:', qrData);
    } catch (err) {
      console.warn('⚠️ [Upload] No se pudo decodificar QR:', err.message);
    }

    return res.json({
      success: true,
      url: uploaded.url,
      name: uploaded.name,
      qrData: qrData || null
    });
  } catch (err) {
    console.error('❌ [Upload] Error al subir imagen:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Error interno del servidor'
    });
  }
};
