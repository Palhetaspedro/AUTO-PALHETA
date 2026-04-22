import { Search, MapPin, Clock, Bell, User, CheckCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header({ user }) {
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [searchValue, setSearchValue] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const notifications = [
    { id: 1, text: "Bem-vindo ao painel de controle.", time: "Agora" },
    { id: 2, text: "Sua sessão expira em 24h.", time: "1h atrás" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-2 rounded-2xl border border-gray-200/50">
          <MapPin size={16} className="text-blue-600" />
          <span className="text-[13px] font-black text-black italic">BRASÍLIA, DF</span>
        </div>
      </div>

      <div className="hidden md:flex items-center relative w-full max-w-md mx-8 group">
        <div className="relative flex items-center w-full px-4 py-2.5 rounded-2xl border border-gray-200 bg-white focus-within:border-black transition-all shadow-inner">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Pesquisar máquina..." 
            className="bg-transparent border-none outline-none ml-3 text-[13px] font-bold w-full focus:ring-0"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notificações */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2.5 rounded-xl transition-all ${showNotifications ? 'bg-black text-white' : 'bg-gray-50 text-gray-400'}`}
          >
            <Bell size={20} />
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-5 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-xs uppercase tracking-widest text-gray-400">Notificações</h3>
                <CheckCheck size={16} className="text-blue-500" />
              </div>
              <div className="space-y-2">
                {notifications.map(n => (
                  <div key={n.id} className="p-3 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors cursor-pointer">
                    <p className="text-xs font-bold text-gray-800">{n.text}</p>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Perfil - Rota corrigida para /profile */}
        <div 
          onClick={() => navigate('/profile')} 
          className="flex items-center gap-4 pl-4 border-l border-gray-100 cursor-pointer group active:scale-95 transition-all"
        >
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-black text-black uppercase leading-none tracking-tighter group-hover:text-blue-600 transition-colors">
              {user?.name || 'Gestor Master'}
            </p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1 bg-gray-50 px-2 py-0.5 rounded-md">
              Configurações
            </p>
          </div>
          <div className="h-11 w-11 bg-gradient-to-br from-black via-gray-800 to-black rounded-2xl flex items-center justify-center text-white shadow-lg border-2 border-white ring-1 ring-gray-100">
            <User size={22} strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </header>
  );
}