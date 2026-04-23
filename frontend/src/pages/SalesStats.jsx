import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { DollarSign, Car, Calendar, TrendingUp, Users, ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { databases, DATABASE_ID, COLLECTION_ID } from '../lib/appwrite';

// Dados simulados para o gráfico (Faturamento e Aluguéis)
const data = [
  { name: 'Jan', faturamento: 4200, alugueis: 24 },
  { name: 'Fev', faturamento: 3800, alugueis: 18 },
  { name: 'Mar', faturamento: 5500, alugueis: 35 },
  { name: 'Abr', faturamento: 4800, alugueis: 29 },
  { name: 'Mai', faturamento: 7200, alugueis: 42 },
  { name: 'Jun', faturamento: 6100, alugueis: 38 },
];

export default function SalesStats() {
  const [totalVehicles, setTotalVehicles] = useState(0);

  // Busca o total real da frota no Appwrite
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
        setTotalVehicles(response.total);
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900">Visão Geral do Negócio</h1>
          <p className="text-gray-500 font-medium">Monitore a performance da sua frota e receita em tempo real.</p>
        </div>
        <div className="bg-black text-white px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
          AO VIVO
        </div>
      </div>

      {/* Cards de KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Receita Mensal', value: 'R$ 24.500', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12.5%' },
          { label: 'Aluguéis Ativos', value: '12', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+3 hoje' },
          { label: 'Frota Total', value: totalVehicles, icon: Car, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: 'Disponíveis' },
          { label: 'Avaliação Média', value: '4.9', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50', trend: '★ Excelente' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                <kpi.icon size={24} />
              </div>
              <span className="text-[10px] font-black px-2 py-1 bg-gray-50 rounded-lg text-gray-400 group-hover:text-black transition-colors">{kpi.trend}</span>
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{kpi.label}</p>
            <h3 className="text-3xl font-black mt-1 text-gray-900">{kpi.value}</h3>
          </div>
        ))}
      </div>

      {/* Gráfico de Faturamento Avançado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-xl font-black text-gray-900">Análise de Receita</h2>
              <p className="text-sm text-gray-400 font-bold">Desempenho financeiro do último semestre</p>
            </div>
            <select className="bg-gray-50 border-none rounded-2xl px-4 py-3 text-xs font-black outline-none ring-2 ring-transparent focus:ring-black transition-all">
              <option>Últimos 6 Meses</option>
              <option>Último Ano</option>
            </select>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 'bold'}} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 'bold'}} 
                />
                <Tooltip 
                  cursor={{ stroke: '#4f46e5', strokeWidth: 2 }}
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: 'none', 
                    padding: '20px',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' 
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="faturamento" 
                  stroke="#4f46e5" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorFaturamento)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Segundo Gráfico: Volume de Aluguéis */}
        <div className="bg-black p-8 rounded-[40px] shadow-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-black text-white">Volume de Aluguéis</h2>
            <p className="text-sm text-gray-400 font-bold mb-8">Reservas mensais finalizadas</p>
            
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <Bar dataKey="alugueis" radius={[10, 10, 10, 10]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 4 ? '#818cf8' : '#ffffff20'} />
                    ))}
                  </Bar>
                  <Tooltip cursor={false} content={({ active, payload }) => {
                    if (active && payload) return (
                      <div className="bg-white p-2 rounded-lg font-black text-xs text-black">
                        {payload[0].value} aluguéis
                      </div>
                    );
                    return null;
                  }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-md">
            <p className="text-white text-sm font-bold flex items-center gap-2">
              <ArrowUpRight className="text-green-400" /> +15% em relação a Maio
            </p>
            <p className="text-gray-400 text-xs mt-1">O crescimento superou a meta trimestral.</p>
          </div>
        </div>
      </div>
    </div>
  );
}