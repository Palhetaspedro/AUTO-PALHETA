const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

// Rotas da API de Veículos
router.get('/', vehicleController.getAll);
router.post('/', vehicleController.create); // Adicionar middleware de upload aqui depois
// router.get('/:id', vehicleController.getById);
// router.delete('/:id', vehicleController.delete);

module.exports = router;