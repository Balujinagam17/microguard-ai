
import React from 'react';
import { Region, WeatherData, SocialSignal, RiskAssessment } from '../types';
import RiskBadge from './RiskBadge';

interface MainDashboardProps {
  region: Region;
  weather?: WeatherData;
  social: SocialSignal[];
  assessment: RiskAssessment | null;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}

const MainDashboard: React.FC<MainDashboardProps> = ({ region, weather, social, assessment, isAnalyzing, onAnalyze }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <nav className="text-xs text-slate-400 font-medium mb-1">DASHBOARD / {region.type.toUpperCase()} / {region.name.toUpperCase()}</nav>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">{region.name}</h2>
          <p className="text-slate-500 mt-2 max-w-xl">
            Hyper-local analysis for micro-region monitoring. Combines sensor data and social signals for early detection.
          </p>
        </div>
        <button 
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            isAnalyzing 
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100 active:scale-95'
          }`}
        >
          {isAnalyzing ? (
            <>
              <svg className="animate-spin h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>ANALYZING TRENDS...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              <span>GENERATE AI PREDICTION</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Weather Inputs</h3>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded">SENSOR LIVE</span>
          </div>
          {weather ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-400 font-medium uppercase mb-1">Temp</p>
                <p className="text-2xl font-bold text-slate-700">{weather.temperature}°C</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-400 font-medium uppercase mb-1">Rainfall</p>
                <p className="text-2xl font-bold text-slate-700">{weather.rainfall}mm</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-400 font-medium uppercase mb-1">Humidity</p>
                <p className="text-2xl font-bold text-slate-700">{weather.humidity}%</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-400 font-medium uppercase mb-1">Wind</p>
                <p className="text-2xl font-bold text-slate-700">{weather.windSpeed}k/h</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 bg-slate-50 rounded-xl border-2 border-dashed border-slate-100">
               <p className="text-xs text-slate-400 italic">Syncing weather sensors...</p>
            </div>
          )}
        </div>

        {/* Social Signals Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Local Social Signals</h3>
            <span className="text-[10px] font-bold bg-purple-50 text-purple-600 px-2 py-0.5 rounded">REAL-TIME FEEDS</span>
          </div>
          <div className="space-y-4">
            {social.length > 0 ? social.map(s => (
              <div key={s.id} className="flex space-x-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${s.sentiment === 'Alert' ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-700">@LocalObserver</span>
                    <span className="text-[10px] text-slate-400">{s.timestamp}</span>
                  </div>
                  <p className="text-sm text-slate-600 italic">"{s.text}"</p>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                 <svg className="w-12 h-12 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 <p className="text-sm">No significant social signals detected in this region.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Reasoning Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           {assessment ? (
            <div className={`rounded-2xl border-2 p-8 ${
                assessment.riskLevel === 'High' ? 'bg-red-50/50 border-red-100' : 
                assessment.riskLevel === 'Medium' ? 'bg-amber-50/50 border-amber-100' : 
                'bg-emerald-50/50 border-emerald-100'
              }`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <div>
                    <RiskBadge level={assessment.riskLevel} />
                    <h4 className="text-2xl font-black text-slate-900 mt-4 leading-tight">{assessment.humanReadableWarning}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Confidence Score</p>
                    <div className="flex items-center justify-end space-x-2">
                      <span className="text-3xl font-black text-slate-800">{assessment.probability}%</span>
                      <div className="w-24 h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full ${assessment.riskLevel === 'High' ? 'bg-red-500' : assessment.riskLevel === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${assessment.probability}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white/80 backdrop-blur p-6 rounded-xl border border-white shadow-sm">
                    <h5 className="text-sm font-bold text-slate-800 mb-4 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      AI REASONING
                    </h5>
                    <p className="text-sm text-slate-600 leading-relaxed">{assessment.reasoning}</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur p-6 rounded-xl border border-white shadow-sm">
                    <h5 className="text-sm font-bold text-slate-800 mb-4 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                      SUGGESTED ACTIONS
                    </h5>
                    <ul className="space-y-2">
                      {assessment.suggestedActions.map((action, idx) => (
                        <li key={idx} className="text-sm text-slate-600 flex items-start">
                          <span className="w-5 h-5 bg-indigo-50 text-indigo-500 text-[10px] flex items-center justify-center rounded-full mr-2 mt-0.5 shrink-0 font-bold">{idx + 1}</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
              </div>
              <h4 className="text-lg font-bold text-slate-800">No Assessment Yet</h4>
              <p className="text-sm text-slate-400 max-w-xs mt-1">Run the AI prediction to analyze current weather and social signals for this region.</p>
              <button 
                onClick={onAnalyze} 
                className="mt-6 text-sm font-bold text-indigo-600 hover:text-indigo-700 underline"
              >
                Run initial analysis
              </button>
            </div>
          )}
        </div>

        {/* System Logs */}
        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl shadow-slate-200 h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Prediction Logs</h3>
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            </div>
          </div>
          <div className="flex-1 font-mono text-[10px] text-emerald-400 overflow-y-auto space-y-1">
            <p className="opacity-50">[{new Date().toLocaleTimeString()}] Init region monitor: {region.id}</p>
            <p className="opacity-50">[{new Date().toLocaleTimeString()}] Syncing real-time records...</p>
            <p className="opacity-50">[{new Date().toLocaleTimeString()}] Weather sensor payload check...</p>
            <p className="opacity-50">[{new Date().toLocaleTimeString()}] Scraper detected {social.length} signals.</p>
            {isAnalyzing && (
              <>
                <p className="text-white animate-pulse">[{new Date().toLocaleTimeString()}] EXECUTING GEMINI PATTERN RECOGNITION...</p>
                {weather && <p className="text-indigo-400">[{new Date().toLocaleTimeString()}] Correlation: Rain({weather.rainfall}) with Terrain(Lat {region.lat})</p>}
              </>
            )}
            {assessment && (
              <>
                <p className="text-indigo-300">[{new Date().toLocaleTimeString()}] Gemini model processing complete.</p>
                <p className="text-indigo-300">[{new Date().toLocaleTimeString()}] Detected: {assessment.disasterType} ({assessment.riskLevel} Risk)</p>
                <p className="text-white">[{new Date().toLocaleTimeString()}] ALERT DISPATCHED TO MOBILE DASHBOARD.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
