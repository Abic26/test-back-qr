// services/qrService.js
const Jimp = require("jimp");
const QrCode = require("qrcode-reader");

/**
 * Mejora y decodifica un QR desde un buffer de imagen.
 * Intenta múltiples estrategias para garantizar detección incluso con imágenes borrosas o con mala iluminación.
 */
exports.decodeQrFromBuffer = async (buffer) => {
  try {
    let image = await Jimp.read(buffer);

    // 🔧 Procesamiento inicial: escala de grises + mejora de contraste
    image = image
      .greyscale()
      .contrast(0.6)
      .brightness(0.1)
      .normalize()
      .resize(800, Jimp.AUTO)
      .quality(100);

    // Función para intentar decodificar con una instancia
    const tryDecode = async (img) =>
      new Promise((resolve, reject) => {
        const qr = new QrCode();
        qr.callback = (err, value) => {
          if (err || !value?.result) return reject(err || new Error("No QR"));
          resolve(value.result);
        };
        qr.decode(img.bitmap);
      });

    // Intento 1: imagen base mejorada
    try {
      return await tryDecode(image);
    } catch {}

    // Intento 2: invertir colores (por si el QR es claro sobre fondo oscuro)
    try {
      const inverted = image.clone().invert();
      return await tryDecode(inverted);
    } catch {}

    // Intento 3: probar rotaciones (90, 180, 270)
    const rotations = [90, 180, 270];
    for (const deg of rotations) {
      try {
        const rotated = image.clone().rotate(deg);
        const result = await tryDecode(rotated);
        if (result) return result;
      } catch {}
    }

    // Intento 4: variar brillo y contraste
    const variants = [
      { brightness: 0.3, contrast: 0.8 },
      { brightness: -0.2, contrast: 0.7 },
      { brightness: 0, contrast: 1 },
    ];

    for (const { brightness, contrast } of variants) {
      try {
        const variant = image.clone().brightness(brightness).contrast(contrast);
        const result = await tryDecode(variant);
        if (result) return result;
      } catch {}
    }

    // Si llega aquí, no logró decodificar
    throw new Error("No se pudo decodificar el código QR. Intenta con una imagen más nítida o con mejor iluminación.");

  } catch (err) {
    console.error("❌ Error en decodeQrFromBuffer:", err.message);
    throw err;
  }
};
