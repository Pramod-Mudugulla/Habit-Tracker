
import React from 'react';
import { Habit } from '../types';

interface HabitCardProps {
  habit: Habit;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, completed, onToggle, onDelete }) => {
  const habitColor = habit.color || '#1A1A1A';

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(habit.id);
    }
  };

  return (
    <div 
      className="group flex items-center justify-between py-6 px-8 border-b border-[#EAEAEA] hover:bg-gray-50/50 transition-all duration-300 cursor-pointer relative overflow-hidden"
      onClick={() => onToggle(habit.id)}
    >
      <div className="flex flex-col relative z-10">
        <span className={`text-lg font-bold tracking-tight transition-all duration-500 ${completed ? 'text-gray-300 line-through scale-95' : 'text-[#1A1A1A]'}`}>
          {habit.name}
        </span>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: habitColor }} />
          <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-black">
            {habit.category} • {habit.priority}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-6 relative z-10">
        {onDelete && (
          <button 
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 hover:text-red-500 text-gray-300 active:scale-75"
            title="Decommission Protocol"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}

        <div 
          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-700 ${
            completed 
            ? 'border-transparent shadow-lg' 
            : 'border-gray-100 group-hover:border-gray-200 bg-white'
          }`}
          style={{ 
            backgroundColor: completed ? habitColor : 'transparent',
            boxShadow: completed ? `0 10px 20px -5px ${habitColor}44` : 'none'
          }}
        >
          {completed && (
            <svg className="w-6 h-6 text-white animate-in zoom-in duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};
