import { Star, ShoppingCart, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { databases, DATABASE_ID } from '../lib/appwrite'; // Importe sua config do Appwrite
import { Query } from 'appwrite';

const saveToRecents = (vehicle) => {
  if (!vehicle) return;
  const recents = JSON.parse(localStorage.getItem('recent_cars') || '[]');
  const filtered = recents.filter(item => item.$id !== vehicle.$id);
  const updated = [vehicle, ...filtered].slice(0, 10);
  localStorage.setItem('recent_cars', JSON.stringify(updated));
};

export default function VehicleCard({ vehicle: initialVehicle }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ rating: 0.0, totalSales: 0 }); // Começa em 0
  const [currentStock, setCurrentStock] = useState(Number(initialVehicle?.stock ?? 0));

  const SALES_COLLECTION_ID = "sales_coll"; // ID da sua coleção de vendas

  if (!initialVehicle) return null;

  const { 
    $id, 
    brand, 
    model, 
    year, 
    price_per_hour, 
    image_url, 
    fuel_type 
  } = initialVehicle;

  useEffect(() => {
    // 1. Sincroniza estoque
    if (initialVehicle?.stock !== undefined) {
      setCurrentStock(Number(initialVehicle.stock));
    }

    // 2. Busca avaliações reais do Appwrite
    async function getRealRating() {
      try {
        // Buscamos as vendas deste veículo específico
        // Nota: Certifique-se que você salva o ID do veículo em algum campo na coleção de vendas
        // Se você não salva o ID do veículo na venda, a média global será exibida.
        const response = await databases.listDocuments(
          DATABASE_ID,
          SALES_COLLECTION_ID,
          [Query.limit(100)] 
        );

        // Filtramos as notas que não são nulas (conforme sua imagem)
        const ratings = response.documents
          .map(doc => Number(doc.customerFeedbackRating))
          .filter(rate => rate > 0);

        if (ratings.length > 0) {
          const sum = ratings.reduce((a, b) => a + b, 0);
          const avg = sum / ratings.length;
          setStats({ rating: avg, totalSales: ratings.length });
        } else {
          setStats({ rating: 5.0, totalSales: 0 }); // Default se nunca foi avaliado
        }
      } catch (error) {
        console.error("Erro ao buscar rating:", error);
      }
    }

    getRealRating();
  }, [initialVehicle, $id]);

  const handleReserve = (e) => {
    e.stopPropagation();
    if (currentStock <= 0) {
      toast.error("Este veículo não possui unidades disponíveis na frota.");
      return;
    }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const isAlreadyInCart = cart.find(item => item.$id === $id);
    if (!isAlreadyInCart) {
      cart.push({ ...initialVehicle, stock: currentStock });
      localStorage.setItem('cart', JSON.stringify(cart));
      toast.success(`${brand} ${model} adicionado ao carrinho!`);
    } else {
      toast.info("Este veículo já está no seu carrinho.");
    }
    navigate('/cart');
  };

  return (
    <div 
      onClick={() => { saveToRecents(initialVehicle); navigate(`/vehicle/${$id}`); }}
      className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-4 hover:shadow-2xl transition-all group cursor-pointer relative"
    >
      <div className="absolute top-6 right-6 z-10">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm border ${
          currentStock > 0 ? 'bg-green-500/10 border-green-200' : 'bg-red-500/10 border-red-200'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${currentStock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className={`text-[9px] font-black uppercase tracking-widest ${
            currentStock > 0 ? 'text-green-700' : 'text-red-700'
          }`}>
            {currentStock > 0 ? 'Disponível' : 'Esgotado'}
            {currentStock > 0 && (
              <span className="ml-1 text-green-600/60 font-bold">[{currentStock}]</span>
            )}
          </span>
        </div>
      </div>

      <div className="relative h-48 w-full bg-gray-50 rounded-[2rem] overflow-hidden mb-4">
        {image_url ? (
          <img 
            src={image_url} 
            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${
              currentStock > 0 ? 'opacity-100' : 'opacity-40 grayscale'
            }`}
            alt={model}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-xs italic font-bold uppercase">Sem Foto</div>
        )}
      </div>

      <div className="flex justify-between items-start px-1">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{brand}</p>
          <h3 className="font-black text-gray-900 text-xl tracking-tighter uppercase leading-none">{model}</h3>
          <p className="text-gray-400 text-[10px] font-bold uppercase mt-1 italic">{year} • {fuel_type}</p>
        </div>
        <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-lg">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          {/* AQUI MOSTRA O RATING REAL CALCULADO */}
          <span className="text-xs font-black text-yellow-700">{stats.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-50">
        <div>
          <span className="text-2xl font-black text-black tracking-tighter">
            U$ {Number(price_per_hour || 0).toLocaleString('en-US')}
          </span>
          <span className="text-gray-400 text-[10px] font-black uppercase ml-1">/hr</span>
        </div>
        
        <button 
          onClick={handleReserve}
          disabled={currentStock <= 0}
          className={`p-3.5 rounded-2xl transition-all active:scale-90 shadow-xl ${
            currentStock > 0 
            ? 'bg-black text-white hover:bg-zinc-800' 
            : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
          }`}
        >
          {currentStock > 0 ? <ShoppingCart size={20} /> : <AlertCircle size={20} />}
        </button>
      </div>
    </div>
  );
}