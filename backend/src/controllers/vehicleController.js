const { databases } = require('../config/appwrite'); 
const { ID, Query } = require('node-appwrite');

const dbId = process.env.APPWRITE_DATABASE_ID;
const collId = process.env.APPWRITE_COLLECTION_ID;

// Listar Veículos
exports.getAll = async (req, res) => {
    try {
        const response = await databases.listDocuments(
            dbId, 
            collId,
            [Query.orderDesc('$createdAt')]
        );
        res.status(200).json(response.documents);
    } catch (error) {
        console.error("Erro ao buscar no Appwrite:", error);
        res.status(500).json({ error: error.message });
    }
};

// Criar Veículo (AJUSTADO PARA A SUA TABELA)
exports.create = async (req, res) => {
    try {
        console.log("Dados recebidos no Body:", req.body);

        const vehicleData = {
            vehicleId: ID.unique(), 
            brand: req.body.brand || req.body.make || "N/A",
            model: req.body.model || "N/A",
            year: parseInt(req.body.year) || 2024,
            color: req.body.color || "Black",
            vehicleType: req.body.vehicleType || "Sedan",
            // Garantindo que seja número inteiro para o Appwrite
            price_per_hour: Math.round(Number(req.body.price_per_hour)) || 0, 
            image_url: req.body.image_url || "",
            vin: String(req.body.vin || "N/A").substring(0, 17),
            fuel_type: req.body.fuel_type || "Gasoline",
            Transmission: req.body.transmission || "Automatic"
        };

        const response = await databases.createDocument(
            dbId, 
            collId, 
            ID.unique(), 
            vehicleData
        );

        res.status(201).json(response);
    } catch (error) {
        console.error("❌ Erro detalhado no Appwrite:", error.message);
        res.status(500).json({ error: error.message });
    }
};