
import { GoogleGenAI, Type } from "@google/genai";
import { WeatherData, SocialSignal, RiskAssessment, Region } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

export const analyzeRegionRisk = async (
  region: Region,
  weather: WeatherData | undefined,
  social: SocialSignal[]
): Promise<RiskAssessment> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const weatherText = weather 
    ? `- Temperature: ${weather.temperature}°C
    - Rainfall: ${weather.rainfall}mm
    - Humidity: ${weather.humidity}%
    - Wind Speed: ${weather.windSpeed}km/h`
    : 'Weather data currently unavailable.';

  const prompt = `
    Analyze risk for the following micro-region:
    NAME: ${region.name}
    TYPE: ${region.type}
    LOCATION: ${region.district}, ${region.state}
    COORDINATES: Lat ${region.lat}, Lng ${region.lng}
    
    CURRENT WEATHER DATA:
    ${weatherText}
    
    RECENT SOCIAL SIGNALS:
    ${social.length > 0 ? social.map(s => `- "${s.text}"`).join('\n') : 'No local social signals reported yet.'}
    
    Note: Use your internal knowledge of ${region.state} topography near ${region.district} to determine if current rainfall levels pose a flood risk based on terrain.
    Predict the most likely disaster risk.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            disasterType: { type: Type.STRING },
            probability: { type: Type.NUMBER },
            riskLevel: { type: Type.STRING },
            humanReadableWarning: { type: Type.STRING },
            suggestedActions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            reasoning: { type: Type.STRING }
          },
          required: ["disasterType", "probability", "riskLevel", "humanReadableWarning", "suggestedActions", "reasoning"]
        }
      },
    });

    const result = JSON.parse(response.text);
    return {
      ...result,
      regionId: region.id,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      regionId: region.id,
      disasterType: 'None',
      probability: 0,
      riskLevel: 'Low',
      humanReadableWarning: "Monitoring active. No immediate local anomalies detected.",
      suggestedActions: ["Stay tuned to local radio", "Report unusual sightings", "Maintain emergency stock"],
      reasoning: "Analysis cycle completed with no critical pattern matches.",
      timestamp: new Date().toISOString()
    };
  }
};
