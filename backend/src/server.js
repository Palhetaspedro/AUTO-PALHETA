const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Procura o arquivo appwrite.js na pasta config
const appwritePath = path.resolve(__dirname, './config/appwrite');
const { databases } = require(appwritePath);

const app = express();

// O Northflank injeta a variável PORT automaticamente
const PORT = process.env.PORT || 3001;

// Configuração de CORS aberta para o seu Frontend conseguir acessar
app.use(cors({
 origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// --- ROTA DE VEÍCULOS ---
// Certifique-se de que o arquivo './routes/vehicles' existe no seu projeto
const vehicleRoutes = require('./routes/vehicles');
app.use('/api/vehicles', vehicleRoutes);

// --- ROTA DE VENDAS (Para o seu SalesStats.jsx) ---
app.get('/api/sales', async (req, res) => {
  try {
    const response = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      'sales_coll'
    );
    res.json(response.documents);
  } catch (error) {
    console.error("Erro ao buscar vendas:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/sales', async (req, res) => {
  try {
    const { vehicleId, price, customerFeedbackRating } = req.body;

    // 1. REGISTRA A VENDA NO BANCO (Ajustado para bater com seu Appwrite)
    const result = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      'sales_coll',
      'unique()',
      {
        transactionId: String(Date.now()), // ID temporal para evitar erro de campo vazio
        salesPersonId: 'sistema_web',
        saleDate: new Date().toISOString(),
        finalPrice: parseFloat(price),
        paymentMethod: 'creditCard', // Valor exato do seu ENUM
        customerFeedbackRating: customerFeedbackRating || null,
        discountApplied: false
      }
    );

    // 2. ATUALIZA A FROTA (BAIXA AUTOMÁTICA)
    try {
      const vehicle = await databases.getDocument(
        process.env.APPWRITE_DATABASE_ID,
        'vehicles_coll', 
        vehicleId
      );

      if (vehicle && vehicle.stock > 0) {
        await databases.updateDocument(
          process.env.APPWRITE_DATABASE_ID,
          'vehicles_coll',
          vehicleId,
          {
            stock: Math.max(0, vehicle.stock - 1)
          }
        );
        console.log(`📉 Estoque atualizado: ${vehicle.model} agora tem ${vehicle.stock - 1} unidades.`);
      }
    } catch (stockError) {
      console.error("⚠️ Venda registrada, mas falha ao atualizar estoque:", stockError.message);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error("❌ Erro detalhado do Appwrite:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Rota de Health Check (Para o Northflank saber que o app não crashou)
app.get('/', (req, res) => {
  res.send('Backend Luxury Cars Online 🏎️');
});

// IMPORTANTE: '0.0.0.0' é obrigatório no Northflank
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  🚀 Servidor ONLINE
  📡 Porta: ${PORT}
  🔗 Host: 0.0.0.0
  `);
});