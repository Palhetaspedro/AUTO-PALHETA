import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DollarSign, Car, Calendar, TrendingUp } from 'lucide-react';

const data = [
  { name: 'Jan', revenue: 4000, rentals: 24 },
  { name: 'Fev', revenue: 3000, rentals: 18 },
  { name: 'Mar', revenue: 5000, rentals: 35 },
  { name: 'Abr', revenue: 4500, rentals: 29 },
  { name: 'Mai', revenue: 6000, rentals: 42 },
  { name: 'Jun', revenue: 5500, rentals: 38 },
];

export default function SalesStats() {
  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Business Overview</h1>
        <p className="text-gray-500">Monitor your fleet performance and revenue</p>
      </div>

      {/* Cards de KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Monthly Revenue', value: '$24,500', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Active Rentals', value: '12', icon: Car, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Fleet', value: '48', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Average Rating', value: '4.8', icon: Calendar, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
            <div className={`w-12 h-12 ${kpi.bg} ${kpi.color} rounded-xl flex items-center justify-center mb-4`}>
              <kpi.icon size={24} />
            </div>
            <p className="text-sm font-medium text-gray-400">{kpi.label}</p>
            <h3 className="text-2xl font-bold mt-1">{kpi.value}</h3>
          </div>
        ))}
      </div>

      {/* Gráfico de Faturamento */}
      <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold">Revenue Analytics</h2>
          <select className="bg-gray-50 border-none rounded-lg px-4 py-2 text-sm font-bold outline-none">
            <option>Last 6 Months</option>
            <option>Last Year</option>
          </select>
        </div>
        
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#000000" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}