const mongoose = require("mongoose");
const Schema=mongoose.Schema
const User=require("./userModel")
const blogSchema = new Schema({
  blogId: {
    type: String,
    required: true,
    unique: true,
  },
  author:{
      type:String, 
      required:[true,"Author name should be provided"],
      minlength:[4,"Author name should be atleast 4"]

  },
  createdAt: {
      type:Date,
  },
  tags:{
      type:[String],
      default:[]
  },
  blogTitle: {
    type: String,
    required: true,
    minlength:[4,"blogTitle length should atleast 4"]
  },
  blogContent: {
    type: String,
    required: true,
    minlength:[10,"COntent  should be atleast 10  characters"]
  },
  blogImage: {
    type: String,
  },
  updatedAt:{
    type:Date
  },
  relatedLinks:{
     type:[{
         title:{
             type:String,
             required:true
         },
         href:{
             type:String,
             required:true,
             validate: {
              validator: function(v){
                  return /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(v);
              },
              message: (props) => 'Please Enter a valid Reference Link',
          }
        },
        linkId:{
          type:String,
          default:"",
        }
     }],
     default:[]
  },
  userId:{
    type:String
  }
});

let Blog=mongoose.model('Blog',blogSchema)
module.exports={
  Blog
}

