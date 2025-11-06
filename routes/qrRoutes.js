// routes/qrRoutes.js
const express = require("express");
const multer = require("multer");
const { decodeQr } = require("../controllers/qrController");

const router = express.Router();

// ✅ Almacenamiento en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint para decodificar QR
router.post("/decode-qr", upload.single("image"), decodeQr);

module.exports = router;
