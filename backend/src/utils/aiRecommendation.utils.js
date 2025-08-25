import { Order } from "../models/order.models.js";
import { Product } from "../models/product.models.js";
import { User } from "../models/user.models.js";

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export async function getRecommendations(customerId) {
  try {
    const user = await User.findById(customerId);
    if (!user) return [];

    // 1️⃣ Collect categories from past orders
    const pastOrders = await Order.find({ customerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("items.productId");

    let purchasedMiniCategories = new Set();
    pastOrders.forEach(order => {
      order.items.forEach(item => {
        if (item.productId?.miniCategory) {
          purchasedMiniCategories.add(item.productId.miniCategory.toLowerCase());
        }
      });
    });

    // 2️⃣ Time-of-day based categories
    const timeOfDay = getTimeOfDay();
    let suggestedMiniCategories = [];
    if (timeOfDay === "morning") {
      suggestedMiniCategories.push("Daal", "Bread", "Eggs"); 
    } else if (timeOfDay === "evening") {
      suggestedMiniCategories.push("Snacks", "Cold Drinks");
    }

    // 3️⃣ User’s explicit preferences
    if (user.preferredCategories.length > 0) {
      suggestedMiniCategories.push(...user.preferredCategories);
    }

    // 4️⃣ Cross-sell from last purchase
    if (pastOrders.length > 0) {
      const lastOrder = pastOrders[0];
      lastOrder.items.forEach(item => {
        const miniCat = item.productId?.miniCategory?.toLowerCase();
        if (miniCat?.includes("bread")) {
          suggestedMiniCategories.push("Bananas", "Butter");
        }
        if (miniCat?.includes("milk")) {
          suggestedMiniCategories.push("Cornflakes");
        }
      });
    }

    // Remove already purchased categories
    suggestedMiniCategories = suggestedMiniCategories.filter(
      s => !purchasedMiniCategories.has(s.toLowerCase())
    );

    // 5️⃣ Fetch products
    let products = [];
    if (suggestedMiniCategories.length > 0) {
      products = await Product.find({
  miniCategory: { $in: suggestedMiniCategories.map(c => c.toLowerCase()) },
  price: { $lte: user.maxBudget },
  stock: { $gt: 0 },
}).limit(5);

    }

    // 6️⃣ Fallback → latest popular products
    if (products.length === 0) {
      products = await Product.find({ stock: { $gt: 0 } })
        .sort({ createdAt: -1 })
        .limit(5);
    }

    return products.map(p => ({
      id: p._id,
      name: p.name,
      miniCategory: p.miniCategory,
      price: p.price,
      description: p.description,
    }));
  } catch (error) {
    console.error("Recommendation Error:", error);
    return [];
  }
}
