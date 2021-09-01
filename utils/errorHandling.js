const dotenv=require("dotenv");
dotenv.config("../config.env");
const {MODE}=process.env


const sendError=(req,res,error)=>{
    return res.status(error.status).json({
        name:error.name,
        isOperational: error.isOperational,
        message: error.description,
        error:error.error,
        ...(MODE==="DEVELOPMENT") && {Stack:error.stack},
      });
}


const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    return message = `Duplicate field value: ${value}. Please use another value!`;
};

const handleCastErrorDB = err => {
    return `Invalid ${err.path}: ${err.value}.`;
};
  

  
const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    return  `Invalid input data. ${errors.join('. ')}`;
};
  

const handleJWTExpiredError = () =>{
    return 'Your token has expired! Please log in again.'
}

class GlobalErrorhandling extends Error {
    
    constructor({name, status,  isOperational,description,error}) {
        super(description);
        this.name = name;
        this.status =status;
        this.isOperational = isOperational;
        if(error.code){
            switch(error.code){
                case 11000:{
                    this.error = handleDuplicateFieldsDB(error);
                    break;
                }
                default:{
                    this.error="Unknown code error"
                }   
            }
        }else if(error.name){
            switch(error.name){
                case "ValidationError":{
                    this.error = handleValidationErrorDB(error);
                    break;
                }
                case "TokenExpiredError":{
                    this.error =  handleJWTExpiredError();
                    break;
                }
                case "CastError":{
                    this.error = handleCastErrorDB(error);
                    break;
                }
                default:{
                    this.error=error.name
                }
            }
        }else{
            this.error=error
        }
        Error.captureStackTrace(this);
    }
   
}





module.exports = {
    GlobalErrorhandling,
    sendError,
}


