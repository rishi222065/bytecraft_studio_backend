// controllers/blogController.js
const BlogPost = require("../Models/blogpostModel");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

  
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});


const upload = multer({ storage });

// Create a new blog post
const createBlogPost = async (req, res) => {
  try {
    // console.log("Request Body:", req.body); 
    // console.log("Uploaded File:", req.file); 
    console.log("User from middleware:", req.user); // Debug statement

    const { blogName, blogAuthor, blogDescription,category } = req.body;
    const blogImage = req.file ? req.file.path : null;
    const userId = req.user.userId;

    const newBlogPost = new BlogPost({
      blogName,
      blogAuthor,
      blogDescription,
      blogImage,
      category,
      uploadedBy: {
        id: userId
       
      }, // assuming the user id is in the token payload
    });

    await newBlogPost.save();
    res.status(201).json({ message: "Blog post created successfully", blog: newBlogPost });
  } catch (error) {
    res.status(500).json({ message: "Error creating blog post", error: error.message });
  }
};

const deleteBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlogPost = await BlogPost.findByIdAndDelete(id);

    if (!deletedBlogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.status(200).json({ message: "Blog post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog post", error: error.message });
  }
};

const getUserBlogs = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming userId is stored in req.user by authMiddleware

    // Find all blog posts where `uploadedBy.id` matches the logged-in user's ID
    const userBlogs = await BlogPost.find({ "uploadedBy.id": userId });

    if (!userBlogs || userBlogs.length === 0) {
      return res.status(404).json({ message: "No blog posts found for this user" });
    }

    res.status(200).json({ blogs: userBlogs });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving blog posts", error: error.message });
  }
};
  
const updateBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { blogName, blogAuthor, blogDescription,category } = req.body;
    const blogImage = req.file ? req.file.path : null;
    const userId = req.user.userId; // Get the user ID from auth middleware

    // Find the blog post by ID
    const blogPost = await BlogPost.findById(id);

    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    // Check if the logged-in user is the creator of the blog post
    if (blogPost.uploadedBy.id.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to edit this blog post" });
    }

    // Update blog fields
    blogPost.blogName = blogName || blogPost.blogName;
    blogPost.blogAuthor = blogAuthor || blogPost.blogAuthor;
    blogPost.blogDescription = blogDescription || blogPost.blogDescription;
    blogPost.category = category || blogPost.category;
    // Update the blog image if a new one is provided
    if (blogImage) {
      blogPost.blogImage = blogImage;
    }

    // Save the updated blog post
    await blogPost.save();
    res.status(200).json({ message: "Blog post updated successfully", blog: blogPost });
  } catch (error) {
    res.status(500).json({ message: "Error updating blog post", error: error.message });
  }
};

module.exports = { createBlogPost, upload,deleteBlogPost,getUserBlogs ,updateBlogPost};
