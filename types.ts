
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type DisasterType = 'Flood' | 'Heatwave' | 'Storm' | 'None';

export interface WeatherData {
  temperature: number; // Celsius
  rainfall: number;    // mm/h
  humidity: number;    // %
  windSpeed: number;   // km/h
  timestamp: string;
}

export interface SocialSignal {
  id: string;
  text: string;
  location: string;
  timestamp: string;
  sentiment: 'Concerned' | 'Alert' | 'Normal';
}

export interface Region {
  id: string;
  name: string;
  district: string;
  state: string;
  type: 'Village' | 'Town' | 'Mandal';
  lat: number;
  lng: number;
  population: number;
}

export interface RiskAssessment {
  regionId: string;
  disasterType: DisasterType;
  probability: number; // 0-100
  riskLevel: RiskLevel;
  humanReadableWarning: string;
  suggestedActions: string[];
  reasoning: string;
  timestamp: string;
}

export interface AppState {
  regions: Region[];
  selectedRegionId: string | null;
  weatherData: Record<string, WeatherData>;
  socialSignals: Record<string, SocialSignal[]>;
  assessments: Record<string, RiskAssessment>;
  isAnalyzing: boolean;
  isGeocoding: boolean;
}
