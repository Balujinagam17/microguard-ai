
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import MainDashboard from './components/MainDashboard';
import AddRegionModal from './components/AddRegionModal';
import { AppState, Region, WeatherData } from './types';
import { MOCK_REGIONS, INITIAL_WEATHER, MOCK_SOCIAL } from './constants';
import { analyzeRegionRisk } from './services/geminiService';
import { geocodeMicroRegion, generateMockWeather } from './services/geoService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    regions: MOCK_REGIONS,
    selectedRegionId: MOCK_REGIONS[0].id,
    weatherData: INITIAL_WEATHER,
    socialSignals: MOCK_SOCIAL,
    assessments: {},
    isAnalyzing: false,
    isGeocoding: false,
  });

  // Use a ref to always have access to the latest state in async callbacks
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedRegion = state.regions.find(r => r.id === state.selectedRegionId) || state.regions[0];

  const handleSelectRegion = (id: string) => {
    setState(prev => ({ ...prev, selectedRegionId: id }));
  };

  const runAnalysis = useCallback(async (targetRegion?: Region, overrideWeather?: WeatherData) => {
    // Get the latest region context from ref if not provided as target
    const currentSelectedId = stateRef.current.selectedRegionId;
    const region = targetRegion || stateRef.current.regions.find(r => r.id === currentSelectedId);
    
    if (!region) return;
    
    setState(prev => ({ ...prev, isAnalyzing: true }));
    
    // Always fetch latest data from the ref if not explicitly overridden (fixes stale closure)
    const weather = overrideWeather || stateRef.current.weatherData[region.id] || INITIAL_WEATHER[region.id];
    const social = stateRef.current.socialSignals[region.id] || [];
    
    const assessment = await analyzeRegionRisk(region, weather, social);
    
    setState(prev => ({
      ...prev,
      isAnalyzing: false,
      assessments: {
        ...prev.assessments,
        [region.id]: assessment
      }
    }));
  }, []); // Empty deps because we rely on stateRef

  const handleAddRegion = async (name: string, district: string, stateName: string) => {
    setState(prev => ({ ...prev, isGeocoding: true }));
    
    try {
      const geo = await geocodeMicroRegion(name, district, stateName);
      
      const newRegion: Region = {
        id: `r-${Date.now()}`,
        name,
        district,
        state: stateName,
        type: 'Village',
        lat: geo.lat,
        lng: geo.lng,
        population: geo.population || 500
      };

      const initialWeather = generateMockWeather(geo.lat);

      setState(prev => ({
        ...prev,
        regions: [newRegion, ...prev.regions],
        selectedRegionId: newRegion.id,
        weatherData: {
          ...prev.weatherData,
          [newRegion.id]: initialWeather
        },
        isGeocoding: false
      }));
      
      setIsModalOpen(false);
      
      // Pass initial data explicitly to the analysis call to bypass the state update delay
      setTimeout(() => runAnalysis(newRegion, initialWeather), 100);

    } catch (err) {
      console.error(err);
      setState(prev => ({ ...prev, isGeocoding: false }));
    }
  };

  useEffect(() => {
    if (Object.keys(state.assessments).length === 0) {
      runAnalysis();
    }
  }, [runAnalysis]);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <Sidebar 
        regions={state.regions}
        selectedRegionId={state.selectedRegionId}
        onSelectRegion={handleSelectRegion}
        onAddClick={() => setIsModalOpen(true)}
        assessments={state.assessments}
      />
      
      <MainDashboard 
        region={selectedRegion}
        weather={state.weatherData[selectedRegion.id]}
        social={state.socialSignals[selectedRegion.id] || []}
        assessment={state.assessments[selectedRegion.id] || null}
        isAnalyzing={state.isAnalyzing}
        onAnalyze={() => runAnalysis()}
      />

      <AddRegionModal 
        isOpen={isModalOpen}
        isLoading={state.isGeocoding}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddRegion}
      />
      
      {state.assessments[selectedRegion.id]?.riskLevel === 'High' && (
        <div className="fixed bottom-8 right-8 max-w-sm bg-red-600 text-white p-6 rounded-2xl shadow-2xl animate-bounce z-50">
          <div className="flex items-start space-x-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <div>
              <p className="font-black text-xs uppercase tracking-widest opacity-80">Local Risk Alert</p>
              <h5 className="font-bold text-lg leading-tight mt-1">{state.assessments[selectedRegion.id].humanReadableWarning}</h5>
              <p className="text-[10px] mt-2 opacity-70">Region: {selectedRegion.name}, {selectedRegion.district}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
