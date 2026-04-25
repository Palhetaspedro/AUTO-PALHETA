import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Fuel, Calendar, Settings, CheckCircle2, Box, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAdmin } from '../../hooks/useAdmin';

export default function VehicleDetail({ user }) {
  const { id } = useParams();
  const isAdmin = useAdmin();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "https://palheta--auto-ultimatebackend--jyc2t58tq8fd.code.run";
  const bgUrl = "https://images.unsplash.com/photo-1518306727298-4c17e1bf6942?q=80&w=736&auto=format&fit=crop";

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/vehicles`);
        const found = response.data.find(v => String(v.$id || v.id) === String(id));
        if (found) setVehicle(found);
        else console.error("Veículo não encontrado na lista");
      } catch (error) {
        console.error("Erro ao carregar detalhes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id, API_URL]);

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir este veículo?")) return;
    setDeleting(true);
    try {
      await axios.delete(`${API_URL}/api/vehicles/${id}`);
      alert("Veículo removido com sucesso.");
      navigate('/dashboard');
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Erro ao remover veículo.");
    } finally {
      setDeleting(false);
    }
  };

  const handleRentNow = async () => {
    if (!vehicle || vehicle.stock <= 0) return;
    try {
      const saleData = {
        vehicleId: vehicle.$id || vehicle.id,
        model: vehicle.model,
        brand: vehicle.brand,
        price: Number(vehicle.price_per_hour),
        rentalDate: new Date().toISOString()
      };
      await axios.post(`${API_URL}/api/sales`, saleData);

      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart.push({
        id: vehicle.$id || vehicle.id,
        model: vehicle.model,
        brand: vehicle.brand,
        price: Number(vehicle.price_per_hour),
        image_url: vehicle.image_url
      });
      localStorage.setItem('cart', JSON.stringify(cart));

      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifications.unshift({
        id: Date.now(),
        text: `🚗 ${vehicle.brand} ${vehicle.model} adicionado ao carrinho`,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      });
      localStorage.setItem('notifications', JSON.stringify(notifications.slice(0, 20)));

      setIsAdded(true);
    } catch (error) {
      console.error("Erro ao processar aluguel:", error);
      alert("Erro ao processar o aluguel. Tente novamente.");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center font-bold text-gray-500 animate-pulse uppercase tracking-widest text-sm">
      Carregando...
    </div>
  );

  if (!vehicle) return (
    <div className="flex h-screen items-center justify-center flex-col gap-4">
      <p className="text-xl font-bold">Veículo não encontrado.</p>
      <button onClick={() => navigate('/dashboard')} className="text-blue-600 underline font-black uppercase text-xs">Voltar</button>
    </div>
  );

  const fuelLabel = () => {
    const fuel = vehicle.fuel_type?.toLowerCase();
    if (fuel === 'etc') return 'Híbrido';
    if (fuel === 'electric') return 'Elétrico';
    if (fuel === 'gasoline') return 'Gasolina';
    return vehicle.fuel_type;
  };

  const transLabel = () => {
    const trans = vehicle.Transmission?.toLowerCase();
    if (trans === 'automatic') return 'Automático';
    if (trans === 'manual') return 'Manual';
    return vehicle.Transmission || 'Não inf.';
  };

  return (
    <div className="w-full" style={{ background: 'rgba(255,255,255,0.85)' }}>
  <div className="w-full pb-32 md:pb-0">
        <div className="max-w-6xl mx-auto p-4 lg:p-8">

          <div className="flex justify-between items-center mb-6">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-700 font-bold bg-white/50 px-4 py-2 rounded-full border border-white/50 shadow-sm text-sm">
              <ArrowLeft size={18} /> <span className="uppercase text-xs tracking-tighter">Voltar</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-start">

            {/* IMAGEM */}
            <div className="rounded-[32px] overflow-hidden bg-gray-100 shadow-2xl h-[220px] md:h-[400px] lg:h-[500px] relative border-4 border-white group">
              <img
                src={vehicle.image_url}
                alt={vehicle.model}
                className={`w-full h-full object-cover transition-all duration-700 ${vehicle.stock <= 0 ? 'grayscale opacity-50' : 'opacity-100'}`}
              />
              {isAdmin && (
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="absolute top-4 right-4 p-3 bg-white/80 hover:bg-red-500 hover:text-white backdrop-blur-md text-red-500 rounded-2xl shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100"
                >
                  {deleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                </button>
              )}
            </div>

            <div className="flex flex-col">
              {/* NOME */}
              <div className="mb-6">
                <h2 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase bg-gradient-to-r from-gray-700 to-purple-400 bg-clip-text text-transparent">
                  {vehicle.brand}
                </h2>
                <h1 className="text-3xl lg:text-5xl font-black text-gray-900 leading-none tracking-tighter">
                  {vehicle.model}
                </h1>
              </div>

              {/* GRID DE INFORMAÇÕES */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white/80 p-4 rounded-[24px] flex items-center gap-3 border border-white shadow-sm">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-xl shrink-0"><Calendar size={18} /></div>
                  <div className="min-w-0">
                    <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Ano</p>
                    <p className="font-bold text-base">{vehicle.year}</p>
                  </div>
                </div>

                <div className="bg-white/80 p-4 rounded-[24px] flex items-center gap-3 border border-white shadow-sm">
                  <div className="bg-orange-100 text-orange-600 p-2 rounded-xl shrink-0"><Fuel size={18} /></div>
                  <div className="min-w-0">
                    <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Combustível</p>
                    <p className="font-bold text-sm leading-tight">{fuelLabel()}</p>
                  </div>
                </div>

                <div className="bg-white/80 p-4 rounded-[24px] flex items-center gap-3 border border-white shadow-sm">
                  <div className="bg-purple-100 text-purple-600 p-2 rounded-xl shrink-0"><Settings size={18} /></div>
                  <div className="min-w-0">
                    <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Transmissão</p>
                    <p className="font-bold text-sm leading-tight">{transLabel()}</p>
                  </div>
                </div>

                <div className="bg-white/80 p-4 rounded-[24px] flex items-center gap-3 border border-white shadow-sm">
                  <div className="bg-green-100 text-green-600 p-2 rounded-xl shrink-0"><Box size={18} /></div>
                  <div className="min-w-0">
                    <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Em Estoque</p>
                    <p className="font-bold text-base">{vehicle.stock} un.</p>
                  </div>
                </div>
              </div>

              {/* PREÇO E BOTÃO */}
              <div className="bg-zinc-900 p-6 lg:p-10 rounded-[36px] text-white shadow-2xl mb-6">
                {!isAdded ? (
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Preço Total</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl lg:text-5xl font-black">U$ {Number(vehicle.price_per_hour).toLocaleString('en-US')}</span>
                        <span className="text-zinc-500 font-bold">/h</span>
                      </div>
                    </div>
                    <button
                      onClick={handleRentNow}
                      disabled={vehicle.stock <= 0}
                      className={`w-full py-4 rounded-[20px] font-black uppercase tracking-tighter transition-all text-sm ${vehicle.stock > 0 ? "bg-white text-black hover:bg-zinc-200" : "bg-zinc-800 text-zinc-600 pointer-events-none"}`}
                    >
                      {vehicle.stock > 0 ? "Alugar Agora" : "Esgotado"}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center py-4">
                    <CheckCircle2 size={40} className="text-green-400 mb-3" />
                    <h3 className="text-xl font-black italic">SOLICITAÇÃO ENVIADA!</h3>
                    <button onClick={() => navigate('/dashboard')} className="mt-4 bg-white text-black px-10 py-3 rounded-2xl font-black uppercase tracking-tighter text-sm">
                      Voltar para a Vitrine
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