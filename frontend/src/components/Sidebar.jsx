import { Car, Bell, MessageSquare, FileText, LifeBuoy, LogOut, Heart, Clock, LayoutDashboard, ShieldCheck, ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { account } from '../lib/appwrite';
import { useState, useEffect } from 'react';

// IMPORTANTE: Adicione a prop onOpenAdmin aqui
export default function Sidebar({ onOpenAdmin }) {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.length);
  };

  useEffect(() => {
    updateCartCount();
    const interval = setInterval(updateCartCount, 1000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      window.location.href = '/'; 
    } catch (error) {
      console.error("Erro ao sair:", error);
      window.location.href = '/';
    }
  };

  return (
    <aside className="w-64 bg-white h-screen flex flex-col border-r border-gray-100 shadow-sm font-sans sticky top-0 z-40">
      
      {/* Logo */}
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="relative flex items-center justify-center w-12 h-12 bg-black rounded-xl shadow-lg shrink-0">
          <Car className="w-7 h-7 text-white" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] leading-tight">AUTO</span>
          <span className="text-lg font-black text-black leading-tight tracking-tight">ULTIMATE</span>
        </div>
      </div>

      {/* Navegação Principal */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <SidebarLink icon={LayoutDashboard} label="Dashboard" to="/dashboard" active={isActive('/dashboard')} />
        
        <div className="relative">
          <SidebarLink icon={ShoppingCart} label="Meu Carrinho" to="/cart" active={isActive('/cart')} iconColor="text-blue-600" />
          {cartCount > 0 && (
            <span className="absolute right-3 top-3 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </div>

        {/* CORREÇÃO: Painel Admin como botão para abrir o Modal */}
        <button 
          onClick={onOpenAdmin}
          className="w-full group flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-gray-600 hover:bg-gray-100 hover:text-black focus:outline-none"
        >
          <ShieldCheck className="w-5 h-5 text-orange-600 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
          <span className="font-bold">Painel Admin</span>
        </button>

        <SidebarLink icon={Heart} label="Favoritos" to="/favourites" active={isActive('/favourites')} iconColor="text-red-500" />
        <SidebarLink icon={Clock} label="Recentes" to="/recents" active={isActive('/recents')} />
      </nav>

      {/* Ações Inferiores */}
      <div className="p-4 border-t border-gray-100 space-y-1">
        <SidebarLink icon={Bell} label="Notificações" to="/notifications" iconColor="text-blue-500" active={isActive('/notifications')} />
        <SidebarLink icon={LifeBuoy} label="Suporte" to="/support" iconColor="text-orange-500" active={isActive('/support')} />
        
        <button 
          onClick={handleLogout}
          className="w-full group flex items-center gap-3.5 px-4 py-3 mt-4 rounded-xl text-sm font-bold transition-all duration-200 text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" strokeWidth={2} />
          Sair
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({ icon: Icon, label, to, active, iconColor = "text-gray-400" }) {
  return (
    <Link
      to={to}
      className={`group flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 
        ${active 
          ? 'bg-black text-white shadow-md' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-black'
        }`}
    >
      <Icon className={`w-5 h-5 transition-colors ${active ? 'text-white' : `${iconColor} group-hover:text-black`}`} strokeWidth={active ? 2 : 1.5} />
      {label}
    </Link>
  );
}