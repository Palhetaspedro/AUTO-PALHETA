import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { uploadVehicleImage } from '../lib/appwrite';
import axios from 'axios';

export default function AddVehicleModal({ isOpen, onClose, onRefresh, vehicle = null }) {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const initialForm = {
    brand: '', model: '', year: 2026, price_per_hour: '',
    fuel_type: 'Gasoline', transmission: 'Automatic',
    color: 'Black', vin: '', vehicleType: 'sedan'
  };

  const [formData, setFormData] = useState(initialForm);

  // Preenche o form se for edição, limpa se for novo
  useEffect(() => {
    if (vehicle && isOpen) {
      setFormData({
        brand: vehicle.brand || '',
        model: vehicle.model || '',
        year: vehicle.year || 2026,
        price_per_hour: vehicle.price_per_hour || '',
        fuel_type: vehicle.fuel_type || 'Gasoline',
        transmission: vehicle.Transmission || 'Automatic',
        color: vehicle.color || 'Black',
        vin: vehicle.vin || '',
        vehicleType: vehicle.vehicleType || 'sedan'
      });
      setImagePreview(vehicle.image_url || null);
    } else if (!vehicle && isOpen) {
      setFormData(initialForm);
      setImagePreview(null);
    }
  }, [vehicle, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = imagePreview;
      if (selectedFile) {
        const uploadResult = await uploadVehicleImage(selectedFile);
        imageUrl = uploadResult.url;
      }

      const payload = { ...formData, year: Number(formData.year), price_per_hour: Math.round(Number(formData.price_per_hour)), image_url: imageUrl };

      if (vehicle?.$id) {
        await axios.put(`http://localhost:3001/api/vehicles/${vehicle.$id}`, payload);
      } else {
        await axios.post('http://localhost:3001/api/vehicles', payload);
      }

      onRefresh();
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || "Erro na operação");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... (restante do JSX do modal que você já tem)
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
       {/* Conteúdo do seu form aqui */}
    </div>
  );
}