
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { INITIAL_HABITS, INITIAL_LOGS, COLORS } from './constants';
import { Habit, HabitLog, Achievement } from './types';
import { HabitCard } from './components/HabitCard';
import { AnalyticsSection } from './components/AnalyticsSection';
import { AddHabitModal } from './components/AddHabitModal';
import { CalendarView } from './components/CalendarView';
import { InsightsPanel } from './components/InsightsPanel';
import { IntegrityMatrix } from './components/IntegrityMatrix';
import { AchievementDeck } from './components/AchievementDeck';

const App: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('ritual_habits');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });
  
  const [logs, setLogs] = useState<HabitLog[]>(() => {
    const saved = localStorage.getItem('ritual_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [activeTab, setActiveTab] = useState<'today' | 'analytics' | 'habits'>('today');
  const [timeframe, setTimeframe] = useState<'W' | 'M' | 'Y'>('W');
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [decommissionId, setDecommissionId] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    localStorage.setItem('ritual_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('ritual_logs', JSON.stringify(logs));
  }, [logs]);

  // Achievement Engine
  const achievements = useMemo((): Achievement[] => {
    const totalCompletions = logs.length;
    const maxStreak = 12; // Static for demo, would be calculated from logs
    const masteryCount = habits.filter(h => {
        const rate = (logs.filter(l => l.habitId === h.id).length / 30) * 100;
        return rate > 90;
    }).length;

    return [
      {
        id: 'streak-7',
        title: 'Vanguard Protocol',
        description: 'Establish a consistent 7-day operational chain.',
        requirement: '7 Day Streak',
        unlocked: maxStreak >= 7,
        category: 'streak'
      },
      {
        id: 'volume-100',
        title: 'Century Merit',
        description: 'Successfully log 100 high-performance rituals.',
        requirement: '100 Logs',
        unlocked: totalCompletions >= 100,
        category: 'volume'
      },
      {
        id: 'mastery-1',
        title: 'Peak Efficiency',
        description: 'Maintain 90%+ integrity on a primary protocol for 30 days.',
        requirement: '1 Mastery Habit',
        unlocked: masteryCount >= 1,
        category: 'mastery'
      }
    ];
  }, [logs, habits]);

  const computedInsights = useMemo(() => {
    if (habits.length === 0) return [];
    const insights = [];
    
    const dayWeights: Record<number, number> = {};
    logs.forEach(l => {
      const d = new Date(l.date).getDay();
      dayWeights[d] = (dayWeights[d] || 0) + 1;
    });
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const bestDayIdx = Object.keys(dayWeights).reduce((a, b) => (dayWeights[Number(a)] || 0) > (dayWeights[Number(b)] || 0) ? a : b, '1');
    insights.push({
      label: 'Tactical Peak',
      value: `Max output identified on ${days[Number(bestDayIdx)]} cycles.`,
      type: 'positive' as const
    });

    const last7Days = Array.from({length: 7}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    });
    
    const atRisk = habits.find(h => {
      const completions = logs.filter(l => l.habitId === h.id && last7Days.includes(l.date)).length;
      return completions < 2 && completions > 0;
    });

    if (atRisk) {
      insights.push({
        label: 'Variance Alert',
        value: `"${atRisk.name}" is showing drop-off. Audit protocol.`,
        type: 'warning' as const
      });
    }

    const velocity = Math.round((logs.length / 500) * 100);
    insights.push({
        label: 'System Momentum',
        value: `Protocol density at ${velocity}% capacity.`,
        type: 'neutral' as const
    });

    return insights;
  }, [habits, logs]);

  const handleToggleHabit = useCallback((habitId: string) => {
    setLogs(prev => {
      const exists = prev.find(l => l.habitId === habitId && l.date === today);
      if (exists) {
        return prev.filter(l => !(l.habitId === habitId && l.date === today));
      } else {
        return [...prev, { habitId, date: today, completed: true }];
      }
    });
  }, [today]);

  const handleAddHabit = (newHabitData: Omit<Habit, 'id' | 'isArchived' | 'startDate'>) => {
    const newHabit: Habit = {
      ...newHabitData,
      id: Math.random().toString(36).substr(2, 9),
      startDate: new Date().toISOString().split('T')[0],
      isArchived: false
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const executeDecommission = () => {
    if (decommissionId) {
      setHabits(prev => prev.filter(h => h.id !== decommissionId));
      setLogs(prev => prev.filter(l => l.habitId !== decommissionId));
      setDecommissionId(null);
    }
  };

  const completionRate = habits.length > 0 
    ? Math.round(
        (logs.filter(l => {
          const d = new Date(l.date);
          const limit = new Date();
          limit.setDate(limit.getDate() - 30);
          return d >= limit && l.completed;
        }).length / (habits.length * 30)) * 100
      )
    : 0;

  const currentStreak = habits.length > 0 ? 12 : 0;
  const statusColor = completionRate > 75 ? COLORS.forestGreen : completionRate > 40 ? COLORS.vibrantYellow : COLORS.criticalRed;

  const dailyCompletions = logs.filter(l => l.date === today && l.completed).length;
  const dailyTarget = habits.length;
  const dailyProgress = dailyTarget > 0 ? (dailyCompletions / dailyTarget) * 100 : 0;

  return (
    <div className="min-h-screen max-w-[1536px] mx-auto flex flex-col lg:flex-row bg-[#F9F9F8]">
      {/* Sidebar Navigation */}
      <nav className="hidden lg:flex w-[320px] flex-col border-r border-[#EAEAEA] p-12 h-screen sticky top-0 bg-[#F9F9F8] z-40">
        <div className="mb-20">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-[#1A1A1A]">Ritual<span className="text-gray-300">.</span></h1>
          <p className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400 mt-2">Performance OS Alpha</p>
        </div>
        
        <div className="flex flex-col gap-12">
          {(['today', 'analytics', 'habits'] as const).map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-6 group ${activeTab === tab ? 'text-[#1A1A1A]' : 'text-gray-300 hover:text-gray-500'}`}
            >
              <div 
                className={`w-2 h-2 rounded-full transition-all duration-700 ${activeTab === tab ? 'scale-150 shadow-[0_0_15px_rgba(0,0,0,0.1)]' : 'bg-transparent opacity-0 group-hover:opacity-100 group-hover:bg-gray-200'}`} 
                style={{ backgroundColor: activeTab === tab ? statusColor : undefined }} 
              />
              {tab === 'today' ? 'Strategic Focus' : tab === 'analytics' ? 'Matrix Deep' : 'Core Registry'}
            </button>
          ))}
        </div>

        <div className="mt-auto">
          <div className="p-10 bg-[#1A1A1A] rounded-[48px] text-white shadow-3xl shadow-black/40 border border-white/5 relative overflow-hidden group">
             <div className={`absolute -bottom-10 -right-10 w-48 h-48 blur-[80px] opacity-20 transition-all duration-1000 ${completionRate > 80 ? 'animate-pulse scale-150' : ''}`} style={{ backgroundColor: statusColor }} />
            <div className="relative z-10">
              <div className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-black mb-2">Integrity Index</div>
              <div className="text-5xl font-black tracking-tighter">
                {completionRate}<span className="text-xs opacity-30 ml-2 uppercase tracking-widest">Yield</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full mt-8 overflow-hidden">
                <div className="h-full transition-all duration-1000 ease-out" style={{ width: `${completionRate}%`, backgroundColor: statusColor }} />
              </div>
            </div>
          </div>
          <button 
            onClick={() => { if(window.confirm("CRITICAL: All local operational data will be purged. Continue?")) { localStorage.clear(); window.location.reload(); }}}
            className="mt-8 text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 hover:text-red-500 transition-colors w-full text-left"
          >
            System Wipe
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-8 lg:p-16 lg:pl-20 overflow-y-auto custom-scrollbar">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-12">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-gray-400 flex items-center gap-4">
              {activeTab === 'today' ? 'Strategic Interface' : activeTab === 'analytics' ? 'Output Intelligence' : 'Registry Config'}
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            </span>
            <h2 className="text-6xl lg:text-7xl font-black tracking-tighter text-[#1A1A1A] leading-[0.85]">
              {activeTab === 'today' ? 'The Ritual.' : activeTab === 'analytics' ? 'Deep Stream.' : 'The Stack.'}
            </h2>
          </div>
          
          <div className="flex gap-20 h-fit items-center border-l border-[#EAEAEA] pl-16">
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-300">Run Streak</div>
              <div className="text-4xl font-black flex items-baseline gap-2">
                {currentStreak} <span className="text-[10px] text-gray-300 uppercase font-black">Days</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-300">Daily Target</div>
              <div className="text-4xl font-black" style={{ color: statusColor }}>
                {dailyCompletions}/{dailyTarget}
              </div>
            </div>
          </div>
        </header>

        {/* Global Progress Bar Strip */}
        <div className="mb-12 bg-white p-2 rounded-full border border-[#EAEAEA] shadow-sm flex items-center overflow-hidden">
             <div className="h-4 rounded-full transition-all duration-1000 ease-out flex items-center justify-end px-4" style={{ width: `${dailyProgress}%`, backgroundColor: statusColor }}>
                <span className="text-[8px] font-black text-white uppercase tracking-widest">{Math.round(dailyProgress)}% established</span>
             </div>
        </div>

        <div className="space-y-12">
          {activeTab === 'today' && (
            <>
              {/* FULL WIDTH PERFORMANCE HORIZON */}
              <AnalyticsSection habits={habits} logs={logs} timeframe={timeframe} setTimeframe={setTimeframe} statusColor={statusColor} />

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
                {/* TACTICAL EXECUTION COLUMN */}
                <div className="xl:col-span-8 space-y-12">
                  <section>
                    <div className="flex items-center justify-between mb-8">
                      <div>
                          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-1">Ritual Pipeline</h2>
                          <p className="text-xl font-black tracking-tighter text-[#1A1A1A]">Tactical Execution</p>
                      </div>
                      <button 
                          onClick={() => setIsAddingHabit(true)}
                          className="bg-[#1A1A1A] text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-black/10 hover:bg-black transition-all active:scale-95 flex items-center gap-3"
                      >
                          <span>Initialize Protocol</span>
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                          </svg>
                      </button>
                    </div>
                    
                    <div className="bg-white rounded-[56px] border border-[#EAEAEA] overflow-hidden shadow-[0_12px_48px_rgba(0,0,0,0.02)]">
                      {habits.length > 0 ? (
                        habits.map(habit => (
                          <HabitCard 
                            key={habit.id}
                            habit={habit}
                            completed={logs.some(l => l.habitId === habit.id && l.date === today && l.completed)}
                            onToggle={handleToggleHabit}
                            onDelete={(id) => setDecommissionId(id)}
                          />
                        ))
                      ) : (
                        <div className="py-32 text-center group cursor-pointer" onClick={() => setIsAddingHabit(true)}>
                          <div className="text-gray-200 font-black uppercase tracking-[0.6em] italic mb-6">Pipeline Clear</div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black group-hover:text-[#1A1A1A] transition-colors border border-dashed border-gray-200 inline-block px-10 py-4 rounded-full">Initialize Ritual</p>
                        </div>
                      )}
                    </div>
                  </section>
                  
                  <IntegrityMatrix habits={habits} logs={logs} />
                  <AchievementDeck achievements={achievements} />
                </div>

                {/* INTELLIGENCE SIDEBAR */}
                <div className="xl:col-span-4 space-y-12 h-fit xl:sticky xl:top-12">
                  <CalendarView habits={habits} logs={logs} />
                  <InsightsPanel insights={computedInsights} isLoading={false} />
                  <div className="bg-[#1A1A1A] rounded-[40px] p-10 text-white relative overflow-hidden group shadow-2xl">
                     <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 bg-emerald-500 -mr-10 -mt-10" />
                     <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-2">Momentum Engine</h4>
                     <p className="text-lg font-black tracking-tighter mb-8 leading-tight">System operational at peak efficiency levels.</p>
                     <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 4 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-white/10'}`} />)}
                     </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'analytics' && (
            <div className="xl:col-span-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
               <AnalyticsSection habits={habits} logs={logs} timeframe={timeframe} setTimeframe={setTimeframe} statusColor={statusColor} />
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <IntegrityMatrix habits={habits} logs={logs} />
                  <div className="space-y-12">
                     <CalendarView habits={habits} logs={logs} />
                     <AchievementDeck achievements={achievements} />
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'habits' && (
            <div className="xl:col-span-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
               <div className="flex flex-col md:flex-row justify-between items-center bg-white p-12 lg:p-16 rounded-[64px] border border-[#EAEAEA] shadow-sm gap-12">
                <div className="max-w-xl">
                  <h3 className="text-5xl font-black tracking-tighter text-[#1A1A1A]">System Protocols.</h3>
                  <p className="text-gray-400 text-base mt-4 font-medium leading-relaxed">Deconstruct your high-performance behavior architecture. Audit, refactor, or decommission protocols to maintain operational integrity.</p>
                </div>
                <button 
                  onClick={() => setIsAddingHabit(true)}
                  className="bg-[#1A1A1A] text-white px-16 py-6 lg:px-20 lg:py-8 rounded-[32px] text-xs font-black uppercase tracking-[0.5em] shadow-3xl shadow-black/20 hover:bg-black transition-all active:scale-95 whitespace-nowrap"
                >
                  New Protocol
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                {habits.map(habit => (
                  <div key={habit.id} className="bg-white p-10 lg:p-14 border border-[#EAEAEA] rounded-[64px] hover:border-[#1A1A1A] transition-all duration-700 group shadow-sm flex flex-col justify-between h-full relative overflow-hidden hover:-translate-y-4">
                    <div className="absolute top-0 right-0 w-64 h-64 blur-[120px] opacity-10 transition-all duration-1000 group-hover:opacity-30" style={{ backgroundColor: habit.color }} />
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-12 lg:mb-16">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] px-6 py-3 lg:px-8 lg:py-4 rounded-full bg-gray-50 text-gray-400 border border-gray-100 group-hover:bg-[#1A1A1A] group-hover:text-white transition-all duration-700">
                          {habit.category}
                        </span>
                        <div className={`text-[9px] font-black uppercase tracking-[0.4em] px-4 py-2 lg:px-6 lg:py-3 rounded-2xl border ${habit.priority === 'high' ? 'text-red-500 border-red-100 bg-red-50/50' : 'text-gray-300 border-gray-100 bg-gray-50'}`}>
                          {habit.priority}
                        </div>
                      </div>
                      <h4 className="text-4xl lg:text-5xl font-black tracking-tighter mb-8 lg:mb-10 group-hover:text-[#1A1A1A] transition-colors leading-[0.9]">{habit.name}</h4>
                      <p className="text-sm text-gray-400 mb-12 lg:mb-16 leading-relaxed font-semibold italic opacity-60">
                        "{habit.notes || 'No constraints defined.'}"
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-12 lg:pt-16 border-t border-gray-50 relative z-10">
                      <div className="flex items-center gap-4 lg:gap-6">
                        <div className="w-4 h-4 rounded-full shadow-inner" style={{ backgroundColor: habit.color }} />
                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em]">{habit.frequency}</span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setDecommissionId(habit.id); }}
                        className="p-4 lg:p-5 text-gray-300/40 hover:text-red-500 transition-all rounded-3xl hover:bg-red-50 active:scale-75"
                        title="Decommission Protocol"
                      >
                        <svg className="w-6 h-6 lg:w-7 lg:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <footer className="mt-40 mb-20 pt-16 border-t border-[#EAEAEA] flex flex-col md:flex-row items-center justify-between gap-12 text-[11px] font-black uppercase tracking-[0.5em] text-gray-300">
          <div>Ritual Terminal &bull; Operational Stack v1.8 &bull; © 2024</div>
          <div className="flex gap-16 items-center">
            <div className="flex items-center gap-4">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: statusColor }} />
              <span>Core Integrity: {completionRate}%</span>
            </div>
            <span>Status: Operational</span>
          </div>
        </footer>
      </main>

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-3xl border-t border-[#EAEAEA] flex justify-around p-8 z-50 shadow-2xl">
        {(['today', 'analytics', 'habits'] as const).map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)} 
            className={`flex flex-col items-center gap-3 transition-all duration-700 ${activeTab === tab ? 'text-[#1A1A1A] scale-110' : 'text-gray-300'}`}
          >
            <div className={`w-1.5 h-1.5 rounded-full mb-1 transition-all duration-700 ${activeTab === tab ? 'bg-black scale-150 shadow-[0_0_12px_rgba(0,0,0,0.2)]' : 'bg-transparent'}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.25em]">{tab === 'today' ? 'Hub' : tab === 'analytics' ? 'Matrix' : 'Registry'}</span>
          </button>
        ))}
      </nav>

      {/* Modals */}
      {isAddingHabit && <AddHabitModal onClose={() => setIsAddingHabit(false)} onAdd={handleAddHabit} />}
      
      {decommissionId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-2xl p-6 animate-in fade-in duration-500">
          <div className="bg-white rounded-[64px] w-full max-w-xl p-12 lg:p-16 shadow-4xl border border-[#EAEAEA] transform animate-in zoom-in-95 duration-700">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-10 border border-red-100 shadow-inner">
                <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h2 className="text-4xl font-black tracking-tighter text-[#1A1A1A] mb-6 uppercase italic leading-none">Decommission Protocol?</h2>
              <p className="text-gray-500 font-semibold leading-relaxed mb-12 max-w-md text-sm">
                Operational data associated with this ritual will be permanently purged. This action cannot be reversed within the current command instance.
              </p>
              <div className="flex flex-col w-full gap-6">
                <button 
                  onClick={executeDecommission}
                  className="w-full py-7 bg-red-500 text-white rounded-[32px] text-xs font-black uppercase tracking-[0.4em] shadow-2xl shadow-red-500/30 hover:bg-red-600 transition-all active:scale-95"
                >
                  Authorize Decommission
                </button>
                <button 
                  onClick={() => setDecommissionId(null)}
                  className="w-full py-7 bg-gray-50 text-gray-400 rounded-[32px] text-xs font-black uppercase tracking-[0.4em] hover:bg-gray-100 transition-all"
                >
                  Abort Operation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
