// controllers/qrController.js
const { decodeQrFromFile } = require("../services/qrService");

exports.decodeQr = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No se envió imagen." });
    }

    const decodedText = await decodeQrFromFile(req.file.path);

    return res.json({
      success: true,
      message: "Código QR decodificado correctamente.",
      data: decodedText,
      user: req.body.user || null,
    });
  } catch (err) {
    console.error("❌ Error en decodeQr:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Error al procesar el QR.",
    });
  }
};
