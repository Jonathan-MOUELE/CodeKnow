import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export interface MentorFeedback {
  analysis: string;
  example: string;
  usage: string;
  trap: string;
  seniorTip: string;
  isCorrect: boolean;
  xpReward: number;
}

export async function getMentorFeedback(
  mentorName: string,
  specialty: string,
  personality: string,
  questTitle: string,
  questDescription: string,
  userSubmission: string,
  language: string = 'fr'
): Promise<MentorFeedback> {
  const lang = language === 'fr' ? 'French' : 'English';
  const systemInstruction = `You are ${mentorName}, a Senior Mentor at CodeKnow RPG Academy.
Specialty: ${specialty}. Personality: ${personality}.
ALWAYS respond entirely in ${lang}.
Quest: "${questTitle}". Description: ${questDescription}.
Evaluate the student's code in a "Retro RPG Hacker" style — sharp, direct, character-appropriate.
Structure: 1) ANALYSIS: simple analogy of what the code does. 2) CONCRETE EXAMPLE: clean modern snippet.
3) PROD_VIEW: real-world use case. 4) TRAP: common beginner mistake. 5) SENIOR_TIP: interview golden rule.
Determine isCorrect (boolean) and xpReward (10-100 based on quality and correctness).`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: userSubmission,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysis: { type: Type.STRING },
          example: { type: Type.STRING },
          usage: { type: Type.STRING },
          trap: { type: Type.STRING },
          seniorTip: { type: Type.STRING },
          isCorrect: { type: Type.BOOLEAN },
          xpReward: { type: Type.NUMBER }
        },
        required: ["analysis", "example", "usage", "trap", "seniorTip", "isCorrect", "xpReward"]
      }
    }
  });

  return JSON.parse(response.text || "{}") as MentorFeedback;
}
