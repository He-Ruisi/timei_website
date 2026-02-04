import { GoogleGenAI, Type } from "@google/genai";
import { TrackerType } from "../types";

// Helper to ensure we have a key (though the prompt guarantees process.env.API_KEY)
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing!");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const breakDownGoal = async (goalText: string) => {
  const ai = getClient();
  
  const prompt = `
    User Goal: "${goalText}"
    
    Please break this goal down into 3-5 actionable sub-tasks.
    For each task, recommend the best "Tracker Type" from the following list:
    - TIMER (for tasks measured by time duration, e.g., reading, coding, running)
    - COUNTER (for tasks measured by count, e.g., pushups, glasses of water)
    - CHECKBOX (for one-off completion tasks, e.g., call mom, buy milk)
    - PROGRESS (for percentage based tasks, e.g., finish book chapter)
    
    Return the result as a JSON array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "The task title" },
              recommendedTracker: { 
                type: Type.STRING, 
                enum: [TrackerType.TIMER, TrackerType.COUNTER, TrackerType.CHECKBOX, TrackerType.PROGRESS],
                description: "The recommended tracker type"
              }
            },
            required: ["title", "recommendedTracker"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as { title: string; recommendedTracker: TrackerType }[];
  } catch (error) {
    console.error("Gemini breakdown failed:", error);
    return [];
  }
};
