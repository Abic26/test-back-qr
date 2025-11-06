const fs = require("fs");
const { decodeQrFromFile } = require("../services/qrService");

exports.decodeQr = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No se envió ninguna imagen." });
    }

    const filePath = req.file.path;
    console.log("📂 Archivo temporal:", filePath);

    // Decodificar QR
    const decodedText = await decodeQrFromFile(filePath);

    // Opcional: eliminar archivo después de usarlo
    try {
      fs.unlinkSync(filePath);
      console.log("🧹 Archivo temporal eliminado correctamente.");
    } catch (unlinkErr) {
      console.warn("⚠️ No se pudo eliminar el archivo temporal:", unlinkErr.message);
    }

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
