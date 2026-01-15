
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] w-full max-w-xl p-10 shadow-2xl border border-[#EAEAEA] transform animate-in slide-in-from-bottom-8 duration-500 overflow-y-auto max-h-[90vh] custom-scrollbar">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter uppercase italic">Initialize Protocol.</h2>
            <p className="text-gray-400 text-sm mt-1">Define the parameters of your performance ritual.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-3 block">Protocol Identity</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Deep Work Flow"
                  className="w-full px-0 py-2 border-b border-gray-200 focus:border-indigo-500 outline-none text-xl font-medium transition-colors bg-transparent placeholder:text-gray-200"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-3 block">Category Tag</label>
                <input 
                  type="text" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Productivity"
                  className="w-full px-0 py-2 border-b border-gray-200 focus:border-indigo-500 outline-none text-xl font-medium transition-colors bg-transparent placeholder:text-gray-200"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-3 block">Priority Level</label>
                <div className="flex p-1 bg-gray-50 rounded-xl">
                  {priorities.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                        priority === p ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-3 block">Frequency</label>
                <div className="flex p-1 bg-gray-50 rounded-xl">
                  {frequencies.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFrequency(f)}
                      className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                        frequency === f ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'
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
            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-3 block">Theme Color</label>
            <div className="flex flex-wrap gap-4">
              {PROTOCOL_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    color === c.value ? 'ring-2 ring-offset-2 ring-black border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-3 block">Strategic Notes</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Operational details, triggers, or success criteria..."
              rows={2}
              className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none text-sm font-medium transition-colors placeholder:text-gray-300 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={!name || !category}
              className="w-full py-5 rounded-2xl font-bold uppercase tracking-[0.3em] text-xs text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-xl shadow-black/10 active:scale-[0.98]"
              style={{ backgroundColor: color }}
            >
              Establish Protocol
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
