import { useState, useEffect } from 'react';
import { databases, DATABASE_ID } from '../lib/appwrite';
import { Query } from 'appwrite';
import { account } from '../lib/appwrite';
import { Heart, Car } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Favourites() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavourites = async () => {
    try {
      setLoading(true);
      
      // 1. Pega o usuário logado
      const user = await account.get();

      // 2. Busca na coleção 'favorites_coll' os documentos deste usuário
      const favResponse = await databases.listDocuments(
        DATABASE_ID,
        'favorites_coll', // Certifique-se que o ID da coleção é este
        [Query.equal('userId', user.$id)]
      );

      // Se não tiver favoritos, encerra
      if (favResponse.documents.length === 0) {
        setVehicles([]);
        return;
      }

      // 3. Extrai apenas os vehicleId dos favoritos
      const favVehicleIds = favResponse.documents.map(doc => doc.vehicleId);

      // 4. Busca os detalhes dos veículos na coleção 'vehicles_coll'
      // Usamos Query.equal passando o array de IDs favoritados
      const vehiclesResponse = await databases.listDocuments(
        DATABASE_ID,
        'vehicles_coll',
        [Query.equal('$id', favVehicleIds)]
      );

      setVehicles(vehiclesResponse.documents);
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
      toast.error("Não foi possível carregar seus favoritos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  if (loading) return <div className="p-8 text-center animate-pulse text-gray-500">Carregando seus favoritos...</div>;

  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-black tracking-tighter">MEUS FAVORITOS</h1>
        <p className="text-gray-500">Seus carros dos sonhos salvos em um só lugar.</p>
      </header>

      {vehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
          <Heart className="text-gray-200 w-16 h-16 mb-4" />
          <p className="text-gray-400 font-medium">Você ainda não favoritou nenhum veículo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((car) => (
            <div key={car.$id} className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 group">
              <div 
                className="w-full aspect-video rounded-2xl bg-gray-100 bg-cover bg-center mb-4"
                style={{ backgroundImage: `url(${car.image_url})` }}
              />
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{car.brand} {car.model}</h3>
                  <p className="text-sm text-gray-500">{car.year} • {car.Transmission}</p>
                </div>
                <p className="text-blue-600 font-black">R$ {car.price_per_hour}/h</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}