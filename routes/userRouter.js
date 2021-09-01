const express=require("express");
const router=express.Router();
const auth=require("../middlewares/authvalidation")
const {login,register,getAlluser}=require("../controllers/userController");
const { imageUpload } = require("../middlewares/imageupload");
router.post('/register',[imageUpload.single('profilePic'),register]);
router.post('/login',login);
router.get('/',[getAlluser])

module.exports=router;

