import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { uploadVehicleImage } from '../lib/appwrite';
import axios from 'axios';

export default function AddVehicleModal({ isOpen, onClose, onRefresh, vehicle = null }) {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const initialForm = {
    brand: '',
    model: '',
    year: 2026,
    price_per_hour: '',
    fuel_type: 'Gasoline',
    Transmission: 'Automatic', // Valor técnico padrão
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
        vehicleType: vehicle.vehicleType || 'sedan'
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
        console.log("Fazendo upload...");
        const result = await uploadVehicleImage(selectedFile);

        // Verificação robusta
        if (result && result.url) {
          finalImageUrl = result.url;
        } else {
          // Se cair aqui, vamos ver o que o result realmente é
          console.error("Conteúdo do result:", result);
          throw new Error("Não foi possível obter o link da imagem.");
        }
      }

      const payload = {
        brand: formData.brand,
        model: formData.model,
        year: Number(formData.year),
        price_per_hour: Number(formData.price_per_hour),
        image_url: finalImageUrl, // Aqui entra a URL que construímos
        fuel_type: formData.fuel_type,
        Transmission: formData.Transmission,
        color: formData.color,
        vin: formData.vin,
        vehicleType: formData.vehicleType,
        vehicleId: Date.now().toString() // ID temporário para o campo obrigatório
      };

      console.log("Payload pronto para enviar:", payload);

      await axios.post('http://localhost:3001/api/vehicles', payload);

      alert("Veículo salvo com sucesso!");
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Erro completo:", err);
      alert("Erro: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-center bg-white">
          <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter">
            {vehicle ? 'Editar Veículo' : 'Novo Veículo'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Upload de Imagem */}
          <div className="relative h-44 border-2 border-dashed border-gray-200 rounded-[24px] bg-gray-50 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-black/20">
            {imagePreview ? (
              <div className="relative w-full h-full group">
                <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-xl font-bold text-sm">
                    Trocar Foto
                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center cursor-pointer w-full h-full justify-center">
                <Upload className="text-gray-400 mb-2" size={32} />
                <span className="text-sm font-bold text-gray-400 uppercase">Selecionar Foto</span>
                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
              </label>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Marca</label>
              <input placeholder="Marca" type="text" className="border-2 border-gray-50 bg-gray-50 p-3 rounded-2xl outline-none focus:bg-white focus:border-black transition-all" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Modelo</label>
              <input placeholder="Modelo" type="text" className="border-2 border-gray-50 bg-gray-50 p-3 rounded-2xl outline-none focus:bg-white focus:border-black transition-all" value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })} required />
            </div>
            <input type="number" placeholder="Ano" className="border-2 border-gray-50 bg-gray-50 p-3 rounded-2xl outline-none focus:border-black" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} />
            <input type="number" placeholder="Preço/Hora" className="border-2 border-gray-50 bg-gray-50 p-3 rounded-2xl outline-none focus:border-black" value={formData.price_per_hour} onChange={e => setFormData({ ...formData, price_per_hour: e.target.value })} required />

            {/* SELECTS CORRIGIDOS: Value em inglês para o banco, Texto em PT para o usuário */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Combustível</label>
              <select className="border-2 border-gray-50 bg-gray-50 p-3 rounded-2xl outline-none cursor-pointer focus:border-black" value={formData.fuel_type} onChange={e => setFormData({ ...formData, fuel_type: e.target.value })}>
                <option value="Gasoline">Gasoline</option>
                <option value="Electric">Electric</option>
                <option value="etc">etc</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Transmissão</label>
              <select className="border-2 border-gray-50 bg-gray-50 p-3 rounded-2xl outline-none cursor-pointer focus:border-black" value={formData.Transmission} onChange={e => setFormData({ ...formData, Transmission: e.target.value })}>
                <option value="Automatic">Automático</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-[20px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 transition-all disabled:bg-gray-200 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : (vehicle ? "Atualizar" : "Salvar Veículo")}
          </button>
        </form>
      </div>
    </div>
  );
}