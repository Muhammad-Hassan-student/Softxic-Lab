import express from "express";
import { upload } from "../config/cloudinary.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Upload image to Cloudinary
router.post("/upload", verifyToken, upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.status(200).json({
      success: true,
      url: req.file.path,
      public_id: req.file.filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Image upload failed" });
  }
});

// Delete image from Cloudinary
router.delete("/delete/:publicId", verifyToken, async (req, res) => {
  try {
    const { publicId } = req.params;
    await cloudinary.uploader.destroy(publicId);
    res.status(200).json({ success: true, message: "Image deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Image deletion failed" });
  }
});

export default router;
