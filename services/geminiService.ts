import { GoogleGenAI, Type } from "@google/genai";
import { VisitorFormData, GeneratedContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWelcomeAndPrayer = async (data: VisitorFormData): Promise<GeneratedContent> => {
  const model = 'gemini-2.5-flash';

  const prompt = `
    A new visitor named ${data.firstName} ${data.lastName} has just filled out a connection card for our church.
    
    Details:
    - Age Group: ${data.ageRange}
    - Location: ${data.cityStateZip}
    - Membership Interest: ${data.membershipInterest}
    - Prayer Request: "${data.prayerRequest}"

    Please generate two things in JSON format:
    1. "welcomeMessage": A warm, personalized short paragraph welcoming them to the church. Mention their interest in membership if it is 'yes' or 'maybe'. Keep it friendly and inviting.
    2. "prayer": A short, specific prayer based on their prayer request. If the request is generic, write a blessing over their life and family.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            welcomeMessage: { type: Type.STRING },
            prayer: { type: Type.STRING },
          },
          required: ["welcomeMessage", "prayer"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No content generated");
    }

    return JSON.parse(text) as GeneratedContent;
  } catch (error) {
    console.error("Error generating content:", error);
    // Fallback in case of API error
    return {
      welcomeMessage: `Welcome, ${data.firstName}! We are so glad you chose to worship with us today.`,
      prayer: "Lord, we ask for your blessing upon this visitor. Meet their needs and guide their steps. Amen.",
    };
  }
};
