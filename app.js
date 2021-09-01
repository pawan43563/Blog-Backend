const express=require("express");
const userRouter=require("./routes/userRouter")
const blogRouter=require("./routes/blogRouter")
const app=express()
const cors=require("cors")
const {cloudinaryConfig}=require("./config/cloudinaryConfig")

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors())
app.use(express.static('public'))
app.use('*',cloudinaryConfig)

app.use('/blogs',blogRouter)
app.use('/users',userRouter)



app.use(function (req, res) {
    res.status(404).json({
        "error":"Page not found"
    });
});



module.exports=app