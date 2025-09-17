import { MobileBanner } from "../models/mobileBanner.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addBanner = async (req, res) => {
  const {
    title,
    redirectUrl,
    isActive,
  } = req.body;
  if (!title || !redirectUrl) {
      return res.status(400).json({ message: "Title and Redirect URL are required" });
    }
 
  const imageLocalPath = req.files?.image[0]?.path;
  console.log(imageLocalPath);
  if (!imageLocalPath) {
    return res.status(400).json({ message: "Image file is required" });
  }
  const image = await uploadOnCloudinary(imageLocalPath);
if (!image) {
  return res.status(400).json({ message: "Image file is required" });
}

const banner = await MobileBanner.create({
  title,
  redirectUrl,
  isActive: isActive || false,
  image: image.secure_url,   // ✅ always https
});

  const createdBanner = await MobileBanner.findById(banner._id).select("");
  if (!createdBanner) {
    return res.status(500).json({ message: "Something went wrong" });
  }
  return res.status(201).json({
    createdBanner,
    message: "Banner created successfully",
  });
};

const getActiveBanners = async (req, res) => {
  try {
    const banners = await MobileBanner.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: "Error fetching banners", error });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await MobileBanner.findByIdAndDelete(id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.status(200).json({ message: "Banner deleted" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting banner", error });
  }
};

const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await MobileBanner.findByIdAndUpdate(id, req.body, { new: true });
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.status(200).json(banner);
  } catch (error) {
    res.status(400).json({ message: "Error updating banner", error });
  }
};


export {
    addBanner,
    getActiveBanners,
    deleteBanner,
    updateBanner
}