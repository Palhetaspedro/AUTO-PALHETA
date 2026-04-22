const { databases, DATABASE_ID, COLLECTION_ID } = require('../config/appwrite');
const { ID } = require('node-appwrite');

// Listar todos os veículos
exports.getAll = async (req, res) => {
    try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
        res.status(200).json(response.documents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Criar novo veículo
exports.create = async (req, res) => {
    try {
        const vehicleData = {
            vehicleId: ID.unique(),
            brand: String(req.body.brand || ""),
            model: String(req.body.model || ""),
            year: parseInt(req.body.year) || 2024,
            price_per_hour: Math.round(Number(req.body.price_per_hour)) || 0,
            image_url: String(req.body.image_url || ""),
            vin: String(req.body.vin || "").substring(0, 17),
            color: String(req.body.color || "Black"),
            
            // Regras de Enum que funcionaram no seu banco:
            fuel_type: req.body.fuel_type ? 
                req.body.fuel_type.charAt(0).toUpperCase() + req.body.fuel_type.slice(1).toLowerCase() : "Gasoline",
            vehicleType: String(req.body.vehicleType || "sedan").toLowerCase(),
            Transmission: req.body.transmission ? 
                req.body.transmission.charAt(0).toUpperCase() + req.body.transmission.slice(1).toLowerCase() : "Automatic"
        };

        const response = await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), vehicleData);
        res.status(201).json(response);
    } catch (error) {
        console.error("ERRO NO CREATE:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// ATUALIZAR veículo existente
exports.update = async (req, res) => {
    try {
        const { id } = req.params; // ID do documento Appwrite que vem na URL

        const updateData = {
            brand: String(req.body.brand),
            model: String(req.body.model),
            year: parseInt(req.body.year),
            price_per_hour: Math.round(Number(req.body.price_per_hour)),
            image_url: String(req.body.image_url),
            vin: String(req.body.vin || "").substring(0, 17),
            color: String(req.body.color),
            
            // Mantendo a mesma formatação do Create
            fuel_type: req.body.fuel_type ? 
                req.body.fuel_type.charAt(0).toUpperCase() + req.body.fuel_type.slice(1).toLowerCase() : "Gasoline",
            vehicleType: String(req.body.vehicleType || "sedan").toLowerCase(),
            Transmission: req.body.transmission ? 
                req.body.transmission.charAt(0).toUpperCase() + req.body.transmission.slice(1).toLowerCase() : "Automatic"
        };

        const response = await databases.updateDocument(
            DATABASE_ID,
            COLLECTION_ID,
            id, // ID do documento no Appwrite
            updateData
        );

        res.status(200).json(response);
    } catch (error) {
        console.error("ERRO NO UPDATE:", error.message);
        res.status(500).json({ error: error.message });
    }
};