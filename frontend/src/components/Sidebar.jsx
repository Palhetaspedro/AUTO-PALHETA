import { Car, Bell, MessageSquare, FileText, LifeBuoy, LogOut, Heart, Clock, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-white h-screen flex flex-col border-r border-gray-100 shadow-sm font-sans">
      
      {/* Logo com Animação */}
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="relative flex items-center justify-center w-12 h-12 bg-black rounded-xl shadow-lg shrink-0">
          <Car className="w-7 h-7 text-white" strokeWidth={1.5} />
          
          {/* Rodas */}
          <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border-2 border-black animate-wheel-spin">
            <div className="absolute w-full h-0.5 bg-black rotate-45"></div>
            <div className="absolute w-full h-0.5 bg-black -rotate-45"></div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border-2 border-black animate-wheel-spin">
            <div className="absolute w-full h-0.5 bg-black rotate-45"></div>
            <div className="absolute w-full h-0.5 bg-black -rotate-45"></div>
          </div>
        </div>
        
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] leading-tight">AUTO</span>
          <span className="text-lg font-black text-black leading-tight tracking-tight">ULTIMATE</span>
        </div>
      </div>

      {/* Navegação Principal */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <SidebarLink icon={LayoutDashboard} label="Home" to="/" active={isActive('/') || isActive('/vehicles')} />
        <SidebarLink icon={Heart} label="Favourites" to="/favourites" active={isActive('/favourites')} />
        <SidebarLink icon={Clock} label="Recents" to="/recents" active={isActive('/recents')} />
      </nav>

      {/* Ações Inferiores */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <SidebarLink icon={Bell} label="Notifications" to="/notifications" iconColor="text-blue-500" active={isActive('/notifications')} />
        <SidebarLink icon={MessageSquare} label="Chat" to="/chat" iconColor="text-green-500" active={isActive('/chat')} />
        <SidebarLink icon={FileText} label="License" to="/license" iconColor="text-purple-500" active={isActive('/license')} />
        <SidebarLink icon={LifeBuoy} label="Support" to="/support" iconColor="text-orange-500" active={isActive('/support')} />
        
        <Link to="/logout" className="group flex items-center gap-3.5 px-4 py-3 mt-4 rounded-xl text-sm font-medium transition-all duration-200 text-red-600 hover:bg-red-50">
          <LogOut className="w-5 h-5 transition-colors group-hover:text-red-700" strokeWidth={1.5} />
          Logout
        </Link>
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