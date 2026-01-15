
import React from 'react';
import { Achievement } from '../types';

interface AchievementDeckProps {
  achievements: Achievement[];
}

export const AchievementDeck: React.FC<AchievementDeckProps> = ({ achievements }) => {
  return (
    <div className="bg-white rounded-[48px] p-10 border border-[#EAEAEA] shadow-[0_4px_24px_rgba(0,0,0,0.01)] relative overflow-hidden group">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-1">Honorary Registry</h3>
          <p className="text-2xl font-black tracking-tighter text-[#1A1A1A]">System Merit</p>
        </div>
        <div className="flex -space-x-2">
           {achievements.filter(a => a.unlocked).slice(0, 3).map((a, i) => (
             <div key={i} className="w-8 h-8 rounded-full bg-[#1A1A1A] border-4 border-white flex items-center justify-center text-[8px] text-white font-black">
               {a.title[0]}
             </div>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <div 
            key={achievement.id}
            className={`p-6 rounded-[32px] border transition-all duration-700 relative overflow-hidden flex flex-col justify-between min-h-[160px] ${
              achievement.unlocked 
              ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-xl shadow-black/10' 
              : 'bg-gray-50/50 border-gray-100 text-gray-300'
            }`}
          >
            {achievement.unlocked && (
              <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] bg-white/10 -mr-10 -mt-10" />
            )}
            
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-[8px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-full border ${
                  achievement.unlocked ? 'border-white/20 bg-white/5' : 'border-gray-200'
                }`}>
                  {achievement.category}
                </span>
                {achievement.unlocked && <div className="w-1 h-1 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]" />}
              </div>
              <h4 className={`text-sm font-black tracking-tight mb-2 ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
                {achievement.title}
              </h4>
              <p className={`text-[10px] leading-relaxed font-medium ${achievement.unlocked ? 'text-gray-400' : 'text-gray-300'}`}>
                {achievement.description}
              </p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[8px] font-black uppercase tracking-widest opacity-40">
                {achievement.unlocked ? 'Honor Unlocked' : 'Pending Authorization'}
              </span>
              <svg className={`w-3 h-3 ${achievement.unlocked ? 'text-green-400' : 'text-gray-200'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={achievement.unlocked ? "M5 13l4 4L19 7" : "M12 15l3 3m0 0l3-3m-3 3V6"} />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
