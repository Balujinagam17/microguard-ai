
import React from 'react';
import { Region, RiskAssessment } from '../types';

interface SidebarProps {
  regions: Region[];
  selectedRegionId: string | null;
  onSelectRegion: (id: string) => void;
  onAddClick: () => void;
  assessments: Record<string, RiskAssessment>;
}

const Sidebar: React.FC<SidebarProps> = ({ regions, selectedRegionId, onSelectRegion, onAddClick, assessments }) => {
  return (
    <div className="w-80 bg-white border-r border-slate-200 h-screen flex flex-col overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-indigo-700">MicroGuard AI</h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Region Intelligence</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="flex items-center justify-between px-2 pb-2">
          <p className="text-xs font-bold text-slate-400">VILLAGES & TOWNS</p>
          <button 
            onClick={onAddClick}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center bg-indigo-50 px-2 py-1 rounded-md"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
            ADD
          </button>
        </div>
        {regions.map(region => {
          const assessment = assessments[region.id];
          const riskColor = assessment?.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                           assessment?.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-700' :
                           'bg-emerald-100 text-emerald-700';
                           
          return (
            <button
              key={region.id}
              onClick={() => onSelectRegion(region.id)}
              className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center justify-between group ${
                selectedRegionId === region.id 
                ? 'bg-indigo-50 border-indigo-100 ring-2 ring-indigo-500/20' 
                : 'hover:bg-slate-50 border-transparent'
              } border`}
            >
              <div className="flex-1 min-w-0 pr-2">
                <p className={`font-semibold text-sm truncate ${selectedRegionId === region.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                  {region.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{region.district}, {region.state}</p>
              </div>
              {assessment && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${riskColor}`}>
                  {assessment.riskLevel}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <div className="flex items-center space-x-2 text-slate-400">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-medium uppercase tracking-tight">System Monitoring: {regions.length} Micro-regions</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
