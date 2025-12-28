
import { GoogleGenAI, Type } from "@google/genai";

export interface GeoResult {
  lat: number;
  lng: number;
  population: number;
  valid: boolean;
}

export const geocodeMicroRegion = async (name: string, district: string, state: string): Promise<GeoResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Find the precise latitude, longitude, and estimated population for the village/town: ${name}, District: ${district}, State: ${state}.
  Format the response as JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lat: { type: Type.NUMBER },
            lng: { type: Type.NUMBER },
            population: { type: Type.NUMBER },
            valid: { type: Type.BOOLEAN }
          },
          required: ["lat", "lng", "population", "valid"]
        }
      },
    });

    const result = JSON.parse(response.text);
    return result;
  } catch (error) {
    console.error("Geocoding Error:", error);
    // Return a default if search fails, though in real app we'd handle error
    return { lat: 17.3850, lng: 78.4867, population: 1000, valid: false };
  }
};

export const generateMockWeather = (lat: number): any => {
  // Simple deterministic pseudo-random weather based on coordinates for demo
  const seed = Math.abs(lat);
  return {
    temperature: Math.floor(25 + (seed % 15)),
    rainfall: Math.floor((seed * 10) % 100),
    humidity: Math.floor(40 + (seed % 50)),
    windSpeed: Math.floor(5 + (seed % 30)),
    timestamp: new Date().toISOString()
  };
};
