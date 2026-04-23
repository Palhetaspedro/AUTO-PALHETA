import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, ArrowRight, CheckCircle2, CreditCard, Loader2, Star } from 'lucide-react';
import axios from 'axios';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [paymentStep, setPaymentStep] = useState('cart'); // cart, processing, success
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
  }, []);

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.$id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price).replace(/,/g, '.');
  };

  const handleCheckout = async () => {
    setPaymentStep('processing'); // Inicia animação de pagamento
    
    try {
      // Simula um delay de rede de 2 segundos para o "pagamento"
      await new Promise(resolve => setTimeout(resolve, 2500));

      for (const item of cartItems) {
        await axios.post('http://localhost:3001/api/sales', {
          vehicleId: item.$id,
          price: item.price_per_hour,
          rentalDate: new Date().toISOString()
        });
      }

      localStorage.removeItem('cart');
      setCartItems([]);
      setPaymentStep('success');
      
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro na transação. Tente novamente.");
      setPaymentStep('cart');
    }
  };

  // --- TELA DE PROCESSANDO ---
  if (paymentStep === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-pulse">
        <Loader2 className="animate-spin text-blue-600 mb-6" size={60} />
        <h2 className="text-2xl font-black italic">PROCESSANDO PAGAMENTO...</h2>
        <p className="text-gray-400 mt-2">Verificando fundos na sua conta US Platinum.</p>
      </div>
    );
  }

  // --- TELA DE SUCESSO E AVALIAÇÃO ---
  if (paymentStep === 'success') {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center py-20 bg-white rounded-[3rem] shadow-xl border border-gray-50 mt-10">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-green-600" size={40} />
        </div>
        <h2 className="text-3xl font-black italic mb-2">PAGAMENTO APROVADO!</h2>
        <p className="text-gray-500 mb-10">Sua reserva de luxo foi confirmada com sucesso.</p>
        
        <div className="bg-gray-50 p-8 rounded-[2rem] border border-dashed border-gray-200">
          <p className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-4">Sua experiência é única</p>
          <h3 className="text-xl font-bold mb-6">AVALIE O VEÍCULO DE LUXO</h3>
          <div className="flex justify-center gap-3 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                size={32}
                className={`cursor-pointer transition-all ${rating >= star ? 'text-yellow-400 fill-yellow-400 scale-110' : 'text-gray-300'}`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all"
          >
            ENVIAR AVALIAÇÃO
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-black mb-8 italic flex items-center gap-3">
        <ShoppingCart /> MEU CARRINHO
      </h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100">
          <ShoppingCart className="mx-auto text-gray-200 mb-4" size={64} />
          <p className="text-gray-400">Seu carrinho está vazio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.$id} className="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <img src={item.image_url} className="w-24 h-16 object-cover rounded-2xl" alt={item.model} />
                  <div>
                    <h3 className="font-bold uppercase text-sm tracking-tight">{item.brand} {item.model}</h3>
                    <p className="text-blue-600 font-bold">US$ {formatPrice(item.price_per_hour)}/h</p>
                  </div>
                </div>
                <button onClick={() => removeItem(item.$id)} className="p-3 text-red-400 hover:bg-red-50 rounded-full transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-lg h-fit">
             <h2 className="font-black text-lg mb-6 italic uppercase tracking-tighter">Resumo da Reserva</h2>
             <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>US$ {formatPrice(cartItems.reduce((acc, item) => acc + Number(item.price_per_hour), 0))}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Taxas Luxury</span>
                  <span>US$ 0.00</span>
                </div>
                <div className="pt-4 border-t flex justify-between items-center">
                  <span className="font-bold">Total</span>
                  <span className="text-2xl font-black">
                     US$ {formatPrice(cartItems.reduce((acc, item) => acc + Number(item.price_per_hour), 0))}
                  </span>
                </div>
             </div>

             <button 
                onClick={handleCheckout}
                className="w-full py-5 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-gray-200"
              >
                FINALIZAR PAGAMENTO <CreditCard size={18} />
             </button>
          </div>
        </div>
      )}
    </div>
  );
}