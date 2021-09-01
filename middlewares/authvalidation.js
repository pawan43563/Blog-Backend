const jwt = require("jsonwebtoken");
const dotenv=require("dotenv");
dotenv.config({path:"../config.env"});
const {GlobalErrorhandling,sendError}=require("../utils/errorHandling")
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded=jwt.verify(token, process.env.SECRET);
        req.user=decoded.userId
        req.name=decoded.name
        next();
    } catch (error) {
        return sendError(req,res,new GlobalErrorhandling(
            {
                name:"Authentication Failed",
                status:401,
                isOperational:true,
                error:"Please provide token to perform this action"
            }
        ))

    }
};