
import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Habit, HabitLog } from '../types';

interface AnalyticsSectionProps {
  habits: Habit[];
  logs: HabitLog[];
  timeframe: 'W' | 'M' | 'Y';
  setTimeframe: (t: 'W' | 'M' | 'Y') => void;
  statusColor?: string;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ habits, logs, timeframe, setTimeframe, statusColor = '#1A1A1A' }) => {
  const chartData = useMemo(() => {
    const days = timeframe === 'W' ? 7 : timeframe === 'M' ? 30 : 90;
    const data = [];
    const today = new Date();
    
    for (let i = days; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const completions = logs.filter(l => l.habitId && l.date === dateStr && l.completed).length;
      const rate = habits.length > 0 ? (completions / habits.length) * 100 : 0;
      
      data.push({
        name: d.toLocaleDateString('default', { month: '2-digit', day: '2-digit' }),
        rate: Math.round(rate),
      });
    }
    return data;
  }, [logs, habits, timeframe]);

  const currentRate = chartData[chartData.length - 1]?.rate || 0;

  return (
    <div className="bg-white rounded-[48px] p-8 lg:p-12 border border-[#EAEAEA] shadow-[0_4px_32px_rgba(0,0,0,0.01)] flex flex-col transition-all duration-700 hover:shadow-[0_16px_48px_rgba(0,0,0,0.03)] group">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-3xl font-black tracking-tighter text-[#1A1A1A]">Operational Yield</h2>
            <div className="flex gap-1.5 translate-y-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <div className="w-2 h-2 rounded-full bg-gray-100" />
            </div>
          </div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">Historical Performance Matrix</p>
        </div>
        
        <div className="flex bg-[#F6F6F6] p-1.5 rounded-2xl border border-gray-100">
          {(['W', 'M', 'Y'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-8 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-500 ${
                timeframe === t 
                ? 'bg-white text-[#1A1A1A] shadow-[0_4px_12px_rgba(0,0,0,0.08)]' 
                : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {t === 'W' ? 'Weekly' : t === 'M' ? 'Monthly' : 'Yearly'}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[280px] w-full relative overflow-visible">
        <div className="absolute top-0 left-0 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] flex items-center gap-3">
          <div className="w-4 h-[1px] bg-gray-200" />
          Yield efficiency %
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 35, right: 0, left: -40, bottom: 0 }}>
            <defs>
              <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#EF4444" />
              </linearGradient>
              <linearGradient id="performanceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.15}/>
                <stop offset="50%" stopColor="#F59E0B" stopOpacity={0.05}/>
                <stop offset="100%" stopColor="#EF4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="12 12" vertical={false} stroke="#F8F8F8" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#D5D5D5', fontWeight: 900 }} 
              dy={15}
              interval={timeframe === 'W' ? 0 : 'preserveStartEnd'}
            />
            <YAxis hide domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '24px', 
                border: 'none', 
                boxShadow: '0 24px 48px -12px rgba(0,0,0,0.3)', 
                fontSize: '11px',
                fontWeight: 900,
                padding: '20px',
                backgroundColor: '#1A1A1A',
                color: '#FFF',
              }}
              cursor={{ stroke: '#EAEAEA', strokeWidth: 1, strokeDasharray: '4 4' }}
              itemStyle={{ textTransform: 'uppercase', letterSpacing: '0.15em' }}
              labelStyle={{ color: 'rgba(255,255,255,0.4)', marginBottom: '8px', textTransform: 'uppercase', fontSize: '9px' }}
              formatter={(value: number) => [
                <span style={{ color: value > 75 ? '#10B981' : value > 40 ? '#F59E0B' : '#EF4444' }}>{value}%</span>,
                'Efficiency'
              ]}
            />
            <Area 
              type="monotone" 
              dataKey="rate" 
              stroke="url(#performanceGradient)" 
              strokeWidth={6} 
              fillOpacity={1} 
              fill="url(#performanceFill)"
              animationDuration={2500}
              strokeLinecap="round"
              activeDot={{ r: 10, strokeWidth: 4, stroke: '#FFF', fill: '#1A1A1A' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-12 mt-12 pt-10 border-t border-[#F8F8F8]">
        <div className="space-y-3">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Operational Stability</div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black tracking-tighter text-[#1A1A1A]">Peak Output</span>
            <div className="flex gap-1">
              {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />)}
            </div>
          </div>
        </div>
        
        <div className="space-y-3 border-l border-[#F8F8F8] pl-12">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Live Yield</div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black tracking-tighter" style={{ color: currentRate > 75 ? '#10B981' : currentRate > 40 ? '#F59E0B' : '#EF4444' }}>{currentRate}%</span>
            <div className={`flex items-center justify-center w-7 h-7 rounded-full ${currentRate >= 50 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={currentRate >= 50 ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-3 border-l border-[#F8F8F8] pl-12">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Density Index</div>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-black tracking-tighter text-[#1A1A1A]">Mastery</span>
            <div className="flex h-6 items-end gap-1">
              {[14, 22, 32, 18, 28].map((h, i) => (
                <div key={i} className="w-1.5 rounded-full" style={{ height: `${h}px`, backgroundColor: i === 2 ? '#10B981' : '#EAEAEA' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
