import express from "express";
import { v2 as cloudinaryV2 } from "cloudinary";
import multer from "multer";
import UserSchema from "../Schemas/UserSchema.js"
import { addComment, DraftBlog, getBlog, getBlogData, getCommentData, getSpecificTag, isLikedByUser, PublishBlog, trendingBlog, updateLike } from "../Components/BlogController.js";
const blogRouter = express.Router();

// Configure Cloudinary
cloudinaryV2.config({
    cloud_name: "doczqznfj",
    api_key: "331487941319189",
    api_secret: "ZxPE3EDiA6M8dnsv8TiI3bRHqjE",
  });
  
  // Configure Multer for memory storage
  const upload = multer({ storage: multer.memoryStorage() });
  
  // Upload blog banner route
  blogRouter.post("/upload-blog-banner/:userId", upload.single("image"), async (req, res) => {
    try {
      const userId = req.params.userId; // Assuming userId is actually the email
      console.log("User Email:", userId);
  
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
      }
  
      // Convert buffer to base64
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  
      // Upload image to Cloudinary with timeout settings
      const result = await cloudinaryV2.uploader.upload(base64Image, {
        folder: "MentalHEalthBlogUpload",
        timeout: 60000, // Set timeout to 60 seconds (adjust as needed)
      });
  
      // Save the URL in the database
      const updatedUser = await UserSchema.findOneAndUpdate(
        { _id:userId},
        { "blog_data.Banner_image": result.secure_url },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found." });
      }
  
      res.status(200).json({
        message: "Blog banner uploaded successfully.",
        bannerImageUrl: result.secure_url,
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error uploading blog banner:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  });
  blogRouter.post("/createBlog",PublishBlog);
  blogRouter.post("/createDraft",DraftBlog);
  blogRouter.post("/getBlog",getBlog);
  blogRouter.get("/trendingBlog",trendingBlog);
  blogRouter.post("/isLikedUser",isLikedByUser);
  blogRouter.post("/getBlogData",getBlogData);
  blogRouter.post("/getCommentData",getCommentData);
  blogRouter.post("/addComment",addComment);
  blogRouter.post("/updateLike",updateLike);
  blogRouter.post("/getSpecificTag",getSpecificTag);
  export default blogRouter;