import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Fuel, Calendar, Settings, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);

  const bgUrl = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/vehicles`);
        const found = response.data.find(v => v.$id === id);
        if (found) setVehicle(found);
      } catch (error) {
        console.error("Erro ao carregar detalhes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  const handleRentNow = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const alreadyInCart = cart.find(item => item.$id === vehicle.$id);
    if (!alreadyInCart) {
      cart.push(vehicle);
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    setIsAdded(true);
  };

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
    // CONTAINER DO BACKGROUND
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${bgUrl})` }}
    >
      {/* OVERLAY PARA LEGIBILIDADE (Opcional, mas recomendado) */}
      <div className="min-h-screen w-full bg-white/70 backdrop-blur-md">
        
        <div className="max-w-6xl mx-auto p-4 lg:p-8 animate-in fade-in duration-500">
          {/* Cabeçalho */}
          <div className="flex justify-between items-center mb-10">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-gray-700 hover:text-black transition-all font-bold bg-white/50 px-4 py-2 rounded-full"
            >
              <ArrowLeft size={20} /> <span>Voltar para a frota</span>
            </button>
            
            <div className="flex gap-3">
              <button 
                onClick={handleDelete} 
                className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all shadow-sm"
              >
                <Trash2 size={22} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Lado Esquerdo: Imagem do Veículo */}
            <div className="rounded-[40px] overflow-hidden bg-gray-100 shadow-2xl h-[300px] lg:h-[500px] relative border-4 border-white">
              <img 
                src={vehicle.image_url} 
                alt={`${vehicle.brand} ${vehicle.model}`} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = bgUrl; 
                }}
              />
            </div>

            {/* Lado Direito: Informações */}
            <div className="flex flex-col">
              <div className="mb-8">
                <span className="text-blue-700 font-black tracking-[0.2em] uppercase text-xs mb-3 block">
                  {vehicle.brand || "Premium Car"}
                </span>
                <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-none tracking-tighter">
                  {vehicle.model}
                </h1>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-10">
                {/* Cards de Info (mantendo sua estrutura) */}
                {[
                  { icon: <Calendar size={22}/>, label: "Ano", value: vehicle.year, color: "bg-blue-100 text-blue-600" },
                  { icon: <Fuel size={22}/>, label: "Combustível", value: vehicle.fuel_type, color: "bg-orange-100 text-orange-600" },
                  { icon: <Settings size={22}/>, label: "Transmissão", value: vehicle.Transmission || "Automatic", color: "bg-purple-100 text-purple-600" },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/80 p-6 rounded-[32px] flex items-center gap-4 border border-white shadow-sm">
                    <div className={`${item.color} p-3 rounded-2xl`}>{item.icon}</div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-black">{item.label}</p>
                      <p className="font-bold text-gray-900 text-lg capitalize">{item.value}</p>
                    </div>
                  </div>
                ))}
                
                <div className="bg-white/80 p-6 rounded-[32px] flex items-center gap-4 border border-white shadow-sm">
                  <div className="bg-gray-200 p-3 rounded-2xl text-gray-700 font-bold text-xs">VIN</div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-black">Chassi</p>
                    <p className="font-bold text-gray-900 text-sm truncate w-24 lg:w-full">{vehicle.vin || "---"}</p>
                  </div>
                </div>
              </div>

              {/* Botão / Carrinho */}
              <div className="bg-zinc-900 p-8 lg:p-10 rounded-[48px] text-white flex flex-col gap-6 shadow-2xl relative overflow-hidden">
                {!isAdded ? (
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div>
                      <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest mb-1">Taxa Diária</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl lg:text-5xl font-black">R$ {vehicle.price_per_hour}</span>
                        <span className="text-zinc-500 font-bold">/hora</span>
                      </div>
                    </div>
                    <button 
                      onClick={handleRentNow}
                      className="w-full sm:w-auto bg-white text-black px-10 py-5 rounded-[24px] font-black uppercase tracking-tighter hover:bg-zinc-200 transition-all active:scale-95 shadow-lg"
                    >
                      Alugar Agora
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center py-4 animate-in zoom-in duration-300">
                    <CheckCircle2 size={48} className="text-green-400 mb-4" />
                    <h3 className="text-2xl font-black mb-2">Adicionado ao Carrinho!</h3>
                    <p className="text-zinc-400 text-sm mb-6">O {vehicle.model} está pronto.</p>
                    
                    <div className="bg-zinc-800 p-4 rounded-2xl w-full mb-6 text-left border border-zinc-700">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" className="mt-1 h-4 w-4 accent-blue-500" defaultChecked />
                        <span className="text-xs text-zinc-300 leading-tight">
                          Eu aceito todos os termos de uso e condições.
                        </span>
                      </label>
                    </div>

                    <button 
                      onClick={() => navigate('/dashboard')}
                      className="text-white border border-zinc-700 px-6 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-all"
                    >
                      Finalizar e Voltar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}