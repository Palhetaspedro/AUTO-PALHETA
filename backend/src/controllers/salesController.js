const { databases } = require('../lib/appwrite');

exports.createSale = async (req, res) => {
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
    res.status(500).json({ error: error.message });
  }
};

exports.getAllSales = async (req, res) => {
  try {
    const response = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_SALES_COLLECTION_ID
    );
    res.json(response.documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};