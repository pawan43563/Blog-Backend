const {Blog}=require("../models/blogModel")
const uniqid=require("uniqid")
const {uploader}=require("cloudinary")
const dotenv=require("dotenv")
const  {User}  = require("../models/userModel")
const fs=require("fs")
dotenv.config({path:"../config.env"})
const {IMAGE_STORAGE_TYPE}=process.env;
const {sendError,GlobalErrorhandling,NotFound}=require("../utils/errorHandling")
const sendResponse=require("../utils/sendResponse")
const { NOTFOUND } = require("dns")


const imageupload=async ({req_type,file,image})=>{
    if(image.length>1){
        if(req_type=="PATCH"){
            flag=image.includes('blogImage')
            if(flag){
                path=`./images/${image}`
                await fs.unlink(path, function (err) {

                    if (err){
                        return err
                    }
                });
            }else{
                try{
                    await uploader.destroy(image.split('.').slice(0, -1).join('.'))
                }catch(error){
                    return error
                }
            }
        }
    }
    switch(IMAGE_STORAGE_TYPE){
        case "CLOUD":{
            let result=await uploader.upload(file.path)
            let {public_id,format}=result
            return public_id+"."+format;
        
        }
        case "LOCAL":{
            return file.filename
        }
    }
}



const createBlog=async (req,res)=>{
    let {author,createdAt,blogContent,blogTitle,tags,relatedLinks}=req.body;
    let arrayofrelatedlinks=[]
    if(relatedLinks){
        JSON.parse(relatedLinks).forEach((element) => {
            arrayofrelatedlinks.push({
                title:element.title,
                href:element.href
            })
        })    
    }
    try{
        const blog=new Blog({
            blogId:uniqid(),
            author:author,
            createdAt:createdAt,
            blogTitle:blogTitle,
            blogContent:blogContent,
            tags:tags,
            relatedLinks:arrayofrelatedlinks ,
            updatedAt:"",
        })
        if(req.file){
            blog.blogImage=await imageupload({req_type:"PATCH",file:req.file,image:{}})
            if(!blog.blogImage){
                return sendError(req,res,new GlobalErrorhandling(
                    {
                        name:'Internal Server Error',
                        status:404,
                        isOperational:true,
                        error: `Error occured while uploading image in ${IMAGE_STORAGE_TYPE}`
                    }
                ))
            }
        }

        blog.userId=req.user
        let response=await blog.save()
        if(!response){
            return sendError(req,res,new GlobalErrorhandling(
                {
                    name:"Bad Request",
                    status:404,
                    isOperational:true,
                    error:"Invalid body"
                }
                
            ))
        }
        let updateuser=await User.findOneAndUpdate(
            {userId:req.user},
            {$push:{
                blogs:blog._id
            }}
        )
        return sendResponse({
            res,
            statusCode: 200,
            message: "Added Successfully",
            data:response
        });

    }catch(error){
        return sendError(req,res,new GlobalErrorhandling(
            {
                name:"Bad Request",
                status:404,
                isOperational:true,
                error:error
            }
            
        ))
    }
    
}


const getBlogs=async (req,res)=>{
    try{
        let response;
        Validkeys=["author","blogImage","updatedAt","blogContent","updatedAt","blogTitle","relatedLinks","tags"]
        flag=Object.keys(req.query).some((key)=>{
            return Validkeys.includes(key)
        })

        // check if only userid is present if yes instead of going through all the blogs and finding userid populate blogs through user
        if(Object.keys(req.query).includes("userId") && !flag){
            response=await User.find({userId:req.query.userId}).populate('blogs').select('blogs')
        }else{
            response=await Blog.find(req.query);   
        }
        if(!response.length){
            return sendResponse({
                res,
                statusCode: 200,
                message: "No Blog present in the database"
            });
        }
        return sendResponse({
            res,
            statusCode: 200,
            message: "Successfully fetched blogs with query given",
            data: response
        });
    }catch(error){
        return sendError(req,res,new GlobalErrorhandling(
            {
                name:"Bad Request",
                status:404,
                isOperational:true,
                error:error
            }
        ))
    }
}


const getBlogById=async (req,res,next)=>{
    try{
        let getblog=await Blog.findOne({blogId:req.params.id})
        if(!getblog){
            return sendError(req,res,new GlobalErrorhandling(
                {
                    name:'NOT FOUND',
                    status:404,
                    isOperational:true,
                    error:`Blog with an id: ${req.params.id} not found`
                }
            ))
        }
        return sendResponse({
            res,
            statusCode: 200,
            message: `Found Blog with an given id:${req.params.id}`,
            data: getblog
        });
    }catch(error){
        return sendError(req,res,new GlobalErrorhandling(
            {
                name:'Error while fetching blog by Id',
                status:404,
                isOperational:true,
                error:error
            }
        ))
    } 
}

const deleteBlogById=async (req,res,next)=>{
    try{
        let getbloguser=await Blog.findOne({blogId:req.params.id})
        if(!getbloguser){
            return sendError(req,res,new GlobalErrorhandling(
                {
                    name:'NOT FOUND',
                    status:404,
                    isOperational:true,
                    error:`Blog with an id: ${req.params.id} not found`
                }
            ))
        }
        if(getbloguser.userId!==req.user){
            return sendError(req,res,new GlobalErrorhandling(
                {
                    name:'UnAuthorized User',
                    status:401,
                    isOperational:true,
                    error:`You can't delete this blog as it not belongs to you.`
                }
            ))
        }
        let result=await Blog.deleteOne({blogId:req.params.id})
        return sendResponse({
            res,
            statusCode: 200,
            message: `Successfully Deleted blog with an id:${req.params.id}`,
        });
    }catch(error){
        console.log(error);
        return sendError(req,res,new GlobalErrorhandling(
            {
                name:`Error while deleting blog with an id:${req.params.id}`,
                status:404,
                isOperational:true,
                error:error
            }
        ))
    }
}


const updateBlogById=async (req,res)=>{
    try{        
        let getbloguser=await Blog.findOne({blogId:req.params.id})
        if(!getbloguser){
            return sendError(req,res,new GlobalErrorhandling({
                name:'NOT FOUND',
                status:404,
                isOperational:true,
                error:`Blog with an id: ${req.params.id} not found`
            }
            ))
        }
        if(getbloguser.userId!==req.user){
            return sendError(req,res,new GlobalErrorhandling(
                {
                    name:'UnAuthorized User',
                    status:401,
                    isOperational:true,
                    error: `You can't update this blog as it not belongs to you.`
                }
            ))
        }
        if(req.file){
            
            req.body.blogImage=await imageupload({req_type:"PATCH",file:req.file,image:getbloguser.blogImage})
            if(!req.body.blogImage){
                return sendError(req,res,new GlobalErrorhandling({
                    name:'Internal Server Error',
                    status:404,
                    isOperational:true,
                    error:  `Error occured while uploading image in ${IMAGE_STORAGE_TYPE}`
                }
                ))
            }
        }
        let response=await Blog.findOneAndUpdate({blogId:req.params.id},{$set:req.body},
            {  runValidators:true})
        return sendResponse({
            res,
            statusCode: 200,
            message: `Successfully Updated Blog with id:${req.params.id}`,
        });

    }catch(error){
        return sendError(req,res,new GlobalErrorhandling(
            {
                name:`Error while updating blog with an id:${req.params.id}`,
                status:404,
                isOperational:true,
                error:error
            }
        ))
    }
}


module.exports={
    createBlog,
    getBlogById,
    deleteBlogById,
    getBlogs,
    updateBlogById
}