// routes/blogRoutes.js
const express = require("express");
const { createBlogPost, upload,deleteBlogPost,getUserBlogs,updateBlogPost } = require("../controllers/blogController");
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, upload.single("blogImage"), createBlogPost);
router.delete("/:id", authMiddleware, deleteBlogPost); // New route to delete a blog post by ID
router.get("/user-blogs", authMiddleware, getUserBlogs);
router.put("/update/:id", authMiddleware, upload.single("blogImage"), updateBlogPost);


module.exports = router;
