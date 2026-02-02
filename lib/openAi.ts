import { GoogleGenerativeAI } from "@google/generative-ai";
import https from "https";

/**
 * HTTPS Agent (optional – useful behind corp proxies / SSL inspection)
 */
const agent = new https.Agent({
  rejectUnauthorized: false, // ⚠️ set true in production
});

/**
 * Custom fetch (kept for parity with OpenAI setup)
 * Gemini SDK does not currently accept custom fetch,
 * but we keep this here in case you switch to REST later.
 */
const customFetch = (url: RequestInfo | URL, init?: RequestInit) => {
  return fetch(url, {
    ...init,
    // @ts-ignore Node.js specific
    agent: url.toString().startsWith("https") ? agent : undefined,
  });
};

/**
 * Gemini Client
 */
export const gemini = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY as string
);

/**
 * Markdown / Website / CSV Summarizer
 */
export async function summarizeMarkdown(markdown: string) {
  try {
    const model = gemini.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 900,
      },
    });

    const prompt = `
You are a data summarization engine for an AI chatbot.

Your task:
- Convert the input website markdown or text or csv files data into a CLEAN, DENSE SUMMARY for LLM context usage.

STRICT RULES:
- Output ONLY plain text (no markdown, no bullet points, no headings).
- Write as ONE continuous paragraph.
- Remove navigation, menus, buttons, CTAs, pricing tables, sponsors, ads, testimonials, community chats, UI labels, emojis, and decorative content.
- Remove repetition and marketing language.
- Keep ONLY factual, informational content that helps answer customer support questions.
- Do NOT copy sentences verbatim unless absolutely necessary.
- Compress aggressively while preserving meaning.
- The final output MUST be under 2000 words.

The result will be stored as long-term context for a chatbot.

INPUT:
${markdown}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return text.trim();
  } catch (error) {
    console.error("Error in summarizeMarkdown:", error);
    throw error;
  }
}

/**
 * Conversation History Summarizer
 */
export async function summarizeConversation(messages: any[]) {
  try {
    const model = gemini.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 500,
      },
    });

    const conversationText = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    const prompt = `
Summarize the following conversation history into a concise paragraph, preserving key details and user intent.
The final output MUST be under 2000 words.

CONVERSATION:
${conversationText}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return text.trim();
  } catch (error) {
    console.error("Error in summarizeConversation:", error);
    throw error;
  }
}
