import { getRecommendations } from "../utils/aiRecommendation.utils.js";

export const recommendProducts = async (req, res) => {
  try {
    const { customerId } = req.body;
    if (!customerId) {
      return res.status(400).json({ error: "customerId is required" });
    }

    const recommendations = await getRecommendations(customerId);

    return res.json({
      message: recommendations.length
        ? "Here are some items you might like 🛒"
        : "No new recommendations at the moment.",
      recommendations,
    });
  } catch (error) {
    console.error("Recommendation API Error:", error);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
};
