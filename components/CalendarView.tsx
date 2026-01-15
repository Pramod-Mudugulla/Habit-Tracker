
import React, { useMemo } from 'react';
import { HabitLog, Habit } from '../types';

interface CalendarViewProps {
  logs: HabitLog[];
  habits: Habit[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ logs, habits }) => {
  const calendarData = useMemo(() => {
    const today = new Date();
    const days = [];
    // 35 days for a dense 5x7 dashboard view
    for (let i = 34; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLogs = logs.filter(l => l.habitId && l.date === dateStr && l.completed);
      const rate = habits.length > 0 ? dayLogs.length / habits.length : 0;
      
      days.push({
        date: dateStr,
        day: d.getDate(),
        rate,
        isToday: dateStr === today.toISOString().split('T')[0]
      });
    }
    return days;
  }, [logs, habits]);

  const getHeatmapColor = (rate: number) => {
    if (rate === 0) return '#F7F7F7'; 
    if (rate <= 0.15) return '#FEE2E2'; // Softest Red
    if (rate <= 0.30) return '#FECACA'; // Light Red
    if (rate <= 0.45) return '#FCA5A5'; // Muted Red/Coral
    if (rate <= 0.60) return '#FEF3C7'; // Yellow/Amber
    if (rate <= 0.75) return '#D1FAE5'; // Light Green
    if (rate <= 0.90) return '#10B981'; // Vibrant Green
    return '#064E3B'; // Peak Mastery Dark Green
  };

  return (
    <div className="bg-white rounded-[40px] p-8 lg:p-10 border border-[#EAEAEA] shadow-[0_4px_30px_rgba(0,0,0,0.015)] flex flex-col transition-all duration-700 hover:shadow-[0_12px_40px_rgba(0,0,0,0.03)]">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-xl font-black tracking-tight uppercase italic text-[#1A1A1A]">System Continuity</h2>
          <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.3em] mt-1.5">Behavior Density Matrix</p>
        </div>
        <div className="flex -space-x-1">
          {[ '#FEE2E2', '#FEF3C7', '#10B981', '#064E3B' ].map((color, i) => (
            <div 
              key={i} 
              className="w-3 h-3 rounded-full border-2 border-white shadow-sm ring-1 ring-black/5" 
              style={{ backgroundColor: color, zIndex: 4 - i }} 
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-7 gap-3 md:gap-3.5 mb-8">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-[10px] font-black text-gray-200 text-center uppercase tracking-[0.2em] mb-1">{day}</div>
        ))}
        {calendarData.map((day, idx) => (
          <div 
            key={idx} 
            className="group relative flex flex-col items-center"
          >
            <div 
              className={`w-full aspect-square rounded-[14px] transition-all duration-500 cursor-none transform hover:scale-125 hover:z-20 hover:shadow-xl ${
                day.isToday ? 'ring-2 ring-offset-4 ring-[#1A1A1A] ring-opacity-100' : 'border border-black/5'
              }`}
              style={{ 
                backgroundColor: getHeatmapColor(day.rate),
              }}
            />
            
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[#1A1A1A] text-white text-[9px] font-black px-4 py-2 rounded-[16px] whitespace-nowrap z-50 pointer-events-none shadow-[0_10px_20px_rgba(0,0,0,0.3)] transform -translate-y-2 group-hover:translate-y-0 flex items-center gap-2">
              <span className="opacity-40 uppercase tracking-widest">{day.date}</span>
              <span style={{ color: day.rate > 0.75 ? '#10B981' : day.rate > 0.4 ? '#F59E0B' : '#EF4444' }} className="uppercase tracking-widest font-black">
                {Math.round(day.rate * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-[#F8F8F8] flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]">Operational Flow</span>
        </div>
        <div className="flex items-center gap-1 px-3 py-1.5 bg-[#F9F9F9] rounded-full border border-gray-100">
          <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 mr-1.5">Low</span>
          {[0, 0.3, 0.6, 1].map((r, i) => (
            <div 
              key={i} 
              className="w-2 h-2 rounded-full shadow-xs" 
              style={{ backgroundColor: getHeatmapColor(r) }} 
            />
          ))}
          <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1.5">Peak</span>
        </div>
      </div>
    </div>
  );
};
