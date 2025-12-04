import { GoogleGenAI, Type } from "@google/genai";
import { HookRequest, GeneratedHook } from "../types";

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found in environment");
  return new GoogleGenAI({ apiKey });
};

export const generateHooks = async (req: HookRequest): Promise<GeneratedHook[]> => {
  const ai = getAI();
  
  let toneInstruction = "The hooks should be: Emotional, curiosity-building, or pattern-interrupting.";
  if (req.thunderMode) {
    toneInstruction = "THUNDER MODE ACTIVE: The hooks must be EXTREMELY HIGH-ENERGY, SHOCKING, CONTROVERSIAL, and AGGRESSIVE. Use psychological triggers that make it impossible to scroll past. Focus on intensity and immediate impact.";
  }

  const prompt = `
    Generate 10 to 15 viral social media hooks for a video with the following details:
    - Topic: ${req.topic}
    - Category: ${req.category}
    - Target Audience: ${req.ageGroup}
    - Video Format: ${req.videoType}
    - Platform: ${req.platform}
    - Duration: ${req.length}
    - Language: ${req.language} (CRITICAL: Output MUST be in this language)

    ${toneInstruction}

    Optimized for the algorithm of ${req.platform}.
    Highly engaging and designed for maximum watch time.
    
    Return a JSON array of objects with 'text' (the hook itself), 'type' (e.g., emotional, curiosity, viral), and 'explanation' (brief reason why it works).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              type: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["text", "type"]
          }
        },
        systemInstruction: "You are a world-class social media strategist and viral content expert. Your only goal is to write hooks that stop the scroll.",
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    return JSON.parse(jsonText) as GeneratedHook[];
  } catch (error) {
    console.error("Error generating hooks:", error);
    throw error;
  }
};

export const editImage = async (imageFile: File, prompt: string): Promise<string> => {
  const ai = getAI();
  
  // Convert file to base64
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g. "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(imageFile);
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: imageFile.type,
              data: base64Data
            }
          },
          {
            text: `Edit this image based on the following instruction: ${prompt}. Return the edited image.`
          }
        ]
      }
    });

    // Check for inlineData (image) in response parts
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};