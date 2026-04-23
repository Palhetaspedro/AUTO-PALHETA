import { useState, useEffect } from 'react';
import { X, Upload, Loader2, CarFront, Tag, Fuel, Settings } from 'lucide-react';
import { uploadVehicleImage } from '../lib/appwrite';
import axios from 'axios';

export default function AddVehicleModal({ isOpen, onClose, onRefresh, vehicle = null }) {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Valores iniciais rigorosamente em minúsculo para o Appwrite
  const initialForm = {
    brand: '',
    model: '',
    year: 2026,
    price_per_hour: '',
    fuel_type: 'Gasoline',
    Transmission: 'Automatic',
    color: 'Black',
    vin: '',
    vehicleType: 'sedan' 
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (vehicle && isOpen) {
      setFormData({
        brand: vehicle.brand || '',
        model: vehicle.model || '',
        year: vehicle.year || 2026,
        price_per_hour: vehicle.price_per_hour || '',
        fuel_type: vehicle.fuel_type || 'Gasoline',
        Transmission: vehicle.Transmission || 'Automatic',
        color: vehicle.color || 'Black',
        vin: vehicle.vin || '',
        vehicleType: (vehicle.vehicleType || 'sedan').toLowerCase()
      });
      setImagePreview(vehicle.image_url || null);
    } else if (!vehicle && isOpen) {
      setFormData(initialForm);
      setImagePreview(null);
      setSelectedFile(null);
    }
  }, [vehicle, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = imagePreview;

      if (selectedFile) {
        const result = await uploadVehicleImage(selectedFile);
        if (result && result.url) {
          finalImageUrl = result.url;
        }
      }

      // Payload limpo e seguro
      const payload = {
        ...formData,
        vehicleType: formData.vehicleType.toLowerCase().trim(), // Força minúsculo
        year: Number(formData.year),
        price_per_hour: Number(formData.price_per_hour),
        image_url: finalImageUrl,
        vehicleId: vehicle?.vehicleId || Date.now().toString()
      };

      await axios.post('http://localhost:3001/api/vehicles', payload);

      alert("Sucesso!");
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Erro:", err);
      alert("Erro ao salvar: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-black p-2 rounded-xl text-white">
              <CarFront size={20} />
            </div>
            <h2 className="text-xl font-black tracking-tighter uppercase">
              {vehicle ? 'Editar' : 'Novo Veículo'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {/* Foto */}
          <div className="relative h-32 border-2 border-dashed border-gray-200 rounded-[24px] bg-gray-50 flex items-center justify-center overflow-hidden transition-all hover:border-black/20 group">
            {imagePreview ? (
              <div className="relative w-full h-full">
                <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-bold text-xs uppercase">
                  Trocar Foto
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
              </div>
            ) : (
              <label className="flex flex-col items-center cursor-pointer">
                <Upload className="text-gray-400 mb-1" size={24} />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Foto do Carro</span>
                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
              </label>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Marca</label>
              <input type="text" className="bg-gray-100 p-3.5 rounded-2xl outline-none focus:bg-white border-2 border-transparent focus:border-black font-bold text-sm" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Modelo</label>
              <input type="text" className="bg-gray-100 p-3.5 rounded-2xl outline-none focus:bg-white border-2 border-transparent focus:border-black font-bold text-sm" value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })} required />
            </div>

            {/* SELETOR DE CATEGORIA - VALORES EXATOS DO APPWRITE */}
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 flex items-center gap-1">
                <Tag size={10} /> Categoria
              </label>
              <select 
                className="bg-gray-100 p-3.5 rounded-2xl outline-none border-2 border-transparent focus:border-black font-bold text-sm cursor-pointer"
                value={formData.vehicleType}
                onChange={e => setFormData({ ...formData, vehicleType: e.target.value })}
              >
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="truck">Truck</option>
                <option value="coupe">Coupe</option>
                <option value="hatchback">Hatchback</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 flex items-center gap-1">
                <Fuel size={10} /> Combustível
              </label>
              <select className="bg-gray-100 p-3.5 rounded-2xl outline-none border-2 border-transparent focus:border-black font-bold text-sm cursor-pointer" value={formData.fuel_type} onChange={e => setFormData({ ...formData, fuel_type: e.target.value })}>
                <option value="Gasoline">Gasolina</option>
                <option value="Electric">Elétrico</option>
                <option value="Hybrid">Híbrido</option>
                <option value="Diesel">Diesel</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 flex items-center gap-1">
                <Settings size={10} /> Transmissão
              </label>
              <select className="bg-gray-100 p-3.5 rounded-2xl outline-none border-2 border-transparent focus:border-black font-bold text-sm cursor-pointer" value={formData.Transmission} onChange={e => setFormData({ ...formData, Transmission: e.target.value })}>
                <option value="Automatic">Automática</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Ano</label>
              <input type="number" className="bg-gray-100 p-3.5 rounded-2xl outline-none focus:bg-white border-2 border-transparent focus:border-black font-bold text-sm" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">R$ / Hora</label>
              <input type="number" className="bg-gray-100 p-3.5 rounded-2xl outline-none focus:bg-white border-2 border-transparent focus:border-black font-bold text-sm" value={formData.price_per_hour} onChange={e => setFormData({ ...formData, price_per_hour: e.target.value })} required />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-gray-800 transition-all disabled:bg-gray-300 mt-2 shadow-xl active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Confirmar"}
          </button>
        </form>
      </div>
    </div>
  );
}