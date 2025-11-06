const { decodeQrFromBuffer } = require("../services/qrService");

exports.decodeQr = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        error: "No se envió ninguna imagen o no se procesó correctamente.",
      });
    }

    // ✅ Decodificar directamente desde el buffer (sin archivo temporal)
    const decodedText = await decodeQrFromBuffer(req.file.buffer);

    return res.json({
      success: true,
      message: "Código QR decodificado correctamente.",
      data: decodedText,
    });
  } catch (err) {
    console.error("❌ Error en decodeQr:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Error al procesar el QR.",
    });
  }
};
