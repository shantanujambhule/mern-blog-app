import express from 'express'
import { adminLogin, approveComment, deleteCommentById, getAllBlogsAdmin, getAllComments, getDashboard } from '../controllers/admin.js';
import auth from '../middleware/auth.js';

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.get("/comments", auth, getAllComments);
adminRouter.get("/blogs", auth, getAllBlogsAdmin);
adminRouter.post("/delete-comment", auth, deleteCommentById);
adminRouter.post("/approve-comment", auth, approveComment);
adminRouter.get('/dashboard', auth, getDashboard);


export default adminRouter;