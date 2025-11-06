// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/uploadController');

// ✅ Usamos almacenamiento en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('image'), uploadController.uploadImage);

module.exports = router;
