// routes/qrRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const { decodeQr } = require("../controllers/qrController");

const router = express.Router();

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Endpoint para decodificar QR
router.post("/decode-qr", upload.single("image"), decodeQr);

module.exports = router;
