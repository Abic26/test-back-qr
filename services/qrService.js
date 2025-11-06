const Jimp = require("jimp");
const QrCode = require("qrcode-reader");

exports.decodeQrFromBuffer = async (buffer) => {
  const image = await Jimp.read(buffer);

  return new Promise((resolve, reject) => {
    const qr = new QrCode();
    qr.callback = (err, value) => {
      if (err) return reject(err);
      resolve(value?.result || null);
    };
    qr.decode(image.bitmap);
  });
};
