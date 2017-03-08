var mongoose=require("mongoose");
var UserSchemas=require('../schemas/user');
var User=mongoose.model("User",UserSchemas)
module.exports=User;