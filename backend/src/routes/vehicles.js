const express = require('express');
const router = express.Router();
// Importa o controller
const vehicleController = require('../controllers/vehicleController');

// Define as rotas
router.get('/', vehicleController.getAll);
router.post('/', vehicleController.create);

module.exports = router;