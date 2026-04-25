import { useState } from 'react';
import { Save, ArrowLeft, Settings, Loader2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { account, databases, DATABASE_ID } from '../lib/appwrite';
import { ID, Query } from 'appwrite';

export default function Profile({ user }) {
  const navigate = useNavigate();

  // --- CONFIGURAÇÕES ---
  const PROFILE_COLLECTION_ID = "profile_coll";
  const ADMIN_EMAIL = "palhetapedro@gmail.com";
  const isAdmin = user?.email === ADMIN_EMAIL;

  // Estados
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async () => {
    if (!name.trim()) return alert("O nome não pode estar vazio.");

    setLoading(true);
    try {
      // 1. Atualiza o Nome no Sistema de Autenticação (Auth)
      await account.updateName(name);

      // 2. Prepara os dados para a tabela do Banco de Dados
      const nameParts = name.trim().split(" ");
      const profileData = {
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(" ") || " ",
        email: user.email,
        membershipStatus: isAdmin ? "admin" : "user",
        profileId: Math.floor(Date.now() / 1000)
      };

      // 3. Verifica se já existe um documento para este e-mail na tabela
      const existingDoc = await databases.listDocuments(
        DATABASE_ID,
        PROFILE_COLLECTION_ID,
        [Query.equal('email', user.email)]
      );

      if (existingDoc.documents.length > 0) {
        // Atualiza o registro existente
        await databases.updateDocument(
          DATABASE_ID,
          PROFILE_COLLECTION_ID,
          existingDoc.documents[0].$id,
          {
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            membershipStatus: profileData.membershipStatus
          }
        );
      } else {
        // Cria um novo registro caso não exista
        await databases.createDocument(
          DATABASE_ID,
          PROFILE_COLLECTION_ID,
          ID.unique(),
          profileData
        );
      }

      alert("Perfil atualizado com sucesso!");
      window.location.reload(); // Recarrega para aplicar as mudanças no Header/Sistema

    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      alert("Erro ao atualizar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen -m-8 flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070" className="w-full h-full object-cover" alt="bg" />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl p-8 animate-in zoom-in-95 duration-500">
        {/* Botão Voltar */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/50 hover:text-white mb-6 font-black text-xs uppercase tracking-widest transition-colors">
          <ArrowLeft size={16} /> Voltar ao Sistema
        </button>

        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/20">
          <div className="p-10 space-y-8">
            
            {/* Cabeçalho do Card */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
              <div className={`p-3 rounded-2xl text-white ${isAdmin ? 'bg-blue-600' : 'bg-black'}`}>
                {isAdmin ? <ShieldCheck size={24} /> : <Settings size={24} />}
              </div>
              <div>
                <h1 className="text-2xl font-black text-black tracking-tighter uppercase leading-none">
                  {isAdmin ? "Painel de Gestão" : "Minha Conta"}
                </h1>
                <div className="mt-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${isAdmin ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                    {isAdmin ? "Administrador" : "Cliente Premium"}
                  </span>
                </div>
              </div>
            </div>

            {/* Campos do Formulário */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Nome Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite seu nome"
                  className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-800 focus:border-blue-600/20 focus:bg-white outline-none transition-all"
                />
              </div>

              <div className="space-y-2 opacity-60">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">E-mail de Acesso (Fixo)</label>
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled 
                  className="w-full p-4 bg-gray-100 border-none rounded-2xl font-bold text-gray-400 cursor-not-allowed" 
                />
              </div>
            </div>

            {/* Botão Salvar */}
            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="w-full py-5 bg-black text-white rounded-3xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-xl shadow-black/10"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {loading ? "Sincronizando..." : "Salvar Alterações"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}