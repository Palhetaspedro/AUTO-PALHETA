exports.createSale = async (req, res) => {
  try {
    // Adicionamos profileId e rating que vêm do seu frontend
    const { vehicleId, model, brand, price, rentalDate, profileId, rating } = req.body;
    
    const result = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_SALES_COLLECTION_ID,
      'unique()',
      {
        vehicleId: String(vehicleId),
        model: String(model),
        brand: String(brand),
        price: Number(price),
        rentalDate: String(rentalDate),
        profileId: Number(profileId), // Conforme sua imagem, é Integer
        rating: Number(rating || 0),   // Para o cálculo de médias
        status: "alugado"              // Para contar como ativo
      }
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};