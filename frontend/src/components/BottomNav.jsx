import { LayoutDashboard, ShoppingCart, Bell, LogOut, BarChart3, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { account } from '../lib/appwrite';
import { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';

export default function BottomNav({ onOpenAdmin }) {
  const location = useLocation();
  const isAdmin = useAdmin();
  const [cartCount, setCartCount] = useState(0);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
  // Leitura inicial imediata
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  setCartCount(cart.length);
  const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
  setNotifCount(notifs.length);

  const interval = setInterval(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.length);
    const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
    setNotifCount(notifs.length);
  }, 1000);
  return () => clearInterval(interval);
}, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      window.location.href = '/';
    } catch {
      window.location.href = '/';
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-gray-100 shadow-2xl">
      <div className="flex items-center justify-around px-2 py-3">

        <Link to="/dashboard" className={`flex flex-col items-center gap-1 px-3 py-1 rounded-2xl transition-all ${isActive('/dashboard') ? 'text-black' : 'text-gray-400'}`}>
          <LayoutDashboard size={22} strokeWidth={isActive('/dashboard') ? 2.5 : 1.5} />
          <span className="text-[9px] font-black uppercase tracking-wider">Início</span>
        </Link>

        <Link to="/cart" className="relative flex flex-col items-center gap-1 px-3 py-1 rounded-2xl transition-all text-gray-400">
          <ShoppingCart size={22} strokeWidth={isActive('/cart') ? 2.5 : 1.5} className={isActive('/cart') ? 'text-black' : ''} />
          {cartCount > 0 && (
            <span className="absolute -top-1 right-1 bg-blue-600 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
          <span className={`text-[9px] font-black uppercase tracking-wider ${isActive('/cart') ? 'text-black' : ''}`}>Carrinho</span>
        </Link>

        <Link to="/notifications" className="relative flex flex-col items-center gap-1 px-3 py-1 rounded-2xl transition-all text-gray-400">
          <Bell size={22} strokeWidth={isActive('/notifications') ? 2.5 : 1.5} className={isActive('/notifications') ? 'text-black' : ''} />
          {notifCount > 0 && (
            <span className="absolute -top-1 right-1 bg-red-500 w-2 h-2 rounded-full animate-ping" />
          )}
          <span className={`text-[9px] font-black uppercase tracking-wider ${isActive('/notifications') ? 'text-black' : ''}`}>Alertas</span>
        </Link>

        <Link to="/sales-stats" className={`flex flex-col items-center gap-1 px-3 py-1 rounded-2xl transition-all ${isActive('/sales-stats') ? 'text-black' : 'text-gray-400'}`}>
          <BarChart3 size={22} strokeWidth={isActive('/sales-stats') ? 2.5 : 1.5} />
          <span className="text-[9px] font-black uppercase tracking-wider">Vendas</span>
        </Link>

        {isAdmin && (
          <button onClick={onOpenAdmin} className="flex flex-col items-center gap-1 px-3 py-1 rounded-2xl transition-all text-orange-500">
            <ShieldCheck size={22} strokeWidth={1.5} />
            <span className="text-[9px] font-black uppercase tracking-wider">Admin</span>
          </button>
        )}

        <button onClick={handleLogout} className="flex flex-col items-center gap-1 px-3 py-1 rounded-2xl transition-all text-red-400">
          <LogOut size={22} strokeWidth={1.5} />
          <span className="text-[9px] font-black uppercase tracking-wider">Sair</span>
        </button>

      </div>
    </nav>
  );
}