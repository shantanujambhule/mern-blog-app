import express from 'express'
import { addBlog, getAllBlogs, getBlogById, deleteBlogById, togglePublish, addComment, getBlogComments, generateContent } from '../controllers/BlogController.js';
import uplaod from '../middleware/multer.js';
import auth from '../middleware/auth.js';

const blogRouter = express.Router();

blogRouter.post("/add", uplaod.single("image"),auth, addBlog);
blogRouter.get("/all",  getAllBlogs);
blogRouter.get("/comments", getBlogComments)
blogRouter.get("/:blogId", getBlogById);
blogRouter.post("/delete",auth, deleteBlogById);
blogRouter.post("/toggle-publish", auth, togglePublish);
blogRouter.post("/add-comments", addComment);
blogRouter.post("/generate",auth, generateContent);



export default blogRouter;