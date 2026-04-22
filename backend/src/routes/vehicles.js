// src/routes/vehicles.js
const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

// Verifique se os nomes batem com o que foi exportado acima
router.get('/', vehicleController.getAll);  // Linha 7 - Onde o erro acontecia
router.post('/', vehicleController.create);

module.exports = router;