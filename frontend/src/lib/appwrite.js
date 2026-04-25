import { Client, Account, Databases, Storage, ID } from 'appwrite';


export const ENDPOINT = 'https://sfo.cloud.appwrite.io/v1';
export const PROJECT_ID = '69e6d29f00174d22b7b6';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID);

export const account = new Account(client); 
export const databases = new Databases(client);
export const storage = new Storage(client);

export const BUCKET_ID = '69e7ced80039eec2c8ba';
export const DATABASE_ID = 'auto_ultimate_db';
export const COLLECTION_ID = 'vehicles_coll';

export const uploadVehicleImage = async (file) => {
  try {
    const uploadedFile = await storage.createFile(
      BUCKET_ID,
      ID.unique(),
      file,
      [] 
    );
    
   const fileUrl = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${uploadedFile.$id}/view?project=${PROJECT_ID}`;
    
    console.log("URL Construída:", fileUrl);
    
    return { url: fileUrl, fileId: uploadedFile.$id };
  } catch (error) {
    console.error("Erro no upload:", error);
    throw error;
  }
};

export { client, ID };