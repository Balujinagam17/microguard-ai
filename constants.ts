
import { Region, WeatherData, SocialSignal } from './types';

export const SYSTEM_INSTRUCTION = `You are an expert AI Disaster Scientist specializing in micro-region early warning systems. 
Your task is to analyze weather data and social media signals for a specific village/town to predict imminent natural disasters (Flood, Heatwave, Storm).

CRITICAL MISSION:
- Detect patterns before official city-level alerts are issued.
- Provide simple, human-readable warnings for villagers.
- Output high-confidence assessments based on limited data.
- IMPORTANT: Use regional context (District/State) to infer geographical risks (e.g., proximity to certain rivers or mountain ranges).

You will receive:
1. Current weather metrics.
2. Recent social signals (text posts with location).
3. Detailed micro-region metadata.

You MUST return a JSON object with:
- disasterType: "Flood", "Heatwave", "Storm", or "None"
- probability: Integer (0-100)
- riskLevel: "Low", "Medium", or "High"
- humanReadableWarning: A simple sentence a villager would understand.
- suggestedActions: Array of 3 short instructions.
- reasoning: Short explanation of why this risk was identified.`;

export const MOCK_REGIONS: Region[] = [
  { id: 'v1', name: 'Alakananda', district: 'Nellore', state: 'Andhra Pradesh', type: 'Village', lat: 17.3850, lng: 78.4867, population: 1200 },
  { id: 'v2', name: 'Krishna Puram', district: 'Guntur', state: 'Andhra Pradesh', type: 'Village', lat: 17.4000, lng: 78.5000, population: 850 },
  { id: 't1', name: 'Nagar Junction', district: 'Hyderabad', state: 'Telangana', type: 'Town', lat: 17.4200, lng: 78.5200, population: 15000 },
  { id: 'm1', name: 'Palle Mandal', district: 'Chittoor', state: 'Andhra Pradesh', type: 'Mandal', lat: 17.3500, lng: 78.4500, population: 45000 }
];

export const INITIAL_WEATHER: Record<string, WeatherData> = {
  'v1': { temperature: 28, rainfall: 45, humidity: 88, windSpeed: 12, timestamp: new Date().toISOString() },
  'v2': { temperature: 31, rainfall: 5, humidity: 45, windSpeed: 8, timestamp: new Date().toISOString() },
  't1': { temperature: 39, rainfall: 0, humidity: 20, windSpeed: 15, timestamp: new Date().toISOString() },
  'm1': { temperature: 26, rainfall: 120, humidity: 95, windSpeed: 45, timestamp: new Date().toISOString() }
};

export const MOCK_SOCIAL: Record<string, SocialSignal[]> = {
  'v1': [
    { id: 's1', text: 'The village stream is overflowing near the main bridge.', location: 'Alakananda', timestamp: '10 mins ago', sentiment: 'Alert' },
    { id: 's2', text: 'Water entering the fields from the uphill side.', location: 'Alakananda', timestamp: '2 mins ago', sentiment: 'Concerned' }
  ],
  'm1': [
    { id: 's3', text: 'Heavy wind just blew away three shed roofs.', location: 'Palle Mandal', timestamp: '5 mins ago', sentiment: 'Alert' },
    { id: 's4', text: 'Visibility is near zero with the rain.', location: 'Palle Mandal', timestamp: '1 min ago', sentiment: 'Alert' }
  ]
};
