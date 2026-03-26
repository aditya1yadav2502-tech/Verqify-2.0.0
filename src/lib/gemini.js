import { GoogleGenerativeAI } from "@google/generative-ai";

const getEnv = () => {
  try {
    return import.meta.env;
  } catch {
    return {};
  }
};

const env = getEnv();
const genAI = new GoogleGenerativeAI(env.VITE_GEMINI_API_KEY);

export async function analyzeEngineeringIdentity(repos) {
  const currentEnv = getEnv();
  if (!currentEnv.VITE_GEMINI_API_KEY) {
    console.warn("Gemini API key missing. Using fallback analysis.");
    return {
      personality: "An architecturally-minded engineer with a focus on scalable backend systems and robust DevOps practices.",
      dimensions: {
        Velocity: 85,
        Quality: 92,
        Collaboration: 78,
        Complexity: 88,
        Innovation: 82
      }
    };
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Analyze the following GitHub repository data for an engineer and generate a professional "Engineering Personality" description (2 sentences) and 5 "Dimension Scores" (0-100) for: Velocity, Quality, Collaboration, Complexity, Innovation.

    Repositories:
    ${repos.map(r => `- ${r.name}: ${r.description || 'No description'} (Primary language: ${r.language})`).join('\n')}

    Return ONLY a JSON object exactly like this:
    {
      "personality": "...",
      "dimensions": {
        "Velocity": 85,
        "Quality": 90,
        "Collaboration": 70,
        "Complexity": 80,
        "Innovation": 75
      }
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Clean JSON if needed (Gemini sometimes adds markdown blocks)
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      personality: "A versatile developer with a strong foundation in modern engineering principles.",
      dimensions: { Velocity: 70, Quality: 75, Collaboration: 70, Complexity: 70, Innovation: 70 }
    };
  }
}
