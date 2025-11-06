const jsQR = require('jsqr');
const Jimp = require('jimp').default;

/**
 * Preprocesa una imagen para mejorar la detección del código QR
 */
async function preprocessImage(image) {
  return image
    .greyscale()
    .contrast(0.6)
    .brightness(0.1)
    .normalize()
    .posterize(3)
    .resize(800, Jimp.AUTO)
    .quality(100);
}

/**
 * Decodifica un QR directamente desde un buffer (sin guardar archivo)
 */
async function decodeQrFromBuffer(buffer) {
  try {
    let image = await Jimp.read(buffer);

    // Primera pasada
    image = await preprocessImage(image);
    let { data, width, height } = image.bitmap;
    let code = jsQR(new Uint8ClampedArray(data), width, height);

    // Intentos adicionales si no detecta
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

    // Último intento: invertir colores
    if (!code) {
      const inverted = image.clone().invert();
      const { data, width, height } = inverted.bitmap;
      code = jsQR(new Uint8ClampedArray(data), width, height);
    }

    if (!code) throw new Error('No se pudo decodificar el código QR.');

    return code.data;
  } catch (err) {
    console.error('Error decodificando QR desde buffer:', err);
    throw err;
  }
}

module.exports = { decodeQrFromBuffer };
