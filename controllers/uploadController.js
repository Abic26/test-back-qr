const imagekit = require('../services/imagekit');
const fs = require('fs');

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

    console.log(`🟢 [Upload] Archivo recibido: ${req.file.originalname}`);
    console.log('📦 [Upload] Leyendo archivo temporal...');

    const file = req.file;
    const user = req.body.user || "Anonimo";
    const fileBuffer = fs.readFileSync(file.path);

    console.log('🚀 [Upload] Subiendo imagen a ImageKit...');
    const customFileName = `${user}_${file.originalname}`;
    console.log(`📝 [Upload] Nombre final del archivo: ${customFileName}`);

    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: customFileName
    });

    console.log('✅ [Upload] Imagen subida correctamente a ImageKit.');
    console.log(`🌐 URL: ${response.url}`);

    fs.unlinkSync(file.path);
    console.log('🧹 [Upload] Archivo temporal eliminado.');

    return res.json({
      success: true,
      link: response.url,
      name: response.name
    });
  } catch (err) {
    console.error('❌ [Upload] Error al subir imagen:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Error interno del servidor'
    });
  }
};
