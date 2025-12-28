
import React from 'react';
import { RiskLevel } from '../types';

interface RiskBadgeProps {
  level: RiskLevel;
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ level }) => {
  const styles = {
    High: 'bg-red-500 text-white shadow-lg shadow-red-200 ring-4 ring-red-100',
    Medium: 'bg-amber-500 text-white shadow-lg shadow-amber-200 ring-4 ring-amber-100',
    Low: 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 ring-4 ring-emerald-100',
  };

  return (
    <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${styles[level]}`}>
      {level} RISK ALERT
    </div>
  );
};

export default RiskBadge;
