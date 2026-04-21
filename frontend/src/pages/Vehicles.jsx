import { Search, MapPin, Filter, Star } from 'lucide-react';

const mockVehicles = [
  { id: '1', brand: 'BMW', model: 'M4 Competition', year: 2024, color: 'Verde Ilha de Man', price_per_hour: 150.0, image_url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800&auto=format&fit=crop' },
  { id: '2', brand: 'Porsche', model: '911 Carrera', year: 2023, color: 'Prata', price_per_hour: 200.0, image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop' },
  { id: '3', brand: 'Audi', model: 'RS e-tron GT', year: 2024, color: 'Preto', price_per_hour: 120.0, image_url: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=800&auto=format&fit=crop' },
];

export default function Vehicles() {
  return (
    <div className="space-y-10">
      
      {/* Hero Section */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between gap-6">
        <div>
          <span className="text-sm font-bold tracking-widest text-gray-400 uppercase">Premium Fleet</span>
          <h1 className="text-4xl font-extrabold text-gray-950 mt-2 tracking-tight">
            Descubra o carro perfeito.
          </h1>
          <p className="text-gray-500 mt-3 max-w-xl text-lg">
            Sua próxima jornada começa aqui. Alugue veículos exclusivos com total transparência e segurança.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar marca, modelo ou categoria..." 
            className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-400 font-medium" 
          />
        </div>
        <div className="h-8 w-px bg-gray-200"></div>
        <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition">
          <Filter className="w-4 h-4" />
          Filtros
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockVehicles.map(vehicle => (
          <div key={vehicle.id} className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative h-56 w-full overflow-hidden bg-gray-100">
              <img 
                src={vehicle.image_url} 
                alt={`${vehicle.brand} ${vehicle.model}`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                <Star className="w-3.5 h-3.5 text-black fill-black" />
                <span className="text-sm font-bold text-gray-900">5.0</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-950 tracking-tight">{vehicle.brand} {vehicle.model}</h3>
                  <p className="text-sm text-gray-500 font-medium mt-1">{vehicle.year} • {vehicle.color}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-gray-950">R$ {vehicle.price_per_hour.toFixed(2)}</span>
                  <span className="text-sm font-medium text-gray-500">/h</span>
                </div>
                <button className="px-5 py-2.5 bg-black text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition">
                  Reservar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}