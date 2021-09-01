const mongoose=require("mongoose")
const dotenv=require("dotenv")
dotenv.config({path:"./config.env"});
const app=require("./app")
const {DB_LOCAL}=process.env
mongoose.connect((DB_LOCAL), {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((connection)=>{
    console.log(("Succesfully connected to database"));
    app.listen(process.env.PORT || 3000,()=>{
        console.log("Server started in 3000");
    })
}).catch((err)=>{
    console.log("Error in connecting",err);
})    
