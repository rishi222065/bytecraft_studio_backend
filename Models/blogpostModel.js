// models/BlogPost.js
const mongoose = require("mongoose");

const BlogPostSchema = new mongoose.Schema({
  blogName: { type: String, required: true },
  blogAuthor: { type: String, required: true },
  blogDescription: { type: String, required: true },
  category:{type:String,require:true},
  
  blogImage: { type: String },
  uploadedBy: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  },
}, { timestamps: true });

module.exports = mongoose.model("BlogPost", BlogPostSchema);
