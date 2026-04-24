import { useState, useEffect } from 'react';
import { databases, DATABASE_ID } from '../lib/appwrite';
import { Query } from 'appwrite';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, LabelList, ReferenceLine
} from 'recharts';
import { DollarSign, ShoppingCart, Tag, Target, Loader2 } from 'lucide-react';

export default function SalesStats() {
  const [stats, setStats] = useState({ chartData: [], totalRevenue: 0, salesCount: 0, avgTicket: 0, goalCalc: 0 });
  const [loading, setLoading] = useState(true);

  const SALES_COLLECTION_ID = "sales_coll";
  const META_MENSAL = 50000;

  // Formatação de Moeda BRL
  const formatBRL = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Formatação compacta para os pontinhos (Ex: R$0,24 Mi ou R$ 15 Mil)
  const formatCompact = (value) => {
    if (!value || value === 0) return ''; // Esconde o texto se for zero
    if (value >= 1000000) return `R$${(value / 1000000).toFixed(2).replace('.', ',')} Mi`;
    if (value >= 1000) return `R$${(value / 1000).toFixed(1).replace('.', ',')} Mil`;
    return `R$${value.toFixed(0)}`;
  };

  useEffect(() => {
    async function loadRealData() {
      try {
        const response = await databases.listDocuments(DATABASE_ID, SALES_COLLECTION_ID, [Query.limit(500)]);
        const docs = response.documents;

        // 1. Cálculos de KPI
        const totalRevenue = docs.reduce((acc, d) => acc + (Number(d.finalPrice) || 0), 0);
        const salesCount = docs.length;
        const avgTicket = salesCount > 0 ? totalRevenue / salesCount : 0;
        const goalCalc = ((totalRevenue / META_MENSAL) * 100).toFixed(1);

        // 2. Estrutura dos 12 meses do ano
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        let dadosMensais = meses.map(m => ({ name: m, value: 0 }));

        // 3. Preenche os meses com os dados reais do Appwrite
        docs.forEach(d => {
          if (d.saleDate) {
            const date = new Date(d.saleDate);
            const monthIndex = date.getMonth(); // 0 (Jan) a 11 (Dez)
            dadosMensais[monthIndex].value += (Number(d.finalPrice) || 0);
          }
        });

        // 4. Calcula a Variação (Gráfico de baixo)
        const chartData = dadosMensais.map((item, index) => {
          let variation = 0;
          if (index > 0 && dadosMensais[index - 1].value > 0) {
            // (Mês Atual - Mês Anterior) / Mês Anterior * 100
            variation = ((item.value - dadosMensais[index - 1].value) / dadosMensais[index - 1].value) * 100;
          } else if (index > 0 && dadosMensais[index - 1].value === 0 && item.value > 0) {
            variation = 100; // Crescimento base se o mês anterior for 0
          }

          return {
            ...item,
            label: formatCompact(item.value), // Valor para o gráfico de cima
            variation: Number(variation.toFixed(1)), // Valor para o gráfico de baixo
            varLabel: item.value === 0 && (index === 0 || dadosMensais[index-1].value === 0) ? '0,0%' : `${variation > 0 ? '' : ''}${variation.toFixed(1).replace('.', ',')}%`
          };
        });

        setStats({ chartData, totalRevenue, salesCount, avgTicket, goalCalc });
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    loadRealData();
  }, []);

  if (loading) return <div className="flex h-96 items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-[#6d28d9]" size={40} /></div>;

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans pb-12">
      
      {/* TOPO KPI (Mantive escuro para dar contraste premium, mas você pode mudar) */}
      <div className="bg-[#1e1b4b] pt-8 pb-24 px-8">
        <h1 className="text-white text-2xl font-bold mb-8">Dashboard Financeiro</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KPICard title="Faturamento" value={formatBRL(stats.totalRevenue)} icon={<DollarSign />} />
          <KPICard title="Veículos Alugados" value={stats.salesCount} icon={<ShoppingCart />} />
          <KPICard title="Ticket Médio" value={formatBRL(stats.avgTicket)} icon={<Tag />} />
          <KPICard title="Meta" value={`${stats.goalCalc}%`} icon={<Target />} />
        </div>
      </div>

      {/* ÁREA DOS GRÁFICOS (Fundo Claro igual a imagem) */}
      <div className="px-8 -mt-16 space-y-8 max-w-6xl mx-auto">
        
        {/* GRÁFICO 1: Evolução das Vendas (Linha/Área) */}
        <div className="bg-white pt-6 pb-2 px-6 rounded-xl shadow-md border-t-4 border-t-[#6d28d9]">
          <h3 className="text-center font-bold text-gray-800 mb-8">Evolução das Vendas</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} dy={10} />
                <YAxis hide domain={['dataMin', 'dataMax + 500']} />
                <Tooltip 
                  formatter={(value) => [formatBRL(value), 'Faturamento']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Area 
                  type="linear" // Linha reta igual a foto
                  dataKey="value" 
                  stroke="#6d28d9" // Roxo escuro
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="#c4b5fd" // Roxo claro sólido (sem gradiente, igual a foto)
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#4c1d95' }}
                  dot={{ r: 4, fill: '#6d28d9', strokeWidth: 0 }} // Pontinhos roxos preenchidos
                >
                  {/* Textos flutuantes em cima dos pontos */}
                  <LabelList dataKey="label" position="top" offset={12} fill="#6b7280" fontSize={11} fontWeight="500" />
                </Area>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-gray-400 text-xs pb-2 mt-[-10px]">2026</div> {/* Ano fictício abaixo do eixo X */}
        </div>

        {/* GRÁFICO 2: Variação Anual das Vendas (Barras) */}
        <div className="bg-white pt-6 pb-2 px-6 rounded-xl shadow-md">
          <h3 className="text-center font-bold text-gray-800 mb-8">Variação Anual das Vendas</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData} margin={{ top: 30, right: 30, left: 30, bottom: 20 }}>
                {/* Linha roxa no meio (Zero) */}
                <ReferenceLine y={0} stroke="#a78bfa" strokeWidth={2} /> 
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f3f4f6'}}
                  formatter={(value) => [`${value}%`, 'Variação']}
                />
                <Bar dataKey="variation" radius={[2, 2, 2, 2]} barSize={32}>
                  {stats.chartData.map((entry, index) => (
                    // Positivo = Roxo escuro, Negativo = Roxo claro
                    <Cell key={`cell-${index}`} fill={entry.variation >= 0 ? '#6d28d9' : '#c4b5fd'} /> 
                  ))}
                  {/* Renderiza a porcentagem em cima ou embaixo dependendo se é positivo ou negativo */}
                  <LabelList 
                    dataKey="varLabel" 
                    position="outside" 
                    content={(props) => {
                      const { x, y, width, value, offset } = props;
                      // Se for variação negativa, joga o texto pra baixo da barra
                      const isNegative = parseFloat(value) < 0;
                      const textY = isNegative ? y + offset + 15 : y - offset;
                      return (
                        <text x={x + width / 2} y={textY} fill="#6b7280" fontSize="11" textAnchor="middle" fontWeight="500">
                          {value}
                        </text>
                      );
                    }} 
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-gray-400 text-xs pb-2 mt-[-10px]">2026</div>
        </div>

      </div>
    </div>
  );
}

// Componente do Cartão (Mantido com o Ponto na formatação do Ticket)
function KPICard({ title, value, icon }) {
  return (
    <div className="bg-[#2e2b5e] border border-[#3e3b73] p-5 rounded-lg shadow-lg relative overflow-hidden">
      <div className="absolute -right-2 -bottom-2 text-white opacity-5 transform scale-150">
        {icon}
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-gray-300 text-xs font-semibold uppercase tracking-wider">{title}</span>
          <div className="p-1 bg-[#3e3b73] rounded-full text-purple-300">
            {icon}
          </div>
        </div>
        <div className="text-white text-2xl font-bold tracking-tight">{value}</div>
      </div>
    </div>
  );
}