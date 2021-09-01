const { response } = require("express");
const express=require("express");
const router=express.Router();
const {createBlog,getBlogById,deleteBlogById,getBlogs,updateBlogById}=require("../controllers/blogController")
const {imageUpload}=require("../middlewares/imageupload")
const auth=require("../middlewares/authvalidation")
const requestvalidation=require("../middlewares/requestvalidation")

router.route('/')
.post([auth,imageUpload.single('blogImage'),requestvalidation,createBlog])
.get([getBlogs])
router.route("/:id")
.get([getBlogById])
.delete([auth,deleteBlogById])
.patch([auth,imageUpload.single('blogImage'),requestvalidation,updateBlogById])


module.exports=router