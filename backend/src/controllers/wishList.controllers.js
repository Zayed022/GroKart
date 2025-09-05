import { WishList } from "../models/wishList.models.js"

// ✅ Add item to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { customerId, itemName, price, description, image, notes, phone } = req.body;
    
    if (!customerId || !itemName) {
      return res.status(400).json({ error: "User ID and item name are required" });
    }

    const wishItem = await WishList.create({
      customerId,
      itemName,
      price,
      description,
      image,
      notes,
      phone
    });

    return res.status(201).json({
      success: true,
      message: "Item added to wishlist",
      data: wishItem,
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// ✅ Get all wishlist items for a user
export const getUserWishlist = async (req, res) => {
  try {
    const userId = req.user?._id || req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const wishlist = await WishList.find({ userId }).populate("productId");

    return res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// ✅ Remove item from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedItem = await WishList.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found in wishlist" });
    }

    return res.status(200).json({
      success: true,
      message: "Item removed from wishlist",
    });
  } catch (error) {
    console.error("Error removing wishlist item:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// ✅ Optional: Update wishlist item
export const updateWishlistItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { itemName, price, description, image } = req.body;

    const updatedItem = await WishList.findByIdAndUpdate(
      id,
      { itemName, price, description, image },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Wishlist item updated",
      data: updatedItem,
    });
  } catch (error) {
    console.error("Error updating wishlist item:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const getAllWishList = async (req, res) => {
  try {
    const wishList = await WishList.find()
      .select("customerId itemName price description image phone notes createdAt updatedAt");

    res.status(200).json(wishList);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ message: "An error occurred while fetching wishlist." });
  }
};

