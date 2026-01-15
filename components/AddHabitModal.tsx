
import React, { useState } from 'react';
import { Habit, Priority, Frequency } from '../types';
import { PROTOCOL_COLORS } from '../constants';

interface AddHabitModalProps {
  onClose: () => void;
  onAdd: (habit: Omit<Habit, 'id' | 'isArchived' | 'startDate'>) => void;
}

export const AddHabitModal: React.FC<AddHabitModalProps> = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [frequency, setFrequency] = useState<Frequency>('daily');
  const [notes, setNotes] = useState('');
  const [color, setColor] = useState(PROTOCOL_COLORS[0].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category) return;
    onAdd({ name, category, priority, frequency, notes, color });
    onClose();
  };

  const priorities: Priority[] = ['low', 'medium', 'high'];
  const frequencies: Frequency[] = ['daily', 'weekly'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-2xl p-4 animate-in fade-in duration-500">
      <div className="bg-white rounded-[64px] w-full max-w-2xl p-12 lg:p-16 shadow-[0_30px_90px_rgba(0,0,0,0.4)] border border-[#EAEAEA] transform animate-in slide-in-from-bottom-12 duration-700 overflow-y-auto max-h-[95vh] custom-scrollbar">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase italic leading-none">Initialize Protocol.</h2>
            <p className="text-gray-400 text-sm mt-4 font-medium">Define tactical parameters for new high-performance behaviors.</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-4 hover:bg-gray-50 rounded-full transition-all active:scale-90"
          >
            <svg className="w-8 h-8 text-gray-200 hover:text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-10">
              <div className="group">
                <label className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400 mb-4 block transition-colors group-focus-within:text-[#1A1A1A]">Protocol Identity</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cognitive Deep Work"
                  className="w-full px-0 py-3 border-b-2 border-gray-100 focus:border-[#1A1A1A] outline-none text-2xl font-black tracking-tight transition-all bg-transparent placeholder:text-gray-100 placeholder:italic"
                  autoFocus
                />
              </div>

              <div className="group">
                <label className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400 mb-4 block transition-colors group-focus-within:text-[#1A1A1A]">Core Category</label>
                <input 
                  type="text" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Productivity / Health"
                  className="w-full px-0 py-3 border-b-2 border-gray-100 focus:border-[#1A1A1A] outline-none text-xl font-bold tracking-tight transition-all bg-transparent placeholder:text-gray-100"
                />
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <label className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400 mb-5 block">Priority Hierarchy</label>
                <div className="flex p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                  {priorities.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                        priority === p ? 'bg-white text-[#1A1A1A] shadow-xl' : 'text-gray-300 hover:text-gray-500'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400 mb-5 block">Duty Cycle</label>
                <div className="flex p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                  {frequencies.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFrequency(f)}
                      className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                        frequency === f ? 'bg-white text-[#1A1A1A] shadow-xl' : 'text-gray-300 hover:text-gray-500'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400 mb-6 block">Interface Theme</label>
            <div className="flex flex-wrap gap-5">
              {PROTOCOL_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-12 h-12 rounded-full border-4 transition-all duration-500 ${
                    color === c.value ? 'ring-2 ring-offset-4 ring-[#1A1A1A] border-white scale-125 shadow-2xl z-10' : 'border-transparent opacity-30 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400 mb-4 block">Strategic constraints (Optional)</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Operational details, success criteria, or secondary triggers..."
              rows={3}
              className="w-full p-8 bg-gray-50 rounded-[40px] border border-gray-100 outline-none text-base font-semibold transition-all placeholder:text-gray-200 focus:ring-2 focus:ring-[#1A1A1A]/5 focus:bg-white custom-scrollbar leading-relaxed"
            />
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              disabled={!name || !category}
              className="w-full py-8 rounded-[40px] font-black uppercase tracking-[0.5em] text-xs text-white transition-all disabled:opacity-10 disabled:grayscale disabled:cursor-not-allowed shadow-[0_20px_40px_rgba(0,0,0,0.1)] active:scale-[0.97] relative overflow-hidden group/btn"
              style={{ backgroundColor: color }}
            >
              <div className="absolute inset-0 bg-black opacity-0 group-hover/btn:opacity-10 transition-opacity" />
              Establish Operational Protocol
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="w-full mt-4 py-4 text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 hover:text-[#1A1A1A] transition-colors"
            >
              Abort Setup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
