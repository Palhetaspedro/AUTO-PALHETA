const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Importando rotas (você criará os arquivos de rota e apontará para os controllers)
const vehicleRoutes = require('./routes/vehicles');
// const salesRoutes = require('./routes/sales'); // Implementar depois

app.use('/api/vehicles', vehicleRoutes);
// app.use('/api/sales', salesRoutes); 

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});