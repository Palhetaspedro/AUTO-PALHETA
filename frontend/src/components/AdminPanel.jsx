import { useState } from 'react';

export default function AdminPanel() {
  const [carData, setCarData] = useState({
    brand: '', model: '', price: 0, color: '#000000', transmission: 'Automatic'
  });

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Painel do Administrador</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário de Cadastro */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-xl font-bold">Adicionar Novo Veículo</h2>
          <input type="text" placeholder="Marca" className="w-full p-3 border rounded-xl" />
          <input type="text" placeholder="Modelo" className="w-full p-3 border rounded-xl" />
          <div className="flex gap-4">
            <input type="number" placeholder="Preço/h" className="flex-1 p-3 border rounded-xl" />
            <select className="p-3 border rounded-xl">
              <option>Automático</option>
              <option>Manual</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <span>Cor do Veículo:</span>
            <input 
              type="color" 
              value={carData.color} 
              onChange={(e) => setCarData({...carData, color: e.target.value})}
              className="w-16 h-10 rounded-lg cursor-pointer" 
            />
          </div>
          <button className="w-full py-4 bg-black text-white font-bold rounded-xl">Salvar Veículo</button>
        </div>

        {/* Preview ao Vivo */}
        <div className="bg-gray-900 p-6 rounded-3xl flex flex-col items-center justify-center text-white overflow-hidden relative">
          <p className="absolute top-4 left-4 text-xs uppercase tracking-widest opacity-50">Preview em Tempo Real</p>
          
          {/* O Carro que muda de cor via CSS filter ou overlay */}
          <div className="w-64 h-40 bg-contain bg-no-repeat bg-center transition-all duration-500"
               style={{ 
                 backgroundImage: "url('SUA_URL_DE_CARRO_SEM_FUNDO')", 
                 backgroundColor: carData.color,
                 maskImage: "url('SUA_URL_DE_CARRO_SEM_FUNDO')",
                 WebkitMaskImage: "url('SUA_URL_DE_CARRO_SEM_FUNDO')"
               }}>
          </div>
          <h3 className="text-2xl font-black mt-4">{carData.brand || 'Marca'} {carData.model || 'Modelo'}</h3>
          <p className="text-xl font-light">R$ {carData.price || '0'},00 /hora</p>
        </div>
      </div>
    </div>
  );
}