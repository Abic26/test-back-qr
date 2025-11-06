const StringModel = require('../models/stringModel');

// POST /api/strings
exports.createString = async (req, res) => {
  try {
    const { string, user } = req.body;
    if (!string) return res.status(400).json({ success: false, error: 'El campo "string" es obligatorio.' });
    if (!user) return res.status(400).json({ success: false, error: 'El campo "user" es obligatorio.' });

    const now = new Date();
    const fecha = now.toISOString().split('T')[0];
    const hora = now.toTimeString().split(' ')[0];

    const newRecord = await StringModel.create({ fecha, hora, string, user });

    res.json({ success: true, data: newRecord });
  } catch (err) {
    console.error('❌ Error al crear registro:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/strings
exports.getStrings = async (req, res) => {
  try {
    const records = await StringModel.findAll({ order: [['id', 'DESC']] });
    res.json({ success: true, data: records });
  } catch (err) {
    console.error('❌ Error al obtener registros:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
