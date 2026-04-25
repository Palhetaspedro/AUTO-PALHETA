const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController'); // Verifique o caminho!

// O erro deve estar aqui. Se getAll não estiver exportado no controller, dá erro.
router.get('/', vehicleController.getAll); 
router.post('/', vehicleController.create);
router.put('/:id', vehicleController.update);
router.delete('/:id', vehicleController.delete);

module.exports = router;