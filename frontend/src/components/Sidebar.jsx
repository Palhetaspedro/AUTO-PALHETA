import { Car, LogOut, Clock, LayoutDashboard, ShieldCheck, ShoppingCart, Bell, BarChart3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { account, client } from '../lib/appwrite';
import { useState, useEffect, useRef } from 'react';

export default function Sidebar({ onOpenAdmin }) {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', text: "Sistema Online", time: "Agora" }
  ]);
  const notificationRef = useRef(null);

  useEffect(() => {
    const unsubscribe = client.subscribe(
      'databases.SEU_DATABASE_ID.collections.SUA_COLLECTION_VEICULOS_ID.documents', 
      response => {
        let newNotify = null;
        const timestamp = "Agora";

        if (response.events.includes('databases.*.collections.*.documents.*.create')) {
          newNotify = { id: Date.now(), text: `🚀 Novo veículo: ${response.payload.brand} ${response.payload.model}`, time: timestamp };
        } else if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
          newNotify = { id: Date.now(), text: "🗑️ Um veículo foi removido da frota", time: timestamp };
        } else if (response.events.includes('databases.*.collections.*.documents.*.update')) {
          newNotify = { id: Date.now(), text: `🔄 Atualização: ${response.payload.model}`, time: timestamp };
        }

        if (newNotify) {
          setNotifications(prev => [newNotify, ...prev].slice(0, 5));
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.length);
  };

  useEffect(() => {
    updateCartCount();
    const interval = setInterval(updateCartCount, 1000);
    
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      window.location.href = '/'; 
    } catch (error) {
      window.location.href = '/';
    }
  };

  return (
    <aside className="w-64 h-screen flex flex-col border-r border-white/20 shadow-xl font-sans sticky top-0 z-40
      bg-gradient-to-b from-blue-600/10 via-white/80 to-purple-600/10 backdrop-blur-xl">
      
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(120,119,198,0.05),transparent)] pointer-events-none rounded-r-[2rem]" />

      <div className="p-6 border-b border-gray-100/50 flex items-center gap-3 relative z-10">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative flex items-center justify-center w-12 h-12 bg-black rounded-xl shadow-lg shrink-0">
            <Car className="w-7 h-7 text-white" strokeWidth={1.5} />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-black-700 tracking-[0.3em] leading-tight">AUTO</span>
          <span className="text-lg font-black text-black leading-tight tracking-tighter">ULTIMATE</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto relative z-10 scrollbar-hide">
        <SidebarLink icon={LayoutDashboard} label="Dashboard" to="/dashboard" active={isActive('/dashboard')} />
        
        <div className="relative">
          <SidebarLink icon={ShoppingCart} label="Meu Carrinho" to="/cart" active={isActive('/cart')} iconColor="text-blue-600" />
          {cartCount > 0 && (
            <span className="absolute right-3 top-3 bg-blue-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg border-2 border-white animate-pulse">
              {cartCount}
            </span>
          )}
        </div>

        <button 
          onClick={onOpenAdmin}
          className="w-full group flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 text-gray-600 hover:bg-white hover:shadow-md hover:text-orange-600 focus:outline-none border border-transparent hover:border-gray-100"
        >
          <ShieldCheck className="w-5 h-5 text-orange-600 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
          <span>Painel Admin</span>
        </button>

        <SidebarLink 
          icon={BarChart3} 
          label="Graficos de Vendas" 
          to="/sales-stats" 
          active={isActive('/sales-stats')} 
          iconColor="text-purple-600"
        />

        <SidebarLink icon={Clock} label="Recentes" to="/recents" active={isActive('/recents')} />
      </nav>

      <div className="p-4 border-t border-gray-100/50 space-y-1 relative z-20" ref={notificationRef}>
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className={`w-full group flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative border ${
            showNotifications 
            ? 'bg-black text-white shadow-xl border-black scale-[1.02]' 
            : 'text-gray-600 hover:bg-white hover:shadow-md border-transparent hover:border-gray-100'
          }`}
        >
          <Bell className={`w-5 h-5 ${showNotifications ? 'text-white' : 'text-blue-600'}`} strokeWidth={1.5} />
          <span>Notificações</span>
          {!showNotifications && notifications.length > 1 && <span className="absolute right-4 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-ping"></span>}
          
          {showNotifications && (
            <div className="absolute left-[102%] bottom-0 w-72 bg-white/95 backdrop-blur-2xl border border-white shadow-2xl rounded-[2rem] p-5 animate-in slide-in-from-left-4 fade-in duration-300 origin-left z-50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Recentes</h4>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              </div>
              <div className="space-y-3">
                {notifications.map(n => (
                  <div key={n.id} className="text-left p-3 rounded-2xl bg-gray-50/50 border border-transparent hover:border-blue-100 transition-colors">
                    <p className="text-xs font-bold text-gray-800 leading-tight">{n.text}</p>
                    <span className="text-[9px] font-black text-blue-600/50 uppercase mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </button>
        
        <button 
          onClick={handleLogout}
          className="w-full group flex items-center gap-3.5 px-4 py-3 mt-4 rounded-xl text-sm font-black transition-all duration-300 text-red-500 hover:bg-red-50 hover:shadow-inner border border-transparent hover:border-red-100"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
          Logout
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({ icon: Icon, label, to, active, iconColor = "text-gray-400" }) {
  return (
    <Link
      to={to}
      className={`group flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 border
        ${active 
          ? 'bg-black text-white shadow-2xl border-black scale-[1.02]' 
          : 'text-gray-600 hover:bg-white hover:shadow-md border-transparent hover:border-gray-100 hover:text-black'
        }`}
    >
      <Icon className={`w-5 h-5 transition-colors ${active ? 'text-white' : `${iconColor} group-hover:scale-110 transition-transform`}`} strokeWidth={active ? 2 : 1.5} />
      {label}
    </Link>
  );
}