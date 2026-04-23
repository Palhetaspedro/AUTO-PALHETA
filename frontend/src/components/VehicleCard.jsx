import { Star, Clock, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import axios from 'axios';

const saveToRecents = (vehicle) => {
  const recents = JSON.parse(localStorage.getItem('recent_cars') || '[]');
  const filtered = recents.filter(item => item.$id !== vehicle.$id);
  const updated = [vehicle, ...filtered].slice(0, 10);
  localStorage.setItem('recent_cars', JSON.stringify(updated));
};

export default function VehicleCard({ vehicle, user }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ rating: 5.0, totalSales: 0 }); // Estado para a lógica ao vivo

  const { 
    $id, 
    brand, 
    model, 
    year, 
    price_per_hour, 
    image_url, 
    vehicleType, 
    Transmission, 
    fuel_type 
  } = vehicle;

  // Lógica para buscar avaliações baseadas nas vendas reais
  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        // Buscamos todas as vendas do seu novo endpoint
        const response = await axios.get('http://localhost:3001/api/sales');
        const vehicleSales = response.data.filter(sale => sale.vehicleId === $id);
        
        if (vehicleSales.length > 0) {
          // Lógica: Cada aluguel mantém a nota alta, mas simula uma variação real
          // Se tiver 1 aluguel, nota 4.8. Se tiver mais, tende a 5.0
          const calculatedRating = vehicleSales.length > 1 ? 5.0 : 4.8;
          setStats({
            rating: calculatedRating,
            totalSales: vehicleSales.length
          });
        }
      } catch (error) {
        console.error("Erro ao carregar avaliações ao vivo:", error);
      }
    };

    fetchLiveStats();
  }, [$id]);

  const handleViewDetails = () => {
    saveToRecents(vehicle);
    navigate(`/vehicle/${$id}`);
  };

  const handleReserve = (e) => {
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const isAlreadyInCart = cart.find(item => item.$id === $id);

    if (!isAlreadyInCart) {
      cart.push(vehicle);
      localStorage.setItem('cart', JSON.stringify(cart));
      toast.success(`${brand} ${model} adicionado ao carrinho!`);
    } else {
      toast.info("Este veículo já está no seu carrinho.");
    }
    navigate('/cart');
  };

  return (
    <div 
      onClick={handleViewDetails}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 hover:shadow-xl transition-all group cursor-pointer"
    >
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
      </div>

      <div className="flex justify-between items-start px-1">
        <div>
          <h3 className="font-black text-gray-900 text-lg tracking-tight uppercase">
            {brand} {model}
          </h3>
          <p className="text-gray-400 text-xs font-medium">{year} • {fuel_type || 'Flex'}</p>
        </div>
        
        {/* AVALIAÇÃO AO VIVO: Mostra a nota e quantos aluguéis o carro já teve */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-lg">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-yellow-700">{stats.rating.toFixed(1)}</span>
          </div>
          {stats.totalSales > 0 && (
            <span className="text-[9px] text-gray-400 font-bold mt-1 uppercase">
              {stats.totalSales} {stats.totalSales === 1 ? 'aluguel' : 'aluguéis'}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4 px-1 text-gray-500 text-[11px] font-semibold uppercase tracking-wide">
        <div className="flex items-center gap-1.5">
          <Clock size={14} className="text-blue-500" />
          <span>{Transmission || 'Automático'}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-50 px-1">
        <div>
          <span className="text-2xl font-black text-black">
            U$ {Number(price_per_hour).toLocaleString('en-US')}
          </span>
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