import { Heart, Star, Clock, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toggleFavorite, addToRecents } from '../lib/favorites'; // Funções que criamos
import { toast } from 'react-toastify';

export default function VehicleCard({ vehicle, user }) {
  const navigate = useNavigate();
  
  // Desestruturando conforme o seu print do Appwrite
  const { $id, brand, model, year, price_per_hour, image_url, vehicleType, Transmission, fuel_type } = vehicle;

  // 1. Ver Detalhes (ao clicar no card ou na imagem)
  const handleViewDetails = () => {
    addToRecents(vehicle); // Salva nos recentes (LocalStorage)
    navigate(`/vehicle/${$id}`);
  };

  // 2. Favoritar
  const handleFav = async (e) => {
    e.stopPropagation(); // Impede de abrir os detalhes
    if (!user) {
      toast.warn("Faça login para favoritar!");
      return;
    }
    const isFav = await toggleFavorite(user.$id, $id);
    if (isFav) toast.success("Adicionado aos favoritos!");
  };

  // 3. Reservar (Carrinho)
  const handleReserve = (e) => {
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (!cart.find(item => item.$id === $id)) {
      cart.push(vehicle);
      localStorage.setItem('cart', JSON.stringify(cart));
      toast.success("Adicionado ao carrinho!");
    }
    navigate('/cart');
  };

  return (
    <div 
      onClick={handleViewDetails}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 hover:shadow-xl transition-all group cursor-pointer"
    >
      {/* Imagem do Veículo */}
      <div className="relative h-48 w-full bg-gray-50 rounded-2xl overflow-hidden mb-4">
        {image_url ? (
          <img 
            src={image_url} 
            alt={`${brand} ${model}`} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm italic">
            Sem imagem disponível
          </div>
        )}
        
        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
          {vehicleType || 'Premium'}
        </div>

        <button 
          onClick={handleFav}
          className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur rounded-full shadow-sm hover:text-red-500 transition-all hover:scale-110"
        >
          <Heart size={20} />
        </button>
      </div>

      {/* Info do Carro */}
      <div className="flex justify-between items-start px-1">
        <div>
          <h3 className="font-black text-gray-900 text-lg tracking-tight uppercase">
            {brand} {model}
          </h3>
          <p className="text-gray-400 text-xs font-medium">{year} • {fuel_type || 'Flex'}</p>
        </div>
        <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-lg">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-bold text-yellow-700">4.9</span>
        </div>
      </div>

      {/* Detalhes Técnicos */}
      <div className="flex items-center gap-4 mt-4 px-1 text-gray-500 text-[11px] font-semibold uppercase tracking-wide">
        <div className="flex items-center gap-1.5">
          <Clock size={14} className="text-blue-500" />
          <span>{Transmission || 'Automático'}</span>
        </div>
      </div>

      {/* Preço e Ação */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-50 px-1">
        <div>
          <span className="text-2xl font-black text-black">R$ {price_per_hour}</span>
          <span className="text-gray-400 text-xs font-bold">/hora</span>
        </div>
        <button 
          onClick={handleReserve}
          className="bg-black text-white p-3 rounded-2xl hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-gray-200"
        >
          <ShoppingCart size={20} />
        </button>
      </div>
    </div>
  );
}