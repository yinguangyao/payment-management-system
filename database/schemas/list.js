var mongoose=require('mongoose'),
	Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;
var ListSchemas=new mongoose.Schema({
	name:String,
	amount:Number,
	content:String,
	type:String,
	createAt:{
		type:Date,
		default:Date.now()
	},
	category: {			//和分类表关联
		type: ObjectId, 
		ref: 'Category'
	},
	comment:[{
		type:ObjectId,
		ref:"Comment"
	}]
});


ListSchemas.statics={
	fetchByTime:function(cb){
		return this.find({}).sort('createAt').exec(cb);
	},
	fetchByAmount:function(cb){
		return this.find({}).sort('amount').exec(cb);
	},
	findById:function(id,cb){
		return this.findOne({_id:id}).exec(cb);
	},
	delete:function(id,cb){
		return this.remove({_id:id}).exec(cb);
	}
};
module.exports=ListSchemas;