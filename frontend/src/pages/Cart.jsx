import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
  }, []);

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.$id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-black mb-8 italic">MEU CARRINHO</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100">
          <ShoppingCart className="mx-auto text-gray-200 mb-4" size={64} />
          <p className="text-gray-400">Seu carrinho está vazio.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.$id} className="flex items-center justify-between bg-white p-6 rounded-3xl border border-gray-100">
              <div className="flex items-center gap-4">
                <img src={item.image_url} className="w-24 h-16 object-cover rounded-xl" />
                <div>
                  <h3 className="font-bold">{item.brand} {item.model}</h3>
                  <p className="text-blue-600 font-bold">R$ {item.price_per_hour}/h</p>
                </div>
              </div>
              <button onClick={() => removeItem(item.$id)} className="p-3 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          
          <button className="w-full py-5 bg-black text-white rounded-3xl font-bold flex items-center justify-center gap-2 mt-8 hover:bg-gray-900 transition-all">
            Finalizar Reserva <ArrowRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}