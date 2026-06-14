import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.AI_API_KEY || '';
const isOpenAI = apiKey.startsWith('sk-');

const config = {
  apiKey: apiKey,
};

if (!isOpenAI && apiKey) {
  config.baseURL = "https://generativelanguage.googleapis.com/v1beta/openai/";
}

const openai = new OpenAI(config);
const MODEL_NAME = isOpenAI ? "gpt-4o-mini" : "gemini-1.5-flash";


/**
 * Summarizes a government scheme into simple English and Hindi.
 */
export const summarizeScheme = async (rawText) => {
  try {
    const prompt = `
      Summarize the following government scheme into 2 sentences of simple English and 2 sentences of simple Hindi. 
      Focus on who is eligible and what the benefit is.
      Scheme text: ${rawText}
    `;

    const response = await openai.chat.completions.create({
      model: MODEL_NAME,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices[0].message.content;
    return {
      en: content.split('\n')[0] || "Summary in English",
      hi: content.split('\n')[2] || "Summary in Hindi"
    };
  } catch (error) {
    console.error('AI Summarization failed:', error);
    return {
      en: "Unable to generate summary at this time.",
      hi: "इस समय सारांश तैयार करने में असमर्थ।"
    };
  }
};

/**
 * Handles user queries about schemes.
 */
export const getAIResponse = async (query, contextSchemes = [], history = [], userProfile = null) => {
  try {
    const context = contextSchemes.map(s => `${s.title}: ${s.description.raw}`).join('\n');
    const profileContext = userProfile 
      ? `User Profile Context (use this to check eligibility): ${JSON.stringify(userProfile)}` 
      : "User profile not provided.";

    const systemPrompt = `
      You are BharatBenefit AI, a highly intelligent and helpful assistant for Indian citizens.
      Your job is to answer the user's question accurately based on the provided government schemes database context.
      Keep your answers concise, empathetic, and strictly factual. Use formatting (like bolding and bullet points) to make it easy to read.
      
      ${profileContext}

      Context Database Schemes:
      ${context}
    `;

    // Map history to OpenAI format
    const formattedHistory = history.map(h => ({
      role: h.role === 'assistant' ? 'assistant' : 'user',
      content: h.text
    }));

    const response = await openai.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        { role: "system", content: systemPrompt },
        ...formattedHistory,
        { role: "user", content: query }
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('AI Response failed:', error);
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later.";
  }
};
