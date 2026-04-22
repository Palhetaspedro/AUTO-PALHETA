import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Trash2, Fuel, Calendar, DollarSign, Settings } from 'lucide-react';
import axios from 'axios';

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        // Buscamos a lista completa
        const response = await axios.get(`http://localhost:3001/api/vehicles`);
        
        // No Appwrite, o ID do documento vem como $id
        const found = response.data.find(v => v.$id === id);
        
        if (found) {
          setVehicle(found);
        }
      } catch (error) {
        console.error("Erro ao carregar detalhes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Deseja realmente excluir este veículo?")) {
      try {
        await axios.delete(`http://localhost:3001/api/vehicles/${id}`);
        alert("Veículo removido!");
        navigate('/dashboard');
      } catch (error) {
        alert("Erro ao excluir veículo.");
      }
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center font-bold text-gray-500 animate-pulse">
      Carregando detalhes do veículo...
    </div>
  );

  if (!vehicle) return (
    <div className="flex h-screen items-center justify-center flex-col gap-4">
      <p className="text-xl font-bold">Veículo não encontrado.</p>
      <button onClick={() => navigate('/dashboard')} className="text-blue-600 underline">Voltar para o Dashboard</button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 animate-in fade-in duration-500">
      {/* Cabeçalho de navegação */}
      <div className="flex justify-between items-center mb-10">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-black transition-all font-medium"
        >
          <ArrowLeft size={20} /> <span>Voltar para a frota</span>
        </button>
        
        <div className="flex gap-3">
          <button 
            onClick={handleDelete} 
            className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all shadow-sm"
            title="Excluir Veículo"
          >
            <Trash2 size={22} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Lado Esquerdo: Imagem com Fallback */}
        <div className="rounded-[40px] overflow-hidden bg-gray-100 shadow-2xl h-[300px] lg:h-[500px] relative border-4 border-white">
          <img 
            src={vehicle.image_url} 
            alt={`${vehicle.brand} ${vehicle.model}`} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"; // Imagem de Porsche padrão caso o link quebre
            }}
          />
        </div>

        {/* Lado Direito: Informações */}
        <div className="flex flex-col">
          <div className="mb-8">
            <span className="text-blue-600 font-black tracking-[0.2em] uppercase text-xs mb-3 block">
              {vehicle.brand || "Premium Car"}
            </span>
            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-none tracking-tighter">
              {vehicle.model}
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-gray-50 p-6 rounded-[32px] flex items-center gap-4 transition-hover hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100">
              <div className="bg-blue-100 p-3 rounded-2xl text-blue-600"><Calendar size={22}/></div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-black">Ano</p>
                <p className="font-bold text-gray-900 text-lg">{vehicle.year}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-[32px] flex items-center gap-4 transition-hover hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100">
              <div className="bg-orange-100 p-3 rounded-2xl text-orange-600"><Fuel size={22}/></div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-black">Combustível</p>
                <p className="font-bold text-gray-900 text-lg capitalize">{vehicle.fuel_type}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-[32px] flex items-center gap-4 transition-hover hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100">
              <div className="bg-purple-100 p-3 rounded-2xl text-purple-600"><Settings size={22}/></div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-black">Transmissão</p>
                <p className="font-bold text-gray-900 text-lg">{vehicle.Transmission || "Automatic"}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-[32px] flex items-center gap-4 transition-hover hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100">
              <div className="bg-gray-200 p-3 rounded-2xl text-gray-700 font-bold text-xs">VIN</div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-black">Chassi</p>
                <p className="font-bold text-gray-900 text-sm truncate w-24 lg:w-full">{vehicle.vin || "---"}</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 p-8 lg:p-10 rounded-[48px] text-white flex flex-col sm:flex-row justify-between items-center gap-6 shadow-xl">
            <div>
              <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest mb-1">Taxa Diária</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl lg:text-5xl font-black">R$ {vehicle.price_per_hour}</span>
                <span className="text-zinc-500 font-bold">/hora</span>
              </div>
            </div>
            <button className="w-full sm:w-auto bg-white text-black px-10 py-5 rounded-[24px] font-black uppercase tracking-tighter hover:bg-zinc-200 transition-all active:scale-95 shadow-lg">
              Alugar Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}