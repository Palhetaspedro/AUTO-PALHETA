import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { account } from './lib/appwrite';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import AddVehicleModal from './components/AddVehicleModal'; 
import BottomNav from './components/BottomNav'; // NOVO

import Login from './pages/Login';
import Vehicles from './pages/Vehicles';
import VehicleDetail from './pages/VehicleDetail';
import Notifications from './pages/Notifications';
import Chat from './pages/Chat';
import License from './pages/License';
import Favourites from './pages/Favourites'; 
import Recents from './pages/Recents';
import Cart from './pages/Cart';
import Profile from './pages/Profile'; 
import SalesStats from './pages/SalesStats';

export default function App() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { checkUser(); }, []);

  async function checkUser() {
    try {
      const session = await account.get();
      setUser(session);
    } catch (error) {
      setUser(null);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  }

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
      {/* Sidebar — só no desktop */}
      {user && !isLoginPage && (
        <div className="hidden md:flex">
          <Sidebar onOpenAdmin={() => setIsModalOpen(true)} />
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {user && !isLoginPage && <Header user={user} />}

        <main className={`flex-1 overflow-x-hidden overflow-y-auto ${!isLoginPage ? 'p-4 md:p-8' : ''} ${user && !isLoginPage ? 'pb-24 md:pb-8' : ''}`}>
          <div className={`${!isLoginPage ? 'max-w-7xl mx-auto min-h-full flex flex-col' : 'h-full'}`}>
            <div className="flex-1">
              <Routes>
                <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
                <Route path="/dashboard" element={user ? <Vehicles user={user} /> : <Navigate to="/" replace />} />
                <Route path="/vehicle/:id" element={user ? <VehicleDetail user={user} /> : <Navigate to="/" replace />} />
                <Route path="/favourites" element={user ? <Favourites user={user} /> : <Navigate to="/" replace />} />
                <Route path="/recents" element={user ? <Recents /> : <Navigate to="/" replace />} />
                <Route path="/cart" element={user ? <Cart user={user} /> : <Navigate to="/" replace />} />
                <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/" replace />} />
                <Route path="/sales-stats" element={user ? <SalesStats /> : <Navigate to="/" replace />} />
                <Route path="/notifications" element={user ? <Notifications /> : <Navigate to="/" replace />} />
                <Route path="/chat" element={user ? <Chat /> : <Navigate to="/" replace />} />
                <Route path="/license" element={user ? <License /> : <Navigate to="/" replace />} />
                <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
              </Routes>
            </div>

            {user && !isLoginPage && (
              <div className="mt-8 hidden md:block">
                <Footer />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Bottom Nav — só no mobile */}
      {user && !isLoginPage && (
        <BottomNav onOpenAdmin={() => setIsModalOpen(true)} />
      )}

      <AddVehicleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={() => window.location.reload()} 
      />
    </div>
  );
}