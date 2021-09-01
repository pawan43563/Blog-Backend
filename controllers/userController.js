const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {User} = require("../models/userModel");
const uniqid=require("uniqid")
const path=require("path")
const dotenv=require("dotenv");
dotenv.config({path:"../config.env"});
const {uploader}=require("cloudinary")
const {IMAGE_STORAGE_TYPE}=process.env;

const sendResponse=require("../utils/sendResponse")
const {GlobalErrorhandling,sendError}=require("../utils/errorHandling")
// Sign-up
const register=async (req,res)=>{
    try{
        const user = new User({
            userId:uniqid(),
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmPassword:req.body.confirmPassword,
        });
        const response=await user.save()
        return sendResponse({
            res,
            statusCode: 200,
            message: `Successfully Registered`,
            data:response
        });

    }catch(error){
        return sendError(req,res,new GlobalErrorhandling(
            {
                name:"Error while registration",
                status:404,
                isOperational:true,
                error:error
            }
        ))
    }
}


const getAlluser=async (req,res)=>{
    try{
        let data=await User.find()
        return sendResponse({
            res,
            statusCode: 200,
            message: `Successfully Fetched all the user data`,
            data:data
        });
    }catch(error){
        return sendError(req,res,new GlobalErrorhandling(
            {
                name:"Error while fetching all users",
                status:400,
                isOperational:true,
                error:error.message
            }
        ))
    }
}



const login=async(req,res)=>{
    try{
        let getuser=await (await User.findOne({email:req.body.email}))
        if(!getuser){
            return sendError(req,res,new GlobalErrorhandling(
                {
                    name:'Not Found',
                    status:404,
                    isOperational:true,
                    error: "Email Doesn't exist in our database"
                }
            ))
            
        }
        let response=await getuser.comparePassword(req.body.password);
        if(!response){
            return sendError(req,res,new GlobalErrorhandling(
                {
                    name: 'Wrong Password',
                    status:401,
                    isOperational:true,
                    error:  "Make sure you have entered the right Password"
                }
            ))
            
        }
        let jwtToken = await jwt.sign({
            email: getuser.email,
            userId: getuser.userId
        }, process.env.SECRET, {
            expiresIn: "24h"
        });
        let obj={
            token: jwtToken,
            expiresIn: "24h",
            msg: getuser
        }
        return sendResponse({
            res,
            statusCode: 200,
            message: `User Successfully logged In`,
            data:obj
        });

    }catch(error){
        return sendError(req,res,new GlobalErrorhandling(
            {
                name: 'Error while loggind',
                status:401,
                isOperational:true,
                error:  error.message
            }
        ))

    }
    

}







module.exports={
    login,
    register,
    getAlluser
}

