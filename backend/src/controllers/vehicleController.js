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
            year: parseInt(req.body.year) || 2026,
            price_per_hour: Math.round(Number(req.body.price_per_hour)) || 0,
            image_url: String(req.body.image_url || ""),
            vin: String(req.body.vin || "").substring(0, 17),
            color: String(req.body.color || "Black"),
            
            // ADICIONADO: Lógica de estoque
            stock: parseInt(req.body.stock) || 0, 

            fuel_type: req.body.fuel_type || "Gasoline",
            vehicleType: req.body.vehicleType || "sedan",
            Transmission: req.body.Transmission || "Automatic"
        };

        const response = await databases.createDocument(
            DATABASE_ID, 
            COLLECTION_ID, 
            ID.unique(), 
            vehicleData
        );
        res.status(201).json(response);
    } catch (error) {
        console.error("ERRO NO CREATE:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// ATUALIZAR veículo existente
exports.update = async (req, res) => {
    try {
        const { id } = req.params; 

        const updateData = {
            brand: String(req.body.brand),
            model: String(req.body.model),
            year: parseInt(req.body.year),
            price_per_hour: Math.round(Number(req.body.price_per_hour)),
            image_url: String(req.body.image_url),
            vin: String(req.body.vin || "").substring(0, 17),
            color: String(req.body.color),
            
            // ADICIONADO: Atualização de estoque
            stock: parseInt(req.body.stock) || 0,

            fuel_type: req.body.fuel_type,
            vehicleType: req.body.vehicleType,
            Transmission: req.body.Transmission
        };

        const response = await databases.updateDocument(
            DATABASE_ID,
            COLLECTION_ID,
            id, 
            updateData
        );

        res.status(200).json(response);
    } catch (error) {
        console.error("ERRO NO UPDATE:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// Deletar veículo
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
        res.status(200).json({ message: "Documento deletado com sucesso" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};