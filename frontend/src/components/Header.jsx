import { MapPin, Clock, User, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { databases, DATABASE_ID } from '../lib/appwrite';
import { Query } from 'appwrite';

export default function Header({ user }) {
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [dbPhoto, setDbPhoto] = useState(null);
  const navigate = useNavigate();

  const ADMIN_EMAIL = "palhetapedro@gmail.com";
  const isAdmin = user?.email === ADMIN_EMAIL;
  const PROFILE_COLLECTION_ID = "profile_coll"; 

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.email) return;

      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          PROFILE_COLLECTION_ID,
          [Query.equal('email', user.email)]
        );

        if (response.documents.length > 0) {
          const doc = response.documents[0];
          
          // Agora que é String, pegamos o link direto da coluna profilePictureUrl
          const photoUrl = doc.profilePictureUrl;

          if (photoUrl && photoUrl !== "null" && photoUrl !== "") {
            console.log("✅ Foto encontrada no banco:", photoUrl);
            setDbPhoto(photoUrl);
          } else {
            console.log("⚠️ Documento existe, mas a coluna profilePictureUrl está vazia.");
            setDbPhoto(null);
          }
        }
      } catch (error) {
        console.error("❌ Erro ao buscar dados no banco:", error.message);
      }
    };

    fetchProfileData();
  }, [user]);

  // Prioridade: 1º Banco de dados, 2º Prefs do Auth, 3º Null (ícone)
  const finalPhoto = dbPhoto || user?.prefs?.avatar || null;

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full px-8 py-4 flex items-center justify-between 
      bg-gradient-to-r from-blue-600/10 via-white/80 to-purple-600/10 
      backdrop-blur-xl border-b border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)]
      overflow-hidden">

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))] pointer-events-none" />

      {/* Lado Esquerdo */}
      <div className="flex items-center gap-6 relative z-10">
        <div className="group flex items-center gap-2 bg-black text-white px-4 py-2 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 cursor-default">
          <MapPin size={16} className="text-blue-400 animate-pulse" />
          <span className="text-[12px] font-black tracking-widest italic">BRASÍLIA • DF</span>
        </div>
      </div>

      {/* Centro */}
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

      {/* Lado Direito */}
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
            <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${isAdmin ? 'text-red-600' : 'text-blue-600'}`}>
              {isAdmin ? 'Gestor Admin' : 'Cliente Premium'}
            </p>
          </div>

          {/* Avatar Container */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl blur-sm opacity-20 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-12 w-12 bg-black rounded-2xl flex items-center justify-center text-white border-2 border-white overflow-hidden shadow-xl">

              {finalPhoto ? (
                <img
                  src={finalPhoto}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  key={finalPhoto} 
                  onError={(e) => {
                    console.log("Erro ao renderizar imagem física. Link pode estar expirado ou sem permissão.");
                    setDbPhoto(null);
                  }}
                />
              ) : (
                <User size={24} strokeWidth={1.5} />
              )}

            </div>
          </div>
        </div>
      </div>
    </header>
  );
}