import { databases, DATABASE_ID } from './appwrite';
import { ID, Query } from 'appwrite';

const FAV_COLLECTION = 'favorites_coll'; // Use o ID que criou no painel

// --- FAVORITOS (No Banco de Dados) ---
export const toggleFavorite = async (userId, vehicleId) => {
  try {
    // Verifica se já existe
    const existing = await databases.listDocuments(DATABASE_ID, FAV_COLLECTION, [
      Query.equal('userId', userId),
      Query.equal('vehicleId', vehicleId)
    ]);

    if (existing.total > 0) {
      // Se já existe, remove (desfavorita)
      await databases.deleteDocument(DATABASE_ID, FAV_COLLECTION, existing.documents[0].$id);
      return false;
    } else {
      // Se não existe, adiciona
      await databases.createDocument(DATABASE_ID, FAV_COLLECTION, ID.unique(), {
        userId,
        vehicleId
      });
      return true;
    }
  } catch (error) {
    console.error("Erro ao favoritar:", error);
  }
};

// --- RECENTES (No LocalStorage do Navegador) ---
export const addToRecents = (vehicle) => {
  const recents = JSON.parse(localStorage.getItem('recent_vehicles') || '[]');
  
  // Remove se já estiver na lista (para subir pro topo)
  const filtered = recents.filter(v => v.$id !== vehicle.$id);
  
  // Adiciona no início e limita a 10 itens
  const updated = [vehicle, ...filtered].slice(0, 10);
  
  localStorage.setItem('recent_vehicles', JSON.stringify(updated));
};