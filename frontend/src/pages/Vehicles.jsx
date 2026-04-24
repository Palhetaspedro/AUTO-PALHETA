import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { databases, DATABASE_ID, COLLECTION_ID } from '../lib/appwrite';
import VehicleCard from '../components/VehicleCard';

export default function Vehicles({ user }) {
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // --- DEFINIÇÃO DO ADMINISTRADOR ---
  // Substitua pelo seu e-mail real cadastrado no Appwrite
  const isAdmin = user?.email === 'seu-email-admin@exemplo.com';

  const [filters, setFilters] = useState({
    type: '',
    transmission: '',
    fuel: ''
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
        setVehicles(response.documents);
      } catch (error) {
        console.error("Erro ao buscar veículos:", error);
      }
    };
    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.brand?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.model?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filters.type === '' || v.vehicleType === filters.type;
    const matchesTrans = filters.transmission === '' || v.Transmission === filters.transmission;
    const matchesFuel = filters.fuel === '' || v.fuel_type === filters.fuel;

    return matchesSearch && matchesType && matchesTrans && matchesFuel;
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Hero Section */}
      <div className="relative h-[350px] w-full rounded-[3rem] overflow-hidden shadow-2xl group border-4 border-white">
        <img 
          src="https://images.unsplash.com/photo-1530268578403-bf6e89800e70?q=80&w=1600&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          alt="" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center p-12">
          <div className="max-w-2xl space-y-4">
            {/* Tag dinâmica de Boas-vindas baseada no Profile */}
            <div className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black text-white uppercase tracking-[0.3em]">
              {isAdmin ? "Acesso administrativo liberado" : `Bem-vindo à frota, ${user?.name || 'Piloto'}`}
            </div>
            
            <h1 className="text-5xl font-black text-white leading-tight tracking-tighter uppercase italic">
              {isAdmin ? "Gestão de Frota" : "Domine a Estrada"} <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">
                {isAdmin ? "Sua Garagem Premium" : "Sob qualquer condição."}
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Barra de Busca e Filtro */}
      <div className="relative space-y-4">
        <div className="flex items-center gap-4 bg-white p-4 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-50">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
            <input 
              type="text" 
              placeholder={isAdmin ? "Buscar na garagem..." : "Qual máquina você procura hoje?"} 
              className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-400 font-bold text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-3 px-8 py-4 rounded-3xl font-black transition-all active:scale-95 shadow-lg ${isFilterOpen ? 'bg-blue-600 text-white' : 'bg-black text-white'}`}
          >
            {isFilterOpen ? <X size={20} /> : <Filter size={20} />}
            FILTRAR
          </button>
        </div>

        {/* Menu de Filtros (Dropdwon) */}
        {isFilterOpen && (
          <div className="absolute z-20 w-full bg-white mt-2 p-6 rounded-[2rem] shadow-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-300">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">Tipo de Veículo</label>
              <select 
                className="w-full p-3 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
              >
                <option value="">Todos os Tipos</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="coupe">Coupe / Sport</option>
                <option value="hatchback">Hatchback</option>
                <option value="truck">Truck</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">Transmissão</label>
              <select 
                className="w-full p-3 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                value={filters.transmission}
                onChange={(e) => setFilters({...filters, transmission: e.target.value})}
              >
                <option value="">Qualquer Câmbio</option>
                <option value="Automatic">Automático</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">Combustível</label>
              <select 
                className="w-full p-3 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                value={filters.fuel}
                onChange={(e) => setFilters({...filters, fuel: e.target.value})}
              >
                <option value="">Todos</option>
                <option value="Gasoline">Gasolina</option>
                <option value="Electric">Elétrico</option>
                <option value="etc">Outros</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Grid de Veículos - IMPORTANTE: Passando isAdmin */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map(vehicle => (
            <VehicleCard 
              key={vehicle.$id} 
              vehicle={vehicle} 
              user={user} 
              isAdmin={isAdmin} // Agora o card sabe se você é o admin!
            />
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold text-xl uppercase tracking-tighter">
              {isAdmin ? "Você ainda não cadastrou veículos." : "Nenhum veículo disponível. :("}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}