import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, CheckCircle2, CreditCard, Loader2, Star } from 'lucide-react';
import { databases, DATABASE_ID } from '../lib/appwrite';
import { ID } from 'appwrite';

export default function Cart({ user }) { 
  const [cartItems, setCartItems] = useState([]);
  const [paymentStep, setPaymentStep] = useState('cart'); 
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [rentedDocIds, setRentedDocIds] = useState([]); 

  const SALES_COLLECTION_ID = "sales_coll"; 
  const VEHICLES_COLLECTION_ID = "67634f190013697e88c7";

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
  }, []);

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => (item.$id || item.id) !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  const handleCheckout = async () => {
    if (!user?.$id) {
      alert("Você precisa estar logado para finalizar o aluguel.");
      return;
    }

    setPaymentStep('processing');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      const newDocIds = [];

      for (const item of cartItems) {
        const payload = {
          transactionId: ID.unique(), 
          salesPersonId: String(user.$id), 
          saleDate: new Date().toISOString(), 
          finalPrice: Number(item.price || item.price_per_hour), // CORRIGIDO
          paymentMethod: "creditCard",
          customerFeedbackRating: null,
          discountApplied: false 
        };

        const response = await databases.createDocument(
          DATABASE_ID,
          SALES_COLLECTION_ID, 
          ID.unique(),
          payload
        );
        newDocIds.push(response.$id);

        try {
          await databases.updateDocument(
            DATABASE_ID,
            VEHICLES_COLLECTION_ID,
            item.$id || item.id, // CORRIGIDO
            { stock: Math.max(0, Number(item.stock || 0) - 1) }
          );
        } catch (e) {
          console.warn("Venda feita, mas falha ao baixar stock:", e);
        }
      }

      setRentedDocIds(newDocIds);
      localStorage.removeItem('cart');
      setCartItems([]);
      setPaymentStep('success');
      
    } catch (error) {
      console.error("Erro na transação:", error);
      alert(`Erro: ${error.message}`);
      setPaymentStep('cart');
    }
  };

  const handleSendRating = async () => {
    if (rating === 0) return alert("Por favor, selecione uma nota.");
    
    setLoading(true);
    try {
      for (const docId of rentedDocIds) {
        await databases.updateDocument(
          DATABASE_ID,
          SALES_COLLECTION_ID,
          docId,
          { customerFeedbackRating: String(rating) }
        );
      }
      alert("Avaliação enviada com sucesso!");
      window.location.href = '/';
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  if (paymentStep === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-pulse">
        <Loader2 className="animate-spin text-blue-600 mb-6" size={60} />
        <h2 className="text-2xl font-black italic uppercase tracking-tighter">Processando Pagamento...</h2>
      </div>
    );
  }

  if (paymentStep === 'success') {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center py-20 bg-white rounded-[3rem] shadow-xl border border-gray-50 mt-10">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-green-600" size={40} />
        </div>
        <h2 className="text-3xl font-black italic mb-2 uppercase tracking-tighter">Pagamento Aprovado!</h2>
        <div className="bg-gray-50 p-8 rounded-[2rem] border border-dashed border-gray-200 mt-6">
          <h3 className="text-xl font-bold mb-6 italic">AVALIE SUA EXPERIÊNCIA</h3>
          <div className="flex justify-center gap-3 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                size={32}
                className={`cursor-pointer transition-all ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <button 
            onClick={handleSendRating}
            disabled={loading}
            className="w-full py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 disabled:bg-gray-300"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Enviar Avaliação"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-black mb-8 italic flex items-center gap-3 tracking-tighter uppercase">
        <ShoppingCart /> Meu Carrinho
      </h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100">
          <ShoppingCart className="mx-auto text-gray-100 mb-4" size={64} />
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Carrinho vazio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.$id || item.id} className="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <img src={item.image_url} className="w-24 h-16 object-cover rounded-2xl" alt={item.model} />
                  <div>
                    <h3 className="font-black uppercase text-xs text-gray-900">{item.brand} {item.model}</h3>
                    <p className="text-blue-600 font-black text-sm">US$ {formatPrice(item.price || item.price_per_hour)}/h</p>
                  </div>
                </div>
                <button onClick={() => removeItem(item.$id || item.id)} className="p-3 text-red-400 hover:text-red-600">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl h-fit">
            <h2 className="font-black text-sm mb-6 italic uppercase tracking-widest text-gray-400">Resumo</h2>
            <div className="pt-4 border-t border-gray-100 flex justify-between items-center mb-8">
              <span className="font-black uppercase text-xs tracking-widest">Total</span>
              <span className="text-2xl font-black tracking-tighter">
                US$ {formatPrice(cartItems.reduce((acc, item) => acc + Number(item.price || item.price_per_hour), 0))}
              </span>
            </div>
            <button onClick={handleCheckout} className="w-full py-5 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3">
              Finalizar Pagamento <CreditCard size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}