const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {Blog}=require("./blogModel")
const bcrypt=require("bcrypt");

let userSchema = new Schema({
    userId:{
        type:String,
        unique:true,
        required:[true,"UserId should be provided"]
    },
    profilepic:{
        type:String,
        default:""
    },
    name: {
        type: String,
        minLength:[3,"Name has to be greater than 3"]
    },
    email: {
        type: String,
        unique: true,
        validate:{
            validator:function(v){
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v)
            },
            message:props=>`${props.value} is not a valid email id `
        }
    },
    password: {
        type: String,
        required:true
    },
    confirmPassword:{
        type:String,
        required:true
    },
    blogs:{
        type: [{ type: Schema.Types.ObjectId, ref: 'Blog' }],
        default:[]
    }
})



userSchema.pre('save',async function(next){
    // this --> current document
    // this.isModified("password")
    if(this.password!==this.confirmPassword){
        console.log("Confirm password and password not same");
        return next(new Error())
    }

    try{
        if (this.password && this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, 10);
        }

    // to not save confirm password in our schema
    this.confirmPassword=undefined;
    next();
    }catch(error){
        console.log(error);
        return error
    }
    
})

userSchema.post('save',function(){
    console.log("Data is Saved");
})


//Compare password in database
userSchema.methods.comparePassword = async function(enterPassword){
    return await bcrypt.compare(enterPassword, this.password);
}






module.exports = {
    "User":mongoose.model('User', userSchema)
}