import { GoogleGenAI } from "@google/genai";
import ApiError from "../utils/ApiError.js";

const DEFAULT_MODEL = "gemini-2.5-flash";

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new ApiError(
      503,
      "Gemini is not configured. Add a NEW key as GEMINI_API_KEY in server/.env and restart the server."
    );
  }
  return new GoogleGenAI({ apiKey });
}

function parseJson(text) {
  const cleaned = String(text || "")
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  try {
    return JSON.parse(cleaned);
  } catch {
    throw new ApiError(502, "Gemini returned an invalid response. Please try again.");
  }
}

export function getGeminiStatus() {
  return {
    configured: Boolean(process.env.GEMINI_API_KEY?.trim()),
    model: process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL,
  };
}

export async function generateNotice({
  topic,
  language = "bilingual",
  tone = "official",
}) {
  const safeTopic = String(topic || "").trim().slice(0, 600);
  if (safeTopic.length < 5) {
    throw new ApiError(400, "Please enter at least 5 characters for the notice topic.");
  }

  const ai = getClient();
  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  const prompt = `
You are the official writing assistant for Rurally Smile Foundation's
"Pratibha Khoj Competition 2026" online exam portal in Siwan, Bihar.

Write a concise, factual ${tone} portal notice about:
${safeTopic}

Language mode: ${language}.
Rules:
- Do not invent dates, phone numbers, fees, results, people, or promises.
- If a required fact is missing, write a neutral placeholder in square brackets.
- Keep the description under 140 words.
- For bilingual mode, write clear Hindi first and then simple English.
- Return JSON only with exactly these string fields:
  "title", "titleHindi", "description".
`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.35,
        maxOutputTokens: 1200,
        thinkingConfig: { thinkingBudget: 0 },
        responseMimeType: "application/json",
        responseJsonSchema: {
          type: "object",
          additionalProperties: false,
          required: ["title", "titleHindi", "description"],
          properties: {
            title: { type: "string" },
            titleHindi: { type: "string" },
            description: { type: "string" },
          },
        },
      },
    });
    const generated = parseJson(response.text);
    return {
      title: String(generated.title || "").trim().slice(0, 180),
      titleHindi: String(generated.titleHindi || "").trim().slice(0, 180),
      description: String(generated.description || "").trim().slice(0, 2500),
      model,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    const message = String(error?.message || "");
    if (/API_KEY|api key|401|403/i.test(message)) {
      throw new ApiError(
        503,
        "Gemini authentication failed. Revoke the exposed key, create a new key, and update GEMINI_API_KEY in server/.env."
      );
    }
    if (/quota|429|rate/i.test(message)) {
      throw new ApiError(429, "Gemini free quota is temporarily exhausted. Try again later.");
    }
    throw new ApiError(502, `Gemini request failed: ${message || "Unknown error"}`);
  }
}

export default {
  getGeminiStatus,
  generateNotice,
};
