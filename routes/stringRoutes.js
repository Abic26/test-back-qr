const express = require('express');
const router = express.Router();
const stringController = require('../controllers/stringController');

router.post('/', stringController.createString);
router.get('/', stringController.getStrings);

module.exports = router;
