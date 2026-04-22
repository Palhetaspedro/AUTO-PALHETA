import { useState, useRef } from 'react';
import { User, Camera, Save, ArrowLeft, Settings, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { account, storage } from '../lib/appwrite'; // Certifique-se de que o storage está exportado em lib/appwrite
import { ID } from 'appwrite';

export default function Profile({ user }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Estados
  const [name, setName] = useState(user?.name || '');
  const [imagePreview, setImagePreview] = useState(user?.prefs?.avatar || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Lida com a seleção da imagem localmente
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current.click();
  };

  // 2. Função principal para salvar no Appwrite
  const handleSaveProfile = async () => {
    if (!name.trim()) return alert("O nome não pode estar vazio.");
    
    setLoading(true);
    try {
      let avatarUrl = imagePreview;

      // Se houver um novo arquivo, faz upload para o Storage
      if (selectedFile) {
        // 'avatars' deve ser o ID do seu bucket criado no Appwrite Console
        const uploadedFile = await storage.createFile(
          'avatars', 
          ID.unique(), 
          selectedFile
        );

        // Obtém a URL de visualização
        const result = storage.getFilePreview('avatars', uploadedFile.$id);
        avatarUrl = result.href;
      }

      // Atualiza o nome na conta
      await account.updateName(name);

      // Salva a URL da imagem nas preferências do usuário (para persistir no Header/Sidebar)
      await account.updatePrefs({
        avatar: avatarUrl
      });

      alert("Perfil atualizado com sucesso!");
      window.location.reload(); // Recarrega para atualizar os dados globalmente no app
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      alert("Erro ao salvar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen -m-8 flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop" 
          className="w-full h-full object-cover"
          alt="Luxury Car Background"
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl p-8 animate-in zoom-in-95 duration-500">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors font-black text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Voltar ao Painel
        </button>

        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden">
          <div className="p-10 space-y-8">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
              <div className="p-3 bg-black rounded-2xl text-white">
                <Settings size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-black tracking-tighter uppercase leading-none">Minha Conta</h1>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Dados do Gestor</p>
              </div>
            </div>

            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  className="hidden" 
                  accept="image/*"
                />
                
                <div className="h-28 w-28 bg-gradient-to-br from-black to-gray-700 rounded-[2.5rem] flex items-center justify-center text-white border-4 border-white shadow-xl overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <User size={40} />
                  )}
                </div>
                
                <button 
                  onClick={handleTriggerUpload}
                  className="absolute bottom-0 right-0 p-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:scale-110 transition-transform cursor-pointer"
                >
                  <Camera size={18} />
                </button>
              </div>
            </div>

            {/* Form Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Nome de Exibição</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-800 focus:ring-2 focus:ring-black transition-all"
                />
              </div>
              
              <div className="space-y-2 opacity-50">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">E-mail (Não editável)</label>
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled
                  className="w-full p-4 bg-gray-100 border-none rounded-2xl font-bold text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Action Button */}
            <button 
              onClick={handleSaveProfile}
              disabled={loading}
              className="w-full py-5 bg-black text-white rounded-3xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-800 transition-all active:scale-95 disabled:bg-gray-400"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {loading ? "Salvando..." : "Salvar Perfil"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}