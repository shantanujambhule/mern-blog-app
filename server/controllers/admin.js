import jwt from 'jsonwebtoken'
import Blog from '../models/Blog.js';
import Comment from '../models/comment.js';

export const adminLogin = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD){
            return res.json({success: false, message: 'Invalid email or password'})
        }
        const token = jwt.sign({email}, process.env.JWT_SECRET)
        return res.json({success: true, token, message: 'Admin logged in'})
    
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const getAllBlogsAdmin = async (req, res) => {
    try {
        const blogs = await Blog.find({}).sort({createdAt: -1});
        res.json({success: true, blogs})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find({}).populate('blog').sort({createdAt: -1});
        res.json({success: true, comments})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const getDashboard = async (req, res) => {
    try {
        const recentBlogs = await Blog.find().sort({createdAt: -1}).limit(5);
        const blogs = await Blog.countDocuments();
        const comments = await Comment.countDocuments();
        const drafts = await Blog.countDocuments({isPublished: false});
        const dashboardData = { recentBlogs, blogs, comments, drafts};

        res.json({success: true, dashboardData})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const deleteCommentById = async (req, res) => {
    try {
        const { id } = req.body;
        await Comment.findByIdAndDelete(id);
        res.json({success: true, message: 'Comment deleted'})
    }catch (error){
        res.json({success: false, message: error.message})
    }
    } 

export const approveComment = async (req, res) => {
  try {
    const { id } = req.body;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    comment.isApproved = true;
    await comment.save();

    res.json({ success: true, message: 'Comment approved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};