import { Heart, Star, Clock } from 'lucide-react';

export default function VehicleCard({ vehicle }) {
  // O Appwrite retorna os campos do seu print: make, model, year, image_url, etc.
  const { make, model, year, price_per_hour, image_url, vehicleType } = vehicle;
  const handleViewVehicle = async (vehicleId) => {
  // Salva no histórico (Recentes) do Appwrite
  await databases.createDocument(DB_ID, HISTORY_COLL_ID, ID.unique(), {
    user_id: user.id,
    vehicle_id: vehicleId,
    timestamp: new Date()
  });
  // 2. Navega para a página de detalhes
  navigate(`/vehicle/${vehicleId}`);
};
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow group">
      {/* Imagem do Veículo */}
      <div className="relative h-44 w-full bg-gray-50 rounded-xl overflow-hidden mb-4">
        {image_url ? (
          <img 
            src={image_url} 
            alt={`${make} ${model}`} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No image available
          </div>
        )}
        
        {/* Badge de Tipo */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm">
          {vehicleType || 'Standard'}
        </div>

        {/* Botão Favoritar */}
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:text-red-500 transition-colors">
          <Heart size={18} />
        </button>
      </div>

      {/* Info do Carro */}
      <div className="flex justify-between items-start mb-1">
        <div>
          <h3 className="font-bold text-gray-900 text-lg leading-tight">
            {make} {model}
          </h3>
          <p className="text-gray-500 text-sm">{year}</p>
        </div>
        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-bold text-yellow-700">4.8</span>
        </div>
      </div>

      {/* Detalhes Técnicos Rápidos */}
      <div className="flex items-center gap-4 mt-3 text-gray-500 text-xs">
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>Automatic</span>
        </div>
        <span>•</span>
        <span>Gasoline</span>
      </div>

      {/* Preço e Ação */}
      <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-50">
        <div>
          <span className="text-xl font-bold text-black">${price_per_hour || '0'}</span>
          <span className="text-gray-400 text-sm">/hr</span>
        </div>
        <button className="bg-black text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
          Rent Now
        </button>
      </div>
    </div>
  );
}