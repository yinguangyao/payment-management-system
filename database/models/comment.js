var mongoose=require("mongoose");
var CommentSchemas=require('../schemas/comment');
var Comment=mongoose.model("Comment",CommentSchemas)
module.exports=Comment;