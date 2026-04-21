import { Client, Account, Databases, Storage, ID } from 'appwrite';

const client = new Client()
    .setEndpoint('https://sfo.cloud.appwrite.io/v1')
    .setProject('69e6d29f00174d22b7b6');

// Exportando os serviços
export const account = new Account(client); 
export const databases = new Databases(client);
export const storage = new Storage(client);

// IDs do seu projeto para usar no AdminPanel e outros lugares
export const BUCKET_ID = '69e7ced80039eec2c8ba';
export const DATABASE_ID = 'auto_ultimate_db';
export const COLLECTION_ID = 'vehicles_coll';

// Função utilitária para upload de imagens
export const uploadVehicleImage = async (file) => {
  try {
    const uploadedFile = await storage.createFile(
      BUCKET_ID,
      ID.unique(),
      file
    );
    
    // Gera a URL de visualização da imagem
    const result = storage.getFilePreview(BUCKET_ID, uploadedFile.$id);
    return { url: result.href, fileId: uploadedFile.$id };
  } catch (error) {
    console.error("Erro no upload:", error);
    throw error;
  }
};

export { client, ID };