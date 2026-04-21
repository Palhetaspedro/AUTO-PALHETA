const { databases } = require('../config/appwrite'); 
const { ID, Query } = require('node-appwrite');

const dbId = process.env.APPWRITE_DATABASE_ID;
const collId = process.env.APPWRITE_COLLECTION_ID;

// Função para Listar Veículos
exports.getAll = async (req, res) => {
    try {
        const response = await databases.listDocuments(
            dbId, 
            collId,
            [Query.orderDesc('$createdAt')] // Traz os mais novos primeiro
        );
        res.status(200).json(response.documents);
    } catch (error) {
        console.error("Erro ao buscar no Appwrite:", error);
        res.status(500).json({ error: error.message });
    }
};

// Função para Criar Veículo
exports.create = async (req, res) => {
    try {
        const vehicleData = {
            vehicleId: ID.unique(), 
            make: req.body.make || req.body.brand,
            model: req.body.model,
            year: parseInt(req.body.year),
            color: req.body.color || "Black",
            vehicleType: req.body.vehicleType || "Sedan",
            price_per_hour: parseFloat(req.body.price_per_hour) || 0, // Evita erro se vir vazio
            image_url: req.body.image_url || "",
            vin: req.body.vin || "N/A"
        };

        const response = await databases.createDocument(
            dbId, 
            collId, 
            ID.unique(), // ID único do documento no Appwrite
            vehicleData
        );
        res.status(201).json(response);
    } catch (error) {
        console.error("Erro ao criar no Appwrite:", error);
        res.status(500).json({ error: error.message });
    }
};