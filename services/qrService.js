// services/qrService.js
const jsQR = require("jsqr");
const fs = require("fs");
const Jimp = require("jimp").default;

/**
 * Preprocesa una imagen para mejorar la detección del código QR
 * Aplicamos: escala de grises, contraste, brillo, binarización, etc.
 */
async function preprocessImage(image) {
  return image
    .greyscale()           // Convierte a escala de grises
    .contrast(0.6)         // Aumenta el contraste
    .brightness(0.1)       // Aumenta ligeramente el brillo
    .normalize()           // Normaliza valores de color
    .posterize(3)          // Reduce el ruido en colores
    .resize(800, Jimp.AUTO) // Escala para mejorar la resolución si es pequeña
    .quality(100);         // Mantiene la mejor calidad posible
}

/**
 * Decodifica un QR desde una imagen usando múltiples estrategias de mejora
 */
async function decodeQrFromFile(path) {
  try {
    let image = await Jimp.read(path);

    // Primera pasada (imagen normal procesada)
    image = await preprocessImage(image);
    let { data, width, height } = image.bitmap;
    let code = jsQR(new Uint8ClampedArray(data), width, height);

    // Si no detecta, probamos rotando y reajustando brillo/contraste
    if (!code) {
      const attempts = [
        { rotate: 90, brightness: 0.2 },
        { rotate: 180, brightness: -0.1 },
        { rotate: 270, brightness: 0 },
      ];

      for (const attempt of attempts) {
        const temp = image.clone()
          .rotate(attempt.rotate)
          .brightness(attempt.brightness)
          .contrast(0.5);

        const { data, width, height } = temp.bitmap;
        code = jsQR(new Uint8ClampedArray(data), width, height);

        if (code) break;
      }
    }

    // Último intento: invertir colores (por si el QR es blanco sobre negro)
    if (!code) {
      const inverted = image.clone().invert();
      const { data, width, height } = inverted.bitmap;
      code = jsQR(new Uint8ClampedArray(data), width, height);
    }

    if (!code) throw new Error("No se pudo decodificar el código QR. Intenta con una imagen más nítida.");

    return code.data;
  } catch (err) {
    console.error("Error decodificando QR:", err);
    throw err;
  } finally {
    fs.unlink(path, (e) => e && console.warn("Error eliminando archivo temporal:", e));
  }
}

module.exports = { decodeQrFromFile };
