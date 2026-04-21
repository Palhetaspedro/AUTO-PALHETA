import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { account } from '../lib/appwrite';
import { toast } from 'react-toastify';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Cria a sessão
      await account.createEmailPasswordSession(email, password);
      
      toast.success("Bem-vindo ao Auto Ultimate!");

      // a rodar o checkUser() de novo e liberar as rotas.
      window.location.href = '/dashboard'; 
      
    } catch (error) {
      
      toast.error("Erro ao entrar: Verifique suas credenciais.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black">
      <div className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1920')" }} />
      
      <div className="relative z-10 w-full max-w-md p-10 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl">
        <h1 className="text-3xl font-black text-white text-center tracking-tighter">AUTO ULTIMATE</h1>
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <input type="email" placeholder="E-mail" required className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-white/30" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Senha" required className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-white/30" onChange={(e) => setPassword(e.target.value)} />
          <button disabled={loading} className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition disabled:opacity-50">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}