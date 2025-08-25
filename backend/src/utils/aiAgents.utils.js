// src/services/aiAgent.service.js
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function chatWithAgent(userId, message) {
  const systemPrompt = `
    You are Grokart's AI Assistant. 
    Help users with order tracking, refunds, offers, and support.
    If user asks about order, call the order tool.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", 
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ]
  });

  return response.choices[0].message.content;
}
