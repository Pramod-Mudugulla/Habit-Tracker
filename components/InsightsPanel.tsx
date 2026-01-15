
import React from 'react';

interface Insight {
  label: string;
  value: string;
  type: 'positive' | 'warning' | 'neutral';
}

interface InsightsPanelProps {
  insights: Insight[];
  isLoading: boolean;
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({ insights, isLoading }) => {
  return (
    <div className="bg-white rounded-[40px] p-10 border border-[#EAEAEA] shadow-sm relative overflow-hidden group">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1">Local Analytics Engine</h3>
          <p className="text-xl font-black tracking-tight text-[#1A1A1A]">Strategic Insights</p>
        </div>
        <div className="p-3 rounded-2xl border border-gray-100 bg-gray-50/50">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
      </div>

      <div className="space-y-8">
        {insights.map((insight, idx) => (
          <div key={idx} className="animate-in fade-in slide-in-from-left duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-1.5 h-1.5 rounded-full ${
                insight.type === 'positive' ? 'bg-green-500' : 
                insight.type === 'warning' ? 'bg-red-500' : 'bg-gray-300'
              }`} />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">{insight.label}</span>
            </div>
            <p className="text-sm font-semibold text-gray-700 leading-tight pl-4 border-l border-gray-100">{insight.value}</p>
          </div>
        ))}
        {insights.length === 0 && (
          <p className="text-sm text-gray-300 italic py-4">Generating behavioral baseline...</p>
        )}
      </div>

      <div className="mt-10 pt-8 border-t border-[#F8F8F8] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300">Engine: Offline-Deterministic</span>
        </div>
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-200">Ref: RITUAL-OS-v1.8</span>
      </div>
    </div>
  );
};
