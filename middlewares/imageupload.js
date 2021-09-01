const multer=require("multer");
const path=require("path")
const dotenv=require("dotenv")
const uniqid=require("uniqid");
const fs = require("fs");
dotenv.config({path:"../config.env"})
const {IMAGE_STORAGE_TYPE}=process.env


const imageStorage= multer.diskStorage({    
  ...(IMAGE_STORAGE_TYPE==="LOCAL") && {destination:"images"},  
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '_' + uniqid()
         + path.extname(file.originalname))

    }
});
  

const imageUpload = multer({
    storage:imageStorage,
    limits: {
      fileSize: 1000000 // 1 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) { 
         return cb(new Error('Please upload only png and jpg image format'))
       }
     cb(undefined, true)
  }
}) 

module.exports={
    imageUpload
}