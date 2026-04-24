import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { account } from '../lib/appwrite';
import { toast, ToastContainer } from 'react-toastify'; // Importe o Container
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false); // Controle do balão
  const navigate = useNavigate();

  const handleRequestAccess = () => {
    toast.info("Solicitação enviada à administração!", {
      position: "bottom-center",
      theme: "dark"
    });
    setShowTooltip(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      try { await account.deleteSession('current'); } catch (e) {}
      
      await account.createEmailPasswordSession(email, password);
      toast.success("Acesso autorizado!");
      window.location.href = '/dashboard';
    } catch (error) {
      if (error.code === 404 || error.type === 'user_not_found') {
        // Se a conta não existe, mostramos o balão em vez de apenas o toast
        setShowTooltip(true);
        toast.error("Conta não encontrada.");
      } else {
        toast.error("Credenciais inválidas.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black">
      {/* Container do Toast para garantir que os avisos apareçam */}
      <ToastContainer />

      <div className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1920')" }} />

      <div className="relative z-10 w-full max-w-md p-10 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl">
        <h1 className="text-3xl font-black text-white text-center tracking-tighter">AUTO ULTIMATE</h1>
        
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <input type="email" placeholder="E-mail" required className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-white/30" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Senha" required className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-white/30" onChange={(e) => setPassword(e.target.value)} />
          
          <div className="relative space-y-4">
            <button disabled={loading} className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition disabled:opacity-50">
              {loading ? "Processando..." : "Entrar"}
            </button>

            {/* Balão de Aviso (Tooltip) */}
            {showTooltip && (
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-full bg-white text-black p-3 rounded-xl text-xs font-bold shadow-2xl animate-bounce">
                <div className="relative">
                  Parece que você ainda não tem acesso.
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white"></div>
                </div>
              </div>
            )}

            <div className="text-center">
              <button 
                type="button"
                onClick={handleRequestAccess}
                className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em] hover:text-white transition-colors"
              >
                Solicitar Acesso
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}