

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { databases, DATABASE_ID, COLLECTION_ID } from '../lib/appwrite';

export default function VehicleDetails() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    // Busca os dados do carro específico pelo ID da URL
    databases.getDocument(DATABASE_ID, COLLECTION_ID, id)
      .then(res => setVehicle(res));
  }, [id]);

  if (!vehicle) return <div>Carregando...</div>;

  return (
    <div className="p-8">
      {/* Aqui você monta um layout bem detalhado com a foto grande, 
          motorização, cor, descrição, etc. */}
      <h1 className="text-5xl font-black">{vehicle.model}</h1>
      <img src={vehicle.image_url} className="w-full rounded-[3rem] my-8" />
      <p className="text-2xl">{vehicle.description}</p>
    </div>
  );
}