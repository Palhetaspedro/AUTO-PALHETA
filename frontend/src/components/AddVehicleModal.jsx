import { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { uploadVehicleImage } from '../services/appwrite';
import axios from 'axios';

export default function AddVehicleModal({ isOpen, onClose, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    brand: '', model: '', year: 2024, price_per_hour: '', fuel_type: 'Gasoline'
  });

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
      let imageUrl = '';
      if (selectedFile) {
        const uploadResult = await uploadVehicleImage(selectedFile);
        imageUrl = uploadResult.url;
      }

      // Enviando para o seu Backend Node (que configuramos na resposta anterior para Appwrite)
      await axios.post('http://localhost:3001/api/vehicles', {
        ...formData,
        image_url: imageUrl,
        is_available: true
      });

      onRefresh();
      onClose();
    } catch (err) {
      alert("Erro ao salvar no Appwrite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Novo Veículo (Appwrite)</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Área de Drop/Upload */}
          <div className="relative h-40 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center overflow-hidden">
            {imagePreview ? (
              <img src={imagePreview} className="w-full h-full object-cover" />
            ) : (
              <label className="flex flex-col items-center cursor-pointer">
                <Upload className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Foto do veículo</span>
                <input type="file" className="hidden" onChange={handleFileChange} />
              </label>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Marca" className="border p-3 rounded-xl outline-none focus:ring-2 ring-black"
              onChange={e => setFormData({...formData, brand: e.target.value})} required />
            <input type="text" placeholder="Modelo" className="border p-3 rounded-xl outline-none focus:ring-2 ring-black"
              onChange={e => setFormData({...formData, model: e.target.value})} required />
            <input type="number" placeholder="Ano" className="border p-3 rounded-xl"
              onChange={e => setFormData({...formData, year: e.target.value})} />
            <input type="number" placeholder="Preço/Hora" className="border p-3 rounded-xl"
              onChange={e => setFormData({...formData, price_per_hour: e.target.value})} required />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-900 transition-all">
            {loading ? <Loader2 className="animate-spin" /> : "Cadastrar na Frota"}
          </button>
        </form>
      </div>
    </div>
  );
}