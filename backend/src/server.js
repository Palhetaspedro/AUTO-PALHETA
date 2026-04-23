const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Procura o arquivo appwrite.js subindo um nível de forma segura
const appwritePath = path.resolve(__dirname, './config/appwrite');
const { databases } = require(appwritePath);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

// --- ROTA DE VEÍCULOS ---
const vehicleRoutes = require('./routes/vehicles');
app.use('/api/vehicles', vehicleRoutes);

// --- ROTA DE VENDAS (Ajustada para o seu banco) ---
app.get('/api/sales', async (req, res) => {
  try {
    const response = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      'sales_coll'
    );
    res.json(response.documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/sales', async (req, res) => {
  try {
    const { vehicleId, price } = req.body;

    const result = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      'sales_coll',
      'unique()',
      {
        transactionId: String(vehicleId),
        salesPersonId: 'sistema_web',
        saleDate: new Date().toISOString(),
        finalPrice: parseFloat(price),
        // AJUSTADO: Agora está igual à sua imagem (creditCard)
        paymentMethod: 'creditCard', 
        discountApplied: false
      }
    );
    res.status(201).json(result);
  } catch (error) {
    console.error("❌ Erro detalhado do Appwrite:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor ONLINE na porta ${PORT}`);
});