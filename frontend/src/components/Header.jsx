import { Search, MapPin, Clock, Bell, User } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
      {/* Lado Esquerdo: Localização e Hora */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
          <MapPin size={18} className="text-black" />
          <span className="text-sm font-bold text-black">Brasília, DF</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Clock size={18} />
          <span className="text-sm font-medium">{time}</span>
        </div>
      </div>

      {/* Centro: Barra de Busca (Opcional no Header) */}
      <div className="hidden md:flex items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2 w-96">
        <Search size={18} className="text-gray-400" />
        <input type="text" placeholder="Search for anything..." className="bg-transparent border-none outline-none ml-3 text-sm w-full" />
      </div>

      {/* Lado Direito: Ações */}
      <div className="flex items-center gap-4">
        <button className="p-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-black hover:text-white transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-10 w-10 bg-black rounded-xl flex items-center justify-center text-white font-bold cursor-pointer overflow-hidden">
          <User size={20} />
        </div>
      </div>
    </header>
  );
}