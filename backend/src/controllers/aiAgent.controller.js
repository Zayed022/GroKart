import { handleOrderTracking } from "../utils/aiOrderTracking.utils.js";

export async function chatWithAgent(userId, message) {
  // Ensure message is always a string
  const userMessage = typeof message === "string" ? message : String(message);

  try {
    // Step 1: Detect order-related queriess
    if (userMessage.toLowerCase().includes("order")) {
      return await handleOrderTracking(userMessage);
    }

    // Step 2: Default AI reply
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are Grokart's helpful AI assistant." },
        { role: "user", content: userMessage }
      ],
    });

    return response.choices[0].message.content;

  } catch (error) {
    console.error("chatWithAgent error:", error);
    return "Oops! Something went wrong while processing your request.";
  }
}


export const chat = async (req, res) => {
  try {
    const { userId, message } = req.body;
    const reply = await chatWithAgent(userId, message);
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
