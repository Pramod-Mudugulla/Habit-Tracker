
import React from 'react';
import { Habit, HabitLog } from '../types';

interface IntegrityMatrixProps {
  habits: Habit[];
  logs: HabitLog[];
}

export const IntegrityMatrix: React.FC<IntegrityMatrixProps> = ({ habits, logs }) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  return (
    <div className="bg-white rounded-[48px] p-10 border border-[#EAEAEA] shadow-[0_4px_24px_rgba(0,0,0,0.01)] relative overflow-hidden group">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-1">Stability Audit</h3>
          <p className="text-2xl font-black tracking-tighter text-[#1A1A1A]">Internal Protocol Integrity</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">System Status</span>
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)] animate-pulse" />
          </div>
          <div className="h-8 w-[1px] bg-gray-100 hidden md:block" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300">Ref: Alpha-9</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {habits.slice(0, 4).map((h) => {
          const habitLogs = logs.filter(l => l.habitId === h.id);
          const rate = Math.round((habitLogs.filter(l => {
             const d = new Date(l.date);
             const limit = new Date();
             limit.setDate(limit.getDate() - 30);
             return d >= limit;
          }).length / 30) * 100);

          return (
            <div key={h.id} className="relative group/item flex flex-col p-6 rounded-[32px] border border-transparent hover:border-gray-100 hover:bg-gray-50/30 transition-all duration-500">
              <div 
                className="absolute top-0 left-6 right-6 h-[2px] rounded-full opacity-30 group-hover/item:opacity-100 transition-all duration-500" 
                style={{ backgroundColor: h.color || '#1A1A1A' }} 
              />
              
              <div className="flex justify-between items-start mb-6 pt-2">
                <div className="max-w-[70%]">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-[#1A1A1A] mb-2 truncate" title={h.name}>{h.name}</h4>
                  <div className="flex gap-1">
                    {last7Days.map((date, i) => {
                      const completed = logs.some(l => l.habitId === h.id && l.date === date && l.completed);
                      return (
                        <div 
                          key={i} 
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-700 ${completed ? '' : 'bg-gray-100'}`}
                          style={{ 
                            backgroundColor: completed ? h.color : undefined,
                            boxShadow: completed ? `0 0 10px ${h.color}44` : 'none'
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black tracking-tighter text-[#1A1A1A] leading-none">{rate}%</span>
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-300 mt-1">30D</p>
                </div>
              </div>

              <div className="mt-auto">
                <div className="h-1 w-full bg-gray-100/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-1000 ease-out" 
                    style={{ width: `${rate}%`, backgroundColor: h.color || '#1A1A1A' }} 
                  />
                </div>
              </div>
            </div>
          );
        })}
        
        {habits.length < 4 && Array.from({ length: 4 - habits.length }).map((_, i) => (
          <div key={`empty-${i}`} className="flex flex-col items-center justify-center p-6 rounded-[32px] border border-dashed border-gray-100 opacity-40">
            <div className="w-2 h-2 rounded-full bg-gray-100 mb-2" />
            <span className="text-[8px] font-black uppercase tracking-widest text-gray-300">Vacant Protocol</span>
          </div>
        ))}
      </div>
    </div>
  );
};
