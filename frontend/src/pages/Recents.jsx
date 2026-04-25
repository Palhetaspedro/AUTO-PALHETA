import React, { useState, useEffect } from 'react';
import { Clock, Trash2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Recents() {
  const [recentCars, setRecentCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedRecents = JSON.parse(localStorage.getItem('recent_cars') || '[]');
    setRecentCars(savedRecents);
  }, []);

  const clearRecents = () => {
    localStorage.removeItem('recent_cars');
    setRecentCars([]);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Clock size={20} strokeWidth={2.5} />
            <span className="text-xs font-black uppercase tracking-[0.3em]">Histórico</span>
          </div>
          <h1 className="text-4xl font-black text-black tracking-tighter">RECENTES</h1>
        </div>
        
        {recentCars.length > 0 && (
          <button 
            onClick={clearRecents}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <Trash2 size={16} />
            LIMPAR HISTÓRICO
          </button>
        )}
      </div>

      {/* Grid de Carros */}
      {recentCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentCars.map((car) => (
            <div 
              key={car.$id} // Usando o ID do Appwrite
              onClick={() => navigate(`/vehicle/${car.$id}`)} // Rota corrigida para bater com o seu VehicleCard
              className="group bg-white border border-gray-100 rounded-[2rem] p-4 shadow-sm hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="aspect-video rounded-[1.5rem] bg-gray-100 mb-4 overflow-hidden">
                <img 
                  src={car.image_url} // CORRIGIDO: Propriedade correta do seu objeto
                  alt={`${car.brand} ${car.model}`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              <div className="flex justify-between items-start px-2">
                <div>
                  <h3 className="font-black text-lg text-black uppercase">
                    {car.brand} {car.model} {/* CORRIGIDO: Combinando brand e model */}
                  </h3>
                  <p className="text-sm font-bold text-gray-400">{car.year} • {car.vehicleType}</p>
                </div>
                <div className="bg-black text-white p-2 rounded-xl group-hover:bg-blue-600 transition-colors">
                  <ChevronRight size={20} />
                </div>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200">
          <Clock size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500 font-bold italic">Nenhum carro visualizado recentemente.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-6 py-3 bg-black text-white rounded-2xl font-black text-xs tracking-widest hover:scale-105 transition-all"
          >
            EXPLORAR FROTA
          </button>
        </div>
      )}
    </div>
  );
}