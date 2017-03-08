var mongoose=require("mongoose");
var CategorySchemas=require('../schemas/category');
var Category=mongoose.model("Category",CategorySchemas)
module.exports=Category;