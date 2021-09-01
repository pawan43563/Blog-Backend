const {sendError,GlobalErrorhandling}=require("../utils/errorHandling")

module.exports=(req,res,next)=>{
    Validkeys=["author","blogImage","blogContent","blogTitle","relatedLinks","tags"]
    if(req.method==="PATCH"){
        if(req.body.blogId || req.body.createdAt || req.body.userId){
            return sendError(req,res,new GlobalErrorhandling(
                {
                    name:'Invalid request',
                    status:404,
                    isOperational:true,
                    error: `Cannot Change unique value`
                }
            ))
        }
        Validkeys.push("updatedAt")
    }else{
        Validkeys.push("createdAt")
    }
    let flag=Object.keys(req.body).some((key)=>{
        return !Validkeys.includes(key)
    })
    if(flag){
        return sendError(req,res,new GlobalErrorhandling(
            {
                name:'Invalid request',
                status:404,
                isOperational:true,
                error: `Please Enter Valid Keys`
            }
        ))
    }
    
    next()
}