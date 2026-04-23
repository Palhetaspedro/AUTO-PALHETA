import { MapPin, Clock, User, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header({ user }) {
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full px-8 py-4 flex items-center justify-between 
      /* Background com Gradiente Vivo e Glassmorphism */
      bg-gradient-to-r from-blue-600/10 via-white/80 to-purple-600/10 
      backdrop-blur-xl border-b border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)]
      overflow-hidden">
      
      {/* Efeito de brilho animado no fundo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))] pointer-events-none" />

      {/* Lado Esquerdo: Localização com Badge Minimalista */}
      <div className="flex items-center gap-6 relative z-10">
        <div className="group flex items-center gap-2 bg-black text-white px-4 py-2 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 cursor-default">
          <MapPin size={16} className="text-blue-400 animate-pulse" />
          <span className="text-[12px] font-black tracking-widest italic">BRASÍLIA • DF</span>
        </div>
      </div>

      {/* CENTRO: Elemento Chamativo  */}
      <div className="hidden md:flex items-center gap-3 bg-white/40 px-5 py-2 rounded-full border border-white/50 shadow-sm backdrop-blur-sm relative z-10">
        <Sparkles size={16} className="text-yellow-500" />
        <p className="text-[11px] font-bold text-gray-700 uppercase tracking-[0.2em]">
          Frota <span className="text-black font-black">Premium</span> Disponível
        </p>
        <div className="flex gap-1 ml-2">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" />
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]" />
        </div>
      </div>

      {/* Lado Direito: Perfil e Relógio */}
      <div className="flex items-center gap-6 relative z-10">
        <div className="hidden lg:flex flex-col items-end border-r border-gray-200 pr-6">
          <div className="flex items-center gap-2 text-black">
            <Clock size={14} strokeWidth={3} />
            <span className="text-[13px] font-black tabular-nums">{time}</span>
          </div>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Status: Online</span>
        </div>

        <div 
          onClick={() => navigate('/profile')} 
          className="flex items-center gap-4 cursor-pointer group transition-all active:scale-95"
        >
          <div className="text-right hidden sm:block">
            <p className="text-[12px] font-black text-black uppercase leading-none tracking-tighter group-hover:text-blue-600 transition-colors">
              {user?.name || 'Gestor Master'}
            </p>
            <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-1">
              Perfil Premium
            </p>
          </div>
          
          {/* Avatar com Gradiente e Borda Pulsante */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl blur-sm opacity-20 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-12 w-12 bg-gradient-to-br from-gray-900 to-black rounded-2xl flex items-center justify-center text-white shadow-xl border-2 border-white transition-transform group-hover:-translate-y-1">
              <User size={24} strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}