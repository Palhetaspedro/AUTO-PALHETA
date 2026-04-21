import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { account } from './lib/appwrite';

// Componentes
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// PÁGINAS
import Login from './pages/Login';
import Vehicles from './pages/Vehicles';
import VehicleDetail from './pages/VehicleDetail';
import AdminPanel from './components/AdminPanel'; 
import Notifications from './pages/Notifications';
import Chat from './pages/Chat';
import License from './pages/License';
import Support from './pages/Support';

export default function App() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
  try {
    const session = await account.get();
    setUser(session);
  } catch (error) {
    setUser(null);
    // Só redirecione se você NÃO estiver na página raiz "/"
    if (window.location.pathname !== '/') {
       console.log("Usuário não autenticado");
    }
  } finally {
    // Dê um pequeno fôlego para o React processar o estado
    setTimeout(() => setLoading(false), 300);
  }
}
  // Verifica se estamos na tela de login
  const isLoginPage = location.pathname === '/';

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-white">
        <div className="animate-pulse font-black text-2xl tracking-tighter">AUTO ULTIMATE...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Só mostra Sidebar se houver usuário e não estiver no Login */}
      {user && !isLoginPage && <Sidebar />}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Só mostra Header se houver usuário e não estiver no Login */}
        {user && !isLoginPage && <Header user={user} />}

        <main className={`flex-1 overflow-x-hidden overflow-y-auto ${!isLoginPage ? 'p-8' : ''}`}>
          <div className={`${!isLoginPage ? 'max-w-7xl mx-auto min-h-full flex flex-col' : 'h-full'}`}>
            <div className="flex-1">
              <Routes>
                {/* Rota Raiz: Se logado vai pro dashboard, se não vai pro login */}
                <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />

                {/* Rotas Protegidas */}
                <Route path="/dashboard" element={user ? <Vehicles /> : <Navigate to="/" replace />} />
                <Route path="/vehicle/:id" element={user ? <VehicleDetail /> : <Navigate to="/" replace />} />
                
                {/* Rota Admin: Removi a trava de 'labels' temporariamente para você conseguir testar se o painel abre */}
                <Route 
                  path="/admin" 
                  element={user ? <AdminPanel /> : <Navigate to="/" replace />} 
                />

                <Route path="/notifications" element={user ? <Notifications /> : <Navigate to="/" replace />} />
                <Route path="/chat" element={user ? <Chat /> : <Navigate to="/" replace />} />
                <Route path="/license" element={user ? <License /> : <Navigate to="/" replace />} />
                <Route path="/support" element={user ? <Support /> : <Navigate to="/" replace />} />

                {/* Fallback para evitar loops */}
                <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
              </Routes>
            </div>

            {user && !isLoginPage && (
              <div className="mt-8">
                <Footer />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}