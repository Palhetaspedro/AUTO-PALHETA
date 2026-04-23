const express = require('express');
const router = express.Router();

// AJUSTE DE CAMINHO: 
// .. sai de 'routes', .. sai de 'src' e entra em 'config'
const { databases } = require('../../config/appwrite'); 

// Rota para buscar todas as vendas (usada no VehicleCard e SalesStats)
router.get('/', async (req, res) => {
  try {
    const response = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_SALES_COLLECTION_ID
    );
    res.json(response.documents);
  } catch (error) {
    console.error('Erro ao buscar vendas:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Rota para registrar uma nova venda (usada no VehicleDetail ao clicar em Alugar)
router.post('/', async (req, res) => {
  try {
    const { vehicleId, model, brand, price, rentalDate } = req.body;
    
    const result = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_SALES_COLLECTION_ID,
      'unique()',
      {
        vehicleId: String(vehicleId),
        model: String(model),
        brand: String(brand),
        price: Number(price),
        rentalDate: String(rentalDate)
      }
    );
    res.status(201).json(result);
  } catch (error) {
    console.error('Erro ao salvar venda:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;