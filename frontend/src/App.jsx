import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { account } from './lib/appwrite';

// Componentes
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// PÁGINAS (Certifique-se que TODOS esses arquivos existem em src/pages/)
import Login from './pages/Login';
import Vehicles from './pages/Vehicles';
import VehicleDetail from './pages/VehicleDetail';
import AdminPanel from './components/AdminPanel'; // <-- O VITE ESTÁ RECLAMANDO DESTE AQUI
import Notifications from './pages/Notifications';
import Chat from './pages/Chat';
import License from './pages/License';
import Support from './pages/Support';

export default function App() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verifica se há um usuário logado ao carregar o app
  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const session = await account.get();
      setUser(session);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // Define que a página de Login é a raiz "/"
  const isLoginPage = location.pathname === '/';

  if (loading) return <div className="h-screen flex items-center justify-center">Carregando...</div>;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar e Header só aparecem se logado e NÃO for página de login */}
      {user && !isLoginPage && <Sidebar />}

      <div className="flex-1 flex flex-col overflow-hidden">
        {user && !isLoginPage && <Header />}

        <main className={`flex-1 overflow-x-hidden overflow-y-auto ${!isLoginPage ? 'p-8' : ''}`}>
          <div className={`${!isLoginPage ? 'max-w-7xl mx-auto min-h-full flex flex-col' : 'h-full'}`}>
            <div className="flex-1">
              <Routes>
                {/* Rota Pública */}
                <Route path="/" element={!user ? <Login /> : <Navigate to="/dashboard" />} />

                {/* Rotas Protegidas (Só acessa se 'user' existir) */}
                <Route path="/dashboard" element={user ? <Vehicles /> : <Navigate to="/" />} />
                <Route path="/vehicle/:id" element={user ? <VehicleDetail /> : <Navigate to="/" />} />
                
                {/* Rota Admin (Proteção Dupla: Logado + Label Admin) */}
                <Route 
                  path="/admin" 
                  element={user?.labels?.includes('admin') ? <AdminPanel /> : <Navigate to="/dashboard" />} 
                />

                <Route path="/notifications" element={user ? <Notifications /> : <Navigate to="/" />} />
                <Route path="/chat" element={user ? <Chat /> : <Navigate to="/" />} />
                <Route path="/license" element={user ? <License /> : <Navigate to="/" />} />
                <Route path="/support" element={user ? <Support /> : <Navigate to="/" />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
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