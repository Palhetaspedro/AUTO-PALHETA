import { useState, useEffect } from 'react';
import { Bell, Trash2 } from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('notifications') || '[]');
    setNotifications(saved);
  }, []);

  const clearAll = () => {
    localStorage.removeItem('notifications');
    setNotifications([]);
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
          <Bell size={22} /> Notificações
        </h1>
        {notifications.length > 0 && (
          <button onClick={clearAll} className="text-xs text-red-400 font-bold uppercase tracking-widest hover:text-red-600 flex items-center gap-1">
            <Trash2 size={14} /> Limpar
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest text-center py-10">
          Nenhuma notificação ainda.
        </p>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <div key={n.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-sm font-bold text-gray-800">{n.text}</p>
              <span className="text-[10px] font-black text-blue-400 uppercase ml-4 shrink-0">{n.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}